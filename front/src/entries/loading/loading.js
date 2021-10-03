import { Settings } from 'luxon'
import Loading from './Loading.vue'
import Vue from 'vue'
import i18n from '@/i18n'
import vuetify from '@/plugins/vuetify'

Settings.defaultLocale = 'zh-CN'

Vue.config.productionTip = false

new Vue({
  i18n,
  vuetify,
  render: h => h(Loading),
}).$mount('#app')
