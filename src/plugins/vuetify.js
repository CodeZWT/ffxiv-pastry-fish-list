import Vue from 'vue'
import Vuetify from 'vuetify/lib'
// import colors from 'vuetify/lib/util/colors'
import { preset } from 'vue-cli-plugin-vuetify-preset-rally/preset'

Vue.use(Vuetify)

export default new Vuetify({
  preset,
  breakpoint: {
    mobileBreakpoint: 'xs', // This is equivalent to a value of 600
  },
  theme: {
    // dark: true,
    themes: {
      dark: {
        primary: '#2a9d8f',
        secondary: '#264653',
        tertiary: '#e76f51',
        quaternary: '#f4a261',
        quinary: '#3e1f47',
        senary: '#e9c46a',
      },
    },
  },
})
