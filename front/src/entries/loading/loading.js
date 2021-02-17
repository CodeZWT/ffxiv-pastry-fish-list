import Vue from 'vue'
import Loading from './Loading.vue'
import i18n from '@/i18n'
import vuetify from '@/plugins/vuetify'
import { Settings } from 'luxon'
import VueKonva from 'vue-konva'

Settings.defaultLocale = 'zh-CN'

Vue.config.productionTip = false
if (process.env.NODE_ENV === 'development') {
  Vue.use(VueKonva) // no need to set plugin if import by CND
}

new Vue({
  i18n,
  vuetify,
  render: h => h(Loading),
}).$mount('#app')
