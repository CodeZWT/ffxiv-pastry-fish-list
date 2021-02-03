import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sounds: {},
  },
  mutations: {
    setSounds(state, sounds) {
      state.sounds = sounds
    },
  },
  actions: {},
  modules: {},
})
