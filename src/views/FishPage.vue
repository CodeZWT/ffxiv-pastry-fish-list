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
                <fish-filter
                  :show="showFilter"
                  :filters="filters"
                  @input="onFiltersUpdate"
                >
                  <div>
                    <!--                    fish baits-->
                    <!--                    <div>{{ selectedBaitIdIndices }}</div>-->
                    <div class="d-flex align-center">
                      <div class="text-subtitle-2 ml-1 mr-3">启用鱼饵筛选</div>
                      <v-switch v-model="baitFilterEnabledComputed" inset />
                    </div>
                    <div v-if="baitFilterEnabledComputed">
                      <div class="d-flex align-center">
                        <v-btn text small class="mx-1" @click="selectAllBaits()">
                          <v-icon left>
                            mdi-check-all
                          </v-icon>
                          选择所有
                        </v-btn>
                        <v-btn text small class="mx-1" @click="clearAllBaits">
                          <v-icon left>
                            mdi-close
                          </v-icon>
                          清除所有
                        </v-btn>
                      </div>
                      <v-chip-group v-model="selectedBaitIdIndices" column multiple>
                        <template v-for="(fishIds, baitId) in bait2Fish">
                          <v-menu open-on-hover right offset-x offset-y :key="baitId">
                            <template v-slot:activator="{ on }">
                              <v-chip
                                active-class="primary--text"
                                outlined
                                class="ma-1"
                                :disabled="fishIds.length === 0"
                                v-on="on"
                              >
                                <!--                        <div :class="getItemIconClass(baitId)" />-->
                                <item-icon :icon-class="getItemIconClass(baitId)" small />
                                {{ getItemName(baitId) }}
                                ({{ fishIds.length }})
                              </v-chip>
                            </template>
                            <v-card>
                              <v-card-text>
                                <div
                                  class="d-flex align-center flex-wrap"
                                  style="max-width: 500px"
                                >
                                  <div
                                    v-for="fishId in fishIds"
                                    :key="fishId"
                                    class="d-flex align-center mx-1"
                                  >
                                    <item-icon
                                      :icon-class="getItemIconClass(fishId)"
                                      :title="getItemName(fishId)"
                                    />
                                    <span>{{ getItemName(fishId) }}</span>
                                  </div>
                                </div>
                              </v-card-text>
                            </v-card>
                          </v-menu>
                        </template>

                        <!--                        <v-chip-->
                        <!--                          v-for="(fishIds, baitId) in bait2Fish"-->
                        <!--                          :key="baitId"-->
                        <!--                          active-class="primary&#45;&#45;text"-->
                        <!--                          outlined-->
                        <!--                          class="ma-1"-->
                        <!--                        >-->
                        <!--                          &lt;!&ndash;                        <div :class="getItemIconClass(baitId)" />&ndash;&gt;-->
                        <!--                          <item-icon :icon-class="getItemIconClass(baitId)" small />-->
                        <!--                          {{ getItemName(baitId) }}-->
                        <!--                          ({{ fishIds.length }})-->
                        <!--                        </v-chip>-->
                      </v-chip-group>
                    </div>
                  </div>
                </fish-filter>
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
                      <div>
                        欢迎使用鱼糕钓鱼时钟，如有任何问题，首先尝试刷新<kbd>F5</kbd>或强制刷新页面<kbd>Ctrl</kbd>+<kbd>F5</kbd>。
                      </div>
                      <div>
                        点击每列鱼可以打开右侧详细界面。其他功能如钓鱼笔记，云冠群岛，出海垂钓内容请通过左边的侧边栏访问。
                      </div>
                      <div>
                        本站与其他钓鱼时钟的导入、导出功能在侧边栏的设置中。
                      </div>
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
                    <!--                    <v-tab-item-->
                    <!--                      key="pin"-->
                    <!--                      class="list-wrapper"-->
                    <!--                      :transition="false"-->
                    <!--                      :reverse-transition="false"-->
                    <!--                    >-->
                    <!--                      -->
                    <!--                    </v-tab-item>-->
                    <v-tab-item
                      key="normal"
                      class="list-wrapper"
                      :transition="false"
                      :reverse-transition="false"
                    >
                      <v-expansion-panels :value="0" accordion class="my-2 rounded-lg">
                        <v-expansion-panel>
                          <v-expansion-panel-header>固定列表</v-expansion-panel-header>
                          <v-expansion-panel-content>
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
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>

                      <v-expansion-panels :value="0" accordion class="my-2 rounded-lg">
                        <v-expansion-panel>
                          <v-expansion-panel-header>默认列表</v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <fish-list
                              :fish-list="sortedFilteredFishList"
                              :fish-list-time-part="fishListTimePart"
                              :fish-list-weather-change-part="fishListWeatherChangePart"
                              show-fish-divider
                              enable-load-more
                              @fish-selected="onFishSelected($event)"
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
                              <v-icon small class="mx-1">mdi-cog</v-icon>
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
            <v-skeleton-loader
              type="card-avatar, article, actions"
              boilerplate
            ></v-skeleton-loader>
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
import _ from 'lodash'
import ClickHelper from '@/components/basic/ClickHelper'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import FishDetail from '@/components/FishDetail'
import NotificationUtil from '@/utils/NotificationUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import DataUtil from '@/utils/DataUtil'
import FIX from '@/store/fix'

export default {
  name: 'fish-page',
  components: {
    ItemIcon,
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
    'filteredFishIdSet',
  ],
  data: () => ({
    openPanelIndex: undefined,
    fishListOpenStatus: [0, 1],
    throttledResizeFn: undefined,
    resizing: false,
    rightPaneFullScreen: window.innerWidth < 1264,
    loading: true,
    forceShowComponents: undefined,
    selectedBaitIdIndices: [],
    allBaits: FIX.BAITS,
  }),
  computed: {
    baitFilterEnabledComputed: {
      get() {
        return this.baitFilterEnabled
      },
      set(enabled) {
        this.setBaitFilterEnabled(enabled)
      },
    },
    // baitFilterIdsComputed: {
    //   get() {
    //     return this.baitFilterIds
    //   },
    //   set(ids) {
    //     this.setBaitFilterIds(ids)
    //   },
    // },
    bait2Fish() {
      const baitFishItems = []
      // console.log(this.filteredFishIdSet)
      this.filteredFishIdSet.forEach(fishId => {
        const fishData = this.allFish[fishId]
        if (
          fishData.gig == null &&
          !this.getFishPinned(fishId) &&
          DataUtil.showFishInList(fishData)
        ) {
          // console.log(fishId, this.allFish[fishId])
          baitFishItems.push({
            bait: fishData.bestCatchPath[0],
            fish: DataUtil.toItemId(fishId),
          })
        }
      })
      return _.mapValues(_.groupBy(baitFishItems, 'bait'), baitFishList =>
        _.uniq(baitFishList.map(it => it.fish))
      )
    },
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
      fishingSpots: 'fishingSpots',
      zones: 'zones',
      bigFish: 'bigFish',
      activeTabIndex: 'activeTabIndex',
      sounds: 'sounds',
      showFishPageRightPane: 'showFishPageRightPane',
      baitFilterEnabled: 'baitFilterEnabled',
      baitFilterIds: 'baitFilterIds',
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
    bait2Fish: {
      handler(bait2Fish) {
        // console.log(Object.keys(bait2Fish))
        this.$nextTick(() => this.selectAllBaits(bait2Fish))
      },
      immediate: true,
    },
    selectedBaitIdIndices(indices) {
      this.setBaitFilterIds(
        Object.keys(this.bait2Fish)
          .filter((_, index) => indices.includes(index))
          .map(it => +it)
      )
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
    document.title = `${this.$t('top.systemBarTitle')} - ${this.$t('top.fishList')}`

    this.throttledResizeFn = _.throttle(this.resizeInternal, 100)
    this.onWindowResize()
  },
  methods: {
    selectAllBaits(bait2Fish) {
      this.selectedBaitIdIndices = Object.keys(bait2Fish ?? this.bait2Fish).map(
        (_, index) => index
      )
    },
    clearAllBaits() {
      this.selectedBaitIdIndices = []
    },
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
      'setShowFishPageRightPane',
      'showSnackbar',
      'setBaitFilterEnabled',
      'setBaitFilterIds',
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
