/**
 * GitHub sign-in. Redirects to GitHub, then stores the account's public identity
 * in the sealed session cookie. The access token isn't kept.
 */
export default defineOAuthGitHubEventHandler({
    async onSuccess(event, { user }) {
        await setUserSession(event, {
            user: {
                id: user.id,
                login: user.login,
                name: user.name,
                avatar: user.avatar_url,
            },
            loggedInAt: Date.now(),
        })
        return sendRedirect(event, '/')
    },
    onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/')
    },
})
