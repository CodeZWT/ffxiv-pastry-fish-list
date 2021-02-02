// const effectToDetect = new Set([
//     761, // SNAGGING
//     805, // COLLECTOR_GLOVE
//     763, // CHUM
//     762, // FISH_EYES
//     1803, // Surface Slap
//     1804, // Identical Cast
// ])
import merge from 'lodash/merge'
import { DATA } from './data'
import CN_DATA from './translation'
import { DateTime } from 'luxon'
import i18n from '@/i18n'
import regionTerritorySpots from 'Data/fishingSpots.js'
import keyBy from 'lodash/keyBy'

function getSpotDict(regionDict) {
  return keyBy(
    Object.values(regionDict)
      .flatMap(region => region.territories)
      .flatMap(territory => territory.spots),
    'id'
  )
}
const SPOT_DICT = getSpotDict(regionTerritorySpots)

const DataUtil = {
  STATUS_DICT: {
    '761': {
      ID: 761,
      IconID: '11102',
      Name: '钓组',
    },
    '762': {
      ID: 762,
      IconID: '11103',
      Name: '鱼眼',
    },
    '763': {
      ID: 763,
      IconID: '11104',
      Name: '撒饵',
    },
    '805': {
      ID: 805,
      IconID: '11008',
      Name: '收藏品采集',
    },
    '1803': {
      ID: 1803,
      IconID: '11115',
      Name: '拍击水面',
    },
    '1804': {
      ID: 1804,
      IconID: '11116',
      Name: '专一垂钓',
    },
  },
  BAIT_DICT: {
    '2585': {
      id: 2585,
      name_chs: '沙蚕',
      iconId: 27004,
    },
    '2586': {
      id: 2586,
      name_chs: '蛾蛹',
      iconId: 27003,
    },
    '2587': {
      id: 2587,
      name_chs: '潮虫',
      iconId: 27005,
    },
    '2588': {
      id: 2588,
      name_chs: '蝲蛄丸子',
      iconId: 27008,
    },
    '2589': {
      id: 2589,
      name_chs: '虾虎丸子',
      iconId: 27009,
    },
    '2590': {
      id: 2590,
      name_chs: '血蚯蚓',
      iconId: 27006,
    },
    '2591': {
      id: 2591,
      name_chs: '沟鼠尾巴',
      iconId: 27001,
    },
    '2592': {
      id: 2592,
      name_chs: '摇蚊',
      iconId: 27002,
    },
    '2593': {
      id: 2593,
      name_chs: '螃蟹丸子',
      iconId: 27011,
    },
    '2594': {
      id: 2594,
      name_chs: '黄油虫',
      iconId: 27019,
    },
    '2595': {
      id: 2595,
      name_chs: '鲈鱼丸子',
      iconId: 27010,
    },
    '2596': {
      id: 2596,
      name_chs: '单环刺螠',
      iconId: 27015,
    },
    '2597': {
      id: 2597,
      name_chs: '花蝇',
      iconId: 27002,
    },
    '2598': {
      id: 2598,
      name_chs: '鲱鱼丸子',
      iconId: 27007,
    },
    '2599': {
      id: 2599,
      name_chs: '蜜虫',
      iconId: 27018,
    },
    '2600': {
      id: 2600,
      name_chs: '沙蛭',
      iconId: 27014,
    },
    '2601': {
      id: 2601,
      name_chs: '蛀虫',
      iconId: 27017,
    },
    '2602': {
      id: 2602,
      name_chs: '沙壁虎',
      iconId: 27012,
    },
    '2603': {
      id: 2603,
      name_chs: '火萤',
      iconId: 27021,
    },
    '2604': {
      id: 2604,
      name_chs: '滚石',
      iconId: 27024,
    },
    '2605': {
      id: 2605,
      name_chs: '浮游虫',
      iconId: 27022,
    },
    '2606': {
      id: 2606,
      name_chs: '极地磷虾',
      iconId: 27023,
    },
    '2607': {
      id: 2607,
      name_chs: '石蚕',
      iconId: 27013,
    },
    '2608': {
      id: 2608,
      name_chs: '沙毛虫',
      iconId: 27016,
    },
    '2609': {
      id: 2609,
      name_chs: '气球虫',
      iconId: 27020,
    },
    '2610': {
      id: 2610,
      name_chs: '陆行鸟拟饵',
      iconId: 27056,
    },
    '2611': {
      id: 2611,
      name_chs: '漂浮诱饵鱼',
      iconId: 27051,
    },
    '2612': {
      id: 2612,
      name_chs: '黄铜勺形鱼饵',
      iconId: 27064,
    },
    '2613': {
      id: 2613,
      name_chs: '小虾肉笼',
      iconId: 27053,
    },
    '2614': {
      id: 2614,
      name_chs: '乌鸦拟饵',
      iconId: 27057,
    },
    '2615': {
      id: 2615,
      name_chs: '白银勺形鱼饵',
      iconId: 27052,
    },
    '2616': {
      id: 2616,
      name_chs: '铁板钩',
      iconId: 27067,
    },
    '2617': {
      id: 2617,
      name_chs: '下沉诱饵鱼',
      iconId: 27055,
    },
    '2618': {
      id: 2618,
      name_chs: '毛球拟饵',
      iconId: 27058,
    },
    '2619': {
      id: 2619,
      name_chs: '重铁板钩',
      iconId: 27065,
    },
    '2620': {
      id: 2620,
      name_chs: '旋转亮片',
      iconId: 27062,
    },
    '2621': {
      id: 2621,
      name_chs: '磷虾肉笼',
      iconId: 27053,
    },
    '2622': {
      id: 2622,
      name_chs: '秘银勺形鱼饵',
      iconId: 27066,
    },
    '2623': {
      id: 2623,
      name_chs: '雉鸡拟饵',
      iconId: 27059,
    },
    '2624': {
      id: 2624,
      name_chs: '漂浮诱饵蛙',
      iconId: 27054,
    },
    '2625': {
      id: 2625,
      name_chs: '彩虹勺形鱼饵',
      iconId: 27061,
    },
    '2626': {
      id: 2626,
      name_chs: '复合亮片',
      iconId: 27063,
    },
    '2627': {
      id: 2627,
      name_chs: '羽毛拟饵',
      iconId: 27060,
    },
    '2628': {
      id: 2628,
      name_chs: '弓角',
      iconId: 27068,
    },
    '12704': {
      id: 12704,
      name_chs: '石蝇幼虫',
      iconId: 27028,
    },
    '12705': {
      id: 12705,
      name_chs: '土蜘蛛',
      iconId: 22619,
    },
    '12706': {
      id: 12706,
      name_chs: '哥布林钓钩',
      iconId: 27069,
    },
    '12707': {
      id: 12707,
      name_chs: '叶片钓钩',
      iconId: 27070,
    },
    '12708': {
      id: 12708,
      name_chs: '红气球虫',
      iconId: 27025,
    },
    '12709': {
      id: 12709,
      name_chs: '熔岩蠕虫',
      iconId: 27026,
    },
    '12710': {
      id: 12710,
      name_chs: '恶魔蠕虫',
      iconId: 27027,
    },
    '12711': {
      id: 12711,
      name_chs: '残暴水蛭',
      iconId: 22635,
    },
    '12712': {
      id: 12712,
      name_chs: '巨型大蚊',
      iconId: 27002,
    },
    '20613': {
      id: 20613,
      name_chs: '鲑鱼籽',
      iconId: 27031,
    },
    '20614': {
      id: 20614,
      name_chs: '肥蚯蚓',
      iconId: 27032,
    },
    '20615': {
      id: 20615,
      name_chs: '赤虫',
      iconId: 27033,
    },
    '20616': {
      id: 20616,
      name_chs: '蚕蛹',
      iconId: 27034,
    },
    '20617': {
      id: 20617,
      name_chs: '活虾',
      iconId: 27035,
    },
    '20618': {
      id: 20618,
      name_chs: '蔓菁拟饵',
      iconId: 27071,
    },
    '20619': {
      id: 20619,
      name_chs: '悬浮诱饵鱼',
      iconId: 27072,
    },
    '20675': {
      id: 20675,
      name_chs: '嗡嗡石蝇',
      iconId: 27013,
    },
    '20676': {
      id: 20676,
      name_chs: '蓝矶沙蚕',
      iconId: 27004,
    },
    '27582': {
      id: 27582,
      name_chs: '水果蠕虫',
      iconId: 27036,
    },
    '27583': {
      id: 27583,
      name_chs: '藻虾',
      iconId: 27037,
    },
    '27584': {
      id: 27584,
      name_chs: '沙漠蛙',
      iconId: 27073,
    },
    '27585': {
      id: 27585,
      name_chs: '大理石幼虫',
      iconId: 27038,
    },
    '27586': {
      id: 27586,
      name_chs: '力山羊肉干',
      iconId: 27039,
    },
    '27587': {
      id: 27587,
      name_chs: '盗蟹丸',
      iconId: 27010,
    },
    '27588': {
      id: 27588,
      name_chs: '短嘴诱饵鱼',
      iconId: 27074,
    },
    '27589': {
      id: 27589,
      name_chs: '虫箱',
      iconId: 27040,
    },
    '27590': {
      id: 27590,
      name_chs: '乌贼丝',
      iconId: 27041,
    },
    '27591': {
      id: 27591,
      name_chs: '淡水万能饵',
      iconId: 27042,
    },
    '27592': {
      id: 27592,
      name_chs: '海水万能饵',
      iconId: 27043,
    },
    '28634': {
      id: 28634,
      name_chs: '金属亮片',
      iconId: 27062,
    },
    '29714': {
      id: 29714,
      name_chs: '石沙蚕',
      iconId: 27004,
    },
    '29715': {
      id: 29715,
      name_chs: '磷虾',
      iconId: 27023,
    },
    '29716': {
      id: 29716,
      name_chs: '刺螠',
      iconId: 27015,
    },
    '29717': {
      id: 29717,
      name_chs: '万能拟饵',
      iconId: 27051,
    },
    '30136': {
      id: 30136,
      name_chs: '天钢之球',
      iconId: 27007,
    },
    '30278': {
      id: 30278,
      name_chs: '云冠气球虫',
      iconId: 27020,
    },
    '30279': {
      id: 30279,
      name_chs: '云冠红气球虫',
      iconId: 27025,
    },
    '30280': {
      id: 30280,
      name_chs: '云冠大蚊',
      iconId: 27002,
    },
    '30281': {
      id: 30281,
      name_chs: '云冠浮游虫',
      iconId: 27022,
    },
  },
  FISH_DICT: {
    '4776': {
      id: 4776,
      name_chs: '星里海带',
      iconId: 29063,
    },
    '4869': {
      id: 4869,
      name_chs: '梅尔托尔虾虎',
      iconId: 29003,
    },
    '4870': {
      id: 4870,
      name_chs: '罗敏萨鳀鱼',
      iconId: 29034,
    },
    '4871': {
      id: 4871,
      name_chs: '手指虾',
      iconId: 29008,
    },
    '4872': {
      id: 4872,
      name_chs: '海云水母',
      iconId: 29005,
    },
    '4873': {
      id: 4873,
      name_chs: '藤皮海参',
      iconId: 29028,
    },
    '4874': {
      id: 4874,
      name_chs: '海港鲱',
      iconId: 29044,
    },
    '4875': {
      id: 4875,
      name_chs: '比阿纳可蛤蜊',
      iconId: 29031,
    },
    '4876': {
      id: 4876,
      name_chs: '珊瑚蝶',
      iconId: 29016,
    },
    '4877': {
      id: 4877,
      name_chs: '莫拉比鲽鱼',
      iconId: 29052,
    },
    '4878': {
      id: 4878,
      name_chs: '石软蟹',
      iconId: 29056,
    },
    '4879': {
      id: 4879,
      name_chs: '虎纹鳕',
      iconId: 29012,
    },
    '4880': {
      id: 4880,
      name_chs: '钢盔鲎',
      iconId: 29032,
    },
    '4881': {
      id: 4881,
      name_chs: '罗斯利特牡蛎',
      iconId: 29015,
    },
    '4882': {
      id: 4882,
      name_chs: '海神刀',
      iconId: 29042,
    },
    '4883': {
      id: 4883,
      name_chs: '神仙鱼',
      iconId: 29033,
    },
    '4884': {
      id: 4884,
      name_chs: '折刀贝',
      iconId: 29030,
    },
    '4885': {
      id: 4885,
      name_chs: '蓝章鱼',
      iconId: 29051,
    },
    '4886': {
      id: 4886,
      name_chs: '海毒鲀',
      iconId: 29007,
    },
    '4887': {
      id: 4887,
      name_chs: '刀鳍沙丁鱼',
      iconId: 29004,
    },
    '4888': {
      id: 4888,
      name_chs: '魔梭鱼',
      iconId: 29035,
    },
    '4889': {
      id: 4889,
      name_chs: '钓鮟鱇',
      iconId: 29049,
    },
    '4890': {
      id: 4890,
      name_chs: '海马',
      iconId: 29040,
    },
    '4891': {
      id: 4891,
      name_chs: '比阿纳可鲷鱼',
      iconId: 29009,
    },
    '4892': {
      id: 4892,
      name_chs: '黑鳎',
      iconId: 29014,
    },
    '4893': {
      id: 4893,
      name_chs: '锤头鲨',
      iconId: 29026,
    },
    '4894': {
      id: 4894,
      name_chs: '苍皮海参',
      iconId: 29029,
    },
    '4895': {
      id: 4895,
      name_chs: '苍茫鲱',
      iconId: 29010,
    },
    '4896': {
      id: 4896,
      name_chs: '灰海金枪鱼',
      iconId: 29018,
    },
    '4897': {
      id: 4897,
      name_chs: '叶海龙',
      iconId: 29053,
    },
    '4898': {
      id: 4898,
      name_chs: '满月沙丁鱼',
      iconId: 29055,
    },
    '4899': {
      id: 4899,
      name_chs: '哈拉尔黑线鳕',
      iconId: 29017,
    },
    '4900': {
      id: 4900,
      name_chs: '白蝶贝',
      iconId: 29059,
    },
    '4901': {
      id: 4901,
      name_chs: '薰衣草印鱼',
      iconId: 29038,
    },
    '4902': {
      id: 4902,
      name_chs: '气泡鱼',
      iconId: 29046,
    },
    '4903': {
      id: 4903,
      name_chs: '银鲨',
      iconId: 29011,
    },
    '4904': {
      id: 4904,
      name_chs: '梭子鰆',
      iconId: 29025,
    },
    '4905': {
      id: 4905,
      name_chs: '求雨鱼',
      iconId: 29057,
    },
    '4906': {
      id: 4906,
      name_chs: '鹦鹉螺',
      iconId: 29006,
    },
    '4907': {
      id: 4907,
      name_chs: '刺鳗',
      iconId: 29045,
    },
    '4908': {
      id: 4908,
      name_chs: '隆头鱼',
      iconId: 29043,
    },
    '4909': {
      id: 4909,
      name_chs: '平鱼',
      iconId: 29048,
    },
    '4910': {
      id: 4910,
      name_chs: '海魔鱼',
      iconId: 29039,
    },
    '4911': {
      id: 4911,
      name_chs: '海岩龙虾',
      iconId: 29013,
    },
    '4912': {
      id: 4912,
      name_chs: '拟鮟鱇',
      iconId: 29037,
    },
    '4913': {
      id: 4913,
      name_chs: '小撒拉奥斯',
      iconId: 29054,
    },
    '4914': {
      id: 4914,
      name_chs: '愿贝',
      iconId: 29047,
    },
    '4915': {
      id: 4915,
      name_chs: '麻希鲯鳅',
      iconId: 29050,
    },
    '4916': {
      id: 4916,
      name_chs: '大比目鱼',
      iconId: 29036,
    },
    '4917': {
      id: 4917,
      name_chs: '马兹拉雅枪鱼',
      iconId: 29022,
    },
    '4918': {
      id: 4918,
      name_chs: '腔棘鱼',
      iconId: 29041,
    },
    '4919': {
      id: 4919,
      name_chs: '巨型乌贼',
      iconId: 29027,
    },
    '4920': {
      id: 4920,
      name_chs: '基迦章鱼',
      iconId: 29023,
    },
    '4921': {
      id: 4921,
      name_chs: '翻车鱼',
      iconId: 29021,
    },
    '4922': {
      id: 4922,
      name_chs: '恐鱼',
      iconId: 29019,
    },
    '4923': {
      id: 4923,
      name_chs: '巨齿鲨',
      iconId: 29024,
    },
    '4924': {
      id: 4924,
      name_chs: '锯鲛',
      iconId: 29020,
    },
    '4925': {
      id: 4925,
      name_chs: '蝲蛄',
      iconId: 29208,
    },
    '4926': {
      id: 4926,
      name_chs: '鲢鱼',
      iconId: 29247,
    },
    '4927': {
      id: 4927,
      name_chs: '斑纹虾虎',
      iconId: 29230,
    },
    '4928': {
      id: 4928,
      name_chs: '小鲶鱼',
      iconId: 29253,
    },
    '4929': {
      id: 4929,
      name_chs: '骨蝲蛄',
      iconId: 29209,
    },
    '4930': {
      id: 4930,
      name_chs: '公主鳟',
      iconId: 29285,
    },
    '4931': {
      id: 4931,
      name_chs: '幽暗虾虎',
      iconId: 29273,
    },
    '4932': {
      id: 4932,
      name_chs: '皮皮拉鱼',
      iconId: 29212,
    },
    '4933': {
      id: 4933,
      name_chs: '红蝲蛄',
      iconId: 29207,
    },
    '4934': {
      id: 4934,
      name_chs: '潜沙鱼',
      iconId: 29251,
    },
    '4935': {
      id: 4935,
      name_chs: '黄铜泥鳅',
      iconId: 29215,
    },
    '4936': {
      id: 4936,
      name_chs: '白妙鲤',
      iconId: 29210,
    },
    '4937': {
      id: 4937,
      name_chs: '阿巴拉提亚公鱼',
      iconId: 29310,
    },
    '4938': {
      id: 4938,
      name_chs: '盲鱼',
      iconId: 29214,
    },
    '4939': {
      id: 4939,
      name_chs: '弹涂鱼',
      iconId: 29291,
    },
    '4940': {
      id: 4940,
      name_chs: '虹鳟鱼',
      iconId: 29204,
    },
    '4941': {
      id: 4941,
      name_chs: '河蟹',
      iconId: 29235,
    },
    '4942': {
      id: 4942,
      name_chs: '斗鱼',
      iconId: 29216,
    },
    '4943': {
      id: 4943,
      name_chs: '仙女鲈',
      iconId: 29280,
    },
    '4944': {
      id: 4944,
      name_chs: '橡果蜗牛',
      iconId: 29244,
    },
    '4945': {
      id: 4945,
      name_chs: '暗塘鳢',
      iconId: 29277,
    },
    '4946': {
      id: 4946,
      name_chs: '拉诺西亚刺鱼',
      iconId: 29304,
    },
    '4947': {
      id: 4947,
      name_chs: '沟鲫鱼',
      iconId: 29286,
    },
    '4948': {
      id: 4948,
      name_chs: '铜鱼',
      iconId: 29314,
    },
    '4949': {
      id: 4949,
      name_chs: '蓝铃鲑',
      iconId: 29282,
    },
    '4950': {
      id: 4950,
      name_chs: '泥软蟹',
      iconId: 29294,
    },
    '4951': {
      id: 4951,
      name_chs: '三色鲤',
      iconId: 29283,
    },
    '4952': {
      id: 4952,
      name_chs: '深红蝲蛄',
      iconId: 29292,
    },
    '4953': {
      id: 4953,
      name_chs: '翡翠鳗',
      iconId: 29257,
    },
    '4954': {
      id: 4954,
      name_chs: '圆蚌',
      iconId: 29307,
    },
    '4955': {
      id: 4955,
      name_chs: '暖水鳟',
      iconId: 29245,
    },
    '4956': {
      id: 4956,
      name_chs: '玻璃刺鱼',
      iconId: 29256,
    },
    '4957': {
      id: 4957,
      name_chs: '四眼鱼',
      iconId: 29301,
    },
    '4958': {
      id: 4958,
      name_chs: '黑鳗',
      iconId: 29205,
    },
    '4959': {
      id: 4959,
      name_chs: '暗鲈',
      iconId: 29206,
    },
    '4960': {
      id: 4960,
      name_chs: '圣盾虾',
      iconId: 29271,
    },
    '4961': {
      id: 4961,
      name_chs: '清道琵琶鱼',
      iconId: 29269,
    },
    '4962': {
      id: 4962,
      name_chs: '上爬刺鱼',
      iconId: 29252,
    },
    '4963': {
      id: 4963,
      name_chs: '黑鲶鱼',
      iconId: 29249,
    },
    '4964': {
      id: 4964,
      name_chs: '黑鬼鱼',
      iconId: 29213,
    },
    '4965': {
      id: 4965,
      name_chs: '八目鳗',
      iconId: 29298,
    },
    '4966': {
      id: 4966,
      name_chs: '披骨鱼',
      iconId: 29288,
    },
    '4967': {
      id: 4967,
      name_chs: '宇格拉姆鲑鱼',
      iconId: 29203,
    },
    '4968': {
      id: 4968,
      name_chs: '斑纹琵琶鱼',
      iconId: 29254,
    },
    '4969': {
      id: 4969,
      name_chs: '带鱼',
      iconId: 29242,
    },
    '4970': {
      id: 4970,
      name_chs: '神握鳉',
      iconId: 29246,
    },
    '4971': {
      id: 4971,
      name_chs: '净骨蜗牛',
      iconId: 29289,
    },
    '4972': {
      id: 4972,
      name_chs: '蔓根跳鱼',
      iconId: 29306,
    },
    '4973': {
      id: 4973,
      name_chs: '骨舌鱼',
      iconId: 29243,
    },
    '4974': {
      id: 4974,
      name_chs: '硬毛蟹',
      iconId: 29296,
    },
    '4975': {
      id: 4975,
      name_chs: '蒙凯恩凯鱼',
      iconId: 29218,
    },
    '4976': {
      id: 4976,
      name_chs: '樱鳟',
      iconId: 29300,
    },
    '4977': {
      id: 4977,
      name_chs: '沙鱼',
      iconId: 29234,
    },
    '4978': {
      id: 4978,
      name_chs: '银鱼',
      iconId: 29312,
    },
    '4979': {
      id: 4979,
      name_chs: '小丑鳅',
      iconId: 29255,
    },
    '4980': {
      id: 4980,
      name_chs: '铠甲琵琶鱼',
      iconId: 29236,
    },
    '4981': {
      id: 4981,
      name_chs: '巨鲈',
      iconId: 29268,
    },
    '4982': {
      id: 4982,
      name_chs: '威罗迪纳鲤鱼',
      iconId: 29211,
    },
    '4983': {
      id: 4983,
      name_chs: '斑点鲀',
      iconId: 29297,
    },
    '4984': {
      id: 4984,
      name_chs: '黄金鳅',
      iconId: 29258,
    },
    '4985': {
      id: 4985,
      name_chs: '纳尔札尔鳗鱼',
      iconId: 29259,
    },
    '4986': {
      id: 4986,
      name_chs: '绯红鳟',
      iconId: 29240,
    },
    '4987': {
      id: 4987,
      name_chs: '盘丽鱼',
      iconId: 29275,
    },
    '4988': {
      id: 4988,
      name_chs: '石绿湖鳟鱼',
      iconId: 29284,
    },
    '4989': {
      id: 4989,
      name_chs: '火狱蜗牛',
      iconId: 29308,
    },
    '4990': {
      id: 4990,
      name_chs: '王家琵琶鱼',
      iconId: 29309,
    },
    '4991': {
      id: 4991,
      name_chs: '雷纹鱼',
      iconId: 29303,
    },
    '4992': {
      id: 4992,
      name_chs: '龙门鱼',
      iconId: 29270,
    },
    '4993': {
      id: 4993,
      name_chs: '刀背鱼',
      iconId: 29278,
    },
    '4994': {
      id: 4994,
      name_chs: '橡根鱼',
      iconId: 29263,
    },
    '4995': {
      id: 4995,
      name_chs: '杜父鱼',
      iconId: 29250,
    },
    '4996': {
      id: 4996,
      name_chs: '南方狗鱼',
      iconId: 29221,
    },
    '4997': {
      id: 4997,
      name_chs: '北方狗鱼',
      iconId: 29220,
    },
    '4998': {
      id: 4998,
      name_chs: '地灵鲀',
      iconId: 29276,
    },
    '4999': {
      id: 4999,
      name_chs: '射水鱼',
      iconId: 29274,
    },
    '5000': {
      id: 5000,
      name_chs: '哥布林刺鱼',
      iconId: 29260,
    },
    '5001': {
      id: 5001,
      name_chs: '永恒鲤',
      iconId: 29239,
    },
    '5002': {
      id: 5002,
      name_chs: '暗斗鱼',
      iconId: 29238,
    },
    '5003': {
      id: 5003,
      name_chs: '淤泥跳鱼',
      iconId: 29295,
    },
    '5004': {
      id: 5004,
      name_chs: '震雷鱼',
      iconId: 29281,
    },
    '5005': {
      id: 5005,
      name_chs: '雀鳝',
      iconId: 29264,
    },
    '5006': {
      id: 5006,
      name_chs: '北洲鲈',
      iconId: 29305,
    },
    '5007': {
      id: 5007,
      name_chs: '帕戈尔赞盘丽鱼',
      iconId: 29241,
    },
    '5008': {
      id: 5008,
      name_chs: '争斗琵琶鱼',
      iconId: 29237,
    },
    '5009': {
      id: 5009,
      name_chs: '繁星鳟鱼',
      iconId: 29266,
    },
    '5010': {
      id: 5010,
      name_chs: '战争神狗鱼',
      iconId: 29279,
    },
    '5011': {
      id: 5011,
      name_chs: '金鱼',
      iconId: 29311,
    },
    '5012': {
      id: 5012,
      name_chs: '吸血八目鳗',
      iconId: 29248,
    },
    '5013': {
      id: 5013,
      name_chs: '山岳神杜父鱼',
      iconId: 29299,
    },
    '5014': {
      id: 5014,
      name_chs: '洞穴螯虾',
      iconId: 29227,
    },
    '5015': {
      id: 5015,
      name_chs: '豹鱼',
      iconId: 29261,
    },
    '5016': {
      id: 5016,
      name_chs: '大钝甲鱼',
      iconId: 29222,
    },
    '5017': {
      id: 5017,
      name_chs: '日轮',
      iconId: 29262,
    },
    '5018': {
      id: 5018,
      name_chs: '长吻鳄鳝',
      iconId: 29219,
    },
    '5019': {
      id: 5019,
      name_chs: '乌兹刀背鱼',
      iconId: 29272,
    },
    '5020': {
      id: 5020,
      name_chs: '巨鲶鱼',
      iconId: 29217,
    },
    '5021': {
      id: 5021,
      name_chs: '腐鱼',
      iconId: 29315,
    },
    '5022': {
      id: 5022,
      name_chs: '蘑菇蟹',
      iconId: 29293,
    },
    '5023': {
      id: 5023,
      name_chs: '雷神鱼',
      iconId: 29302,
    },
    '5024': {
      id: 5024,
      name_chs: '斑点雀鳝',
      iconId: 29267,
    },
    '5025': {
      id: 5025,
      name_chs: '煌鱼',
      iconId: 29225,
    },
    '5026': {
      id: 5026,
      name_chs: '弓鳍鱼',
      iconId: 29290,
    },
    '5027': {
      id: 5027,
      name_chs: '环棘鱼',
      iconId: 29313,
    },
    '5028': {
      id: 5028,
      name_chs: '泷太郎',
      iconId: 29226,
    },
    '5029': {
      id: 5029,
      name_chs: '巨骨舌鱼',
      iconId: 29224,
    },
    '5030': {
      id: 5030,
      name_chs: '庞鱼',
      iconId: 29287,
    },
    '5031': {
      id: 5031,
      name_chs: '丛林鲶鱼',
      iconId: 29265,
    },
    '5032': {
      id: 5032,
      name_chs: '沙鲷鱼',
      iconId: 29604,
    },
    '5033': {
      id: 5033,
      name_chs: '沙鲶鱼',
      iconId: 29609,
    },
    '5034': {
      id: 5034,
      name_chs: '土遁鱼',
      iconId: 29602,
    },
    '5035': {
      id: 5035,
      name_chs: '飞沙鱼',
      iconId: 29606,
    },
    '5036': {
      id: 5036,
      name_chs: '蚁狮蛞蝓',
      iconId: 29601,
    },
    '5037': {
      id: 5037,
      name_chs: '沙丘蝠鲼',
      iconId: 29607,
    },
    '5038': {
      id: 5038,
      name_chs: '云水母',
      iconId: 29657,
    },
    '5039': {
      id: 5039,
      name_chs: '天鱼',
      iconId: 29653,
    },
    '5040': {
      id: 5040,
      name_chs: '破云飞鱼',
      iconId: 29655,
    },
    '5041': {
      id: 5041,
      name_chs: '飞蝠鲼',
      iconId: 29651,
    },
    '5042': {
      id: 5042,
      name_chs: '扬帆鱼',
      iconId: 29652,
    },
    '5043': {
      id: 5043,
      name_chs: '撒沟厉钓鮟鱇',
      iconId: 29608,
    },
    '5044': {
      id: 5044,
      name_chs: '浮云碟',
      iconId: 29656,
    },
    '5045': {
      id: 5045,
      name_chs: '旅沙鳗',
      iconId: 29605,
    },
    '5046': {
      id: 5046,
      name_chs: '喙嘴龙',
      iconId: 29654,
    },
    '5047': {
      id: 5047,
      name_chs: '三角兽',
      iconId: 29232,
    },
    '5048': {
      id: 5048,
      name_chs: '腌制用苍茫鲱',
      iconId: 29010,
    },
    '5049': {
      id: 5049,
      name_chs: '海神耳',
      iconId: 29015,
    },
    '5052': {
      id: 5052,
      name_chs: '箱龟',
      iconId: 29231,
    },
    '5053': {
      id: 5053,
      name_chs: '低地蝾螈',
      iconId: 29229,
    },
    '5460': {
      id: 5460,
      name_chs: '白珊瑚',
      iconId: 29062,
    },
    '5461': {
      id: 5461,
      name_chs: '蓝珊瑚',
      iconId: 29061,
    },
    '5462': {
      id: 5462,
      name_chs: '红珊瑚',
      iconId: 29060,
    },
    '5463': {
      id: 5463,
      name_chs: '扇贝',
      iconId: 22253,
    },
    '5464': {
      id: 5464,
      name_chs: '蓑虫螺',
      iconId: 22255,
    },
    '5465': {
      id: 5465,
      name_chs: '樱贝',
      iconId: 22254,
    },
    '5466': {
      id: 5466,
      name_chs: '黑蝶贝',
      iconId: 29058,
    },
    '5544': {
      id: 5544,
      name_chs: '绿灯球藻',
      iconId: 29316,
    },
    '7678': {
      id: 7678,
      name_chs: '扎尔艾拉',
      iconId: 29069,
    },
    '7679': {
      id: 7679,
      name_chs: '无赖王',
      iconId: 29324,
    },
    '7680': {
      id: 7680,
      name_chs: '山神印',
      iconId: 29073,
    },
    '7681': {
      id: 7681,
      name_chs: '高声鲶鱼',
      iconId: 29326,
    },
    '7682': {
      id: 7682,
      name_chs: '水晶刺鱼',
      iconId: 29327,
    },
    '7683': {
      id: 7683,
      name_chs: '莫尔巴',
      iconId: 29323,
    },
    '7684': {
      id: 7684,
      name_chs: '拾荒鮟鱇',
      iconId: 29070,
    },
    '7685': {
      id: 7685,
      name_chs: '金鳍蝶',
      iconId: 29068,
    },
    '7686': {
      id: 7686,
      name_chs: '巨鲨',
      iconId: 29065,
    },
    '7687': {
      id: 7687,
      name_chs: '鳞脚螺',
      iconId: 29077,
    },
    '7688': {
      id: 7688,
      name_chs: '隐沙鱼',
      iconId: 29325,
    },
    '7689': {
      id: 7689,
      name_chs: '暗骑士',
      iconId: 29318,
    },
    '7691': {
      id: 7691,
      name_chs: '剑齿鳕',
      iconId: 29066,
    },
    '7692': {
      id: 7692,
      name_chs: '梦幻虾虎',
      iconId: 29328,
    },
    '7694': {
      id: 7694,
      name_chs: '暗兵鳢',
      iconId: 29329,
    },
    '7695': {
      id: 7695,
      name_chs: '审判鳐',
      iconId: 29340,
    },
    '7696': {
      id: 7696,
      name_chs: '酿血鱼',
      iconId: 29321,
    },
    '7697': {
      id: 7697,
      name_chs: '仙后鲈',
      iconId: 29330,
    },
    '7698': {
      id: 7698,
      name_chs: '滑溜帝王',
      iconId: 29322,
    },
    '7699': {
      id: 7699,
      name_chs: '蓝寡妇',
      iconId: 29331,
    },
    '7700': {
      id: 7700,
      name_chs: '人面鲤',
      iconId: 29332,
    },
    '7701': {
      id: 7701,
      name_chs: '倔强鲫鱼',
      iconId: 29333,
    },
    '7702': {
      id: 7702,
      name_chs: '朝圣泥鱼',
      iconId: 29335,
    },
    '7703': {
      id: 7703,
      name_chs: '垂暮蝲蛄',
      iconId: 29319,
    },
    '7704': {
      id: 7704,
      name_chs: '净髓蜗牛',
      iconId: 29334,
    },
    '7705': {
      id: 7705,
      name_chs: '外科医生',
      iconId: 29336,
    },
    '7706': {
      id: 7706,
      name_chs: '泥巨蟹兵',
      iconId: 29337,
    },
    '7707': {
      id: 7707,
      name_chs: '猛犸章鱼',
      iconId: 29072,
    },
    '7708': {
      id: 7708,
      name_chs: '圣母鲤',
      iconId: 29320,
    },
    '7709': {
      id: 7709,
      name_chs: '高刺鱼',
      iconId: 29338,
    },
    '7710': {
      id: 7710,
      name_chs: '希尔德拉',
      iconId: 29074,
    },
    '7711': {
      id: 7711,
      name_chs: '铆钉牡蛎',
      iconId: 29067,
    },
    '7712': {
      id: 7712,
      name_chs: '剪刀手雅克',
      iconId: 29075,
    },
    '7713': {
      id: 7713,
      name_chs: '招雨王',
      iconId: 29076,
    },
    '7714': {
      id: 7714,
      name_chs: '铜镜',
      iconId: 29339,
    },
    '7902': {
      id: 7902,
      name_chs: '鱼大叔',
      iconId: 29373,
    },
    '7903': {
      id: 7903,
      name_chs: '陨石幸存者',
      iconId: 29086,
    },
    '7904': {
      id: 7904,
      name_chs: '圣鳟贞德',
      iconId: 29351,
    },
    '7905': {
      id: 7905,
      name_chs: '特拉玛豹鱼',
      iconId: 29358,
    },
    '7906': {
      id: 7906,
      name_chs: '断指龙虾',
      iconId: 29082,
    },
    '7907': {
      id: 7907,
      name_chs: '终结者',
      iconId: 29347,
    },
    '7908': {
      id: 7908,
      name_chs: '大蛇鳗',
      iconId: 29342,
    },
    '7909': {
      id: 7909,
      name_chs: '比阿纳可大帝',
      iconId: 29080,
    },
    '7910': {
      id: 7910,
      name_chs: '肮脏鲱',
      iconId: 29081,
    },
    '7911': {
      id: 7911,
      name_chs: '虚空之眼',
      iconId: 29363,
    },
    '7912': {
      id: 7912,
      name_chs: '妖祸鱼',
      iconId: 29360,
    },
    '7913': {
      id: 7913,
      name_chs: '浮游石',
      iconId: 29352,
    },
    '7914': {
      id: 7914,
      name_chs: '露齿鲤',
      iconId: 29343,
    },
    '7915': {
      id: 7915,
      name_chs: '金枪鲨',
      iconId: 29083,
    },
    '7916': {
      id: 7916,
      name_chs: '尼姆蠕虫',
      iconId: 29355,
    },
    '7917': {
      id: 7917,
      name_chs: '抽须王',
      iconId: 29374,
    },
    '7918': {
      id: 7918,
      name_chs: '太阳神杖',
      iconId: 29356,
    },
    '7919': {
      id: 7919,
      name_chs: '枪鼻头',
      iconId: 29611,
    },
    '7920': {
      id: 7920,
      name_chs: '雷神光',
      iconId: 29353,
    },
    '7921': {
      id: 7921,
      name_chs: '沉川鲑',
      iconId: 29341,
    },
    '7922': {
      id: 7922,
      name_chs: '刺鱼教父',
      iconId: 29357,
    },
    '7923': {
      id: 7923,
      name_chs: '芳香蝾螈',
      iconId: 29375,
    },
    '7924': {
      id: 7924,
      name_chs: '轰击泡',
      iconId: 29087,
    },
    '7925': {
      id: 7925,
      name_chs: '浓盐鲀',
      iconId: 29365,
    },
    '7926': {
      id: 7926,
      name_chs: '孤独杀手',
      iconId: 29085,
    },
    '7927': {
      id: 7927,
      name_chs: '温泉王',
      iconId: 29362,
    },
    '7928': {
      id: 7928,
      name_chs: '铁饼',
      iconId: 29349,
    },
    '7929': {
      id: 7929,
      name_chs: '铁索',
      iconId: 29350,
    },
    '7931': {
      id: 7931,
      name_chs: '魔毯',
      iconId: 29610,
    },
    '7932': {
      id: 7932,
      name_chs: '圣人标',
      iconId: 29366,
    },
    '7933': {
      id: 7933,
      name_chs: '冥河灯',
      iconId: 29372,
    },
    '7934': {
      id: 7934,
      name_chs: '绿小丑',
      iconId: 29354,
    },
    '7935': {
      id: 7935,
      name_chs: '血浴',
      iconId: 29344,
    },
    '7936': {
      id: 7936,
      name_chs: '雷皇子',
      iconId: 29367,
    },
    '7937': {
      id: 7937,
      name_chs: '吞雷鱼',
      iconId: 29368,
    },
    '7938': {
      id: 7938,
      name_chs: '沉溺射手',
      iconId: 29361,
    },
    '7939': {
      id: 7939,
      name_chs: '丽舞蟹',
      iconId: 29364,
    },
    '7940': {
      id: 7940,
      name_chs: '银镜鱼',
      iconId: 29371,
    },
    '7941': {
      id: 7941,
      name_chs: '翻舵手',
      iconId: 29084,
    },
    '7942': {
      id: 7942,
      name_chs: '千年殇',
      iconId: 29369,
    },
    '7943': {
      id: 7943,
      name_chs: '汉尼拔',
      iconId: 29345,
    },
    '7944': {
      id: 7944,
      name_chs: '黎明少女',
      iconId: 29348,
    },
    '7945': {
      id: 7945,
      name_chs: '星光鳟鱼',
      iconId: 29359,
    },
    '7946': {
      id: 7946,
      name_chs: '一家之母',
      iconId: 29370,
    },
    '7947': {
      id: 7947,
      name_chs: '影纹狗鱼',
      iconId: 29346,
    },
    '7948': {
      id: 7948,
      name_chs: '船长圣杯',
      iconId: 29079,
    },
    '7949': {
      id: 7949,
      name_chs: '奇虾',
      iconId: 29658,
    },
    '7950': {
      id: 7950,
      name_chs: '皱鳃鲨',
      iconId: 29088,
    },
    '7951': {
      id: 7951,
      name_chs: '以太虱',
      iconId: 29089,
    },
    '8752': {
      id: 8752,
      name_chs: '皇金鱼',
      iconId: 29392,
    },
    '8753': {
      id: 8753,
      name_chs: '海中老人',
      iconId: 29095,
    },
    '8755': {
      id: 8755,
      name_chs: '空棘鱼',
      iconId: 29091,
    },
    '8757': {
      id: 8757,
      name_chs: '海巫婆',
      iconId: 29093,
    },
    '8758': {
      id: 8758,
      name_chs: '炼狱火角',
      iconId: 29390,
    },
    '8759': {
      id: 8759,
      name_chs: '虚无鲈',
      iconId: 29389,
    },
    '8760': {
      id: 8760,
      name_chs: '科内利亚',
      iconId: 29377,
    },
    '8761': {
      id: 8761,
      name_chs: '忍斗鱼',
      iconId: 29378,
    },
    '8762': {
      id: 8762,
      name_chs: '加诺',
      iconId: 29386,
    },
    '8764': {
      id: 8764,
      name_chs: '海盗猎人',
      iconId: 29092,
    },
    '8765': {
      id: 8765,
      name_chs: '恩登德奇',
      iconId: 29391,
    },
    '8766': {
      id: 8766,
      name_chs: '吸血鞭',
      iconId: 29380,
    },
    '8767': {
      id: 8767,
      name_chs: '乌兹刀背鱼·天极',
      iconId: 29383,
    },
    '8769': {
      id: 8769,
      name_chs: '暗星',
      iconId: 29385,
    },
    '8770': {
      id: 8770,
      name_chs: '蓝尸',
      iconId: 29388,
    },
    '8771': {
      id: 8771,
      name_chs: '马哈尔',
      iconId: 29660,
    },
    '8773': {
      id: 8773,
      name_chs: '魔幻蘑菇蟹',
      iconId: 29387,
    },
    '8774': {
      id: 8774,
      name_chs: '大泷太郎',
      iconId: 29382,
    },
    '8776': {
      id: 8776,
      name_chs: '血红龙',
      iconId: 29379,
    },
    '12713': {
      id: 12713,
      name_chs: '碎冰鱼',
      iconId: 29809,
    },
    '12714': {
      id: 12714,
      name_chs: '白云珊瑚',
      iconId: 29062,
    },
    '12715': {
      id: 12715,
      name_chs: '冰战神',
      iconId: 29803,
    },
    '12716': {
      id: 12716,
      name_chs: '天虫',
      iconId: 29722,
    },
    '12718': {
      id: 12718,
      name_chs: '山峰蟹',
      iconId: 29808,
    },
    '12719': {
      id: 12719,
      name_chs: '利齿蛤蜊',
      iconId: 29806,
    },
    '12720': {
      id: 12720,
      name_chs: '湖胆',
      iconId: 29804,
    },
    '12721': {
      id: 12721,
      name_chs: '赤刺',
      iconId: 29405,
    },
    '12722': {
      id: 12722,
      name_chs: '蓝螯虾',
      iconId: 29404,
    },
    '12723': {
      id: 12723,
      name_chs: '星花',
      iconId: 29715,
    },
    '12724': {
      id: 12724,
      name_chs: '冰川核',
      iconId: 29706,
    },
    '12725': {
      id: 12725,
      name_chs: '魔角蜗牛',
      iconId: 29418,
    },
    '12726': {
      id: 12726,
      name_chs: '黑巫鱼',
      iconId: 29807,
    },
    '12727': {
      id: 12727,
      name_chs: '热破',
      iconId: 29810,
    },
    '12728': {
      id: 12728,
      name_chs: '麻伊博伊',
      iconId: 29399,
    },
    '12729': {
      id: 12729,
      name_chs: '三唇鲤',
      iconId: 29409,
    },
    '12730': {
      id: 12730,
      name_chs: '牛蛙',
      iconId: 29233,
    },
    '12731': {
      id: 12731,
      name_chs: '云鱼',
      iconId: 29411,
    },
    '12732': {
      id: 12732,
      name_chs: '马湖瓦伊',
      iconId: 29713,
    },
    '12733': {
      id: 12733,
      name_chs: '石蚌',
      iconId: 29413,
    },
    '12734': {
      id: 12734,
      name_chs: '飘浮蛋',
      iconId: 29723,
    },
    '12735': {
      id: 12735,
      name_chs: '白影',
      iconId: 29719,
    },
    '12736': {
      id: 12736,
      name_chs: '蓝天珊瑚',
      iconId: 29061,
    },
    '12737': {
      id: 12737,
      name_chs: '显贵樱鳟',
      iconId: 29300,
    },
    '12738': {
      id: 12738,
      name_chs: '角菊石',
      iconId: 29811,
    },
    '12739': {
      id: 12739,
      name_chs: '凸眼金鱼',
      iconId: 29408,
    },
    '12740': {
      id: 12740,
      name_chs: '草鱼',
      iconId: 29407,
    },
    '12741': {
      id: 12741,
      name_chs: '皮皮拉皮拉鱼',
      iconId: 29212,
    },
    '12742': {
      id: 12742,
      name_chs: '倒仰鲶鱼',
      iconId: 29397,
    },
    '12743': {
      id: 12743,
      name_chs: '亲吻鱼',
      iconId: 29410,
    },
    '12744': {
      id: 12744,
      name_chs: '法冠蛞蝓',
      iconId: 29714,
    },
    '12745': {
      id: 12745,
      name_chs: '熔岩鲎',
      iconId: 29860,
    },
    '12746': {
      id: 12746,
      name_chs: '风暴核',
      iconId: 29718,
    },
    '12747': {
      id: 12747,
      name_chs: '知识神杜父鱼',
      iconId: 29299,
    },
    '12748': {
      id: 12748,
      name_chs: '基迦石斑鱼',
      iconId: 29812,
    },
    '12749': {
      id: 12749,
      name_chs: '瓦努头',
      iconId: 29398,
    },
    '12750': {
      id: 12750,
      name_chs: '图丽鱼',
      iconId: 29394,
    },
    '12751': {
      id: 12751,
      name_chs: '肺鱼',
      iconId: 29400,
    },
    '12752': {
      id: 12752,
      name_chs: '虎鱼',
      iconId: 29412,
    },
    '12753': {
      id: 12753,
      name_chs: '夕月天女',
      iconId: 29716,
    },
    '12754': {
      id: 12754,
      name_chs: '花岗蟹',
      iconId: 29854,
    },
    '12755': {
      id: 12755,
      name_chs: '火妖小马',
      iconId: 29858,
    },
    '12756': {
      id: 12756,
      name_chs: '船虫',
      iconId: 29805,
    },
    '12757': {
      id: 12757,
      name_chs: '蝼蛄',
      iconId: 29801,
    },
    '12758': {
      id: 12758,
      name_chs: '莫古球球',
      iconId: 29406,
    },
    '12759': {
      id: 12759,
      name_chs: '岩浆树',
      iconId: 29060,
    },
    '12760': {
      id: 12760,
      name_chs: '云上骑士',
      iconId: 29655,
    },
    '12761': {
      id: 12761,
      name_chs: '龙堡鲈',
      iconId: 29206,
    },
    '12762': {
      id: 12762,
      name_chs: '山地鲀',
      iconId: 29276,
    },
    '12763': {
      id: 12763,
      name_chs: '求雪鱼',
      iconId: 29057,
    },
    '12764': {
      id: 12764,
      name_chs: '龙骨鱼',
      iconId: 29288,
    },
    '12765': {
      id: 12765,
      name_chs: '冰神鱼',
      iconId: 29302,
    },
    '12766': {
      id: 12766,
      name_chs: '食冰水母',
      iconId: 29656,
    },
    '12767': {
      id: 12767,
      name_chs: '多鳍鱼',
      iconId: 29402,
    },
    '12768': {
      id: 12768,
      name_chs: '白丽鱼',
      iconId: 29403,
    },
    '12769': {
      id: 12769,
      name_chs: '暗影须',
      iconId: 29265,
    },
    '12770': {
      id: 12770,
      name_chs: '哥布面具',
      iconId: 29708,
    },
    '12771': {
      id: 12771,
      name_chs: '蓝色美杜莎',
      iconId: 29711,
    },
    '12772': {
      id: 12772,
      name_chs: '鳞匠螺',
      iconId: 29857,
    },
    '12773': {
      id: 12773,
      name_chs: '黑鞭',
      iconId: 29757,
    },
    '12774': {
      id: 12774,
      name_chs: '小钝口螈',
      iconId: 29396,
    },
    '12775': {
      id: 12775,
      name_chs: '亚拉戈高位钢盔鲎',
      iconId: 29032,
    },
    '12776': {
      id: 12776,
      name_chs: '白金鱼',
      iconId: 29312,
    },
    '12777': {
      id: 12777,
      name_chs: '以太之眼',
      iconId: 29214,
    },
    '12778': {
      id: 12778,
      name_chs: '阿济兹鱼',
      iconId: 29246,
    },
    '12779': {
      id: 12779,
      name_chs: '水晶鳍',
      iconId: 29256,
    },
    '12780': {
      id: 12780,
      name_chs: '香鱼',
      iconId: 29395,
    },
    '12781': {
      id: 12781,
      name_chs: '蝴蝶鱼',
      iconId: 29401,
    },
    '12782': {
      id: 12782,
      name_chs: '百鳍',
      iconId: 29416,
    },
    '12783': {
      id: 12783,
      name_chs: '秋叶鱼',
      iconId: 29417,
    },
    '12784': {
      id: 12784,
      name_chs: '魔帆',
      iconId: 29704,
    },
    '12785': {
      id: 12785,
      name_chs: '天空清道夫',
      iconId: 29038,
    },
    '12786': {
      id: 12786,
      name_chs: '岩浆虱',
      iconId: 29856,
    },
    '12787': {
      id: 12787,
      name_chs: '陨龟',
      iconId: 29855,
    },
    '12788': {
      id: 12788,
      name_chs: '魔科学物质123',
      iconId: 29752,
    },
    '12789': {
      id: 12789,
      name_chs: '褐飞刀',
      iconId: 29232,
    },
    '12790': {
      id: 12790,
      name_chs: '学士贝',
      iconId: 29419,
    },
    '12791': {
      id: 12791,
      name_chs: '水剑鱼',
      iconId: 29274,
    },
    '12792': {
      id: 12792,
      name_chs: '西水弓鳍鱼',
      iconId: 29302,
    },
    '12793': {
      id: 12793,
      name_chs: '气球鲀',
      iconId: 29007,
    },
    '12794': {
      id: 12794,
      name_chs: '朝日天女',
      iconId: 29803,
    },
    '12795': {
      id: 12795,
      name_chs: '黄昏珊瑚',
      iconId: 29060,
    },
    '12796': {
      id: 12796,
      name_chs: '白章鱼',
      iconId: 29705,
    },
    '12797': {
      id: 12797,
      name_chs: '龙魂',
      iconId: 29053,
    },
    '12798': {
      id: 12798,
      name_chs: '龙卷鲨',
      iconId: 29011,
    },
    '12799': {
      id: 12799,
      name_chs: '高风水母',
      iconId: 29657,
    },
    '12800': {
      id: 12800,
      name_chs: '化石骨舌鱼',
      iconId: 29853,
    },
    '12801': {
      id: 12801,
      name_chs: '原型洛浦肯',
      iconId: 29753,
    },
    '12802': {
      id: 12802,
      name_chs: '凯门鳄',
      iconId: 29393,
    },
    '12803': {
      id: 12803,
      name_chs: '真光层巨骨舌鱼',
      iconId: 29224,
    },
    '12804': {
      id: 12804,
      name_chs: '青蓝之手刺鱼',
      iconId: 29260,
    },
    '12805': {
      id: 12805,
      name_chs: '高天鱼',
      iconId: 29717,
    },
    '12806': {
      id: 12806,
      name_chs: '瓦斯鲀',
      iconId: 29046,
    },
    '12807': {
      id: 12807,
      name_chs: '魔鱼',
      iconId: 29756,
    },
    '12808': {
      id: 12808,
      name_chs: '不明飞行物',
      iconId: 29031,
    },
    '12809': {
      id: 12809,
      name_chs: '温泉医生鱼',
      iconId: 29411,
    },
    '12810': {
      id: 12810,
      name_chs: '蛉蝎',
      iconId: 29721,
    },
    '12811': {
      id: 12811,
      name_chs: '攀岩鱼',
      iconId: 29252,
    },
    '12812': {
      id: 12812,
      name_chs: '鲜血跳鱼',
      iconId: 29295,
    },
    '12813': {
      id: 12813,
      name_chs: '眼镜蛇鱼',
      iconId: 29710,
    },
    '12814': {
      id: 12814,
      name_chs: '飞灵',
      iconId: 29702,
    },
    '12815': {
      id: 12815,
      name_chs: '油鳗',
      iconId: 29751,
    },
    '12816': {
      id: 12816,
      name_chs: '宝石水母',
      iconId: 29755,
    },
    '12817': {
      id: 12817,
      name_chs: '战舰鱼',
      iconId: 29802,
    },
    '12818': {
      id: 12818,
      name_chs: '星码龙虾',
      iconId: 29227,
    },
    '12819': {
      id: 12819,
      name_chs: '内陆刺鱼',
      iconId: 29304,
    },
    '12820': {
      id: 12820,
      name_chs: '熔岩鲶鱼',
      iconId: 29852,
    },
    '12821': {
      id: 12821,
      name_chs: '无齿翼龙',
      iconId: 29707,
    },
    '12822': {
      id: 12822,
      name_chs: '飞翼鲂',
      iconId: 29720,
    },
    '12823': {
      id: 12823,
      name_chs: '温泉胆',
      iconId: 29804,
    },
    '12824': {
      id: 12824,
      name_chs: '樱鳟鱼',
      iconId: 29285,
    },
    '12825': {
      id: 12825,
      name_chs: '惊龟',
      iconId: 29703,
    },
    '12826': {
      id: 12826,
      name_chs: '黑魔法鱼',
      iconId: 29851,
    },
    '12827': {
      id: 12827,
      name_chs: '桶眼鱼',
      iconId: 29754,
    },
    '12828': {
      id: 12828,
      name_chs: '落雷鳗',
      iconId: 29205,
    },
    '12829': {
      id: 12829,
      name_chs: '飞猫杀手',
      iconId: 29414,
    },
    '12830': {
      id: 12830,
      name_chs: '哲学骨舌鱼',
      iconId: 29243,
    },
    '12831': {
      id: 12831,
      name_chs: '沙利亚克鳄',
      iconId: 29415,
    },
    '12832': {
      id: 12832,
      name_chs: '熔岩王',
      iconId: 29859,
    },
    '12833': {
      id: 12833,
      name_chs: '妖精翼龙',
      iconId: 29709,
    },
    '12834': {
      id: 12834,
      name_chs: '吸血魔毯',
      iconId: 29701,
    },
    '12835': {
      id: 12835,
      name_chs: '风暴骑士',
      iconId: 29712,
    },
    '12836': {
      id: 12836,
      name_chs: '狂斗鱼',
      iconId: 29238,
    },
    '12837': {
      id: 12837,
      name_chs: '毛鳞鱼',
      iconId: 29310,
    },
    '13727': {
      id: 13727,
      name_chs: '欧洛浦肯',
      iconId: 29758,
    },
    '13728': {
      id: 13728,
      name_chs: '库尔札斯海若螺',
      iconId: 29716,
    },
    '13729': {
      id: 13729,
      name_chs: '龙堡公鱼',
      iconId: 29310,
    },
    '13730': {
      id: 13730,
      name_chs: '天空珊瑚',
      iconId: 29725,
    },
    '13731': {
      id: 13731,
      name_chs: '太阳帆',
      iconId: 29726,
    },
    '13732': {
      id: 13732,
      name_chs: '哥布林鲈',
      iconId: 29280,
    },
    '13733': {
      id: 13733,
      name_chs: '翼手龙',
      iconId: 29724,
    },
    '13734': {
      id: 13734,
      name_chs: '真鼻龙',
      iconId: 29727,
    },
    '13736': {
      id: 13736,
      name_chs: '珠宝球藻',
      iconId: 29316,
    },
    '13737': {
      id: 13737,
      name_chs: '云冠鳟',
      iconId: 29266,
    },
    '13738': {
      id: 13738,
      name_chs: '风神鱼',
      iconId: 29302,
    },
    '13739': {
      id: 13739,
      name_chs: '盗斗鱼',
      iconId: 29238,
    },
    '13740': {
      id: 13740,
      name_chs: '雕金蟹',
      iconId: 29420,
    },
    '14211': {
      id: 14211,
      name_chs: '琥珀蝾螈',
      iconId: 29424,
    },
    '14212': {
      id: 14212,
      name_chs: '沼鯥',
      iconId: 29421,
    },
    '14213': {
      id: 14213,
      name_chs: '棉云魟',
      iconId: 29728,
    },
    '14214': {
      id: 14214,
      name_chs: '夜翼鱼龙',
      iconId: 29729,
    },
    '14215': {
      id: 14215,
      name_chs: '熔岩蜗牛',
      iconId: 29423,
    },
    '14216': {
      id: 14216,
      name_chs: '祭司鱼',
      iconId: 29096,
    },
    '14217': {
      id: 14217,
      name_chs: '库尔札斯牡蛎',
      iconId: 29097,
    },
    '14218': {
      id: 14218,
      name_chs: '古象鼻鱼',
      iconId: 29613,
    },
    '14219': {
      id: 14219,
      name_chs: '妖祸克拉肯',
      iconId: 29027,
    },
    '14220': {
      id: 14220,
      name_chs: '鳞鲶',
      iconId: 29422,
    },
    '15626': {
      id: 15626,
      name_chs: '鼓钱袋',
      iconId: 29425,
    },
    '15627': {
      id: 15627,
      name_chs: '雪人杀手',
      iconId: 29813,
    },
    '15628': {
      id: 15628,
      name_chs: '拉·雷亚尔',
      iconId: 29814,
    },
    '15629': {
      id: 15629,
      name_chs: '龙鳞撕裂者',
      iconId: 29426,
    },
    '15630': {
      id: 15630,
      name_chs: '噩梦之种',
      iconId: 29427,
    },
    '15631': {
      id: 15631,
      name_chs: '巨陨龟',
      iconId: 29861,
    },
    '15632': {
      id: 15632,
      name_chs: '水瓶王',
      iconId: 29338,
    },
    '15633': {
      id: 15633,
      name_chs: '维德弗尼尔',
      iconId: 29428,
    },
    '15634': {
      id: 15634,
      name_chs: '拉塔托斯克之魂',
      iconId: 29074,
    },
    '15635': {
      id: 15635,
      name_chs: '水墨鱼',
      iconId: 29429,
    },
    '15636': {
      id: 15636,
      name_chs: '卷风鲨',
      iconId: 29065,
    },
    '15637': {
      id: 15637,
      name_chs: '进化型亚拉戈高位钢盔鲎',
      iconId: 29086,
    },
    '15638': {
      id: 15638,
      name_chs: '无光层巨骨舌鱼',
      iconId: 29430,
    },
    '16742': {
      id: 16742,
      name_chs: '双型齿翼龙',
      iconId: 29730,
    },
    '16743': {
      id: 16743,
      name_chs: '姥鲨',
      iconId: 29731,
    },
    '16744': {
      id: 16744,
      name_chs: '亚拉戈剑鲨',
      iconId: 29759,
    },
    '16745': {
      id: 16745,
      name_chs: '吞冰水母',
      iconId: 29661,
    },
    '16746': {
      id: 16746,
      name_chs: '核爆鱼',
      iconId: 29815,
    },
    '16747': {
      id: 16747,
      name_chs: '叉舌鱼',
      iconId: 29432,
    },
    '16748': {
      id: 16748,
      name_chs: '蝴蝶夫人',
      iconId: 29433,
    },
    '16749': {
      id: 16749,
      name_chs: '莫古尔古球球',
      iconId: 29434,
    },
    '16750': {
      id: 16750,
      name_chs: '卷层云魟',
      iconId: 29732,
    },
    '16751': {
      id: 16751,
      name_chs: '圣龙泪',
      iconId: 29862,
    },
    '16752': {
      id: 16752,
      name_chs: '魔科学物质666',
      iconId: 29760,
    },
    '16753': {
      id: 16753,
      name_chs: '百目螈',
      iconId: 29761,
    },
    '16754': {
      id: 16754,
      name_chs: '万事通鲈',
      iconId: 29330,
    },
    '16756': {
      id: 16756,
      name_chs: '冰之巫女',
      iconId: 29367,
    },
    '17577': {
      id: 17577,
      name_chs: '大祭司鱼',
      iconId: 29098,
    },
    '17578': {
      id: 17578,
      name_chs: '尼摩船长',
      iconId: 29816,
    },
    '17579': {
      id: 17579,
      name_chs: '猴面雀杀手',
      iconId: 29436,
    },
    '17580': {
      id: 17580,
      name_chs: '赛缇',
      iconId: 29611,
    },
    '17581': {
      id: 17581,
      name_chs: '水晶飞鸽',
      iconId: 29735,
    },
    '17582': {
      id: 17582,
      name_chs: '雷鳞蝾螈',
      iconId: 29437,
    },
    '17583': {
      id: 17583,
      name_chs: '里德尔',
      iconId: 29864,
    },
    '17584': {
      id: 17584,
      name_chs: '熔岩帝王',
      iconId: 29865,
    },
    '17585': {
      id: 17585,
      name_chs: '能言者',
      iconId: 29438,
    },
    '17586': {
      id: 17586,
      name_chs: '千鳍',
      iconId: 29439,
    },
    '17587': {
      id: 17587,
      name_chs: '风暴血骑士',
      iconId: 29736,
    },
    '17588': {
      id: 17588,
      name_chs: '莫名熔岩鱼',
      iconId: 29863,
    },
    '17589': {
      id: 17589,
      name_chs: '欧巴宾海蝎',
      iconId: 29762,
    },
    '17590': {
      id: 17590,
      name_chs: '铠鱼',
      iconId: 29435,
    },
    '17591': {
      id: 17591,
      name_chs: '云海蝴蝶螺',
      iconId: 29662,
    },
    '17592': {
      id: 17592,
      name_chs: '沙里贝涅',
      iconId: 29734,
    },
    '17593': {
      id: 17593,
      name_chs: '兰代勒翼龙',
      iconId: 29733,
    },
    '17594': {
      id: 17594,
      name_chs: '蓓天翼龙',
      iconId: 29729,
    },
    '20018': {
      id: 20018,
      name_chs: '鳍龙',
      iconId: 29115,
    },
    '20019': {
      id: 20019,
      name_chs: '阿拉米格缎带鱼',
      iconId: 29103,
    },
    '20020': {
      id: 20020,
      name_chs: '延夏红眼鲈',
      iconId: 29445,
    },
    '20021': {
      id: 20021,
      name_chs: '天女鱼',
      iconId: 29446,
    },
    '20022': {
      id: 20022,
      name_chs: '扇贝海蛇',
      iconId: 29128,
    },
    '20023': {
      id: 20023,
      name_chs: '红翅鱼',
      iconId: 29485,
    },
    '20024': {
      id: 20024,
      name_chs: '汗鱼',
      iconId: 29447,
    },
    '20025': {
      id: 20025,
      name_chs: '岩盐咸鱼',
      iconId: 29901,
    },
    '20026': {
      id: 20026,
      name_chs: '彗星鲦',
      iconId: 29453,
    },
    '20027': {
      id: 20027,
      name_chs: '无二草鱼',
      iconId: 29454,
    },
    '20028': {
      id: 20028,
      name_chs: '武士鱼',
      iconId: 29461,
    },
    '20029': {
      id: 20029,
      name_chs: '金丽鱼',
      iconId: 29463,
    },
    '20030': {
      id: 20030,
      name_chs: '哈克苦鱼',
      iconId: 29464,
    },
    '20031': {
      id: 20031,
      name_chs: '亚特虾虎',
      iconId: 29472,
    },
    '20032': {
      id: 20032,
      name_chs: '白姑鱼',
      iconId: 29474,
    },
    '20033': {
      id: 20033,
      name_chs: '谷爬鱼',
      iconId: 29479,
    },
    '20034': {
      id: 20034,
      name_chs: '大天竺鱼',
      iconId: 29121,
    },
    '20035': {
      id: 20035,
      name_chs: '白马',
      iconId: 29906,
    },
    '20036': {
      id: 20036,
      name_chs: '青鳉',
      iconId: 29483,
    },
    '20037': {
      id: 20037,
      name_chs: '黑斑花蛇鳗',
      iconId: 29126,
    },
    '20038': {
      id: 20038,
      name_chs: '赤点石斑鱼',
      iconId: 29133,
    },
    '20039': {
      id: 20039,
      name_chs: '盐盾',
      iconId: 29909,
    },
    '20040': {
      id: 20040,
      name_chs: '雕塑家',
      iconId: 29922,
    },
    '20041': {
      id: 20041,
      name_chs: '珍珠眼',
      iconId: 29923,
    },
    '20042': {
      id: 20042,
      name_chs: '阿巴拉提亚苦鱼',
      iconId: 29465,
    },
    '20043': {
      id: 20043,
      name_chs: '白钢鲨',
      iconId: 29466,
    },
    '20044': {
      id: 20044,
      name_chs: '塔奥苦鱼',
      iconId: 29468,
    },
    '20045': {
      id: 20045,
      name_chs: '暗缟虾虎',
      iconId: 29492,
    },
    '20046': {
      id: 20046,
      name_chs: '河红眼鲈',
      iconId: 29495,
    },
    '20047': {
      id: 20047,
      name_chs: '幻象鲢鱼',
      iconId: 29496,
    },
    '20048': {
      id: 20048,
      name_chs: '迎春鱼',
      iconId: 29139,
    },
    '20049': {
      id: 20049,
      name_chs: '头铁鳟',
      iconId: 29497,
    },
    '20050': {
      id: 20050,
      name_chs: '石楠嘉鱼',
      iconId: 29498,
    },
    '20051': {
      id: 20051,
      name_chs: '绢鲤',
      iconId: 29455,
    },
    '20052': {
      id: 20052,
      name_chs: '黄彩鱼',
      iconId: 29458,
    },
    '20053': {
      id: 20053,
      name_chs: '青彩鱼',
      iconId: 29459,
    },
    '20054': {
      id: 20054,
      name_chs: '花海马',
      iconId: 29123,
    },
    '20055': {
      id: 20055,
      name_chs: '破损蟹',
      iconId: 29235,
    },
    '20056': {
      id: 20056,
      name_chs: '基拉巴尼亚鳟',
      iconId: 29204,
    },
    '20057': {
      id: 20057,
      name_chs: '唾血龙虾',
      iconId: 29292,
    },
    '20058': {
      id: 20058,
      name_chs: '缪恩鱼',
      iconId: 29212,
    },
    '20059': {
      id: 20059,
      name_chs: '武斗鱼',
      iconId: 29216,
    },
    '20060': {
      id: 20060,
      name_chs: '电鲶鱼',
      iconId: 29249,
    },
    '20061': {
      id: 20061,
      name_chs: '非信仰巨骨舌鱼',
      iconId: 29224,
    },
    '20062': {
      id: 20062,
      name_chs: '寺院鲫鱼',
      iconId: 29286,
    },
    '20063': {
      id: 20063,
      name_chs: '银币鱼',
      iconId: 29312,
    },
    '20064': {
      id: 20064,
      name_chs: '气球蛙',
      iconId: 29233,
    },
    '20065': {
      id: 20065,
      name_chs: '灯笼球藻',
      iconId: 29316,
    },
    '20066': {
      id: 20066,
      name_chs: '死亡鳅',
      iconId: 29215,
    },
    '20067': {
      id: 20067,
      name_chs: '夫蟹',
      iconId: 29294,
    },
    '20068': {
      id: 20068,
      name_chs: '妇虾',
      iconId: 29404,
    },
    '20069': {
      id: 20069,
      name_chs: '素面蝲蛄',
      iconId: 29209,
    },
    '20070': {
      id: 20070,
      name_chs: '逆流鱼',
      iconId: 29270,
    },
    '20071': {
      id: 20071,
      name_chs: '阿巴拉提亚蝾螈',
      iconId: 29424,
    },
    '20072': {
      id: 20072,
      name_chs: '精金多鳍鱼',
      iconId: 29402,
    },
    '20073': {
      id: 20073,
      name_chs: '冥想鱼',
      iconId: 29400,
    },
    '20074': {
      id: 20074,
      name_chs: '裁定鱼',
      iconId: 29287,
    },
    '20075': {
      id: 20075,
      name_chs: '高山骨舌鱼',
      iconId: 29243,
    },
    '20076': {
      id: 20076,
      name_chs: '猛牛口食',
      iconId: 29303,
    },
    '20077': {
      id: 20077,
      name_chs: '窥视鱼',
      iconId: 29301,
    },
    '20078': {
      id: 20078,
      name_chs: '弯刀鱼',
      iconId: 29278,
    },
    '20079': {
      id: 20079,
      name_chs: '基迦鲈',
      iconId: 29268,
    },
    '20080': {
      id: 20080,
      name_chs: '月神恩惠',
      iconId: 29206,
    },
    '20081': {
      id: 20081,
      name_chs: '洞穴鳉',
      iconId: 29246,
    },
    '20082': {
      id: 20082,
      name_chs: '溶骨蜗牛',
      iconId: 29289,
    },
    '20083': {
      id: 20083,
      name_chs: '落叶鱼',
      iconId: 29417,
    },
    '20084': {
      id: 20084,
      name_chs: '小流星',
      iconId: 29718,
    },
    '20085': {
      id: 20085,
      name_chs: '倾仰鲶鱼',
      iconId: 29397,
    },
    '20086': {
      id: 20086,
      name_chs: '涅槃蟹',
      iconId: 29293,
    },
    '20087': {
      id: 20087,
      name_chs: '威罗迪纳草鱼',
      iconId: 29407,
    },
    '20088': {
      id: 20088,
      name_chs: '威罗迪纳黑鲤',
      iconId: 29210,
    },
    '20089': {
      id: 20089,
      name_chs: '拉尔戈落雷',
      iconId: 29205,
    },
    '20090': {
      id: 20090,
      name_chs: '高地刺鱼',
      iconId: 29260,
    },
    '20091': {
      id: 20091,
      name_chs: '砂砾鱼',
      iconId: 29251,
    },
    '20092': {
      id: 20092,
      name_chs: '鳀鱼',
      iconId: 29034,
    },
    '20093': {
      id: 20093,
      name_chs: '琉璃鲱',
      iconId: 29044,
    },
    '20094': {
      id: 20094,
      name_chs: '地狱水母',
      iconId: 29005,
    },
    '20095': {
      id: 20095,
      name_chs: '红玉珊瑚',
      iconId: 29060,
    },
    '20096': {
      id: 20096,
      name_chs: '苍玉珊瑚',
      iconId: 29061,
    },
    '20097': {
      id: 20097,
      name_chs: '白骨珊瑚',
      iconId: 29062,
    },
    '20098': {
      id: 20098,
      name_chs: '东洲蝴蝶鱼',
      iconId: 29016,
    },
    '20099': {
      id: 20099,
      name_chs: '鱼大夫',
      iconId: 29021,
    },
    '20100': {
      id: 20100,
      name_chs: '剑旗鱼',
      iconId: 29022,
    },
    '20101': {
      id: 20101,
      name_chs: '木叶龙',
      iconId: 29053,
    },
    '20102': {
      id: 20102,
      name_chs: '琉璃鲽鱼',
      iconId: 29052,
    },
    '20103': {
      id: 20103,
      name_chs: '绝鬼鳄',
      iconId: 29024,
    },
    '20104': {
      id: 20104,
      name_chs: '大王乌贼',
      iconId: 29027,
    },
    '20105': {
      id: 20105,
      name_chs: '毯子章鱼',
      iconId: 29023,
    },
    '20106': {
      id: 20106,
      name_chs: '滑翔鱼',
      iconId: 29042,
    },
    '20107': {
      id: 20107,
      name_chs: '刺鲀',
      iconId: 29046,
    },
    '20108': {
      id: 20108,
      name_chs: '圆扇贝',
      iconId: 29047,
    },
    '20109': {
      id: 20109,
      name_chs: '石头鱼',
      iconId: 29019,
    },
    '20110': {
      id: 20110,
      name_chs: '琉璃金枪鱼',
      iconId: 29018,
    },
    '20111': {
      id: 20111,
      name_chs: '多玛蝲蛄',
      iconId: 29208,
    },
    '20112': {
      id: 20112,
      name_chs: '红玉虾',
      iconId: 29008,
    },
    '20113': {
      id: 20113,
      name_chs: '虎纹河豚',
      iconId: 29007,
    },
    '20114': {
      id: 20114,
      name_chs: '雷遁鱼',
      iconId: 29302,
    },
    '20115': {
      id: 20115,
      name_chs: '白纸鱼',
      iconId: 29403,
    },
    '20116': {
      id: 20116,
      name_chs: '龙鱼',
      iconId: 29243,
    },
    '20117': {
      id: 20117,
      name_chs: '王室鲑',
      iconId: 29282,
    },
    '20118': {
      id: 20118,
      name_chs: '延夏鲤',
      iconId: 29239,
    },
    '20119': {
      id: 20119,
      name_chs: '东洲巨骨舌鱼',
      iconId: 29224,
    },
    '20120': {
      id: 20120,
      name_chs: '长须鲶鱼',
      iconId: 29422,
    },
    '20121': {
      id: 20121,
      name_chs: '赏梅鱼',
      iconId: 29401,
    },
    '20122': {
      id: 20122,
      name_chs: '熊猫蝶尾鱼',
      iconId: 29408,
    },
    '20123': {
      id: 20123,
      name_chs: '多玛鳟',
      iconId: 29240,
    },
    '20124': {
      id: 20124,
      name_chs: '多玛鳗',
      iconId: 29257,
    },
    '20125': {
      id: 20125,
      name_chs: '黄铜鱼',
      iconId: 29314,
    },
    '20126': {
      id: 20126,
      name_chs: '东洲鳟',
      iconId: 29245,
    },
    '20127': {
      id: 20127,
      name_chs: '嘎牙子',
      iconId: 29310,
    },
    '20128': {
      id: 20128,
      name_chs: '草跳鱼',
      iconId: 29306,
    },
    '20129': {
      id: 20129,
      name_chs: '枯草跳鱼',
      iconId: 29295,
    },
    '20130': {
      id: 20130,
      name_chs: '太阳鲈',
      iconId: 29305,
    },
    '20131': {
      id: 20131,
      name_chs: '青空泪',
      iconId: 29247,
    },
    '20132': {
      id: 20132,
      name_chs: '晨曦蝲蛄',
      iconId: 29207,
    },
    '20133': {
      id: 20133,
      name_chs: '暮晖蝲蛄',
      iconId: 29209,
    },
    '20134': {
      id: 20134,
      name_chs: '弓鱼',
      iconId: 29272,
    },
    '20135': {
      id: 20135,
      name_chs: '翡翠河鹿鱼',
      iconId: 29299,
    },
    '20136': {
      id: 20136,
      name_chs: '角尊鳅',
      iconId: 29488,
    },
    '20137': {
      id: 20137,
      name_chs: '野鲤',
      iconId: 29457,
    },
    '20138': {
      id: 20138,
      name_chs: '天幕鱼',
      iconId: 29237,
    },
    '20140': {
      id: 20140,
      name_chs: '硬鳞鱼',
      iconId: 29267,
    },
    '20141': {
      id: 20141,
      name_chs: '东方刺鱼',
      iconId: 29414,
    },
    '20142': {
      id: 20142,
      name_chs: '幽灵鱼',
      iconId: 29256,
    },
    '20143': {
      id: 20143,
      name_chs: '小珀琉喀斯',
      iconId: 29147,
    },
    '20144': {
      id: 20144,
      name_chs: '旋螺',
      iconId: 29108,
    },
    '20145': {
      id: 20145,
      name_chs: '黑箱鲀',
      iconId: 29118,
    },
    '20146': {
      id: 20146,
      name_chs: '飞鳐',
      iconId: 29130,
    },
    '20147': {
      id: 20147,
      name_chs: '王鱼',
      iconId: 29125,
    },
    '20148': {
      id: 20148,
      name_chs: '雪花蛇鳝',
      iconId: 29127,
    },
    '20149': {
      id: 20149,
      name_chs: '跳虾虎',
      iconId: 29473,
    },
    '20150': {
      id: 20150,
      name_chs: '光鳞鱼',
      iconId: 29511,
    },
    '20151': {
      id: 20151,
      name_chs: '星点东方鲀',
      iconId: 29504,
    },
    '20152': {
      id: 20152,
      name_chs: '花鳗鲡',
      iconId: 29507,
    },
    '20153': {
      id: 20153,
      name_chs: '寄居虫',
      iconId: 29442,
    },
    '20154': {
      id: 20154,
      name_chs: '高脚蟹',
      iconId: 29111,
    },
    '20155': {
      id: 20155,
      name_chs: '海天狗',
      iconId: 29099,
    },
    '20156': {
      id: 20156,
      name_chs: '黑头巾',
      iconId: 29105,
    },
    '20157': {
      id: 20157,
      name_chs: '虎斑鲨',
      iconId: 29122,
    },
    '20158': {
      id: 20158,
      name_chs: '骨螺',
      iconId: 29107,
    },
    '20159': {
      id: 20159,
      name_chs: '渔鱼',
      iconId: 29505,
    },
    '20160': {
      id: 20160,
      name_chs: '奥萨德螺',
      iconId: 29490,
    },
    '20161': {
      id: 20161,
      name_chs: '无须鱼',
      iconId: 29460,
    },
    '20162': {
      id: 20162,
      name_chs: '烛光鱼',
      iconId: 29104,
    },
    '20163': {
      id: 20163,
      name_chs: '丝鲹',
      iconId: 29124,
    },
    '20164': {
      id: 20164,
      name_chs: '狆鳗',
      iconId: 29131,
    },
    '20165': {
      id: 20165,
      name_chs: '海参',
      iconId: 29113,
    },
    '20166': {
      id: 20166,
      name_chs: '鞍带石斑鱼',
      iconId: 29102,
    },
    '20167': {
      id: 20167,
      name_chs: '毒鲉',
      iconId: 29100,
    },
    '20168': {
      id: 20168,
      name_chs: '赤备',
      iconId: 29508,
    },
    '20169': {
      id: 20169,
      name_chs: '黑鲢',
      iconId: 29475,
    },
    '20170': {
      id: 20170,
      name_chs: '古钱贝',
      iconId: 29503,
    },
    '20171': {
      id: 20171,
      name_chs: '食死鱼',
      iconId: 29142,
    },
    '20172': {
      id: 20172,
      name_chs: '浪人鲹',
      iconId: 29114,
    },
    '20173': {
      id: 20173,
      name_chs: '褐石斑鱼',
      iconId: 29134,
    },
    '20174': {
      id: 20174,
      name_chs: '蝾螺',
      iconId: 29112,
    },
    '20175': {
      id: 20175,
      name_chs: '红玉海星',
      iconId: 29109,
    },
    '20176': {
      id: 20176,
      name_chs: '藻屑蟹',
      iconId: 29441,
    },
    '20177': {
      id: 20177,
      name_chs: '泥仙人',
      iconId: 29493,
    },
    '20178': {
      id: 20178,
      name_chs: '修仙空棘鱼',
      iconId: 29489,
    },
    '20179': {
      id: 20179,
      name_chs: '白乌贼',
      iconId: 29132,
    },
    '20180': {
      id: 20180,
      name_chs: '类鲹',
      iconId: 29135,
    },
    '20181': {
      id: 20181,
      name_chs: '楚蟹',
      iconId: 29110,
    },
    '20182': {
      id: 20182,
      name_chs: '红眼鲈',
      iconId: 29117,
    },
    '20183': {
      id: 20183,
      name_chs: '斜方鱊',
      iconId: 29467,
    },
    '20184': {
      id: 20184,
      name_chs: '半寿鱼',
      iconId: 29449,
    },
    '20185': {
      id: 20185,
      name_chs: '蛇头鱼',
      iconId: 29482,
    },
    '20186': {
      id: 20186,
      name_chs: '红衣',
      iconId: 29119,
    },
    '20187': {
      id: 20187,
      name_chs: '斑节虾',
      iconId: 29145,
    },
    '20188': {
      id: 20188,
      name_chs: '天狗团扇',
      iconId: 29480,
    },
    '20189': {
      id: 20189,
      name_chs: '星轮螺',
      iconId: 29491,
    },
    '20190': {
      id: 20190,
      name_chs: '青鱼',
      iconId: 29456,
    },
    '20191': {
      id: 20191,
      name_chs: '菜蛙',
      iconId: 29443,
    },
    '20192': {
      id: 20192,
      name_chs: '斩马鱼',
      iconId: 29514,
    },
    '20193': {
      id: 20193,
      name_chs: '红鳍',
      iconId: 29450,
    },
    '20194': {
      id: 20194,
      name_chs: '月轮',
      iconId: 29908,
    },
    '20195': {
      id: 20195,
      name_chs: '白骨舌鱼',
      iconId: 29903,
    },
    '20196': {
      id: 20196,
      name_chs: '盐鲨',
      iconId: 29918,
    },
    '20197': {
      id: 20197,
      name_chs: '皇家披风',
      iconId: 29910,
    },
    '20198': {
      id: 20198,
      name_chs: '矶灯笼',
      iconId: 29137,
    },
    '20199': {
      id: 20199,
      name_chs: '黄尾鰤',
      iconId: 29140,
    },
    '20200': {
      id: 20200,
      name_chs: '樱鲑',
      iconId: 29499,
    },
    '20201': {
      id: 20201,
      name_chs: '温泉花蟹',
      iconId: 29481,
    },
    '20202': {
      id: 20202,
      name_chs: '朵塔儿鮈',
      iconId: 29506,
    },
    '20203': {
      id: 20203,
      name_chs: '河蚬',
      iconId: 29510,
    },
    '20204': {
      id: 20204,
      name_chs: '草鲨',
      iconId: 29477,
    },
    '20205': {
      id: 20205,
      name_chs: '台风虾',
      iconId: 29924,
    },
    '20206': {
      id: 20206,
      name_chs: '岩牡蛎',
      iconId: 29916,
    },
    '20207': {
      id: 20207,
      name_chs: '盐湖胆',
      iconId: 29925,
    },
    '20208': {
      id: 20208,
      name_chs: '刻木蟹',
      iconId: 29907,
    },
    '20209': {
      id: 20209,
      name_chs: '刺足龙虾',
      iconId: 29138,
    },
    '20210': {
      id: 20210,
      name_chs: '箕作鲨',
      iconId: 29146,
    },
    '20211': {
      id: 20211,
      name_chs: '多玛金鱼',
      iconId: 29509,
    },
    '20212': {
      id: 20212,
      name_chs: '逆龙',
      iconId: 29513,
    },
    '20213': {
      id: 20213,
      name_chs: '太阳神使者',
      iconId: 29500,
    },
    '20214': {
      id: 20214,
      name_chs: '盐螺',
      iconId: 29902,
    },
    '20215': {
      id: 20215,
      name_chs: '白鲸',
      iconId: 29913,
    },
    '20216': {
      id: 20216,
      name_chs: '巨型税官',
      iconId: 29812,
    },
    '20217': {
      id: 20217,
      name_chs: '圆翅燕鱼',
      iconId: 29106,
    },
    '20218': {
      id: 20218,
      name_chs: '河鲷',
      iconId: 29470,
    },
    '20219': {
      id: 20219,
      name_chs: '绳鱼',
      iconId: 29502,
    },
    '20220': {
      id: 20220,
      name_chs: '飞天鱼',
      iconId: 29448,
    },
    '20221': {
      id: 20221,
      name_chs: '月神使者',
      iconId: 29501,
    },
    '20222': {
      id: 20222,
      name_chs: '瞪亲刺鱼',
      iconId: 29476,
    },
    '20223': {
      id: 20223,
      name_chs: '阿巴拉提亚皮皮拉鱼',
      iconId: 29905,
    },
    '20224': {
      id: 20224,
      name_chs: '白钢泥鳅',
      iconId: 29919,
    },
    '20225': {
      id: 20225,
      name_chs: '象牙鳎',
      iconId: 29921,
    },
    '20226': {
      id: 20226,
      name_chs: '条石鲷',
      iconId: 29120,
    },
    '20227': {
      id: 20227,
      name_chs: '千牙龙',
      iconId: 29116,
    },
    '20228': {
      id: 20228,
      name_chs: '鱼龙',
      iconId: 29478,
    },
    '20229': {
      id: 20229,
      name_chs: '八角鱼',
      iconId: 29494,
    },
    '20230': {
      id: 20230,
      name_chs: '方士鱼',
      iconId: 29486,
    },
    '20231': {
      id: 20231,
      name_chs: '焰鱼',
      iconId: 29462,
    },
    '20232': {
      id: 20232,
      name_chs: '不忠蛇',
      iconId: 29129,
    },
    '20233': {
      id: 20233,
      name_chs: '永恒眼',
      iconId: 29469,
    },
    '20234': {
      id: 20234,
      name_chs: '名马魂',
      iconId: 29484,
    },
    '20235': {
      id: 20235,
      name_chs: '泛洪金枪鱼',
      iconId: 29920,
    },
    '20236': {
      id: 20236,
      name_chs: '佣兵蟹',
      iconId: 29911,
    },
    '20237': {
      id: 20237,
      name_chs: '不死鱼',
      iconId: 29915,
    },
    '20238': {
      id: 20238,
      name_chs: '丝绸翻车鱼',
      iconId: 29912,
    },
    '20239': {
      id: 20239,
      name_chs: '沧龙',
      iconId: 29904,
    },
    '21174': {
      id: 21174,
      name_chs: '枢机鱼',
      iconId: 29515,
    },
    '21175': {
      id: 21175,
      name_chs: '岩石鱼',
      iconId: 29516,
    },
    '21176': {
      id: 21176,
      name_chs: '浮木鱼',
      iconId: 29150,
    },
    '21177': {
      id: 21177,
      name_chs: '紫彩鱼',
      iconId: 29517,
    },
    '21178': {
      id: 21178,
      name_chs: '虹鳉',
      iconId: 29444,
    },
    '21179': {
      id: 21179,
      name_chs: '一文字',
      iconId: 29151,
    },
    '21180': {
      id: 21180,
      name_chs: '滑溜狮子鱼',
      iconId: 29136,
    },
    '22389': {
      id: 22389,
      name_chs: '幻河鲯',
      iconId: 29518,
    },
    '22390': {
      id: 22390,
      name_chs: '仿麻鱼',
      iconId: 29152,
    },
    '22391': {
      id: 22391,
      name_chs: '鳄龟',
      iconId: 29519,
    },
    '22392': {
      id: 22392,
      name_chs: '红尾鲶',
      iconId: 29520,
    },
    '22393': {
      id: 22393,
      name_chs: '薄毯章鱼',
      iconId: 29153,
    },
    '22394': {
      id: 22394,
      name_chs: '盐磨鲨',
      iconId: 29917,
    },
    '22395': {
      id: 22395,
      name_chs: '盆栽鱼',
      iconId: 29440,
    },
    '22396': {
      id: 22396,
      name_chs: '花须鯙',
      iconId: 29143,
    },
    '22397': {
      id: 22397,
      name_chs: '红彩鱼',
      iconId: 29521,
    },
    '22398': {
      id: 22398,
      name_chs: '河中长老',
      iconId: 29451,
    },
    '23054': {
      id: 23054,
      name_chs: '尖叫者',
      iconId: 29154,
    },
    '23055': {
      id: 23055,
      name_chs: '白彩鱼',
      iconId: 29407,
    },
    '23056': {
      id: 23056,
      name_chs: '橙彩鱼',
      iconId: 29522,
    },
    '23057': {
      id: 23057,
      name_chs: '吞钩苦鱼',
      iconId: 29523,
    },
    '23058': {
      id: 23058,
      name_chs: '蓝宝石扇鳉',
      iconId: 29524,
    },
    '23059': {
      id: 23059,
      name_chs: '教皇鱼',
      iconId: 29525,
    },
    '23060': {
      id: 23060,
      name_chs: '怨妇虾',
      iconId: 29526,
    },
    '23061': {
      id: 23061,
      name_chs: '不定鱼',
      iconId: 29360,
    },
    '23062': {
      id: 23062,
      name_chs: '钻石眼',
      iconId: 29926,
    },
    '23063': {
      id: 23063,
      name_chs: '花海龙',
      iconId: 29155,
    },
    '23064': {
      id: 23064,
      name_chs: '赌命河豚',
      iconId: 29156,
    },
    '23065': {
      id: 23065,
      name_chs: '春不知',
      iconId: 29157,
    },
    '23066': {
      id: 23066,
      name_chs: '速疾鬼鳄',
      iconId: 29158,
    },
    '23067': {
      id: 23067,
      name_chs: '卜传',
      iconId: 29527,
    },
    '23068': {
      id: 23068,
      name_chs: '天女鲤',
      iconId: 29528,
    },
    '23069': {
      id: 23069,
      name_chs: '神谕苦鱼',
      iconId: 29529,
    },
    '23070': {
      id: 23070,
      name_chs: '亚特可汗',
      iconId: 29530,
    },
    '24203': {
      id: 24203,
      name_chs: '蓝彩鱼',
      iconId: 29531,
    },
    '24204': {
      id: 24204,
      name_chs: '绿彩鱼',
      iconId: 29532,
    },
    '24205': {
      id: 24205,
      name_chs: '拉尔戈鲶鱼',
      iconId: 29533,
    },
    '24206': {
      id: 24206,
      name_chs: '红尾僵尸鱼',
      iconId: 29534,
    },
    '24207': {
      id: 24207,
      name_chs: '硬头鳟',
      iconId: 29535,
    },
    '24208': {
      id: 24208,
      name_chs: '下游鱼',
      iconId: 29536,
    },
    '24209': {
      id: 24209,
      name_chs: '骸鲢鱼',
      iconId: 29537,
    },
    '24210': {
      id: 24210,
      name_chs: '最后一滴泪',
      iconId: 29437,
    },
    '24211': {
      id: 24211,
      name_chs: '黑蒙鱼',
      iconId: 29538,
    },
    '24212': {
      id: 24212,
      name_chs: '解脱鱼',
      iconId: 29539,
    },
    '24213': {
      id: 24213,
      name_chs: '公主青鳉',
      iconId: 29540,
    },
    '24214': {
      id: 24214,
      name_chs: '苦尔鳗',
      iconId: 29159,
    },
    '24215': {
      id: 24215,
      name_chs: '大海蛇',
      iconId: 29160,
    },
    '24216': {
      id: 24216,
      name_chs: '羽衣美人',
      iconId: 29541,
    },
    '24217': {
      id: 24217,
      name_chs: '暮辉鱼',
      iconId: 29542,
    },
    '24218': {
      id: 24218,
      name_chs: '刀片跳鱼',
      iconId: 29543,
    },
    '24881': {
      id: 24881,
      name_chs: '阿拉米格面纱鱼',
      iconId: 29161,
    },
    '24882': {
      id: 24882,
      name_chs: '菜食王',
      iconId: 29162,
    },
    '24883': {
      id: 24883,
      name_chs: '七星',
      iconId: 29163,
    },
    '24884': {
      id: 24884,
      name_chs: '万刺鲀',
      iconId: 29087,
    },
    '24885': {
      id: 24885,
      name_chs: '石榴海',
      iconId: 29348,
    },
    '24886': {
      id: 24886,
      name_chs: '鬼视',
      iconId: 29544,
    },
    '24887': {
      id: 24887,
      name_chs: '仙寿翁',
      iconId: 29545,
    },
    '24888': {
      id: 24888,
      name_chs: '水天一碧',
      iconId: 29331,
    },
    '24889': {
      id: 24889,
      name_chs: '车轴鱼',
      iconId: 29546,
    },
    '24890': {
      id: 24890,
      name_chs: '一束彩虹',
      iconId: 29355,
    },
    '24891': {
      id: 24891,
      name_chs: '月神的爱宠',
      iconId: 29318,
    },
    '24892': {
      id: 24892,
      name_chs: '菜叶跳鱼',
      iconId: 29547,
    },
    '24893': {
      id: 24893,
      name_chs: '晨曦旗鱼',
      iconId: 29377,
    },
    '24990': {
      id: 24990,
      name_chs: '异刺鲨',
      iconId: 29548,
    },
    '24991': {
      id: 24991,
      name_chs: '镰甲鱼',
      iconId: 29549,
    },
    '24992': {
      id: 24992,
      name_chs: '胸脊鲨',
      iconId: 29927,
    },
    '24993': {
      id: 24993,
      name_chs: '红龙',
      iconId: 29164,
    },
    '24994': {
      id: 24994,
      name_chs: '七彩天主',
      iconId: 29550,
    },
    '24995': {
      id: 24995,
      name_chs: '众神之爱',
      iconId: 29551,
    },
    '27410': {
      id: 27410,
      name_chs: '水晶都脂鲤',
      iconId: 29552,
    },
    '27411': {
      id: 27411,
      name_chs: '拉克汕鲤',
      iconId: 28455,
    },
    '27412': {
      id: 27412,
      name_chs: '蓝色公主海星',
      iconId: 29553,
    },
    '27413': {
      id: 27413,
      name_chs: '外套蜗牛',
      iconId: 29554,
    },
    '27414': {
      id: 27414,
      name_chs: '爱人之花',
      iconId: 29555,
    },
    '27415': {
      id: 27415,
      name_chs: '吐罪鱼',
      iconId: 29556,
    },
    '27416': {
      id: 27416,
      name_chs: '徘徊鲶鱼',
      iconId: 29557,
    },
    '27417': {
      id: 27417,
      name_chs: '水晶刀鱼',
      iconId: 29278,
    },
    '27418': {
      id: 27418,
      name_chs: '骸骨鱼',
      iconId: 29558,
    },
    '27419': {
      id: 27419,
      name_chs: '乳白珊瑚',
      iconId: 29062,
    },
    '27420': {
      id: 27420,
      name_chs: '砂砾贝',
      iconId: 29413,
    },
    '27421': {
      id: 27421,
      name_chs: '赤色海蜘蛛',
      iconId: 29165,
    },
    '27422': {
      id: 27422,
      name_chs: '骨鳀鱼',
      iconId: 29166,
    },
    '27423': {
      id: 27423,
      name_chs: '游末邦蝴蝶鱼',
      iconId: 29167,
    },
    '27424': {
      id: 27424,
      name_chs: '红锤头鲨',
      iconId: 29168,
    },
    '27425': {
      id: 27425,
      name_chs: '硬糖藻',
      iconId: 29316,
    },
    '27426': {
      id: 27426,
      name_chs: '水球鱼',
      iconId: 29559,
    },
    '27427': {
      id: 27427,
      name_chs: '紫角蜗牛',
      iconId: 29560,
    },
    '27428': {
      id: 27428,
      name_chs: '净碟鱼',
      iconId: 29702,
    },
    '27429': {
      id: 27429,
      name_chs: '兔跳鱼',
      iconId: 29561,
    },
    '27430': {
      id: 27430,
      name_chs: '黄体鲈',
      iconId: 29562,
    },
    '27431': {
      id: 27431,
      name_chs: '白化鳄',
      iconId: 29563,
    },
    '27432': {
      id: 27432,
      name_chs: '白金虹鳉',
      iconId: 29564,
    },
    '27433': {
      id: 27433,
      name_chs: '雾鳉',
      iconId: 29565,
    },
    '27434': {
      id: 27434,
      name_chs: '白色石软蟹',
      iconId: 29566,
    },
    '27435': {
      id: 27435,
      name_chs: '蛇斑盘丽鱼',
      iconId: 29567,
    },
    '27436': {
      id: 27436,
      name_chs: '白化雀鳝',
      iconId: 29568,
    },
    '27437': {
      id: 27437,
      name_chs: '贤岛巨鱼',
      iconId: 29569,
    },
    '27438': {
      id: 27438,
      name_chs: '食骨虾',
      iconId: 29209,
    },
    '27439': {
      id: 27439,
      name_chs: '太妃蜗牛',
      iconId: 29244,
    },
    '27440': {
      id: 27440,
      name_chs: '沃茨鳟',
      iconId: 29245,
    },
    '27441': {
      id: 27441,
      name_chs: '哲罗鱼',
      iconId: 29570,
    },
    '27442': {
      id: 27442,
      name_chs: '斧鱼',
      iconId: 29571,
    },
    '27443': {
      id: 27443,
      name_chs: '贵族圆扇鱼',
      iconId: 29572,
    },
    '27444': {
      id: 27444,
      name_chs: '斑纹鲶',
      iconId: 29573,
    },
    '27445': {
      id: 27445,
      name_chs: '深褐鳎',
      iconId: 29574,
    },
    '27446': {
      id: 27446,
      name_chs: '碎贝海带',
      iconId: 29169,
    },
    '27447': {
      id: 27447,
      name_chs: '血色气球鱼',
      iconId: 29170,
    },
    '27448': {
      id: 27448,
      name_chs: '珂露西亚鲽鱼',
      iconId: 29052,
    },
    '27449': {
      id: 27449,
      name_chs: '南珂露西亚鳕鱼',
      iconId: 29012,
    },
    '27450': {
      id: 27450,
      name_chs: '剃刀鱼',
      iconId: 29171,
    },
    '27451': {
      id: 27451,
      name_chs: '蔷薇虾',
      iconId: 29008,
    },
    '27452': {
      id: 27452,
      name_chs: '变形鱼',
      iconId: 29172,
    },
    '27453': {
      id: 27453,
      name_chs: '艺术鱼',
      iconId: 29173,
    },
    '27454': {
      id: 27454,
      name_chs: '珂露西亚隆头鱼',
      iconId: 29174,
    },
    '27455': {
      id: 27455,
      name_chs: '枯叶海龙',
      iconId: 29175,
    },
    '27456': {
      id: 27456,
      name_chs: '剑齿龙鳖',
      iconId: 29176,
    },
    '27457': {
      id: 27457,
      name_chs: '尖枪乌贼',
      iconId: 29177,
    },
    '27458': {
      id: 27458,
      name_chs: '比朗螃蟹',
      iconId: 29294,
    },
    '27459': {
      id: 27459,
      name_chs: '沙遁鱼',
      iconId: 29614,
    },
    '27460': {
      id: 27460,
      name_chs: '角骨鱼',
      iconId: 29615,
    },
    '27461': {
      id: 27461,
      name_chs: '沙蹼壁虎',
      iconId: 29616,
    },
    '27462': {
      id: 27462,
      name_chs: '沙卵',
      iconId: 29617,
    },
    '27463': {
      id: 27463,
      name_chs: '琥珀八目鳗',
      iconId: 29248,
    },
    '27464': {
      id: 27464,
      name_chs: '沙漠锯',
      iconId: 29618,
    },
    '27465': {
      id: 27465,
      name_chs: '迦利克螃蟹',
      iconId: 29296,
    },
    '27466': {
      id: 27466,
      name_chs: '拿巴示蝠鲼',
      iconId: 29607,
    },
    '27467': {
      id: 27467,
      name_chs: '刺棘蜥蜴',
      iconId: 29619,
    },
    '27468': {
      id: 27468,
      name_chs: '蝴蝶彩虹鳉',
      iconId: 29575,
    },
    '27469': {
      id: 27469,
      name_chs: '珍珠鳞',
      iconId: 29576,
    },
    '27470': {
      id: 27470,
      name_chs: '灰跳鱼',
      iconId: 29577,
    },
    '27471': {
      id: 27471,
      name_chs: '仙子鱼',
      iconId: 29578,
    },
    '27472': {
      id: 27472,
      name_chs: '血眼蛙',
      iconId: 29579,
    },
    '27473': {
      id: 27473,
      name_chs: '樱桃鲱鱼',
      iconId: 29580,
    },
    '27474': {
      id: 27474,
      name_chs: '胭脂鱼',
      iconId: 29581,
    },
    '27475': {
      id: 27475,
      name_chs: '柠檬鱼',
      iconId: 29582,
    },
    '27476': {
      id: 27476,
      name_chs: '叛逆鱼',
      iconId: 29583,
    },
    '27477': {
      id: 27477,
      name_chs: '狂野红斗鱼',
      iconId: 29584,
    },
    '27478': {
      id: 27478,
      name_chs: '斑点攀鲈',
      iconId: 29585,
    },
    '27479': {
      id: 27479,
      name_chs: '青蓝鳅',
      iconId: 29501,
    },
    '27480': {
      id: 27480,
      name_chs: '黄金龙虾',
      iconId: 29586,
    },
    '27481': {
      id: 27481,
      name_chs: '水泡眼',
      iconId: 29587,
    },
    '27482': {
      id: 27482,
      name_chs: '弧边招潮蟹',
      iconId: 29588,
    },
    '27483': {
      id: 27483,
      name_chs: '黑色三连星',
      iconId: 29589,
    },
    '27484': {
      id: 27484,
      name_chs: '强盗蟹',
      iconId: 29590,
    },
    '27485': {
      id: 27485,
      name_chs: '黑根鳗',
      iconId: 29263,
    },
    '27486': {
      id: 27486,
      name_chs: '黄色皮皮拉鱼',
      iconId: 29591,
    },
    '27487': {
      id: 27487,
      name_chs: '忠义鱼',
      iconId: 29211,
    },
    '27488': {
      id: 27488,
      name_chs: '骑士鲈',
      iconId: 29206,
    },
    '27489': {
      id: 27489,
      name_chs: '拉凯提卡鳟',
      iconId: 29204,
    },
    '27490': {
      id: 27490,
      name_chs: '王冠脂鲤',
      iconId: 29592,
    },
    '27491': {
      id: 27491,
      name_chs: '引螈',
      iconId: 29593,
    },
    '27492': {
      id: 27492,
      name_chs: '钻石皮皮拉鱼',
      iconId: 29594,
    },
    '27493': {
      id: 27493,
      name_chs: '银鲶',
      iconId: 29595,
    },
    '27494': {
      id: 27494,
      name_chs: '永暗鱼',
      iconId: 29596,
    },
    '27495': {
      id: 27495,
      name_chs: '暗紫珊瑚',
      iconId: 29178,
    },
    '27496': {
      id: 27496,
      name_chs: '西考拉克斯贝',
      iconId: 29059,
    },
    '27497': {
      id: 27497,
      name_chs: '黑风鱼',
      iconId: 29025,
    },
    '27498': {
      id: 27498,
      name_chs: '青色海蜘蛛',
      iconId: 29179,
    },
    '27499': {
      id: 27499,
      name_chs: '卡利班骨头鱼',
      iconId: 29041,
    },
    '27500': {
      id: 27500,
      name_chs: '骗子鱼',
      iconId: 29180,
    },
    '27501': {
      id: 27501,
      name_chs: '巨型鮟鱇',
      iconId: 29181,
    },
    '27502': {
      id: 27502,
      name_chs: '鳍人族的鱼叉',
      iconId: 29182,
    },
    '27503': {
      id: 27503,
      name_chs: '鳍人族的宿敌',
      iconId: 29183,
    },
    '27504': {
      id: 27504,
      name_chs: '斑点鳗',
      iconId: 29184,
    },
    '27505': {
      id: 27505,
      name_chs: '海洋陷阱',
      iconId: 29185,
    },
    '27506': {
      id: 27506,
      name_chs: '古代虾',
      iconId: 29186,
    },
    '27507': {
      id: 27507,
      name_chs: '绒毛女神虾',
      iconId: 29187,
    },
    '27508': {
      id: 27508,
      name_chs: '斑斓菊石螺',
      iconId: 29188,
    },
    '27509': {
      id: 27509,
      name_chs: '青色海恶魔',
      iconId: 29189,
    },
    '27510': {
      id: 27510,
      name_chs: '薄饼章鱼',
      iconId: 29190,
    },
    '27511': {
      id: 27511,
      name_chs: '食人贝',
      iconId: 29806,
    },
    '27512': {
      id: 27512,
      name_chs: '观星鱼',
      iconId: 29191,
    },
    '27513': {
      id: 27513,
      name_chs: '食用蚝',
      iconId: 29097,
    },
    '27514': {
      id: 27514,
      name_chs: '彩虹虾',
      iconId: 29192,
    },
    '27515': {
      id: 27515,
      name_chs: '猎手鱼',
      iconId: 29193,
    },
    '27516': {
      id: 27516,
      name_chs: '银灰鲤',
      iconId: 29210,
    },
    '27517': {
      id: 27517,
      name_chs: '丁香虾虎',
      iconId: 29230,
    },
    '27518': {
      id: 27518,
      name_chs: '紫鬼鱼',
      iconId: 29597,
    },
    '27519': {
      id: 27519,
      name_chs: '湖虱',
      iconId: 29598,
    },
    '27520': {
      id: 27520,
      name_chs: '镜核',
      iconId: 29718,
    },
    '27521': {
      id: 27521,
      name_chs: '酱紫章鱼',
      iconId: 29599,
    },
    '27522': {
      id: 27522,
      name_chs: '菁灵枪鱼',
      iconId: 28425,
    },
    '27523': {
      id: 27523,
      name_chs: '暗影鲤',
      iconId: 28426,
    },
    '27524': {
      id: 27524,
      name_chs: '湖蓟',
      iconId: 28427,
    },
    '27525': {
      id: 27525,
      name_chs: '白金鲷鱼',
      iconId: 28428,
    },
    '27526': {
      id: 27526,
      name_chs: '狱卒鱼',
      iconId: 29096,
    },
    '27527': {
      id: 27527,
      name_chs: '茄子鱼',
      iconId: 28429,
    },
    '27528': {
      id: 27528,
      name_chs: '空吻鱼',
      iconId: 29410,
    },
    '27529': {
      id: 27529,
      name_chs: '堇色蛤蜊',
      iconId: 28430,
    },
    '27530': {
      id: 27530,
      name_chs: '萎鳃丽鱼',
      iconId: 28431,
    },
    '27531': {
      id: 27531,
      name_chs: '贵族鱼',
      iconId: 28432,
    },
    '27532': {
      id: 27532,
      name_chs: '雾眼鱼',
      iconId: 28433,
    },
    '27533': {
      id: 27533,
      name_chs: '雷克兰德鳕鱼',
      iconId: 28434,
    },
    '27534': {
      id: 27534,
      name_chs: '迷你俾斯麦鱼',
      iconId: 28435,
    },
    '27535': {
      id: 27535,
      name_chs: '沟鳞鱼',
      iconId: 28436,
    },
    '27536': {
      id: 27536,
      name_chs: '大眼鱼',
      iconId: 29421,
    },
    '27537': {
      id: 27537,
      name_chs: '杰娜娜的泪珠',
      iconId: 28437,
    },
    '27538': {
      id: 27538,
      name_chs: '雏菊包头巾',
      iconId: 28438,
    },
    '27539': {
      id: 27539,
      name_chs: '海蓝钝口螈',
      iconId: 28439,
    },
    '27540': {
      id: 27540,
      name_chs: '小小爱神',
      iconId: 28440,
    },
    '27541': {
      id: 27541,
      name_chs: '皮亚雷鱼',
      iconId: 29758,
    },
    '27542': {
      id: 27542,
      name_chs: '孚布特多鳍鱼',
      iconId: 28441,
    },
    '27543': {
      id: 27543,
      name_chs: '孔雀鱼',
      iconId: 28442,
    },
    '27544': {
      id: 27544,
      name_chs: '锔瓷燕鱼',
      iconId: 29106,
    },
    '27545': {
      id: 27545,
      name_chs: '花芯鱼',
      iconId: 28443,
    },
    '27546': {
      id: 27546,
      name_chs: '镜像鱼',
      iconId: 29246,
    },
    '27547': {
      id: 27547,
      name_chs: '玻璃鳗',
      iconId: 28444,
    },
    '27548': {
      id: 27548,
      name_chs: '孚布特火蜥蜴',
      iconId: 28445,
    },
    '27549': {
      id: 27549,
      name_chs: '庭园跳鱼',
      iconId: 29295,
    },
    '27550': {
      id: 27550,
      name_chs: '时髦鱼',
      iconId: 28446,
    },
    '27551': {
      id: 27551,
      name_chs: '绍尔迪雅红宝石',
      iconId: 28447,
    },
    '27552': {
      id: 27552,
      name_chs: '伪仙子',
      iconId: 29752,
    },
    '27553': {
      id: 27553,
      name_chs: '猎人矢',
      iconId: 28448,
    },
    '27554': {
      id: 27554,
      name_chs: '水妖吞噬者',
      iconId: 28449,
    },
    '27555': {
      id: 27555,
      name_chs: '天堂蟹',
      iconId: 28450,
    },
    '27556': {
      id: 27556,
      name_chs: '圣法斯里克的怒发',
      iconId: 28451,
    },
    '27557': {
      id: 27557,
      name_chs: '女王的礼服',
      iconId: 28452,
    },
    '27558': {
      id: 27558,
      name_chs: '开花凯尔派',
      iconId: 28453,
    },
    '27559': {
      id: 27559,
      name_chs: '食尸鬼鱼',
      iconId: 28454,
    },
    '27560': {
      id: 27560,
      name_chs: '柠檬黄鱼',
      iconId: 29451,
    },
    '27561': {
      id: 27561,
      name_chs: '多恩之角',
      iconId: 28456,
    },
    '27562': {
      id: 27562,
      name_chs: '水花',
      iconId: 28457,
    },
    '27563': {
      id: 27563,
      name_chs: '小丑鱼',
      iconId: 28458,
    },
    '27564': {
      id: 27564,
      name_chs: '蓝电鱼',
      iconId: 28459,
    },
    '27565': {
      id: 27565,
      name_chs: '秋意落叶',
      iconId: 28460,
    },
    '27566': {
      id: 27566,
      name_chs: '大琉璃龙睛',
      iconId: 28461,
    },
    '27567': {
      id: 27567,
      name_chs: '古代仙子',
      iconId: 28462,
    },
    '27568': {
      id: 27568,
      name_chs: '踝陆蟹',
      iconId: 29235,
    },
    '27569': {
      id: 27569,
      name_chs: '大树之鳞',
      iconId: 29503,
    },
    '27570': {
      id: 27570,
      name_chs: '隆卡琵琶鱼',
      iconId: 29309,
    },
    '27571': {
      id: 27571,
      name_chs: '暴食蟹',
      iconId: 28463,
    },
    '27572': {
      id: 27572,
      name_chs: '加托尔的汗水',
      iconId: 29243,
    },
    '27573': {
      id: 27573,
      name_chs: '钻石骨舌鱼',
      iconId: 28464,
    },
    '27574': {
      id: 27574,
      name_chs: '隐者风帽',
      iconId: 28465,
    },
    '27575': {
      id: 27575,
      name_chs: '隐者蟹',
      iconId: 28466,
    },
    '27576': {
      id: 27576,
      name_chs: '巨型水虎鱼',
      iconId: 29212,
    },
    '27577': {
      id: 27577,
      name_chs: '永暗鲈',
      iconId: 29268,
    },
    '27578': {
      id: 27578,
      name_chs: '洛查特尔巨骨舌鱼',
      iconId: 29224,
    },
    '27579': {
      id: 27579,
      name_chs: '安帕的使者',
      iconId: 28467,
    },
    '27580': {
      id: 27580,
      name_chs: '维斯之耳',
      iconId: 28468,
    },
    '27581': {
      id: 27581,
      name_chs: '拉凯提卡虾虎',
      iconId: 28469,
    },
    '27844': {
      id: 27844,
      name_chs: '帝王鲑',
      iconId: 29203,
    },
    '28065': {
      id: 28065,
      name_chs: '悬挂脂鲤',
      iconId: 28470,
    },
    '28066': {
      id: 28066,
      name_chs: '贵妇蝴蝶鱼',
      iconId: 29194,
    },
    '28067': {
      id: 28067,
      name_chs: '重罪石软蟹',
      iconId: 28471,
    },
    '28068': {
      id: 28068,
      name_chs: '铜褐鳎',
      iconId: 28472,
    },
    '28069': {
      id: 28069,
      name_chs: '冠骨鱼',
      iconId: 29620,
    },
    '28070': {
      id: 28070,
      name_chs: '狂怒斗鱼',
      iconId: 28473,
    },
    '28071': {
      id: 28071,
      name_chs: '洛克瓦卫兵',
      iconId: 28474,
    },
    '28072': {
      id: 28072,
      name_chs: '猎星鱼',
      iconId: 29195,
    },
    '28719': {
      id: 28719,
      name_chs: '贻贝',
      iconId: 29196,
    },
    '28925': {
      id: 28925,
      name_chs: '不朽巨鱼',
      iconId: 28475,
    },
    '28926': {
      id: 28926,
      name_chs: '白色隆索',
      iconId: 28476,
    },
    '28927': {
      id: 28927,
      name_chs: '刺钉蜥蜴',
      iconId: 29621,
    },
    '28928': {
      id: 28928,
      name_chs: '仙子彩虹鳉',
      iconId: 28477,
    },
    '28929': {
      id: 28929,
      name_chs: '黑色喷气乱流',
      iconId: 28478,
    },
    '28930': {
      id: 28930,
      name_chs: '鳍人叹息',
      iconId: 29197,
    },
    '28937': {
      id: 28937,
      name_chs: '加拉迪翁虾虎',
      iconId: 29003,
    },
    '28938': {
      id: 28938,
      name_chs: '加拉迪翁鳀鱼',
      iconId: 29034,
    },
    '28939': {
      id: 28939,
      name_chs: '玫瑰鲷鱼',
      iconId: 29009,
    },
    '28940': {
      id: 28940,
      name_chs: '三角刺鱼',
      iconId: 29152,
    },
    '28941': {
      id: 28941,
      name_chs: '阳光蝴蝶鱼',
      iconId: 29016,
    },
    '28942': {
      id: 28942,
      name_chs: '暗淡鲨',
      iconId: 29011,
    },
    '29510': {
      id: 29510,
      name_chs: '白金鲱鱼',
      iconId: 29044,
    },
    '29718': {
      id: 29718,
      name_chs: '海投刀',
      iconId: 29042,
    },
    '29719': {
      id: 29719,
      name_chs: '碧玉头',
      iconId: 29043,
    },
    '29720': {
      id: 29720,
      name_chs: '梅尔托尔龙虾',
      iconId: 29013,
    },
    '29721': {
      id: 29721,
      name_chs: '天堂鱼',
      iconId: 29033,
    },
    '29722': {
      id: 29722,
      name_chs: '尸鬼梭鱼',
      iconId: 29035,
    },
    '29723': {
      id: 29723,
      name_chs: '猎豹鳗',
      iconId: 29126,
    },
    '29724': {
      id: 29724,
      name_chs: '海中爆弹',
      iconId: 29046,
    },
    '29725': {
      id: 29725,
      name_chs: '莫莫拉·莫拉',
      iconId: 29021,
    },
    '29726': {
      id: 29726,
      name_chs: '梅尔托尔蝴蝶鱼',
      iconId: 29167,
    },
    '29727': {
      id: 29727,
      name_chs: '步兵剑',
      iconId: 29022,
    },
    '29728': {
      id: 29728,
      name_chs: '罗塔诺梭子鰆',
      iconId: 29025,
    },
    '29729': {
      id: 29729,
      name_chs: '罗塔诺沙丁鱼',
      iconId: 29004,
    },
    '29730': {
      id: 29730,
      name_chs: '深海平鱼',
      iconId: 29048,
    },
    '29731': {
      id: 29731,
      name_chs: '深红钓鮟鱇',
      iconId: 29049,
    },
    '29732': {
      id: 29732,
      name_chs: '灯鱼',
      iconId: 29516,
    },
    '29733': {
      id: 29733,
      name_chs: '魔鳗',
      iconId: 29045,
    },
    '29734': {
      id: 29734,
      name_chs: '青色章鱼',
      iconId: 29051,
    },
    '29735': {
      id: 29735,
      name_chs: '铬铁锤头鲨',
      iconId: 29026,
    },
    '29736': {
      id: 29736,
      name_chs: '浮冰鱼',
      iconId: 29310,
    },
    '29737': {
      id: 29737,
      name_chs: '巨乌贼',
      iconId: 29027,
    },
    '29738': {
      id: 29738,
      name_chs: '放浪神之石',
      iconId: 29100,
    },
    '29739': {
      id: 29739,
      name_chs: '拉诺西亚水母',
      iconId: 29755,
    },
    '29740': {
      id: 29740,
      name_chs: '蓬松海龙',
      iconId: 29053,
    },
    '29741': {
      id: 29741,
      name_chs: '蜘蛛蟹',
      iconId: 29111,
    },
    '29742': {
      id: 29742,
      name_chs: '暗鹦鹉螺',
      iconId: 29811,
    },
    '29743': {
      id: 29743,
      name_chs: '古老恐鱼',
      iconId: 29019,
    },
    '29744': {
      id: 29744,
      name_chs: '醉鱼',
      iconId: 29373,
    },
    '29745': {
      id: 29745,
      name_chs: '小利维亚桑',
      iconId: 29147,
    },
    '29746': {
      id: 29746,
      name_chs: '海铠靴',
      iconId: 29077,
    },
    '29747': {
      id: 29747,
      name_chs: '海流星',
      iconId: 29157,
    },
    '29748': {
      id: 29748,
      name_chs: '锤爪龙虾',
      iconId: 29082,
    },
    '29749': {
      id: 29749,
      name_chs: '天堂之钥',
      iconId: 29069,
    },
    '29750': {
      id: 29750,
      name_chs: '幽灵鲨',
      iconId: 29065,
    },
    '29751': {
      id: 29751,
      name_chs: '流银刃',
      iconId: 29759,
    },
    '29752': {
      id: 29752,
      name_chs: '海神印',
      iconId: 29073,
    },
    '29753': {
      id: 29753,
      name_chs: '钉牡蛎',
      iconId: 29067,
    },
    '29754': {
      id: 29754,
      name_chs: '巨食鮟鱇',
      iconId: 29070,
    },
    '29755': {
      id: 29755,
      name_chs: '秘银君',
      iconId: 29078,
    },
    '29756': {
      id: 29756,
      name_chs: '灵敏舞者',
      iconId: 28001,
    },
    '29757': {
      id: 29757,
      name_chs: '海荨麻',
      iconId: 29434,
    },
    '29758': {
      id: 29758,
      name_chs: '巨大枪鱼',
      iconId: 29095,
    },
    '29759': {
      id: 29759,
      name_chs: '海难船帆',
      iconId: 29084,
    },
    '29760': {
      id: 29760,
      name_chs: '太阳神面纱',
      iconId: 29161,
    },
    '29761': {
      id: 29761,
      name_chs: '高级以太药虱',
      iconId: 29089,
    },
    '29762': {
      id: 29762,
      name_chs: '浮游碟鱼',
      iconId: 29661,
    },
    '29763': {
      id: 29763,
      name_chs: '以太海龙',
      iconId: 29074,
    },
    '29764': {
      id: 29764,
      name_chs: '珊瑚海龙',
      iconId: 29155,
    },
    '29765': {
      id: 29765,
      name_chs: '无赖龙',
      iconId: 28002,
    },
    '29766': {
      id: 29766,
      name_chs: '人鱼发',
      iconId: 29072,
    },
    '29767': {
      id: 29767,
      name_chs: '清道夫',
      iconId: 29085,
    },
    '29768': {
      id: 29768,
      name_chs: '沉寂者',
      iconId: 29156,
    },
    '29769': {
      id: 29769,
      name_chs: '深海鳗',
      iconId: 29088,
    },
    '29770': {
      id: 29770,
      name_chs: '处刑者',
      iconId: 29092,
    },
    '29771': {
      id: 29771,
      name_chs: '狂野海胆',
      iconId: 29813,
    },
    '29772': {
      id: 29772,
      name_chs: '尖吻鲈',
      iconId: 29546,
    },
    '29773': {
      id: 29773,
      name_chs: '幻纱披风',
      iconId: 29374,
    },
    '29774': {
      id: 29774,
      name_chs: '蜗牛鱼',
      iconId: 28003,
    },
    '29775': {
      id: 29775,
      name_chs: '阿龙纳斯',
      iconId: 29816,
    },
    '29776': {
      id: 29776,
      name_chs: '尾骨鱼',
      iconId: 29093,
    },
    '29777': {
      id: 29777,
      name_chs: '剪碎手巴塞洛缪',
      iconId: 29075,
    },
    '29778': {
      id: 29778,
      name_chs: '巡游者',
      iconId: 29066,
    },
    '29779': {
      id: 29779,
      name_chs: '寄生幸存者',
      iconId: 29086,
    },
    '29780': {
      id: 29780,
      name_chs: '浪子鱼',
      iconId: 29331,
    },
    '29781': {
      id: 29781,
      name_chs: '守领鳍龙',
      iconId: 29162,
    },
    '29782': {
      id: 29782,
      name_chs: '漏斗鲨',
      iconId: 29731,
    },
    '29783': {
      id: 29783,
      name_chs: '坠天鱼',
      iconId: 28004,
    },
    '29784': {
      id: 29784,
      name_chs: '幻光巨齿鲨',
      iconId: 28005,
    },
    '29785': {
      id: 29785,
      name_chs: '幻光盘丽鱼',
      iconId: 28006,
    },
    '29786': {
      id: 29786,
      name_chs: '幻光海马',
      iconId: 28007,
    },
    '29787': {
      id: 29787,
      name_chs: '幻光鲈',
      iconId: 28008,
    },
  },
  TUG_DICT: {
    light: 'success',
    medium: 'tertiary',
    big: 'quinary',
  },
  SPOT_DICT: SPOT_DICT,

  iconIdToUrl(iconId) {
    if (iconId == null) return ''
    const iconIdStr = iconId + ''
    const icon = iconIdStr.padStart(6, '0')
    const path = icon.substring(0, 3) + '000'
    return `${this.XIV_API_HOST}/i/${path}/${icon}.png`
  },

  toSpotText(spotId) {
    return this.FISHING_SPOTS[spotId] && this.FISHING_SPOTS[spotId].name_chs
  },

  getWeatherId(spotId, realTime) {
    const seed = this.calculateForecastTarget(realTime)
    const zoneId = DATA.FISHING_SPOTS[spotId] && DATA.FISHING_SPOTS[spotId].territory_id
    const rates = DATA.WEATHER_RATES[zoneId] && DATA.WEATHER_RATES[zoneId].weather_rates
    return rates ? rates.find(it => seed < it[1])[0] : ''
  },

  getWeather(spotId, realTime) {
    if (spotId == null) {
      return null
    }
    const weatherId = this.getWeatherId(spotId, realTime)
    return {
      id: weatherId,
      name: this.toWeatherText(weatherId),
      iconUrl: this.iconIdToUrl(DATA.WEATHER_TYPES[weatherId]?.icon),
    }
  },

  getItem(id) {
    const item = DataUtil.BAIT_DICT[id] || DataUtil.FISH_DICT[id]
    if (item) {
      return {
        name: item.name_chs,
        iconUrl: DataUtil.iconIdToUrl(item.iconId),
      }
    } else {
      return undefined
    }
  },

  calculateForecastTarget(m) {
    // Based on Rougeadyn's SaintCoinach library.
    const unixTime = parseInt(+m / 1000)
    // Get the Eorzea hour for weather start.
    const bell = unixTime / 175
    // Magic needed for calculations:
    // 16:00 = 0, 00:00 = 8, 08:00 = 16 . . .
    const inc = (bell + 8 - (bell % 8)) % 24
    // Take the Eorzea days since Unix Epoch.
    const totalDays = ((unixTime / 4200) << 32) >>> 0 // uint

    // Make the calculations.
    const calcBase = totalDays * 100 + inc
    const step1 = ((calcBase << 11) ^ calcBase) >>> 0
    const step2 = ((step1 >>> 8) ^ step1) >>> 0

    return step2 % 100
  },

  toWeatherText(weatherId) {
    return CN_DATA.WEATHER_TYPES[weatherId] && CN_DATA.WEATHER_TYPES[weatherId].name_chs
  },

  toET(time) {
    return time * EARTH_TO_EROZEA
  },

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

  FISHING_SPOTS: merge(DATA.FISHING_SPOTS, CN_DATA.FISHING_SPOTS),
  XIV_API_HOST: 'https://cafemaker.wakingsands.com', //'https://xivapi.com',
}
const EARTH_TO_EROZEA = 3600 / 175
const EROZEA_TO_EARTH = 1 / EARTH_TO_EROZEA
const ONE_HOUR_INTERVAL = 3600 * 1000
export const WEATHER_CHANGE_INTERVAL = 8 * ONE_HOUR_INTERVAL
export const WEATHER_CHANGE_INTERVAL_EARTH = WEATHER_CHANGE_INTERVAL * EROZEA_TO_EARTH
// const ONE_DAY_INTERVAL = 24 * ONE_HOUR_INTERVAL

export default DataUtil
