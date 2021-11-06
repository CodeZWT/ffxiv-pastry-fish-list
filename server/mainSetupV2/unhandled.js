const log = require('electron-log')
const { dialog, app } = require('electron')

class Unhandled {
  constructor(onUnhandled) {
    this.onUnhandled = onUnhandled
    process.on('uncaughtException', error => {
      this.handleError('Unhandled Error', error)
    })

    process.on('unhandledRejection', error => {
      this.handleError('Unhandled Promise Rejection', error)
    })
  }

  handleError(msg, error) {
    log.error(msg, error)

    dialog.showMessageBoxSync({
      type: 'error',
      message: '发生错误，即将关闭...\n'+error,
      title: 'Error',
    })
    this.onUnhandled && this.onUnhandled()
  }
}

module.exports = {Unhandled}
