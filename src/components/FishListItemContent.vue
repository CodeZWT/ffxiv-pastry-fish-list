<template>
  <v-layout>
    <v-row>
      <v-col>
        <v-row
          v-if="
            fishTimePart &&
              hasTimeConstraint(fishTimePart.countDown) &&
              fishWeatherChangePart &&
              fishWeatherChangePart.fishWindows
          "
        >
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-calendar</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item v-for="(fishWindow, index) in fishWeatherChangePart.fishWindows" :key="index">
                <v-list-item-title>
                  {{ fishWindow.map(time => new Date(time).toLocaleTimeString()) }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
        <v-row>
          <div style="display: flex">
            <div
              :key="fish._id + weather.name"
              v-for="weather in getWeather(fish.previousWeatherSet)"
              :title="weather.name"
            >
              <v-img :src="weather.icon" :alt="weather.name" width="32" height="32"></v-img>
            </div>
            <v-icon v-if="fish.previousWeatherSet.length > 0">
              mdi-arrow-right
            </v-icon>
            <div
              :key="fish._id + '-to-' + weather.name"
              v-for="weather in getWeather(fish.weatherSet)"
              :title="weather.name"
            >
              <v-img :src="weather.icon" :alt="weather.name" width="32" height="32"></v-img>
            </div>
          </div>
        </v-row>
        <v-row>
          <div>{{ fish.startHour }} - {{ fish.endHour }}</div>
        </v-row>
      </v-col>
      <v-col>
        <div style="height: 400px; width: 400px">
          <eorzea-map
            v-if="open"
            :debug="false"
            :id="fishingSpots[fish.location].map"
            :x="fishingSpots[fish.location].x"
            :y="fishingSpots[fish.location].y"
            :hierarchy="fishingSpots[fish.location].hierarchy"
          >
          </eorzea-map>
        </div>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import EorzeaWeather from '@/utils/Weather'
import EorzeaTime from '@/utils/Time'
import prettyMilliseconds from 'pretty-ms'
import { mapState } from 'vuex'
import fisher from '@/assets/fisher.png'
import EorzeaMap from '@/components/EorzeaMap'

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
  name: 'FishListItemContent',
  components: { EorzeaMap },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
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
