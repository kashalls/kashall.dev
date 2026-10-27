import type { H3Event } from 'h3'

const RETURN_COOKIE = 'auth-return-to'

/**
 * GitHub sign-in. Redirects to GitHub, then stores the account's public identity
 * in the sealed session cookie. The access token isn't kept.
 */
const signIn = defineOAuthGitHubEventHandler({
    async onSuccess(event, { user }) {
        await setUserSession(event, {
            user: {
                id: user.id,
                login: user.login,
                name: user.name,
                avatar: user.avatar_url,
                createdAt: user.created_at,
            },
            loggedInAt: Date.now(),
        })
        return sendRedirect(event, returnTo(event))
    },
    onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, returnTo(event))
    },
})

const returnTo = (event: H3Event) => {
    const path = getCookie(event, RETURN_COOKIE)
    deleteCookie(event, RETURN_COOKIE, { path: '/' })
    return path || '/'
}

/**
 * `?redirect=/some/path` returns there after signing in. It's kept in a cookie
 * across the trip to GitHub, and only same-site paths are accepted.
 */
export default defineEventHandler((event) => {
    const { redirect } = getQuery(event)
    if (typeof redirect === 'string' && /^\/(?![/\\])/.test(redirect))
        setCookie(event, RETURN_COOKIE, redirect, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 600 })
    return signIn(event)
})
