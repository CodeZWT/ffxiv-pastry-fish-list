import Vue from 'vue'
import Vuex from 'vuex'
import { DATA } from '@/store/data'
import DATA_CN from '@/store/translation'
import merge from 'lodash/merge'
import DataUtil from '@/utils/DataUtil'
import EorzeaWeather from '@/utils/Weather'
import EorzeaTime from '@/utils/Time'
import { cloneDeep, groupBy } from 'lodash'
import store from 'store2'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fish: merge(DATA.FISH, DATA_CN.FISH_ANGLER_ID),
    fishingSpots: merge(DATA.FISHING_SPOTS, DATA_CN.FISHING_SPOTS),
    spearFishingSports: DATA.SPEARFISHING_SPOTS,
    items: merge(DATA.ITEMS, DATA_CN.ITEMS),
    weatherRates: DATA.WEATHER_RATES,
    weatherTypes: merge(DATA.WEATHER_TYPES, DATA_CN.WEATHER_TYPES),
    regions: DATA.REGIONS,
    zones: merge(DATA.ZONES, DATA_CN.ZONES),
    folklore: DATA.FOLKLORE,
    bigFish: DATA.BIG_FISH,
    fishingSpotFish: groupBy(DATA_CN.FISHING_SPOT_FISH, 'fishingSpot'),
    userData: store.get('userData') ?? { completed: [], pinned: [] },
  },
  getters: {
    // TODO combine icon file together
    // https://css-tricks.com/css-sprites/
    getItemIconUrl: state => id => {
      const iconId = state.items[id].icon
      // const localImg = require(`../assert/${iconId}.png`)
      // if (localImg) {
      //   return localImg
      // } else {
      return DataUtil.iconIdToUrl(iconId)
      // }
    },
    getItemName: state => id => {
      return DataUtil.getName(state.items[id])
    },
    getZoneName: state => id => {
      const fishingSpot = state.fishingSpots[id]
      if (fishingSpot) {
        return DataUtil.getName(state.zones[state.weatherRates[fishingSpot.territory_id].zone_id])
      }
    },
    getFishingSpotsName: state => id => {
      return state.fishingSpots[id] && DataUtil.getName(state.fishingSpots[id])
    },
    getBaits: (state, getters) => fish => {
      if (fish.bestCatchPath.length < 1) return []
      const baitId = fish.bestCatchPath[fish.bestCatchPath.length - 1]
      const lastBait = {
        tug: fish.tug,
        tugIcon: DataUtil.TUG_ICON[fish.tug],
        hookset: fish.hookset,
        hooksetIcon: DataUtil.iconIdToUrl(DataUtil.HOOKSET_ICON[fish.hookset]),
        baitId: baitId,
        baitName: getters.getItemName(baitId),
        baitIcon: getters.getItemIconUrl(baitId),
      }
      if (fish.bestCatchPath.length === 1) {
        return [lastBait]
      } else {
        return fish.bestCatchPath.map((baitId, index, arr) => {
          if (index === arr.length - 1) {
            return lastBait
          } else {
            const baitFish = state.fish[arr[index + 1]]
            return {
              tug: baitFish.tug,
              tugIcon: DataUtil.TUG_ICON[fish.tug],
              hookset: baitFish.hookset,
              hooksetIcon: DataUtil.iconIdToUrl(DataUtil.HOOKSET_ICON[fish.hookset]),
              baitId: baitId,
              baitName: getters.getItemName(baitId),
              baitIcon: getters.getItemIconUrl(baitId),
            }
          }
        })
      }
    },
    getWeatherAt: state => id => {
      const fishingSpot = this.fishingSpots[id]
      if (fishingSpot) {
        return DataUtil.getName(state.weatherTypes[EorzeaWeather.weatherAt(fishingSpot.territory_id, new EorzeaTime())])
      }
    },
    getZoneId: state => id => {
      const fishingSpot = state.fishingSpots[id]
      if (fishingSpot) {
        return this.weatherRates[fishingSpot.territory_id].zone_id
      }
    },
    getWeather: state => weatherSet => {
      return weatherSet.map(id => {
        return {
          name: DataUtil.getName(state.weatherTypes[id]),
          icon: DataUtil.iconIdToUrl(state.weatherTypes[id].icon),
        }
      })
    },
    getFishingSpot: state => fishingSpotId => {
      return state.fishingSpots[fishingSpotId]
    },
    getFishingSpotFish: (state, getters) => fishingSpotId => {
      return state.fishingSpotFish[fishingSpotId].map(it => ({
        id: it.fish,
        tug: it.tug,
        icon: getters.getItemIconUrl(it.fish),
      }))
    },
    getFishCompleted: state => fishId => {
      return state.userData.completed.includes(fishId)
    },
    getFishPinned: state => fishId => {
      return state.userData.pinned.includes(fishId)
    },
  },
  mutations: {
    setUserData(state, data) {
      state.userData = data
      store.set('userData', data)
    },
    setFishCompleted(state, { fishId, completed }) {
      state.userData = updateUserDataStateRecords(state.userData, 'completed', fishId, completed)
    },
    setFishPinned(state, { fishId, pinned }) {
      state.userData = updateUserDataStateRecords(state.userData, 'pinned', fishId, pinned)
    },
  },
  actions: {},
  modules: {},
})

function updateUserDataStateRecords(userData, type, key, value) {
  const temp = cloneDeep(userData)
  if (value) {
    temp[type].push(key)
  } else {
    temp[type] = userData[type].filter(it => it !== key)
  }
  store.set('userData', temp)
  return temp
}