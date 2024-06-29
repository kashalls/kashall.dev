// https://nuxt.com/docs/api/configuration/nuxt-config
import app from './src/config/app'

export default defineNuxtConfig({
    devtools: { enabled: true },
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
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss',
        '@nuxt/image',
        '@nuxtjs/turnstile',
        '@vueuse/motion/nuxt',
        'nuxt-resend',
        "@nuxt/ui",
        "@nuxt/icon"
    ]
})