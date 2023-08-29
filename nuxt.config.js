import vuetify from "vite-plugin-vuetify";

export default {
    ssr: true,
    modern: true,
    target: 'server',

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        htmlAttrs: {
            lang: "en",
        }
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '~/assets/css/main.scss',
        '~/assets/css/fonts.css'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    generate: { fallback: true },

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: ['nuxt-compress', 'nuxt-purgecss'],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        async (_options, nuxt) => {
            nuxt.hooks.hook("vite:extendConfig", (config) =>
                // @ts-ignore
                config.plugins.push(vuetify())
            );
        },
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        'nuxt-proxy',
        'nuxt-delay-hydration',
    ],

    proxy: {
        options: {
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: { '^/api': '/v1' },
            pathFilter: [ '/api' ],
            secure: false,
            cookieDomainRewrite: 'localhost',
            debug: true
        },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: ['vuetify']
    },

    delayHydration: {
        mode: 'init',
        debug: process.env.NODE_ENV === 'development'
    },

    purgeCSS: {
        enabled: true,
        paths: [
            'components/**/*.vue',
            'layouts/**/*.vue',
            'pages/**/*.vue',
            'plugins/**/*.js',
            './node_modules/vuetify/dist/*.js',
            './node_modules/vuetify/dist/*.css',
            './node_modules/vuetify/src/**/*.ts',
            './node_modules/@mdi/fonts/*',
        ],

        whitelist: ['v-application', 'v-application--wrap', 'layout', 'row', 'col'],
        whitelistPatterns: [
            /^v-((?!application).)*$/,
            /^theme--*/,
            /.*-transition/,
            /^justify-*/,
            /^p*-[0-9]/,
            /^m*-[0-9]/,
            /^text--*/,
            /--text$/,
            /^row-*/,
            /^col-*/,
            /leaflet/,
            /marker/
        ],
        whitelistPatternsChildren: [/^v-((?!application).)*$/, /^theme--*/],
    }
}
