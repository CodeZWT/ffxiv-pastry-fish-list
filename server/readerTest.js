const SPECTRAL_CURRENT_WEATHER_ID = 145

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
  // someDirectorUnk4Of(3621),
  // someDirectorUnk4Of(3621),
  // someDirectorUnk4Of(3621),
  weatherChangeOf(SPECTRAL_CURRENT_WEATHER_ID),
  weatherChangeOf(1),
  // someDirectorUnk4Of(3454),
  // someDirectorUnk4Of(3454),
  // someDirectorUnk4Of(3454),
  weatherChangeOf(2),

  weatherChangeOf(5),

  weatherChangeOf(SPECTRAL_CURRENT_WEATHER_ID),
  // someDirectorUnk4Of(3455),
  // someDirectorUnk4Of(3455),
  weatherChangeOf(1),
  // someDirectorUnk4Of(3454),
  // someDirectorUnk4Of(3454),
  // 1
  // someDirectorUnk4Of(3625),
  // someDirectorUnk4Of(3625),

  weatherChangeOf(SPECTRAL_CURRENT_WEATHER_ID),
  someDirectorUnk4Of(3626),
  someDirectorUnk4Of(3626),
  weatherChangeOf(1),
  someDirectorUnk4Of(3625),
  someDirectorUnk4Of(3625),
]

module.exports = {
  mockEvents,
}
