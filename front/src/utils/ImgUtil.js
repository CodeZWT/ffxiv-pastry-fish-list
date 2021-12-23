const URL_REGION = 'CN'
const BASE_URL = {
  CN: {
    imageRoot: 'rcstatic.traveleorzea.com/pastry-fish-static-files/img',
    map: 'rcstatic.traveleorzea.com/pastry-fish-static-files/img/map',
    icon: 'rcstatic.traveleorzea.com/pastry-fish-static-files/img/item',
  },
  Global: {
    imageRoot: 'cdn.jsdelivr.net/gh/ricecake404/images@1.1.2.1/img',
    map: 'cdn.jsdelivr.net/gh/ricecake404/images@1.0.6.map.2/map',
    icon: 'cdn.jsdelivr.net/gh/ricecake404/images@main/icon',
  },
}

export default {
  CATEGORY: {
    MISC: 'misc',
    HOME_LOGO: 'home-logo',
    LOGO: 'logo',
    ITEM: 'item',
    LANG: 'lang',
    MAP: 'map',
    MAP_RANGE_INDICATOR: 'map-range-indicator',
  },
  getImgUrl(filename, category = 'misc') {
    return `https://${BASE_URL[URL_REGION].imageRoot}/${category}/${filename}`
  },
  getAquariumImgUrl(filename) {
    return `https://ricecake500.gitee.io/pastry-fish-static-files/aquarium/${filename}`
  },
  getIconUrl(iconId, hr = false) {
    return `https://${BASE_URL[URL_REGION].icon}/${toRealIconId(iconId, hr)}.webp`
  },
  getCompetitionImgUrl(filename) {
    return `https://ricecake500.gitee.io/pastry-fish-static-files/img/${filename}`
  },
  getMapUrl(filename) {
    return `https://${BASE_URL[URL_REGION].map}/${filename}`
  },
  iconIdToClass: iconIdToClass,
}

function toRealIconId(iconId, hr = false) {
  if (iconId == null) return ''
  const iconIdStr = iconId + ''
  return iconIdStr.padStart(6, '0') + (hr ? '_hr1' : '')
}

function iconIdToClass(iconId) {
  return `bg-${toRealIconId(iconId)}`
}
