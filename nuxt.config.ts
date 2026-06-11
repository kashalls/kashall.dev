// https://nuxt.com/docs/api/configuration/nuxt-config
import app from './app/config/app'

export default defineNuxtConfig({
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  app,

  modules: [
      "@nuxt/ui",
      '@nuxt/image',
      'nuxt-resend',
      '@nuxtjs/turnstile',
      "@nuxt/fonts",
      'nuxt-og-image',
      '@nuxtjs/sitemap',
      '@nuxtjs/robots'
  ],

  // Canonical site (used by sitemap, robots, OG images). Override with
  // NUXT_PUBLIC_SITE_URL in production.
  site: {
      url: 'https://kashall.dev',
      name: 'Jordan Jones',
  },

  // Allow optimising remote avatars/banners through <NuxtImg>.
  image: {
      // Passthrough provider: the Discord/Spotify images are already sized by
      // their CDNs, and this avoids bundling `sharp` (which can't run on CF Workers).
      provider: 'none',
      domains: [
          'cdn.discordapp.com',
          'media.discordapp.net',
          'i.scdn.co',
          'dcdn.dstn.to',
          'cdn.jsdelivr.net',
      ],
  },

  // Pre-render OG images at build (zeroRuntime) instead of rendering them on the
  // edge — the runtime renderer (satori + native resvg) can't run on CF Workers.
  ogImage: {
      zeroRuntime: true,
  },

  runtimeConfig: {
      // Optional GitHub token (set NUXT_GITHUB_TOKEN) for higher API rate limits.
      githubToken: '',
      // Resend (set NUXT_RESEND_API_KEY). `onboarding@resend.dev` works without a
      // verified domain and delivers to your Resend account email.
      resend: { apiKey: '' },
      contactTo: 'noc@ok8.sh',
      contactFrom: 'Portfolio <onboarding@resend.dev>',
      public: {
          userId: '201077739589992448',
          github: 'kashalls'
      }
  },

  // Cloudflare Turnstile. In dev this auto-uses the always-pass test keys; for
  // production set turnstile.siteKey here and NUXT_TURNSTILE_SECRET_KEY in env.
  turnstile: {
      siteKey: process.env.NUXT_TURNSTILE_SITE_KEY,
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
      preference: 'dark',
  },

  nitro: {
      // Prerender the static routes so their OG images are generated at build
      // (required by ogImage.zeroRuntime). Dynamic client data still hydrates.
      prerender: {
          routes: ['/', '/gateway'],
      },
      // Persist the cache to disk in dev so it survives restarts (fewer GitHub calls).
      devStorage: {
          cache: { driver: 'fs', base: './.cache' },
      },
      // For durable caching across serverless cold starts in production, point the
      // `cache` mount at a persistent store. On Cloudflare Pages, bind a KV
      // namespace named CACHE and uncomment:
      // storage: {
      //     cache: { driver: 'cloudflareKVBinding', binding: 'CACHE' },
      // },
  },

  fonts: {
      assets: {
          prefix: 'public/_fonts/',
      },
      families: [
          { name: 'Caveat', provider: 'google' },
          { name: 'PP Neue Machina Plain', provider: 'local' },
          // global so @nuxt/fonts emits it for OG image (satori) font extraction.
          { name: 'PP Neue Machina Inktrap', provider: 'local', global: true }
      ]
  },

  compatibilityDate: '2026-06-08'
})