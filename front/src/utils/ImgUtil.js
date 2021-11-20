export default {
  getImgUrl(filename) {
    return `https://cdn.jsdelivr.net/gh/ricecake404/images@1.0.4.1/img/${filename}`
  },
  getAquariumImgUrl(filename) {
    return `https://ricecake500.gitee.io/pastry-fish-static-files/aquarium/${filename}`
  },
  getIconUrl(iconId, hr = false) {
    return `https://cdn.jsdelivr.net/gh/ricecake404/images@main/icon/${toRealIconId(
      iconId,
      hr
    )}.png`
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
  return `bg-${toRealIconId(iconId)}`
}
