import Vue from 'vue'
import Mini from './Mini.vue'
import i18n from '@/i18n'
import vuetify from '@/plugins/vuetify'
import { Settings } from 'luxon'

Settings.defaultLocale = 'zh-CN'

Vue.config.productionTip = false

new Vue({
  i18n,
  vuetify,
  render: h => h(Mini),
}).$mount('#app')
