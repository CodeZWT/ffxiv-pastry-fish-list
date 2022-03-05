// import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify/lib'
import i18n from '@/i18n'
import settings from '@/themes'

if (DevelopmentModeUtil.isElectron() || DevelopmentModeUtil.useLocalFile()) {
  import('Assets/css/fish_icons_local.css')
} else {
  import('Assets/css/fish_icons.css')
}

Vue.use(Vuetify)
Vue.use(VueI18n)

export default new Vuetify({
  preset: settings,
  breakpoint: {
    mobileBreakpoint: 'sm',
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
  icons: {
    iconfont: 'mdiSvg',
  },
})
