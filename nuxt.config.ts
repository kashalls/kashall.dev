// https://nuxt.com/docs/api/configuration/nuxt-config
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import app from './app/config/app'

// Workers Builds sets WORKERS_CI_COMMIT_SHA/WORKERS_CI_BRANCH; local builds
// read them from the checkout.
const git = (args: string) => {
    try {
        return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    } catch {
        return ''
    }
}

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
      url: 'https://ok8.sh',
      name: 'Jordan Jones',
  },

  robots: {
      groups: [
          {
              userAgent: '*',
              contentSignal: { 'ai-train': 'no', 'search': 'yes', 'ai-input': 'yes' },
          },
      ],
      // /.well-known/matrix/ is routed by Envoy to Continuwuity, not this app.
      // /gateway is the page Envoy's fallback route serves for unknown hosts.
      disallow: ['/.well-known/matrix/', '/gateway'],
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
              globInclude: ['app/**/*.{vue,ts}', 'shared/**/*.ts', 'content/**/*.md'],
          },
      },
  },

  // Every page with an OG image is prerendered, so render them at build and keep
  // satori/resvg out of the server bundle.
  ogImage: {
      zeroRuntime: true,
  },

  runtimeConfig: {
      // GitHub token (set NUXT_GITHUB_TOKEN); required by the GraphQL API behind /api/github.
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
          github: 'kashalls',
          build: {
              sha: process.env.WORKERS_CI_COMMIT_SHA || git('rev-parse HEAD'),
              ref: process.env.WORKERS_CI_BRANCH || git('rev-parse --abbrev-ref HEAD'),
              time: new Date().toISOString(),
          },
      }
  },

  content: {
      // Restored from the bundled dump on first query; binding declared in wrangler.jsonc.
      database: { type: 'd1', bindingName: 'DB' },
      experimental: {
          // The build's local database uses Node's built-in node:sqlite
          // (Node >= 22.5) instead of a native better-sqlite3 build.
          sqliteConnector: 'native',
      },
  },

  css: ['~/assets/css/main.css'],

  sourcemap: { server: false },

  routeRules: {
      // Renders the requesting hostname, so it must be rendered per request.
      '/gateway': { prerender: false, sitemap: false },
      // Redirects or shows search results depending on ?q=, so it can't be a static file.
      '/posts': { prerender: false },
      // Old blog URLs, from before posts covered docs and guides too.
      '/blog/**': { redirect: { to: '/posts/**', statusCode: 301 } },
      '/git': { redirect: { to: 'https://github.com/kashalls', statusCode: 302 } },
      // Local fonts aren't content-hashed, so cache them without `immutable`.
      '/fonts/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
  },

  colorMode: {
      preference: 'dark',
  },

  nitro: {
      preset: 'cloudflare_module',
      modules: [
          // The preset's entry, plus the Durable Object classes the Worker exports.
          // Not set as `entry`: the prerenderer, a Node build, would inherit it.
          (nitro) => {
              if (nitro.options.preset === 'cloudflare-module')
                  nitro.options.entry = fileURLToPath(new URL('./server/entry.ts', import.meta.url))
          },
      ],
      cloudflare: {
          // Generates the deploy config from wrangler.jsonc plus the build output.
          deployConfig: true,
          nodeCompat: true,
      },
      // Isolates are short-lived and per-location, so the default in-memory
      // cache would rarely hit. Binding declared in wrangler.jsonc.
      storage: {
          cache: { driver: 'cloudflare-kv-binding', binding: 'CACHE' },
      },
      // Prerender the static routes so their OG images are generated at build
      // (required by ogImage.zeroRuntime). Dynamic client data still hydrates.
      prerender: {
          routes: ['/', '/posts/introduction', '/feed.xml', '/legal/juno/terms', '/legal/juno/privacy'],
          // Follow the posts sidebar's links so every post (and its OG image) prerenders.
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
          // Opt-in readable font (useReadableFont). Only referenced from a custom
          // property, so it must be global to get an @font-face; browsers only
          // download it once the class is on.
          { name: 'OpenDyslexic', provider: 'fontsource', weights: [400, 700], global: true },
          { name: 'PP Neue Machina Plain', provider: 'local' },
          // global so @nuxt/fonts emits it for OG image (satori) font extraction.
          { name: 'PP Neue Machina Inktrap', provider: 'local', global: true },
          // Blog post OG card (OgImage/Post); global for the same reason.
          { name: 'Plus Jakarta Sans', provider: 'google', weights: [800], global: true },
          { name: 'JetBrains Mono', provider: 'google', weights: [400], global: true },
      ]
  },

  compatibilityDate: '2026-06-08'
})