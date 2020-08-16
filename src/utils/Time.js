const EARTH_TO_EROZEA = 3600 / 175;
const EROZEA_TO_EARTH = 1 / EARTH_TO_EROZEA;

export default class ErozeaTime {
  constructor() {
    this.time = ErozeaTime.toErozeaTime(Date.now());
  }

  toEarthTime() {
    return ErozeaTime.toErozeaTime(this.time);
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

  static toErozeaTime(date) {
    return Math.floor(date * EARTH_TO_EROZEA);
  }

  static toEarthTime(erozeaDate) {
    return Math.floor(erozeaDate * EROZEA_TO_EARTH);
  }
}