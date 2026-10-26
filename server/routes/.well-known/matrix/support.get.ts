/**
 * Matrix server support contact. Must match CONDUWUIT_WELL_KNOWN__SUPPORT_EMAIL
 * in the cluster's Continuwuity config.
 */
export default defineEventHandler(() => ({
    contacts: [{ role: 'm.role.admin', email_address: 'uwu@svcs.ok8.sh' }],
}))
