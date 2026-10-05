// https://nuxt.com/docs/api/configuration/nuxt-config
import app from './app/config/app'

export default defineNuxtConfig({
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  app,

  modules: [
      "@nuxt/ui",
      '@nuxt/content',
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
          'api.ok8.sh',
          'cdn.jsdelivr.net',
      ],
  },

  // Ship only the icons the site uses, in the client bundle. The server bundle
  // would otherwise include every installed @iconify-json/* collection in full.
  // Icon names must stay literal strings for the scan to find them.
  icon: {
      serverBundle: false,
      // Not `false`: the runtime derives known collection names from this, and
      // without them hyphenated prefixes (`i-simple-icons-*`) fail to resolve.
      // The browser only hits the Iconify API for an icon the scan missed.
      fallbackToApi: 'client-only',
      clientBundle: {
          scan: {
              // Default excludes .ts, where some icon names are defined (utils/).
              globInclude: ['app/**/*.{vue,ts}', 'content/**/*.md'],
          },
      },
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

  content: {
      experimental: {
          // Node's built-in node:sqlite (Node >= 22.5), so the distroless
          // runtime image doesn't need a native better-sqlite3 build.
          sqliteConnector: 'native',
      },
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
      // Local fonts aren't content-hashed, so cache them without `immutable`.
      '/fonts/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
  },

  colorMode: {
      preference: 'dark',
  },

  nitro: {
      // Prerender the static routes so their OG images are generated at build
      // (required by ogImage.zeroRuntime). Dynamic client data still hydrates.
      prerender: {
          routes: ['/', '/gateway', '/blog'],
          // Follow links from /blog so every post (and its OG image) prerenders.
          crawlLinks: true,
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
          prefix: '/_webfonts/',
      },
      families: [
          { name: 'Inter', provider: 'google' },
          { name: 'Cinzel', provider: 'google' },
          { name: 'Teko', provider: 'google' },
          { name: 'PP Neue Machina Plain', provider: 'local' },
          // global so @nuxt/fonts emits it for OG image (satori) font extraction.
          { name: 'PP Neue Machina Inktrap', provider: 'local', global: true }
      ]
  },

  compatibilityDate: '2026-06-08'
})