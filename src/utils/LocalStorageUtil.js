import store from 'store2'

const USER_DATA_KEY = 'userData'
const USER_DATA_KEY_LOAD_BACKUP = USER_DATA_KEY + 'LoadBackup'
const USER_DATA_KEY_STORE_BACKUP = USER_DATA_KEY + 'StoreBackup'

export default {
  storeUserData(userData) {
    store.set(USER_DATA_KEY, userData)
  },

  loadUserData() {
    return store.get(USER_DATA_KEY)
  },

  loadAndBackupUserData() {
    const userData = store.get(USER_DATA_KEY)
    store.set(USER_DATA_KEY_LOAD_BACKUP, userData)
    return userData
  },

  storeAndBackupUserData(userData) {
    store.set(USER_DATA_KEY_STORE_BACKUP, store.get(USER_DATA_KEY))
    store.set(USER_DATA_KEY, userData)
  },
}
