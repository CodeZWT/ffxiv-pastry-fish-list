import { Settings } from 'luxon'
import { initTooltip } from '@thewakingsands/kit-tooltip'
import App from './App.vue'
import Vue from 'vue'
import VueKonva from 'vue-konva'
import i18n from '@/i18n'
import router from './router'
import store from './store'
import vuetify from '@/plugins/vuetify'

initTooltip()
Settings.defaultLocale = 'zh-CN'

Vue.config.productionTip = false
if (process.env.NODE_ENV === 'development') {
  Vue.use(VueKonva) // no need to set plugin if import by CND
}

// use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App),
}).$mount('#app')
