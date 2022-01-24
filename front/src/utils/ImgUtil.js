import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'

const BASE_URL = {
  imageRoot: 'rcstatic.traveleorzea.com/pastry-fish-static-files/img',
}

const CATEGORY = {
  MISC: 'misc',
  HOME_LOGO: 'home-logo',
  LOGO: 'logo',
  ITEM: 'item',
  LANG: 'lang',
  MAP: 'map',
  MAP_RANGE_INDICATOR: 'map-range-indicator',
  AQUARIUM: 'aquarium',
}

const util = {
  CATEGORY: CATEGORY,
  getImgUrl(filename, category = 'misc') {
    if (DevelopmentModeUtil.useLocalFile()) {
      return require(`Assets/cdn/pastry-fish-static-files/img/${category}/${filename}`)
    } else {
      return `https://${BASE_URL.imageRoot}/${category}/${filename}`
    }
  },
  getAquariumImgUrl(filename) {
    return util.getImgUrl('detail/' + filename, CATEGORY.AQUARIUM)
  },
  getIconUrl(iconId, hr = false) {
    return util.getImgUrl(`${toRealIconId(iconId, hr)}.webp`, CATEGORY.ITEM)
  },
  getMapUrl(filename) {
    return util.getImgUrl(filename, CATEGORY.MAP)
  },
  getCompetitionImgUrl(filename) {
    return `https://ricecake500.gitee.io/pastry-fish-static-files/img/${filename}`
  },
  iconIdToClass: iconIdToClass,
}

function toRealIconId(iconId, hr = false) {
  if (iconId == null) return ''
  const iconIdStr = iconId + ''
  return iconIdStr.padStart(6, '0') + (hr ? '_hr1' : '')
}

function iconIdToClass(iconId) {
  return `bg-${toRealIconId(iconId)}${DevelopmentModeUtil.useLocalFile() ? '-local' : ''}`
}

export default util
