<template>
  <v-container
    fluid
    :class="{
      'px-1': isMobile,
      'filter-list-container': true,
      'filter-list-container--web': !isElectron,
      'filter-list-container--desktop': isElectron,
    }"
    style="position: relative"
    ref="scrollTarget"
    v-scroll.self="onScroll"
  >
    <div>
      <div class="filter-wrapper">
        <fish-filter
          :show="showFilter"
          :filters="filters"
          :is-mobile="isMobile"
          :isNormalTabActive="isNormalTabActive"
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
                  <v-icon left> mdi-check-all </v-icon>
                  选择所有
                </v-btn>
                <v-btn text small class="mx-1" @click="clearAllBaits">
                  <v-icon left> mdi-close </v-icon>
                  清除所有
                </v-btn>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-on="on" v-bind="attrs"> mdi-help-circle-outline </v-icon>
                  </template>
                  <div>
                    <div>{{ $t('baitSearch.dialog.hint1') }}</div>
                    <div>{{ $t('baitSearch.dialog.hint2') }}</div>
                  </div>
                </v-tooltip>
              </div>
              <v-chip-group v-model="selectedBaitIdIndices" column multiple>
                <template v-for="(fishIds, baitId, index) in bait2Fish">
                  <v-menu open-on-hover right offset-x offset-y :key="index">
                    <template v-slot:activator="{ on }">
                      <v-chip
                        active-class="primary--text"
                        outlined
                        class="ma-1"
                        :disabled="fishIds.length === 0"
                        v-on="on"
                        @click="baitFilterInputted = true"
                      >
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
              <v-icon icon="mdi-lock" color="white"> mdi-information </v-icon>
            </v-avatar>

            <div>
              <div>
                欢迎使用鱼糕钓鱼时钟，如有任何问题，首先尝试刷新<kbd>F5</kbd>或强制刷新页面<kbd>Ctrl</kbd>+<kbd>F5</kbd>。
              </div>
              <div>
                点击每列鱼可以打开右侧详细界面。其他功能如钓鱼笔记，云冠群岛，出海垂钓内容请通过左边的侧边栏访问。
              </div>
              <div>本站与其他钓鱼时钟的导入、导出功能在侧边栏的“设置”中。</div>
              <!--                      <div>-->
              <!--                        若使用桌面版，可直接同步游戏内图鉴，左侧导航栏进入“钓鱼笔记”页面，选择“同步游戏数据”。-->
              <!--                      </div>-->
              <v-btn outlined color="primary" block class="mt-1" @click="onDismiss">
                不再显示
              </v-btn>
            </div>

            <!--                    <template v-slot:actions>-->
            <!--                      <click-helper @click="onDismiss">-->
            <!--                        <v-btn text color="primary"> 不再显示 </v-btn>-->
            <!--                      </click-helper>-->
            <!--                    </template>-->
          </v-banner>
          <v-tabs-items v-model="activeTabIndex" touchless>
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
              <v-expansion-panels
                v-model="pinnedListExpansion"
                accordion
                class="my-2 rounded-lg"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <div class="d-flex align-center">
                      <div>固定列表</div>
                      <v-spacer />
                      <div class="mr-2">
                        <v-switch
                          v-model="showPinnedInNormalList"
                          inset
                          label="同时在默认列表中显示"
                          @click.stop
                        />
                      </div>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <fish-list
                      :fish-dict="lazyTransformedFishDict"
                      :fish-ids="pinnedFishIdList"
                      :fish-list-time-part="fishListTimePart"
                      :fish-list-weather-change-part="fishListWeatherChangePart"
                      @fish-selected="onFishSelected($event)"
                      :is-mobile="isMobile"
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

              <v-expansion-panels
                v-model="normalListExpansion"
                accordion
                class="my-2 rounded-lg"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header>默认列表</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <fish-list
                      :fish-dict="lazyTransformedFishDict"
                      :fish-ids="sortedFilteredFishIdList"
                      :fish-list-time-part="fishListTimePart"
                      :fish-list-weather-change-part="fishListWeatherChangePart"
                      show-fish-divider
                      enable-load-more
                      :is-mobile="isMobile"
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
                :fish-dict="lazyTransformedFishDict"
                :fish-ids="toBeNotifiedFishIdList"
                :fish-list-time-part="fishListTimePart"
                :fish-list-weather-change-part="fishListWeatherChangePart"
                clear-all-button
                @fish-selected="onFishSelected($event)"
                @clear-all="clearToBeNotified"
                type="notification"
                :is-mobile="isMobile"
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
    <v-fab-transition>
      <v-btn
        v-show="showBackToTopBtn"
        fab
        class="primary back-to-top-btn"
        :style="`right: ${rightPercentage}%; bottom: ${bottomOffset}px`"
        @click="backToTop"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import FIX from 'Data/fix'
import FishFilter from '@/components/FishFilter'
import FishList from '@/components/FishList'
import ItemIcon from '@/components/basic/ItemIcon'
import PageMixin from '@/components/OceanFishingFishList/PageMixin'
import _ from 'lodash'

export default {
  name: 'FishFilterList',
  mixins: [PageMixin],
  components: {
    ItemIcon,
    FishList,
    FishFilter,
  },
  props: [
    'lazyTransformedFishDict',
    'pinnedFishIdList',
    'fishListTimePart',
    'fishListWeatherChangePart',
    'sortedFilteredFishIdList',
    'toBeNotifiedFishIdList',
    'filteredFishIdSet',
    'activeTabIndex',
    'showRightPane',
  ],
  data: () => ({
    isElectron: DevelopmentModeUtil.isElectron(),
    selectedBaitIdIndices: [],
    allBaits: FIX.BAITS,
    offsetTop: 0,
    baitFilterInputted: false,
  }),
  computed: {
    ...mapState({
      allFish: 'fish',
      items: 'items',
      fishingSpots: 'fishingSpots',
      zones: 'zones',
      bigFish: 'bigFish',
      sounds: 'sounds',
      showFishPageRightPane: 'showFishPageRightPane',
      baitFilter: 'baitFilter',
      // baitFilterEnabled: 'baitFilterEnabled',
      // baitFilterIds: 'baitFilterIds',
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
    showBackToTopBtn() {
      return this.offsetTop > 0 && (this.isElectron || !this.isMobile)
    },
    rightPercentage() {
      return this.showRightPane ? 25 : 3
    },
    bottomOffset() {
      return this.isMobile ? 4 : 36
    },
    isNormalTabActive() {
      return this.activeTabIndex === DataUtil.TAB_INDEX_NORMAL
    },
    normalListExpansion: {
      get() {
        return this.listSetting.normal.expanded ? 0 : undefined
      },
      set(index) {
        this.setListExpandedStatus('normal', index === 0)
      },
    },
    pinnedListExpansion: {
      get() {
        return this.listSetting.pinned.expanded ? 0 : undefined
      },
      set(index) {
        this.setListExpandedStatus('pinned', index === 0)
      },
    },
    showPinnedInNormalList: {
      get() {
        return this.listSetting.pinned.showPinnedInNormalList
      },
      set(show) {
        this.updateShowPinnedInNormalList(show)
      },
    },
    baitFilterEnabledComputed: {
      get() {
        return this.baitFilter.enabled
      },
      set(enabled) {
        this.updateUserBaitFilterData({ path: 'enabled', data: enabled })
      },
    },
    baitFilterIds: {
      get() {
        return this.baitFilter.baitIds
      },
      set(ids) {
        this.updateUserBaitFilterData({
          path: 'baitIds',
          data: ids,
        })
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
          (this.listSetting.pinned.showPinnedInNormalList || !this.getFishPinned(fishId))
        ) {
          // console.log(fishId, this.allFish[fishId])
          baitFishItems.push({
            bait: fishData.bestCatchPath[0],
            fish: DataUtil.toItemId(fishId),
          })

          if (fishData.predators) {
            Object.keys(fishData.predators).map(predatorId => {
              const predator = this.allFish[predatorId]
              baitFishItems.push({
                bait: predator.bestCatchPath[0],
                fish: DataUtil.toItemId(fishId),
              })
            })
          }
        }
      })
      return _.mapValues(_.groupBy(baitFishItems, 'bait'), baitFishList =>
        _.uniq(baitFishList.map(it => it.fish))
      )
    },
  },
  watch: {
    bait2Fish: {
      handler(bait2Fish, old) {
        // console.log(
        //   Object.keys(bait2Fish),
        //   Object.keys(old ?? {}),
        //   Object.keys(old ?? {}).map(it => +it),
        //   this.baitFilterIds,
        //   _.difference(
        //     Object.keys(old ?? {}).map(it => +it),
        //     this.baitFilterIds
        //   )
        // )
        const allSelected =
          (old == null && this.baitFilterIds.length === 0) ||
          (old != null &&
            Object.keys(old).every(oldBaitId => this.baitFilterIds.includes(+oldBaitId)))

        if (!allSelected) {
          const indices = []
          Object.keys(bait2Fish).forEach((baitId, index) => {
            if (this.baitFilterIds.includes(+baitId)) {
              indices.push(index)
            }
          })
          this.selectedBaitIdIndices = indices
        } else {
          this.$nextTick(() => this.selectAllBaits(bait2Fish))
        }
      },
      immediate: true,
    },
    selectedBaitIdIndices(indices) {
      this.baitFilterIds = Object.keys(this.bait2Fish)
        .filter((_, index) => indices.includes(index))
        .map(it => +it)
    },
  },
  methods: {
    ...mapMutations([
      'updateListExpanded',
      'updateUserBaitFilterData',
      'updateUserData',
      'setFilters',
      'setShowSearchDialog',
      'setNotShowBanner',
      'clearToBeNotified',
      'setShowFishPageRightPane',
      'showSnackbar',
      'updateShowPinnedInNormalList',
    ]),
    backToTop() {
      this.$refs.scrollTarget.scroll({ top: 0, left: 0, behavior: 'smooth' })
    },
    onFishSelected({ fishId, components, firstSpotId }) {
      this.$emit('fish-selected', { fishId, components, firstSpotId })
    },
    clearAllBaits() {
      this.selectedBaitIdIndices = []
    },
    onFiltersUpdate(filters) {
      this.setFilters(filters)
    },
    setListExpandedStatus(list, expanded) {
      this.updateListExpanded({ listType: list, expanded })
    },
    onScroll(e) {
      this.offsetTop = e.target.scrollTop
    },
    selectAllBaits(bait2Fish) {
      this.baitFilterInputted = false
      this.selectedBaitIdIndices = Object.keys(bait2Fish ?? this.bait2Fish).map(
        (_, index) => index
      )
    },
    onDismiss() {
      this.setNotShowBanner()
    },
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.filter-list-container
  overflow-y: auto
  &--web
    height: calc(100vh - #{$toolbar-height + $footer-padding})
  &--desktop
    height: calc(100% - #{$toolbar-height})


.list-wrapper::v-deep
  .v-expansion-panel-content__wrap
    padding-left: 0 !important
    padding-right: 0 !important

.filter-wrapper
  //z-index: 4

.back-to-top-btn
  z-index: 2
  position: fixed
</style>
