<template>
  <div>
    <splitpanes class="default-theme">
      <pane>
        <div class="main-pane">
          <v-container class="py-0">
            <div>
              <div :class="{ 'filter-wrapper': true, 'show-filter': showFilter }">
                <fish-filter :filters="filters" @input="onFiltersUpdate" />
              </div>
              <fish-search
                v-model="showSearchDialog"
                :fish-data="fishSourceList"
                :fish-list-time-part="fishListTimePart"
                :fish-list-weather-change-part="fishListWeatherChangePart"
              />
              <div :class="{ 'main-area': true, 'show-filter': showFilter }">
                <div style="width: 100%">
                  <v-banner v-if="showBanner" two-line>
                    <v-avatar slot="icon" color="primary" size="40">
                      <v-icon icon="mdi-lock" color="white">
                        mdi-information
                      </v-icon>
                    </v-avatar>

                    <div>
                      欢迎使用鱼糕钓鱼时钟，如有任何问题，首先尝试刷新(F5)或强制刷新页面(Ctrl+F5)。
                    </div>
                    <div>
                      点击每列鱼可以展开详细界面，最近10次窗口期的表格也在其中，请点击“查看窗口期详情”展开。
                    </div>
                    <div>
                      本站与其他钓鱼时钟的导入导出功能在右上角
                      <v-icon>mdi-dots-vertical</v-icon>
                      中。
                    </div>

                    <template v-slot:actions>
                      <click-helper @click="onDismiss">
                        <v-btn text color="primary">
                          不再显示
                        </v-btn>
                      </click-helper>
                    </template>
                  </v-banner>
                  <v-expansion-panels flat hover multiple v-model="fishListOpenStatus" class="mt-2">
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        {{ $t('list.pinTitle') }}
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="list-wrapper">
                        <fish-list
                          :fish-list="pinnedFishList"
                          :fish-list-time-part="fishListTimePart"
                          :fish-list-weather-change-part="fishListWeatherChangePart"
                          @fish-selected="selectedFishId = $event"
                        >
                          <template v-slot:empty>
                            <span>
                              {{ $t('list.pin.empty.prefix') }}
                              <v-icon small style="transform: rotate(-45deg)" class="mx-1">mdi-pin-outline</v-icon>
                              {{ $t('list.pin.empty.suffix') }}
                            </span>
                          </template>
                        </fish-list>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        {{ $t('list.normalTitle') }}
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="list-wrapper">
                        <fish-list
                          :fish-list="sortedFilteredFishList"
                          :fish-list-time-part="fishListTimePart"
                          :fish-list-weather-change-part="fishListWeatherChangePart"
                          show-fish-divider
                          @fish-selected="selectedFishId = $event"
                        >
                          <template v-slot:empty>
                            <span>
                              {{ $t('list.normal.empty') }}
                            </span>
                          </template>
                        </fish-list>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </div>
              <import-export-dialog v-model="showImportExportDialog" />
            </div>
          </v-container>
        </div>
      </pane>
      <pane>
        <div class="fish-detail-pane">
          <fish-detail :fish="selectedFish" />
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import EorzeaTime, { WEATHER_CHANGE_INTERVAL_EARTH } from '@/utils/Time'
import FishWindow from '@/utils/FishWindow'
import sortBy from 'lodash/sortBy'
import DataUtil from '@/utils/DataUtil'
import FishFilter from '@/components/FishFilter'
import FishList from '@/components/FishList'
import FishSearch from '@/components/FishSearch'
import { union, isEqual } from 'lodash'
import ImportExportDialog from '@/components/ImportExportDialog'
import ClickHelper from '@/components/basic/ClickHelper'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import FishDetail from '@/components/FishDetail'

export default {
  name: 'fish-page',
  components: {
    FishDetail,
    ClickHelper,
    ImportExportDialog,
    FishSearch,
    FishList,
    FishFilter,
    Splitpanes,
    Pane,
  },
  data: () => ({
    now: Date.now(),
    weatherChangeTrigger: 1,
    fishListWeatherChangePart: {},
    openPanelIndex: undefined,
    fishListOpenStatus: [0, 1],
    selectedFishId: undefined,
  }),
  computed: {
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return new Date(this.now)
    },
    fishSourceList() {
      return Object.values(this.allFish).filter(it => it.gig == null && it.patch <= DataUtil.PATCH_MAX)
    },
    fishList() {
      return this.fishSourceList.filter(fish => {
        return (
          this.filters.patches.includes(fish.patch) &&
          (this.filters.completeType === 'ALL' ||
            (this.filters.completeType === 'COMPLETED' && this.getFishCompleted(fish._id)) ||
            (this.filters.completeType === 'UNCOMPLETED' && !this.getFishCompleted(fish._id))) &&
          (this.filters.bigFishType === 'ALL' ||
            (this.filters.bigFishType === 'BIG_FISH' && this.bigFish.includes(fish._id)) ||
            (this.filters.bigFishType === 'ALL_AVAILABLE_BIG_FISH' &&
              this.bigFish.includes(fish._id) &&
              this.fishListTimePart[fish._id]?.countDown?.type === DataUtil.ALL_AVAILABLE) ||
            (this.filters.bigFishType === 'NOT_BIG_FISH' && !this.bigFish.includes(fish._id)))
        )
      })
    },
    fishListTimePart() {
      return this.fishSourceList.reduce((fish2TimePart, fish) => {
        fish2TimePart[fish._id] = {
          id: fish._id,
          countDown: this.getCountDown(fish, this.now),
        }
        return fish2TimePart
      }, {})
    },
    sortedFishIds() {
      return sortBy(this.fishListTimePart, ['countDown.type', 'countDown.time']).map(it => it.id)
    },
    sortedFilteredFishList() {
      return this.sortedFishIds
        .map(id => this.allFish[id])
        .filter(it => it != null)
        .filter(it => !this.getFishPinned(it._id))
        .filter((it, index) => this.filters.fishN === -1 || index < this.filters.fishN)
    },
    pinnedFishList() {
      return sortBy(
        this.fishSourceList.filter(it => this.pinnedFishIds.includes(it._id)),
        [fish => this.sortedFishIds.indexOf(fish._id)]
      )
    },
    showSearchDialog: {
      get() {
        return this.showSearch
      },
      set(showSearch) {
        this.setShowSearchDialog(showSearch)
      },
    },
    showImportExportDialog: {
      get() {
        return this.showImportExport
      },
      set(show) {
        this.setShowImportExportDialog(show)
      },
    },
    selectedFish() {
      const fish = this.allFish[this.selectedFishId]
      if (fish) {
        return {
          ...fish,
          parts: {
            fishTimePart: this.fishListTimePart[this.selectedFishId],
            fishWeatherChangePart: this.fishListWeatherChangePart[this.selectedFishId],
            predators: DataUtil.getPredators(fish, this.allFish, this.fishListTimePart, this.fishListWeatherChangePart),
          },
        }
      } else {
        return undefined
      }
    },
    ...mapState({
      allFish: 'fish',
      items: 'items',
      fishingSpots: 'fishingSpots',
      zones: 'zones',
      bigFish: 'bigFish',
      showSearch: 'showSearchDialog',
      showImportExport: 'showImportExportDialog',
    }),
    ...mapGetters(['getFishCompleted', 'filters', 'pinnedFishIds', 'showFilter', 'showBanner', 'getFishPinned']),
  },
  watch: {
    weatherChangeTrigger() {
      const now = this.now
      this.fishListWeatherChangePart = this.fishSourceList.reduce((fish2WeatherPart, fish) => {
        fish2WeatherPart[fish._id] = {
          fishWindows: this.getFishWindow(fish, now),
        }
        return fish2WeatherPart
      }, {})
    },
  },
  created() {
    document.title = `${this.$t('top.systemBarTitle')} - ${this.$t('top.toolBarTitle')}`
    this.now = Date.now()
    setInterval(() => {
      this.now = Date.now()
    }, 1000)

    this.weatherChangeTrigger *= -1
    setInterval(() => {
      this.weatherChangeTrigger *= -1
    }, WEATHER_CHANGE_INTERVAL_EARTH)
    // console.log(Object.entries(this.zones).map(([key, zone]) => '{ key:' + key + ', zoneName: \'' + zone.name_en + '\'}').join('\n'))
  },
  methods: {
    getItemName(id) {
      return DataUtil.getName(this.items[id])
    },
    getCountDown(fish, now) {
      // utilize 8 hours fish windows computed if exists
      // and not out of time(use 2 fish window cached if necessary)
      const fishingSpot = this.fishingSpots[fish.location]
      if (fishingSpot) {
        const fishWindowsComputed =
          this.fishListWeatherChangePart[fish._id]?.fishWindows ??
          FishWindow.getNextNFishWindows(
            fishingSpot.territory_id,
            new EorzeaTime(now),
            fish.startHour,
            fish.endHour,
            fish.previousWeatherSet,
            fish.weatherSet,
            2
          )
        let nextFishWindow = fishWindowsComputed.find(fishWindow => {
          if (fishWindow[1] >= now) {
            return fishWindow
          }
        })
        if (nextFishWindow == null) {
          return { type: DataUtil.ALL_AVAILABLE }
        }
        if (now <= nextFishWindow[0]) {
          return {
            type: DataUtil.WAITING,
            time: nextFishWindow[0] - now,
            timePoint: nextFishWindow[0],
            fishWindowTotal: nextFishWindow[1] - nextFishWindow[0],
          }
        } else if (now <= nextFishWindow[1]) {
          return {
            type: DataUtil.FISHING,
            time: nextFishWindow[1] - now,
            timePoint: nextFishWindow[1],
            fishWindowTotal: nextFishWindow[1] - nextFishWindow[0],
          }
        }
      } else {
        return { type: DataUtil.ALL_AVAILABLE }
      }
    },
    getFishWindow(fish, now) {
      // console.debug(fish)
      if (Object.keys(fish.predators).length === 0) {
        return this.getFishWindowOfSingleFish(fish, now)
      } else {
        // TODO change to a more efficient way
        const predators = Object.keys(fish.predators).map(predatorId => {
          return this.allFish[predatorId]
        })
        if (predators.every(it => DataUtil.isAllAvailableFish(it) || this.isConstrainsEqual(fish, it))) {
          return this.getFishWindowOfSingleFish(fish, now)
        } else if (predators.length === 1) {
          if (DataUtil.isAllAvailableFish(fish)) {
            return this.getFishWindowOfSingleFish(predators[0], now)
          } else if (fish.weatherSet.length === 0 && fish.previousWeatherSet.length === 0) {
            return this.getFishWindowOfSingleFish(predators[0], now).map(fishWindow => {
              // if start of fish window > 0, i.e. its window is shrunk by the weather
              // change it back to 0, since other 2 predators are always available in [0,8]
              const startEorzeaTime = new EorzeaTime(EorzeaTime.toEorzeaTime(fishWindow[0]))
              if (startEorzeaTime.getHours() > 0) {
                return [
                  startEorzeaTime.timeOfHours(fish.startHour).toEarthTime(),
                  startEorzeaTime.timeOfHours(fish.endHour).toEarthTime(),
                ]
              } else {
                return fishWindow
              }
            })
          }
        } else {
          // So in real life, only 'Warden of the Seven Hues' i.e. "七彩天主" goes here,
          // let do some dirty work

          if (fish._id === 24994) {
            // just return the 'Green Prismfish' i.e. "绿彩鱼" fish windows
            return this.getFishWindowOfSingleFish(this.allFish[24204], now).map(fishWindow => {
              // if start of fish window > 0, i.e. its window is shrunk by the weather
              // change it back to 0, since other 2 predators are always available in [0,8]
              const startEorzeaTime = new EorzeaTime(EorzeaTime.toEorzeaTime(fishWindow[0]))
              if (startEorzeaTime.getHours() > 0) {
                return [startEorzeaTime.timeOfHours(0).toEarthTime(), fishWindow[1]]
              } else {
                return fishWindow
              }
            })
          } else {
            console.error('Unsupported fish!', fish._id)
            return this.getFishWindowOfSingleFish(fish, now)
          }
        }
      }
    },
    mergeConstraints(fish1, fish2) {
      const mergedFish = {
        ...fish1,
        previousWeatherSet: union(fish1.previousWeatherSet, fish2.previousWeatherSet),
        weatherSet: union(fish1.weatherSet, fish2.weatherSet),
        // TODO: actually some ranges are [20-8] but since we checked all fish with predators.
        // So just ignore those impossible cases here...
        startHour: Math.max(fish1.startHour, fish2.startHour),
        endHour: Math.min(fish1.endHour, fish2.endHour),
      }
      console.log(mergedFish)
      return mergedFish
    },
    getFishWindowOfSingleFish(fish, now) {
      return FishWindow.getNextNFishWindows(
        this.fishingSpots[fish.location]?.territory_id,
        new EorzeaTime(EorzeaTime.toEorzeaTime(now)),
        fish.startHour,
        fish.endHour,
        fish.previousWeatherSet,
        fish.weatherSet
      )
    },
    isConstrainsEqual(fish1, fish2) {
      return (
        isEqual(fish1.previousWeatherSet, fish2.previousWeatherSet) &&
        isEqual(fish1.weatherSet, fish2.weatherSet) &&
        fish1.startHour === fish2.startHour &&
        fish1.endHour === fish2.endHour
      )
    },
    onFiltersUpdate(filters) {
      this.setFilters(filters)
    },
    onDismiss() {
      this.setNotShowBanner()
    },
    ...mapMutations(['setFilters', 'setShowSearchDialog', 'setShowImportExportDialog', 'setNotShowBanner']),
  },
}
</script>

<style lang="sass" scoped>
$top-bars-padding: 24px + 48px
$footer-padding: 31px
$filter-panel-height: 261px

.list-wrapper::v-deep
  .v-expansion-panel-content__wrap
    padding-left: 0 !important
    padding-right: 0 !important

.filter-wrapper
  z-index: 4

  &:not(.show-filter)
    display: none

//.main-area::v-deep
  position: relative
  //overflow-y: scroll
  //margin-right: -8px

  &.show-filter
    top: 0

  //&.show-filter .better-scroll
  //  height: calc(100vh - #{$top-bars-padding + $filter-panel-height})

  &:not(.show-filter)
    top: 0

//&:not(.show-filter) .better-scroll
//  height: calc(100vh - #{$top-bars-padding})

.splitpanes__pane
  background-color: unset !important
  overflow-scrolling: auto
  overflow-y: scroll

.main-pane
  //max-height: 834px
  width: 100%

.splitpanes
  height: calc(100vh - #{ $top-bars-padding + $footer-padding })
//overflow-scrolling: auto
//overflow: scroll

.fish-detail-pane
  //max-height: calc(100vh - #{$top-bars-padding})
  width: 100%
</style>