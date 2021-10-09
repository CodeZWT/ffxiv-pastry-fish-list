const Store = require("electron-store");
const log = require("electron-log");
const { app, globalShortcut } = require("electron");
const merge = require("lodash/merge");
const cloneDeep = require("lodash/cloneDeep");
const get = require("lodash/get");
const set = require("lodash/set");
const { setMouseThrough } = require("./utils");
let HOTKEY_SETTING_KEY = 'hotkeySettingV2'

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
const DEFAULT_HOTKEY_SETTING = {
  mouseThrough: '`',
  toggleReader: 'K',
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
    initSetting(this.configStore, HOTKEY_SETTING_KEY, DEFAULT_HOTKEY_SETTING)
    this.hotkeySetting = this.configStore.get(HOTKEY_SETTING_KEY)
    this.enableMouseThrough = false
  }

  setSender(sender) {
    this.sender = sender
  }

  saveHotkeySetting(win, path, value) {
    const old = get(this.hotkeySetting, path)
    if (value !== old) {
      if (old) {
        globalShortcut.unregister('Alt+' + old)
      }
      set(this.hotkeySetting, path, value)
      this.configStore.set(HOTKEY_SETTING_KEY, this.hotkeySetting)
      this.setupHotkey(win)
    }
  }

  setupHotkey(win){
    globalShortcut.register('Alt+'+this.hotkeySetting.mouseThrough, () => {
      const enableMouseThrough = !this.enableMouseThrough
      setMouseThrough(win, enableMouseThrough)
      this.sender.send('setMouseThrough', enableMouseThrough)
      this.enableMouseThrough = enableMouseThrough
    })
  }
}


module.exports = {ScreenSetting}
