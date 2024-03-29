import { AQUARIUM_FISH_SIZE, AQUARIUM_WATER } from 'Data/fix'
import { DateTime, FixedOffsetZone } from 'luxon'
import { Howl } from 'howler'
import { SystemInfo } from 'Data/version'
import { detect } from 'detect-browser'
import {
  mdiBell,
  mdiFormatListText,
  mdiWeatherNight,
  mdiWeatherSunny,
  mdiWeatherSunset,
} from '@mdi/js'
import { toItemId } from 'Data/patch/utils'
import CONSTANTS from 'Data/constants'
import DATA from 'Data/data'
import DATA_CN, { LIVING_LEGENDS } from 'Data/translation'
import EorzeaTime from '@/utils/Time'
import FISH from 'Data/fish'
import FISH_PARAMETER from 'Data/fishParameter'
import FishWindow from '@/utils/FishWindow'
import ITEMS from 'Data/item'
import ImgUtil from '@/utils/ImgUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import TimeFormatter from '@/utils/TimeFormatter'
import _ from 'lodash'
import flatten from 'flat'
import i18n from '@/i18n'
import itemNames from 'Data/locale/item'
import placeNames from 'Data/locale/placeNames'

const NOTIFICATION_SOUNDS = [
  { key: 'mute', name_chs: '静音', filename: null },
  {
    key: 'incomingTell1',
    name_chs: '提示音1',
    filename: 'FFXIV_Incoming_Tell_1.mp3',
  },
  {
    key: 'incomingTell2',
    name_chs: '提示音2',
    filename: 'FFXIV_Incoming_Tell_2.mp3',
  },
  {
    key: 'incomingTell3',
    name_chs: '提示音3',
    filename: 'FFXIV_Incoming_Tell_3.mp3',
  },
  { key: 'aggro', name_chs: '遇敌', filename: 'FFXIV_Aggro.mp3' },
  { key: 'confirm', name_chs: '确认', filename: 'FFXIV_Confirm.mp3' },
  {
    key: 'linkshellTransmission',
    name_chs: '通讯贝',
    filename: 'FFXIV_Linkshell_Transmission.mp3',
  },
  { key: 'notification', name_chs: '通知', filename: 'FFXIV_Notification.mp3' },
]

const READER_SOUNDS = [
  {
    key: 'light',
    name_chs: 'alert_high-intensity',
    filename: 'alert_high-intensity.ogg',
  },
  { key: 'medium', name_chs: 'alert_simple', filename: 'alert_simple.ogg' },
  {
    key: 'heavy',
    name_chs: 'hero_decorative-celebration-01',
    filename: 'hero_decorative-celebration-01.ogg',
  },
]

const INTERVALS = [
  CONSTANTS.INTERVAL_DAY,
  CONSTANTS.INTERVAL_HOUR,
  CONSTANTS.INTERVAL_MINUTE,
  CONSTANTS.INTERVAL_SECOND,
]

const COMPLETE_FILTER_TYPES = ['COMPLETED', 'UNCOMPLETED']
const BIG_FISH_FILTER_TYPES = ['LIVING_LEGENDS', 'OLD_ONES', 'NORMAL']
const FISH_SORTER_TYPES = ['COUNTDOWN', 'RATE']
const FISH_CONSTRAINT_FILTER_TYPES = ['RESTRICTED', 'NOT_RESTRICTED']

const BAIT_FISH_SORTER_TYPES = ['QUANTITY', 'ID']

const THEME_SETTING_MODES = ['DARK', 'LIGHT', 'AUTO']
const DATA_LOCALES = ['chs', 'en', 'ja']
const DATA_SUB_LOCALES = ['en', 'ja']
const UI_LOCALES = ['zh-CN', 'en', 'ja']

function hasChineseCharacter(text) {
  return text.match('[\u4e00-\u9fff]+')
}

function isAllAvailableFish(fish) {
  return (
    fish.previousWeatherSet.length === 0 &&
    fish.weatherSet.length === 0 &&
    fish.startHour === 0 &&
    fish.endHour === 24
  )
}

function toComparableVersion(version) {
  return version
    .split('.')
    .map(it => it.padStart(5, '0'))
    .join('')
}

const FISH_ANGEL_BASE_URL = 'https://cn.ff14angler.com'

function toFishAngelFishLink({ anglerId }) {
  return `${FISH_ANGEL_BASE_URL}/fish/${anglerId}`
}

function toHuijiWikiQuestLink({ name }) {
  return `https://ff14.huijiwiki.com/wiki/%E4%BB%BB%E5%8A%A1:${encodeURI(name)}`
}

function toFishAngelSpotLink({ anglerId }) {
  return `${FISH_ANGEL_BASE_URL}/spot/${anglerId}`
}

function toHuijiWikiItemLink({ name }) {
  return `https://ff14.huijiwiki.com/wiki/%E7%89%A9%E5%93%81:${encodeURI(name)}`
}

const GARLAND_BASE_URL = process.env.VUE_APP_GARLAND_HOST

function toGarlandItemLink({ id }) {
  return `${GARLAND_BASE_URL}/db/#item/${id}`
}

function toGarlandSpotLink({ id }) {
  return `${GARLAND_BASE_URL}/db/#fishing/${id}`
}

const TEAMCRAFT_BASE_URL = 'https://ffxivteamcraft.com/db/zh'

function toTeamcraftItemLink({ id }) {
  return `${TEAMCRAFT_BASE_URL}/item/${id}`
}

function toTeamcraftSpotLink({ id }) {
  return `${TEAMCRAFT_BASE_URL}/fishing-spot/${id}`
}

function toInnerSpotLink({ id, mode }) {
  return { name: 'WikiPage', query: { spotId: id, mode } }
}

function toInnerFishLink({ id, spotId }) {
  return { name: 'WikiPage', query: { spotId: spotId, fishId: id } }
}

const TIP3_FISH_IDS = [16744, 17589]
const TIP5_FISH_IDS = [17591, 12753, 12810]

// function getCombinedFishData() {
//   return _.mapValues(
//     mergeByReplacingArray(
//       FishingData,
//       FIX.FISH,
//       FIX.SPEAR_FISH
//       // DevelopmentModeUtil.isTest() ? FIX.TEST_FISH : {}
//     ),
//     fish => {
//       return {
//         ...fish,
//         collectable: FIX.COLLECTABLE_FISH_ITEM_ID.includes(toItemId(fish._id)),
//       }
//     }
//   )
// }

function mergeByReplacingArray(object, ...otherArgs) {
  return _.mergeWith(object, ...otherArgs, mergeArray)
}

function mergeArray(objValue, srcValue) {
  if (_.isArray(srcValue)) {
    // force removing duplication here to fix old data
    return _.uniq(srcValue).filter(it => it != null)
  }
}

function generateFishId2WikiId(fishDict) {
  const dict = {}
  Object.keys(fishDict)
    .filter(id => id > 1000000)
    .forEach(spotFishId => {
      const itemId = toItemId(spotFishId)
      dict[itemId] = [
        ...(dict[itemId] ?? []),
        ...fishDict[spotFishId].locations.map(
          spotId => `spot-${spotId}-fish-${spotFishId}`
        ),
      ]
    })
  return dict
}

function isOceanFishingNormalSpot(id) {
  return [237, 239, 241, 243, 246, 248, 250].includes(id)
}

function isOceanFishingCurrentSpot(id) {
  return [238, 240, 242, 244, 247, 249, 251].includes(id)
}

export default {
  LINKS: {
    PASTRY_FISH: {
      id: 'PASTRY_FISH',
      icon: ImgUtil.getImgUrl('pastry-fish.webp', 'logo'),
      title: '钓鱼笔记',
      inner: true,
      fishFn: toInnerFishLink,
      spotFn: toInnerSpotLink,
    },
    ANGLER: {
      id: 'ANGLER',
      icon: 'https://cn.ff14angler.com/favicon.ico',
      title: '饥饿的猫',
      fishFn: toFishAngelFishLink,
      spotFn: toFishAngelSpotLink,
    },
    HUIJI: {
      id: 'HUIJI',
      icon: 'https://av.huijiwiki.com/site_avatar_ff14_m.png',
      title: '灰机WIKI',
      itemV2Fn: toHuijiWikiItemLink,
      fishFn: toHuijiWikiItemLink,
    },
    GARLAND: {
      id: 'GARLAND',
      icon: `${process.env.VUE_APP_GARLAND_HOST}/favicon.png`,
      title: 'Garland 数据',
      itemV2Fn: toGarlandItemLink,
      fishFn: toGarlandItemLink,
      spotFn: toGarlandSpotLink,
    },
    TEAMCRAFT: {
      id: 'TEAMCRAFT',
      icon: 'https://ffxivteamcraft.com/assets/logo.png',
      title: 'FFXIV Teamcraft',
      itemV2Fn: toTeamcraftItemLink,
      fishFn: toTeamcraftItemLink,
      spotFn: toTeamcraftSpotLink,
    },
  },
  itemIconUrlOf(iconId) {
    return `${process.env.VUE_APP_GARLAND_HOST}/files/icons/item/t/${iconId}.png`
  },
  iconIdToUrl(iconId) {
    if (iconId == null) return ''
    return this.itemIconUrlOf(iconId)
    // const iconIdStr = iconId + ''
    // const icon = iconIdStr.padStart(6, '0')
    // const path = icon.substring(0, 3) + '000'
    // return `${this.XIV_API_HOST}/i/${path}/${icon}.png`
  },
  iconIdToClass: ImgUtil.iconIdToClass,
  getName(multiLanguageItem, locale = SystemInfo.dataLocale) {
    return (
      multiLanguageItem &&
      (multiLanguageItem['name_' + locale]
        ? multiLanguageItem['name_' + locale]
        : multiLanguageItem['name_' + SystemInfo.dataSubLocale]
        ? multiLanguageItem['name_' + SystemInfo.dataSubLocale]
        : multiLanguageItem['name_chs'])
    )
  },
  getPlaceName(placeNameId) {
    return this.getName(placeNames[placeNameId])
  },
  getPlaceNames(placeNameId) {
    const names = placeNames[placeNameId]
    const ret = {}
    Object.keys(names).forEach(nameKey => {
      ret[nameKey.split('_')[1]] = names[nameKey]
    })
    return ret
  },

  getCountDownTypeName(countDown) {
    return `countDown.${this.COUNT_DOWN_TYPE[countDown]}`
  },

  hasCountDown(countDown) {
    return countDown != null && countDown.type !== this.ALL_AVAILABLE
  },

  printCountDownTime(time, showCnt = 1, paddingZero = true) {
    return TimeFormatter.millisecondsToText(time, showCnt, true, paddingZero)
  },

  toFishAngelFishLink: toFishAngelFishLink,
  toFishAngelSpotLink: toFishAngelSpotLink,
  toHuijiWikiItemLink: toHuijiWikiItemLink,
  toGarlandItemLink: toGarlandItemLink,
  toGarlandSpotLink: toGarlandSpotLink,
  toTeamcraftItemLink: toTeamcraftItemLink,
  toTeamcraftSpotLink: toTeamcraftSpotLink,

  secondsToMinutesString(seconds) {
    if (seconds === true) return ''
    return TimeFormatter.millisecondsToText(seconds * 1000, 2, false, false)
  },

  // completed
  getPredators(fish, allFish, fishListTimePart = {}, fishListWeatherChangePart = {}) {
    if (fish == null || allFish == null) return []
    let predatorOrder = fish.predatorOrder
    if (predatorOrder == null) {
      predatorOrder = Object.keys(fish.predators)
    }
    return predatorOrder.map(predatorId => {
      const count = fish.predators[predatorId]
      return {
        ...allFish[predatorId],
        requiredCnt: count,
        isPredator: true,
        fishTimePart:
          fishListTimePart[predatorId] == null
            ? { id: predatorId, countDown: { type: this.ALL_AVAILABLE } }
            : fishListTimePart[predatorId],
        fishWeatherChangePart: fishListWeatherChangePart[predatorId],
        // finalTargetCompleted: completed,
        // finalTargetCountDownType: fishListTimePart[fish._id]?.countDown?.type,
      }
    })
  },

  // convert pixel coordinate to game map coordinate
  // e.g. 2048 to 42
  // ref: https://github.com/xivapi/ffxiv-datamining/blob/master/docs/MapCoordinates.md
  pixelToPos(sizeFactor, pixelIndex) {
    const MAP_SIZE_FACTOR_MAGIC = 41
    const MAP_FILE_PIXEL_MAX = 2048
    return (
      (MAP_SIZE_FACTOR_MAGIC / (sizeFactor / 100)) * (pixelIndex / MAP_FILE_PIXEL_MAX) + 1
    )
  },

  getColorByStatus(theme, completed, countDownType, colorIndex = 0) {
    const colorRef = {
      FISHING: [theme.fishing, theme.fishingSecondary],
      COMPLETED: [theme.completed, theme.completedSecondary],
      WAITING: [theme.waiting, theme.waitingSecondary],
    }
    if (completed) {
      return colorRef.COMPLETED[colorIndex]
    } else {
      switch (countDownType) {
        case this.FISHING:
          return colorRef.FISHING[colorIndex]
        default:
          return colorRef.WAITING[colorIndex]
      }
    }
  },
  isAllAvailableFish: isAllAvailableFish,

  formatDateTime(millis, format = "[MM-dd '{dayDescription}'] HH:mm:ss") {
    if (millis) {
      const date = DateTime.fromMillis(millis)
      const startOfDate = date.startOf('days')
      const today = DateTime.fromMillis(Date.now()).startOf('days')
      const days = startOfDate.diff(today, 'days').as('days')
      let dayText
      switch (days) {
        case 0:
          dayText = i18n.t('date.today')
          break
        case 1:
          dayText = i18n.t('date.tomorrow')
          break
        default:
          dayText = date.weekdayShort
      }
      return date.toFormat(format.replace('{dayDescription}', dayText))
    } else {
      return ''
    }
  },

  formatET(etHours) {
    const integer = etHours - ((etHours * 10) % 10) / 10
    const decimal = etHours - integer
    return integer + (decimal === 0 ? '' : ':' + decimal * 60)
  },

  // no operation placeholder for list item to show as clickable style
  noOp() {},

  toMap(list, keyFn) {
    return list.reduce((dict, item) => {
      dict[keyFn(item)] = item
      return dict
    }, {})
  },

  mergeUserData(defaultData, storedDate) {
    // [NOTE]
    // _.merge will deep merge array which will cause problem
    // e.g. filter.patches: merge([2.0, 3.0], [4.0]) = [4.0, 3.0]
    // use mergeWith to replace the whole array instead of merge elements
    // =======================================================================
    // if need add new element in default value for settings,
    // another patch function is needed
    let newUserData = _.mergeWith(defaultData, storedDate, mergeArray)
    const defaultComponents = this.USER_DEFAULT_DATA.detailArrangement.components
    const currentArrangement = newUserData.detailArrangement
    const componentsDiff = defaultComponents.length - currentArrangement.components.length
    if (componentsDiff > 0) {
      currentArrangement.components = currentArrangement.components.concat(
        defaultComponents.slice(
          defaultComponents.length - componentsDiff,
          defaultComponents.length
        )
      )
    }
    return newUserData
  },

  mergeReaderUserData(defaultData, storedDate) {
    // [NOTE]
    // _.merge will deep merge array which will cause problem
    // e.g. filter.patches: merge([2.0, 3.0], [4.0]) = [4.0, 3.0]
    // use mergeWith to replace the whole array instead of merge elements
    // =======================================================================
    // if need add new element in default value for settings,
    // another patch function is needed
    return _.mergeWith(defaultData, storedDate, mergeArray)
  },

  mergeByReplacingArray: mergeByReplacingArray,

  toComparableVersion: toComparableVersion,

  migrateOldVersionUserData(userData) {
    if (toComparableVersion(userData.migrationVersion) < toComparableVersion('0.5.3')) {
      console.debug(
        'migrating from version',
        userData.migrationVersion,
        'to version 0.5.3'
      )
      switch (userData.filters.bigFishType) {
        case 'ALL':
          userData.filters.bigFishTypes = BIG_FISH_FILTER_TYPES
          userData.filters.fishConstraintTypes = FISH_CONSTRAINT_FILTER_TYPES
          break
        case 'BIG_FISH':
          userData.filters.bigFishTypes = ['LIVING_LEGENDS', 'OLD_ONES']
          userData.filters.fishConstraintTypes = FISH_CONSTRAINT_FILTER_TYPES
          break
        case 'ALL_AVAILABLE_BIG_FISH':
          userData.filters.bigFishTypes = ['LIVING_LEGENDS', 'OLD_ONES']
          userData.filters.fishConstraintTypes = ['NOT_RESTRICTED']
          break
        case 'NOT_BIG_FISH':
          userData.filters.bigFishTypes = ['NORMAL']
          userData.filters.fishConstraintTypes = FISH_CONSTRAINT_FILTER_TYPES
          break
      }
      switch (userData.filters.completeType) {
        case 'ALL':
          userData.filters.completeTypes = COMPLETE_FILTER_TYPES
          break
        case 'COMPLETED':
          userData.filters.completeTypes = ['COMPLETED']
          break
        case 'UNCOMPLETED':
          userData.filters.completeTypes = ['UNCOMPLETED']
          break
      }
      if (userData.theme.dark) {
        userData.theme.mode = 'DARK'
      } else {
        userData.theme.mode = 'LIGHT'
      }
    }
    userData.migrationVersion = '0.5.3'
    return userData
  },

  toPositionText(fishingSpot) {
    if (fishingSpot == null) return ''
    return `X: ${this.toPosStr(
      fishingSpot.size_factor,
      fishingSpot.x
    )}, Y:${this.toPosStr(fishingSpot.size_factor, fishingSpot.y)}`
  },
  toPosStr(sizeFactor, pos) {
    return this.pixelToPos(sizeFactor, pos).toFixed(0)
  },
  assembleFishForDetail(
    selectedFishId,
    allFish,
    fishDict,
    fishListTimePart,
    extraFishListTimePart,
    fishListWeatherChangePart
  ) {
    const fish = allFish[selectedFishId]
    if (fish) {
      return {
        ...fish,
        parts: {
          fishTimePart: extraFishListTimePart[selectedFishId],
          fishWeatherChangePart: fishListWeatherChangePart[selectedFishId],
          predators: this.getPredators(
            fish,
            fishDict,
            fishListTimePart,
            fishListWeatherChangePart
          ),
          shadowPredators: fish.shadowPredators
            ? this.getPredators(
                { predators: fish.shadowPredators },
                fishDict,
                fishListTimePart,
                fishListWeatherChangePart
              )
            : [],
        },
      }
    } else {
      return undefined
    }
  },

  isConstrainsEqual(fish1, fish2) {
    return (
      _.isEqual(fish1.previousWeatherSet, fish2.previousWeatherSet) &&
      _.isEqual(fish1.weatherSet, fish2.weatherSet) &&
      fish1.startHour === fish2.startHour &&
      fish1.endHour === fish2.endHour
    )
  },
  getFishWindow(
    fish,
    now,
    allFish,
    fishingSpots,
    fishEyesUsed,
    n = FishWindow.FISH_WINDOW_FORECAST_N
  ) {
    // if (fish._id === 999999) {
    //   console.log(Object.keys(fish.predators))
    // }
    if (this.isAllAvailableFish(fish) && fish.bestCatchPath?.length > 1) {
      if (fish.bestCatchPath.slice(1).some(it => !this.isAllAvailableFish(allFish[it]))) {
        console.warn('should update fish constraint', fish._id, fish)
      }
    }

    if (fish.gig != null || Object.keys(fish.predators).length === 0) {
      return this.getFishWindowOfSingleFish(fish, now, fishingSpots, fishEyesUsed, n)
    } else {
      const predators = Object.keys(fish.predators).map(predatorId => {
        return allFish[predatorId]
      })
      if (
        predators.every(
          it => this.isAllAvailableFish(it) || this.isConstrainsEqual(fish, it)
        )
      ) {
        // console.debug(
        //   DATA_CN.ITEMS[fish._id].name_chs,
        //   'predators are all available or same constrains'
        // )
        return this.getFishWindowOfSingleFish(fish, now, fishingSpots, fishEyesUsed, n)
      } else if (predators.length === 1) {
        if (this.isAllAvailableFish(fish)) {
          // console.debug(
          //   DATA_CN.ITEMS[fish._id].name_chs,
          //   'fish is all available so just look its only predator'
          // )
          return this.getFishWindowOfSingleFish(
            predators[0],
            now,
            fishingSpots,
            fishEyesUsed,
            n
          )
        } else if (fish._id === 24992) {
          // Special Case 1: "胸脊鲨"
          return this.getFishWindowOfSingleFish(
            predators[0],
            now,
            fishingSpots,
            fishEyesUsed,
            n
          ).map(fishWindow => {
            const startEorzeaTime = new EorzeaTime(EorzeaTime.toEorzeaTime(fishWindow[0]))
            return [
              startEorzeaTime.timeOfHours(fish.startHour).toEarthTime(),
              startEorzeaTime.timeOfHours(fish.endHour).toEarthTime(),
            ]
          })
        } else if (fish._id === 33244) {
          return this.getFishWindowOfSingleFish(fish, now, fishingSpots, fishEyesUsed, n)
        } else {
          console.error('Unsupported fish!', fish._id, 'need write new rules for it!')
          return this.getFishWindowOfSingleFish(fish, now, fishingSpots, fishEyesUsed, n)
        }
      } else {
        // Special Case 2: 'Warden of the Seven Hues' i.e. "七彩天主"
        if (fish._id === 24994) {
          // console.debug(DATA_CN.ITEMS[fish._id].name_chs, 'special case 2')
          // just return the 'Green Prismfish' i.e. "绿彩鱼" fish windows
          const greenFish = allFish[24204]
          const greenFishWindows = this.getFishWindowOfSingleFish(
            greenFish,
            now,
            fishingSpots,
            fishEyesUsed,
            n
          )
          if (this.skipTimeCheckOf(greenFish, fishEyesUsed)) {
            // if using fish eyes and in global region
            // then just return green fish windows
            return greenFishWindows
          } else {
            return greenFishWindows.map(fishWindow => {
              // if start of fish window > 0, i.e. its window is shrunk by the weather
              // change it back to 0, since other 2 predators are always available in [0,8]
              const startEorzeaTime = new EorzeaTime(
                EorzeaTime.toEorzeaTime(fishWindow[0])
              )
              if (startEorzeaTime.getHours() > 0) {
                return [startEorzeaTime.timeOfHours(0).toEarthTime(), fishWindow[1]]
              } else {
                return fishWindow
              }
            })
          }
        } else if (fish._id === 33240) {
          // Special Case 3: 'Aquamaton'
          // 2 predators and one has no restraints
          return this.getFishWindowOfSingleFish(
            { ...allFish[33319], endHour: 16 },
            now,
            fishingSpots,
            fishEyesUsed,
            n
          )
        } else {
          console.error('Unsupported fish!', fish._id, 'need write new rules for it!')
          return this.getFishWindowOfSingleFish(fish, now, fishingSpots, fishEyesUsed, n)
        }
      }
    }
  },
  skipTimeCheckOf(fish, fishEyesUsed) {
    return (
      fishEyesUsed &&
      (fish.startHour !== 0 || fish.endHour !== 24) &&
      fish.gig == null &&
      (fish._id === 20524 || // 20524 巧儿海陆行鸟
        (fish.patch < SystemInfo.fishEyesMaxPatchExclude &&
          !LIVING_LEGENDS.includes(fish._id)))
    )
  },
  getFishWindowOfSingleFish(
    fish,
    now,
    fishingSpots,
    fishEyesUsed,
    n = FishWindow.FISH_WINDOW_FORECAST_N
  ) {
    const skipTimeCheck = this.skipTimeCheckOf(fish, fishEyesUsed)
    // [NOTE]
    // Only check the 1st location
    // If fish with multi spot has weather constraints
    // will miss other location fish window
    // but all fish is split to multi fish in that case
    return FishWindow.getNextNFishWindows(
      fish._id,
      fishingSpots?.[fish.locations[0]]?.territoryTypeId,
      new EorzeaTime(EorzeaTime.toEorzeaTime(now)),
      skipTimeCheck ? 0 : fish.startHour,
      skipTimeCheck ? 24 : fish.endHour,
      fish.previousWeatherSet,
      fish.weatherSet,
      n
    )
  },

  computeRate(fishWindows) {
    const len = fishWindows.length
    if (len === 0) return 1
    const total = fishWindows[len - 1][0] - fishWindows[0][0]
    const active = fishWindows
      .slice(0, len - 1)
      .reduce((sum, fishWindow) => (sum += fishWindow[1] - fishWindow[0]), 0)
    return active / total
  },

  toFishFilterPatch(fishPatch) {
    if (!fishPatch) return fishPatch
    return +fishPatch.toString().match('^(\\d(\\.\\d)?)\\d?$')[1]
  },

  getMaxIntervalPartUnit(interval) {
    const index = INTERVALS.findIndex(it => it <= interval)
    let unit
    if (index === -1) unit = CONSTANTS.INTERVAL_SECOND
    else unit = INTERVALS[index]
    // console.log(unit)
    return unit
  },

  getMaxIntervalPart(interval, unit) {
    // console.log(Math.trunc(interval / unit))
    return Math.trunc(interval / unit)
  },

  shouldUpdate(realInterval, lazyInterval) {
    const realUnit = this.getMaxIntervalPartUnit(realInterval)
    const lazyUnit = this.getMaxIntervalPartUnit(lazyInterval)
    return (
      realUnit !== lazyUnit ||
      this.getMaxIntervalPart(realInterval, realUnit) !==
        this.getMaxIntervalPart(lazyInterval, lazyUnit)
    )
  },

  getDetailComponentSettingTemplate(componentNames) {
    return componentNames.map(it =>
      this.USER_DEFAULT_DATA.detailArrangement.components.find(
        component => component.name === it
      )
    )
  },

  validateImportData(data, sample) {
    const importKeys = _.keys(flatten(data, { safe: true })).sort()
    const sampleKeys = _.keys(flatten(sample, { safe: true })).sort()
    console.debug(_.difference(importKeys, sampleKeys))
    console.debug(_.difference(sampleKeys, importKeys))
    return importKeys
      .filter(it => !it.startsWith('reader.'))
      .every(it => sampleKeys.includes(it))
  },

  filterByDefaultValueKey(data, sample) {
    let result = {}
    let currConfigKeys = Object.keys(sample)
    Object.entries(data).forEach(([key, item]) => {
      if (currConfigKeys.includes(key)) {
        result[key] = item
      }
    })
    return result
  },

  tugToHookset(tug, hookset, fishId) {
    if (tug === 'light') {
      return 'Precision'
    } else if (tug === 'medium') {
      return 'Powerful'
    } else {
      const isBigFish = DATA_CN.BIG_FISH.includes(fishId)
      return hookset ?? (isBigFish ? hookset : 'Powerful')
    }
  },

  timeId2TimeText(timeId) {
    const timeTextList = ['无要求', '白天', '黄昏', '夜晚']
    return timeTextList[timeId]
  },

  timeId2TimeIcon(timeId) {
    const timeTextList = [null, mdiWeatherSunny, mdiWeatherSunset, mdiWeatherNight]
    return timeTextList[timeId]
  },

  toItemIdIfExisted(id, name) {
    if (hasChineseCharacter(name) && id < 999900) {
      return toItemId(id)
    } else {
      return null
    }
  },

  toItemId: toItemId,

  toItemTitle(item) {
    const id = toItemId(item.id)
    return item.name + (id < 999990 ? ' # ' + id : '')
  },

  toSpotItemId(spotId, itemId) {
    return spotId * 1000000 + itemId
  },

  toSpotTitle(spot) {
    return spot.fishingSpotName + ' # ' + spot.fishingSpotId
  },

  hasChineseCharacter: hasChineseCharacter,

  TIP3_FISH_IDS: TIP3_FISH_IDS,
  TIP5_FISH_IDS: TIP5_FISH_IDS,

  generateBaitFishItems(fishList, completeTypes, bigFishTypes, completedFishIds) {
    const completedFishIdSet = new Set(completedFishIds)
    return fishList
      .filter(fish => {
        const fishId = toItemId(fish._id)
        const fishCompleted = completedFishIdSet.has(fishId)
        const isBigFish = DATA_CN.BIG_FISH.includes(fishId)
        const isLivingLegend = DATA_CN.LIVING_LEGENDS.includes(fishId)
        return (
          fish.gig == null &&
          ((completeTypes.includes('COMPLETED') && fishCompleted) ||
            (completeTypes.includes('UNCOMPLETED') && !fishCompleted)) &&
          ((bigFishTypes.includes('LIVING_LEGENDS') && isLivingLegend) ||
            (bigFishTypes.includes('OLD_ONES') && isBigFish && !isLivingLegend) ||
            (bigFishTypes.includes('NORMAL') && !isBigFish))
        )
      })
      .flatMap(fish => {
        const baitFishItems = [
          {
            bait: fish.bestCatchPath[0],
            fish: toItemId(fish._id),
          },
        ]
        if (fish.predators) {
          Object.keys(fish.predators).map(predatorId => {
            const predator = fishList.find(it => it._id === +predatorId)
            baitFishItems.push({
              bait: predator.bestCatchPath[0],
              fish: toItemId(fish._id),
            })
          })
        }
        return baitFishItems
      })
  },

  toSpotsOfPredator(fishingSpots, firstSpotId, isSpear = false) {
    if (!firstSpotId) return fishingSpots
    const spots = _.cloneDeep(fishingSpots)
    const predatorSpotIndex = spots.findIndex(spot => spot.fishingSpotId === firstSpotId)
    const predatorSpot = spots.splice(predatorSpotIndex, 1)
    return isSpear ? [...spots, ...predatorSpot] : [...predatorSpot, ...spots]
  },

  isBugChromeTimeZone() {
    const dateTime = DateTime.local()
    const browser = detect()
    console.debug('Browser Info', browser)
    console.debug('Time Zone', dateTime.zoneName, dateTime.offset)
    return browser?.name === 'chrome' && dateTime.offset === -480

    // const userAgent = new UserAgent()
    // console.debug(userAgent.toString())
    // console.debug(JSON.stringify(userAgent.data, null, 2))
  },
  loadingSounds(db) {
    return Promise.all([
      db.sounds
        .bulkGet(['light-custom', 'medium-custom', 'heavy-custom'])
        .then(sounds => {
          return sounds
            .filter(it => it && it.base64)
            .map(sound => {
              return {
                key: sound.id,
                player: new Howl({ src: sound.base64, preload: true }),
              }
            })
        }),
      this.loadingDefaultSounds(READER_SOUNDS),
    ]).then(it => it.flatMap(sounds => sounds))
  },
  loadingDefaultSounds(soundInfos) {
    return Promise.all(
      soundInfos.map(sound => {
        if (sound.filename == null)
          return Promise.resolve({ key: sound.key, player: null })
        return import(`Assets/sound/${sound.filename}`).then(it => {
          return {
            key: sound.key,
            player: new Howl({ src: it?.default, preload: true }),
          }
        })
      })
    )
  },

  setUserDataPart(state, { path, data }) {
    const newUserData = _.cloneDeep(state.userData)
    _.set(newUserData, path, data)
    state.userData = newUserData
    LocalStorageUtil.storeUserData(state.userData)
  },
  setUserDataPartSilently(state, { path, data }) {
    _.set(state.userData, path, data)
    LocalStorageUtil.storeUserData(state.userData)
  },
  setReaderSettingPart(state, { path, data }) {
    const readerSetting = _.cloneDeep(state.readerSetting)
    _.set(readerSetting, path, data)
    state.readerSetting = readerSetting
    LocalStorageUtil.storeReaderUserData(state.readerSetting)
  },
  setReaderSettingPartSilently(state, { path, data }) {
    _.set(state.readerSetting, path, data)
    LocalStorageUtil.storeReaderUserData(state.readerSetting)
  },

  // setUserDataPartInLocalStorage(state, { path, data }) {
  //   const newUserData = _.cloneDeep(state.userData)
  //   _.set(newUserData, path, data)
  //   LocalStorageUtil.storeUserData(state.userData)
  // },

  getUserDataPart(state) {
    return path => {
      return _.get(state.userData, path)
    }
  },

  // combine icon file together
  // https://css-tricks.com/css-sprites/
  // https://www.toptal.com/developers/css/sprite-generator
  getItemIconClass(id, defaultIcon = 60034) {
    const iconId = this.ITEMS[this.toItemId(id)]?.icon ?? defaultIcon
    // const localImg = require(`../assert/${iconId}.png`)
    // if (localImg) {
    //   return localImg
    // } else {
    return this.iconIdToClass(iconId)
    // }
  },

  getDiademItemIconUrl(id) {
    // console.log(id, id === 29717 ? ImgUtil.getImgUrl('diadem-any-bait.webp') : null)
    return id === 29717 ? ImgUtil.getImgUrl('diadem-any-bait.webp') : null
  },

  getItemName(id) {
    const names = itemNames[this.toItemId(id)]
    let item
    if (!names) {
      item = this.ITEMS[this.toItemId(id)]
    } else {
      item = {
        name_chs: names.chs,
        name_en: names.en,
        name_ja: names.ja,
      }
    }
    return this.getName(item, SystemInfo.dataLocale)
  },

  getItemNames(id) {
    return itemNames[this.toItemId(id)]
  },
  isFishInLog(id) {
    return !!FISH_PARAMETER.find(it => it.Item === this.toItemId(id))?.IsInLog
  },
  isFishId(id) {
    return !!this.FISH_DATA[id]
  },

  toPatchText(patch) {
    return patch
      ? patch.toString().indexOf('.') !== -1
        ? patch.toString()
        : patch.toFixed(1)
      : ''
  },

  //
  // getFishType(fishId) {
  //   const normalOrSpearFish = this.FISH_DATA[fishId]
  //   if (normalOrSpearFish) {
  //     return normalOrSpearFish.gig == null ? 'spear' : 'normal'
  //   } else {
  //     return OCEAN_FISHING_FISH[fishId]
  //       ? 'ocean'
  //       : DIADEM_FISH[fishId]
  //       ? 'diadem'
  //       : 'normal'
  //   }
  // },

  isDiademSpot(id) {
    return id > 10000
  },
  isOceanFishingSpot(id) {
    return isOceanFishingNormalSpot(id) || isOceanFishingCurrentSpot(id)
  },
  isOceanFishingNormalSpot: isOceanFishingNormalSpot,
  isOceanFishingCurrentSpot: isOceanFishingCurrentSpot,
  shift2Icon(shift) {
    const shiftIconDict = [mdiWeatherSunny, mdiWeatherSunset, mdiWeatherNight]
    return shiftIconDict[shift]
  },
  assembleAquarium(aquarium, fishData) {
    return {
      id: aquarium.id,
      name: this.getItemName(aquarium.id),
      icon: this.getItemIconClass(aquarium.id),
      patch: this.toPatchText(fishData?.patch),
      water: this.getName(AQUARIUM_WATER[aquarium.aquariumWater]),
      waterId: aquarium.aquariumWater,
      sizeId: aquarium.size,
      size: AQUARIUM_FISH_SIZE[aquarium.size].size,
      images: [
        ...(aquarium.size === 1
          ? [
              {
                gif: ImgUtil.getAquariumImgUrl(`${aquarium.id}-s.webp`),
                cover: ImgUtil.getImgUrl(
                  `${aquarium.id}-s-cover.webp`,
                  ImgUtil.CATEGORY.AQUARIUM
                ),
              },
            ]
          : []),
        {
          gif: ImgUtil.getAquariumImgUrl(`${aquarium.id}.webp`),
          cover: ImgUtil.getImgUrl(
            `${aquarium.id}-cover.webp`,
            ImgUtil.CATEGORY.AQUARIUM
          ),
        },
      ],
      available: aquarium.patch === 6 ? 1 : aquarium.patch > 6 ? 2 : 0,
    }
  },

  ringBell(soundSetting, tugType, sounds) {
    const setting = soundSetting[tugType]
    const key = setting.source === 'DEFAULT' ? tugType : `${tugType}-custom`
    sounds[key]?.player?.volume(setting.volume).play()
  },

  toHuijiWikiQuestLink: toHuijiWikiQuestLink,

  getCNTime(milliSeconds) {
    return DateTime.fromMillis(milliSeconds).setZone(FixedOffsetZone.instance(480))
  },
  // FUNCTION END

  TIME_UNITS: ['day', 'hour', 'minute', 'second', 'days', 'hours', 'minutes', 'seconds'],

  INTERVAL_SECOND: CONSTANTS.INTERVAL_SECOND,
  INTERVAL_MINUTE: CONSTANTS.INTERVAL_MINUTE,
  INTERVAL_HOUR: CONSTANTS.INTERVAL_HOUR,
  INTERVAL_DAY: CONSTANTS.INTERVAL_DAY,

  GIG_ICON: {
    small: ImgUtil.iconIdToClass(60671),
    normal: ImgUtil.iconIdToClass(60672),
    large: ImgUtil.iconIdToClass(60673),
    all: ImgUtil.iconIdToClass(1121),
  },

  GIG_DICT: ['', 'small', 'normal', 'large', 'all'],

  TUG_TYPES: ['light', 'medium', 'heavy'],

  TUG_ICON: {
    light: '!',
    medium: '! !',
    heavy: '! ! !',
  },

  TUG_ICON_COLOR: {
    '!': 'success',
    '! !': 'error',
    '! ! !': 'warning',
  },

  HOOKSET_ICON: {
    Normal: '001103',
    Powerful: '001115',
    Precision: '001116',
    Double: '001118',
    Triple: '001138',
  },

  HOOKSET_SKILL_NAME_DICT: {
    Powerful: '强力提钩',
    Precision: '精准提钩',
    Normal: '提钩',
    Double: '双重提钩',
    Triple: '三重提钩',
  },

  COUNT_DOWN_TYPE: ['fishing', 'waiting', 'allAvailable'],

  FISHING: 0,
  WAITING: 1,
  ALL_AVAILABLE: 2,

  ICON_PREDATORS: '011101',
  ICON_SNAGGING: '011102',
  ICON_FISH_EYES: '011103',

  ITEM_COLOR: {
    FISHING: ['#22362b', 'primary darken-2'],
    WAITING: ['transparent', 'transparent'],
    COMPLETED: ['#173251', 'success darken-2'],
    NORMAL: ['grey darken-3', 'grey darken-4'],
  },

  ITEM_BACKGROUND_COLOR: {
    FISHING: ['#22362b', '#183027'],
    COMPLETED: ['#173251', '#0c2242'],
    WAITING: ['#2d2d32', '#272727'],
  },

  PATCH_MAX: CONSTANTS.GLOBAL_PATCH_VERSION,
  PATCH_AVAILABLE_MAX: CONSTANTS.CN_PATCH_VERSION,
  XIV_API_HOST: 'https://cafemaker.wakingsands.com', //'https://xivapi.com',

  COMPLETE_FILTER_TYPES: COMPLETE_FILTER_TYPES,
  BIG_FISH_FILTER_TYPES: BIG_FISH_FILTER_TYPES,
  FISH_SORTER_TYPES: FISH_SORTER_TYPES,
  FISH_CONSTRAINT_FILTER_TYPES: FISH_CONSTRAINT_FILTER_TYPES,

  BAIT_FISH_SORTER_TYPES: BAIT_FISH_SORTER_TYPES,

  USER_DEFAULT_DATA: {
    // website version info
    websiteVersion: '0.1.0',
    migrationVersion: '0.1.0',
    completed: [],
    pinned: [],
    toBeNotified: [],
    toBeNotifiedLocked: [],
    toBeNotifiedIKDRoutes: [],
    filters: {
      patches: [
        // eslint-disable-next-line
        2.0, 2.1, 2.2, 2.3, 2.4, 2.5,
        // eslint-disable-next-line
        3.0, 3.1, 3.2, 3.3, 3.4, 3.5,
        // eslint-disable-next-line
        4.0, 4.1, 4.2, 4.3, 4.4, 4.5,
        // eslint-disable-next-line
        5.0, 5.1, 5.2, 5.3, 5.4, 5.5,
        // eslint-disable-next-line
        6.0,
      ],
      completeType: 'UNCOMPLETED', // before 0.5.3
      bigFishType: 'BIG_FISH', // before 0.5.3
      completeTypes: COMPLETE_FILTER_TYPES,
      bigFishTypes: BIG_FISH_FILTER_TYPES,
      fishN: 10,
      sorterType: 'COUNTDOWN',
      fishConstraintTypes: FISH_CONSTRAINT_FILTER_TYPES,
    },
    baitFilter: {
      enabled: false,
      baitIds: [],
    },
    // page settings
    listSetting: {
      normal: {
        expanded: true,
      },
      pinned: {
        expanded: true,
        showPinnedInNormalList: false,
      },
    },
    showFilter: true,
    showBanner: true,
    opacity: 1,
    zoomFactor: 1,
    rightPanePercentage: 30,
    rightPanePercentageV2: 0.3,
    notification: {
      volume: 0.5,
      isSystemNotificationEnabled: true,
      settings: [
        {
          key: 'waiting',
          sound: NOTIFICATION_SOUNDS[1].key,
          enabled: true,
          hasBefore: true,
          before: 2,
        },
        {
          key: 'fishing',
          sound: NOTIFICATION_SOUNDS[2].key,
          enabled: true,
          hasBefore: false,
          before: 0,
        },
      ],
      IKDRouteSettings: [
        {
          key: 'start',
          sound: NOTIFICATION_SOUNDS[3].key,
          enabled: true,
          hasBefore: true,
          before: 2,
          offset: 0,
        },
        {
          key: 'end',
          sound: NOTIFICATION_SOUNDS[6].key,
          enabled: true,
          hasBefore: true,
          before: 2,
          offset: 15,
        },
      ],
    },
    detailArrangement: {
      components: [
        {
          name: 'DetailItemMap',
          expandedEnabled: true,
          expanded: true,
          enabled: true,
          order: 0,
        },
        {
          name: 'DetailItemFishWindowTable',
          expandedEnabled: true,
          expanded: true,
          enabled: true,
          order: 1,
        },
        {
          name: 'DetailItemCountdownBar',
          expandedEnabled: false,
          enabled: true,
          order: 2,
        },
        {
          name: 'DetailItemRequirements',
          expandedEnabled: false,
          enabled: true,
          order: 3,
        },
        {
          name: 'DetailItemBuffAndBaits',
          expandedEnabled: false,
          enabled: true,
          order: 4,
        },
        {
          name: 'DetailItemPredators',
          expandedEnabled: false,
          enabled: true,
          order: 5,
        },
        {
          name: 'DetailItemTips',
          expandedEnabled: true,
          expanded: true,
          enabled: true,
          order: 6,
        },
        {
          name: 'DetailItemAquarium',
          expandedEnabled: true,
          expanded: true,
          enabled: true,
          order: 7,
        },
        {
          name: 'DetailItemQuest',
          expandedEnabled: false,
          enabled: true,
          order: 8,
        },
        {
          name: 'DetailItemFishDescription',
          expandedEnabled: true,
          expanded: true,
          enabled: true,
          order: 9,
        },
        {
          name: 'DetailItemMasterpiece',
          expandedEnabled: false,
          expanded: false,
          enabled: true,
          order: 10,
        },
      ],
    },
    theme: {
      dark: true, // before 0.5.3
      mode: THEME_SETTING_MODES[0],
    },
    event: {
      starLight: true,
    },
    oceanFishing: {
      showWarningDialog: true,
      showUpdateDialog: false,
      showBiteTimeDialog: true,
    },
    link: {
      default: {
        itemV2: 'HUIJI',
        fish: 'PASTRY_FISH',
        spot: 'PASTRY_FISH',
      },
    },
    bait: {
      enableNotification: true,
      listFilter: {
        completeTypes: ['UNCOMPLETED'],
        bigFishTypes: BIG_FISH_FILTER_TYPES,
        sorterType: 'QUANTITY',
      },
      notificationFilter: {
        completeTypes: ['UNCOMPLETED'],
        bigFishTypes: BIG_FISH_FILTER_TYPES,
      },
    },
    showChromeBugDialog: true,
    showCompetitionDialog: true,
    fishEyesUsed: false,
    mainWindow: {
      closeMode: 'CLOSE',
    },
    isRoseMode: false,
    readChartTip: false,
    // reader: {
    //   region: 'CN',
    //   monitorType: 'RawSocket',
    //   autoSetCompleted: true,
    //   autoSetCompletedOnlyHQ: false,
    //   showReaderOnlyIfFishing: false,
    //   hotkey: {
    //     mouseThrough: 'L',
    //   },
    //   showReaderBanner: true,
    //   main: {
    //     pos: { x: null, y: null },
    //     size: { w: 1080, h: 768 },
    //   },
    //   setting: {
    //     pos: { x: null, y: null },
    //     size: { w: 500, h: 500 },
    //   },
    //   timer: {
    //     pos: { x: null, y: null },
    //     size: { w: 500, h: 160 },
    //     opacity: 0.9,
    //     zoomFactor: 1,
    //     sound: {
    //       light: {
    //         source: 'DEFAULT',
    //         customPath: undefined,
    //         volume: 0.5,
    //       },
    //       medium: {
    //         source: 'DEFAULT',
    //         customPath: undefined,
    //         volume: 0.5,
    //       },
    //       heavy: {
    //         source: 'DEFAULT',
    //         customPath: undefined,
    //         volume: 0.5,
    //       },
    //     },
    //     color: {
    //       default: '#607d8bff',
    //       light: '#2a9d8fff',
    //       medium: '#c14953ff',
    //       heavy: '#b68738ff',
    //     },
    //   },
    //   history: {
    //     pos: { x: null, y: null },
    //     size: { w: 500, h: 800 },
    //     opacity: 0.9,
    //     zoomFactor: 1,
    //   },
    //   spotStatistics: {
    //     pos: { x: null, y: null },
    //     size: { w: 500, h: 500 },
    //     opacity: 0.9,
    //     zoomFactor: 1,
    //   },
    // },
  },

  READER_DEFAULT_DATA: {
    region: 'CN',
    monitorType: 'RawSocket',
    autoSetCompleted: true,
    autoSetCompletedOnlyHQ: false,
    showReaderOnlyIfFishing: false,
    isUploadMode: false,
    isStrictMode: false,
    hotkey: {
      mouseThrough: 'L',
      toggleReader: 'K',
    },
    showReaderBanner: true,
    showHistoryConfig: true,
    timer: {
      sound: {
        light: {
          source: 'DEFAULT',
          customPath: undefined,
          volume: 0.5,
        },
        medium: {
          source: 'DEFAULT',
          customPath: undefined,
          volume: 0.5,
        },
        heavy: {
          source: 'DEFAULT',
          customPath: undefined,
          volume: 0.5,
        },
      },
      color: {
        default: '#607d8bff',
        light: '#2a9d8fff',
        medium: '#c14953ff',
        heavy: '#b68738ff',
      },
    },
  },

  THEME_SETTING_MODES: THEME_SETTING_MODES,
  DATA_LOCALES: DATA_LOCALES,
  DATA_SUB_LOCALES: DATA_SUB_LOCALES,
  UI_LOCALES: UI_LOCALES,
  REGIONS: CONSTANTS.REGIONS,
  REGIONS_VERSION: [CONSTANTS.CN_PATCH_VERSION, CONSTANTS.GLOBAL_PATCH_VERSION],
  toPatchStr: patch => (_.isInteger(patch) ? patch.toFixed(1) : patch.toFixed(2)),
  DETAIL_ITEM_DISPLAY_CONSTRAINTS: {
    DetailItemMap: 'hasFishingSpot',
    DetailItemCountdownBar: false,
    DetailItemRequirements: false,
    DetailItemBuffAndBaits: false,
    DetailItemFishWindowTable: 'hasCountDown',
    DetailItemPredators: 'hasAnyPredators',
    DetailItemTips: 'hasTips',
    DetailItemAquarium: 'aquarium',
    DetailItemQuest: 'hasTasks',
  },

  // fish tracker [js/app/viewmodel.js]
  FISH_TRACKER_STRUCTURE: {
    filters: {
      completion: 'all',
      patch: [],
    },
    completed: [],
    pinned: [],
    upcomingWindowFormat: 'fromPrevClose',
    sortingType: 'windowPeriods',
    theme: 'dark',
  },

  // TAB_INDEX_PINNED: 0,
  TAB_INDEX_NORMAL: 0,
  TAB_INDEX_TO_BE_NOTIFIED: 1,

  TABS: [
    { icon: mdiFormatListText, title: 'listPage.title' },
    { icon: mdiBell, title: 'list.toBeNotifiedTitle' },
  ],

  NOTIFICATION_SOUNDS: NOTIFICATION_SOUNDS,
  READER_SOUNDS: READER_SOUNDS,

  FISH_DATA: FISH,
  ITEMS: ITEMS,
  FISHING_SPOTS: _.merge(DATA.FISHING_SPOTS, DATA_CN.FISHING_SPOTS),
  FISH_ID_TO_WIKI_IDS: generateFishId2WikiId(FISH),
}
