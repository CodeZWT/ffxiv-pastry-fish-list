<template>
  <div v-resize="onWindowResize" class="d-flex">
    <div
      :class="{
        'list-part': true,
        'list-part--web': true,
        'show-divider': showRightPane,
      }"
      v-show="!lazyRightPaneFullScreen || !showRightPane"
    >
      <fish-filter-list
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
      />
    </div>
    <div class="detail-part" v-if="showRightPane">
      <fish-detail
        ref="fishDetail"
        :fish="selectedFish"
        :forceShowComponents="forceShowComponents"
        in-pane
        show-close
        @close="showRightPane = false"
      />
    </div>
  </div>
</template>

<script>
import 'splitpanes/dist/splitpanes.css'
import { mapGetters, mapMutations, mapState } from 'vuex'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import FishDetail from '@/components/FishDetail'
import FishFilterList from '@/components/basic/FishFilterList'
import NotificationUtil from '@/utils/NotificationUtil'
import PageMixin from '@/components/OceanFishingFishList/PageMixin'
import _ from 'lodash'

export default {
  name: 'fish-page',
  components: {
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
    'rightPaneFullScreen',
    'now',
  ],
  data: () => ({
    isElectron: DevelopmentModeUtil.isElectron(),
    openPanelIndex: undefined,
    fishListOpenStatus: [0, 1],
    throttledResizeFn: undefined,
    resizing: false,
    lazyRightPaneFullScreen: false,
    loading: true,
    forceShowComponents: undefined,
  }),
  computed: {
    rightPaneSize: {
      get() {
        return this.rightPanePercentage
      },
      set(percentage) {
        this.setRightPanePercentage(percentage)
      },
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
      'listSetting',
    ]),
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
    this.lazyRightPaneFullScreen = this.rightPaneFullScreen
    this.throttledResizeFn = _.throttle(this.resizeInternal, 100)
    this.onWindowResize()
  },
  methods: {
    onFishSelected({ fishId, components, firstSpotId }) {
      this.$emit('fish-selected', { fishId, firstSpotId })
      this.forceShowComponents = components
      if (!this.isElectron) {
        this.showRightPane = true
      }
    },
    resizeInternal(resizePaneInfos) {
      this.rightPaneSize = resizePaneInfos[1].size
      this.$refs.fishDetail?.resize()
    },
    onResize() {
      // resizePaneInfos
      // this.resizing = true
      // this.throttledResizeFn(resizePaneInfos)
    },
    onWindowResize() {
      this.lazyRightPaneFullScreen = window.innerWidth < 1264
      // this.$refs.splitPanes.$el.style.height =
      //   window.innerHeight - 24 - 48 - document.getElementById('fish-footer').offsetHeight
      setTimeout(() => {
        this.$refs.fishDetail?.resize()
      }, 500)
    },
    ...mapMutations([
      'updateListExpanded',
      'updateUserBaitFilterData',
      'updateUserData',
      'setFilters',
      'setShowSearchDialog',
      'setNotShowBanner',
      'setRightPanePercentage',
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
  flex: 1 1 500%
  &--web
    height: calc(100vh - #{$toolbar-height + $footer-padding})

.show-divider
  border-right: 1px solid gray

.detail-part
  overflow-y: auto
  flex: 0 1 200%
</style>
