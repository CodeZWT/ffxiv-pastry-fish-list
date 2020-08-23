import Vue from 'vue'
import Vuex from 'vuex'
import { DATA } from '@/store/data'
import DATA_CN from '@/store/translation'
import merge from 'lodash/merge'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fish: DATA.FISH,
    fishingSpots: merge(DATA.FISHING_SPOTS, DATA_CN.FISHING_SPOTS),
    spearFishingSports: DATA.SPEARFISHING_SPOTS,
    items: merge(DATA.ITEMS, DATA_CN.ITEMS),
    weatherRates: DATA.WEATHER_RATES,
    weatherTypes: merge(DATA.WEATHER_TYPES, DATA_CN.WEATHER_TYPES),
    regions: DATA.REGIONS,
    zones: merge(DATA.ZONES, DATA_CN.ZONES),
    folklore: DATA.FOLKLORE,
    bigFish: DATA.BIG_FISH,
  },
  mutations: {},
  actions: {},
  modules: {},
})