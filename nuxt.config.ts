// https://nuxt.com/docs/api/configuration/nuxt-config
import app from './src/config/app'

export default defineNuxtConfig({
    srcDir: 'src/',
    app,
    runtimeConfig: {
        place: {
            height: 128,
            width: 128
        },
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
        'nuxt-icon',
        '@nuxtjs/turnstile',
        '@vueuse/motion/nuxt',
        '@nuxt/content',
        'nuxt3-socket.io'
    ],
    socket: {
        addPlugin: false
    }
})
