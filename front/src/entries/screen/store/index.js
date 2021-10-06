import { MainStore } from '@/entries/main/store'
import { loadReaderUserData, loadUserData } from '@/utils/UserDataLoader'
import DataUtil from '@/utils/DataUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    readerTimerMiniMode: false,
    ...MainStore.state,
  },
  getters: {
    ...MainStore.getters,
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
    showReaderBanner: state => {
      return state.readerSetting.showReaderBanner
    },
  },
  mutations: {
    setStrictMode(state, isStrictMode) {
      DataUtil.setReaderSettingPart(state, {
        path: 'isStrictMode',
        data: isStrictMode,
      })
    },
    // setNotShowBanner(state) {
    //   const newSetting = _.cloneDeep(state.readerSetting)
    //   _.set(newSetting, 'showReaderBanner', false)
    //   state.readerSetting = newSetting
    //   LocalStorageUtil.storeReaderUserData(newSetting)
    // },
    // setFeatureViewed(state, feature) {
    //   if (!state.viewedFeatures.includes(feature)) {
    //     state.viewedFeatures.push(feature)
    //   }
    //   LocalStorageUtil.storeViewedFeatures(
    //     CONSTANTS.FEATURE_GROUP_READER,
    //     state.viewedFeatures
    //   )
    // },
    reloadUserData(state) {
      state.userData = loadUserData()
      state.readerSetting = loadReaderUserData()
    },
    // setSounds(state, sounds) {
    //   state.sounds = sounds
    // },
    updateReaderSetting(state, setting) {
      // DataUtil.setUserDataPartInLocalStorage(state, { path: 'reader', data: setting })
      LocalStorageUtil.storeReaderUserData(setting)
    },
    updateReaderTimerMiniMode(state, mini) {
      state.readerTimerMiniMode = mini
    },
    // setFishCompleted(state, { fishId, completed }) {
    //   const completedFishId = state.userData.completed
    //   if (completedFishId.includes(fishId) !== completed) {
    //     if (completed) {
    //       completedFishId.push(fishId)
    //     } else {
    //       completedFishId.filter(id => id !== fishId)
    //     }
    //   }
    //   DataUtil.setUserDataPart(state, { path: 'completed', data: completedFishId })
    // },

    ...MainStore.mutations,
  },
  actions: {
    ...MainStore.actions,
  },
  modules: {
    ...MainStore.modules,
  },
})
