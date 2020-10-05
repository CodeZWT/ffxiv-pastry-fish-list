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
        primary: '#009d67',
        secondary: '#00453f',
        tertiary: '#df4c41',
        quaternary: '#e0b425',
        quinary: '#9442e2',
        senary: '#52c2e2',
      },
    },
  },
})
