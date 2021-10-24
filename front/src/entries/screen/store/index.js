import { DialogModule } from '@/entries/screen/store/dialog'
import { FlagModule, FlagPlugin } from '@/entries/screen/store/oneTimeFlag'
import { KeyBindingPlugin, KeybindingModule } from '@/entries/screen/store/keybinding'
import { MainModule } from '@/entries/main/store'
import { SaveLayoutPlugin, ScreenWindowModule } from '@/entries/screen/store/screenWindow'
import { loadReaderUserData, loadUserData } from '@/utils/UserDataLoader'
import DataUtil from '@/utils/DataUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    readerTimerMiniMode: false,
    ...MainModule.state,
  },
  getters: {
    isStrictMode: state => {
      return state.readerSetting.isStrictMode
    },
    isUploadMode: state => {
      return state.readerSetting.isUploadMode
    },
    readerSetting: state => {
      return state.readerSetting
    },
    readerRegion: state => {
      return state.readerSetting.region
    },
    showReaderBanner: state => {
      return state.readerSetting.showReaderBanner
    },
    ...MainModule.getters,
  },
  mutations: {
    setStrictMode(state, isStrictMode) {
      DataUtil.setReaderSettingPart(state, {
        path: 'isStrictMode',
        data: isStrictMode,
      })
    },
    reloadUserData(state) {
      state.userData = loadUserData()
      state.readerSetting = loadReaderUserData()
    },
    updateReaderSetting(state, setting) {
      LocalStorageUtil.storeReaderUserData(setting)
    },
    updateReaderTimerMiniMode(state, mini) {
      state.readerTimerMiniMode = mini
    },
    ...MainModule.mutations,
  },
  actions: {
    ...MainModule.actions,
  },
  modules: {
    screenWindow: ScreenWindowModule,
    keybinding: KeybindingModule,
    dialog: DialogModule,
    flag: FlagModule,
  },
  plugins: [SaveLayoutPlugin, KeyBindingPlugin, FlagPlugin],
})
