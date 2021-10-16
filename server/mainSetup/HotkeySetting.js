const { globalShortcut } = require('electron')

class HotkeySetting {
  constructor(setting, fn2Callback) {
    this.setting = {}
    this.fn2Callback = fn2Callback
    this.bindHotkey(setting)
  }

  bindHotkey(setting) {
    Object.entries(setting).forEach(([fn, hotkey]) => {
      const oldHotkey = this.setting[fn]
      if (oldHotkey !== hotkey) {
        if (oldHotkey) {
          globalShortcut.unregister(oldHotkey)
        }
        const callback = this.fn2Callback[fn]
        if (callback) {
          globalShortcut.register(hotkey, callback)
        }
      }
    })
    Object.assign(this.setting, setting)
  }
}

module.exports = { HotkeySetting }
