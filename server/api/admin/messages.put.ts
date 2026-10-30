// The MESSAGES binding's shape; see server/api/meta.get.ts.
interface MessagesNamespace {
    put(key: string, value: string): Promise<void>
    delete(key: string): Promise<void>
}

const KEYS = ['maintenance', 'live'] as const

/** Sets or clears the site messages served by /api/meta. An empty message deletes its key. */
export default defineEventHandler(async (event) => {
    await requireSiteOwner(event)
    const body = await readBody<Partial<Record<typeof KEYS[number], string>>>(event)
    const kv = event.context.cloudflare?.env?.MESSAGES as MessagesNamespace | undefined
    if (!kv) throw createError({ statusCode: 503, statusMessage: 'Messages are unavailable right now.' })

    const messages = Object.fromEntries(KEYS.map(key => [key, body?.[key]?.trim() ?? ''])) as Record<typeof KEYS[number], string>
    if (Object.values(messages).some(message => message.length > 280))
        throw createError({ statusCode: 400, statusMessage: 'Messages are capped at 280 characters.' })
    await Promise.all(KEYS.map(key => messages[key] ? kv.put(key, messages[key]) : kv.delete(key)))
    return { messages }
})
