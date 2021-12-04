const { CN_PATCH_VERSION, GLOBAL_PATCH_VERSION } = require('Data/constants')
const REGION_KEY = 'RC_REGION'

const region = window ? window.localStorage.getItem(REGION_KEY) || 'CN' : 'Global'

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
}

const setRegion = region => {
  // SystemInfo.region = region
  window.localStorage.setItem(REGION_KEY, region)
}

module.exports = {
  SystemInfo,
  setRegion,
}
