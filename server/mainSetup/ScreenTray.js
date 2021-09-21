const { Menu, Tray } = require('electron')
const path = require('path')
const { callTargetSafe, showAndFocus, setMouseThrough } = require('./utils')
const { callWindowSafe } = require('./utils')

function resetWindowPos(target) {
  Object.values(target).forEach(win => {
    callWindowSafe(win, win => win.setPosition(100, 100))
  })
}

class ScreenTray {
  constructor(win, quitFn) {
    this.win = win
    this.tray = new Tray(path.join(__dirname, '../../assets/icon256.png'))
    const contextMenu = Menu.buildFromTemplate([
      { label: '打开渔捞鼠标穿透', click: () => setMouseThrough(this.win, true) },
      { label: '关闭渔捞鼠标穿透', click: () => setMouseThrough(this.win, false) },
      { label: '重置窗口位置', click: () => resetWindowPos() },
      { label: '退出鱼糕程序', click: quitFn },
    ])

    callTargetSafe(this.tray, it => it.setToolTip('点击显示鱼糕'))
    callTargetSafe(this.tray, it => it.setContextMenu(contextMenu))
    callTargetSafe(this.tray, it => it.on('click', () => showAndFocus(this.win)))
  }

  destroy() {
    this.tray.destroy()
  }
}

module.exports = { ScreenTray }
