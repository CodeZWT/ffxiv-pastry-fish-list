import prettyMilliseconds from 'pretty-ms'

const HOST = 'https://cafemaker.wakingsands.com'

export default {
  iconIdToUrl(iconId) {
    return `${HOST}/i/${iconId.substring(0, 3)}000/${iconId}.png`
  },
  getName(multiLanguageItem, locale = 'chs') {
    return multiLanguageItem['name_' + locale] ? multiLanguageItem['name_' + locale] : multiLanguageItem['name_en']
  },

  getCountDownTypeName(countDown) {
    return `countDown.${this.COUNT_DOWN_TYPE[countDown]}`
  },

  hasTimeConstraint(countDown) {
    return countDown.type !== this.ALL_AVAILABLE
  },

  printCountDownTime(time, dict) {
    if (time != null) {
      return prettyMilliseconds(time, {
        verbose: true,
        unitCount: 2,
        secondsDecimalDigits: 0,
      })
        .split(' ')
        .map(it => {
          if (isNaN(it)) {
            return dict[it]
          } else return it
        })
        .join('')
    } else {
      return ''
    }
  },
  TIME_UNITS: ['days', 'hours', 'minutes', 'seconds'],

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
}
