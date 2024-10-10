import ru from 'vuetify/src/locale/ru';

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  target: 'static',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Fitness | CRM',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/style.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src:  '@/plugins/vClickOutside',
      ssr: false
    },
    '@/plugins/axios',
    '@/plugins/vMask',
    '@/plugins/User',
    '@/plugins/loaderPlugin',
    '@/plugins/vConfirmation',
    '@/plugins/fileService'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    ['@nuxtjs/vuetify', {
      theme: {
        themes: {
          light: {
            //primary: '#b0cc1f'
            primary: '#43A047'
          }
        }
      }
    }],
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    ["vue-toastification/nuxt", {
      position: "top-right",
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: false,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: "button",
      icon: true,
      rtl: false
    }]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.VUE_APP_API_HOST,
  },

  router: {
    middleware: ['auth']
  },

  auth: {
    watchLoggedIn: true,
    redirect: {
      logout: '/login',
    },
    strategies: {
      'laravelJWT': {
        provider: 'laravelJWT',
        url: process.env.VUE_APP_API_HOST,
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            redirect: '/'
          },
          logout: {
            url: '/auth/logout',
            method: 'post',
            redirect: '/login'
          },
          user: {
            url: '/auth/me',
            method: 'get'
          },
          token: {
            maxAge: 60 * 60 * 8
          }
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  vuetify: {
    lang: {
      locales: { ru },
      current: 'ru'
    },
    icons: {
      iconfont: 'mdi'
    },
    treeShake: true
  }
}
