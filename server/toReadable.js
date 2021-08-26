exports.toReadable = toReadable
const merge = require('lodash/merge')
const CN_DATA = require('./translation')
const DATA = require('./data')
const FISH = require('./fish')
const BAITS = require('Data/bait')

const FISHING_SPOTS = merge(DATA.FISHING_SPOTS, CN_DATA.FISHING_SPOTS)
const ITEMS = merge(FISH, BAITS)

function toWeatherText(weatherId) {
    return CN_DATA.WEATHER_TYPES[weatherId] && CN_DATA.WEATHER_TYPES[weatherId].name_chs
}

function toItemText(itemId) {
    return ITEMS[itemId] || ''
}

function toReadable(record) {
    const weatherId = getWeather(record.spotId, record.startTime)
    const prevWeatherId = getWeather(record.spotId, record.startTime - WEATHER_CHANGE_INTERVAL_EARTH)
    return {
        spotId: record.spotId,
        spotText: toSpotText(record.spotId),
        weatherId: weatherId,
        weatherText: toWeatherText(weatherId),
        prevWeatherId: prevWeatherId,
        prevWeatherText: toWeatherText(weatherId),
        fishId: record.fishId,
        fishText: toItemText(record.fishId),
        et: toETText(toET(record.startTime)),
        biteInterval: +((record.biteTime - record.startTime) / 1000).toFixed(1),
        tug: record.tug,
        tugText: toTugText(record.tug),
        hookset: toHooksetText(record.hookset),
        hq: record.hq,
        snagging: record.snagging,
        chum: record.chum,
        surfaceScale: record.surfaceScale,
        surfaceScaleFishText: record.surfaceScale ? toItemText(record.prevFishId) : '',
        identicalCast: record.identicalCast,
        identicalCastText: record.identicalCast ? toItemText(record.prevFishId) : '',
        fishEyes: record.fishEyes,
        baitId: record.baitId,
        baitText: toItemText(record.baitId),
        prevFishId: record.prevFishId
    }
}

function getWeather(spotId, realTime) {
    const seed = calculateForecastTarget(realTime)
    const zoneId = DATA.FISHING_SPOTS[spotId] && DATA.FISHING_SPOTS[spotId].territory_id
    const rates = DATA.WEATHER_RATES[zoneId] && DATA.WEATHER_RATES[zoneId].weather_rates
    return rates ? rates.find(it => seed < it[1])[0] : ''
}

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

function toSpotText(spotId) {
    return FISHING_SPOTS[spotId] && FISHING_SPOTS[spotId].name_chs
}

const EARTH_TO_EROZEA = 3600 / 175
const EROZEA_TO_EARTH = 1 / EARTH_TO_EROZEA
const ONE_HOUR_INTERVAL = 3600 * 1000
const WEATHER_CHANGE_INTERVAL = 8 * ONE_HOUR_INTERVAL
const WEATHER_CHANGE_INTERVAL_EARTH = WEATHER_CHANGE_INTERVAL * EROZEA_TO_EARTH

function toET(date) {
    return new Date(date * EARTH_TO_EROZEA)
}

function toETText(et) {
    return et.getUTCHours().toString().padStart(2, '0') + ':' + et.getUTCMinutes().toString().padStart(2, '0')
}

function toSeconds(time) {
    return (time - time % 1000) / 1000
}

function toTugText(tug) {
    const tugDict = {
        light: '轻杆',
        medium: '中杆',
        heavy: '重杆'
    }
    return tugDict[tug] || ''
}

function toHooksetText(hookset) {
    const hooksetDict = {
        normal: '普通',
        precision: '精准',
        powerful: '强力'
    }
    return hooksetDict[hookset] || ''
}

// [
//     {
//         startTime: 1605436091730,
//         biteTime: 1605436102882,
//         hookset: 'normal',
//         fishId: 27459,
//         hq: false,
//         size: 130,
//         snagging: false,
//         chum: false,
//         fishEyes: false,
//         baitId: 27584,
//         mooch: false,
//         spotId: 216,
//         tug: 'light'
//     }
// ]
//     .map(it => console.log(toReadable(it)))
