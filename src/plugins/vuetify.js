import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import settings from '@/themes'
Vue.use(Vuetify)

export default new Vuetify({
  preset: settings,
  breakpoint: {
    mobileBreakpoint: 'xs',
  },
})
