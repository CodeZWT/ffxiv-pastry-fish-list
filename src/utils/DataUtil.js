import TimeFormatter from '@/utils/TimeFormatter'

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

  printCountDownTime(time) {
    return TimeFormatter.millisecondsToText(time)
  },

  secondsToFishEyesString(seconds) {
    if (seconds === true) return ''
    return TimeFormatter.millisecondsToText(seconds * 1000, 2, false, false)
  },

  getPredators(fish, allFish, fishListTimePart, fishListWeatherChangePart, completed) {
    if (fish == null || allFish == null) return []
    return Object.entries(fish.predators).map(([predatorId, count]) => {
      return {
        ...allFish[predatorId],
        requiredCnt: count,
        fishTimePart:
          fishListTimePart[predatorId] == null
            ? { id: predatorId, countDown: { type: this.ALL_AVAILABLE } }
            : fishListTimePart[predatorId],
        fishWeatherChangePart: fishListWeatherChangePart[predatorId],
        finalTargetCompleted: completed,
        finalTargetCountDownType: fishListTimePart[fish._id]?.countDown?.type,
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

  getColorByStatus(completed, countDownType) {
    if (completed) {
      return this.ITEM_COLOR.COMPLETED[0]
    } else {
      switch (countDownType) {
        case this.FISHING:
          return this.ITEM_COLOR.FISHING[0]
        default:
          return this.ITEM_COLOR.WAITING[0]
      }
    }
  },

  TIME_UNITS: ['day', 'hour', 'minute', 'second', 'days', 'hours', 'minutes', 'seconds'],

  TUG_ICON: {
    light: '!',
    medium: '!!',
    heavy: '!!!',
  },

  HOOKSET_ICON: {
    Powerful: '001115',
    Precision: '001116',
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
    NORMAL: ['grey darken-2', 'grey darken-4'],
  },

  PATCH_MAX: 5.2,
  XIV_API_HOST: 'https://xivapi.com',
}
