<template>
  <div v-resize="onWindowResize">
    <splitpanes
      ref="splitPanes"
      class="default-theme"
      @resize="onResize"
      @splitter-click="resizing = true"
      @resized="resizing = false"
    >
      <pane
        :size="100 - rightPaneSizeOfCurrentWindowSize"
        v-if="!rightPaneFullScreen || !showRightPane"
      >
        <div v-if="resizing" style="height: 100%">
          <v-sheet
            :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
            class="pa-3"
            style="height: 100%"
          >
            <v-skeleton-loader
              class="mx-auto"
              type="list-item-avatar-three-line@9"
              boilerplate
            ></v-skeleton-loader>
          </v-sheet>
        </div>
        <div v-else class="main-pane">
          <v-container :class="{ 'py-0': true, 'px-0': isMobile }">
            <div>
              <div class="filter-wrapper">
                <fish-filter :show="showFilter" :filters="filters" @input="onFiltersUpdate" />
              </div>
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
                    <v-tab-item
                      key="pin"
                      class="list-wrapper"
                      :transition="false"
                      :reverse-transition="false"
                    >
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
                    <v-tab-item
                      key="normal"
                      class="list-wrapper"
                      :transition="false"
                      :reverse-transition="false"
                    >
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
                    <v-tab-item
                      key="notification"
                      class="list-wrapper"
                      :transition="false"
                      :reverse-transition="false"
                    >
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
          <v-sheet
            :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
            class="pa-3"
            style="height: 100%"
          >
            <v-skeleton-loader type="card-avatar, article, actions" boilerplate></v-skeleton-loader>
          </v-sheet>
        </div>
        <div v-else class="fish-detail-pane">
          <fish-detail
            :fish="selectedFish"
            ref="fishDetail"
            @close="showRightPane = false"
            in-pane
            :now="now"
            :forceShowComponents="forceShowComponents"
          />
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import FishFilter from '@/components/FishFilter'
import FishList from '@/components/FishList'
import { throttle } from 'lodash'
import ClickHelper from '@/components/basic/ClickHelper'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import FishDetail from '@/components/FishDetail'

export default {
  name: 'fish-page',
  components: {
    FishDetail,
    ClickHelper,
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
  props: [
    'now',
    'lazyFishSourceList',
    'lazyTransformedFishList',
    'lazyTransformedFishDict',
    'pinnedFishList',
    'fishListTimePart',
    'extraFishListTimePart',
    'fishListWeatherChangePart',
    'sortedFilteredFishList',
    'toBeNotifiedFishList',
    'selectedFish',
  ],
  data: () => ({
    openPanelIndex: undefined,
    fishListOpenStatus: [0, 1],

    showRightPane: false,
    throttledResizeFn: undefined,
    resizing: false,
    rightPaneFullScreen: window.innerWidth < 1264,
    loading: true,
    forceShowComponents: undefined,
  }),
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
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
      items: 'items',
      fishingSpots: 'fishingSpots',
      zones: 'zones',
      bigFish: 'bigFish',
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
  watch: {},
  created() {},
  mounted() {
    document.title = `${this.$t('top.systemBarTitle')} - ${this.$t('top.fishList')}`

    this.throttledResizeFn = throttle(this.resizeInternal, 100)
    this.onWindowResize()
  },
  methods: {
    onFiltersUpdate(filters) {
      this.setFilters(filters)
    },
    onDismiss() {
      this.setNotShowBanner()
    },
    onFishSelected({ fishId, components }) {
      this.$emit('fish-selected', fishId)
      this.forceShowComponents = components
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
      'setNotShowBanner',
      'setRightPanePercentage',
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

//&:not(.show-filter)
//  display: none

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
