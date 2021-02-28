const { app } = require('electron')
const path = require('path')
const MachinaFFXIV = require('node-machina-ffxiv')
const isDev = require('electron-is-dev')
const isElevated = require('is-elevated')
const { exec } = require('child_process')
const log = require('electron-log')
const { TERRITORY_TYPES } = require('../data/fix')
const { v4: uuid } = require('uuid')
const { version: PASTRY_FISH_VERSION } = require('../package.json')
const { CN_PATCH_VERSION, GLOBAL_PATCH_VERSION } = require('../data/constants')
const merge = require('lodash/merge')
const cloneDeep = require('lodash/cloneDeep')
const FISHING_SPOTS_DICT = require('./fishingSpotsPlaceNameIdDict')
const Events = require('events')
const { toReadable } = require('./toReadable')

const INTERVAL_MINUTE = 60000
const DIADEM_WEATHER_COUNTDOWN_TOTAL = 10 * INTERVAL_MINUTE
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
      monitorType: 'RawSocket',//'WinPCap',
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
  machinaStatus = 'stopped', region = 'CN'
function startMachina(options, callback = () => {}) {
  return isElevated()
    .then((elevated) => {
      if (elevated) {
        if (!isDev) {
          exec(
            'netsh advfirewall firewall delete rule name="pastry-fish-reader - Machina"',
            () => {
              addMachinaFirewallRule()
            }
          )
        }
      }
    })
    .then(() => {
      const mergedOptions =merge(machinaOptions, options)
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
    stopMachina()
  }
  return startMachina(options, callback)
}

let fishCaughtCallback
exports.onFishCaught = (callback) => {
  fishCaughtCallback = callback
}
let fishRecordCallback
exports.onNewRecord = (callback) => {
  fishRecordCallback = callback
}

let updateCallback = (data) => {
  log.debug('sending data', data)
}

function init() {
  Machina.setMaxListeners(0)

  Machina.on('any', (packet) => {
    // log.debug(packet)
    if (filterPacketSessionID(packet)) {
      ffxivEvent.emit('ffxivEvent', packet)
    }
  })

  // Machina.on('raw', (packet) => {
  //   if (filterPacketSessionID(packet)) {
  //     // if (packet.opcode === 619) {
  //     //   log.debug(packet.type,packet.opcode, packet.data)
  //     // }
  //
  //     // if (packet.type && packet.superType === 'message') {
  //     //   log.debug('msg self', getString(packet.data, 0x1A))
  //     //   // log.debug('msg other', getString(packet.data, 0x30))
  //     //   return
  //     // }
  //     // switch (packet.type) {
  //     //   case 'unknown':
  //     //     log.debug(packet.opcode)
  //     //     // log.debug(packet)
  //     //     // log.debug(JSON.stringify(packet.data))
  //     //     // log.debug('msg self', getString(packet.data, 0x1A))
  //     //     // log.debug('msg other', getString(packet.data, 0x30))
  //     //     break
  //     //   case 'updatePositionInstance':
  //     //     // log.debug(packet.pos)
  //     //     break
  //     //   case 'updatePositionHandler':
  //     //     // log.debug(packet.pos)
  //     //     break
  //     //   case 'actorControlSelf':
  //     //     break
  //     //   // case 'prepareZoning':
  //     //   //   log.debug('prepareZoning')
  //     //   //   log.debug(packet)
  //     //   //   break
  //     //   // case 'initZone':
  //     //   //   log.debug('initZone')
  //     //   //   log.debug(packet)
  //     //   //   break
  //     //   case 'weatherChange':
  //     //     log.debug('weatherChange')
  //     //     log.debug(packet)
  //     //     break
  //     //   default:
  //     //     log.debug(packet.type)
  //     // }
  //   }
  // })

  // Machina.on('WeatherChange', (packet) => {
  //   log.debug('WeatherChange', packet)
  // })
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
  // if (packet.sourceActorSessionID == null || packet.targetActorSessionID == null) {
  //     console.warn('packet no session id', packet)
  // }
  return packet.sourceActorSessionID === packet.targetActorSessionID
}

function onFFXIVEvent(type, callback, skipUpdateEvent = false) {
  onFFXIVEventWithFilter(type, null, null, null, callback, skipUpdateEvent)
}

function onFFXIVEvents(types, callback) {
  types.forEach((type) => onFFXIVEvent(type, callback))
}

function onFFXIVEventSubType(subType, callback) {
  onFFXIVEventWithFilter(null, subType, null, null, callback)
}

function onFFXIVEventOfUnknown(opcode, callback) {
  ffxivEvent.on('ffxivEvent', (packet) => {
    if (packet.type === 'unknown' && packet.opcode === opcode) {
      callback(packet)
      updateCallback({
        status,
        currentRecord,
        // records,
        // readableRecords,
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
  ffxivEvent.on('ffxivEvent', (packet) => {
    if (
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
onFFXIVEvent('effect', (packet) => {
  log.debug('in effect', packet.type)
  const effectId = action2Effect[packet.actionId]
  if (effectId) {
    status.effects.add(effectId)
  }
})

onFFXIVEvent(
  'prepareZoning',
  (packet) => {
    if (packet.targetZone) {
      status.zoneId = TERRITORY_TYPES[packet.targetZone].placeName
      log.debug('targetZone', status.zoneId)
    } else {
      log.debug('targetZone Zero')
    }
    status.weather = undefined
    status.spectralCurrentEndTime = undefined
    status.diademWeatherEndTime = undefined
  },
  true
)

onFFXIVEvent(
  'initZone',
  (packet) => {
    status.effects = new Set()
    if (packet.zoneID) {
      status.zoneId = TERRITORY_TYPES[packet.zoneID].placeName
      log.debug('initZone', status.zoneId)
    }
  },
  true
)

onFFXIVEventWithFilter('actorControl', null, 20, null, (packet) => {
  // log.debug('actorControl', packet)
  status.effects.add(packet.param1)
})

onFFXIVEventWithFilter('actorControl', null, 21, null, (packet) => {
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
onFFXIVEvent('statusEffectList', (packet) => {
  // log.debug('statusEffectList', packet)
  packet.effects
    .map((it) => it.unknown1)
    .filter((effectId) => effectToDetect.has(effectId))
    .forEach((effectId) => status.effects.add(effectId))
})

onFFXIVEventSubType('fishingBaitMsg', (packet) => {
  // actorControlSelf
  status.baitId = packet.baitID
})

onFFXIVEventSubType('actionStart', (packet) => {
  // actorControlSelf
  log.debug('actionStart', packet.actionID, packet.actionCooldown, packet)
})

const FISHING_EVENT = 0x150001
onFFXIVEvents(['eventStart', 'eventFinish'], (packet) => {
  // log.debug('fevent', packet.type, packet.eventId)
  if (packet.eventId === FISHING_EVENT) {
    status.isFishing = packet.type === 'eventStart'
    if (!status.isFishing) {
      // saveCurrentRecord()
      status.prevFishId = -1
    }
  }
})

function saveCurrentRecord() {
  if (currentRecord.startTime != null && currentRecord.biteTime != null) {
    if (currentRecord.mooch) {
      currentRecord.baitId = status.prevFishId
    }
    currentRecord.id = uuid()
    fishRecordCallback(currentRecord)
    if (currentRecord.missed) {
      log.info('fish missed', currentRecord)
    } else if (currentRecord.cancelled) {
      log.info('fish ignored', currentRecord)
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
  }
}

function resetRecord() {
  log.info('reset record')
  currentRecord = cloneDeep(EMPTY_RECORD)
}

onFFXIVEvent('eventPlay', (packet) => {
  if (packet.eventId === FISHING_EVENT) {
    // log.debug('eventPlay', actionTimeline[packet.param5], packet)
    switch (packet.scene) {
      case 1:
        status.isFishing = true
        currentRecord.startTime = Date.now()
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
  record.collectorGlove = status.effects.has(805)
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

// onFFXIVEvent('updateInventorySlot', (packet) => {
//   log.debug('updateInventorySlot ', packet)
// })

// onFFXIVEvent('eventPlay8', (packet) => {
//   log.debug(
//     'eventPlay8',
//     actionTimeline[packet.param1],
//     actionTimeline[packet.param2],
//     actionTimeline[packet.param3],
//     actionTimeline[packet.param4],
//     packet
//   )
// })

// onFFXIVEvent('eventPlay32', (packet) => {
//   log.debug(
//     'eventPlay32',
//     actionTimeline[packet.param1],
//     actionTimeline[packet.param2],
//     actionTimeline[packet.param3],
//     actionTimeline[packet.param4],
//     packet
//   )
// })

onFFXIVEvent('eventPlay4', (packet) => {
  if (actionTimeline[packet.param1] != null) {
    currentRecord.hookset = getHookset(packet.param1)
    currentRecord.missed =
      actionTimeline[packet.param2] != null &&
      !actionTimeline[packet.param2].subType.includes('landing')
    applyCurrentStatusOnLanding(currentRecord, status)
    // log.debug(
    //   'eventPlay4',
    //   actionTimeline[packet.param1],
    //   actionTimeline[packet.param2],
    //   actionTimeline[packet.param3],
    //   actionTimeline[packet.param4],
    //   packet
    // )
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

// caught fish
onFFXIVEventWithFilter('actorControlSelf', null, 320, null, (packet) => {
  const caughtFishId = packet.param1
  const hq = ((packet.param3 >> 4) & 1) === 1
  if (status.isFishing) {
    log.info('fish caught', caughtFishId)
    fishCaughtCallback({ fishId: caughtFishId, hq })
    if (records.length === 0) return
    const prevRecord = records[records.length - 1]
    prevRecord.fishId = caughtFishId
    prevRecord.hq = hq
    // not used
    // currentRecord.moochable = (packet.param3 & 0x0000000F) === 5
    prevRecord.size = packet.param2 >> 16

    status.prevFishId = prevRecord.fishId

    log.info('fish caught record', prevRecord)
    // fishCaughtCallback(prevRecord)
    fishRecordCallback(prevRecord)
    readableRecords[readableRecords.length - 1] = toReadable(prevRecord)
    // saveCurrentRecord()
  } else {
    log.info('spear fish caught', caughtFishId)
    fishCaughtCallback({ fishId: caughtFishId, hq })
  }
})

onFFXIVEvent('someDirectorUnk4', (packet) => {
  // log.debug(
  //   'someDirectorUnk4',
  //   actionTimeline[packet.actionTimeline],
  //   packet
  // )
  if (
    packet.actionTimeline === 0 &&
    Math.abs(currentRecord.biteTime - Date.now()) < 10000
  ) {
    currentRecord.fishId = -1
    currentRecord.hq = false
    currentRecord.size = 0
  }
})

// fishing spot
onFFXIVEvent('someDirectorUnk4', (packet) => {
  const spot = FISHING_SPOTS_DICT[packet.param3]
  if (spot) {
    status.spotId = spot.id
  }
})

// mooch
onFFXIVEvent('someDirectorUnk4', (packet) => {
  if (packet.actionTimeline === 257 || packet.actionTimeline === 3073) {
    status.mooch = packet.param1 === 1121
    // log.debug("mooch", status.mooch);

    applyCurrentStatusOnStart(currentRecord, status)
  }
})

function getSpectralCurrentCountDownTotal() {
  return 2 * INTERVAL_MINUTE
}

const SPECTRAL_CURRENT_WEATHER_ID = 145
const DIADEM_WEATHERS = [133, 134, 135, 136]

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
onFFXIVEventWithFilter('unknown', null, null, 225, (packet) => {
  if (region === 'CN') {
    onWeatherChange(packet)
  } else {
    log.debug('skip unknown weather change in Global region')
  }
})

onFFXIVEvent('weatherChange', (packet) => {
  if (region === 'Global') {
    onWeatherChange(packet)
  } else {
    log.debug('enter weatherChange in CN region ???')
  }
})

function onWeatherChange(packet) {
  status.previousWeather = status.weather
  status.weather = packet.data && +packet.data[0]
  log.debug('WeatherChange', status.weather)

  if (status.weather === SPECTRAL_CURRENT_WEATHER_ID) {
    status.spectralCurrentEndTime = Date.now() + getSpectralCurrentCountDownTotal()
  } else if (status.previousWeather) {
    if (isDiadem()) {
      status.diademWeatherEndTime = Date.now() + DIADEM_WEATHER_COUNTDOWN_TOTAL
    } else {
      status.normalWeatherStartTime = Date.now()
    }
  }
}

onFFXIVEvent('updateClassInfo', (packet) => {
  // log.debug('updateClassInfo', packet)
  status.isFisher = packet.classId === 18
})

onFFXIVEvent('playerStats', (packet) => {
  // log.debug('playerStats', packet)
  status.gathering = packet.gathering
  status.perception = packet.perception
  status.gp = packet.gp
})
