import Vue from 'vue'
import Vuex from 'vuex'
import DataUtil from '@/utils/DataUtil'
import userData from '@/utils/UserDataLoader'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sounds: {},
    userData: userData,
  },
  getters: {
    readerSetting: state => {
      return DataUtil.getUserDataPart(state)('reader')
    },
  },
  mutations: {
    setSounds(state, sounds) {
      state.sounds = sounds
    },
    updateReaderSetting(state, setting) {
      DataUtil.setUserDataPart(state, { path: 'reader', data: setting })
    },
  },
  actions: {},
  modules: {},
})
