import _ from 'lodash'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import DataUtil from '@/utils/DataUtil'

const userData = DataUtil.migrateOldVersionUserData(
  DataUtil.mergeUserData(
    _.cloneDeep(DataUtil.USER_DEFAULT_DATA),
    LocalStorageUtil.loadAndBackupUserData()
  )
)

export default userData
