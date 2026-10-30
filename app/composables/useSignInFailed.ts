/**
 * Whether GitHub sign-in just bounced back here (server/routes/auth/github.get.ts
 * adds `?signin=failed`). Read once after mounting, then dropped from the URL so
 * a reload doesn't repeat it.
 */
export const useSignInFailed = () => {
    const failed = ref(false)
    const route = useRoute()
    onMounted(() => {
        if (route.query.signin !== 'failed') return
        failed.value = true
        const { signin, ...query } = route.query
        navigateTo({ query, hash: route.hash }, { replace: true })
    })
    return failed
}
