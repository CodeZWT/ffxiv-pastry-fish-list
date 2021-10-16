const Store = require("electron-store");
const log = require("electron-log");
const { app } = require("electron");
const merge = require("lodash/merge");
const cloneDeep = require("lodash/cloneDeep");

const DEFAULT_WINDOW_SETTING = {
  main: {
    pos: { x: 100, y: 100 },
    size: { w: 1080, h: 768 },
    opacity: 0.95,
    zoomFactor: 1,
  },
  setting: {
    pos: { x: 100, y: 100 },
    size: { w: 500, h: 500 },
    opacity: 0.95,
    zoomFactor: 1,
  },
  timer: {
    pos: { x: 100, y: 100 },
    size: { w: 500, h: 250 },
    opacity: 0.95,
    zoomFactor: 1,
  },
  timerMini: {
    pos: { x: 100, y: 100 },
    size: { w: 500, h: 120 },
    opacity: 0.95,
    zoomFactor: 1,
    enabled: false,
  },
  history: {
    pos: { x: 100, y: 100 },
    size: { w: 500, h: 800 },
    opacity: 0.95,
    zoomFactor: 1,
  },
  spotStatistics: {
    pos: { x: 100, y: 100 },
    size: { w: 500, h: 500 },
    opacity: 0.95,
    zoomFactor: 1,
  },
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
};
class ScreenSetting {
  constructor() {
    this.configStore = new Store()
    initSetting(this.configStore, 'windowSetting', DEFAULT_WINDOW_SETTING)
    this.windowSetting = this.configStore.get('windowSetting')
  }
}


module.exports = {ScreenSetting}
