import _ from 'lodash'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import DataUtil from '@/utils/DataUtil'

export function loadUserData() {
  return DataUtil.migrateOldVersionUserData(
    DataUtil.mergeUserData(
      _.cloneDeep(DataUtil.USER_DEFAULT_DATA),
      LocalStorageUtil.loadAndBackupUserData()
    )
  )
}
