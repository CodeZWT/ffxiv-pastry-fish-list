import store from 'store2'

const USER_DATA_KEY = 'userData'
const BAIT_FILTER_KEY = 'baitFilter'
// const USER_DATA_KEY_LOAD_BACKUP = USER_DATA_KEY + 'LoadBackup'
// const USER_DATA_KEY_STORE_BACKUP = USER_DATA_KEY + 'StoreBackup'
const VIEWED_FEATURES_KEYS = {
  main: 'mainViewedFeatures',
  reader: 'readerViewedFeatures',
}

export default {
  storeUserData(userData) {
    store.set(USER_DATA_KEY, userData)
  },

  loadUserData() {
    return store.get(USER_DATA_KEY)
  },

  storeBaitFilter(baitFilter) {
    store.set(BAIT_FILTER_KEY, baitFilter)
  },

  loadBaitFilter() {
    return store.get(BAIT_FILTER_KEY)
  },

  // comment out to implement more useful backup and restore functions
  loadAndBackupUserData() {
    const userData = store.get(USER_DATA_KEY)
    // if (userData) {
    //   store.set(USER_DATA_KEY_LOAD_BACKUP, userData)
    // }
    return userData
  },

  storeAndBackupUserData(userData) {
    // const oldUserData = store.get(USER_DATA_KEY)
    // if (oldUserData) {
    //   store.set(USER_DATA_KEY_STORE_BACKUP, oldUserData)
    // }
    store.set(USER_DATA_KEY, userData)
  },

  loadViewedFeatures(featureGroup) {
    return store.get(VIEWED_FEATURES_KEYS[featureGroup]) || []
  },

  storeViewedFeatures(featureGroup, features) {
    store.set(VIEWED_FEATURES_KEYS[featureGroup], features)
  },

  loadSounds() {
    return store.get(BAIT_FILTER_KEY)
  },

  set(key, data) {
    store.set(key, data)
  },

  get(key) {
    return store.get(key)
  },

  remove(key) {
    store.remove(key)
  },
}
