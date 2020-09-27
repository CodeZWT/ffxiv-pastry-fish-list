import prettyMilliseconds from 'pretty-ms'

const HOST = 'https://xivapi.com'

export default {
  iconIdToUrl(iconId) {
    if (iconId == null) return ''
    const iconIdStr = iconId + ''
    const icon = iconIdStr.padStart(6, '0')
    const path = icon.substring(0, 3) + '000'
    return `${HOST}/i/${path}/${icon}.png`
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

  printCountDownTime(time, dict) {
    if (time != null) {
      return prettyMilliseconds(time - (time % 1000), {
        verbose: true,
        unitCount: 2,
        secondsDecimalDigits: 0,
        colonNotation: false,
      })
        .split(' ')
        .map(it => {
          if (isNaN(it)) {
            return dict[it]
          } else return it.padStart(2, '0')
        })
        .join('')
    } else {
      return ''
    }
  },

  secondsToFishEyesString(seconds) {
    if (seconds === true) return ''
    const second = seconds % 60
    const minute = (seconds - second) / 60
    return (minute === 0 ? '' : minute + '分') + (second === 0 ? '' : second + '秒')
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

  getColorByStatus(completed, countDownType, oddIndex) {
    if (completed) {
      return this.ITEM_COLOR.COMPLETED[oddIndex]
    } else {
      switch (countDownType) {
        case this.FISHING:
          return this.ITEM_COLOR.FISHING[oddIndex]
        default:
          return this.ITEM_COLOR.WAITING[oddIndex]
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
    FISHING: ['deep-orange lighten-2', 'deep-orange lighten-4'],
    WAITING: ['grey lighten-2', 'grey lighten-3'],
    COMPLETED: ['teal lighten-1', 'teal lighten-2'],
  },

  PATCH_MAX: 5.2,
}
