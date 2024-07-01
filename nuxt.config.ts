// https://nuxt.com/docs/api/configuration/nuxt-config
import app from './src/config/app'

export default defineNuxtConfig({
    devtools: { enabled: true },
    srcDir: 'src/',
    app,
    modules: [
        "@nuxt/ui",
        '@nuxt/image',
        '@vueuse/motion/nuxt',
        'nuxt-resend',
        '@pinia/nuxt',
        "@nuxt/fonts"
    ],
    ui: {
        icons: ['ph'],
    },
    fonts: {
        families: [
            { name: 'Caveat', provider: 'google' }
        ]
    }
})