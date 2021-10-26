const Store = require('electron-store')
const log = require('electron-log')
const { app } = require('electron')
const _ = require('lodash')
const cloneDeep = require('lodash/cloneDeep')

const DEFAULT_DISPLAY_CONFIG = {
  screenDisplayId: undefined,
}

const DEFAULT_MAIN_WINDOW_CONFIG = {
  x: 100,
  y: 100,
  w: 1080,
  h: 768,
}

const initSetting = (configStore, key, defaultVal) => {
  const setting = configStore.get(key)
  if (!setting) {
    configStore.set(key, defaultVal)
    log.info('Initialize user config in', app.getPath('userData'), 'of', key)
  } else {
    configStore.set(key, _.merge(cloneDeep(defaultVal), setting))
    log.debug(`Config [${key}] Read`, JSON.stringify(configStore.get(key)))
  }
}

class ScreenSetting {
  constructor() {
    this.configStore = new Store()
    initSetting(this.configStore, CONFIG_DISPLAY, DEFAULT_DISPLAY_CONFIG)
    initSetting(this.configStore, CONFIG_MAIN_WINDOW, DEFAULT_MAIN_WINDOW_CONFIG)
  }

  updateSetting(key, value) {
    this.configStore.set(key, value)
  }

  getSetting(key) {
    return this.configStore.get(key)
  }
}



const CONFIG_DISPLAY = 'displayConfig'
const CONFIG_MAIN_WINDOW = 'mainWindowConfig'

module.exports = { ScreenSetting, CONFIG_DISPLAY, CONFIG_MAIN_WINDOW }
