export default {
  isTest() {
    return process.env.NODE_ENV === 'development'
  },
  isElectron() {
    return process.env.VUE_APP_ELECTRON === 'true'
  },
}
