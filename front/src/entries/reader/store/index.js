import Vue from 'vue'
import Vuex from 'vuex'
import DataUtil from '@/utils/DataUtil'
import { loadReaderUserData, loadUserData } from '@/utils/UserDataLoader'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import CONSTANTS from 'Data/constants'
import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sounds: {},
    readerSetting: loadReaderUserData(),
    userData: loadUserData(),
    viewedFeatures: LocalStorageUtil.loadViewedFeatures(CONSTANTS.FEATURE_GROUP_READER),
    readerTimerMiniMode: false,
  },
  getters: {
    isRoseMode: state => {
      return state.userData.isRoseMode
    },
    isStrictMode: state => {
      return state.readerSetting.isStrictMode
    },
    isUploadMode: state => {
      return state.readerSetting.isUploadMode
    },
    readerSetting: state => {
      return state.readerSetting
      // return DataUtil.getUserDataPart(state)('reader')
    },
    readerRegion: state => {
      return state.readerSetting.region
    },
    showBanner: state => {
      return state.readerSetting.showReaderBanner
    },
  },
  mutations: {
    setStrictMode(state, isStrictMode) {
      LocalStorageUtil.storeReaderUserData({ ...state.readerSetting, isStrictMode })
    },
    setNotShowBanner(state) {
      const newSetting = _.cloneDeep(state.readerSetting)
      _.set(newSetting, 'showReaderBanner', false)
      state.readerSetting = newSetting
      LocalStorageUtil.storeReaderUserData(newSetting)
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
      state.readerSetting = loadReaderUserData()
    },
    // reloadSounds(state) {
    //   state.sounds = loadUserData()
    // },
    setSounds(state, sounds) {
      state.sounds = sounds
    },
    updateReaderSetting(state, setting) {
      // DataUtil.setUserDataPartInLocalStorage(state, { path: 'reader', data: setting })
      LocalStorageUtil.storeReaderUserData(setting)
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
