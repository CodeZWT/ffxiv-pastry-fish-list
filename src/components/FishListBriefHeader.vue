<template>
  <div class="d-flex justify-center align-content-center">
    <v-col cols="2">
      <div class="d-flex" style="height: 100%; width: 100%; align-items: center; flex-direction: row">
        <div class="mr-1">
          <v-img :lazy-src="fisher" width="40" height="40" :src="getItemIconUrl(fish._id)" />
        </div>
        <div class="text-subtitle-1" :title="fish._id">{{ getItemName(fish._id) }}</div>
      </div>
    </v-col>
    <v-col cols="2" style="display: flex; flex-direction: column; justify-items: center">
      <div class="text-subtitle-2">
        {{ getZoneName(fish.location) }}
      </div>
      <div
        v-if="getZoneName(fish.location) !== getFishingSpotsName(fish.location)"
        class="text-subtitle-2"
        :title="fish.location"
      >
        {{ getFishingSpotsName(fish.location) }}
      </div>
    </v-col>
    <v-col>
      <v-list-item-subtitle>
        <div style="display: flex">
          <div v-for="(bait, baitInx) in getBaits(fish)" :key="fish._id + bait.bait">
            <div style="display: flex">
              <div v-if="baitInx !== 0" style="display: flex; align-items: center">
                <v-icon>mdi-arrow-right</v-icon>
              </div>
              <div>
                <v-img :lazy-src="fisher" :src="getItemIconUrl(bait.bait)" :key="bait.bait" width="36" height="36" />
              </div>
              <div>
                <code>{{ tug[bait.tug] }}</code>
                <v-img :src="iconIdToUrl(hookset[bait.hookset])" width="16" height="16" />
              </div>
            </div>
          </div>
        </div>
      </v-list-item-subtitle>
    </v-col>
    <v-col>
      <v-list-item-subtitle>
        {{ getCountDownTypeName(fishTimePart.countDown.type) }}
      </v-list-item-subtitle>
      <v-list-item-subtitle v-if="hasTimeConstraint(fishTimePart.countDown)">
        {{ printCountDownTime(fishTimePart.countDown.time) }}
      </v-list-item-subtitle>
    </v-col>
    <!--                    <v-list-item-subtitle>-->
    <!--                      {{ getWeatherAt(fish.location) }}-->
    <!--                    </v-list-item-subtitle>-->
  </div>
</template>

<script>
import EorzeaWeather from '@/utils/Weather'
import EorzeaTime from '@/utils/Time'
import prettyMilliseconds from 'pretty-ms'
import { mapState } from 'vuex'
import fisher from '@/assets/fisher.png'

const HOST = 'https://cafemaker.wakingsands.com'
const HOOKSET_ICON = {
  Powerful: '001115',
  Precision: '001116',
}
const TUG_ICON = {
  light: '!',
  medium: '!!',
  heavy: '!!!',
}

const COUNT_DOWN_TYPES = ['fishing', 'waiting', 'allAvailable']
// const FISHING = 0
// const WAITING = 1
const ALL_AVAILABLE = 2

export default {
  name: 'FishListBriefHeader',
  props: {
    fish: {
      type: Object,
      default: () => ({}),
    },
    fishTimePart: {
      type: Object,
      default: () => ({}),
    },
    fishWeatherChangePart: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    locale: 'chs',
    hookset: HOOKSET_ICON,
    tug: TUG_ICON,
    weatherChangeTrigger: 0,
    fisher: fisher,
  }),
  computed: {
    ...mapState({
      allFish: 'fish',
      items: 'items',
      fishingSpots: 'fishingSpots',
      weatherTypes: 'weatherTypes',
      zones: 'zones',
      weatherRates: 'weatherRates',
      bigFish: 'bigFish',
      dataCN: 'dataCN',
    }),
  },
  methods: {
    getItemName(id) {
      return this.getName(this.items[id])
    },
    getFishingSpotsName(id) {
      return this.fishingSpots[id] && this.getName(this.fishingSpots[id])
    },
    getZoneName(id) {
      const fishingSpot = this.fishingSpots[id]
      if (fishingSpot) {
        return this.getName(this.zones[this.weatherRates[fishingSpot.territory_id].zone_id])
      }
    },
    getZoneId(id) {
      const fishingSpot = this.fishingSpots[id]
      if (fishingSpot) {
        return this.weatherRates[fishingSpot.territory_id].zone_id
      }
    },
    // TODO combine icon file together
    // https://css-tricks.com/css-sprites/
    getItemIconUrl(id) {
      const iconId = this.items[id].icon
      // const localImg = require(`../assert/${iconId}.png`)
      // if (localImg) {
      //   return localImg
      // } else {
      return this.iconIdToUrl(iconId)
      // }
    },
    iconIdToUrl(iconId) {
      return `${HOST}/i/${iconId.substring(0, 3)}000/${iconId}.png`
    },
    getWeather(weatherSet) {
      return weatherSet.map(id => {
        return {
          name: this.getName(this.weatherTypes[id]),
          icon: this.iconIdToUrl(this.weatherTypes[id].icon),
        }
      })
    },
    getName(multiLanguageItem, locale = this.locale) {
      return multiLanguageItem['name_' + locale] ? multiLanguageItem['name_' + locale] : multiLanguageItem['name_en']
    },
    getWeatherAt(id) {
      const fishingSpot = this.fishingSpots[id]
      if (fishingSpot) {
        return this.getName(this.weatherTypes[EorzeaWeather.weatherAt(fishingSpot.territory_id, new EorzeaTime())])
      }
    },
    printCountDownTime(time) {
      if (time != null) {
        return prettyMilliseconds(time, {
          verbose: true,
          unitCount: 2,
          secondsDecimalDigits: 0,
        })
      } else {
        return ''
      }
    },
    getBaits(fish) {
      if (fish.bestCatchPath.length < 1) return []
      const lastBait = {
        tug: fish.tug,
        hookset: fish.hookset,
        bait: fish.bestCatchPath[fish.bestCatchPath.length - 1],
      }
      if (fish.bestCatchPath.length === 1) {
        return [lastBait]
      } else {
        return fish.bestCatchPath.map((bait, index, arr) => {
          if (index === arr.length - 1) {
            return lastBait
          } else {
            const baitFish = this.allFish[arr[index + 1]]
            return {
              tug: baitFish.tug,
              hookset: baitFish.hookset,
              bait: bait,
            }
          }
        })
      }
    },
    hasTimeConstraint(countDown) {
      return countDown.type !== ALL_AVAILABLE
    },
    getCountDownTypeName(countDown) {
      return COUNT_DOWN_TYPES[countDown]
    },
  },
}
</script>

<style scoped></style>