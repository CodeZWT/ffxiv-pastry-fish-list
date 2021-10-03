import { Settings } from 'luxon'
import App from './App.vue'
import Vue from 'vue'
import i18n from '@/i18n'
import router from './router'
import store from './store'
import vuetify from '@/plugins/vuetify'

Settings.defaultLocale = 'zh-CN'

Vue.config.productionTip = false
// use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App),
}).$mount('#app')
