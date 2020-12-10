const webpack = require('webpack')

let ASSET_PATH
const bucketSubPath = process.env.VUE_APP_MODE === 'develop' ? 'fishdev' : 'fish'
switch (process.env.NODE_ENV) {
  case 'development':
    ASSET_PATH = '/'
    break
  case 'production':
    ASSET_PATH = `https://pastry-fish-1304006624.cos-website.ap-shanghai.myqcloud.com/${bucketSubPath}/`
    break
  default:
    console.error('NODE_ENV not supported!')
    ASSET_PATH = '/'
}

module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: ASSET_PATH,
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
    config.plugin('html').tap(args => {
      args[0].title = '鱼糕 - 钓鱼时钟'
      return args
    })
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
    })
  },
  configureWebpack: {
    output: {
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
      }),
    ],
    module: {
      rules: [
        {
          test: /help\.html$/i,
          loader: 'html-loader',
        },
      ],
    },
  },
}
