const EARTH_TO_EROZEA = 3600 / 175;
const EROZEA_TO_EARTH = 1 / EARTH_TO_EROZEA;
const ONE_HOUR_INTERVAL = 3600 * 1000;
const WEATHER_CHANGE_INTERVAL = 8 * ONE_HOUR_INTERVAL;
const ONE_DAY_INTERVAL = 24 * ONE_HOUR_INTERVAL;

export default class ErozeaTime {
  constructor(time) {
    if (time != null) {
      this.time = time;
    } else {
      this.time = ErozeaTime.toErozeaTime(Date.now());
    }
  }

  toEarthTime() {
    return ErozeaTime.toEarthTime(this.time);
  }

  toString() {
    const date = new Date(this.time);
    return (
      date.getUTCHours() +
      ":" +
      date
        .getUTCMinutes()
        .toString()
        .padStart(2, "0")
    );
  }

  getHours() {
    return new Date(this.time).getUTCHours();
  }

  timeOfHours(hours) {
    return new ErozeaTime(this.time - this.time % ONE_DAY_INTERVAL + hours * ONE_HOUR_INTERVAL)
  }

  getWeatherCheckPeriod() {
    const startTime = this.time - 2 * (this.time % WEATHER_CHANGE_INTERVAL);
    return [
      new ErozeaTime(startTime - WEATHER_CHANGE_INTERVAL),
      new ErozeaTime(startTime)
    ];
  }

  toWeatherCheckPoint() {
    return new ErozeaTime(
      this.time - this.time % WEATHER_CHANGE_INTERVAL
    );
  }

  toPreviousWeatherInterval() {
    return new ErozeaTime(this.time - WEATHER_CHANGE_INTERVAL);
  }

  toNextWeatherInterval() {
    return new ErozeaTime(this.time + WEATHER_CHANGE_INTERVAL);
  }

  static toErozeaTime(date) {
    return date * EARTH_TO_EROZEA;
  }

  static toEarthTime(erozeaDate) {
    return Math.ceil(erozeaDate * EROZEA_TO_EARTH);
  }

  static minOf(time1, time2) {
    return time1.time > time2.time ? time2 : time1;
  }

  static maxOf(time1, time2) {
    return time1.time > time2.time ? time1 : time2;
  }
}