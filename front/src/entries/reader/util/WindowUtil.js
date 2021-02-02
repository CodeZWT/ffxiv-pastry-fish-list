export default {
  closeWindow() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    WIN.close()
  },

  minimizeWindow() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    WIN.minimize()
  },
}
