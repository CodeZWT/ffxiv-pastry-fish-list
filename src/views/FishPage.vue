<template>
  <div v-resize="onWindowResize">
    <splitpanes
      ref="splitPanes"
      class="default-theme"
      @resize="onResize"
      @splitter-click="resizing = true"
      @resized="resizing = false"
    >
      <pane :size="100 - rightPaneSizeOfCurrentWindowSize" v-if="!rightPaneFullScreen || !showRightPane">
        <div v-if="resizing" style="height: 100%">
          <v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`" class="pa-3" style="height: 100%">
            <v-skeleton-loader class="mx-auto" type="list-item-avatar-three-line@9" boilerplate></v-skeleton-loader>
          </v-sheet>
        </div>
        <div v-else class="main-pane">
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
                  <v-tabs-items v-model="activeTabIndex">
                    <v-tab-item key="pin" class="list-wrapper">
                      <!--                  <v-expansion-panels flat hover multiple v-model="fishListOpenStatus" class="mt-2">-->
                      <!--                    <v-expansion-panel>-->
                      <!--                      <v-expansion-panel-header>-->
                      <!--                        {{ $t('list.pinTitle') }}-->
                      <!--                      </v-expansion-panel-header>-->
                      <!--                      <v-expansion-panel-content class="list-wrapper">-->
                      <fish-list
                        :fish-list="pinnedFishList"
                        :fish-list-time-part="fishListTimePart"
                        :fish-list-weather-change-part="fishListWeatherChangePart"
                        @fish-selected="onFishSelected($event)"
                      >
                        <template v-slot:empty>
                          <span>
                            {{ $t('list.pin.empty.prefix') }}
                            <v-icon small style="transform: rotate(-45deg)" class="mx-1">mdi-pin-outline</v-icon>
                            {{ $t('list.pin.empty.suffix') }}
                          </span>
                        </template>
                      </fish-list>
                    </v-tab-item>
                    <!--                      </v-expansion-panel-content>-->
                    <!--                    </v-expansion-panel>-->
                    <!--                    <v-expansion-panel>-->
                    <!--                      <v-expansion-panel-header>-->
                    <!--                        {{ $t('list.normalTitle') }}-->
                    <!--                      </v-expansion-panel-header>-->
                    <!--                      <v-expansion-panel-content class="list-wrapper">-->
                    <v-tab-item key="normal" class="list-wrapper">
                      <fish-list
                        :fish-list="sortedFilteredFishList"
                        :fish-list-time-part="fishListTimePart"
                        :fish-list-weather-change-part="fishListWeatherChangePart"
                        show-fish-divider
                        @fish-selected="onFishSelected($event)"
                      >
                        <template v-slot:empty>
                          <span>
                            {{ $t('list.normal.empty') }}
                          </span>
                        </template>
                      </fish-list>
                      <!--                      </v-expansion-panel-content>-->
                      <!--                    </v-expansion-panel>-->
                      <!--                  </v-expansion-panels>-->
                    </v-tab-item>
                  </v-tabs-items>
                </div>
              </div>
              <import-export-dialog v-model="showImportExportDialog" />
            </div>
          </v-container>
        </div>
      </pane>
      <pane v-if="showRightPane" :size="rightPaneSizeOfCurrentWindowSize">
        <div v-if="resizing" style="height: 100%">
          <v-banner>
            <v-avatar slot="icon" color="quaternary" size="40">
              <v-icon color="white">
                mdi-alert
              </v-icon>
            </v-avatar>

            <div>
              {{ $t('detail.adjust.actHint') }}
            </div>

            <template v-slot:actions>
              <click-helper @click="resizing = false">
                <v-btn color="primary"> {{ $t('detail.adjust.quit') }}</v-btn>
              </click-helper>
            </template>
          </v-banner>
          <v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`" class="pa-3" style="height: 100%">
            <v-skeleton-loader type="card-avatar, article, actions" boilerplate></v-skeleton-loader>
          </v-sheet>
        </div>
        <div v-else class="fish-detail-pane">
          <fish-detail :fish="selectedFish" ref="fishDetail" @close="showRightPane = false" />
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
import { union, isEqual, throttle } from 'lodash'
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
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  data: () => ({
    now: Date.now(),
    weatherChangeTrigger: 1,
    fishListWeatherChangePart: {},
    openPanelIndex: undefined,
    fishListOpenStatus: [0, 1],
    selectedFishId: undefined,
    showRightPane: false,
    throttledResizeFn: undefined,
    resizing: false,
    rightPaneFullScreen: window.innerWidth < 1264,
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
    filteredFishIdSet() {
      const idSet = new Set()
      this.fishSourceList
        .filter(fish => {
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
        .forEach(it => idSet.add(it._id))
      return idSet
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
      const idSet = this.filteredFishIdSet
      return this.sortedFishIds
        .filter(id => idSet.has(id))
        .map(id => this.allFish[id])
        .filter(it => !this.getFishPinned(it._id))
        .filter((it, index) => this.filters.fishN === -1 || index < this.filters.fishN)
    },
    pinnedFishList() {
      const fishSourceList = this.fishSourceList
      const sortedFishIds = this.sortedFishIds
      return sortBy(
        fishSourceList.filter(it => this.getFishPinned(it._id)),
        [fish => sortedFishIds.indexOf(fish._id)]
      )
    },
    notifications() {
      const fishListTimePart = this.fishListTimePart
      return [this.pinnedFishList, this.sortedFilteredFishList].map(list => {
        const firstNotFishingIndex = list.findIndex(it => fishListTimePart[it._id].countDown.type !== DataUtil.FISHING)
        return {
          type: DataUtil.COUNT_DOWN_TYPE[DataUtil.FISHING],
          cnt: firstNotFishingIndex === -1 ? list.length : firstNotFishingIndex,
        }
      })
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
    rightPaneSize: {
      get() {
        return this.rightPanePercentage
      },
      set(percentage) {
        this.setRightPanePercentage(percentage)
      },
    },
    rightPaneSizeOfCurrentWindowSize() {
      if (this.rightPaneFullScreen) {
        if (this.showRightPane) return 100
        else return 0
      } else {
        if (this.showRightPane) return this.rightPaneSize
        else return 0
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
      activeTabIndex: 'activeTabIndex',
    }),
    ...mapGetters(['getFishCompleted', 'filters', 'showFilter', 'showBanner', 'getFishPinned', 'rightPanePercentage']),
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
    notifications(notifications) {
      this.$emit('notification', notifications)
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
    this.throttledResizeFn = throttle(this.resizeInternal, 100)
  },
  mounted() {
    this.onWindowResize()
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
    onFishSelected(fishId) {
      this.selectedFishId = fishId
      this.showRightPane = true
    },
    resizeInternal(resizePaneInfos) {
      this.rightPaneSize = resizePaneInfos[1].size
      this.$refs.fishDetail?.resize()
    },
    onResize(resizePaneInfos) {
      this.resizing = true
      this.throttledResizeFn(resizePaneInfos)
    },
    onWindowResize() {
      this.rightPaneFullScreen = window.innerWidth < 1264
      // this.$refs.splitPanes.$el.style.height =
      //   window.innerHeight - 24 - 48 - document.getElementById('fish-footer').offsetHeight
      setTimeout(() => {
        this.$refs.fishDetail?.resize()
      }, 500)
    },
    ...mapMutations([
      'setFilters',
      'setShowSearchDialog',
      'setShowImportExportDialog',
      'setNotShowBanner',
      'setRightPanePercentage',
    ]),
  },
}
</script>

<style lang="sass" scoped>
$top-bars-padding: 24px + 48px + 48px
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