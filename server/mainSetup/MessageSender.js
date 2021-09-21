const { callWindowSafe } = require('./utils')

class MessageSender {
  constructor(win) {
    this.win = win
  }

  sendFishingData(data) {
    callWindowSafe(this.win, win => win.webContents.send('fishingData', data))
  }

  send(msg, data) {
    callWindowSafe(this.win, win => win.webContents.send(msg, data))
  }
}

module.exports = { MessageSender }
