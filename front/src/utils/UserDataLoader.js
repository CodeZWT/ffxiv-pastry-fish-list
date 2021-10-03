import DataUtil from '@/utils/DataUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import cloneDeep from 'lodash/cloneDeep'

export function loadUserData() {
  return DataUtil.migrateOldVersionUserData(
    DataUtil.mergeUserData(
      cloneDeep(DataUtil.USER_DEFAULT_DATA),
      LocalStorageUtil.loadUserData()
    )
  )
}

export function loadBaitFilterUserData() {
  return {
    ...cloneDeep(DataUtil.USER_DEFAULT_DATA.baitFilter),
    ...LocalStorageUtil.loadBaitFilter(),
  }
}

export function loadReaderUserData() {
  return DataUtil.mergeReaderUserData(
    cloneDeep(DataUtil.READER_DEFAULT_DATA),
    LocalStorageUtil.loadReaderUserData()
  )
}
