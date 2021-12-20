import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import * as CafeKitTooltip from '@thewakingsands/kit-tooltip'
import { Settings } from 'luxon'
import App from './App.vue'
import Vue from 'vue'
import VueKonva from 'vue-konva'
import VueObserveVisibility from 'vue-observe-visibility'
import i18n from '@/i18n'
import router from './router'
import store from './store'
import vuetify from '@/plugins/vuetify'

Vue.use(VueObserveVisibility)
CafeKitTooltip.initTooltip()
Settings.defaultLocale = 'zh-CN'

Vue.config.productionTip = false
// if (process.env.NODE_ENV === 'development') {
Vue.use(VueKonva) // no need to set plugin if import by CND
// }

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App),
}).$mount('#app')
