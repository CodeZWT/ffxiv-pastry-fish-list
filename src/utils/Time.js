const EARTH_TO_EROZEA = 3600 / 175
const EROZEA_TO_EARTH = 1 / EARTH_TO_EROZEA
const ONE_HOUR_INTERVAL = 3600 * 1000
export const WEATHER_CHANGE_INTERVAL = 8 * ONE_HOUR_INTERVAL
export const WEATHER_CHANGE_INTERVAL_EARTH = WEATHER_CHANGE_INTERVAL * EROZEA_TO_EARTH
const ONE_DAY_INTERVAL = 24 * ONE_HOUR_INTERVAL

export default class EorzeaTime {
  constructor(time) {
    if (time != null) {
      this.time = time
    } else {
      this.time = EorzeaTime.toEorzeaTime(Date.now())
    }
  }

  toEarthTime() {
    return EorzeaTime.toEarthTime(this.time)
  }

  toString() {
    const date = new Date(this.time)
    return (
      date.getUTCHours() +
      ':' +
      date
        .getUTCMinutes()
        .toString()
        .padStart(2, '0')
    )
  }

  getHours() {
    return new Date(this.time).getUTCHours()
  }

  timeOfHours(hours) {
    return new EorzeaTime(this.time - (this.time % ONE_DAY_INTERVAL) + hours * ONE_HOUR_INTERVAL)
  }

  getWeatherCheckPeriod() {
    const startTime = this.time - 2 * (this.time % WEATHER_CHANGE_INTERVAL)
    return [new EorzeaTime(startTime - WEATHER_CHANGE_INTERVAL), new EorzeaTime(startTime)]
  }

  toWeatherCheckPoint() {
    return new EorzeaTime(this.time - (this.time % WEATHER_CHANGE_INTERVAL))
  }

  toPreviousWeatherInterval() {
    return new EorzeaTime(this.time - WEATHER_CHANGE_INTERVAL)
  }

  toNextWeatherInterval() {
    return new EorzeaTime(this.time + WEATHER_CHANGE_INTERVAL)
  }

  static toEorzeaTime(date) {
    return date * EARTH_TO_EROZEA
  }

  static toEarthTime(erozeaDate) {
    return Math.ceil(erozeaDate * EROZEA_TO_EARTH)
  }

  static minOf(time1, time2) {
    return time1.time > time2.time ? time2 : time1
  }

  static maxOf(time1, time2) {
    return time1.time > time2.time ? time1 : time2
  }
}
