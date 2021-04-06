const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const missions = {
  1: {
    id: 1,
    quantity: 7,
    description: '钓到水母或螃蟹',
    types: [15, 21],
    star: null,
    tug: null,
  },
  2: {
    id: 2,
    quantity: 5,
    description: '钓到★★★以上的鱼',
    types: [],
    star: 3,
    tug: null,
  },
  4: {
    id: 4,
    quantity: 34,
    description: '钓到咬钩强度低（！）的鱼',
    types: [],
    star: null,
    tug: 'light',
  },
  5: {
    id: 5,
    quantity: 18,
    description: '钓到咬钩强度高（！！）的鱼',
    types: [],
    star: null,
    tug: 'medium',
  },
  6: {
    id: 6,
    quantity: 6,
    description: '钓到咬钩强度非常高（！！！）的鱼',
    types: [],
    star: null,
    tug: 'heavy',
  },
  7: {
    id: 7,
    quantity: 5,
    description: '钓到鲨鱼',
    types: [14],
    star: null,
    tug: null,
  },
  8: {
    id: 8,
    quantity: 5,
    description: '钓到★★★以上的鱼',
    types: [],
    star: 3,
    tug: null,
  },
  10: {
    id: 10,
    quantity: 34,
    description: '钓到咬钩强度低（！）的鱼',
    types: [],
    star: null,
    tug: 'light',
  },
  11: {
    id: 11,
    quantity: 11,
    description: '钓到咬钩强度高（！！）的鱼',
    types: [],
    star: null,
    tug: 'medium',
  },
  12: {
    id: 12,
    quantity: 13,
    description: '钓到咬钩强度非常高（！！！）的鱼',
    types: [],
    star: null,
    tug: 'heavy',
  },
  13: {
    id: 13,
    quantity: 13,
    description: '钓到螃蟹',
    types: [21],
    star: null,
    tug: null,
  },
  14: {
    id: 14,
    quantity: 5,
    description: '钓到★★★以上的鱼',
    types: [],
    star: 3,
    tug: null,
  },
  16: {
    id: 16,
    quantity: 31,
    description: '钓到咬钩强度低（！）的鱼',
    types: [],
    star: null,
    tug: 'light',
  },
  17: {
    id: 17,
    quantity: 27,
    description: '钓到咬钩强度高（！！）的鱼',
    types: [],
    star: null,
    tug: 'medium',
  },
  18: {
    id: 18,
    quantity: 5,
    description: '钓到咬钩强度非常高（！！！）的鱼',
    types: [],
    star: null,
    tug: 'heavy',
  },
  19: {
    id: 19,
    quantity: 13,
    description: '钓到鲀类',
    types: [20],
    star: null,
    tug: null,
  },
  20: {
    id: 20,
    quantity: 5,
    description: '钓到★★★以上的鱼',
    types: [],
    star: 3,
    tug: null,
  },
  22: {
    id: 22,
    quantity: 39,
    description: '钓到咬钩强度低（！）的鱼',
    types: [],
    star: null,
    tug: 'light',
  },
  23: {
    id: 23,
    quantity: 18,
    description: '钓到咬钩强度高（！！）的鱼',
    types: [],
    star: null,
    tug: 'medium',
  },
  24: {
    id: 24,
    quantity: 8,
    description: '钓到咬钩强度非常高（！！！）的鱼',
    types: [],
    star: null,
    tug: 'heavy',
  },
}

const routes = {
  1: {
    routeId: 1,
    name_chs: '梅尔托尔海峡北航线',
    spotList: [2, 1, 3],
    timeList: [1, 2, 3],
    achievements: [2563],
    blueFish: [],
    missions: [1, 2, 4, 5, 6],
  },
  2: {
    routeId: 2,
    name_chs: '梅尔托尔海峡北航线',
    spotList: [2, 1, 3],
    timeList: [2, 3, 1],
    achievements: [],
    blueFish: [0, 29788, 29791],
    missions: [1, 2, 4, 5, 6],
  },
  3: {
    routeId: 3,
    name_chs: '梅尔托尔海峡北航线',
    spotList: [2, 1, 3],
    timeList: [3, 1, 2],
    achievements: [2566],
    blueFish: [29789, 0, 0],
    missions: [1, 2, 4, 5, 6],
  },
  4: {
    routeId: 4,
    name_chs: '罗塔诺海航线',
    spotList: [1, 2, 4],
    timeList: [1, 2, 3],
    achievements: [2565, 2759],
    blueFish: [],
    missions: [7, 8, 10, 11, 12],
  },
  5: {
    routeId: 5,
    name_chs: '罗塔诺海航线',
    spotList: [1, 2, 4],
    timeList: [2, 3, 1],
    achievements: [2564, 2759],
    blueFish: [0, 29789, 0],
    missions: [7, 8, 10, 11, 12],
  },
  6: {
    routeId: 6,
    name_chs: '罗塔诺海航线',
    spotList: [1, 2, 4],
    timeList: [3, 1, 2],
    achievements: [],
    blueFish: [29788, 0, 29790],
    missions: [7, 8, 10, 11, 12],
  },
  7: {
    routeId: 7,
    name_chs: '绯汐海航线',
    spotList: [5, 3, 6],
    timeList: [1, 2, 3],
    achievements: [2756],
    blueFish: [],
    missions: [13, 14, 16, 17, 18],
  },
  8: {
    routeId: 8,
    name_chs: '绯汐海航线',
    spotList: [5, 3, 6],
    timeList: [2, 3, 1],
    achievements: [2755],
    blueFish: [0, 0, 32094],
    missions: [13, 14, 16, 17, 18],
  },
  9: {
    routeId: 9,
    name_chs: '绯汐海航线',
    spotList: [5, 3, 6],
    timeList: [3, 1, 2],
    achievements: [],
    blueFish: [32074, 29791, 0],
    missions: [13, 14, 16, 17, 18],
  },
  10: {
    routeId: 10,
    name_chs: '罗斯利特湾航线',
    spotList: [5, 4, 7],
    timeList: [1, 2, 3],
    achievements: [2754],
    blueFish: [0, 29790, 0],
    missions: [19, 20, 22, 23, 24],
  },
  11: {
    routeId: 11,
    name_chs: '罗斯利特湾航线',
    spotList: [5, 4, 7],
    timeList: [2, 3, 1],
    achievements: [2754, 2756],
    blueFish: [0, 0, 0],
    missions: [19, 20, 22, 23, 24],
  },
  12: {
    routeId: 12,
    name_chs: '罗斯利特湾航线',
    spotList: [5, 4, 7],
    timeList: [3, 1, 2],
    achievements: [],
    blueFish: [32074, 0, 32114],
    missions: [19, 20, 22, 23, 24],
  },
}

const spots = {
  1: {
    id: 1,
    spotMain: 237,
    spotSub: 238,
    placeName: 3444,
    spotMainPlaceName: 3448,
    spotSubPlaceName: 3449,
    spotNameText: '加拉迪翁湾',
    spotMainNameText: '加拉迪翁湾外海',
    spotSubNameText: '加拉迪翁湾外海幻海流',
    weatherSet: [2, 3, 4, 7, 8, 1],
  },
  2: {
    id: 2,
    spotMain: 239,
    spotSub: 240,
    placeName: 3445,
    spotMainPlaceName: 3450,
    spotSubPlaceName: 3451,
    spotNameText: '梅尔托尔海峡南',
    spotMainNameText: '梅尔托尔海峡南',
    spotSubNameText: '梅尔托尔海峡南幻海流',
    weatherSet: [2, 3, 4, 5, 6, 1],
  },
  3: {
    id: 3,
    spotMain: 243,
    spotSub: 244,
    placeName: 3446,
    spotMainPlaceName: 3452,
    spotSubPlaceName: 3453,
    spotNameText: '梅尔托尔海峡北',
    spotMainNameText: '梅尔托尔海峡北',
    spotSubNameText: '梅尔托尔海峡北幻海流',
    weatherSet: [2, 3, 4, 15, 16, 1],
  },
  4: {
    id: 4,
    spotMain: 241,
    spotSub: 242,
    placeName: 3447,
    spotMainPlaceName: 3454,
    spotSubPlaceName: 3455,
    spotNameText: '罗塔诺海',
    spotMainNameText: '罗塔诺海海面',
    spotSubNameText: '罗塔诺海海面幻海流',
    weatherSet: [2, 3, 4, 11, 14, 1],
  },
  5: {
    id: 5,
    spotMain: 246,
    spotSub: 247,
    placeName: 3641,
    spotMainPlaceName: 3621,
    spotSubPlaceName: 3622,
    spotNameText: '谢尔达莱群岛',
    spotMainNameText: '谢尔达莱群岛近海',
    spotSubNameText: '谢尔达莱群岛近海幻海流',
    weatherSet: [2, 3, 4, 9, 10, 1],
  },
  6: {
    id: 6,
    spotMain: 248,
    spotSub: 249,
    placeName: 3642,
    spotMainPlaceName: 3623,
    spotSubPlaceName: 3624,
    spotNameText: '绯汐海',
    spotMainNameText: '绯汐海近海',
    spotSubNameText: '绯汐海近海幻海流',
    weatherSet: [2, 3, 4, 7, 8, 1],
  },
  7: {
    id: 7,
    spotMain: 250,
    spotSub: 251,
    placeName: 3643,
    spotMainPlaceName: 3625,
    spotSubPlaceName: 3626,
    spotNameText: '罗斯利特湾',
    spotMainNameText: '罗斯利特湾近海',
    spotSubNameText: '罗斯利特湾近海幻海流',
    weatherSet: [2, 3, 4, 9, 10, 1],
  },
}
// const spotList = Object.values(spots)
// 梅早, 罗早, 梅午, 罗午, 梅晚, 罗晚
const VOYAGE_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
// prettier-ignore
const VOYAGE_SEQ = [  //IKDRouteTable
  7, 10, 1, 4, 8, 11, 2, 5, 9, 12, 3, 6,
  10, 1, 4, 8, 11, 2, 5, 9, 12, 3, 6, 7,
  1, 4, 8, 11, 2, 5, 9, 12, 3, 6, 7, 10,
  4, 8, 11, 2, 5, 9, 12, 3, 6, 7, 10, 1,
  8, 11, 2, 5, 9, 12, 3, 6, 7, 10, 1, 4,
  11, 2, 5, 9, 12, 3, 6, 7, 10, 1, 4, 8,
  2, 5, 9, 12, 3, 6, 7, 10, 1, 4, 8, 11,
  5, 9, 12, 3, 6, 7, 10, 1, 4, 8, 11, 2,
  9, 12, 3, 6, 7, 10, 1, 4, 8, 11, 2, 5,
  12, 3, 6, 7, 10, 1, 4, 8, 11, 2, 5, 9,
  3, 6, 7, 10, 1, 4, 8, 11, 2, 5, 9, 12,
  6, 7, 10, 1, 4, 8, 11, 2, 5, 9, 12, 3,
]

function shiftTimeForCheckInLimit(time) {
  return shiftTimeForLimit(time, 15 * MINUTE)
}

function shiftTimeForLimit(time, limit) {
  const startCheckPoint = time - (time % (2 * HOUR))
  if (time % (2 * HOUR) < limit) {
    return startCheckPoint
  } else {
    return startCheckPoint + 2 * HOUR
  }
}

function getVoyages(time, voyageN, targets = VOYAGE_TYPES) {
  if (targets == null || targets.length === 0) {
    targets = VOYAGE_TYPES
  }
  const MAGIC_OFFSET = -8 + VOYAGE_SEQ.length
  const voyageOffset = Math.floor(Math.floor(time / HOUR) / 2)
  const startCheckPoint = time - (time % (2 * HOUR))
  const voyages = []
  for (let i = 0; voyages.length < voyageN; i++) {
    const voyageType = VOYAGE_SEQ[(voyageOffset + MAGIC_OFFSET + i) % VOYAGE_SEQ.length]
    if (targets.includes(voyageType)) {
      voyages.push({
        time: startCheckPoint + i * 2 * HOUR,
        voyageType: voyageType,
      })
    }
  }
  return voyages
}

// 梅早, 罗早, 梅午, 罗午, 梅晚, 罗晚
// const VOYAGE_NAMES = [
//   '梅尔托尔海峡北航线（早班）',
//   '罗塔诺海航线（早班）',
//   '梅尔托尔海峡北航线（午班）',
//   '罗塔诺海航线（午班）',
//   '梅尔托尔海峡北航线（晚班）',
//   '罗塔诺海航线（晚班）',
// ]

// const LOCATIONS = ['梅尔托尔海峡北', '罗塔诺海海面', '加拉迪翁湾外海', '梅尔托尔海峡南']
// const VOYAGE_NAMES = [
//   '梅尔托尔海峡北航线',
//   '罗塔诺海航线',
//   'Bloodbrine Sea',
//   'Rothlyt Sound',
// ]
const SHIFTS = ['早', '午', '晚']

// const VOYAGE_LOCATIONS = [
//   // 梅尔托尔海峡南 - 加拉迪翁湾外海 - 梅尔托尔海峡北
//   [3, 2, 0],
//   // 加拉迪翁湾外海 - 梅尔托尔海峡南 - 罗塔诺海海面
//   [2, 3, 1],
// ]

// const Fish_Tracker_CN_TIPS = {
//   4: {
//     voyageSimpleName: '梅晚',
//     target: '海龙成就 + ※珊瑚蝠鲼',
//     comment: '蝠鲼可以1区跳跳乐',
//     voyageDetail: '梅尔托尔海峡南(夜) - 加拉迪翁湾外海(日) - 梅尔托尔海峡北(夕)',
//   },
//   5: {
//     voyageSimpleName: '罗晚',
//     target: '※索蒂斯 + ※石骨鱼',
//     comment: '索蒂斯可以1区跳跳乐，2区可以冲海龙成就',
//     voyageDetail: '加拉迪翁湾外海(夜) - 梅尔托尔海峡南(日) - 罗塔诺海海面(夕)',
//   },
//   0: {
//     voyageSimpleName: '梅早',
//     target: '章鱼成就',
//     comment: '也比较适合冲分',
//     voyageDetail: '梅尔托尔海峡南(日) - 加拉迪翁湾外海(夕) - 梅尔托尔海峡北(夜)',
//   },
//   1: {
//     voyageSimpleName: '罗早',
//     target: '水母成就 + 冲分推荐',
//     comment: '由于水母成就相对简单，更建议梅午1区跳跳乐',
//     voyageDetail: '加拉迪翁湾外海(日) - 梅尔托尔海峡南(夕) - 罗塔诺海海面(夜)',
//   },
//   2: {
//     voyageSimpleName: '梅午',
//     target: '※索蒂斯 + ※依拉丝莫龙',
//     comment: '1区可以水母成就跳跳乐',
//     voyageDetail: '梅尔托尔海峡南(夕) - 加拉迪翁湾外海(夜) - 梅尔托尔海峡北(日)',
//   },
//   3: {
//     voyageSimpleName: '罗午',
//     target: '鲨鱼成就 + ※珊瑚蝠鲼',
//     comment: '可以和鲨鱼队一起冲分',
//     voyageDetail: '加拉迪翁湾外海(夕) - 梅尔托尔海峡南(夜) - 罗塔诺海海面(日)',
//   },
// }

// const ACHIEVEMENTS = {
//   2563: {
//     id: 2563,
//     name_chs: '八爪旅人',
//     description: '在出海垂钓中达成八爪旅人。',
//     icon: 29023,
//   },
//   2564: {
//     id: 2564,
//     name_chs: '捕鲨人',
//     description: '在出海垂钓中达成捕鲨人。',
//     icon: 29011,
//   },
//   2565: {
//     id: 2565,
//     name_chs: '水母狂魔',
//     description: '在出海垂钓中达成水母狂魔。',
//     icon: 29755,
//   },
//   2566: {
//     id: 2566,
//     name_chs: '龙马惊神',
//     description: '在出海垂钓中达成龙马惊神。',
//     icon: 29040,
//   },
//   2754: {
//     id: 2754,
//     name_chs: 'What Did Balloons Do to You?',
//     description: 'Earn the “Balloon Catchers” bonus during an ocean fishing voyage.',
//     icon: 29118,
//   },
//   2755: {
//     id: 2755,
//     name_chs: 'What Did Crabs Do to You?',
//     description: 'Earn the “Crab Boat Crew” bonus during an ocean fishing voyage.',
//     icon: 29110,
//   },
//   2756: {
//     id: 2756,
//     name_chs: 'What Did Mantas Do to You?',
//     description:
//       'Earn the “Sticking it to the Manta” bonus during an ocean fishing voyage.',
//     icon: 29130,
//   },
// }

// const VOYAGE_TIPS = [
//   // 梅早
//   {
//     achievements: [2562, 2563],
//     comment: '最佳冲分航线，同时适合钓章鱼成就',
//   },
//   // 罗早
//   {
//     achievements: [2562, 2565],
//     comment: '次佳冲分路线，同时适合钓水母成就',
//   },
//   // 梅午
//   {
//     achievements: [],
//     comment: '航线上有两条蓝鱼，没起蓝鱼的话冲分有些困难',
//   },
//   // 罗午
//   {
//     achievements: [2562, 2564],
//     comment: '还不错的冲分航线，同时适合钓鲨鱼成就',
//   },
//   // 梅晚
//   {
//     achievements: [2566],
//     comment: '比较一般的航线，同时适合钓海马成就',
//   },
//   // 罗晚
//   {
//     achievements: [],
//     comment: '航线上有两条蓝鱼，除非欧皇小队起3条蓝鱼否则冲分会很困难',
//   },
// ]

// // location 4, shift 3
// for (let i = 0; i < 12; i++) {
//     console.log(i, LOCATIONS[i % 4], SHIFTS[i >> 2])
// }

// const ITEMS = {
//   29791: {
//     _id: 29791,
//     name_chs: '依拉丝莫龙',
//     icon: 28012,
//   },
//   29790: {
//     _id: 29790,
//     name_chs: '石骨鱼',
//     icon: 28011,
//   },
//   29788: {
//     _id: 29788,
//     name_chs: '索蒂斯',
//     icon: 28009,
//   },
//   29789: {
//     _id: 29789,
//     name_chs: '珊瑚蝠鲼',
//     icon: 28010,
//   },
// }

// const LOCATION_SHIFT_TIPS = [
//   // 0 梅尔托尔海峡北(早)
//   { blueFish: 29791 },
//   // 1 罗塔诺海海面(早)
//   { blueFish: null },
//   // 2 加拉迪翁湾外海(早)
//   { blueFish: null },
//   // 3 梅尔托尔海峡南(早)
//   { blueFish: null },
//   // 4 梅尔托尔海峡北(午)
//   { blueFish: null },
//   // 5 罗塔诺海海面(午)
//   { blueFish: 29790 },
//   // 6 加拉迪翁湾外海(午)
//   { blueFish: null },
//   // 7 梅尔托尔海峡南(午)
//   { blueFish: null },
//   // 8 梅尔托尔海峡北(晚)
//   { blueFish: null },
//   // 9 罗塔诺海海面(晚)
//   { blueFish: null },
//   // 10 加拉迪翁湾外海(晚)
//   { blueFish: 29788 },
//   // 11 梅尔托尔海峡南(晚)
//   { blueFish: 29789 },
// ]

// shift * 2 + location
// function voyageToShift(voyage) {
//   return voyage >>> 1
// }
//
// function voyageToLocation(voyage) {
//   return voyage % 2
// }
//
// function locationShiftIndexOf(location, time) {
//   return (time << 2) + location
// }
//
// function locationShiftToLocation(locationShiftIndex) {
//   return locationShiftIndex % 4
// }
//
// function locationShiftToShift(locationShiftIndex) {
//   return locationShiftIndex >>> 2
// }

// const LOCATION_TO_FISHING_SPOTS = [
//   { normal: 243, spectralCurrent: 244 },
//   { normal: 241, spectralCurrent: 242 },
//   { normal: 237, spectralCurrent: 238 },
//   { normal: 239, spectralCurrent: 240 },
// ]

// const FISHING_SPOTS_WEATHER_SET = {
//   237: [2, 3, 4, 7, 8, 1],
//   239: [2, 3, 4, 5, 6, 1],
//   241: [2, 3, 4, 11, 14, 1],
//   243: [2, 3, 4, 15, 16, 1],
//   246: [2, 3, 4, 9, 10, 1],
//   248: [2, 3, 4, 7, 8, 1],
//   250: [2, 3, 4, 9, 10, 1],
// }

function voyagesWithTipOf(time = Date.now(), voyageN = 10, targets = VOYAGE_TYPES) {
  return getVoyages(time, voyageN, targets).map(voyage => {
    const route = routes[voyage.voyageType]
    const spotList = route.spotList
    // let shiftStart = voyageToShift(voyageType)
    const timeList = route.timeList
    const locationTips = spotList.map((spotId, i) => {
      const shiftIndex = timeList[i] - 1
      const spot = spots[spotId]
      const fishingSpots = {
        normal: spot.spotMain,
        spectralCurrent: spot.spotSub,
      }
      return {
        spotId: spotId,
        fishingSpots: fishingSpots,
        weatherSet: spot.weatherSet,
        locationName: spot.spotMainNameText,
        shift: shiftIndex,
        locationHint: SHIFTS[shiftIndex],
        blueFish: route.blueFish[i] ? route.blueFish[i] : null,
      }
    })
    const routeMissions = route.missions.map(missionId => missions[missionId])
    return {
      ...voyage,
      // ...Fish_Tracker_CN_TIPS[voyage.voyageType],
      voyageTip: { achievements: route.achievements },
      locationTips: locationTips,
      shift: {
        type: timeList[0] - 1,
        name: route.name_chs,
      },
      typeMission: routeMissions.find(mission => mission.types.length > 0),
      starMission: routeMissions.find(mission => mission.star),
      tugMission: routeMissions.filter(mission => mission.tug),
    }
  })
}

// function simpleTipsOf(time = Date.now(), voyageN = 10, targets = VOYAGE_TYPES) {
//   return voyagesWithTipOf(time, voyageN, targets).map(tip => {
//     return {
//       time: new Intl.DateTimeFormat('zh-Hans-CN', {
//         formatMatcher: 'basic',
//         timeZone: 'Asia/Shanghai',
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false,
//       }).format(new Date(tip.time)),
//       name: tip.voyageSimpleName,
//       blueFish: tip.locationTips
//         .map(it => ITEMS[it.blueFish])
//         .filter(it => it)
//         .map(it => it.name_chs)
//         .join('，'),
//       achievements: tip.voyageTip.comment,
//     }
//   })
// }

// console.log(simpleTipsOf(shiftTimeForCheckInLimit(Date.now())))
// console.log(new Date(shiftTimeForCheckInLimit(Date.now())))

export default {
  voyagesWithTipOf,
  // simpleTipsOf,
  shiftTimeForCheckInLimit,
  shiftTimeForLimit,
  ROUTES: routes,
  SPOTS: spots,
  // voyageToShift,
  // voyageToLocation,
  // locationShiftIndexOf,
  // locationShiftToLocation,
  // locationShiftToShift,
  // LOCATIONS,
  SHIFTS,
  // LOCATION_SHIFT_TIPS,
  // VOYAGE_TIPS,
  // VOYAGE_TYPES,
  // VOYAGE_LOCATIONS,
}

// console.log(
//   voyagesWithTipOf(new Date(), 72).map(it => ({
//     id: it.voyageType,
//     name: it.shift.name,
//     type: it.shift.type,
//   }))
// )
