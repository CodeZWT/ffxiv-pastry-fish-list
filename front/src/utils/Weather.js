import { SystemInfo } from 'Data/version'
import { WEATHER_TYPES } from 'Data/translation'
import DATA from 'Data/data'
import FIX from 'Data/fix'

function calculateForecastTarget(m) {
  // Based on Rougeadyn's SaintCoinach library.
  const unixTime = parseInt(+m / 1000)
  // Get the Eorzea hour for weather start.
  const bell = unixTime / 175
  // Magic needed for calculations:
  // 16:00 = 0, 00:00 = 8, 08:00 = 16 . . .
  const inc = (bell + 8 - (bell % 8)) % 24
  // Take the Eorzea days since Unix Epoch.
  const totalDays = ((unixTime / 4200) << 32) >>> 0 // uint

  // Make the calculations.
  const calcBase = totalDays * 100 + inc
  const step1 = ((calcBase << 11) ^ calcBase) >>> 0
  const step2 = ((step1 >>> 8) ^ step1) >>> 0

  return step2 % 100
}

export default {
  weatherTextOf(weatherId) {
    if (weatherId > 0 && WEATHER_TYPES[weatherId]) {
      return WEATHER_TYPES[weatherId].name_chs
    } else {
      return ''
    }
  },

  weatherAtSpot(spotId, et) {
    const zoneId =
      DATA.FISHING_SPOTS[spotId] && DATA.FISHING_SPOTS[spotId].territoryTypeId
    return this.weatherAt(zoneId, et)
  },
  prevWeatherAtSpot(spotId, et) {
    return this.weatherAtSpot(
      spotId,
      et.toWeatherCheckPoint().toPreviousWeatherInterval()
    )
  },
  weatherAt(zone, eorzeaTime) {
    const earthTime = eorzeaTime.toEarthTime()
    // console.log('zone', zone, new Date(earthTime))
    if (
      earthTime >= FIX.STARLIGHT_CELEBRATION.region[SystemInfo.region]?.startTime &&
      earthTime <= FIX.STARLIGHT_CELEBRATION.region[SystemInfo.region]?.endTime &&
      FIX.STARLIGHT_CELEBRATION.territories.includes(zone)
    ) {
      return FIX.STARLIGHT_CELEBRATION.weather
    }
    const seed = calculateForecastTarget(earthTime)
    return DATA.WEATHER_RATES[zone].weather_rates.find(it => seed < it[1])[0]
  },
}
