import LocalStorageUtil from '@/utils/LocalStorageUtil'

const KeyBindingPlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type.indexOf('keybinding/') === 0) {
      LocalStorageUtil.storeWindowLayouts({
        keybindings: state.screenWindow.keybindings,
      })
    }
  })
}

const DEFAULT_KEYBINDINGS = {
  toggleReaderTimer: 'Ctrl+Shift+T',
  toggleReaderTimerMini: 'Ctrl+Shift+M',
  toggleReaderHistory: 'Ctrl+Shift+H',
  toggleReaderSpotStatistics: 'Ctrl+Shift+S',
  toggleGlobalClickThrough: 'Ctrl+Shift+]',
  showSearch: 'Ctrl+Shift+F',
  showRoseDialog: 'Ctrl+Alt+Y',
}

const HiddenItems = ['showRoseDialog']

let storedConfig = LocalStorageUtil.loadKeybindings()

const sendElectronEvent = (channel, data) => {
  window.electron?.ipcRenderer?.send(channel, data)
}

const KeybindingModule = {
  namespaced: true,
  state: {
    keybindings: storedConfig?.keybindings ?? DEFAULT_KEYBINDINGS,
  },
  mutations: {
    saveKeybindings(state, bindings) {
      state.keybindings = { ...DEFAULT_KEYBINDINGS, ...bindings }
      sendElectronEvent('updateKeybindings', state.keybindings)
    },
  },
}

export { KeybindingModule, HiddenItems, KeyBindingPlugin }
