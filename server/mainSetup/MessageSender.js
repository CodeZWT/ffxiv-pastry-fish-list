const { callWindowSafe } = require('./utils')

class MessageSender {
  constructor(screen, main) {
    this.screen = screen
    this.main = main
  }

  send(msg, data) {
    callWindowSafe(this.screen, win => win.webContents.send(msg, data))
  }

  sendMain(msg, data) {
    callWindowSafe(this.main, win => win.webContents.send(msg, data))
  }
}

module.exports = { MessageSender }
