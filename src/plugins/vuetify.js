import Vue from 'vue'
import settings from '@/themes'
import Vuetify from 'vuetify'
Vue.use(Vuetify)

export default new Vuetify({
  preset: settings,
  breakpoint: {
    mobileBreakpoint: 'xs',
  },
})
