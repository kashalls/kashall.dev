/**
 * Profile stats, contribution calendar and language mix from one GraphQL
 * request (1 rate-limit point) plus two REST commit searches (GraphQL search
 * can't query commits), so it can be cached briefly and stay fresh.
 * GitHub's GraphQL API requires a token (NUXT_GITHUB_TOKEN).
 */
const HEATMAP_WEEKS = 18

const QUERY = /* GraphQL */ `
query ($login: String!, $prs: String!, $prsMonth: String!) {
  prs: search(query: $prs, type: ISSUE) { issueCount }
  prsMonth: search(query: $prsMonth, type: ISSUE) { issueCount }
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
    repositories(ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, first: 100) {
      nodes {
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name color } }
        }
      }
    }
  }
}`

interface Day { date: string; contributionCount: number; contributionLevel: string }
interface Response {
    data?: {
        prs: { issueCount: number }
        prsMonth: { issueCount: number }
        user: {
            contributionsCollection: { contributionCalendar: { weeks: { contributionDays: Day[] }[] } }
            repositories: {
                nodes: { languages: { edges: { size: number; node: { name: string; color: string | null } }[] } }[]
            }
        }
    }
    errors?: { message: string }[]
}

const LEVELS: Record<string, number> = {
    NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
}

export default defineCachedEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const username = config.public.github
    const monthStart = new Date().toISOString().slice(0, 8) + '01'

    const headers = {
        'User-Agent': 'kashall.dev',
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${config.githubToken}`,
    }
    const commitCount = async (q: string) =>
        (await $fetch<{ total_count: number }>('https://api.github.com/search/commits', {
            query: { q, per_page: 1 },
            headers,
        })).total_count

    // Let GitHub errors (e.g. rate limiting) throw: a thrown handler is NOT
    // cached, so we never persist an empty response. SWR keeps serving the
    // last good value until a fetch succeeds again.
    const [res, commits, commitsThisMonth] = await Promise.all([
        $fetch<Response>('https://api.github.com/graphql', {
            method: 'POST',
            headers,
            body: {
                query: QUERY,
                variables: {
                    login: username,
                    prs: `type:pr author:${username}`,
                    prsMonth: `type:pr author:${username} created:>=${monthStart}`,
                },
            },
        }),
        commitCount(`author:${username}`),
        commitCount(`author:${username} author-date:>=${monthStart}`),
    ])
    if (!res.data) throw createError({ statusCode: 502, message: res.errors?.[0]?.message ?? 'GitHub API error' })

    const { user } = res.data
    const days = user.contributionsCollection.contributionCalendar.weeks.flatMap(w => w.contributionDays)

    // Today only breaks the streak once it's over, so skip it while it's empty.
    let streak = 0
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i]!.contributionCount > 0) streak++
        else if (i !== days.length - 1) break
    }

    const sizes = new Map<string, { size: number; color: string | null }>()
    for (const repo of user.repositories.nodes) {
        for (const { size, node } of repo.languages.edges) {
            const entry = sizes.get(node.name) ?? { size: 0, color: node.color }
            entry.size += size
            sizes.set(node.name, entry)
        }
    }
    const totalSize = [...sizes.values()].reduce((sum, l) => sum + l.size, 0)
    const languages = [...sizes.entries()]
        .sort((a, b) => b[1].size - a[1].size)
        .slice(0, 5)
        .map(([name, l]) => ({ name, color: l.color, percent: totalSize ? (l.size / totalSize) * 100 : 0 }))

    return {
        username,
        pullRequests: res.data.prs.issueCount,
        pullRequestsThisMonth: res.data.prsMonth.issueCount,
        commits,
        commitsThisMonth,
        streak,
        weeks: user.contributionsCollection.contributionCalendar.weeks.slice(-HEATMAP_WEEKS).map(w =>
            w.contributionDays.map(d => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 })),
        ),
        languages,
        fetchedAt: new Date().toISOString(),
    }
}, {
    name: 'github-stats',
    getKey: () => 'stats',
    maxAge: 60,
    staleMaxAge: 60 * 60, // keep serving the last good value through GitHub outages
    swr: true,
})
