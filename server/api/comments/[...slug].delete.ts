/** Removes a comment: the site owner can remove any, everyone else their own. */
export default defineEventHandler(async (event) => {
    const user = await requireCommenter(event)
    const id = getQuery(event).id
    if (typeof id !== 'string' || !id)
        throw createError({ statusCode: 400, statusMessage: 'Missing comment.' })

    const comments = await usePostComments(event)
    const result = await comments.remove(id, isSiteOwner(event, user) ? undefined : user.id)
    if (result === 'forbidden')
        throw createError({ statusCode: 403, statusMessage: 'You can only remove your own comments.' })
    if (result === 'missing')
        throw createError({ statusCode: 404, statusMessage: 'That comment is already gone.' })
    return { ok: true }
})
