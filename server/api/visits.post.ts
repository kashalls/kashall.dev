/**
 * Records a page load and returns the visit total. The counter decides whether
 * it's a new visit, so reloading the page doesn't inflate the count.
 */
export default defineEventHandler(async (event) => {
    // Set by Cloudflare on every request, including under `wrangler dev`.
    const ip = getRequestHeader(event, 'cf-connecting-ip') ?? ''
    const userAgent = getRequestHeader(event, 'user-agent') ?? ''
    return { count: await useVisitorCounter(event).visit(ip, userAgent) }
})
