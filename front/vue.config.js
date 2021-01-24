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

  // pages: {
  //   index: {
  //     // page 的入口
  //     entry: 'src/index/main.js',
  //     // 模板来源
  //     template: 'public/index.html',
  //     // 在 dist/index.html 的输出
  //     filename: 'index.html',
  //     // 当使用 title 选项时，
  //     // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
  //     title: 'Index Page',
  //     // 在这个页面中包含的块，默认情况下会包含
  //     // 提取出来的通用 chunk 和 vendor chunk。
  //     chunks: ['chunk-vendors', 'chunk-common', 'index']
  //   },
  //   // 当使用只有入口的字符串格式时，
  //   // 模板会被推导为 `public/subpage.html`
  //   // 并且如果找不到的话，就回退到 `public/index.html`。
  //   // 输出文件名会被推导为 `subpage.html`。
  //   subpage: 'src/subpage/main.js'
  // },
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
