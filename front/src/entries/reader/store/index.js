import Vue from 'vue'
import Vuex from 'vuex'
import DataUtil from '@/utils/DataUtil'
import { loadUserData } from '@/utils/UserDataLoader'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import CONSTANTS from 'Data/constants'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sounds: {},
    userData: loadUserData(),
    viewedFeatures: LocalStorageUtil.loadViewedFeatures(CONSTANTS.FEATURE_GROUP_READER),
    readerTimerMiniMode: false,
  },
  getters: {
    readerSetting: state => {
      return DataUtil.getUserDataPart(state)('reader')
    },
    readerRegion: state => {
      return state.userData.reader.region
    },
    showBanner: state => {
      return state.userData.reader.showReaderBanner
    },
  },
  mutations: {
    setNotShowBanner(state) {
      state.userData = {
        ...state.userData,
        reader: {
          ...state.userData.reader,
          showReaderBanner: false,
        },
      }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setFeatureViewed(state, feature) {
      if (!state.viewedFeatures.includes(feature)) {
        state.viewedFeatures.push(feature)
      }
      LocalStorageUtil.storeViewedFeatures(
        CONSTANTS.FEATURE_GROUP_READER,
        state.viewedFeatures
      )
    },
    reloadUserData(state) {
      state.userData = loadUserData()
    },
    reloadSounds(state) {
      state.sounds = loadUserData()
    },
    setSounds(state, sounds) {
      state.sounds = sounds
    },
    updateReaderSetting(state, setting) {
      DataUtil.setUserDataPartInLocalStorage(state, { path: 'reader', data: setting })
    },
    updateReaderTimerMiniMode(state, mini) {
      state.readerTimerMiniMode = mini
    },
    setFishCompleted(state, { fishId, completed }) {
      const completedFishId = state.userData.completed
      if (completedFishId.includes(fishId) !== completed) {
        if (completed) {
          completedFishId.push(fishId)
        } else {
          completedFishId.filter(id => id !== fishId)
        }
      }
      DataUtil.setUserDataPart(state, { path: 'completed', data: completedFishId })
    },
  },
  actions: {},
  modules: {},
})
