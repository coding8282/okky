module.exports = {
    mode: "spa",
    modules: ["@nuxtjs/axios", "@nuxtjs/toast"],
    env: {
        cognitoPool: {
            UserPoolId: process.env.user_pool_id,
            ClientId: process.env.client_id,
        },
        profileServerHost: process.env.profile_server_host,
        soundServerHost: process.env.sound_server_host,
    },
    axios: {
        baseURL: process.env.api_server_host
    },
    toast: {
        duration: 2500,
        position: "top-center",
        fullWidth: true,
        fitToScreen: false
    },
    css: ["~/assets/style/main.css", "~/assets/style/transition.css"],
    head: {
        title: "옼희",
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=yes" },
            { hid: "description", name: "description", content: "okky project" }
        ],
        link: [{
                rel: "icon",
                type: "image/x-icon",
                href: "/favicon.ico"
            },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css?family=Gaegu"
            },
            {
                rel: "stylesheet",
                href: "https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css",
                integrity: "sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB",
                crossorigin: "anonymous"
            },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/icon?family=Material+Icons"
            },
            {
                rel: "stylesheet",
                href: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
            }
        ],
        script: [{
                src: "https://code.jquery.com/jquery-3.3.1.slim.min.js",
                integrity: "sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo",
                crossorigin: "anonymous"
            },
            {
                src: "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js",
                integrity: "sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49",
                crossorigin: "anonymous"
            },
            {
                src: "https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js",
                integrity: "sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T",
                crossorigin: "anonymous"
            }
        ]
    },
    loading: false,
    loadingIndicator: {
        name: "pulse",
        color: "purple"
    },
    build: {
        vendor: ["vue-awesome", "axios"],
        extend(config, { isDev, isClient }) {
            if (isDev && isClient) {
                config.module.rules.push({
                    enforce: "pre",
                    test: /\.(js|vue)$/,
                    loader: "eslint-loader",
                    exclude: /(node_modules)/
                });
            }
        }
    },
    plugins: [
        { src: "~plugins/app-components.js", ssr: false },
        { src: "~plugins/app-filters.js", ssr: false },
        { src: "~plugins/app-plugins.js", ssr: false },
        { src: "~plugins/vue-awesome.js", ssr: false },
        { src: "~plugins/vue-axios.js", ssr: false },
        { src: "~plugins/vue-cookie.js", ssr: false },
        { src: "~plugins/vue-lodash.js", ssr: false },
        { src: "~plugins/vue-timeago.js", ssr: false },
    ],
};