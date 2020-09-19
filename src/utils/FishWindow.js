import EorzeaWeather from '@/utils/Weather'

const FISH_WINDOW_FORECAST_N = 10

export default {
  computeFishWindowIfExist(territoryId, periodStart, hourStart, hourEnd, previousWeatherSet, weatherSet) {
    const periodEnd = periodStart.toNextWeatherInterval()
    const prevPeriodStart = periodStart.toPreviousWeatherInterval()
    const restraintStartTime = periodStart.timeOfHours(hourStart)
    const restraintEndTime = periodStart.timeOfHours(hourStart < hourEnd ? hourEnd : 24 + hourEnd)

    if (periodStart.time >= restraintEndTime.time || periodEnd.time <= restraintStartTime.time) {
      // NOTE: if current checking period has no overlap with hour restraint of fish
      // just return
      return
    }
    // const periodHourStart = periodStart.getHours()
    // const periodHourEnd = periodEnd.getHours() === 0 ? 24 : periodEnd.getHours()
    // console.debug('------', hourStart, hourEnd, previousWeatherSet, weatherSet)
    if (
      (previousWeatherSet.length === 0 ||
        previousWeatherSet.indexOf(EorzeaWeather.weatherAt(territoryId, prevPeriodStart)) !== -1) &&
      (weatherSet.length === 0 || weatherSet.indexOf(EorzeaWeather.weatherAt(territoryId, periodStart)) !== -1)
    ) {
      // console.debug(prevPeriodStart.toString(), periodStart.toString())
      // console.debug(
      //   EorzeaWeather.weatherAt(territoryId, prevPeriodStart),
      //   EorzeaWeather.weatherAt(territoryId, periodStart)
      // )
      return [
        periodStart.time > restraintStartTime.time ? periodStart : restraintStartTime,
        periodEnd.time <= restraintEndTime.time ? periodEnd : restraintEndTime,
        // NOTE:
        // be careful set day to 24 makes it become next day
        // so if 24 === 24, just return current time
        // periodHourEnd <= hourEnd ? periodEnd : periodEnd.timeOfHours(hourEnd),
      ].map(et => {
        // console.debug('et', et.toString())
        return et.toEarthTime()
      })
    }
    return undefined
  },

  getNextNFishWindows(
    territoryId,
    eorzeaTime,
    hourStart,
    hourEnd,
    previousWeatherSet,
    weatherSet,
    n = FISH_WINDOW_FORECAST_N
  ) {
    if (previousWeatherSet.length === 0 && weatherSet.length === 0 && hourStart === 0 && hourEnd === 24) {
      console.warn('not time and weather restraint fish!')
      return []
    }
    // combine fish windows if connected
    // also ensure return count = n
    const fishWindows = []
    let counter = 0
    let time = eorzeaTime.toWeatherCheckPoint()
    let loopCounter = 0
    // console.debug(new Date(time.time))
    while (counter < n && loopCounter < 10000) {
      loopCounter++
      const fishWindow = this.computeFishWindowIfExist(
        territoryId,
        time,
        hourStart,
        hourEnd,
        previousWeatherSet,
        weatherSet
      )
      if (fishWindow) {
        if (fishWindows.length > 0) {
          const lastIndex = fishWindows.length - 1

          const lastItem = fishWindows[lastIndex]
          if (lastItem[1] === fishWindow[0]) {
            fishWindows.splice(fishWindows.length - 1, 1, [lastItem[0], fishWindow[1]])
          } else {
            fishWindows.push(fishWindow)
            counter++
          }
        } else {
          fishWindows.push(fishWindow)
          counter++
        }
      }
      time = time.toNextWeatherInterval()
    }
    // console.debug('loop count', loopCounter)
    return fishWindows
  },
}
