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
            <v-expansion-panel v-for="(fish, index) in sortedFishList" :key="index">
              <v-expansion-panel-header>
                <template v-slot:default="{ open }">
                  <div>
                    <div>
                      <v-fade-transition leave-absolute>
                        <div v-if="open">
                          <fish-list-expanded-header :value="fish" />
                        </div>
                        <div v-else>
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
                  :value="fish"
                  :fish-time-part="fishListTimePart[fish.refIndex]"
                  :fish-weather-change-part="fishListWeatherChangePart[fish.refIndex]"
                  :predators="getPredators(fish)"
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
import { mapGetters, mapState } from 'vuex'
import EorzeaTime, { WEATHER_CHANGE_INTERVAL } from '@/utils/Time'
import FishWindow from '@/utils/FishWindow'
import sortBy from 'lodash/sortBy'
import fisher from '@/assets/fisher.png'
import FishListBriefHeader from '@/components/FishListBriefHeader'
import FishListItemContent from '@/components/FishListItemContent'
import DataUtil from '@/utils/DataUtil'
import FishListExpandedHeader from '@/components/FishListExpandedHeader'

const HOOKSET_ICON = {
  Powerful: '001115',
  Precision: '001116',
}
const TUG_ICON = {
  light: '!',
  medium: '!!',
  heavy: '!!!',
}

const FISHING = 0
const WAITING = 1
const ALL_AVAILABLE = 2

export default {
  name: 'fish-list',
  components: { FishListExpandedHeader, FishListItemContent, FishListBriefHeader },
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
      return Object.values(this.allFish).filter(it => it.location != null)
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
      return (
        this.sortedFishIndices
          .map(id => {
            const fish = this.allFish[id]
            fish.refIndex = this.fishList.findIndex(it => it._id === fish._id)
            // if (this.fishListTimePart[fish.refIndex].countDown.type === 0) {
            //   console.log('11111111111')
            // }
            return fish
          })
          // .filter((it, index) => index < 10)
          .filter((it, index) => index < 10 || [12761, 17589, 24993, 13727, 15627, 24994].includes(it._id))
      )
    },
    getPredators() {
      const self = this
      return fish =>
        Object.entries(fish.predators).map(([predatorId, count]) => {
          const refIndex = self.fishList.findIndex(it => it._id === +predatorId)
          return {
            ...self.allFish[predatorId],
            requiredCnt: count,
            fishTimePart: self.fishListTimePart[refIndex],
            fishWeatherChangePart: self.fishListWeatherChangePart[refIndex],
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
    ...mapGetters([]),
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
      return DataUtil.getName(this.items[id])
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
            fishWindowTotal: nextFishWindow[1] - nextFishWindow[0],
          }
        } else if (now <= nextFishWindow[1]) {
          return {
            type: FISHING,
            time: nextFishWindow[1] - now,
            fishWindowTotal: nextFishWindow[1] - nextFishWindow[0],
          }
        }
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
  },
}
</script>
