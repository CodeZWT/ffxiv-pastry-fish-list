const { CONFIG_DISPLAY } = require('./ScreenSetting')

class DisplayConfig {
  constructor(screen, setting) {
    this.screen = screen
    this.setting = setting
    this.setTargetDisplay(this.setting.getSetting(CONFIG_DISPLAY).targetDisplayId)
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
      targetDisplayId: this.targetDisplayId,
    }
  }

  setTargetDisplay(displayId) {
    const primaryDisplayId = this.screen.getPrimaryDisplay().id
    const targetDisplayId = displayId || primaryDisplayId
    const displays = this.screen.getAllDisplays()
    const targetDisplay = displays.find(d => d.id === targetDisplayId) ||
      displays.find(d => d.id === primaryDisplayId)

    if (targetDisplay) {
      this.targetDisplayId = targetDisplay.id
      this.x = targetDisplay.workArea.x
      this.y = targetDisplay.workArea.y
      this.setting.updateSetting(CONFIG_DISPLAY, {
        targetDisplayId: this.targetDisplayId,
      })
    }
  }

  reset() {
    this.setTargetDisplay()
  }
}

module.exports = { DisplayConfig }
