<template>
  <div class="window">
    <v-system-bar class="window-top-bar rounded-t vue-draggable-handle">
      <span class="mx-1">{{ pageTitle }}</span>
      <span class="mx-1" v-if="isMobile">mobile</span>
      <v-spacer />
      <v-btn @click="showSetting" x-small text>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn @click="close" x-small text>
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-system-bar>

    <div class="window-content no-drag">
      <fish-page
        v-if="page === 'ListPage'"
        :now="now"
        :is-mobile="isMobile"
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
        :is-mobile="isMobile"
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
        :is-mobile="isMobile"
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
        :is-mobile="isMobile"
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
        :is-mobile="isMobile"
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
        :is-mobile="isMobile"
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
        :is-mobile="isMobile"
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
    'isMobile',
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
  computed: {
    pageTitle() {
      let title = ''
      switch (this.page) {
        case 'FishPage':
          title =
            this.activeTabIndex === 0
              ? this.$t('list.normalTitle')
              : this.$t('list.toBeNotifiedTitle')
          break
        case 'WikiPage':
          title = this.$t('top.fishWiki')
          break
        case 'OceanFishingPage54':
          title = this.$t('top.oceanFishing')
          break
        case 'RecordPage':
          title = this.$t('top.record')
          break
        case 'CompetitionPage':
          title = this.$t('top.competition')
          break
        case 'AquariumPage':
          title = this.$t('top.aquarium')
          break
        case 'DiademPage':
          title = this.$t('top.diadem')
          break
      }
      return title
    },
  },
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
  overflow: hidden

.window-content
  //height: 100%
  height: calc(100% - #{ $top-system-bar-padding })
  overflow-y: scroll

.window-top-bar
  -webkit-app-region: none
</style>
