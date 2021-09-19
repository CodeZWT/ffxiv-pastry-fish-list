<template>
  <div class="window">
    <v-system-bar class="window-top-bar rounded-t">
      <span class="mx-1">本地历史记录</span>
      <v-spacer />
      <v-btn @click="showSetting" x-small text>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn @click="close" x-small text>
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-system-bar>

    <div class="window-content">
      <fish-page
        v-if="page === 'ListPage'"
        :now="now"
        :lazyFishSourceList="lazySourceFishList"
        :lazyTransformedFishList="lazyTransformedFishList"
        :lazyTransformedFishDict="lazyTransformedFishDict"
        :fishListTimePart="fishListTimePart"
        :extraFishListTimePart="extraFishListTimePart"
        :fishListWeatherChangePart="fishListWeatherChangePart"
        :pinnedFishList="pinnedFishList"
        :sortedFilteredFishList="sortedFilteredFishList"
        :toBeNotifiedFishList="toBeNotifiedFishList"
        :selectedFish="selectedFish"
        :filteredFishIdSet="filteredFishIdSet"
        :active-tab-index="0"
        :right-pane-full-screen="true"
        @fish-selected="onFishSelected"
      />
      <wiki-page
        v-if="page === 'WikiPage'"
        :now="now"
        :lazyFishSourceList="lazySourceFishList"
        :lazyTransformedFishList="lazyTransformedFishList"
        :lazyTransformedFishDict="lazyTransformedFishDict"
        :fishListTimePart="fishListTimePart"
        :extraFishListTimePart="extraFishListTimePart"
        :fishListWeatherChangePart="fishListWeatherChangePart"
        :pinnedFishList="pinnedFishList"
        :sortedFilteredFishList="sortedFilteredFishList"
        :toBeNotifiedFishList="toBeNotifiedFishList"
        :selectedFish="selectedFish"
        :filteredFishIdSet="filteredFishIdSet"
        :right-pane-full-screen="true"
        @fish-selected="onFishSelected"
      />
      <OceanFishingPage54
        v-else-if="page === 'OceanFishingPage54'"
        :now="now"
        :lazyFishSourceList="lazySourceFishList"
        :lazyTransformedFishList="lazyTransformedFishList"
        :lazyTransformedFishDict="lazyTransformedFishDict"
        :fishListTimePart="fishListTimePart"
        :extraFishListTimePart="extraFishListTimePart"
        :fishListWeatherChangePart="fishListWeatherChangePart"
        :pinnedFishList="pinnedFishList"
        :sortedFilteredFishList="sortedFilteredFishList"
        :toBeNotifiedFishList="toBeNotifiedFishList"
        :selectedFish="selectedFish"
        :filteredFishIdSet="filteredFishIdSet"
        @fish-selected="onFishSelected"
      />
      <DiademPage
        v-else-if="page === 'DiademPage'"
        :now="now"
        :lazyFishSourceList="lazySourceFishList"
        :lazyTransformedFishList="lazyTransformedFishList"
        :lazyTransformedFishDict="lazyTransformedFishDict"
        :fishListTimePart="fishListTimePart"
        :extraFishListTimePart="extraFishListTimePart"
        :fishListWeatherChangePart="fishListWeatherChangePart"
        :pinnedFishList="pinnedFishList"
        :sortedFilteredFishList="sortedFilteredFishList"
        :toBeNotifiedFishList="toBeNotifiedFishList"
        :selectedFish="selectedFish"
        :filteredFishIdSet="filteredFishIdSet"
        @fish-selected="onFishSelected"
      />
      <AquariumPage
        v-else-if="page === 'AquariumPage'"
        :now="now"
        :lazyFishSourceList="lazySourceFishList"
        :lazyTransformedFishList="lazyTransformedFishList"
        :lazyTransformedFishDict="lazyTransformedFishDict"
        :fishListTimePart="fishListTimePart"
        :extraFishListTimePart="extraFishListTimePart"
        :fishListWeatherChangePart="fishListWeatherChangePart"
        :pinnedFishList="pinnedFishList"
        :sortedFilteredFishList="sortedFilteredFishList"
        :toBeNotifiedFishList="toBeNotifiedFishList"
        :selectedFish="selectedFish"
        :filteredFishIdSet="filteredFishIdSet"
        @fish-selected="onFishSelected"
      />
      <CompetitionPage
        v-else-if="page === 'CompetitionPage'"
        :now="now"
        :lazyFishSourceList="lazySourceFishList"
        :lazyTransformedFishList="lazyTransformedFishList"
        :lazyTransformedFishDict="lazyTransformedFishDict"
        :fishListTimePart="fishListTimePart"
        :extraFishListTimePart="extraFishListTimePart"
        :fishListWeatherChangePart="fishListWeatherChangePart"
        :pinnedFishList="pinnedFishList"
        :sortedFilteredFishList="sortedFilteredFishList"
        :toBeNotifiedFishList="toBeNotifiedFishList"
        :selectedFish="selectedFish"
        :filteredFishIdSet="filteredFishIdSet"
        @fish-selected="onFishSelected"
      />
      <RecordPage
        v-else-if="page === 'RecordPage'"
        :now="now"
        :lazyFishSourceList="lazySourceFishList"
        :lazyTransformedFishList="lazyTransformedFishList"
        :lazyTransformedFishDict="lazyTransformedFishDict"
        :fishListTimePart="fishListTimePart"
        :extraFishListTimePart="extraFishListTimePart"
        :fishListWeatherChangePart="fishListWeatherChangePart"
        :pinnedFishList="pinnedFishList"
        :sortedFilteredFishList="sortedFilteredFishList"
        :toBeNotifiedFishList="toBeNotifiedFishList"
        :selectedFish="selectedFish"
        :filteredFishIdSet="filteredFishIdSet"
        @fish-selected="onFishSelected"
      />
    </div>
  </div>
</template>

<script>
import FishPage from '@/entries/main/views/FishPage'
import WikiPage from '@/entries/main/views/WikiPage'
import OceanFishingPage54 from '@/entries/main/views/OceanFishingPage54'
import RecordPage from '@/entries/main/views/RecordPage'
import CompetitionPage from '@/entries/main/views/CompetitionPage'
import AquariumPage from '@/entries/main/views/AquariumPage'
import DiademPage from '@/entries/main/views/DiademPage'

export default {
  name: 'MainWindow',
  components: {
    DiademPage,
    AquariumPage,
    CompetitionPage,
    RecordPage,
    OceanFishingPage54,
    WikiPage,
    FishPage,
  },
  props: [
    'page',
    'activeTabIndex',

    'now',
    'lazySourceFishList',
    'lazyTransformedFishList',
    'lazyTransformedFishDict',
    'pinnedFishList',
    'fishListTimePart',
    'extraFishListTimePart',
    'fishListWeatherChangePart',
    'sortedFilteredFishList',
    'toBeNotifiedFishList',
    'selectedFish',
    'filteredFishIdSet',
  ],
  methods: {
    close() {
      this.$emit('close')
    },
    showSetting() {
      // TODO show setting dialog directly
    },
    onFishSelected(e) {
      this.$emit('fish-selected', e)
    },
  },
}
</script>

<style scoped lang="sass">
@import "~@/styles/RcVariables"

.window
  height: 100%

.window-content
  //height: 100%
  height: calc(100% - #{ $top-system-bar-padding })
  overflow-y: scroll

.window-top-bar
  -webkit-app-region: none
</style>
