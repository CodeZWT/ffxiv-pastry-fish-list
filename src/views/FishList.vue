<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto" tile>
          <code
            >ET: {{ eorzeaTime }}, RT: {{ earthTime.toLocaleDateString() }} {{ earthTime.toLocaleTimeString() }}</code
          >
          <v-list three-line>
            <v-virtual-scroll :items="fishList" :item-height="200" height="1000">
              <template v-slot="{ item: fish, index }">
                <v-list-item :key="fish._id" three-line>
                  <v-list-item-avatar tile>
                    <v-img :src="getItemIconUrl(fish._id)"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{ getItemName(fish._id) }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ getFishingSpotsName(fish.location) }} @
                      {{ getZoneName(fish.location) }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ getWeatherAt(fish.location) }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <div style="display: flex">
                        <div
                          :key="fish._id + weather.name"
                          v-for="weather in getWeather(fish.previousWeatherSet)"
                          :title="weather.name"
                        >
                          <v-img :src="weather.icon" :alt="weather.name" width="24" height="24"></v-img>
                        </div>
                        <v-icon v-if="fish.previousWeatherSet.length > 0">
                          mdi-arrow-right
                        </v-icon>
                        <div
                          :key="fish._id + '-to-' + weather.name"
                          v-for="weather in getWeather(fish.weatherSet)"
                          :title="weather.name"
                        >
                          <v-img :src="weather.icon" :alt="weather.name" width="24" height="24"></v-img>
                        </div>
                      </div>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle> {{ fish.startHour }} - {{ fish.endHour }}</v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ fishListTimePart[index].countDown }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle
                      v-if="
                        fishListTimePart[index] &&
                          fishListTimePart[index].countDown.type !== 'allAvailable' &&
                          fishListWeatherChangePart[index] &&
                          fishListWeatherChangePart[index].fishWindows
                      "
                    >
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn color="primary" dark v-bind="attrs" v-on="on">
                            FishWindow
                          </v-btn>
                        </template>

                        <v-list>
                          <v-list-item
                            v-for="(fishWindow, index) in fishListWeatherChangePart[index].fishWindows"
                            :key="index"
                          >
                            <v-list-item-title>
                              {{ fishWindow.map(time => new Date(time).toLocaleTimeString()) }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                      <div style="display: flex">
                        <div v-for="bait in getBaits(fish)" :key="fish._id + bait.bait">
                          <v-row>
                            <v-col>
                              <v-img :src="getItemIconUrl(bait.bait)" :key="bait.bait" width="36" height="36"></v-img>
                            </v-col>
                            <v-col>
                              <code>{{ tug[bait.tug] }}</code>
                              <v-img :src="iconIdToUrl(hookset[bait.hookset])" width="24" height="24"></v-img>
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-list>
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

export default {
  name: 'fish-list',
  data: () => ({
    locale: 'chs',
    now: Date.now(),
    hookset: HOOKSET_ICON,
    tug: TUG_ICON,
    weatherChangeTrigger: 0,
    fishListWeatherChangePart: [],
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
      return this.iconIdToUrl(iconId)
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
    getCountDown(fish, fishIndex, now) {
      // utilize 8 hours fish windows computed if exists
      // and not out of time(use 2 fish window cached if necessary)
      if (
        fish.previousWeatherSet.length === 0 &&
        fish.weatherSet.length === 0 &&
        fish.startHour === 0 &&
        fish.endHour === 24
      ) {
        return { type: 'allAvailable' }
      }
      const fishingSpot = this.fishingSpots[fish.location]
      if (fishingSpot) {
        const fishWindowsComputed = this.fishListWeatherChangePart[fishIndex]
        let nextTwoFishWindow
        if (fishWindowsComputed) {
          nextTwoFishWindow = fishWindowsComputed.fishWindows.slice(2)
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
            type: 'waiting',
            time: prettyMilliseconds(nextFishWindow[0] - now, {
              verbose: true,
              unitCount: 2,
              secondsDecimalDigits: 0,
            }),
          }
        } else if (now <= nextFishWindow[1]) {
          return {
            type: 'fishing',
            time: prettyMilliseconds(nextFishWindow[1] - now, {
              verbose: true,
              unitCount: 2,
              secondsDecimalDigits: 0,
            }),
          }
        }
      }
    },
    getFishWindow(fish, now) {
      console.debug(fish)
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
  },
}
</script>
