const title = 'Chilling · Jordan Jones'
const description = 'Hey there! I\'m Jordan. I am a self-taught web developer in the United States. I mostly tinker around with different technologies and get two things that never should have talked in the first place to have a nice conversation.'
const image = 'https://avatars0.githubusercontent.com/u/17620516?s=400&u=419440013cbf219ea6289bd51ed5ee50f00621c7&v=4'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: description },
      // Facebook Meta Tags
      { hid: 'og:url', property: 'og:url', content: 'https://kashall.dev' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:title', property: 'og:title', content: title },
      { hid: 'og:description', property: 'og:description', content: description },
      { hid: 'og:image', property: 'og:image', content: image },
      // Twitter Meta Tags
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:domain', property: 'twitter:domain', content: 'kashall.dev' },
      { hid: 'twitter:url', property: 'twitter:url', content: 'https://kashall.dev' },
      { hid: 'twitter:title', name: 'twitter:title', content: title },
      { hid: 'twitter:description', name: 'twitter:description', content: description },
      { hid: 'twitter:image', name: 'twitter:image', content: image }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://code.iconify.design/iconify-icon/1.0.1/iconify-icon.min.js', body: true }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'assets/scss/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/Util',
    { src: '@/plugins/VueLanyard', mode: 'client' }
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
    ['nuxt-buefy', { css: false }],
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: '/'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: 'Kashall',
      lang: 'en',
      icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }, { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }]
    }
  },

  googleAnalytics: {
    id: 'G-WER4EZ1XXJ'
  },

  sitemap: {
    hostname: 'https://kashalls.dev'
  }
}
