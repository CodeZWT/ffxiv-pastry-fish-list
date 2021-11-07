const remote = window.require ? window.remote : null

export default {
  setAlwaysOnTop(alwaysOnTop) {
    const WIN = remote.getCurrentWindow()
    WIN.setAlwaysOnTop(alwaysOnTop, 'screen-saver')
    WIN.setMinimizable(!alwaysOnTop)
  },

  closeWindow() {
    const WIN = remote.getCurrentWindow()
    WIN.close()
  },

  isWindowHidden() {
    const WIN = remote.getCurrentWindow()
    return !WIN.isVisible()
  },

  hideWindow() {
    const WIN = remote.getCurrentWindow()
    WIN.hide()
  },

  minimizeWindow() {
    const WIN = remote.getCurrentWindow()
    WIN.minimize()
  },

  maximizeWindow() {
    const WIN = remote.getCurrentWindow()
    WIN.maximize()
  },
  unmaximizeWindow() {
    const WIN = remote.getCurrentWindow()
    WIN.unmaximize()
  },
}
