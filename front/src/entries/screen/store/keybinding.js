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
  toggleReaderTimer: 'Alt+Shift+T',
  toggleReaderTimerMini: 'Alt+Shift+M',
  toggleReaderHistory: 'Alt+Shift+H',
  toggleReaderSpotStatistics: 'Alt+Shift+S',
  toggleGlobalClickThrough: 'Alt+Shift+]',
}
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
  plugins: [KeyBindingPlugin],
}

export { KeybindingModule }
