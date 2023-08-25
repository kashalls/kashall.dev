// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            DISCORD_USER_ID: '201077739589992448',
            PINNED_REPOSITORIES_URL: 'https://ghapi.dstn.to/kashalls/pinned',
        }
    },
    app: {
        head: {
            link: [
                { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' }
            ]
        }
    },
    modules: ['@nuxtjs/tailwindcss', 'nuxt-icon'],
})
