/**
 * Matrix client discovery for @user:ok8.sh. Must match CONDUWUIT_WELL_KNOWN__CLIENT
 * in the cluster's Continuwuity config.
 */
export default defineEventHandler((event) => {
    // The spec asks for CORS here so web clients can discover the homeserver.
    setResponseHeader(event, 'access-control-allow-origin', '*')
    return {
        'm.homeserver': { base_url: 'https://matrix.ok8.sh/' },
    }
})
