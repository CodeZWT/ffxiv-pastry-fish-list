<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto" tile>
          <code>
            ET: {{ eorzeaTime }}, RT: {{ earthTime.toLocaleDateString() }} {{ earthTime.toLocaleTimeString() }}
          </code>
          <v-expansion-panels v-model="openPanelIndex">
            <!--              <v-virtual-scroll :items="sortedFishList" :item-height="100" height="1000">-->
            <!--                <template v-slot="{ item: fish, index }">-->
            <v-expansion-panel v-for="(fish, index) in sortedFishList" :key="fish._id">
              <v-expansion-panel-header>
                <template v-slot:default="{ open }">
                  <div>
                    <div>
                      <v-fade-transition leave-absolute>
                        <div v-if="open" key="0">
                          <v-list-item-title> {{ getItemName(fish._id) }}</v-list-item-title>
                        </div>
                        <div v-else key="1">
                          <fish-list-brief-header
                            :value="fish"
                            :fish-time-part="fishListTimePart[fish.refIndex]"
                            :fish-weather-change-part="fishListWeatherChangePart[fish.refIndex]"
                          />
                        </div>
                      </v-fade-transition>
                    </div>
                  </div>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <fish-list-item-content
                  :open="index === openPanelIndex"
                  :fish="fish"
                  :fish-time-part="fishListTimePart[fish.refIndex]"
                  :fish-weather-change-part="fishListWeatherChangePart[fish.refIndex]"
                ></fish-list-item-content>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <!--              </v-virtual-scroll>-->
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import EorzeaTime, { WEATHER_CHANGE_INTERVAL } from '@/utils/Time'
import EorzeaWeather from '@/utils/Weather'
import FishWindow from '@/utils/FishWindow'
import prettyMilliseconds from 'pretty-ms'
import sortBy from 'lodash/sortBy'
import fisher from '@/assets/fisher.png'
import FishListBriefHeader from '@/components/FishListBriefHeader'
import FishListItemContent from '@/components/FishListItemContent'

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
const FISHING = 0
const WAITING = 1
const ALL_AVAILABLE = 2

export default {
  name: 'fish-list',
  components: { FishListItemContent, FishListBriefHeader },
  data: () => ({
    now: Date.now(),
    hookset: HOOKSET_ICON,
    tug: TUG_ICON,
    weatherChangeTrigger: 0,
    fishListWeatherChangePart: [],
    fisher: fisher,
    openPanelIndex: undefined,
  }),
  computed: {
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return new Date(this.now)
    },
    fishList() {
      return Object.values(this.allFish).filter(it => this.bigFish.includes(it._id))
    },
    fishListTimePart() {
      return this.fishList.map((fish, index) => {
        return {
          id: fish._id,
          countDown: this.getCountDown(fish, index, this.now),
        }
      })
    },
    sortedFishIndices() {
      return sortBy(this.fishListTimePart, ['countDown.type', 'countDown.time']).map(it => it.id)
    },
    sortedFishList() {
      return this.sortedFishIndices
        .map(id => {
          const fish = this.allFish[id]
          fish.refIndex = this.fishList.findIndex(it => it._id === fish._id)
          // if (this.fishListTimePart[fish.refIndex].countDown.type === 0) {
          //   console.log('11111111111')
          // }
          return fish
        })
        .filter(it => it._id === 8772)
    },
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
  watch: {
    weatherChangeTrigger() {
      this.fishListWeatherChangePart = this.fishList.map(fish => {
        return {
          fishWindows: this.getFishWindow(fish, this.now),
        }
      })
    },
  },
  created() {
    setInterval(() => {
      this.now = Date.now()
      if (this.weatherChangeTrigger === 0) {
        this.weatherChangeTrigger = 1
      } else if (EorzeaTime.toEorzeaTime(this.now) % WEATHER_CHANGE_INTERVAL <= 1000) {
        this.weatherChangeTrigger *= -1
      }
    }, 1000)
    // console.log(Object.entries(this.zones).map(([key, zone]) => '{ key:' + key + ', zoneName: \'' + zone.name_en + '\'}').join('\n'))
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
    getName(multiLanguageItem, locale = this.$i18n.locale) {
      return multiLanguageItem['name_' + locale] ? multiLanguageItem['name_' + locale] : multiLanguageItem['name_en']
    },
    getWeatherAt(id) {
      const fishingSpot = this.fishingSpots[id]
      if (fishingSpot) {
        return this.getName(this.weatherTypes[EorzeaWeather.weatherAt(fishingSpot.territory_id, new EorzeaTime())])
      }
    },
    getCountDown(fish, fishIndex, now) {
      // utilize 8 hours fish windows computed if exists
      // and not out of time(use 2 fish window cached if necessary)
      if (
        fish.previousWeatherSet.length === 0 &&
        fish.weatherSet.length === 0 &&
        fish.startHour === 0 &&
        fish.endHour === 24
      ) {
        return { type: ALL_AVAILABLE }
      }
      const fishingSpot = this.fishingSpots[fish.location]
      if (fishingSpot) {
        const fishWindowsComputed = this.fishListWeatherChangePart[fishIndex]
        let nextTwoFishWindow
        if (fishWindowsComputed) {
          nextTwoFishWindow = fishWindowsComputed.fishWindows.slice(0, 2)
        } else {
          nextTwoFishWindow = FishWindow.getNextNFishWindows(
            fishingSpot.territory_id,
            new EorzeaTime(),
            fish.startHour,
            fish.endHour,
            fish.previousWeatherSet,
            fish.weatherSet,
            2
          )
        }
        let nextFishWindow
        if (now > nextTwoFishWindow[0][1]) {
          nextFishWindow = nextTwoFishWindow[1]
        } else {
          nextFishWindow = nextTwoFishWindow[0]
        }
        if (now <= nextFishWindow[0]) {
          return {
            type: WAITING,
            time: nextFishWindow[0] - now,
          }
        } else if (now <= nextFishWindow[1]) {
          return {
            type: FISHING,
            time: nextFishWindow[1] - now,
          }
        }
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
    getFishWindow(fish, now) {
      // console.debug(fish)
      const fishingSpot = this.fishingSpots[fish.location]
      if (fishingSpot) {
        return FishWindow.getNextNFishWindows(
          fishingSpot.territory_id,
          new EorzeaTime(EorzeaTime.toEorzeaTime(now)),
          fish.startHour,
          fish.endHour,
          fish.previousWeatherSet,
          fish.weatherSet
        )
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
