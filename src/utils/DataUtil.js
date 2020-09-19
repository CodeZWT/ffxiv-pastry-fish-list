import prettyMilliseconds from 'pretty-ms'

const HOST = 'https://cafemaker.wakingsands.com'

export default {
  iconIdToUrl(iconId) {
    if (iconId == null) return ''
    return `${HOST}/i/${iconId.substring(0, 3)}000/${iconId}.png`
  },
  getName(multiLanguageItem, locale = 'chs') {
    return multiLanguageItem['name_' + locale] ? multiLanguageItem['name_' + locale] : multiLanguageItem['name_en']
  },

  getCountDownTypeName(countDown) {
    return `countDown.${this.COUNT_DOWN_TYPE[countDown]}`
  },

  hasCountDown(countDown) {
    return countDown.type !== this.ALL_AVAILABLE
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
    return minute + '分' + (second === 0 ? '' : second + '秒')
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
}
