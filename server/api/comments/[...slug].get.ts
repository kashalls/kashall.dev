/** A post's comments, oldest first, with the signed-in viewer's hearts. */
export default defineEventHandler(async (event) => {
    const comments = await usePostComments(event)
    const { user } = await getUserSession(event)
    const list = await comments.list(user?.id ?? null)
    return { comments: list.map(comment => withOwner(event, comment)), viewerIsOwner: isSiteOwner(event, user) }
})
