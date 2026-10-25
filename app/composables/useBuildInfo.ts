export const SOURCE_URL = 'https://github.com/kashalls/ok8.sh'

/** The commit this deployment was built from (see `build` in nuxt.config). */
export const useBuildInfo = () => {
    const { sha, ref, time } = useRuntimeConfig().public.build
    return {
        sha,
        shortSha: sha.slice(0, 7),
        ref,
        time: new Date(time),
        commitUrl: sha ? `${SOURCE_URL}/commit/${sha}` : SOURCE_URL,
    }
}
