import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/i18n'
import vuetify from '@/plugins/vuetify'
import { Settings } from 'luxon'

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
