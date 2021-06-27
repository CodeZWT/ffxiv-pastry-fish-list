import store from 'store2'
import DataUtil from '@/utils/DataUtil'

const USER_DATA_KEY = 'userData'
const BAIT_FILTER_KEY = 'baitFilter'
// const USER_DATA_KEY_LOAD_BACKUP = USER_DATA_KEY + 'LoadBackup'
// const USER_DATA_KEY_STORE_BACKUP = USER_DATA_KEY + 'StoreBackup'
const VIEWED_FEATURES_KEYS = {
  main: 'mainViewedFeatures',
  reader: 'readerViewedFeatures',
}
const READER_USER_DATA_KEY = 'readerUserData'

export default {
  storeUserData(userData) {
    store.set(USER_DATA_KEY, userData)
  },

  loadUserData() {
    return store.get(USER_DATA_KEY)
  },

  storeReaderUserData(userData) {
    store.set(READER_USER_DATA_KEY, userData)
  },

  loadReaderUserData() {
    // Deal with old version data which was stored in `userData`
    let readerSetting =
      store.get(READER_USER_DATA_KEY) ?? store.get(USER_DATA_KEY)?.reader
    if (readerSetting == null) {
      readerSetting = DataUtil.READER_DEFAULT_DATA
      store.set(READER_USER_DATA_KEY, readerSetting)
    }
    return readerSetting
  },

  storeBaitFilter(baitFilter) {
    store.set(BAIT_FILTER_KEY, baitFilter)
  },

  loadBaitFilter() {
    return store.get(BAIT_FILTER_KEY)
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
