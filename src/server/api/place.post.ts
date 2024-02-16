import { z } from 'zod'

const schema = z.object({
    x: z.number(),
    y: z.number(),
    color: z.string(),
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (!body.x || !body.y) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid payload. Please make sure to include the location and color of the pixel you want to paint.'
        })
    }
    return { body }
})