import Vue from 'vue'
import Vuex from 'vuex'
import DataUtil from '@/utils/DataUtil'
import { loadUserData } from '@/utils/UserDataLoader'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sounds: {},
    userData: loadUserData(),
  },
  getters: {
    readerSetting: state => {
      return DataUtil.getUserDataPart(state)('reader')
    },
  },
  mutations: {
    reloadUserData(state) {
      state.userData = loadUserData()
    },
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
