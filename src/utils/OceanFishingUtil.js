import _ from 'lodash'

function getLS2Voyage() {
  return _.chain(
    CORE.VOYAGE_TYPES.flatMap(voyage => {
      return CORE.VOYAGE_LOCATIONS[CORE.voyageToLocation(voyage)].map(
        (location, index) => {
          return {
            voyage,
            locationShift: CORE.locationShiftIndexOf(
              location,
              (CORE.voyageToShift(voyage) + index) % 3
            ),
          }
        }
      )
    })
  )
    .uniq()
    .groupBy('locationShift')
    .mapValues(it => it.map(it => it.voyage))
    .value()
}

const LOCATION_SHIFT_VOYAGE = getLS2Voyage()
console.log(LOCATION_SHIFT_VOYAGE)

function allTargets() {
  const locationShiftTips = CORE.LOCATION_SHIFT_TIPS.map((tip, index) => {
    return { locationShift: index, blueFish: tip.blueFish }
  }).filter(it => it.blueFish !== null)

  const achievementId2Voyages = _.chain(
    CORE.VOYAGE_TIPS.flatMap((tip, index) => {
      return tip.achievements.map(achievement => {
        return { achievement, voyage: index }
      })
    })
  )
    .groupBy('achievement')
    .mapValues(it => it.map(it => it.voyage))
    .value()

  const achievementSet = new Set(CORE.VOYAGE_TIPS.flatMap(it => it.achievements))
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
      options: Array.from(achievementSet).map(it => ({
        type: 'achievement',
        id: it,
        voyageTypes: achievementId2Voyages[it],
      })),
    },
    ...CORE.LOCATIONS.map((location, locationIdx) => {
      return {
        type: location,
        options: CORE.SHIFTS.map((shift, shiftIdx) => {
          const locationShift = CORE.locationShiftIndexOf(locationIdx, shiftIdx)
          return {
            type: 'locationShift',
            id: CORE.locationShiftIndexOf(locationIdx, shiftIdx),
            name: `${location}(${shift})`,
            voyageTypes: LOCATION_SHIFT_VOYAGE[locationShift],
          }
        }),
      }
    }),
  ]
}

import CORE from './OceanFishingCore'

export default {
  ...CORE,
  allTargets,
}
