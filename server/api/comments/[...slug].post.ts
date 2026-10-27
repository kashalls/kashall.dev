// Brand-new accounts are the cheapest to throw away, so they wait a while.
const MIN_ACCOUNT_AGE = 14 * 24 * 60 * 60 * 1000

/** Posts a comment or reply as the signed-in GitHub account. */
export default defineEventHandler(async (event) => {
    const user = await requireCommenter(event)
    const body = await readBody<{ content?: string; replyTo?: string | null }>(event)

    const content = body?.content?.trim()
    if (!content)
        throw createError({ statusCode: 400, statusMessage: 'Write something first.' })
    if (content.length > 1000)
        throw createError({ statusCode: 400, statusMessage: 'Comments are capped at 1000 characters.' })
    // Also rejects sessions from before createdAt was stored, which then sign in again.
    if (!(Date.now() - Date.parse(user.createdAt) >= MIN_ACCOUNT_AGE) && !isSiteOwner(event, user))
        throw createError({ statusCode: 403, statusMessage: 'GitHub accounts need to be at least 14 days old to comment.' })

    const comments = await usePostComments(event)
    const comment = await comments.post(
        { id: user.id, login: user.login, name: user.name, avatar: user.avatar }, content, body?.replyTo || null)
    if (!comment)
        throw createError({ statusCode: 404, statusMessage: 'The comment you replied to was removed.' })
    return { comment: withOwner(event, comment) }
})
