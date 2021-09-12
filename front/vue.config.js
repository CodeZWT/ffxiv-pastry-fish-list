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

const webpack = require('webpack')
const GitRevPlugin = require('git-revision-webpack-plugin')
const GitRevisionPlugin = new GitRevPlugin()
const path = require('path')

module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: process.env.VUE_APP_STATIC_FILES_URL,
  productionSourceMap: false,
  pages: {
    index: {
      // page 的入口
      entry: 'src/entries/main/main.js',
      // 模板来源
      template:
        process.env.NODE_ENV === 'development'
          ? 'public/index.dev.html'
          : 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '鱼糕',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      // chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    reader: {
      entry: 'src/entries/reader/reader.js',
      template:
        process.env.NODE_ENV === 'development'
          ? 'public/index.dev.html'
          : 'public/index.html',
      filename: 'reader.html',
      title: '渔捞',
    },
    loading: {
      entry: 'src/entries/loading/loading.js',
      template:
        process.env.NODE_ENV === 'development'
          ? 'public/index.dev.html'
          : 'public/index.html',
      filename: 'loading.html',
      title: '加载中',
    },
    mini: {
      entry: 'src/entries/mini/mini.js',
      template:
        process.env.NODE_ENV === 'development'
          ? 'public/index.dev.html'
          : 'public/index.html',
      filename: 'mini.html',
      title: '迷你鱼糕',
    },
    screen: {
      entry: 'src/entries/screen/main.js',
      template:
        process.env.NODE_ENV === 'development'
          ? 'public/index.dev.html'
          : 'public/index.html',
      filename: 'screen.html',
      title: '鱼糕桌面版',
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`。
    // 输出文件名会被推导为 `subpage.html`。
    // subpage: 'src/subpage/main.js',
  },
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
        echarts: 'echarts',
      })
    }
    // else {
    //   config.externals({
    //     echarts: 'echarts',
    //   })
    // }

    config.output
      .libraryTarget('umd')
      .globalObject('this')
      .end()

      .module.rule('help')
      .test(/help\.html$/i)
      .use('html-loader')
      .loader('html-loader')
      .end()

    config.resolve.alias
      .set('Data', path.join(__dirname, '../data'))
      .set('Assets', path.join(__dirname, '../assets'))
      .set('Utils', path.join(__dirname, '../utils'))
  },
  configureWebpack: {
    plugins: [
      GitRevisionPlugin,
      new webpack.DefinePlugin({
        // VERSION: JSON.stringify(GitRevisionPlugin.version()),
        'process.env.commit_hash': JSON.stringify(GitRevisionPlugin.commithash()),
        // BRANCH: JSON.stringify(GitRevisionPlugin.branch()),
      }),
    ],
  },
}
