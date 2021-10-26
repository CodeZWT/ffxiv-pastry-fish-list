const log = require('electron-log')
const { dialog, app } = require('electron')
const { setOnTop, callWindowSafe } = require('./utils')

class Unhandled {
  constructor(wins) {
    this.wins = wins
    process.on('uncaughtException', error => {
      this.handleError('Unhandled Error', error)
    })

    process.on('unhandledRejection', error => {
      this.handleError('Unhandled Promise Rejection', error)
    })
  }

  handleError(msg, error) {
    log.error(msg, error)
    this.wins.forEach(it => {
      callWindowSafe(it, win => {
        setOnTop(win, false)
        win.close()
      })
      callWindowSafe(it, win => {
        setOnTop(win, false)
        win.close()
      })
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
