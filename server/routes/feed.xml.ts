/**
 * Atom feed of published blog posts. Prerendered at build (see nitro.prerender).
 */
const escape = (value: string) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export default defineEventHandler(async (event) => {
    const site = getSiteConfig(event)
    const posts = await queryCollection(event, 'blog')
        .where('draft', '=', false)
        .order('date', 'DESC')
        .select('title', 'description', 'date', 'path', 'tags')
        .all()

    const url = (path: string) => new URL(path, site.url).href
    const updated = posts[0] ? new Date(posts[0].date).toISOString() : new Date(0).toISOString()

    const entries = posts.map(post => `
  <entry>
    <id>${url(post.path)}</id>
    <title>${escape(post.title)}</title>
    <link href="${url(post.path)}"/>
    <published>${new Date(post.date).toISOString()}</published>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary>${escape(post.description ?? '')}</summary>
${(post.tags ?? []).map(tag => `    <category term="${escape(tag)}"/>`).join('\n')}
  </entry>`).join('')

    setResponseHeader(event, 'Content-Type', 'application/atom+xml; charset=utf-8')
    return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${url('/blog')}</id>
  <title>${escape(site.name)}</title>
  <subtitle>Notes on Kubernetes, homelabs, and whatever I'm building.</subtitle>
  <link href="${url('/feed.xml')}" rel="self"/>
  <link href="${url('/blog')}"/>
  <author><name>Jordan Jones</name></author>
  <updated>${updated}</updated>${entries}
</feed>
`
})
