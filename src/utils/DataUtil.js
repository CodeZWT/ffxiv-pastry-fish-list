import TimeFormatter from '@/utils/TimeFormatter'
import { DateTime } from 'luxon'

const NOTIFICATION_SOUNDS = [
  { key: 'mute', name_chs: '静音', filename: null },
  { key: 'incomingTell1', name_chs: '提示音1', filename: 'FFXIV_Incoming_Tell_1.mp3' },
  { key: 'incomingTell2', name_chs: '提示音2', filename: 'FFXIV_Incoming_Tell_2.mp3' },
  { key: 'incomingTell3', name_chs: '提示音3', filename: 'FFXIV_Incoming_Tell_3.mp3' },
  { key: 'aggro', name_chs: '遇敌', filename: 'FFXIV_Aggro.mp3' },
  { key: 'confirm', name_chs: '确认', filename: 'FFXIV_Confirm.mp3' },
  { key: 'linkshellTransmission', name_chs: '通讯贝', filename: 'FFXIV_Linkshell_Transmission.mp3' },
  { key: 'notification', name_chs: '通知', filename: 'FFXIV_Notification.mp3' },
]

export default {
  iconIdToUrl(iconId) {
    if (iconId == null) return ''
    const iconIdStr = iconId + ''
    const icon = iconIdStr.padStart(6, '0')
    const path = icon.substring(0, 3) + '000'
    return `${this.XIV_API_HOST}/i/${path}/${icon}.png`
  },
  iconIdToClass(iconId) {
    if (iconId == null) return ''
    const iconIdStr = iconId + ''
    const icon = iconIdStr.padStart(6, '0')
    return `bg-${icon}`
  },
  getName(multiLanguageItem, locale = 'chs') {
    return multiLanguageItem['name_' + locale] ? multiLanguageItem['name_' + locale] : multiLanguageItem['name_en']
  },

  getCountDownTypeName(countDown) {
    return `countDown.${this.COUNT_DOWN_TYPE[countDown]}`
  },

  hasCountDown(countDown) {
    return countDown != null && countDown.type !== this.ALL_AVAILABLE
  },

  printCountDownTime(time, showCnt = 1, paddingZero = true) {
    return TimeFormatter.millisecondsToText(time, showCnt, true, paddingZero)
  },

  secondsToFishEyesString(seconds) {
    if (seconds === true) return ''
    return TimeFormatter.millisecondsToText(seconds * 1000, 2, false, false)
  },

  // completed
  getPredators(fish, allFish, fishListTimePart = {}, fishListWeatherChangePart = {}) {
    if (fish == null || allFish == null) return []
    return Object.entries(fish.predators).map(([predatorId, count]) => {
      return {
        ...allFish[predatorId],
        requiredCnt: count,
        isPredator: true,
        fishTimePart:
          fishListTimePart[predatorId] == null
            ? { id: predatorId, countDown: { type: this.ALL_AVAILABLE } }
            : fishListTimePart[predatorId],
        fishWeatherChangePart: fishListWeatherChangePart[predatorId],
        // finalTargetCompleted: completed,
        // finalTargetCountDownType: fishListTimePart[fish._id]?.countDown?.type,
      }
    })
  },

  // convert pixel coordinate to game map coordinate
  // e.g. 2048 to 42
  // ref: https://github.com/xivapi/ffxiv-datamining/blob/master/docs/MapCoordinates.md
  pixelToPos(sizeFactor, pixelIndex) {
    const MAP_SIZE_FACTOR_MAGIC = 41
    const MAP_FILE_PIXEL_MAX = 2048
    return (MAP_SIZE_FACTOR_MAGIC / (sizeFactor / 100)) * (pixelIndex / MAP_FILE_PIXEL_MAX) + 1
  },

  getColorByStatus(completed, countDownType, colorIndex = 0, colorTarget = 'FISH') {
    let colorRef
    if (colorTarget === 'FISH') {
      colorRef = this.ITEM_COLOR
    } else {
      colorRef = this.ITEM_BACKGROUND_COLOR
    }
    if (completed) {
      return colorRef.COMPLETED[colorIndex]
    } else {
      switch (countDownType) {
        case this.FISHING:
          return colorRef.FISHING[colorIndex]
        default:
          return colorRef.WAITING[colorIndex]
      }
    }
  },
  isAllAvailableFish(fish) {
    return (
      fish.previousWeatherSet.length === 0 &&
      fish.weatherSet.length === 0 &&
      fish.startHour === 0 &&
      fish.endHour === 24
    )
  },

  formatDateTime(millis) {
    if (millis) {
      return DateTime.fromMillis(millis).toFormat('[MM-dd] HH:mm:ss')
    } else {
      return ''
    }
  },

  formatET(etHours) {
    const integer = etHours - ((etHours * 10) % 10) / 10
    const decimal = etHours - integer
    return integer + (decimal === 0 ? '' : ':' + decimal * 60)
  },

  // no operation placeholder for list item to show as clickable style
  noOp() {},

  toMap(list, keyFn) {
    return list.reduce((dict, item) => {
      dict[keyFn(item)] = item
      return dict
    }, {})
  },

  TIME_UNITS: ['day', 'hour', 'minute', 'second', 'days', 'hours', 'minutes', 'seconds'],

  INTERVAL_SECOND: 1000,
  INTERVAL_MINUTE: 60000,
  INTERVAL_HOUR: 3600000,
  INTERVAL_DAY: 86400000,

  TUG_ICON: {
    light: '!',
    medium: '! !',
    heavy: '! ! !',
  },

  TUG_ICON_COLOR: {
    '!': 'success',
    '! !': 'tertiary',
    '! ! !': 'quinary',
  },

  HOOKSET_ICON: {
    Powerful: '001115',
    Precision: '001116',
  },

  HOOKSET_SKILL_NAME_DICT: {
    Powerful: '强力提钩',
    Precision: '精准提钩',
  },

  COUNT_DOWN_TYPE: ['fishing', 'waiting', 'allAvailable'],

  FISHING: 0,
  WAITING: 1,
  ALL_AVAILABLE: 2,

  ICON_PREDATORS: '011101',
  ICON_SNAGGING: '011102',
  ICON_FISH_EYES: '011103',

  ITEM_COLOR: {
    FISHING: ['tertiary base', 'tertiary darken-2'],
    WAITING: ['transparent', 'transparent'],
    COMPLETED: ['success base', 'success darken-2'],
    NORMAL: ['grey darken-3', 'grey darken-4'],
  },

  ITEM_BACKGROUND_COLOR: {
    FISHING: ['#ad145766', '#880e4f66'],
    COMPLETED: ['#00695c66', '#004d4066'],
    WAITING: ['grey darken-3', 'grey darken-4'],
  },

  PATCH_MAX: 5.2,
  XIV_API_HOST: 'https://cafemaker.wakingsands.com', //'https://xivapi.com',

  USER_DEFAULT_DATA: {
    // website version info
    websiteVersion: '0.1.0',
    completed: [],
    pinned: [],
    toBeNotified: [],
    filters: {
      patches: [
        // eslint-disable-next-line
        2.0,
        2.1,
        2.2,
        2.3,
        2.4,
        2.5,
        // eslint-disable-next-line
        3.0,
        3.1,
        3.2,
        3.3,
        3.4,
        3.5,
        // eslint-disable-next-line
        4.0,
        4.1,
        4.2,
        4.3,
        4.4,
        4.5,
        // eslint-disable-next-line
        5.0,
        5.1,
        5.2,
      ],
      completeType: 'UNCOMPLETED',
      bigFishType: 'BIG_FISH',
      fishN: 10,
    },
    // page settings
    showFilter: true,
    showBanner: true,
    opacity: 1,
    rightPanePercentage: 30,
    notification: {
      volume: 0.5,
      isSystemNotificationEnabled: true,
      settings: [
        {
          key: 'waiting',
          sound: NOTIFICATION_SOUNDS[1].key,
          enabled: true,
          hasBefore: true,
          before: 2,
        },
        {
          key: 'fishing',
          sound: NOTIFICATION_SOUNDS[2].key,
          enabled: true,
          hasBefore: false,
          before: 0,
        },
      ],
    },
    detailArrangement: {
      components: [
        {
          name: 'DetailItemMap',
          expandedEnabled: true,
          expanded: true,
          enabled: true,
          order: 0,
        },
        { name: 'DetailItemCountdownBar', expandedEnabled: false, enabled: true, order: 1 },
        { name: 'DetailItemRequirements', expandedEnabled: false, enabled: true, order: 2 },
        { name: 'DetailItemBuffAndBaits', expandedEnabled: false, enabled: true, order: 3 },
        {
          name: 'DetailItemFishWindowTable',
          expandedEnabled: true,
          expanded: false,
          enabled: true,
          order: 4,
        },
        { name: 'DetailItemPredators', expandedEnabled: false, enabled: true, order: 5 },
      ],
    },
  },

  DETAIL_ITEM_DISPLAY_CONSTRAINTS: {
    DetailItemMap: 'hasFishingSpot',
    DetailItemCountdownBar: false,
    DetailItemRequirements: false,
    DetailItemBuffAndBaits: false,
    DetailItemFishWindowTable: 'hasCountDown',
    DetailItemPredators: 'hasPredators',
  },

  // fish tracker [js/app/viewmodel.js]
  FISH_TRACKER_STRUCTURE: {
    filters: {
      completion: 'all',
      patch: [],
    },
    completed: [],
    pinned: [],
    upcomingWindowFormat: 'fromPrevClose',
    sortingType: 'windowPeriods',
    theme: 'dark',
  },

  TAB_INDEX_PINNED: 0,
  TAB_INDEX_NORMAL: 1,
  TAB_INDEX_TO_BE_NOTIFIED: 2,

  TABS: [
    { icon: 'mdi-pin', title: 'list.pinTitle' },
    { icon: 'mdi-format-list-text', title: 'list.normalTitle' },
    { icon: 'mdi-bell', title: 'list.toBeNotifiedTitle' },
  ],

  NOTIFICATION_SOUNDS: NOTIFICATION_SOUNDS,
}
