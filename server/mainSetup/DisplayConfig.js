const { CONFIG_DISPLAY } = require('./ScreenSetting')

class DisplayConfig {
  constructor(screen, setting) {
    this.screen = screen
    this.setting = setting
    this.setTargetDisplay(this.setting.getSetting(CONFIG_DISPLAY).screenDisplayId)
  }

  getPos() {
    return {
      x: this.x,
      y: this.y,
    }
  }

  getDisplayInfo() {
    return {
      displayIds: this.screen.getAllDisplays().map(d => d.id),
      screenDisplayId: this.screenDisplayId,
    }
  }

  setTargetDisplay(displayId) {
    const primaryDisplayId = this.screen.getPrimaryDisplay().id
    const screenDisplayId = displayId || primaryDisplayId
    const displays = this.screen.getAllDisplays()
    const targetDisplay = displays.find(d => d.id === screenDisplayId) ||
      displays.find(d => d.id === primaryDisplayId)

    if (targetDisplay) {
      this.screenDisplayId = targetDisplay.id
      this.x = targetDisplay.workArea.x
      this.y = targetDisplay.workArea.y
      this.setting.updateSetting(CONFIG_DISPLAY, {
        screenDisplayId: this.screenDisplayId,
      })
    }
  }

  reset() {
    this.setTargetDisplay()
  }
}

module.exports = { DisplayConfig }
