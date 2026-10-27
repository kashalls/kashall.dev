/** Gives or takes back the signed-in account's heart on a comment. */
export default defineEventHandler(async (event) => {
    const user = await requireCommenter(event)
    const body = await readBody<{ id?: string; hearted?: boolean }>(event)
    if (!body?.id || typeof body.hearted !== 'boolean')
        throw createError({ statusCode: 400, statusMessage: 'Missing comment or heart.' })

    const comments = await usePostComments(event)
    const result = await comments.heart(body.id, user.id, body.hearted)
    if (!result)
        throw createError({ statusCode: 404, statusMessage: 'That comment was removed.' })
    return result
})
