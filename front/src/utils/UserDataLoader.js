import cloneDeep from 'lodash/cloneDeep'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import DataUtil from '@/utils/DataUtil'

export function loadUserData() {
  return DataUtil.migrateOldVersionUserData(
    DataUtil.mergeUserData(
      cloneDeep(DataUtil.USER_DEFAULT_DATA),
      LocalStorageUtil.loadAndBackupUserData()
    )
  )
}

export function loadBaitFilterUserData() {
  return {
    ...cloneDeep(DataUtil.USER_DEFAULT_DATA.baitFilter),
    ...LocalStorageUtil.loadBaitFilter(),
  }
}
