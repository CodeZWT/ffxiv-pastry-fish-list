export default {
  isTest() {
    return process.env.NODE_ENV === 'development'
  },
  isElectron() {
    return (
      process.env.NODE_ENV === 'development' || process.env.VUE_APP_ELECTRON === 'true'
    )
  },
}
