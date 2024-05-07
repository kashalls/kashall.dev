// https://nuxt.com/docs/api/configuration/nuxt-config
import app from './src/config/app'

export default defineNuxtConfig({
    devtools: { enabled: true },
    nitro: {
        preset: "cloudflare-pages"
    },
    srcDir: 'src/',
    app,
    runtimeConfig: {
        turnstile: {
            addValidateEndpoint: true
        },
        public: {
            DISCORD_USER_ID: '201077739589992448',
            PINNED_REPOSITORIES_URL: 'https://ghapi.dstn.to/kashalls/pinned',
        }
    },
    modules: [
        'nitro-cloudflare-dev',
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss',
        '@nuxt/image',
        'nuxt-icon',
        '@nuxtjs/turnstile',
        '@vueuse/motion/nuxt',
        '@nuxt/content',
        'nuxt-resend'
    ]
})
