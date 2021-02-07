export default {
  closeWindow() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    WIN.close()
  },

  hideWindow() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    WIN.hide()
  },

  minimizeWindow() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    WIN.minimize()
  },
}
