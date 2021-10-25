const log = require('electron-log')
const { dialog, app } = require('electron')
const { setOnTop, callWindowSafe } = require('./utils')

class Unhandled {
  constructor(win, loadingWin) {
    this.win = win
    this.loadingWin = loadingWin
    process.on('uncaughtException', error => {
      this.handleError('Unhandled Error', error)
    })

    process.on('unhandledRejection', error => {
      this.handleError('Unhandled Promise Rejection', error)
    })
  }

  handleError(msg, error) {
    log.error(msg, error)
    callWindowSafe(this.loadingWin, win => {
      setOnTop(win, false)
      win.close()
    })
    callWindowSafe(this.win, win => {
      setOnTop(win, false)
      win.close()
    })

    dialog.showMessageBoxSync({
      type: 'error',
      message: '发生错误，即将关闭...\n'+error,
      title: 'Error',
    })
    app.quit()
  }
}

module.exports = {Unhandled}
