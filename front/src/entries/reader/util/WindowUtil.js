export default {
  setAlwaysOnTop(alwaysOnTop) {
    this.sendElectronEvent('alwaysOnTop', alwaysOnTop)
  },

  closeWindow() {
    this.sendElectronEvent('close')
  },

  isWindowHidden() {
    return false
    // const remote = window.require ? window.require('electron').remote : null
    // const WIN = remote.getCurrentWindow()
    // return !WIN.isVisible()
  },

  hideWindow() {
    this.sendElectronEvent('hide')
  },
  minimizeWindow() {
    this.sendElectronEvent('minimize')
  },
  maximizeWindow() {
    this.sendElectronEvent('maximize')
  },
  unmaximizeWindow() {
    this.sendElectronEvent('unmaximize')
  },
  sendElectronEvent(channel, data) {
    window.electron?.ipcRenderer?.send(channel, data)
  },
}
