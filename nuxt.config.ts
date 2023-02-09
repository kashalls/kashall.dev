// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            DISCORD_USER_ID: '201077739589992448',
            PINNED_REPOSITORIES_URL: 'https://ghapi.dstn.to/kashalls/pinned',
            PRINT_SERVER: 'https://printer-worker.kashall.workers.dev/'
        },
        turnstile: {
            secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY || '0x4AAAAAAACH8awde6NfAXQc4-BziFI3wjk',
        },
    },
    app: {
        head: {
            link: [
                { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' }
            ]
        }
    },
    modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', '@nuxtjs/turnstile', '@vueuse/nuxt'],

    turnstile: {
        siteKey: '0x4AAAAAAACH8W_sM4diXZLZ'
    }
})
