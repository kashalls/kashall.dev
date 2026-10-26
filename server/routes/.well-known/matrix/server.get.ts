/**
 * Matrix server delegation: federation for @user:ok8.sh goes to Continuwuity.
 * Must match CONDUWUIT_WELL_KNOWN__SERVER in the cluster's Continuwuity config.
 */
export default defineEventHandler(() => ({
    'm.server': 'federation.ok8.sh:443',
}))
