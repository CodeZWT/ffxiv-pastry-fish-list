const keyBy = (arr, key) => {
  const dict = {}
  arr.forEach(it => {
    dict[it[key]] = Object.assign({}, it)
  })
  return dict
}

const combineRegion = (data, dataGlobalAddon) => {
  const dict = keyBy(data, 'id')
  dataGlobalAddon.forEach(region => {
    if (dict[region.id]) {
      dict[region.id].territories = combineTerritory(
        dict[region.id].territories,
        region.territories
      )
    } else {
      dict[region.id] = region
    }
  })
  return Object.values(dict)
}

const combineTerritory = (data, dataGlobalAddon) => {
  const dict = keyBy(data, 'id')
  dataGlobalAddon.forEach(territory => {
    if (dict[territory.id]) {
      dict[territory.id].spots = dict[territory.id].spots.concat(territory.spots)
    } else {
      dict[territory.id] = territory
    }
  })
  return Object.values(dict)
}

module.exports = {
  combineRegion,
  keyBy,
}
