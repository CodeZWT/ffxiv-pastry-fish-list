import { DATA } from '@/store/data'

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
  weatherAt(zone, eorzeaTime) {
    const seed = calculateForecastTarget(eorzeaTime.toEarthTime())
    return DATA.WEATHER_RATES[zone].weather_rates.find(it => seed < it[1])[0]
  },
}
