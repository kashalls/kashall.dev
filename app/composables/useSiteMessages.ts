/** Messages from /api/meta; components sharing the key share one request. */
export const useSiteMessages = () => useFetch('/api/meta', {
    key: 'meta',
    // Pages are prerendered, so fetch the current messages in the browser.
    server: false,
    lazy: true,
    default: () => ({ messages: { maintenance: '', live: '' } }),
})
