/**
 * Contact form handler: verifies the Cloudflare Turnstile token, then sends the
 * message through Resend. In dev, Turnstile uses always-pass test keys.
 */
export default defineEventHandler(async (event) => {
    const body = await readBody<{ name?: string; email?: string; message?: string; token?: string }>(event)

    const name = body?.name?.trim()
    const email = body?.email?.trim()
    const message = body?.message?.trim()
    const token = body?.token

    if (!name || !email || !message || !token)
        throw createError({ statusCode: 400, statusMessage: 'Please fill in every field.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw createError({ statusCode: 400, statusMessage: 'That email address looks invalid.' })
    if (message.length > 5000)
        throw createError({ statusCode: 400, statusMessage: 'That message is a little too long.' })

    const outcome = await verifyTurnstileToken(token, event)
    if (!outcome.success)
        throw createError({ statusCode: 403, statusMessage: 'Captcha verification failed — please try again.' })

    const config = useRuntimeConfig(event)
    if (!config.resend?.apiKey)
        throw createError({ statusCode: 503, statusMessage: 'Email is not configured yet. Reach out another way for now.' })

    const resend = useResend()
    const { error } = await resend.emails.send({
        from: config.contactFrom,
        to: config.contactTo,
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
    })

    if (error) {
        console.error('Resend error:', error)
        throw createError({ statusCode: 502, statusMessage: 'Could not send the message. Please try again later.' })
    }

    return { ok: true }
})
