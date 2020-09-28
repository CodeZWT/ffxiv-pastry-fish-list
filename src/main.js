import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import VueKonva from 'vue-konva'
import vuetify from './plugins/vuetify'
import { initTooltip } from '@thewakingsands/kit-tooltip'

initTooltip()

Vue.config.productionTip = false
Vue.use(VueKonva)

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App),
}).$mount('#app')
