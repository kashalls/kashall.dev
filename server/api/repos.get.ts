/**
 * Star counts for the Work page's projects, from GitHub's REST API. Cached so
 * visitors share one fetch instead of each spending the rate limit; a token
 * (NUXT_GITHUB_TOKEN) raises the limit but isn't required.
 */
export default defineCachedEventHandler(async (event) => {
    const { githubToken } = useRuntimeConfig(event)
    const headers: Record<string, string> = { 'accept': 'application/vnd.github+json', 'user-agent': 'ok8.sh' }
    if (githubToken) headers.authorization = `Bearer ${githubToken}`

    const stars = await Promise.all(projects.map(({ repo }) =>
        $fetch<{ stargazers_count: number }>(`https://api.github.com/repos/${repo}`, { headers })
            .then(found => [repo, found.stargazers_count] as const)
            .catch(() => [repo, null] as const)))
    if (stars.every(([, count]) => count === null)) {
        throw createError({ statusCode: 502, message: 'GitHub is unreachable' })
    }
    return Object.fromEntries(stars) as Record<string, number | null>
}, {
    name: 'repos',
    getKey: () => 'stars',
    maxAge: 60 * 60,
    staleMaxAge: 24 * 60 * 60, // keep serving the last counts through GitHub outages
    swr: true,
})
