// let ASSET_PATH
// const bucketSubPath = process.env.VUE_APP_MODE === 'develop' ? 'fishdev' : 'fish'
// switch (process.env.NODE_ENV) {
//   case 'development':
//     ASSET_PATH = '/'
//     break
//   case 'production':
//     ASSET_PATH = `https://pastry-fish-1304006624.cos-website.ap-shanghai.myqcloud.com/${bucketSubPath}/`
//     break
//   default:
//     console.error('NODE_ENV not supported!')
//     ASSET_PATH = '/'
// }

module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: process.env.VUE_APP_STATIC_FILES_URL,
  productionSourceMap: false,

  pluginOptions: {
    i18n: {
      locale: 'zh-CN',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.externals({
        lodash: {
          commonjs: 'lodash',
          commonjs2: 'lodash',
          amd: 'lodash',
          root: '_', // indicates global variable
        },
        vue: 'Vue',
        vuetify: 'Vuetify',
        konva: 'konva',
        'konva-vue': 'VueKonva',
        'vue-grid-layout': 'VueGridLayout',
      })
    }

    config
      .plugin('html')
      .tap(args => {
        args[0].title = '鱼糕 - 钓鱼时钟'
        if (process.env.NODE_ENV === 'development') {
          args[0].template = './public/index.dev.html'
        }
        return args
      })
      .end()

      .output.libraryTarget('umd')
      .globalObject('this')
      .end()

      .module.rule('help')
      .test(/help\.html$/i)
      .use('html-loader')
      .loader('html-loader')
      .end()
  },
}
