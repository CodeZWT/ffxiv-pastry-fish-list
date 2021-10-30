import LocalStorageUtil from '@/utils/LocalStorageUtil'

const READER_HISTORY_KEY = 'readerHistory'
const DEFAULT_HISTORY_CONFIG = {
  showIgnoredRecord: true,
  showPatient: false,
  showPlayerStatus: false,
  showHookset: false,
}
const storedConfig = LocalStorageUtil.get(READER_HISTORY_KEY)

const ReaderHistoryPlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type.indexOf('readerHistory/') === 0) {
      LocalStorageUtil.set(READER_HISTORY_KEY, {
        ...state.readerHistory,
      })
    }
  })
}

const ReaderHistoryModule = {
  namespaced: true,
  state: {
    showConfig: false,
    showIgnoredRecord:
      storedConfig?.showIgnoredRecord ?? DEFAULT_HISTORY_CONFIG.showIgnoredRecord,
    showPatient: storedConfig?.showPatient ?? DEFAULT_HISTORY_CONFIG.showPatient,
    showPlayerStatus:
      storedConfig?.showPlayerStatus ?? DEFAULT_HISTORY_CONFIG.showPlayerStatus,
    showHookset: storedConfig?.showHookset ?? DEFAULT_HISTORY_CONFIG.showHookset,
  },
  mutations: {
    setStates(state, statePart) {
      Object.entries(statePart).forEach(([key, value]) => {
        state[key] = value
      })
    },
  },
}

export { ReaderHistoryModule, ReaderHistoryPlugin }
