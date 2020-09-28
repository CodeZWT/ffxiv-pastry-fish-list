import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    mobileBreakpoint: 960,
    themes: {
      dark: {
        primary: colors.deepPurple.base,
        success: colors.teal.darken4,
        info: colors.indigo.darken4,
        secondary: colors.blueGrey.darken4
      },
    },
  },
})
