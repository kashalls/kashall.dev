export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Jordan Jones (Kashalls)',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Thank\'s for stumbling on my home. Please enjoy your stay.' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'og:title', name: 'og:title', content: 'Jordan Jones (Kashalls)' },
      { hid: 'og:description', name: 'og:description', content: '' },
      { hid: 'og:image', name: 'og:image', content: 'https://avatars0.githubusercontent.com/u/17620516?s=400&u=419440013cbf219ea6289bd51ed5ee50f00621c7&v=4' },
      { hid: 'og:url', name: 'og:url', content: 'https://jordanjones.org/' },
      { hid: 'og:site_name', name: 'og:site_name', content: 'Jordan Jones (Kashalls)' },
      { hid: 'twitter:image', name: 'twitter:image', content: 'https://avatars0.githubusercontent.com/u/17620516?s=400&u=419440013cbf219ea6289bd51ed5ee50f00621c7&v=4' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@kashalls' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'assets/scss/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/fontawesome.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-analytics'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    ['nuxt-buefy', { css: false }],
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/sitemap'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  googleAnalytics: {
    id: 'G-WER4EZ1XXJ'
  },

  sitemap: {
    hostname: 'https://jordanjones.org'
  }
}
