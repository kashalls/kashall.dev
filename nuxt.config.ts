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
    runtimeConfig: {
        public: {
            userId: '201077739589992448'
        }
    },
    ui: {
        icons: ['ph'],
    },
    colorMode: {
        preference: 'dark',
    },
    fonts: {
        assets: {
            prefix: 'public/_fonts/',
        },
        families: [
            { name: 'Caveat', provider: 'google' },
            { name: 'PP Neue Machina Plain', provider: 'local' },
            { name: 'PP Neue Machina Inktrap', provider: 'local' }
        ]
    }
})