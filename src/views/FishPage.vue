<template>
  <div v-resize="onWindowResize">
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
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
          <v-container :class="{ 'py-0': true, 'px-0': isMobile }">
            <div>
              <div :class="{ 'filter-wrapper': true, 'show-filter': showFilter }">
                <fish-filter :filters="filters" @input="onFiltersUpdate" />
              </div>
              <fish-search
                v-model="showSearchDialog"
                :fish-data="lazyFishSourceList"
                :fish-dict="lazyTransformedFishDict"
                :fish-list-time-part="fishListTimePart"
                :fish-list-weather-change-part="fishListWeatherChangePart"
                @change="onSearchFishChanged"
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
                      欢迎使用鱼糕钓鱼时钟，如有任何问题，首先尝试刷新(F5)或强制刷新页面(Ctrl+F5)。或可进群（1153646847）询问。
                    </div>
                    <div>
                      点击每列鱼可以打开右侧详细界面，窗口比例可以调整，最近10次窗口期的表格也在其中，请点击“查看窗口期详情”展开。
                    </div>
                    <div>
                      本站与其他钓鱼时钟的导入、导出功能在侧边栏的设置中。
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
                      <fish-list
                        :fish-list="pinnedFishList"
                        :fish-list-time-part="fishListTimePart"
                        :fish-list-weather-change-part="fishListWeatherChangePart"
                        @fish-selected="onFishSelected($event)"
                      >
                        <template v-slot:empty>
                          <span>
                            {{ $t('list.pinned.empty.prefix') }}
                            <v-icon small class="mx-1">mdi-pin-outline</v-icon>
                            {{ $t('list.pinned.empty.suffix') }}
                          </span>
                        </template>
                      </fish-list>
                    </v-tab-item>
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
                    </v-tab-item>
                    <v-tab-item key="notification" class="list-wrapper">
                      <fish-list
                        :fish-list="toBeNotifiedFishList"
                        :fish-list-time-part="fishListTimePart"
                        :fish-list-weather-change-part="fishListWeatherChangePart"
                        clear-all-button
                        @fish-selected="onFishSelected($event)"
                        @clear-all="clearToBeNotified"
                      >
                        <template v-slot:empty>
                          <div class="d-flex flex-column align-center">
                            <span>
                              {{ $t('list.toBeNotified.empty.prefix') }}
                              <v-icon small class="mx-1">mdi-bell-outline</v-icon>
                              {{ $t('list.toBeNotified.empty.suffix') }}
                            </span>
                            <span>
                              {{ $t('list.toBeNotified.empty.helpPrefix') }}
                              <v-icon small class="mx-1">mdi-dots-vertical</v-icon>
                              {{ $t('list.toBeNotified.empty.helpSuffix') }}
                            </span>
                          </div>
                        </template>
                      </fish-list>
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
          <fish-detail :fish="selectedFish" ref="fishDetail" @close="showRightPane = false" in-pane />
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
import { isEqual, throttle, union } from 'lodash'
import ImportExportDialog from '@/components/ImportExportDialog'
import ClickHelper from '@/components/basic/ClickHelper'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import FishDetail from '@/components/FishDetail'
import { Howl } from 'howler'
import NotificationUtil from '@/utils/NotificationUtil'

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
    loading: true,
    lazyFishSourceList: [],
    lazyTransformedFishList: [],
    lazyTransformedFishDict: {},
    sortedFishIds: [],
    fishListTimePart: {},
    notifiedBefore: 0,
    searchedFishId: undefined,
  }),
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    filteredFishIdSet() {
      const idSet = new Set()
      this.lazyTransformedFishList
        .filter(fish => {
          return (
            this.filters.patches.includes(fish.patch) &&
            (this.filters.completeType === 'ALL' ||
              (this.filters.completeType === 'COMPLETED' && this.getFishCompleted(fish.id)) ||
              (this.filters.completeType === 'UNCOMPLETED' && !this.getFishCompleted(fish.id))) &&
            (this.filters.bigFishType === 'ALL' ||
              (this.filters.bigFishType === 'BIG_FISH' && this.bigFish.includes(fish.id)) ||
              (this.filters.bigFishType === 'ALL_AVAILABLE_BIG_FISH' &&
                this.bigFish.includes(fish.id) &&
                this.fishListTimePart[fish.id]?.countDown?.type === DataUtil.ALL_AVAILABLE) ||
              (this.filters.bigFishType === 'NOT_BIG_FISH' && !this.bigFish.includes(fish.id)))
          )
        })
        .forEach(it => idSet.add(it._id))
      return idSet
    },
    sortedFilteredFishList() {
      const idSet = this.filteredFishIdSet
      return this.sortedFishIds
        .filter(id => idSet.has(id))
        .map(id => this.lazyTransformedFishDict[id])
        .filter(it => !this.getFishPinned(it.id))
        .filter((it, index) => this.filters.fishN === -1 || index < this.filters.fishN)
    },
    pinnedFishList() {
      const fishSourceList = this.lazyTransformedFishList
      const sortedFishIds = this.sortedFishIds
      return sortBy(
        fishSourceList.filter(it => this.getFishPinned(it.id)),
        [fish => sortedFishIds.indexOf(fish.id)]
      )
    },
    toBeNotifiedFishList() {
      const fishSourceList = this.lazyTransformedFishList
      const sortedFishIds = this.sortedFishIds
      return sortBy(
        fishSourceList.filter(it => this.getFishToBeNotified(it.id)),
        [fish => sortedFishIds.indexOf(fish.id)]
      )
    },
    listFishCnt() {
      const fishListTimePart = this.fishListTimePart
      return [this.pinnedFishList, this.sortedFilteredFishList, this.toBeNotifiedFishList].map(list => {
        if (Object.keys(fishListTimePart).length === 0) {
          return {
            type: DataUtil.COUNT_DOWN_TYPE[DataUtil.FISHING],
            cnt: 0,
          }
        }

        const firstNotFishingIndex = list.findIndex(it => fishListTimePart[it.id].countDown.type !== DataUtil.FISHING)
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
            predators: DataUtil.getPredators(
              fish,
              this.lazyTransformedFishDict,
              this.fishListTimePart,
              this.fishListWeatherChangePart
            ),
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
      sounds: 'sounds',
    }),
    ...mapGetters([
      'getFishCompleted',
      'filters',
      'showFilter',
      'showBanner',
      'getFishPinned',
      'rightPanePercentage',
      'getItemName',
      'getItemIconClass',
      'getZoneName',
      'getFishingSpotsName',
      'getBaits',
      'getWeather',
      'getFishToBeNotified',
      'notification',
      'getItemIconUrl',
      'isSystemNotificationEnabled',
    ]),
  },
  watch: {
    fishListTimePart: {
      handler: function(fishListTimePart) {
        const newSortedFishIds = sortBy(fishListTimePart, ['countDown.type', 'countDown.time']).map(it => it.id)
        if (!isEqual(this.sortedFishIds, newSortedFishIds)) {
          this.sortedFishIds = newSortedFishIds
        }
      },
      deep: true,
    },
    weatherChangeTrigger() {
      this.updateWeatherChangePart(this.now)
    },
    listFishCnt(listFishCnt) {
      this.$emit('fishCntUpdated', listFishCnt)
    },
  },
  created() {
    this.loading = true
  },
  async mounted() {
    document.title = `${this.$t('top.systemBarTitle')} - ${this.$t('top.fishList')}`
    this.now = Date.now()
    this.lazyFishSourceList = Object.values(this.allFish).filter(it => it.gig == null && it.patch <= DataUtil.PATCH_MAX)
    this.lazyTransformedFishList = this.assembleFish(this.lazyFishSourceList)
    this.lazyTransformedFishDict = DataUtil.toMap(this.lazyTransformedFishList, fish => fish.id)
    const sounds = await this.loadingSounds()
    this.setSounds(DataUtil.toMap(sounds, it => it.key))
    this.updateWeatherChangePart(this.now)

    setInterval(() => {
      const now = Date.now()
      this.now = now
      this.updateFishListTimePart(now)
      this.checkNotification(now)
      this.loading = false
    }, 1000)

    // this.weatherChangeTrigger *= -1
    setInterval(() => {
      this.weatherChangeTrigger *= -1
    }, WEATHER_CHANGE_INTERVAL_EARTH)
    this.throttledResizeFn = throttle(this.resizeInternal, 100)
    this.onWindowResize()
  },
  methods: {
    updateWeatherChangePart(now) {
      this.fishListWeatherChangePart = this.lazyFishSourceList.reduce((fish2WeatherPart, fish) => {
        fish2WeatherPart[fish._id] = {
          fishWindows: this.getFishWindow(fish, now),
        }
        return fish2WeatherPart
      }, {})
    },
    loadingSounds() {
      return Promise.all(
        DataUtil.NOTIFICATION_SOUNDS.map(sound => {
          if (sound.filename == null) return Promise.resolve({ key: sound.key, player: null })
          return import(`@/assets/sound/${sound.filename}`).then(it => {
            return { key: sound.key, player: new Howl({ src: it?.default, preload: true }) }
          })
        })
      )
    },
    checkNotification(now) {
      const rangeToEnsureAlarm = DataUtil.INTERVAL_SECOND * 2
      let notifications = []
      this.toBeNotifiedFishList.forEach(fish => {
        const countDown = this.fishListTimePart[fish.id]?.countDown
        if (countDown?.type === DataUtil.ALL_AVAILABLE) return false

        this.notification.settings.forEach(setting => {
          if (setting.enabled) {
            const fishWindows = this.fishListWeatherChangePart[fish.id]?.fishWindows ?? []
            fishWindows
              .map(fishWindow => fishWindow[0] - now)
              .filter((it, index) => it > 0 && index < 2)
              .some(interval => {
                // console.log(fish.id)
                const notifyMin = setting.before * DataUtil.INTERVAL_MINUTE
                const notifyMax = notifyMin + rangeToEnsureAlarm

                // let d = new Date(interval)
                // console.log(d.getUTCMinutes(), d.getUTCSeconds())
                // d = new Date(notifyMax)
                // console.log(d.getUTCMinutes(), d.getUTCSeconds())
                // console.log(interval < notifyMax && interval > notifyMin)
                if (interval < notifyMax && interval > notifyMin) {
                  // soundsToPlay.add(setting.sound)
                  notifications.push({ fish, setting })
                  return true
                } else {
                  return false
                }
              })
          }
        })
      })
      const toRingBell = notifications.length > 0

      if (toRingBell && this.notifiedBefore === 0) {
        this.ringBell(notifications.map(it => it.setting.sound))
        if (this.isSystemNotificationEnabled) {
          NotificationUtil.showFishNotification(notifications)
        }
        this.notifiedBefore = 3
      } else if (this.notifiedBefore > 0) {
        this.notifiedBefore--
      }
    },
    ringBell(soundsToPlay) {
      soundsToPlay.forEach(key => {
        this.sounds[key]?.player?.volume(this.notification.volume).play()
      })
    },
    updateFishListTimePart(now) {
      this.lazyFishSourceList.forEach(fish => {
        const countDown = this.fishListTimePart[fish._id]?.countDown
        if (countDown?.type === DataUtil.ALL_AVAILABLE) return

        const lazyStartTime = countDown?.timePoint
        const interval = lazyStartTime - now
        const intervalDate = new Date(interval)

        const hours = intervalDate.getUTCHours()
        const minutes = intervalDate.getUTCMinutes()
        const seconds = intervalDate.getUTCSeconds()

        if (
          (this.selectedFishId != null && fish._id === this.selectedFishId) ||
          (this.searchedFishId != null && fish._id === this.searchedFishId) ||
          !lazyStartTime ||
          interval < DataUtil.INTERVAL_MINUTE ||
          (interval < DataUtil.INTERVAL_HOUR && seconds > 57) ||
          (interval < DataUtil.INTERVAL_DAY && minutes > 58 && seconds > 57) ||
          (hours > 22 && minutes > 58 && seconds > 57)
        ) {
          this.$set(this.fishListTimePart, fish._id, {
            id: fish._id,
            countDown: this.getCountDown(fish, now),
          })
        }
      })
    },
    assembleFish(fishSourceList, isPredator = false) {
      return fishSourceList.map(fish => {
        const hasPredators = Object.keys(fish.predators).length > 0
        return {
          // TODO remove _id
          _id: fish._id,
          id: fish._id,
          icon: this.getItemIconClass(fish._id),
          iconRemoteUrl: this.getItemIconUrl(fish._id),
          name: this.getItemName(fish._id),
          hasFishingSpot: fish.location != null,
          zone: this.getZoneName(fish.location),
          fishingSpot: this.getFishingSpotsName(fish.location),
          fishingSpotId: fish.location,
          baits: this.getBaits(fish),
          hasFishEyes: fish.fishEyes !== false,
          fishEyesIcon: DataUtil.iconIdToClass(DataUtil.ICON_FISH_EYES),
          fishEyesText: DataUtil.secondsToFishEyesString(fish.fishEyes),
          fishEyesSeconds: fish.fishEyes,
          hasPredators: hasPredators,
          predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
          hasSnagging: fish.snagging,
          snaggingIcon: DataUtil.iconIdToClass(DataUtil.ICON_SNAGGING),
          startHourText: DataUtil.formatET(fish.startHour),
          endHourText: DataUtil.formatET(fish.endHour),
          hasTimeConstraint: fish.startHour !== 0 || fish.endHour !== 24,
          requiredCnt: fish.requiredCnt ?? 0,
          addBuffSuffix: hasPredators && DataUtil.isAllAvailableFish(fish),
          weatherSetDetail: this.getWeather(fish.weatherSet),
          hasWeatherConstraint: fish.previousWeatherSet.length > 0 || fish.weatherSet.length > 0,
          previousWeatherSet: fish.previousWeatherSet,
          weatherSet: fish.weatherSet,
          previousWeatherSetDetail: this.getWeather(fish.previousWeatherSet),
          patch: fish.patch,
          isPredator: isPredator,
          predators: this.assembleFish(DataUtil.getPredators(fish, this.allFish), true),
        }
      })
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

        let targetFishWindow
        let nextTargetFishWindow

        for (let i = 0; i < fishWindowsComputed.length; i++) {
          if (fishWindowsComputed[i][1] >= now) {
            targetFishWindow = fishWindowsComputed[i]
            if (i + 1 < fishWindowsComputed.length) {
              nextTargetFishWindow = fishWindowsComputed[i + 1]
            }
            break
          }
        }

        if (targetFishWindow == null) {
          return { type: DataUtil.ALL_AVAILABLE }
        }
        if (now <= targetFishWindow[0]) {
          return {
            type: DataUtil.WAITING,
            time: targetFishWindow[0] - now,
            timePoint: targetFishWindow[0],
            fishWindowTotal: targetFishWindow[1] - targetFishWindow[0],
          }
        } else if (now <= targetFishWindow[1]) {
          return {
            type: DataUtil.FISHING,
            time: targetFishWindow[1] - now,
            timePoint: targetFishWindow[1],
            fishWindowTotal: targetFishWindow[1] - targetFishWindow[0],
            nextInterval: nextTargetFishWindow ? nextTargetFishWindow[0] - now : undefined,
            nextTimePoint: nextTargetFishWindow ? nextTargetFishWindow[0] : undefined,
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
    onSearchFishChanged(fishId) {
      this.searchedFishId = fishId
    },
    ...mapMutations([
      'setFilters',
      'setShowSearchDialog',
      'setShowImportExportDialog',
      'setNotShowBanner',
      'setRightPanePercentage',
      'setSounds',
      'clearToBeNotified',
    ]),
  },
}
</script>

<style lang="sass" scoped>
@import "../styles/RcVariables"

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