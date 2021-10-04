import DataUtil from '@/utils/DataUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import _ from 'lodash'

export function loadUserData() {
  return DataUtil.migrateOldVersionUserData(
    DataUtil.mergeUserData(
      _.cloneDeep(DataUtil.USER_DEFAULT_DATA),
      LocalStorageUtil.loadUserData()
    )
  )
}

export function loadBaitFilterUserData() {
  return {
    ..._.cloneDeep(DataUtil.USER_DEFAULT_DATA.baitFilter),
    ...LocalStorageUtil.loadBaitFilter(),
  }
}

export function loadReaderUserData() {
  return DataUtil.mergeReaderUserData(
    _.cloneDeep(DataUtil.READER_DEFAULT_DATA),
    LocalStorageUtil.loadReaderUserData()
  )
}
