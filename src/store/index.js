import Vue from 'vue'
import Vuex from 'vuex'
import { DATA } from '@/store/data'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fish: DATA.FISH,
    fishingSpots: DATA.FISHING_SPOTS,
    spearFishingSports: DATA.SPEARFISHING_SPOTS,
    items: DATA.ITEMS,
    weatherRates: DATA.WEATHER_RATES,
    weatherTypes: DATA.WEATHER_TYPES,
    regions: DATA.REGIONS,
    zones: DATA.ZONES,
    folklore: DATA.FOLKLORE,
    bigFish: DATA.BIG_FISH,
  },
  mutations: {},
  actions: {},
  modules: {},
})
