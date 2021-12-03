const REGION_KEY = 'RC_REGION'

const SystemInfo = {
  region: window ? window.localStorage.getItem(REGION_KEY) || 'CN' : 'Global',
}

const setRegion = region => {
  // SystemInfo.region = region
  window.localStorage.setItem(REGION_KEY, region)
}

module.exports = {
  SystemInfo,
  setRegion,
}
