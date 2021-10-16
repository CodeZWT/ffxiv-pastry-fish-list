const log = require('electron-log')

const callWindowSafe = (win, winCallback) => {
  if (win && !win.isDestroyed()) {
    winCallback(win)
  }
}

const callWindowsSafe = (wins, winCallback) => {
  if (wins.every(it => it) && wins.every(it => !it.isDestroyed())) {
    winCallback(wins)
  }
}

const callFirstAvailableWin = (windows, callBack) => {
  const firstNotNull = windows.find(it => it)
  if (firstNotNull) {
    callBack(firstNotNull)
  }
}

const callTargetSafe = (target, targetCallback) => {
  if (target) {
    targetCallback(target)
  } else {
    log.error('call target when it is undefined')
  }
}

const showAndFocus = target => {
  callWindowSafe(target, win => {
    if (win.isMinimized()) win.restore()
    if (!win.isVisible()) win.show()
    win.focus()
  })
}

const setMouseThrough = (target, enable) => {
  callWindowSafe(target, win => {
    win.setIgnoreMouseEvents(enable, { forward: true })
  })
}

const setOnTop =(win, alwaysOnTop = true) => {
  win.setAlwaysOnTop(alwaysOnTop, 'screen-saver')
  win.setMinimizable(!alwaysOnTop)
}

module.exports = {
  callFirstAvailableWin,
  callTargetSafe,
  callWindowSafe,
  callWindowsSafe,
  setMouseThrough,
  setOnTop,
  showAndFocus,
}
