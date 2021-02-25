export default {
  setAlwaysOnTop(alwaysOnTop) {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    console.log('set top', alwaysOnTop)
    WIN.setAlwaysOnTop(alwaysOnTop, 'screen-saver')
  },

  closeWindow() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    WIN.close()
  },

  isWindowHidden() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    return !WIN.isVisible()
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

  maximizeWindow() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    WIN.maximize()
  },
  unmaximizeWindow() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    WIN.unmaximize()
  },
}
