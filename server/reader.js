const { app } = require('electron')
const path = require('path')
const MachinaFFXIV = require('node-machina-ffxiv')
const isDev = require('electron-is-dev')
const isElevated = require('is-elevated')
const { exec } = require('child_process')
const log = require('electron-log')
const { TERRITORY_TYPES } = require('../data/fix')
const { voyagesWithTipOf } = require('../utils/OceanFishingCore')
const { v4: uuid } = require('uuid')
const { version: PASTRY_FISH_VERSION } = require('../package.json')
const { CN_PATCH_VERSION, GLOBAL_PATCH_VERSION } = require('../data/constants')
const merge = require('lodash/merge')
const cloneDeep = require('lodash/cloneDeep')
const Events = require('events')
const playerSetupOf = require('./customDataReader/playerSetup')
const { toReadable } = require('./toReadable')

const INTERVAL_MINUTE = 60000
const DIADEM_WEATHER_COUNTDOWN_TOTAL = 10 * INTERVAL_MINUTE
const SPECTRAL_CURRENT_WEATHER_ID = 145
const SPECTRAL_CURRENT_FINISHED_WEATHER_ID = 1
const DIADEM_WEATHERS = [133, 134, 135, 136]

// in dev load directly
// in prod set the required files by set the packaged patch manually
// log.transports.file.level = 'info'

const EMPTY_RECORD = {
  startTime: undefined,
  biteTime: undefined,
  hookset: undefined,
  fishId: -1,
  hq: false,
  size: 0,
}
let status, currentRecord
const records = []
const readableRecords = []
resetStatus()
resetRecord()

const ffxivEvent = new Events.EventEmitter()

const machinaOptions = isDev
  ? {
      monitorType: 'WinPCap',
      parseAlgorithm: 'PacketSpecific',
      region: 'CN',
      port: 13347,
      // logger: log.debug
    }
  : {
      // logger: log.debug,
      parseAlgorithm: 'PacketSpecific',
      noData: false,
      monitorType: 'RawSocket',
      region: 'CN',
      port: 13347,
      machinaExePath: path.join(
        app.getAppPath(),
        '../../resources/MachinaWrapper/MachinaWrapper.exe'
      ),
      remoteDataPath: path.join(app.getAppPath(), '../../resources/remote-data'),
      definitionsDir: path.join(
        app.getAppPath(),
        '../../resources/app.asar.unpacked/node_modules/node-machina-ffxiv/models/default'
      ),
    }

let Machina,
  machinaStatus = 'stopped',
  region = 'CN'
function startMachina(options, callback = () => {}) {
  isElevated()
    .then(elevated => {
      if (elevated) {
        // if (!isDev) {
        exec(
          'netsh advfirewall firewall delete rule name="pastry-fish-reader - Machina"',
          () => {
            addMachinaFirewallRule()
          }
        )
        // }
      }
    })
    .then(() => {
      const mergedOptions = merge(machinaOptions, options)
      Machina = new MachinaFFXIV(mergedOptions)
      region = mergedOptions.region || 'CN'
      log.debug('options', mergedOptions)
      resetStatus()
      resetRecord()
      init()
      Machina.start(() => {
        machinaStatus = 'running'
        callback()
      })
    })
}
exports.start = startMachina
exports.onUpdate = onUpdate
exports.stop = stopMachina

function stopMachina(callback = () => {}) {
  Machina.stop(() => {
    machinaStatus = 'stopped'
    callback()
  })
}

exports.restart = (options, callback = () => {}) => {
  if (machinaStatus === 'running') {
    stopMachina(() => {
      log.debug('machina stopped')
      startMachina(options, callback)
    })
  } else {
    startMachina(options, callback)
  }
  // TEST
  // return startMachina({ region: 'Global' }, callback)
}

let fishCaughtCallback
exports.onFishCaught = callback => {
  fishCaughtCallback = callback
}
let fishRecordCallback
exports.onNewRecord = callback => {
  fishRecordCallback = callback
}

let playerSetupCallback = data => {
  log.debug('sending player setup data', data)
}
exports.onPlayerSetup = callback => {
  playerSetupCallback = callback
}


function weatherChangeOf(weatherId) {
  return {
    // Global
    type: 'weatherChange',
    opcode: 359,
    // CN
    // type: 'unknown',
    // opcode: 225,
    region: 'Global',
    connection: '',
    operation: 'receive',
    epoch: 1615705349631,
    packetSize: 40,
    segmentType: 3,
    sourceActorSessionID: 0,
    targetActorSessionID: 0,
    serverID: 4,
    timestamp: 1615705349,
    weatherID: weatherId,
    data: [weatherId],
    delay: 20,
  }
}

function someDirectorUnk4Of(spotId) {
  return {
    // Global
    type: 'someDirectorUnk4',
    opcode: 359,
    // CN
    // type: 'unknown',
    // opcode: 225,
    region: 'Global',
    connection: '',
    operation: 'receive',
    epoch: 1615705349631,
    packetSize: 40,
    segmentType: 3,
    sourceActorSessionID: 0,
    targetActorSessionID: 0,
    serverID: 4,
    timestamp: 1615705349,
    param3: spotId,
    delay: 20,
  }
}

function initZoneOf(zoneId) {
  return {
    type: 'initZone',
    opcode: 563,
    region: 'Global',
    connection: '',
    operation: 'receive',
    epoch: 1615705349631,
    packetSize: 128,
    segmentType: 3,
    sourceActorSessionID: 0,
    targetActorSessionID: 0,
    serverID: 4,
    timestamp: 1615705349,
    zoneID: zoneId,
    unknown1: 0,
    contentfinderConditionID: 0,
    weatherID: 0,
    bitmask: 0,
    bitmask1: 0,
    unknown5: 0,
    unknown8: 4170478,
    festivalID: 26881,
    additionalFestivalID: 0,
    unknown9: 16570282,
    unknown10: 99,
    unknown11: 1091141632,
    unknown12: [1065353216, 0, 0, 0],
    pos: { x: 0, y: 0, z: 0 },
    unknown13: 0,
  }
}

function prepareZoningOf(targetZone) {
  return {
    type: 'prepareZoning',
    opcode: 494,
    region: 'Global',
    connection: '',
    operation: 'receive',
    epoch: 1615705610191,
    packetSize: 48,
    segmentType: 3,
    sourceActorSessionID: 0,
    targetActorSessionID: 0,
    serverID: 4,
    timestamp: 1615705610,
    logMessage: 0,
    targetZone: targetZone,
    animation: 112,
    hideChar: 0,
    fadeOut: 0,
    fadeOutTime: 14,
  }
}

const mockEvents = [
  prepareZoningOf(900),
  initZoneOf(900),
  weatherChangeOf(2),
  // weatherChangeOf(SPECTRAL_CURRENT_WEATHER_ID),
  // weatherChangeOf(1),
  someDirectorUnk4Of(3621),
  someDirectorUnk4Of(3621),
  someDirectorUnk4Of(3621),

  someDirectorUnk4Of(3454),
  someDirectorUnk4Of(3454),
  someDirectorUnk4Of(3454),
  weatherChangeOf(SPECTRAL_CURRENT_WEATHER_ID),
  someDirectorUnk4Of(3455),
  someDirectorUnk4Of(3455),
  weatherChangeOf(1),
  someDirectorUnk4Of(3454),
  someDirectorUnk4Of(3454),

  weatherChangeOf(5),
  someDirectorUnk4Of(3625),
  someDirectorUnk4Of(3625),

  weatherChangeOf(SPECTRAL_CURRENT_WEATHER_ID),
  someDirectorUnk4Of(3626),
  someDirectorUnk4Of(3626),
  weatherChangeOf(1),
  someDirectorUnk4Of(3625),
  someDirectorUnk4Of(3625),
]
let mockIndex = 0
exports.nextTestEvent = () => {
  if (mockIndex < mockEvents.length) {
    ffxivEvent.emit('ffxivEvent', mockEvents[mockIndex++])
  } else {
    log.info('no more test event')
  }
}
exports.resetTest = () => {
  mockIndex = 0
  resetStatus()
  resetRecord()
}

let updateCallback = data => {
  log.debug('sending data', data)
}

function init() {
  Machina.setMaxListeners(0)

  Machina.on('any', packet => {
    if (packet && filterPacketSessionID(packet)) {
      ffxivEvent.emit('ffxivEvent', packet)
    }
  })
}

function onUpdate(callback) {
  updateCallback = callback
}

// Add machina to firewall stuffs
function addMachinaFirewallRule() {
  const machinaExePath = path.join(
    app.getAppPath(),
    '../../resources/MachinaWrapper/MachinaWrapper.exe'
  )
  exec(
    `netsh advfirewall firewall add rule name="pastry-fish-reader - Machina" dir=in action=allow program="${machinaExePath}" enable=yes`
  )
}

exports.addMachinaFirewallRule = addMachinaFirewallRule

ffxivEvent.setMaxListeners(0)

function filterPacketSessionID(packet) {
  return packet.sourceActorSessionID === packet.targetActorSessionID
}

function onFFXIVEvent(type, callback, skipUpdateEvent = false) {
  onFFXIVEventWithFilter(type, null, null, null, callback, skipUpdateEvent)
}

function onFFXIVEvents(types, callback) {
  types.forEach(type => onFFXIVEvent(type, callback))
}

function onFFXIVEventSubType(subType, callback) {
  onFFXIVEventWithFilter(null, subType, null, null, callback)
}

function onFFXIVEventOfUnknown(opcode, callback) {
  ffxivEvent.on('ffxivEvent', packet => {
    if (packet && packet.type === 'unknown' && packet.opcode === opcode) {
      callback(packet)
      updateCallback({
        status,
        currentRecord,
      })
    }
  })
}

function onFFXIVEventWithFilter(
  type,
  subType,
  category,
  opcode,
  callback,
  skipUpdateEvent = false
) {
  ffxivEvent.on('ffxivEvent', packet => {
    if (
      packet &&
      (!type || packet.type === type) &&
      (!subType || packet.subType === subType) &&
      (!category || packet.category === category) &&
      (!opcode || packet.opcode === opcode)
    ) {
      callback(packet)
      if (!skipUpdateEvent) {
        updateCallback({
          status,
          currentRecord,
          // records,
          // readableRecords,
        })
      }
      // log.debug(status)
      // log.debug(currentRecord)
      // log.debug(records)
      // log.debug(readableRecords)
      // log.debug('----------------------------------------------------')
    }
  })
}

// update single status according to action/effect
const action2Effect = {
  4100: 761, // snagging
  4101: 805, //collectorGlove
  // 4104: 763, // chum
  // 4105: 762, // fishEyes
  4595: 1803, // Surface Slap
  4596: 1804, // Identical Cast
}
onFFXIVEvent('effect', packet => {
  log.debug('in effect', packet.type)
  const effectId = action2Effect[packet.actionId]
  if (effectId) {
    status.effects.add(effectId)
  }
})

onFFXIVEvent(
  'prepareZoning',
  packet => {
    if (packet.targetZone && TERRITORY_TYPES[packet.targetZone]) {
      status.zoneId = TERRITORY_TYPES[packet.targetZone].placeName
      log.debug('targetZone', packet.targetZone, 'placeName', status.zoneId)
    } else {
      log.debug('targetZone Zero')
    }
    status.weather = undefined
    status.spectralCurrentEndTime = undefined
    status.diademWeatherEndTime = undefined
    status.spectralCurrentBuffTime = 0
    status.oceanFishingRouteIndex = -1
    status.spotCurrents = [false, false, false]
  },
  true
)

onFFXIVEvent(
  'initZone',
  packet => {
    status.effects = new Set()
    if (packet.zoneID && TERRITORY_TYPES[packet.zoneID]) {
      status.zoneId = TERRITORY_TYPES[packet.zoneID].placeName
      log.debug('initZone', status.zoneId)
    }
  },
  true
)

onFFXIVEventWithFilter('actorControl', null, 20, null, packet => {
  // log.debug('actorControl', packet)
  status.effects.add(packet.param1)
})

onFFXIVEventWithFilter('actorControl', null, 21, null, packet => {
  status.effects.delete(packet.param1)
})

// status.csv
const effectToDetect = new Set([
  761, // SNAGGING
  805, // COLLECTOR_GLOVE
  763, // CHUM
  762, // FISH_EYES
  1803, // Surface Slap
  1804, // Identical Cast
  850, // Gathering Fortune Up -> Patient I&II
  764, // Inefficient Hooking -> Patient I&II
  765, // Catch and Release -> Patient II
  568, // Fisher's Intuition
])

// update all status according to statusEffectList
onFFXIVEvent('statusEffectList', packet => {
  // log.debug('statusEffectList', packet)
  packet.effects
    .map(it => it.unknown1)
    .filter(effectId => effectToDetect.has(effectId))
    .forEach(effectId => status.effects.add(effectId))
})

onFFXIVEventSubType('fishingBaitMsg', packet => {
  // actorControlSelf
  status.baitId = packet.baitID
})

// onFFXIVEventSubType('actionStart', packet => {
//   // actorControlSelf
//   log.debug('actionStart', packet.actionID, packet.actionCooldown, packet)
// })

const FISHING_EVENT = 0x150001
onFFXIVEvents(['eventStart', 'eventFinish'], packet => {
  // log.debug('fevent', packet.type, packet.eventId)
  if (packet.eventId === FISHING_EVENT) {
    status.isFishing = packet.type === 'eventStart'
    if (!status.isFishing) {
      status.prevFishId = -1
    }
  }
})

function saveCurrentRecord() {
  if (
    currentRecord.startTime != null &&
    currentRecord.biteTime != null &&
    currentRecord.startTime < currentRecord.biteTime
  ) {
    if (currentRecord.mooch) {
      currentRecord.baitId = status.prevFishId
    }
    currentRecord.id = uuid()
    fishRecordCallback(currentRecord)
    if (currentRecord.missed) {
      log.info('fish missed')
    } else if (currentRecord.cancelled) {
      log.info('fish ignored')
    }
    records.push(currentRecord)
    readableRecords.push(toReadable(currentRecord))
  }
  resetRecord()
}

function resetStatus() {
  log.info('reset status')
  status = {
    effects: new Set(),
    isFishing: undefined,
    baitId: undefined,
    spotId: undefined,
    mooch: false,
    prevFishId: -1,
    weather: undefined,
    zoneId: undefined,
    spectralCurrentBuffTime: 0,
    oceanFishingRouteIndex: -1,
    spotCurrents: [false, false, false]
  }
}

function resetRecord() {
  log.info('reset record')
  currentRecord = cloneDeep(EMPTY_RECORD)
}

onFFXIVEvent('eventPlay', packet => {
  if (packet.eventId === FISHING_EVENT) {
    // log.debug('eventPlay', actionTimeline[packet.param5], packet)
    switch (packet.scene) {
      case 1:
        status.isFishing = true
        currentRecord.startTime = Date.now()
        currentRecord.biteTime = undefined
        break
      case 5:
        currentRecord.biteTime = Date.now()
        currentRecord.tug = getTug(packet.param5)
        break
      case 2:
        currentRecord.cancelled =
          !!actionTimeline[packet.param5] &&
          actionTimeline[packet.param5].subType === 'cancel'
        saveCurrentRecord()
        break
      default:
        log.debug('other scene', packet.scene)
    }
  }
})

function applyCurrentStatusOnStart(record, status) {
  // log.debug('apply status')
  // log.debug(status)
  record.snagging = status.effects.has(761)
  record.chum = status.effects.has(763)
  record.fishEyes = status.effects.has(762)
  record.surfaceScale = status.effects.has(1803)
  record.identicalCast = status.effects.has(1804)
  record.gatheringFortuneUp = status.effects.has(850)
  record.catchAndRelease = status.effects.has(765)
  record.fishersIntuition = status.effects.has(568)
  record.baitId = status.baitId
  record.mooch = status.mooch
  record.spotId = status.spotId
  record.pastryFishVersion = PASTRY_FISH_VERSION
  record.patch = region === 'CN' ? CN_PATCH_VERSION : GLOBAL_PATCH_VERSION
  record.region = region
  record.weatherDetected = status.weather
  record.prevWeatherDetected = status.previousWeather
  record.surfaceScaleFishId = record.surfaceScale ? status.prevFishId : -1

  status.mooch = false
}

function applyCurrentStatusOnLanding(record, status) {
  if (status.isFisher) {
    record.collectorGlove = status.effects.has(805)
    record.gathering = status.gathering
    record.perception = status.perception
    record.gp = status.gp
  }
}

function getTug(value) {
  switch (value) {
    case 292:
      return 'light'
    case 293:
      return 'medium'
    case 294:
      return 'heavy'
    default:
      return null
  }
}

onFFXIVEvent('eventPlay4', packet => {
  if (actionTimeline[packet.param1] != null) {
    // currentRecord.hookset = getHookset(packet.param1)
    currentRecord.missed =
      actionTimeline[packet.param2] != null &&
      actionTimeline[packet.param1].subType.includes('hooking') &&
      !actionTimeline[packet.param2].subType.includes('landing')
    applyCurrentStatusOnLanding(currentRecord, status)
  }
})
const actionTimeline = {
  271: { id: 271, type: 'fishing', subType: 'idle' }, // 持竿
  272: { id: 272, type: 'fishing', subType: 'item' },
  273: { id: 273, type: 'fishing', subType: 'end' }, // 收杆 收回了鱼线。
  274: { id: 274, type: 'fishing', subType: 'cast_normal' }, // 抛竿普通 甩出了鱼线开始钓鱼。
  275: { id: 275, type: 'fishing', subType: 'cast_side' }, // 抛竿 拟饵 甩出了鱼线开始钓鱼。
  276: { id: 276, type: 'fishing', subType: 'cast_fly' }, // 甩出了鱼线开始钓鱼。
  277: { id: 277, type: 'fishing', subType: 'retrieve_idle' },
  278: { id: 278, type: 'fishing', subType: 'reeling_idle' },
  279: { id: 279, type: 'fishing', subType: 'reeling_fast' },
  280: { id: 280, type: 'fishing', subType: 'reeling_slow' },
  281: { id: 281, type: 'fishing', subType: 'wobble_action' },
  282: { id: 282, type: 'fishing', subType: 'jerk_and_fall' },
  283: { id: 283, type: 'fishing', subType: 'cancel' }, // 提前提竿 OR 脱钩(上钩的鱼逃走了……)
  284: { id: 284, type: 'fishing', subType: 'hooking' }, // 提钩（包括双提）
  285: { id: 285, type: 'fishing', subType: 'short_landing_nq' }, // 提钩拉扯动作
  286: { id: 286, type: 'fishing', subType: 'short_landing_hq' },
  287: { id: 287, type: 'fishing', subType: 'normal_landing_nq' },
  288: { id: 288, type: 'fishing', subType: 'normal_landing_hq' },
  289: { id: 289, type: 'fishing', subType: 'long_landing_nq' },
  290: { id: 290, type: 'fishing', subType: 'long_landing_hq' },
  291: { id: 291, type: 'fishing', subType: 'landing_failure' },
  292: { id: 292, type: 'fishing', subType: 'hit_excite' }, // 轻杆
  293: { id: 293, type: 'fishing', subType: 'hit_strike' }, // 中杆
  294: { id: 294, type: 'fishing', subType: 'hit_bite' }, // 鱼王竿
  3143: { id: 3143, type: 'fishing_chair', subType: 'idle' },
  3144: { id: 3144, type: 'fishing_chair', subType: 'end' },
  3145: { id: 3145, type: 'fishing_chair', subType: 'cast_normal' },
  3146: { id: 3146, type: 'fishing_chair', subType: 'cast_side' },
  3147: { id: 3147, type: 'fishing_chair', subType: 'cast_fly' },
  3148: { id: 3148, type: 'fishing_chair', subType: 'retrieve_idle' },
  3149: { id: 3149, type: 'fishing_chair', subType: 'reeling_idle' },
  3150: { id: 3150, type: 'fishing_chair', subType: 'reeling_fast' },
  3151: { id: 3151, type: 'fishing_chair', subType: 'reeling_slow' },
  3152: { id: 3152, type: 'fishing_chair', subType: 'wobble_action' },
  3153: { id: 3153, type: 'fishing_chair', subType: 'jerk_and_fall' },
  3154: { id: 3154, type: 'fishing_chair', subType: 'cancel' },
  3155: { id: 3155, type: 'fishing_chair', subType: 'hooking' },
  3156: { id: 3156, type: 'fishing_chair', subType: 'short_landing_nq' },
  3157: { id: 3157, type: 'fishing_chair', subType: 'short_landing_hq' },
  3158: { id: 3158, type: 'fishing_chair', subType: 'normal_landing_nq' },
  3159: { id: 3159, type: 'fishing_chair', subType: 'normal_landing_hq' },
  3160: { id: 3160, type: 'fishing_chair', subType: 'long_landing_nq' },
  3161: { id: 3161, type: 'fishing_chair', subType: 'long_landing_hq' },
  3162: { id: 3162, type: 'fishing_chair', subType: 'landing_failure' },
  3163: { id: 3163, type: 'fishing_chair', subType: 'sitdown' },
  3164: { id: 3164, type: 'fishing_chair', subType: 'standup' },
  3170: { id: 3170, type: 'fishing_chair', subType: 'hooking_big' },
  3171: { id: 3171, type: 'fishing_chair', subType: 'long_landing_nq_new' },
  3172: { id: 3172, type: 'fishing_chair', subType: 'long_landing_hq_new' },
  3173: { id: 3173, type: 'fishing_chair', subType: 'long_landing_sitdown' },
  3189: { id: 3189, type: 'fishing', subType: 'catch_and_release' },
  3190: { id: 3190, type: 'fishing_chair', subType: 'catch_and_release' },
  4659: { id: 4659, type: 'fishing', subType: 'strong_hooking' }, // 强力提钩
  4660: { id: 4660, type: 'fishing', subType: 'precision_hooking' },
  4661: { id: 4661, type: 'fishing', subType: 'makie' },
  4662: { id: 4662, type: 'fishing', subType: 'sonar' },
  4663: { id: 4663, type: 'fishing_chair', subType: 'strong_hooking' },
  4664: { id: 4664, type: 'fishing_chair', subType: 'strong_hooking_big' },
  4665: { id: 4665, type: 'fishing_chair', subType: 'precision_hooking' },
  4666: { id: 4666, type: 'fishing_chair', subType: 'precision_hooking_big' },
  4667: { id: 4667, type: 'fishing_chair', subType: 'makie' },
  4824: { id: 4824, type: 'fishing_chair', subType: 'item' },
  7360: { id: 7360, type: 'fishing', subType: 'bakucho_landing_nq' }, // 幻海流
  7361: { id: 7361, type: 'fishing', subType: 'bakucho_landing_hq' },
  7362: { id: 7362, type: 'fishing_chair', subType: 'bakucho_landing_nq' },
  7363: { id: 7363, type: 'fishing_chair', subType: 'bakucho_landing_hq' },
}
function getHookset(hookset) {
  switch (hookset) {
    case 284:
      return 'normal'
    case 4660:
    case 4665:
    case 4666:
      return 'precision'
    case 4659:
    case 4663:
    case 4664:
      return 'powerful'
    default:
      // log.debug('actionTimeline', hookset)
      return 'normal'
  }
}

function isFlatSet(param, i) {
  return ((param >> i) & 1) === 1
}

// caught fish
onFFXIVEventWithFilter('actorControlSelf', null, 320, null, packet => {
  // log.info(packet.param2.toString(2))
  // log.info(packet.param2.toString(16))
  // log.info(packet.param3.toString(2))
  // log.info(packet.param3.toString(16))
  const caughtFishId = packet.param1
  const hq = isFlatSet(packet.param3, 4)
  const isSpearFish = isFlatSet(packet.param3, 6)
  const quantity = packet.param2 & 0xff
  if (!isSpearFish) {
    log.info('fish caught', caughtFishId)
    fishCaughtCallback({ fishId: caughtFishId, hq })
    if (records.length === 0) return
    const prevRecord = records[records.length - 1]
    prevRecord.fishId = caughtFishId
    prevRecord.hq = hq
    prevRecord.moochable = isFlatSet(packet.param3, 0)
    prevRecord.size = packet.param2 >> 16
    prevRecord.quantity = quantity
    status.prevFishId = prevRecord.fishId

    // log.info('fish caught record', prevRecord)
    fishRecordCallback(prevRecord)
    readableRecords[readableRecords.length - 1] = toReadable(prevRecord)
  } else {
    log.info('spear fish caught', caughtFishId)
    fishCaughtCallback({ fishId: caughtFishId, hq })
  }
})

onFFXIVEvent('someDirectorUnk4', packet => {
  if (
    packet.actionTimeline === 0 &&
    Math.abs(currentRecord.biteTime - Date.now()) < 10000
  ) {
    currentRecord.fishId = -1
    currentRecord.hq = false
    currentRecord.size = 0
  }
})

const placeName2Spots = {
  28: [36],
  29: [35],
  59: [92],
  82: [17],
  86: [20],
  101: [4],
  104: [5],
  112: [10],
  126: [16],
  155: [6],
  168: [56],
  174: [66],
  182: [39],
  192: [42],
  193: [41],
  197: [43],
  202: [97],
  206: [52],
  211: [54],
  214: [58],
  218: [59],
  220: [64],
  228: [65],
  234: [67],
  245: [73],
  246: [74],
  249: [96],
  253: [82],
  264: [72],
  266: [69],
  272: [71],
  274: [70],
  275: [103],
  276: [95],
  297: [77],
  308: [80],
  314: [83],
  323: [85],
  330: [88],
  337: [46],
  338: [48],
  339: [49],
  340: [50],
  341: [47],
  363: [101],
  365: [102],
  389: [27],
  392: [29],
  398: [31],
  404: [33],
  410: [22],
  413: [24],
  414: [23],
  417: [93],
  425: [104],
  426: [105],
  427: [106],
  950: [0],
  951: [2],
  952: [3],
  953: [7],
  954: [8],
  955: [9],
  956: [11],
  957: [12],
  958: [13],
  959: [14],
  960: [15],
  961: [18],
  962: [19],
  963: [21],
  964: [90],
  965: [91],
  966: [25],
  967: [94],
  968: [26],
  969: [28],
  970: [30],
  971: [32],
  972: [34],
  973: [37],
  974: [38],
  975: [40],
  976: [44],
  977: [45],
  978: [51],
  979: [53],
  980: [55],
  981: [57],
  982: [60],
  983: [61],
  984: [62],
  985: [63],
  987: [68],
  988: [98],
  989: [99],
  990: [75],
  991: [76],
  992: [78],
  993: [79],
  995: [84],
  996: [86],
  997: [87],
  998: [89],
  999: [100],
  1000: [81],
  1001: [107],
  1002: [108],
  1003: [111],
  1004: [112],
  1005: [114],
  1006: [116],
  1007: [122],
  1008: [127],
  1009: [128],
  1010: [133],
  1011: [141],
  1012: [155],
  1013: [156],
  1014: [185],
  1015: [186],
  1016: [187],
  1017: [188],
  1018: [189],
  1019: [190],
  1020: [191],
  1021: [192],
  1022: [193],
  1023: [194],
  1025: [195],
  1026: [196],
  1027: [158],
  1028: [159],
  1029: [160],
  1030: [161],
  1031: [162],
  1032: [163],
  1033: [164],
  1034: [165],
  1035: [166],
  1036: [167],
  1037: [170],
  1038: [171],
  1039: [172],
  1040: [173],
  1041: [174],
  1042: [168],
  1043: [169],
  1044: [181],
  1045: [178],
  1046: [175],
  1047: [179],
  1048: [180],
  1049: [177],
  2004: [119],
  2008: [121],
  2013: [129],
  2014: [132],
  2017: [130],
  2019: [117],
  2020: [118],
  2029: [120],
  2030: [124],
  2035: [126],
  2039: [125],
  2048: [134],
  2064: [123],
  2079: [131],
  2102: [137],
  2103: [135],
  2105: [138],
  2109: [140],
  2112: [143],
  2113: [145],
  2114: [146],
  2120: [136],
  2129: [139],
  2173: [144],
  2177: [142],
  2201: [109],
  2211: [115],
  2217: [110],
  2227: [113],
  2257: [147],
  2258: [148, 10001, 10008, 10017],
  2259: [149, 10002, 10009, 10018],
  2260: [150],
  2261: [151, 10003, 10010, 10019],
  2262: [152, 10004, 10011, 10020],
  2263: [153, 10005, 10012, 10021],
  2264: [154, 10006, 10013, 10022],
  2500: [176],
  2501: [157],
  2502: [182],
  2503: [184],
  2504: [183],
  2505: [197],
  2506: [198],
  2507: [10000],
  3289: [199],
  3290: [200],
  3291: [201],
  3292: [202],
  3293: [203],
  3294: [204],
  3295: [205],
  3296: [206],
  3297: [207],
  3298: [208],
  3299: [209],
  3300: [210],
  3301: [211],
  3302: [212],
  3303: [213],
  3304: [214],
  3305: [215],
  3306: [217],
  3307: [216],
  3308: [218],
  3309: [219],
  3310: [220],
  3311: [221],
  3312: [223],
  3313: [224],
  3314: [222],
  3315: [225],
  3316: [226],
  3317: [227],
  3318: [228],
  3319: [229],
  3320: [230],
  3321: [231],
  3322: [232],
  3323: [233],
  3324: [234],
  3325: [235],
  3326: [236],
  3448: [237],
  3449: [238],
  3450: [239],
  3451: [240],
  3452: [243],
  3453: [244],
  3454: [241],
  3455: [242],
  3458: [245],
  3489: [10007, 10014, 10023],
  3532: [10015, 10024],
  3533: [10016, 10025],
  3621: [246],
  3622: [247],
  3623: [248],
  3624: [249],
  3625: [250],
  3626: [251],
}

// fishing spot
onFFXIVEvent('someDirectorUnk4', packet => {
  // for spot data param3 is place name id
  // and for diadem place name id is referred by multi spot id (which belongs to different grades 1~4)
  if (packet.param3 > 0) {
    const spotIds = placeName2Spots[packet.param3]
    if (spotIds) {
      const prevSpotId = status.spotId
      const spotCnt = spotIds.length
      if (spotCnt === 1) {
        status.spotId = spotIds[0]
      } else if (spotCnt > 1) {
        status.spotId = spotIds[spotCnt - (region === 'CN' ? 2 : 1)]
      }
      if (prevSpotId !== status.spotId && isOceanFishingSpot(status.spotId)) {
        const spotList = voyagesWithTipOf(isDev ? new Date("2021-04-12 02:00:00").getTime() : Date.now(), 1)[0].locationTips.map(
        // const spotList = voyagesWithTipOf(Date.now(), 1)[0].locationTips.map(
          it => it.fishingSpots
        )
        const oceanFishingRouteIndexDetected = spotList.findIndex(
          spot => spot.normal === status.spotId || spot.spectralCurrent === status.spotId
        )
        if (
          oceanFishingRouteIndexDetected !== status.oceanFishingRouteIndex &&
          oceanFishingRouteIndexDetected > -1
        ) {
          status.oceanFishingRouteIndex = oceanFishingRouteIndexDetected
          setTimeBuffIfNeeded()
        }
      }
    }
  }
})

// mooch
onFFXIVEvent('someDirectorUnk4', packet => {
  if (packet.actionTimeline === 257 || packet.actionTimeline === 3073) {
    status.mooch = packet.param1 === 1121
    // log.debug("mooch", status.mooch);

    applyCurrentStatusOnStart(currentRecord, status)
  }
})

function getSpectralCurrentCountDownTotal() {
  return 2 * INTERVAL_MINUTE + status.spectralCurrentBuffTime
}

function isOceanFishing() {
  return status.zoneId === 3477
}

function isDiadem() {
  return status.zoneId === 1647
}

function getMessage(struct) {
  /*
  struct.type = "messageUnknown";
  let type = MachinaModels.chatType[struct.data[0x2E]];
  if (type) struct.type = `message${type}`;*/

  struct.character = getString(struct.data, 0x10, 0x20)
  struct.message = getString(struct.data, 0x30)
}

function getString(uint8Array, offset, length) {
  if (typeof offset === 'undefined') throw "Parameter 'offset' not provided."
  if (typeof length === 'undefined') {
    length = uint8Array.length - offset
  }

  // Remove the suffix zeros and 255s
  while (
    length > 0 &&
    (uint8Array[offset + length - 1] === 0 || uint8Array[offset + length - 1] === 255)
  ) {
    --length
  }

  if (length === 0) {
    return ''
  }

  return Buffer.from(uint8Array.slice(offset, offset + length)).toString()
}

// onFFXIVEventWithFilter('unknown', null, null, null,(packet) => {
//   log.debug('wc?', packet.opcode, packet.data)
// })
onFFXIVEventWithFilter('unknown', null, null, 604, packet => {
  if (region === 'CN') {
    onWeatherChange(packet)
  } else {
    log.debug('skip unknown weather change in Global region')
  }
})

onFFXIVEvent('playerSetup', packet => {
  playerSetupOf(packet)
  log.info('playerSetup in reader', packet)
  playerSetupCallback(packet)
})

onFFXIVEvent('weatherChange', packet => {
  if (region === 'Global') {
    onWeatherChange(packet)
  } else {
    log.debug('enter weatherChange in CN region ???')
  }
})

function isOceanFishingSpot(id) {
  return (id >= 237 && id <= 244) || (id >= 246 && id <= 251)
}

function setTimeBuffIfNeeded() {
  log.debug(
    'in setTimeBuffIfNeeded',
    status.oceanFishingRouteIndex,
    status.previousWeather,
    status.weather,
    status.spectralCurrentBuffTime
  )
  if (status.oceanFishingRouteIndex > 0) {
    if (!status.spotCurrents[status.oceanFishingRouteIndex-1]) {
      status.spectralCurrentBuffTime = INTERVAL_MINUTE
      log.debug('in setTimeBuffIfNeeded buffTime update', status.spectralCurrentBuffTime)
    }
  }
}

function onWeatherChange(packet) {
  status.previousWeather = status.weather
  status.weather = packet.data && +packet.data[0]
  log.debug('WeatherChange', status.weather)

  if (status.weather === SPECTRAL_CURRENT_WEATHER_ID) {
    status.spectralCurrentEndTime = Date.now() + getSpectralCurrentCountDownTotal()
    status.spotCurrents[status.oceanFishingRouteIndex] = true
    log.info('current end in', (status.spectralCurrentEndTime - Date.now()) / 1000, 's')
  } else {
    if (isOceanFishing() || isOceanFishingSpot(status.spotId)) {
      if (status.weather !== SPECTRAL_CURRENT_FINISHED_WEATHER_ID) {
        status.oceanFishingRouteIndex = (status.oceanFishingRouteIndex + 1) % 3
        log.info('OceanFishingRoute', status.oceanFishingRouteIndex)
        setTimeBuffIfNeeded()
      }
      if (status.spectralCurrentEndTime) {
        const spectralActualEndTime = Date.now()
        let remainingTime = status.spectralCurrentEndTime - spectralActualEndTime
        status.spectralCurrentBuffTime = remainingTime > 0 ? remainingTime : 0
        status.spectralCurrentEndTime = undefined
        log.debug(
          'in weatherChange',
          status.oceanFishingRouteIndex,
          status.previousWeather,
          status.weather,
          status.spectralCurrentBuffTime
        )
      }
    }
    if (status.previousWeather) {
      if (isDiadem()) {
        status.diademWeatherEndTime = Date.now() + DIADEM_WEATHER_COUNTDOWN_TOTAL
      } else {
        status.normalWeatherStartTime = Date.now()
      }
    }
  }
  log.info('time buff', status.spectralCurrentBuffTime / 1000, 's')
}

onFFXIVEvent('updateClassInfo', packet => {
  // log.debug('updateClassInfo', packet)
  status.isFisher = packet.classId === 18
})

onFFXIVEvent('playerStats', packet => {
  // log.debug('playerStats', packet)
  status.gathering = packet.gathering
  status.perception = packet.perception
  status.gp = packet.gp
})

onFFXIVEvent('clientTrigger', packet => {
  if (packet.commandID === 701) {
    // normal 2
    // double hook 16
    // mooch II 15
    // currentRecord.doubleHook = packet.param1 === 16
    currentRecord.hookset = getHooksetFromParam1(packet.param1)
  }
})

function getHooksetFromParam1(param1) {
  switch (param1) {
    case 16:
      return 'double'
    case 2:
      return 'normal'
    case 10:
      return 'powerful'
    case 11:
      return 'precision'
    default:
      return 'normal'
  }
}
