const { Menu, Tray } = require('electron')
const path = require('path')
const { callTargetSafe, showAndFocus, setMouseThrough } = require('./utils')
const { callWindowSafe } = require('./utils')

class ScreenTray {
  constructor(win, quitFn, displayConfig) {
    this.win = win
    this.displayConfig = displayConfig
    this.tray = new Tray(path.join(__dirname, '../../assets/icon256.png'))
    const contextMenu = Menu.buildFromTemplate([
      { label: '打开渔捞鼠标穿透', click: () => setMouseThrough(this.win, true) },
      { label: '关闭渔捞鼠标穿透', click: () => setMouseThrough(this.win, false) },
      { label: '重置窗口位置', click: () => this.resetWindowPos() },
      { label: '退出鱼糕程序', click: quitFn },
    ])

    callTargetSafe(this.tray, it => it.setToolTip('点击显示鱼糕'))
    callTargetSafe(this.tray, it => it.setContextMenu(contextMenu))
    callTargetSafe(this.tray, it => it.on('click', () => showAndFocus(this.win)))
  }

  resetWindowPos() {
    callWindowSafe(this.win, win => {
      this.displayConfig.reset()
      win.setPosition(0, 0)
      win.show()
      win.maximize()
    })
  }

  destroy() {
    this.tray.destroy()
  }
}

module.exports = { ScreenTray }
