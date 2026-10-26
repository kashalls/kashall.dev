import type { H3Event } from 'h3'

// The RPC stub's shape, typed here because typed routes pull this file into the
// app's type check, where the Workers runtime types would clash with the DOM's.
interface VisitorCounterStub {
    visit(ip: string, userAgent: string): Promise<number>
}

/**
 * The single VisitorCounter instance. Reached through ctx.exports rather than an
 * env binding, so every Worker Preview gets its own count. Not available under
 * `nuxt dev`, which doesn't run the Worker entry.
 */
export const useVisitorCounter = (event: H3Event): VisitorCounterStub => {
    const exports = event.context.cloudflare?.context?.exports as
        { VisitorCounter?: { getByName(name: string): VisitorCounterStub } } | undefined
    if (!exports?.VisitorCounter) throw createError({ statusCode: 503, message: 'Visitor counter unavailable' })
    return exports.VisitorCounter.getByName('site')
}
