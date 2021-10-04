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
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()

let pages = {
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
    chunks: ['chunk-vendors', 'chunk-vendors-common', 'index'],
  },
  // fishv2: {
  //   entry: 'src/entries/fish-v2/main.js',
  //   template:
  //     process.env.NODE_ENV === 'development'
  //       ? 'public/index.dev.html'
  //       : 'public/index.html',
  //   filename: 'fish-v2.html',
  //   title: '列表v2',
  // },
  // 当使用只有入口的字符串格式时，
  // 模板会被推导为 `public/subpage.html`
  // 并且如果找不到的话，就回退到 `public/index.html`。
  // 输出文件名会被推导为 `subpage.html`。
  // subpage: 'src/subpage/main.js',
}
if (process.env.VUE_APP_ELECTRON === 'true') {
  console.log('build for electron')
  pages = {
    ...pages,
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
  }
} else {
  console.log('build for web')
}

module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: process.env.VUE_APP_STATIC_FILES_URL,
  productionSourceMap: true,
  pages: pages,
  pluginOptions: {
    i18n: {
      locale: 'zh-CN',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
    webpackBundleAnalyzer: {
      openAnalyzer: false,
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
        'vue-konva': 'VueKonva',
        echarts: 'echarts',
        '@thewakingsands/kit-tooltip': 'CafeKitTooltip',
        luxon: 'luxon',
        dexie: 'Dexie',
      })
    }
    // else {
    //   config.externals({
    //   })
    // }

    config.output
      .libraryTarget('umd')
      .globalObject('this')
      .end()

    config.module
      .rule('help')
      .test(/help\.html$/i)
      .use('html-loader')
      .loader('html-loader')
      .end()

    const rule = config.module
      .rule('md')
      .test(/\.md$/)
      .pre()

    rule
      .use('v-loader')
      .loader('vue-loader')
      .options({
        transformAssetUrls: {
          video: 'src',
          source: 'src',
          img: 'src',
          image: 'xlink:href',
        },
      })

    rule
      .use('ware-loader')
      .loader('ware-loader')
      .options({
        raw: true,
        middleware: function(source) {
          // use markdown-it to render the markdown file to html, then
          // surround the output of that that with Vue template syntax
          // so it can be processed by the 'vue-loader'
          return `<template><div>${md.render(source)}</div></template>`
        },
      })

    config.resolve.alias
      .set('Data', path.join(__dirname, '../data'))
      .set('Assets', path.join(__dirname, '../assets'))
      .set('Utils', path.join(__dirname, '../utils'))
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendorsGroup1: {
            name: 'chunk-vendors-common',
            test: /[\\/]node_modules[\\/](howler|splitpanes|sortablejs|vee-validate|vuedraggable|clipboard)[\\/]/,
            priority: 10,
          },
          defaultVendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 0,
          },
          // common: {
          //   name: 'chunk-common',
          //   minChunks: 2,
          //   maxSize: 300000,
          //   priority: -20,
          //   reuseExistingChunk: true,
          // },
        },
      },
    },
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
