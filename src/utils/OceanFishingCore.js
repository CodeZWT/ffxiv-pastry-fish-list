const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE

// code to generate VOYAGE_SEQ
// -------------------------
// const LOCATION_SEQ = [
//   0,1,0,1,0,1,0,1,0,1,0,1,
//   1,0,1,0,1,0,1,0,1,0,1,0
// ]
// const SHIFT_SEQ = [
//   0,0,1,1,2,2,0,0,1,1,2,2,
//   0,0,1,1,2,2,0,0,1,1,2,2,
//   1,1,2,2,0,0,1,1,2,2,0,0,
//   1,1,2,2,0,0,1,1,2,2,0,0,
//   2,2,0,0,1,1,2,2,0,0,1,1,
//   2,2,0,0,1,1,2,2,0,0,1,1,
// ]
// const VOYAGE_SEQ = SHIFT_SEQ.map((it, i) => (it << 1) + LOCATION_SEQ[i%LOCATION_SEQ.length])
// console.log(JSON.stringify(VOYAGE_SEQ))
// -------------------------

// code to map index to real voyage name
// -------------------------
// const locationNames = ['m', 'l']
// const shiftNames = ['morning', 'noon', 'night']
// const index2Name = []
// for (let i = 0; i < 6; i++) {
//   index2Name.push(locationNames[i & 1]+'-'+shiftNames[i >> 1])
// }
// console.log(index2Name)
// -------------------------

// 梅早, 罗早, 梅午, 罗午, 梅晚, 罗晚
const VOYAGE_TYPES = [0, 1, 2, 3, 4, 5]
// prettier-ignore
const VOYAGE_SEQ = [
  0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,
  1, 0, 3, 2, 5, 4, 1, 0, 3, 2, 5, 4,
  2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1,
  3, 2, 5, 4, 1, 0, 3, 2, 5, 4, 1, 0,
  4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3,
  5, 4, 1, 0, 3, 2, 5, 4, 1, 0, 3, 2,
]

function shiftTimeForCheckInLimit(time) {
  const startCheckPoint = time - (time % (2 * HOUR))
  if (time % (2 * HOUR) < 15 * MINUTE) {
    return startCheckPoint
  } else {
    return startCheckPoint + 2 * HOUR
  }
}

function getVoyages(time, voyageN, targets = VOYAGE_TYPES) {
  if (targets == null || targets.length === 0) {
    targets = VOYAGE_TYPES
  }
  const MAGIC_OFFSET = 64
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

const LOCATIONS = ['梅尔托尔海峡北', '罗塔诺海海面', '加拉迪翁湾外海', '梅尔托尔海峡南']

const SHIFTS = ['早', '午', '晚']

const VOYAGE_LOCATIONS = [
  // 梅尔托尔海峡南 - 加拉迪翁湾外海 - 梅尔托尔海峡北
  [3, 2, 0],
  // 加拉迪翁湾外海 - 梅尔托尔海峡南 - 罗塔诺海海面
  [2, 3, 1],
]

const Fish_Tracker_CN_TIPS = {
  '4': {
    voyageSimpleName: '梅晚',
    target: '海龙成就 + ※珊瑚蝠鲼',
    comment: '蝠鲼可以1区跳跳乐',
    voyageDetail: '梅尔托尔海峡南(夜) - 加拉迪翁湾外海(日) - 梅尔托尔海峡北(夕)',
  },
  '5': {
    voyageSimpleName: '罗晚',
    target: '※索蒂斯 + ※石骨鱼',
    comment: '索蒂斯可以1区跳跳乐，2区可以冲海龙成就',
    voyageDetail: '加拉迪翁湾外海(夜) - 梅尔托尔海峡南(日) - 罗塔诺海海面(夕)',
  },
  '0': {
    voyageSimpleName: '梅早',
    target: '章鱼成就',
    comment: '也比较适合冲分',
    voyageDetail: '梅尔托尔海峡南(日) - 加拉迪翁湾外海(夕) - 梅尔托尔海峡北(夜)',
  },
  '1': {
    voyageSimpleName: '罗早',
    target: '水母成就 + 冲分推荐',
    comment: '由于水母成就相对简单，更建议梅午1区跳跳乐',
    voyageDetail: '加拉迪翁湾外海(日) - 梅尔托尔海峡南(夕) - 罗塔诺海海面(夜)',
  },
  '2': {
    voyageSimpleName: '梅午',
    target: '※索蒂斯 + ※依拉丝莫龙',
    comment: '1区可以水母成就跳跳乐',
    voyageDetail: '梅尔托尔海峡南(夕) - 加拉迪翁湾外海(夜) - 梅尔托尔海峡北(日)',
  },
  '3': {
    voyageSimpleName: '罗午',
    target: '鲨鱼成就 + ※珊瑚蝠鲼',
    comment: '可以和鲨鱼队一起冲分',
    voyageDetail: '加拉迪翁湾外海(夕) - 梅尔托尔海峡南(夜) - 罗塔诺海海面(日)',
  },
}

const VOYAGE_TIPS = [
  // 梅早
  {
    achievements: [2562, 2563],
    comment: '最佳冲分航线，同时适合钓章鱼成就',
  },
  // 罗早
  {
    achievements: [2562, 2565],
    comment: '次佳冲分路线，同时适合钓水母成就',
  },
  // 梅午
  {
    achievements: [],
    comment: '航线上有两条蓝鱼，没起蓝鱼的话冲分有些困难',
  },
  // 罗午
  {
    achievements: [2562, 2564],
    comment: '还不错的冲分航线，同时适合钓鲨鱼成就',
  },
  // 梅晚
  {
    achievements: [2566],
    comment: '比较一般的航线，同时适合钓海马成就',
  },
  // 罗晚
  {
    achievements: [],
    comment: '航线上有两条蓝鱼，除非欧皇小队起3条蓝鱼否则冲分会很困难',
  },
]

// // location 4, shift 3
// for (let i = 0; i < 12; i++) {
//     console.log(i, LOCATIONS[i % 4], SHIFTS[i >> 2])
// }

const ITEMS = {
  '29791': {
    _id: 29791,
    name_chs: '依拉丝莫龙',
    icon: 28012,
  },
  '29790': {
    _id: 29790,
    name_chs: '石骨鱼',
    icon: 28011,
  },
  '29788': {
    _id: 29788,
    name_chs: '索蒂斯',
    icon: 28009,
  },
  '29789': {
    _id: 29789,
    name_chs: '珊瑚蝠鲼',
    icon: 28010,
  },
}

const LOCATION_SHIFT_TIPS = [
  // 0 梅尔托尔海峡北(早)
  { blueFish: 29791 },
  // 1 罗塔诺海海面(早)
  { blueFish: null },
  // 2 加拉迪翁湾外海(早)
  { blueFish: null },
  // 3 梅尔托尔海峡南(早)
  { blueFish: null },
  // 4 梅尔托尔海峡北(午)
  { blueFish: null },
  // 5 罗塔诺海海面(午)
  { blueFish: 29790 },
  // 6 加拉迪翁湾外海(午)
  { blueFish: null },
  // 7 梅尔托尔海峡南(午)
  { blueFish: null },
  // 8 梅尔托尔海峡北(晚)
  { blueFish: null },
  // 9 罗塔诺海海面(晚)
  { blueFish: null },
  // 10 加拉迪翁湾外海(晚)
  { blueFish: 29788 },
  // 11 梅尔托尔海峡南(晚)
  { blueFish: 29789 },
]

// shift * 2 + location
function voyageToShift(voyage) {
  return voyage >>> 1
}

function voyageToLocation(voyage) {
  return voyage % 2
}

function locationShiftIndexOf(location, time) {
  return (time << 2) + location
}

function locationShiftToLocation(locationShiftIndex) {
  return locationShiftIndex % 4
}

function locationShiftToShift(locationShiftIndex) {
  return locationShiftIndex >>> 2
}

function voyagesWithTipOf(time = Date.now(), voyageN = 13, targets = VOYAGE_TYPES) {
  return getVoyages(time, voyageN, targets).map(voyage => {
    const voyageType = voyage.voyageType
    const locations = VOYAGE_LOCATIONS[voyageToLocation(voyageType)]
    let shiftStart = voyageToShift(voyageType)
    const locationTips = locations.map((locationIndex, i) => {
      const shiftIndex = (shiftStart + i) % 3
      return {
        locationName: LOCATIONS[locationIndex] + '(' + SHIFTS[shiftIndex] + ')',
        blueFish:
          LOCATION_SHIFT_TIPS[locationShiftIndexOf(locationIndex, shiftIndex)].blueFish,
      }
    })
    return {
      ...voyage,
      ...Fish_Tracker_CN_TIPS[voyage.voyageType],
      voyageTip: VOYAGE_TIPS[voyageType],
      locationTips,
      shift: {
        type: shiftStart,
        name: LOCATIONS[locations[2]],
      },
    }
  })
}

function simpleTipsOf(time = Date.now(), voyageN = 13, targets = VOYAGE_TYPES) {
  return voyagesWithTipOf(time, voyageN, targets).map(tip => {
    return {
      time: new Intl.DateTimeFormat('zh-Hans-CN', {
        formatMatcher: 'basic',
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date(tip.time)),
      name: tip.voyageSimpleName,
      blueFish: tip.locationTips
        .map(it => ITEMS[it.blueFish])
        .filter(it => it)
        .map(it => it.name_chs)
        .join('，'),
      achievements: tip.voyageTip.comment,
    }
  })
}

// console.log(simpleTipsOf(shiftTimeForCheckInLimit(Date.now())))
// console.log(new Date(shiftTimeForCheckInLimit(Date.now())))

export default {
  voyagesWithTipOf,
  simpleTipsOf,
  shiftTimeForCheckInLimit,
  voyageToShift,
  voyageToLocation,
  locationShiftIndexOf,
  locationShiftToLocation,
  locationShiftToShift,
  LOCATIONS,
  SHIFTS,
  LOCATION_SHIFT_TIPS,
  VOYAGE_TIPS,
  VOYAGE_TYPES,
  VOYAGE_LOCATIONS,
}
