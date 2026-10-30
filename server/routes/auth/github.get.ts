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
        return sendRedirect(event, withSignInFailed(returnTo(event)))
    },
})

const returnTo = (event: H3Event) => {
    // The cookie only comes back after the trip to GitHub; a failure before it
    // (like missing OAuth config) still has the path on this request.
    const path = event.context.authReturnTo ?? getCookie(event, RETURN_COOKIE)
    deleteCookie(event, RETURN_COOKIE, { path: '/' })
    return path || '/'
}

/** Flags the page you return to, so it can say sign-in failed (useSignInFailed). */
const withSignInFailed = (path: string) => {
    const [rest, hash] = path.split('#', 2)
    return `${rest}${rest!.includes('?') ? '&' : '?'}signin=failed${hash ? `#${hash}` : ''}`
}

/**
 * `?redirect=/some/path` returns there after signing in. It's kept in a cookie
 * across the trip to GitHub, and only same-site paths are accepted.
 */
export default defineEventHandler((event) => {
    const { redirect } = getQuery(event)
    if (typeof redirect === 'string' && /^\/(?![/\\])/.test(redirect)) {
        setCookie(event, RETURN_COOKIE, redirect, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 600 })
        event.context.authReturnTo = redirect
    }
    return signIn(event)
})
