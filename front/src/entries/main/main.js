import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/i18n'
import vuetify from '@/plugins/vuetify'
import { initTooltip } from '@thewakingsands/kit-tooltip'
import { Settings } from 'luxon'
import VueKonva from 'vue-konva'
import ECharts from 'vue-echarts'
import 'echarts'

initTooltip()
Settings.defaultLocale = 'zh-CN'

Vue.config.productionTip = false
if (process.env.NODE_ENV === 'development') {
  Vue.use(VueKonva) // no need to set plugin if import by CND
}

// use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

Vue.component('v-chart', ECharts)

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App),
}).$mount('#app')
