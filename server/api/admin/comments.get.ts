/** Every comment on the site, grouped by where it was left, for the admin page. */
export default defineEventHandler(async (event) => {
    const owner = await requireSiteOwner(event)
    const sources = await commentSources(event)
    return {
        sources: await Promise.all(sources.map(async source => ({
            ...source,
            comments: (await commentsFor(event, source.path).list(owner.id)).map(comment => withOwner(event, comment)),
        }))),
    }
})
