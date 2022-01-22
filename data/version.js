const { CN_PATCH_VERSION, GLOBAL_PATCH_VERSION } = require('./constants')
const REGION_KEY = 'RC_REGION'
const DATA_LOCALE_KEY = 'RC_DATA_LOCALE'
const UI_LOCALE_KEY = 'RC_UI_LOCALE'

let region = 'Global'
let dataLocale = 'chs'
let uiLocale = process.env.VUE_APP_I18N_LOCALE

const reloadSystemInfo = () => {
  if (typeof window !== 'undefined') {
    region = window.localStorage.getItem(REGION_KEY) || 'CN'
    dataLocale = window.localStorage.getItem(DATA_LOCALE_KEY) || 'chs'
    uiLocale = window.localStorage.getItem(UI_LOCALE_KEY) || process.env.VUE_APP_I18N_LOCALE
  }
}

reloadSystemInfo()

const PATCHES_CN = {
  '2.x': [2.0, 2.1, 2.2, 2.3, 2.4, 2.5],
  '3.x': [3.0, 3.1, 3.2, 3.3, 3.4, 3.5],
  '4.x': [4.0, 4.1, 4.2, 4.3, 4.4, 4.5],
  '5.x': [5.0, 5.1, 5.2, 5.3, 5.4, 5.5],
}

const PATCHES_GLOBAL = Object.assign({}, PATCHES_CN, {
  '6.x': [6.0],
})

const SystemInfo = {
  region: region,
  patch: region === 'CN' ? CN_PATCH_VERSION : GLOBAL_PATCH_VERSION,
  patches: region === 'CN' ? PATCHES_CN : PATCHES_GLOBAL,
  fishEyesMaxPatchExclude: region === 'CN' ? 4 : 5,
  dataLocale: dataLocale,
  uiLocale: uiLocale
}

const setRegion = region => {
  // SystemInfo.region = region
  window.localStorage.setItem(REGION_KEY, region)
}

const setDataLocale = dataLocale => {
  // SystemInfo.dataLocale = dataLocale
  window.localStorage.setItem(DATA_LOCALE_KEY, dataLocale)
}

const setUILocale = locale => {
  SystemInfo.uiLocale = locale
  window.localStorage.setItem(UI_LOCALE_KEY, locale)
}

module.exports = {
  SystemInfo,
  reloadSystemInfo,
  setRegion,
  setDataLocale,
  setUILocale,
}
