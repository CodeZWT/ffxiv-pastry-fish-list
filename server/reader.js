const {app} = require('electron')
const path = require('path')
const MachinaFFXIV = require('node-machina-ffxiv')
const isDev = require('electron-is-dev')
const isElevated = require('is-elevated')
const {exec} = require('child_process')
const log = require('electron-log');

// in dev load directly
// in prod set the required files by set the packaged patch manually
const machinaOptions = isDev ? {
    monitorType: 'WinPCap',
    parseAlgorithm: 'PacketSpecific',
    region: 'CN'
} : {
    parseAlgorithm: 'PacketSpecific',
    noData: true,
    monitorType: 'RawSocket',
    region: 'CN',
    machinaExePath: path.join(app.getAppPath(), '../../resources/MachinaWrapper/MachinaWrapper.exe'),
    remoteDataPath: path.join(app.getAppPath(), '../../resources/remote-data'),
    definitionsDir: path.join(app.getAppPath(), '../../resources/app.asar.unpacked/node_modules/node-machina-ffxiv/models/default')
}
const Machina = new MachinaFFXIV(machinaOptions)

exports.start = callBack => {
    isElevated().then(elevated => {
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

let updateCallBack = data => {
    console.log('sending data', data)
}

function onUpdate(callBack) {
    updateCallBack = callBack
}


// Add machina to firewall stuffs
function addMachinaFirewallRule() {
    const machinaExePath = path.join(app.getAppPath(), '../../resources/MachinaWrapper/MachinaWrapper.exe')
    exec(`netsh advfirewall firewall add rule name="pastry-fish-reader - Machina" dir=in action=allow program="${machinaExePath}" enable=yes`);
}

exports.addMachinaFirewallRule = addMachinaFirewallRule

const cloneDeep = require('lodash/cloneDeep')
const FISHING_SPOTS_DICT = require('./fishingSpotsPlaceNameIdDict')
const Events = require('events')
const {toReadable} = require("./toReadable");
const ffxivEvent = new Events.EventEmitter()
ffxivEvent.setMaxListeners(0);
//
// Machina.start(() => {
//     console.log("Machina started!");
// });
Machina.setMaxListeners(0);

Machina.on('any', (packet) => {
    // console.log(packet)
    if (filterPacketSessionID(packet)) {
        ffxivEvent.emit('ffxivEvent', packet)
    }
})

function filterPacketSessionID(packet) {
    // if (packet.sourceActorSessionID == null || packet.targetActorSessionID == null) {
    //     console.warn('packet no session id', packet)
    // }
    return packet.sourceActorSessionID === packet.targetActorSessionID;
}

function onFFXIVEvent(type, callBack) {
    onFFXIVEventWithFilter(type, null, null, callBack)
}

function onFFXIVEvents(types, callBack) {
    types.forEach(type => onFFXIVEvent(type, callBack))
}

function onFFXIVEventSubType(subType, callBack) {
    onFFXIVEventWithFilter(null, subType, null, callBack)
}

function onFFXIVEventWithFilter(type, subType, category, callBack) {
    ffxivEvent.on('ffxivEvent', (packet) => {
        if ((!type || packet.type === type) &&
            (!subType || packet.subType === subType) &&
            (!category || packet.category === category)
        ) {
            callBack(packet)
            updateCallBack({
                status,
                currentRecord,
                records,
                readableRecords,
            })
            // console.info(status)
            // console.info(currentRecord)
            // console.info(records)
            // console.info(readableRecords)
            // console.log('----------------------------------------------------')
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
    // console.log('in effect', packet.type)
    const effectId = action2Effect[packet.actionId]
    if (effectId) {
        status.effects.add(effectId)
    }
})

onFFXIVEventWithFilter('actorControl', null, 20, (packet) => {
    status.effects.add(packet.param1)
})

onFFXIVEventWithFilter('actorControl', null, 21, (packet) => {
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
    packet.effects.map(it => it.unknown1)
        .filter(effectId => effectToDetect.has(effectId))
        .forEach(effectId => status.effects.add(effectId))
})

onFFXIVEventSubType('fishingBaitMsg', packet => {
    // actorControlSelf
    status.baitId = packet.baitID
})


const FISHING_EVENT = 0x150001
onFFXIVEvents(['eventStart', 'eventFinish'], packet => {
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
        records.push(currentRecord)
        readableRecords.push(toReadable(currentRecord))
        resetRecord()
    }
}

const EMPTY_RECORD = {
    startTime: undefined,
    biteTime: undefined,
    hookset: undefined,
    fishId: -1,
    hq: false,
    size: 0,
}

let currentRecord
resetRecord()
const records = []
const readableRecords = []

function resetRecord() {
    currentRecord = cloneDeep(EMPTY_RECORD)
}

onFFXIVEvent('eventPlay', packet => {
    if (packet.eventId === FISHING_EVENT) {
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
            // case 2:
            //     saveCurrentRecord()
            //     break
            default:
                console.log('other scene', packet.scene)
        }
    }
})


function applyCurrentStatus(record, status) {
    console.log('apply status')
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
            return 'light';
        case 293:
            return 'medium';
        case 294:
            return 'big';
        default:
            return null;
    }
}

onFFXIVEvent('eventPlay4', packet => {
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
            console.log('actionTimeline', hookset)
            return 'normal'
    }
}

// caught fish
onFFXIVEventWithFilter('actorControlSelf', null, 320, (packet) => {
    currentRecord.fishId = packet.param1
    currentRecord.hq = (packet.param3 >> 4 & 1) === 1
    // not used
    // currentRecord.moochable = (packet.param3 & 0x0000000F) === 5
    currentRecord.size = packet.param2 >> 16
    saveCurrentRecord()
})

onFFXIVEvent('someDirectorUnk4', packet => {
    if (packet.actionTimeline === 0 && Math.abs(currentRecord.biteTime - Date.now()) < 10000) {
        currentRecord.fishId = -1
        currentRecord.hq = false
        currentRecord.size = 0
    }
})

// fishing spot
onFFXIVEvent('someDirectorUnk4', packet => {
    const spot = FISHING_SPOTS_DICT[packet.param3]
    if (spot) {
        status.spotId = spot.id
    }
})

// mooch
onFFXIVEvent('someDirectorUnk4', packet => {
    if (packet.actionTimeline === 257 || packet.actionTimeline === 3073) {
        console.log('mooch')
        status.mooch = packet.param1 === 1121

        applyCurrentStatus(currentRecord, status)
    }
})

exports.data = {
    status,
    currentRecord,
    records,
    readableRecords,
}
