<template>
  <div v-resize="onWindowResize" class="d-flex">
    <div
      :class="{
        'list-part': true,
        'list-part--web': !isElectron,
        'list-part--desktop': isElectron,
        'show-divider': showRightPane,
      }"
      :style="`flex: 1 1 ${mainPaneFlexPercentage}%`"
      v-show="!rightPaneFullScreen || !showRightPane"
      ref="fishPageScrollTarget"
    >
      <v-row v-if="spotId === -1" no-gutters>
        <v-col cols="12">
          <fish-filter-list
            :lazyTransformedFishDict="lazyTransformedFishDict"
            :pinnedFishIdList="pinnedFishIdList"
            :fishListTimePart="fishListTimePart"
            :fishListWeatherChangePart="fishListWeatherChangePart"
            :sortedFilteredFishIdList="sortedFilteredFishIdList"
            :toBeNotifiedFishIdList="toBeNotifiedFishIdList"
            :filteredFishIdSet="filteredFishIdSet"
            :activeTabIndex="1"
            :is-mobile="isMobile"
            :show-right-pane="showRightPane"
            @fish-selected="onFishSelected"
            :original="true"
          />
        </v-col>
        <v-col cols="12" class="px-1 px-md-3">
          <component
            :is="
              isMobile
                ? 'OceanFishingTimeTableContentSmall'
                : 'OceanFishingTimeTableContentLarge'
            "
            :voyages="voyages"
            :current-voyage-index="currentVoyageIndex"
            show-current-route-indicator
          />
          <v-sheet v-if="!hasIKDRouteAlarm" class="text-center py-4">
            {{ $t('list.toBeNotifiedIKDRoute.empty.prefix') }}
          </v-sheet>
          <rc-dialog
            v-if="voyages.length > 0"
            v-model="showClearConfirmDialog"
            max-width="330"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" block color="error" class="rounded-t-0">
                <v-icon>{{ mdiPlaylistRemove }}</v-icon>
                <span>{{ $t('list.toBeNotifiedIKDRoute.clearAll') }}</span>
                <span>（共{{ voyages.length }}条）</span>
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="headline">
                {{ $t('list.toBeNotifiedIKDRoute.dialog.title') }}
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="showClearConfirmDialog = false">
                  {{ $t('general.dialog.cancel') }}
                </v-btn>
                <v-btn color="error" text @click="onConfirmClear">
                  {{ $t('list.toBeNotifiedIKDRoute.dialog.confirm') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </rc-dialog>
        </v-col>
      </v-row>
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
    </div>
    <div class="detail-part" v-if="showRightPane">
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
import { INTERVAL_HOUR } from 'Data/constants'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { mdiPlaylistRemove } from '@mdi/js'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import FishDetail from '@/components/FishDetail'
import FishFilterList from '@/components/basic/FishFilterList'
import IKDRouteMixin from '@/mixins/IKDRouteMixin'
import NotificationUtil from '@/utils/NotificationUtil'
import OceanFishingTimeTableContentLarge from '@/components/OceanFishing54/OceanFishingTimeTable/OceanFishingTimeTableContentLarge'
import OceanFishingTimeTableContentSmall from '@/components/OceanFishing54/OceanFishingTimeTable/OceanFishingTimeTableContentSmall'
import OceanFishingUtil from '@/utils/OceanFishing54/OceanFishingUtil'
import PageMixin from '@/components/OceanFishingFishList/PageMixin'
import RcDialog from '@/components/basic/RcDialog'
import WikiSpotDetail from '@/components/WikiSpotDetail'
import _ from 'lodash'

export default {
  name: 'AlarmPage',
  components: {
    RcDialog,
    OceanFishingTimeTableContentLarge,
    OceanFishingTimeTableContentSmall,
    WikiSpotDetail,
    FishFilterList,
    FishDetail,
  },
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  mixins: [PageMixin, IKDRouteMixin],
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
    mdiPlaylistRemove,
    showClearConfirmDialog: false,
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
    currentVoyageIndex() {
      return this.voyages.findIndex(
        v => v.milliseconds <= this.now && this.now <= v.milliseconds + INTERVAL_HOUR
      )
    },
    hasIKDRouteAlarm() {
      return this.toBeNotifiedIKDRoutes.length > 0
    },
    voyages() {
      const vs = this.hasIKDRouteAlarm
        ? this.assembleVoyages(
            OceanFishingUtil.shiftTimeForCheckInLimit(Date.now()),
            24,
            this.toBeNotifiedIKDRoutes,
            true
          )
        : []

      const remainRoutes = _.clone(this.toBeNotifiedIKDRoutes)
      const uniqueVoyages = []
      while (remainRoutes.length > 0) {
        const routeId = remainRoutes.shift()
        uniqueVoyages.push(vs.find(v => v.id === routeId))
      }
      return uniqueVoyages
    },
    mainPaneFlexPercentage() {
      return Math.floor(
        (100 * (1 - this.rightPanePercentageV2)) / this.rightPanePercentageV2
      )
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
      'toBeNotifiedIKDRoutes',
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
    onConfirmClear() {
      this.clearIKDRouteToBeNotified()
      this.showClearConfirmDialog = false
    },
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
      'clearIKDRouteToBeNotified',
    ]),
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.list-part
  overflow-y: auto
  &--web
    height: calc(100vh - #{$toolbar-height + $footer-height})
  &--desktop
    height: calc(100vh - #{$wrapper-desktop})

.show-divider
  border-right: 1px solid gray

.detail-part
  overflow-y: auto
  flex: 0 1 100%
</style>
