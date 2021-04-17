export default {
  getImgUrl(filename) {
    return `https://cdn.jsdelivr.net/gh/ricecake404/images@main/img/${filename}`
  },
  getAquariumImgUrl(filename) {
    return `https://cdn.jsdelivr.net/gh/ricecake404/images@archive/aquarium/${filename}`
  },
  getIconUrl(iconId, hr = false) {
    return `https://cdn.jsdelivr.net/gh/ricecake404/images@main/icon/${toRealIconId(
      iconId,
      hr
    )}.png`
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
