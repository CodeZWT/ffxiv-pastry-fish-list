import {
  ReaderHistoryModule,
  ReaderHistoryPlugin,
} from '@/entries/screen/store/readerHistory'
import { ScreenPluginOf } from '@/entries/main/store'
import { loadReaderUserData, loadUserData } from '@/utils/UserDataLoader'
import CONSTANTS from 'Data/constants'
import DataUtil from '@/utils/DataUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import router from '@/entries/reader/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sounds: {},
    readerSetting: loadReaderUserData(),
    userData: loadUserData(),
    viewedFeatures: LocalStorageUtil.loadViewedFeatures(CONSTANTS.FEATURE_GROUP_READER),
    readerTimerMiniMode: false,
    snackbar: {
      show: false,
      text: '',
      color: '',
      timeout: 2000,
    },
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
    themeMode: state => {
      return state.userData.theme.mode
    },
  },
  mutations: {
    showSnackbar(state, snackBarSetting) {
      state.snackbar = {
        show: true,
        text: snackBarSetting.text,
        color: snackBarSetting.color,
        timeout: snackBarSetting.timeout ?? 2000,
      }
    },
    boardCastReload(state) {
      state.userData = loadUserData()
      state.readerSetting = loadReaderUserData()
    },
    setStrictMode(state, isStrictMode) {
      DataUtil.setReaderSettingPart(state, {
        path: 'isStrictMode',
        data: isStrictMode,
      })
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
    // reloadSounds(state) {
    //   state.sounds = loadUserData()
    // },
    setSounds(state, sounds) {
      state.sounds = sounds
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
    updateReaderSetting(state, setting) {
      LocalStorageUtil.storeReaderUserData(setting)
      state.readerSetting = loadReaderUserData()
    },
  },
  actions: {},
  modules: { readerHistory: ReaderHistoryModule },
  plugins: [ScreenPluginOf(router), ReaderHistoryPlugin],
})
