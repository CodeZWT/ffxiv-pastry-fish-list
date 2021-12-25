import { DIADEM_ZONE, OCEAN_FISHING_ZONE } from 'Data/constants'
import { STATUS } from 'Data/common'
import { WEATHER_TYPES } from 'Data/translation'
import DATA from 'Data/data'
import DataUtil from '@/utils/DataUtil'
import EorzeaTime from '@/utils/Time'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import OceanFishingUtil from '@/utils/OceanFishing54/OceanFishingUtil'
import PLACE_NAMES from 'Data/placeNames'
import SPOT_FISH_DICT from 'Data/spotFishDict'
import UploadUtil from '@/utils/UploadUtil'
import Weather from '@/utils/Weather'
import _ from 'lodash'

import db from '@/plugins/db'
import rcapiService, { RC_ACCESS_TOKEN_KEY } from '@/service/rcapiService'

const toUploadData = records => {
  return records.map(record => {
    const spotId = record.spotId
    const et = new EorzeaTime(EorzeaTime.toEorzeaTime(record.startTime))
    return {
      id: record.id,
      startTime: record.startTime,
      etHour: et.getHours(),
      etMinute: et.getMinutes(),
      biteTime: record.biteTime,
      prevWeather:
        spotId > 0
          ? DataUtil.isOceanFishingSpot(spotId) || DataUtil.isDiademSpot(spotId)
            ? record.prevWeatherDetected
            : Weather.prevWeatherAtSpot(spotId, et)
          : undefined,
      weather:
        spotId > 0
          ? DataUtil.isOceanFishingSpot(spotId) || DataUtil.isDiademSpot(spotId)
            ? record.weatherDetected
            : Weather.weatherAtSpot(spotId, et)
          : undefined,
      spot: spotId,
      zone:
        spotId > 0
          ? DATA.WEATHER_RATES[DataUtil.FISHING_SPOTS[spotId]?.territory_id]?.zone_id ??
            (DataUtil.isDiademSpot(spotId)
              ? DIADEM_ZONE
              : DataUtil.isOceanFishingSpot(spotId)
              ? OCEAN_FISHING_ZONE
              : 0)
          : spotId,
      fish: record.fishId ?? -1,
      hq: record.hq,
      size: record.size > 0 ? +(record.size / 10).toFixed(1) : -1,
      fishPatch: DataUtil.getFishPatch(record.fishId),
      missed: record.missed,
      cancelled: record.cancelled,
      bait: record.baitId ?? -1,
      biteInterval: +((record.biteTime - record.startTime) / 1000).toFixed(1),
      chum: record.chum,
      hookset:
        ['normal', 'precision', 'powerful', 'double', 'triple'].indexOf(record.hookset) ??
        0,
      quantity: record.quantity,
      gathering: record.gathering,
      perception: record.perception,
      gp: record.gp,
      snagging: record.snagging,
      surfaceScale: record.surfaceScale,
      surfaceScaleFish: record.surfaceScale ? record.surfaceScaleFishId ?? -1 : -1,
      identicalCast: record.identicalCast,
      gatheringFortuneUp: record.gatheringFortuneUp && !record.catchAndRelease,
      catchAndRelease: record.catchAndRelease,
      fishEyes: record.fishEyes,
      fishersIntuition: record.fishersIntuition,
      recordPatch: record.patch ?? 5.35,
      tug: ['light', 'medium', 'heavy'].indexOf(record.tug),
      isStrictMode: record.isStrictMode,
      oceanFishingTime: DataUtil.isOceanFishingSpot(spotId)
        ? timeOfOFSpot(spotId, record.startTime)
        : undefined,
    }
  })
}

const UPLOAD_LIMIT = 100

export default {
  isLogin() {
    return !!LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)
  },
  async sendUploadRecord() {
    if (!LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)) {
      console.debug('upload skipped')
      return
    }
    const recordsToUpload = await db.records
      .orderBy('startTime')
      .filter(record => {
        return record.uploadEnabled && !record.uploaded
      })
      .limit(UPLOAD_LIMIT)
      .toArray()
    if (recordsToUpload.length > 0) {
      console.debug('Start uploading #', recordsToUpload.length)
      rcapiService.uploadRecords(toUploadData(recordsToUpload)).then(result => {
        console.debug('Uploaded #', result.length)
        if (result.length > 0) {
          db.records.bulkGet(result).then(recordsUploaded => {
            db.records.bulkPut(
              recordsUploaded.map(record => {
                return {
                  ...record,
                  uploaded: true,
                }
              })
            )
          })
        }
      })
    } else {
      console.debug('No records to upload')
    }
  },
  async getUploadStatus() {
    const recordsToUpload = await db.records
      .filter(record => record.uploadEnabled)
      .toArray()
    return {
      total: recordsToUpload.length,
      uploaded: recordsToUpload.filter(({ uploaded }) => uploaded).length,
    }
  },
  toBait(baitIdInput) {
    const baitId = +baitIdInput
    return {
      baitId: baitId ?? -1,
      baitName: DataUtil.getItemName(baitId) ?? '未知',
      baitIcon: DataUtil.getItemIconClass(baitId ?? -1, 60051),
    }
  },
  toFish(fishId, missed = false, cancelled = false) {
    return {
      fishId: fishId,
      fishName: DataUtil.getItemName(fishId) ?? '未知',
      fishIcon: missed
        ? DataUtil.iconIdToClass(60034)
        : cancelled
        ? DataUtil.iconIdToClass(60027)
        : DataUtil.getItemIconClass(fishId, 60027),
    }
  },
  toHookset(hookset) {
    const hooksetId = ['normal', 'precision', 'powerful', 'double', 'triple'][hookset]
    return {
      id: hooksetId,
      icon: DataUtil.iconIdToClass(DataUtil.HOOKSET_ICON[_.capitalize(hooksetId)]),
    }
  },
  toSpot(spot) {
    if (!spot) {
      console.warn('invalid spot marked as 0', spot)
    }
    const spotId = +(spot || 0)
    return {
      spotId: spotId,
      spotName: DataUtil.getName(
        spotId > 0 ? DataUtil.FISHING_SPOTS[spotId] : { name_chs: '' }
      ),
    }
  },
  toWeather(weatherId) {
    const weather = WEATHER_TYPES[weatherId]
    return {
      id: weatherId,
      name: DataUtil.getName(weather),
      icon: DataUtil.iconIdToClass(weather.icon),
    }
  },
  fishListOfSpot(spot) {
    return SPOT_FISH_DICT[spot]?.filter(fishId => fishId > 0) ?? []
  },
  toReadableData(record) {
    const effects = []
    if (record.surfaceScale) {
      effects.push(STATUS[1803])
    }
    if (record.identicalCast) {
      effects.push(STATUS[1804])
    }
    if (record.gatheringFortuneUp) {
      effects.push(STATUS[850])
    }
    if (record.catchAndRelease) {
      effects.push(STATUS[765])
    }

    return {
      ...record,
      startTime: new Date(record.startTime),

      ...this.toFish(record.fish, record.missed, record.cancelled),
      ...this.toBait(record.bait),

      tugColor: ['success', 'error', 'warning'][record.tug],
      biteIntervalPercentage: Math.round((record.biteInterval / 60) * 100),
      prevWeather: WEATHER_TYPES[record.prevWeather],
      prevWeatherId: record.prevWeather,
      weather: WEATHER_TYPES[record.weather],
      weatherId: record.weather,
      ...this.toSpot(record.spot),
      zoneName:
        record.spot > 0
          ? PLACE_NAMES[
              DATA.WEATHER_RATES[DataUtil.FISHING_SPOTS[record.spot]?.territory_id]
                ?.zone_id ??
                (DataUtil.isDiademSpot(record.spot)
                  ? DIADEM_ZONE
                  : DataUtil.isOceanFishingSpot(record.spot)
                  ? OCEAN_FISHING_ZONE
                  : 0)
            ]
          : '',
      hookset: UploadUtil.toHookset(record.hookset),
      tug: ['light', 'medium', 'heavy'][record.tug],
      effects: effects.map(effect => {
        return {
          id: effect.id,
          name: DataUtil.getName(effect),
          icon: DataUtil.iconIdToClass(effect.icon),
        }
      }),
    }
  },
  timeOfOFSpot: timeOfOFSpot,
}

function timeOfOFSpot(spotId, time) {
  return OceanFishingUtil.voyagesWithTipOf(time, 1)[0].locationTips?.find(
    ({ fishingSpots }) => fishingSpots.spectralCurrent === spotId
  )?.shift
}
