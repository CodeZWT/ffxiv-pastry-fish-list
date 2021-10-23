const Store = require('electron-store')
const log = require('electron-log')
const { app } = require('electron')
const merge = require('lodash/merge')
const cloneDeep = require('lodash/cloneDeep')

const DEFAULT_DISPLAY_SETTING = {
  displayId: undefined,
}

const initSetting = (configStore, key, defaultVal) => {
  const setting = configStore.get(key)
  if (!setting) {
    configStore.set(key, defaultVal)
    log.info('Initialize user config in', app.getPath('userData'), 'of', key)
  } else {
    configStore.set(key, merge(cloneDeep(defaultVal), setting))
    log.debug(`Config [${key}] Read`, JSON.stringify(configStore.get(key)))
  }
}

class ScreenSetting {
  constructor() {
    this.configStore = new Store()
    initSetting(this.configStore, CONFIG_DISPLAY, DEFAULT_DISPLAY_SETTING)
  }

  updateSetting(key, value) {
    this.configStore.set(key, value)
  }

  getSetting(key) {
    return this.configStore.get(key)
  }
}

const CONFIG_DISPLAY = 'displayConfig'

module.exports = { ScreenSetting, CONFIG_DISPLAY }
