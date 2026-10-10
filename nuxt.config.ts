// https://nuxt.com/docs/api/configuration/nuxt-config
import app from './app/config/app'

export default defineNuxtConfig({
  devtools: { enabled: true },
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
      // Passthrough provider: the remote images are already sized by their CDNs.
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

  // Every page with an OG image is prerendered, so render them at build and keep
  // satori/resvg out of the server bundle.
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
      // Turnstile keys are added by @nuxtjs/turnstile; set them at runtime with
      // NUXT_PUBLIC_TURNSTILE_SITE_KEY and NUXT_TURNSTILE_SECRET_KEY.
      public: {
          userId: '201077739589992448',
          github: 'kashalls'
      }
  },

  content: {
      // Restored from the bundled dump at startup. The default (./contents.sqlite,
      // relative to cwd) is unwritable under a read-only root filesystem.
      database: { type: 'sqlite', filename: '/tmp/contents.sqlite' },
      experimental: {
          // Node's built-in node:sqlite (Node >= 22.5), so the distroless
          // runtime image doesn't need a native better-sqlite3 build.
          sqliteConnector: 'native',
      },
  },

  css: ['~/assets/css/main.css'],

  sourcemap: { server: false },

  routeRules: {
      // Renders the requesting hostname, so it must be rendered per request.
      '/gateway': { prerender: false },
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
          routes: ['/', '/blog'],
          // Follow links from /blog so every post (and its OG image) prerenders.
          crawlLinks: true,
      },
      // Persist the cache to disk in dev so it survives restarts (fewer GitHub calls).
      devStorage: {
          cache: { driver: 'fs', base: './.cache' },
      },
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