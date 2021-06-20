import EorzeaTime from '@/utils/Time'
import DataUtil from '@/utils/DataUtil'
import Weather from '@/utils/Weather'
import DATA from 'Data/data'
import { DIADEM_ZONE, OCEAN_FISHING_ZONE } from 'Data/constants'
import db from '@/plugins/db'
import { RC_ACCESS_TOKEN_KEY } from '@/service/rcapiService'
import LocalStorageUtil from '@/utils/LocalStorageUtil'

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
      bait: record.baitId,
      biteInterval: +((record.biteTime - record.startTime) / 1000).toFixed(1),
      chum: record.chum,
      hookset: ['normal', 'precision', 'powerful', 'double'].indexOf(record.hookset) ?? 0,
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
    }
  })
}

export default {
  isLogin() {
    return !!LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)
  },
  async sendUploadRecord() {
    if (!LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)) {
      console.log('upload skipped')
      return
    }
    const recordsToUpload = await db.records
      .orderBy('startTime')
      .filter(record => {
        return record.uploadEnabled && !record.uploaded
      })
      .limit(200)
      .toArray()
    if (recordsToUpload.length > 0) {
      window.electron?.ipcRenderer
        ?.invoke('uploadRecords', {
          accessToken: LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY),
          records: toUploadData(recordsToUpload),
        })
        ?.then(result => {
          console.log('result', result)
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
}
