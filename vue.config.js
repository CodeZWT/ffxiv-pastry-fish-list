const webpack = require('webpack')

const ASSET_PATH = process.env.NODE_ENV === 'production' ? '/ff14-list/' : '/'

module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: ASSET_PATH,

  pluginOptions: {
    i18n: {
      locale: 'chs',
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
  },
  configureWebpack: {
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
