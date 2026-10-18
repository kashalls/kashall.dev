/**
 * Uptime for a few public services from Gatus (status.ok8.sh). Gatus doesn't
 * send CORS headers, so the browser can't call it directly. Its storage is
 * in-memory: uptime only covers time since the pod last restarted, and the
 * check history is the last 100 results.
 */
const GATUS = 'https://status.ok8.sh/api/v1/endpoints'

// Only these are shown on the site; the rest of Gatus stays on status.ok8.sh.
const ENDPOINTS = [
    { key: 'external_ok8-sh-app', label: 'Website' },
    { key: 'external_api-router', label: 'API' },
    { key: 'external_kromgo', label: 'Cluster metrics' },
    { key: 'infrastructure_gateway', label: 'Network gateway' },
    { key: 'connectivity_cloudflare', label: 'Internet' },
]

const DURATIONS = ['24h', '7d', '30d'] as const

interface Statuses { results: { success: boolean; timestamp: string }[] }

const uptime = async (key: string, duration: string) => {
    const value = await $fetch<string>(`${GATUS}/${key}/uptimes/${duration}`, { responseType: 'text' }).catch(() => null)
    return value === null ? null : Number(value)
}

export default defineCachedEventHandler(async () => {
    const services = await Promise.all(ENDPOINTS.map(async ({ key, label }) => {
        const [statuses, ...uptimes] = await Promise.all([
            $fetch<Statuses>(`${GATUS}/${key}/statuses`, { query: { page: 1, pageSize: 100 } }).catch(() => null),
            ...DURATIONS.map(duration => uptime(key, duration)),
        ])
        const checks = (statuses?.results ?? []).map(result => ({ ok: result.success, at: result.timestamp }))
        return {
            key,
            label,
            up: checks.at(-1)?.ok ?? null,
            uptime: Object.fromEntries(DURATIONS.map((duration, i) => [duration, uptimes[i] ?? null])) as Record<typeof DURATIONS[number], number | null>,
            checks,
        }
    }))
    if (services.every(service => !service.checks.length)) {
        throw createError({ statusCode: 502, message: 'Gatus is unreachable' })
    }
    return services
}, {
    name: 'status',
    getKey: () => 'services',
    maxAge: 60,
    staleMaxAge: 60 * 60, // keep serving the last good value through Gatus outages
    swr: true,
})
