/** Counts a visit. The client calls this once per browser session. */
export default defineEventHandler(async event => ({ count: await useVisitorCounter(event).increment() }))
