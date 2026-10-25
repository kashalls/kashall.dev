// The MESSAGES binding's shape, typed here because typed routes pull this file
// into the app's type check, where the Workers runtime types would clash.
interface MessagesNamespace {
    get(key: string): Promise<string | null>
}

/**
 * Site-wide messages from the MESSAGES KV namespace, changed without a deploy:
 *   bunx wrangler kv key put maintenance "The contact form is down" --namespace-id <id> --remote
 * A missing key comes back as an empty string, which hides that message. Read
 * through the binding rather than useStorage(), which would JSON-parse values
 * like "true" or "123".
 */
export default defineEventHandler(async (event) => {
    const kv = event.context.cloudflare?.env?.MESSAGES as MessagesNamespace | undefined
    const [maintenance, live] = await Promise.all([kv?.get('maintenance'), kv?.get('live')])
    // KV propagates writes within about a minute anyway, so a short cache costs nothing.
    setResponseHeader(event, 'Cache-Control', 'public, max-age=30')
    return { messages: { maintenance: maintenance ?? '', live: live ?? '' } }
})
