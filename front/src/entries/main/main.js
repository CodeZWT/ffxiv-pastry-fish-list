import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/i18n'
import vuetify from '@/plugins/vuetify'
import { initTooltip } from '@thewakingsands/kit-tooltip'
import { Settings } from 'luxon'
import VueKonva from 'vue-konva'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
])

import ECharts from 'vue-echarts'

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
