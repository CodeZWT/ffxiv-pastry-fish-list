export default {
  isTest() {
    return process.env.VUE_APP_MODE === 'develop'
  },
  isLocal() {
    return process.env.NODE_ENV === 'development'
  },
  isElectron() {
    return process.env.VUE_APP_ELECTRON === 'true'
  },
}
