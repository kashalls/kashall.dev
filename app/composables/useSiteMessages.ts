/**
 * Messages from /api/meta, shared by every caller. The layouts decide when
 * to refresh them. A failed refresh keeps the last messages, where
 * useFetch would reset them to its default.
 */
export const useSiteMessages = () => {
    const messages = useState('site-messages', () => ({ maintenance: '', live: '' }))
    const refresh = async () => {
        const result = await $fetch('/api/meta').catch(() => null)
        if (result) messages.value = result.messages
    }
    return { messages, refresh }
}
