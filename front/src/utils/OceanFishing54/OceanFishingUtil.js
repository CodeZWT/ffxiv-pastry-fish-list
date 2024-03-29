import { flow, groupBy, mapValues, uniq } from 'lodash/fp'
import _ from 'lodash'

function getLS2Voyage() {
  return flow(
    uniq,
    groupBy('locationShift'),
    mapValues(it => it.map(it => it.voyage))
  )(
    Object.values(CORE.ROUTES).flatMap(route =>
      route.spotList.map((spotId, index) => ({
        voyage: route.routeId,
        locationShift: locationShiftIndexOf(spotId, route.timeList[index] - 1),
      }))
    )
  )
}

const LOCATION_SHIFT_VOYAGE = getLS2Voyage()

function allTargets() {
  // const locationShiftTips = CORE.LOCATION_SHIFT_TIPS.map((tip, index) => {
  //   return { locationShift: index, blueFish: tip.blueFish }
  // }).filter(it => it.blueFish !== null)
  const routeList = Object.values(CORE.ROUTES)
  const locationShiftTips = _.uniq(
    routeList
      .flatMap(route =>
        route.spotList.map((spotId, index) => {
          return {
            locationShift: locationShiftIndexOf(spotId, route.timeList[index] - 1),
            blueFish: route.blueFish[index],
          }
        })
      )
      .filter(it => it.blueFish > 0)
  )

  const achievementId2Voyages = flow(
    groupBy('achievement'),
    mapValues(it => it.map(it => it.voyage))
  )(
    routeList.flatMap(route =>
      route.achievements.map(achievement => ({
        achievement,
        voyage: route.routeId,
      }))
    )
  )

  const achievementSet = new Set(routeList.flatMap(it => it.achievements))
  // TODO add location all & 3 shift options
  return [
    {
      type: '蓝鱼',
      options: locationShiftTips.map(it => ({
        type: 'item',
        id: it.blueFish,
        voyageTypes: LOCATION_SHIFT_VOYAGE[it.locationShift],
      })),
    },
    {
      type: '成就',
      options: Array.from(achievementSet)
        .map(it => ({
          type: 'achievement',
          id: it,
          voyageTypes: achievementId2Voyages[it],
        }))
        .sort((a, b) => a.id - b.id),
    },
    ...Object.values(CORE.SPOTS).map(spot => {
      return {
        type: spot.spotNameText,
        options: CORE.SHIFTS.map((shift, shiftIdx) => {
          const locationShift = locationShiftIndexOf(spot.id, shiftIdx)
          return {
            type: 'locationShift',
            id: locationShift,
            name: `${spot.spotMainNameText}(${shift})`,
            shift: shiftIdx,
            voyageTypes: LOCATION_SHIFT_VOYAGE[locationShift],
          }
        }),
      }
    }),
  ]
}

function locationShiftIndexOf(spotId, timeId) {
  return `${spotId}-${timeId}`
}

import CORE from 'Utils/OceanFishingCore'

export default {
  ...CORE,
  allTargets,
}
