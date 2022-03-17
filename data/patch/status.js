const { SystemInfo } = require("../version");
const statusCN = {
  761: {
    id: 761,
    icon: 11102,
    name_chs: '钓组',
    key: 'snagging',
  },
  762: {
    id: 762,
    icon: 11103,
    name_chs: '鱼眼',
    key: 'fishEyes',
  },
  763: {
    id: 763,
    icon: 11104,
    name_chs: '撒饵',
    key: 'chum',
  },
  805: {
    id: 805,
    icon: 11008,
    name_chs: '收藏品采集',
    key: 'collectorGlove',
  },
  1803: {
    id: 1803,
    icon: 11115,
    name_chs: '拍击水面',
    key: 'surfaceScale',
  },
  1804: {
    id: 1804,
    icon: 11116,
    name_chs: '专一垂钓',
    key: 'identicalCast',
  },
  850: {
    id: 850,
    icon: 16023,
    name_chs: '钓上大尺寸的鱼几率提升（耐心I）',
    key: 'gatheringFortuneUp',
  },
  765: {
    id: 765,
    icon: 11106,
    name_chs: '捉放（耐心II）',
    key: 'catchAndRelease',
  },
  568: {
    id: 568,
    icon: 11101,
    name_chs: '捕鱼人之识',
    key: 'fishersIntuition',
  },
  2778: {
    id: 2778,
    icon: 17167,
    name_chs: '捕鱼人之计',
    key: 'AnglersArt',
  },
}
const statusGlobal = statusCN

module.exports = {
  CN: statusCN,
  Global: statusGlobal,
  getData() {
    return SystemInfo.region === 'CN' ? statusCN : statusGlobal
  }
}
