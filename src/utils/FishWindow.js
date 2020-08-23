import EorzeaWeather from "@/utils/Weather";

const FISH_WINDOW_FORECAST_N = 10;

export default {
  computeFishWindowIfExist(territoryId, periodStart, hourStart, hourEnd, previousWeatherSet, weatherSet) {
    const periodEnd = periodStart.toNextWeatherInterval()
    const prevPeriodStart = periodStart.toPreviousWeatherInterval()
    const periodHourStart = periodStart.getHours()
    const periodHourEnd = periodEnd.getHours() === 0 ? 24 : periodEnd.getHours()

    if (periodHourStart < hourEnd) {
      if (
        (previousWeatherSet.length === 0 ||
          previousWeatherSet.indexOf(EorzeaWeather.weatherAt(territoryId, prevPeriodStart)) !== -1) &&
        (weatherSet.length === 0 || weatherSet.indexOf(EorzeaWeather.weatherAt(territoryId, periodStart)) !== -1)
      ) {
        console.debug(prevPeriodStart, periodStart)
        console.debug(
          EorzeaWeather.weatherAt(territoryId, prevPeriodStart),
          EorzeaWeather.weatherAt(territoryId, periodStart)
        )
        return [
          periodHourStart > hourStart ? periodStart : periodStart.timeOfHours(hourStart),
          periodHourEnd < hourEnd ? periodEnd : periodEnd.timeOfHours(hourEnd),
        ].map(et => {
          console.debug('et', et.toString())
          return et.toEarthTime()
        })
      }
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
    // TODO combine fish windows if connected
    // also ensure return count = n
    const fishWindows = []
    let counter = 0
    let time = eorzeaTime.toWeatherCheckPoint()
    console.debug(new Date(time.time))
    while (counter < n) {
      const fishWindow = this.computeFishWindowIfExist(
        territoryId,
        time,
        hourStart,
        hourEnd,
        previousWeatherSet,
        weatherSet
      )
      if (fishWindow) {
        fishWindows.push(fishWindow)
        counter++
      }
      time = time.toNextWeatherInterval()
    }
    return fishWindows
  },
}