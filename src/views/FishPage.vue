<template>
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
      <better-scroll :data="listSizeChangeTrigger">
        <div style="width: 100%">
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
                />
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
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </better-scroll>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import EorzeaTime, { WEATHER_CHANGE_INTERVAL } from '@/utils/Time'
import FishWindow from '@/utils/FishWindow'
import sortBy from 'lodash/sortBy'
import DataUtil from '@/utils/DataUtil'
import FishFilter from '@/components/FishFilter'
import FishList from '@/components/FishList'
import FishSearch from '@/components/FishSearch'
import BetterScroll from '@/components/basic/BetterScroll'
// import BetterScroll from '@/components/basic/BetterScroll'

export default {
  name: 'fish-page',
  components: { BetterScroll, FishSearch, FishList, FishFilter },
  data: () => ({
    now: Date.now(),
    weatherChangeTrigger: 0,
    fishListWeatherChangePart: {},
    openPanelIndex: undefined,
    fishListOpenStatus: [0, 1],
  }),
  computed: {
    listSizeChangeTrigger() {
      // TODO: fix trigger actually triggered every second...
      return {
        fishListOpenStatus: this.fishListOpenStatus,
        pinnedFishList: this.pinnedFishList.length,
        sortedFilteredFishList: this.sortedFilteredFishList.length,
      }
    },
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return new Date(this.now)
    },
    fishSourceList() {
      return Object.values(this.allFish).filter(
        it => it.location != null && it.gig == null && it.patch < DataUtil.PATCH_MAX
      )
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
        .map(id => this.fishList.find(it => it._id === id))
        .filter(it => it != null)
        .filter((it, index) => this.filters.fishN === -1 || index < this.filters.fishN)
    },
    pinnedFishList() {
      return sortBy(
        this.fishSourceList.filter(it => this.pinnedFishIds.includes(it._id)),
        [fish => this.pinnedFishIds.indexOf(fish._id)]
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
    ...mapState({
      allFish: 'fish',
      items: 'items',
      fishingSpots: 'fishingSpots',
      zones: 'zones',
      bigFish: 'bigFish',
      showSearch: 'showSearchDialog',
    }),
    ...mapGetters(['getFishCompleted', 'filters', 'pinnedFishIds', 'showFilter']),
  },
  watch: {
    weatherChangeTrigger() {
      this.fishListWeatherChangePart = this.fishSourceList.reduce((fish2WeatherPart, fish) => {
        fish2WeatherPart[fish._id] = {
          fishWindows: this.getFishWindow(fish, this.now),
        }
        return fish2WeatherPart
      }, {})
    },
  },
  created() {
    document.title = `${this.$t('top.systemBarTitle')} - ${this.$t('top.toolBarTitle')}`
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
    getCountDown(fish, now) {
      // utilize 8 hours fish windows computed if exists
      // and not out of time(use 2 fish window cached if necessary)
      if (
        fish.previousWeatherSet.length === 0 &&
        fish.weatherSet.length === 0 &&
        fish.startHour === 0 &&
        fish.endHour === 24
      ) {
        return { type: DataUtil.ALL_AVAILABLE }
      }
      const fishingSpot = this.fishingSpots[fish.location]
      if (fishingSpot) {
        const fishWindowsComputed = this.fishListWeatherChangePart[fish._id]
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
            type: DataUtil.WAITING,
            time: nextFishWindow[0] - now,
            fishWindowTotal: nextFishWindow[1] - nextFishWindow[0],
          }
        } else if (now <= nextFishWindow[1]) {
          return {
            type: DataUtil.FISHING,
            time: nextFishWindow[1] - now,
            fishWindowTotal: nextFishWindow[1] - nextFishWindow[0],
          }
        }
      }
    },
    getFishWindow(fish, now) {
      // console.debug(fish)
      const fishingSpot = this.fishingSpots[fish.location]
      if (
        fishingSpot == null ||
        (fish.previousWeatherSet.length === 0 &&
          fish.weatherSet.length === 0 &&
          fish.startHour === 0 &&
          fish.endHour === 24)
      ) {
        return []
      }
      return FishWindow.getNextNFishWindows(
        fishingSpot.territory_id,
        new EorzeaTime(EorzeaTime.toEorzeaTime(now)),
        fish.startHour,
        fish.endHour,
        fish.previousWeatherSet,
        fish.weatherSet
      )
    },
    onFiltersUpdate(filters) {
      this.setFilters(filters)
    },
    ...mapMutations(['setFilters', 'setShowSearchDialog']),
  },
}
</script>

<style lang="sass" scoped>
$top-bars-padding: 88px + 31px
$filter-panel-height: 261px

.list-wrapper::v-deep
  .v-expansion-panel-content__wrap
    padding-left: 0 !important
    padding-right: 0 !important

.filter-wrapper
  margin-right: 8px
  z-index: 4

  &:not(.show-filter)
    display: none

.main-area::v-deep
  position: relative
  overflow: hidden

  &.show-filter
    top: 0

  &.show-filter .better-scroll
    height: calc(100vh - #{$top-bars-padding + $filter-panel-height})

  &:not(.show-filter)
    top: 0

  &:not(.show-filter) .better-scroll
    height: calc(100vh - #{$top-bars-padding})
</style>
