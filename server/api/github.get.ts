/**
 * Aggregates profile-wide GitHub stats via the public search + users APIs.
 *
 * Cached for an hour (with stale-while-revalidate), so GitHub is hit at most
 * ~once/hour regardless of traffic. A GITHUB_TOKEN bumps the rate limit further.
 */
const ONE_HOUR = 60 * 60

export default defineCachedEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const username = config.public.github
    const token = config.githubToken

    const headers: Record<string, string> = {
        'User-Agent': 'kashall.dev',
        Accept: 'application/vnd.github+json',
    }
    if (token) headers.Authorization = `Bearer ${token}`

    const count = async (q: string): Promise<number> => {
        const res = await $fetch<{ total_count: number }>('https://api.github.com/search/issues', {
            query: { q, per_page: 1 },
            headers,
        })
        return res.total_count ?? 0
    }

    // Let GitHub errors (e.g. rate limiting) throw: a thrown handler is NOT
    // cached, so we never persist an all-zero response. SWR keeps serving the
    // last good value until a fetch succeeds again.
    const [pullRequests, mergedPullRequests, issues, comments] = await Promise.all([
        count(`type:pr author:${username}`),
        count(`type:pr is:merged author:${username}`),
        count(`type:issue author:${username}`),
        count(`commenter:${username} -author:${username}`),
    ])

    const user = await $fetch<{ public_repos?: number; followers?: number; following?: number }>(
        `https://api.github.com/users/${username}`,
        { headers },
    ).catch(() => ({}))

    return {
        username,
        pullRequests,
        mergedPullRequests,
        issues,
        comments,
        repositories: user.public_repos ?? 0,
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        fetchedAt: new Date().toISOString(),
    }
}, {
    name: 'github-stats',
    getKey: () => 'stats',
    maxAge: ONE_HOUR,
    staleMaxAge: ONE_HOUR, // serve stale for up to another hour while revalidating
    swr: true,
})
