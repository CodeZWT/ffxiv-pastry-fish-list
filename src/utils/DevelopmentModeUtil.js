export default {
  isTest() {
    return process.env.VUE_APP_MODE === 'develop'
  },
}
