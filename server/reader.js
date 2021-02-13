const { app } = require('electron')
const path = require('path')
const MachinaFFXIV = require('node-machina-ffxiv')
const isDev = require('electron-is-dev')
const isElevated = require('is-elevated')
const { exec } = require('child_process')
const log = require('electron-log')
const {TERRITORY_TYPES} = require('../data/fix')
// const DataUtil = require('../utils/DataUtil')
const INTERVAL_MINUTE = 60000
const DIADEM_WEATHER_COUNTDOWN_TOTAL = 10 * INTERVAL_MINUTE
// in dev load directly
// in prod set the required files by set the packaged patch manually
const machinaOptions = isDev ? {
    monitorType: 'WinPCap',
    parseAlgorithm: 'PacketSpecific',
    region: 'CN',
  // logger: log.info
} : {
  // logger: log.info,
    parseAlgorithm: 'PacketSpecific',
    noData: false,
    monitorType: 'RawSocket',
    region: 'CN',
    machinaExePath: path.join(app.getAppPath(), '../../resources/MachinaWrapper/MachinaWrapper.exe'),
    remoteDataPath: path.join(app.getAppPath(), '../../resources/remote-data'),
    definitionsDir: path.join(app.getAppPath(), '../../resources/app.asar.unpacked/node_modules/node-machina-ffxiv/models/default')
}
const Machina = new MachinaFFXIV(machinaOptions)

exports.start = callBack => {
    return isElevated().then(elevated => {
        if (elevated) {
            if (!isDev) {
                exec('netsh advfirewall firewall delete rule name="pastry-fish-reader - Machina"', () => {
                    addMachinaFirewallRule();
                });
            }
        }
    })
        .then(() => Machina.start(callBack))
}
exports.onUpdate = onUpdate
exports.stop = (callBack) => {
  Machina.stop(callBack)
}

let updateCallBack = (data) => {
  log.info('sending data', data)
}

function onUpdate(callBack) {
  updateCallBack = callBack
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

const cloneDeep = require('lodash/cloneDeep')
const FISHING_SPOTS_DICT = require('./fishingSpotsPlaceNameIdDict')
const Events = require('events')
const { toReadable } = require('./toReadable')
const ffxivEvent = new Events.EventEmitter()
ffxivEvent.setMaxListeners(0)
//
// Machina.start(() => {
//     log.info("Machina started!");
// });
Machina.setMaxListeners(0)

Machina.on('any', (packet) => {
  // log.info(packet)
  if (filterPacketSessionID(packet)) {
    ffxivEvent.emit('ffxivEvent', packet)
  }
})

// Machina.on('raw', (packet) => {
//   if (filterPacketSessionID(packet)) {
//     if (packet.opcode === 225) {
//       log.info(packet.type, packet.opcode)
//     }
//
//     // if (packet.type && packet.superType === 'message') {
//     //   log.info('msg self', getString(packet.data, 0x1A))
//     //   // log.info('msg other', getString(packet.data, 0x30))
//     //   return
//     // }
//     // switch (packet.type) {
//     //   case 'unknown':
//     //     log.info(packet.opcode)
//     //     // log.info(packet)
//     //     // log.info(JSON.stringify(packet.data))
//     //     // log.info('msg self', getString(packet.data, 0x1A))
//     //     // log.info('msg other', getString(packet.data, 0x30))
//     //     break
//     //   case 'updatePositionInstance':
//     //     // log.info(packet.pos)
//     //     break
//     //   case 'updatePositionHandler':
//     //     // log.info(packet.pos)
//     //     break
//     //   case 'actorControlSelf':
//     //     break
//     //   // case 'prepareZoning':
//     //   //   log.info('prepareZoning')
//     //   //   log.info(packet)
//     //   //   break
//     //   // case 'initZone':
//     //   //   log.info('initZone')
//     //   //   log.info(packet)
//     //   //   break
//     //   case 'weatherChange':
//     //     log.info('weatherChange')
//     //     log.info(packet)
//     //     break
//     //   default:
//     //     log.info(packet.type)
//     // }
//   }
// })

// Machina.on('WeatherChange', (packet) => {
//   log.info('WeatherChange', packet)
// })

function filterPacketSessionID(packet) {
  // if (packet.sourceActorSessionID == null || packet.targetActorSessionID == null) {
  //     console.warn('packet no session id', packet)
  // }
  return packet.sourceActorSessionID === packet.targetActorSessionID
}

function onFFXIVEvent(type, callBack, skipUpdateEvent = false) {
  onFFXIVEventWithFilter(type, null, null, null, callBack, skipUpdateEvent)
}

function onFFXIVEvents(types, callBack) {
  types.forEach((type) => onFFXIVEvent(type, callBack))
}

function onFFXIVEventSubType(subType, callBack) {
  onFFXIVEventWithFilter(null, subType, null, null, callBack)
}

function onFFXIVEventOfUnknown(opcode, callBack) {
  ffxivEvent.on('ffxivEvent', (packet) => {
    if (
      packet.type === 'unknown' &&
      packet.opcode === opcode
    ) {
      callBack(packet)
      updateCallBack({
        status,
        currentRecord,
        records,
        readableRecords,
        lastCatchRecord
      })
    }
  })
}

function onFFXIVEventWithFilter(type, subType, category, opcode, callBack, skipUpdateEvent = false) {
  ffxivEvent.on('ffxivEvent', (packet) => {
    if (
      (!type || packet.type === type) &&
      (!subType || packet.subType === subType) &&
      (!category || packet.category === category) &&
      (!opcode || packet.opcode === opcode)
    ) {
      callBack(packet)
      if (!skipUpdateEvent) {
        updateCallBack({
          status,
          currentRecord,
          records,
          readableRecords,
          lastCatchRecord
        })
      }
      // console.info(status)
      // console.info(currentRecord)
      // console.info(records)
      // console.info(readableRecords)
      // log.info('----------------------------------------------------')
    }
  })
}

const status = {
  effects: new Set(),
  isFishing: undefined,
  baitId: undefined,
  spotId: undefined,
  mooch: false,
  prevFishId: undefined,
  weather: undefined,
  zoneId: undefined
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
  // log.info('in effect', packet.type)
  const effectId = action2Effect[packet.actionId]
  if (effectId) {
    status.effects.add(effectId)
  }
})

onFFXIVEvent('prepareZoning', (packet) => {
  if (packet.targetZone) {
    status.zoneId = TERRITORY_TYPES[packet.targetZone].placeName
    log.info('targetZone', status.zoneId)
  } else {
    log.info('targetZone Zero')
  }
  status.weather = undefined
  status.spectralCurrentEndTime = undefined
  status.diademWeatherEndTime = undefined
}, true)

onFFXIVEvent('initZone', (packet) => {
  if (packet.zoneID) {
    status.zoneId = TERRITORY_TYPES[packet.zoneID].placeName
    // status.weather = undefined
    log.info('initZone', status.zoneId)
  }
}, true)

onFFXIVEventWithFilter('actorControl', null, 20, null,(packet) => {
  // log.info('actorControl', packet)
  status.effects.add(packet.param1)
})

onFFXIVEventWithFilter('actorControl', null, 21, null,(packet) => {
  status.effects.delete(packet.param1)
})

const effectToDetect = new Set([
  761, // SNAGGING
  805, // COLLECTOR_GLOVE
  763, // CHUM
  762, // FISH_EYES
  1803, // Surface Slap
  1804, // Identical Cast
])

// update all status according to statusEffectList
onFFXIVEvent('statusEffectList', (packet) => {
  // log.info('statusEffectList', packet)
  packet.effects
    .map((it) => it.unknown1)
    .filter((effectId) => effectToDetect.has(effectId))
    .forEach((effectId) => status.effects.add(effectId))
})

onFFXIVEventSubType('fishingBaitMsg', (packet) => {
  // actorControlSelf
  status.baitId = packet.baitID
})

const FISHING_EVENT = 0x150001
onFFXIVEvents(['eventStart', 'eventFinish'], (packet) => {
  // log.info('fevent', packet.type, packet.eventId)
  if (packet.eventId === FISHING_EVENT) {
    status.isFishing = packet.type === 'eventStart'
    if (!status.isFishing) {
      saveCurrentRecord()
    }
  }
})

function saveCurrentRecord() {
  if (currentRecord.startTime != null && currentRecord.biteTime != null) {
    if (currentRecord.mooch) {
      currentRecord.baitId = status.prevFishId
    }
    status.prevFishId = currentRecord.fishId
    lastCatchRecord = currentRecord
    records.push(currentRecord)
    readableRecords.push(toReadable(currentRecord))
  }
  resetRecord()
}

const EMPTY_RECORD = {
  startTime: undefined,
  biteTime: undefined,
  hookset: undefined,
  fishId: -1,
  hq: false,
  size: 0,
}

let currentRecord, lastCatchRecord
resetRecord()
const records = []
const readableRecords = []

function resetRecord() {
  currentRecord = cloneDeep(EMPTY_RECORD)
}

onFFXIVEvent('eventPlay', (packet) => {
  if (packet.eventId === FISHING_EVENT) {
    // log.info('eventPlay', packet.scene)
    switch (packet.scene) {
      case 1:
        status.isFishing = true
        saveCurrentRecord()
        currentRecord.startTime = Date.now()
        break
      case 5:
        currentRecord.biteTime = Date.now()
        currentRecord.tug = getTug(packet.param5)
        break
      case 2:
          saveCurrentRecord()
          break
      default:
        log.info('other scene', packet.scene)
    }
  }
})

function applyCurrentStatus(record, status) {
  // log.info('apply status')
  // log.info(status)
  record.snagging = status.effects.has(761)
  record.chum = status.effects.has(763)
  record.fishEyes = status.effects.has(762)
  record.surfaceScale = status.effects.has(1803)
  record.identicalCast = status.effects.has(1804)
  record.baitId = status.baitId
  record.mooch = status.mooch
  record.spotId = status.spotId
  status.mooch = false
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

onFFXIVEvent('eventPlay4', (packet) => {
  currentRecord.hookset = getHookset(packet.param1)
})

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
      // log.info('actionTimeline', hookset)
      return 'normal'
  }
}

// caught fish
onFFXIVEventWithFilter('actorControlSelf', null, 320, null,(packet) => {
  if (records.length === 0) return
  const prevRecord = records[records.length-1]
  prevRecord.fishId = packet.param1
  prevRecord.hq = ((packet.param3 >> 4) & 1) === 1
  // not used
  // currentRecord.moochable = (packet.param3 & 0x0000000F) === 5
  prevRecord.size = packet.param2 >> 16

  readableRecords[readableRecords.length-1] = toReadable(prevRecord)
  saveCurrentRecord()
})

onFFXIVEvent('someDirectorUnk4', (packet) => {
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
onFFXIVEvent("someDirectorUnk4", packet => {
  if (packet.actionTimeline === 257 || packet.actionTimeline === 3073) {
    status.mooch = packet.param1 === 1121;
    // log.info("mooch", status.mooch);

    applyCurrentStatus(currentRecord, status);
  }
});

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
  if (typeof offset === 'undefined') throw "Parameter 'offset' not provided.";
  if (typeof length === 'undefined') {
    length = uint8Array.length - offset;
  }

  // Remove the suffix zeros and 255s
  while (length > 0 && (uint8Array[offset + length - 1] === 0 || uint8Array[offset + length - 1] === 255)) {
    --length;
  }

  if (length === 0) {
    return '';
  }

  return Buffer.from(uint8Array.slice(offset, offset + length)).toString();
}
// onFFXIVEventWithFilter('unknown', null, null, null,(packet) => {
//   log.info('wc?', packet.opcode, packet.data)
// })
onFFXIVEventWithFilter('unknown', null, null, 225,(packet) => {
  status.previousWeather = status.weather
  status.weather = packet.data && +packet.data[0]
  log.info('WeatherChange', status.weather)

  if (status.weather === SPECTRAL_CURRENT_WEATHER_ID) {
    status.spectralCurrentEndTime = Date.now() + getSpectralCurrentCountDownTotal()
  } else if (status.previousWeather) {
    if (isDiadem()) {
      status.diademWeatherEndTime = Date.now() + DIADEM_WEATHER_COUNTDOWN_TOTAL
    } else {
      status.normalWeatherStartTime = Date.now()
    }
  }
})

// exports.data = {
//   status,
//   currentRecord,
//   records,
//   readableRecords,
//   lastCatchRecord
// };
