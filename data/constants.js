module.exports = {
  INTERVAL_SECOND: 1000,
  INTERVAL_MINUTE: 60000,
  INTERVAL_HOUR: 3600000,
  INTERVAL_DAY: 86400000,

  FEATURE_GROUP_MAIN: 'main',
  FEATURE_GROUP_READER: 'reader',

  GLOBAL_PATCH_VERSION: 6.1,
  CN_PATCH_VERSION: 6.01,

  DIADEM_ZONE: 1647,
  OCEAN_FISHING_ZONE: 3443,

  REGIONS: ['CN', 'Global'],
  MONITOR_TYPES: ['RawSocket', 'WinPCap'],

  UPLOAD_LIMIT: 100,

  TUGS: ['light', 'medium', 'heavy'],
  TUG_COLOR: {
    light: 'success',
    medium: 'error',
    heavy: 'warning',
  },

  FISHING: 0,
  WAITING: 1,
  ALL_AVAILABLE: 2,
}
