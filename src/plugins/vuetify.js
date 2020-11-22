import Vue from 'vue'
import Vuetify from 'vuetify/lib'
// import colors from 'vuetify/lib/util/colors'
// import { preset } from 'vue-cli-plugin-vuetify-preset-rally/preset'
Vue.use(Vuetify)
import settings from '@/themes'

export default new Vuetify({
  preset: settings,
  breakpoint: {
    mobileBreakpoint: 'xs', // This is equivalent to a value of 600
  },
})
