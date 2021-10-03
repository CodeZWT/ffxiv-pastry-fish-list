// 晴天	碧空	晴朗	热浪
// 曇天	阴云	薄雾	微风	扬沙	妖雾
// 曇晴	碧空	晴朗	阴云	薄雾
// 雨天	小雨	暴雨	雷雨	小雪	暴雪
// 荒天	强风	小雨	暴雨	打雷	雷雨	热浪	暴雪	妖雾
// 降雪	小雪	暴雪

const _ = require('lodash')
const spotWeather = require('./spotWeather')
const DATA_CN = require('./translation')

const WeatherCategory = [
  // 晴天	碧空	晴朗	热浪
  {
    name: '晴天',
    weathers: [1, 2, 14],
  },
  // 曇天	阴云	薄雾	微风	扬沙	妖雾
  {
    name: '曇天',
    weathers: [3, 4, 5, 11, 17],
  },
  // 曇晴	碧空	晴朗	阴云	薄雾
  {
    name: '曇晴',
    weathers: [1, 2, 3, 4],
  },
  // 雨天	小雨	暴雨	雷雨	小雪	暴雪
  {
    name: '雨天',
    weathers: [7, 8, 10, 15, 16],
  },
  // 荒天	强风	小雨	暴雨	打雷	雷雨	热浪	暴雪	妖雾
  {
    name: '荒天',
    weathers: [6, 7, 8, 9, 10, 14, 16, 17],
  },
  // 降雪	小雪	暴雪
  {
    name: '降雪',
    weathers: [15, 16],
  },
]

const checkFishWeather = (fishList, detailedFishDict) => {
  const res = fishList
    .map(fish => {
      if (
        (fish.patch == null || (fish.patch > 4.2 && fish.patch < 5)) &&
        (fish.weatherSet.length > 0 || fish.previousWeatherSet.length > 0) &&
        fish.locations.length === 1
      ) {
        const availableWeathers = spotWeather[fish.locations[0]].filter(it => it > 0)
        const prev = checkWeatherSet(availableWeathers, fish.previousWeatherSet)
        const current = checkWeatherSet(availableWeathers, fish.weatherSet)
        if (prev.length > 0 || current.length > 0) {
          const detail = detailedFishDict[fish._id]
          let str = detail.name
          if (fish.previousWeatherSet.length > 0) {
            str += [
              '\n前置天气',
              '\n现：',
              detail.previousWeatherSetDetail.map(it => it.name).join(','),
              '\n',
              toCategoryStr(prev),
            ].join('')
          }
          if (fish.weatherSet.length > 0) {
            str += [
              '\n当前天气',
              '\n现：',
              detail.weatherSetDetail.map(it => it.name).join(','),
              '\n',
              toCategoryStr(current),
            ].join('')
          }
          return str
        }
      }
      return ''
    })
    .filter(it => it !== '')
    .join('\n\n')

  console.debug(res)
}

const toCategoryStr = categoryResult => {

  return(categoryResult.length > 0 ? '可能：' : '')+ categoryResult
    .map(
      category => `[${category[0]}] ${category[1].map(w => toWeatherName(w)).join(',')}`
    )
    .join(' | ')
}

const toWeatherName = weather => {
  return DATA_CN.WEATHER_TYPES[weather].name_chs
}

const checkWeatherSet = (availableWeathers, weatherSet) => {
  if (weatherSet.length === 0) return []
  const possibleCategory = WeatherCategory.filter(c => {
    const includesAllWeathers = _.every(weatherSet, fishW => c.weathers.includes(fishW))
    return includesAllWeathers
  })
  return possibleCategory.flatMap(possibleC => {
    const realPossibleWeathers = possibleC.weathers.filter(w =>
      availableWeathers.includes(w)
    )
    if (
      realPossibleWeathers.length > 0 &&
      realPossibleWeathers.length > weatherSet.length
    ) {
      // console.log(type, possibleC.name, realPossibleWeathers)
      return [[possibleC.name, realPossibleWeathers]]
    }
    return []
  })
}
module.exports = { checkFishWeather }
