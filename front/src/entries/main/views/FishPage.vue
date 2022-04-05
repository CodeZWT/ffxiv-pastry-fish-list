<template>
  <div v-resize="onWindowResize" class="d-flex">
    <div
      :class="{
        'list-part': true,
        'list-part--web': !isElectron,
        'list-part--desktop': isElectron,
        'show-divider': showRightPane,
      }"
      :style="`max-width: ${showRightPane ? 100 - mainPaneFlexPercent : 100}%`"
      v-show="!rightPaneFullScreen || !showRightPane"
      ref="fishPageScrollTarget"
    >
      <fish-filter-list
        v-if="spotId === -1"
        :lazyTransformedFishDict="lazyTransformedFishDict"
        :pinnedFishIdList="pinnedFishIdList"
        :fishListTimePart="fishListTimePart"
        :fishListWeatherChangePart="fishListWeatherChangePart"
        :sortedFilteredFishIdList="sortedFilteredFishIdList"
        :toBeNotifiedFishIdList="toBeNotifiedFishIdList"
        :filteredFishIdSet="filteredFishIdSet"
        :activeTabIndex="activeTabIndex"
        :is-mobile="isMobile"
        :show-right-pane="showRightPane"
        @fish-selected="onFishSelected"
        :original="true"
      />
      <wiki-spot-detail
        v-else
        show-close
        :current-spot-id="spotId"
        :mode="wikiSpotMode"
        :is-mobile="isMobile"
        :is-electron="isElectron"
        :lazy-transformed-fish-dict="lazyTransformedFishDict"
        :fish-list-time-part="fishListTimePart"
        :fish-list-weather-change-part="fishListWeatherChangePart"
        @fish-selected="onFishSelected"
        @close="spotId = -1"
      />
      <v-spacer />
      <rc-footer :columns="showRightPane ? 3 : 4" />
    </div>
    <div
      v-if="showRightPane"
      :style="`max-width: ${rightPaneFullScreen ? 100 : mainPaneFlexPercent}%`"
    >
      <fish-detail
        ref="fishDetail"
        :fish="selectedFish"
        :forceShowComponents="forceShowComponents"
        in-pane
        show-close
        :show-spot-button="!isMobile"
        @close="showRightPane = false"
        @show-spot="showSpot($event)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import FishDetail from '@/components/FishDetail'
import FishFilterList from '@/components/basic/FishFilterList'
import NotificationUtil from '@/utils/NotificationUtil'
import PageMixin from '@/components/OceanFishingFishList/PageMixin'
import RcFooter from '@/components/RcFooter'
import WikiSpotDetail from '@/components/WikiSpotDetail'
import _ from 'lodash'

export default {
  name: 'fish-page',
  components: {
    RcFooter,
    WikiSpotDetail,
    FishFilterList,
    FishDetail,
  },
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  mixins: [PageMixin],
  props: [
    'original',
    'lazyFishSourceList',
    'lazyTransformedFishList',
    'lazyTransformedFishDict',
    'pinnedFishIdList',
    'fishListTimePart',
    'extraFishListTimePart',
    'fishListWeatherChangePart',
    'sortedFilteredFishIdList',
    'toBeNotifiedFishIdList',
    'selectedFish',
    'filteredFishIdSet',
    'activeTabIndex',
    // 'rightPaneFullScreen',
    'now',
  ],
  data: () => ({
    isElectron: DevelopmentModeUtil.isElectron(),
    openPanelIndex: undefined,
    fishListOpenStatus: [0, 1],
    throttledResizeFn: undefined,
    resizing: false,
    rightPaneFullScreen: false,
    loading: true,
    forceShowComponents: undefined,
    spotId: -1,
    wikiSpotMode: 'normal',
  }),
  computed: {
    mainPaneFlexPercent() {
      return this.rightPanePercentageV2 * 100
    },
    showRightPane: {
      get() {
        return this.showFishPageRightPane
      },
      set(show) {
        this.setShowFishPageRightPane(show)
      },
    },
    ...mapState({
      allFish: 'fish',
      items: 'items',
      sounds: 'sounds',
      showFishPageRightPane: 'showFishPageRightPane',
    }),
    ...mapGetters([
      'listSetting',
      'getFishCompleted',
      'filters',
      'showFilter',
      'showBanner',
      'getFishPinned',
      'rightPanePercentageV2',
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
      'listSetting',
    ]),
  },
  watch: {
    mainPaneFlexPercentage() {
      this.showRightPane = false
    },
  },
  created() {
    if (NotificationUtil.isNotificationSupported()) {
      NotificationUtil.requestNotificationPermission().then(status => {
        if (status === 'default') {
          this.showSnackbar({
            text: this.$t(
              'setting.dialog.notification.message.requestNotificationPermissionNotSelected'
            ),
            color: 'warn',
          })
        } else if (status === 'denied') {
          this.showSnackbar({
            text: this.$t(
              'setting.dialog.notification.message.requestNotificationPermissionDenied'
            ),
            color: 'error',
          })
        }
      })
    }
  },
  mounted() {
    this.showRightPane = false
    this.throttledResizeFn = _.throttle(this.resizeInternal, 100)
    this.onWindowResize()
  },
  methods: {
    showSpot({ spotId, mode }) {
      this.spotId = spotId
      this.wikiSpotMode = mode
      this.$nextTick(() => {
        this.$refs.fishPageScrollTarget.scroll({ top: 0, left: 0 })
      })
    },
    onFishSelected({ fishId, components, firstSpotId }) {
      this.$emit('fish-selected', { fishId, firstSpotId })
      this.forceShowComponents = components
      if (this.original) {
        this.showRightPane = true
      }
    },
    resizeInternal() {
      // resizePaneInfos
      // this.rightPaneSize = resizePaneInfos[1].size
      this.$refs.fishDetail?.resize()
    },
    onResize() {
      // resizePaneInfos
      // this.resizing = true
      // this.throttledResizeFn(resizePaneInfos)
    },
    onWindowResize() {
      this.rightPaneFullScreen =
        window.innerWidth < this.$vuetify.breakpoint.thresholds.sm
      setTimeout(() => {
        this.throttledResizeFn()
      }, 500)
    },
    ...mapMutations([
      'updateListExpanded',
      'updateUserBaitFilterData',
      'updateUserData',
      'setFilters',
      'setShowSearchDialog',
      'setNotShowBanner',
      'setRightPanePercentageV2',
      'clearToBeNotified',
      'setShowFishPageRightPane',
      'showSnackbar',
      'updateShowPinnedInNormalList',
    ]),
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.list-part
  overflow-y: auto
  &--web
    min-height: calc(100vh - #{$toolbar-height + $footer-height})
    max-height: calc(100vh - #{$toolbar-height + $footer-height})
  &--desktop
    min-height: calc(100vh - #{$wrapper-desktop})
    max-height: calc(100vh - #{$wrapper-desktop})

.show-divider
  border-right: 1px solid gray
</style>
