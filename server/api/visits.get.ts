export default defineEventHandler(async event => ({ count: await useVisitorCounter(event).count() }))
