import { DialogModule } from '@/entries/screen/store/dialog'
import { FlagModule, FlagPlugin } from '@/entries/screen/store/oneTimeFlag'
import { KeyBindingPlugin, KeybindingModule } from '@/entries/screen/store/keybinding'
import { MainModule, ScreenPluginOf } from '@/entries/main/store'
import {
  ReaderHistoryModule,
  ReaderHistoryPlugin,
} from '@/entries/screen/store/readerHistory'
import { SaveLayoutPlugin, ScreenWindowModule } from '@/entries/screen/store/screenWindow'
import { loadReaderUserData } from '@/utils/UserDataLoader'
import DataUtil from '@/utils/DataUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/entries/screen/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    readerTimerMiniMode: false,
    ...MainModule.state,
    window: 'screen',
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
    updateReaderSetting(state, setting) {
      LocalStorageUtil.storeReaderUserData(setting)
      state.readerSetting = loadReaderUserData()
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
    readerHistory: ReaderHistoryModule,
  },
  plugins: [
    SaveLayoutPlugin,
    KeyBindingPlugin,
    FlagPlugin,
    ScreenPluginOf(router),
    ReaderHistoryPlugin,
  ],
})
