<template>
  <div class="screen">
    <div>
      <grid-layout
        :layout.sync="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="false"
        :responsive="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
        :auto-size="false"
        @layout-ready="handleGridReady"
      >
        <grid-item
          v-for="(item, i) in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
          drag-allow-from=".vue-draggable-handle"
          drag-ignore-from=".no-drag"
          @resized="handleResized"
          @container-resized="handleContainerResized"
        >
          <v-sheet class="window-wrapper rounded elevation-4" color="background">
            <reader-timer-window
              v-if="windows[i].type === 'READER_TIMER'"
              :now="now"
              @close="() => removeItem(item.i)"
            />
            <reader-history-window
              v-if="windows[i].type === 'READER_HISTORY'"
              :now="now"
              @close="() => removeItem(item.i)"
            />
            <reader-spot-statistics-window
              v-if="windows[i].type === 'READER_SPOT_STATISTICS'"
              :now="now"
              @close="() => removeItem(item.i)"
            />
            <main-window
              v-if="windows[i].type === 'MAIN'"
              :page="mainPage"
              :active-tab-index="mainPageTabIndex"
              :is-mobile="windows[i].isMobile"
              :now="now"
              @close="() => removeItem(item.i)"
              :lazySourceFishList="lazySourceFishList"
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
              @startReloadPage="startReloadPage"
            />
          </v-sheet>
        </grid-item>
      </grid-layout>
      <v-btn
        elevation="2"
        fab
        fixed
        bottom
        right
        outlined
        @mouseenter="showWindowMenu = true"
      >
        <v-img
          src="https://cdn.jsdelivr.net/gh/ricecake404/images@main/img/pastry-fish.png"
          width="38"
          height="38"
          contain
        ></v-img>
        <!--        <v-icon large>mdi-cat</v-icon>-->
      </v-btn>
    </div>

    <v-dialog v-model="showWindowMenu" max-width="300">
      <v-sheet>
        <v-subheader>鱼糕</v-subheader>
        <v-list>
          <v-list-item @click="addFishList">
            <v-list-item-icon>
              <v-icon>mdi-format-list-text</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ $t('list.normalTitle') }}</v-list-item-content>
          </v-list-item>
          <v-list-item @click="addNotificationList">
            <v-list-item-icon>
              <v-icon>mdi-bell</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ $t('list.toBeNotifiedTitle') }}</v-list-item-content>
          </v-list-item>
          <v-list-item @click="addWiki">
            <v-list-item-icon>
              <v-icon>mdi-notebook</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ $t('top.fishWiki') }}</v-list-item-content>
          </v-list-item>
          <v-list-item @click="addOceanFishing">
            <v-list-item-icon>
              <v-icon>mdi-ferry</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ $t('top.oceanFishing') }}</v-list-item-content>
          </v-list-item>
          <v-list-item @click="addDiadem">
            <v-list-item-icon>
              <v-img
                :src="dark ? diademDark : diademLight"
                height="24"
                width="24"
              ></v-img>
            </v-list-item-icon>
            <v-list-item-content>{{ $t('top.diadem') }}</v-list-item-content>
          </v-list-item>
          <v-list-item @click="addAquarium">
            <v-list-item-icon>
              <v-icon>mdi-fishbowl</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ $t('top.aquarium') }}</v-list-item-content>
          </v-list-item>
          <v-list-item @click="addCompetition">
            <v-list-item-icon>
              <v-icon>mdi-trophy</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ $t('top.competition') }}</v-list-item-content>
          </v-list-item>

          <v-subheader>渔捞</v-subheader>
          <v-list-item @click="addReaderTimer">
            <v-list-item-icon>
              <v-icon>mdi-fish</v-icon>
            </v-list-item-icon>
            <v-list-item-content>计时器</v-list-item-content>
          </v-list-item>
          <v-list-item @click="addReaderHistory">
            <v-list-item-icon>
              <v-icon>mdi-fish</v-icon>
            </v-list-item-icon>
            <v-list-item-content>本地历史记录</v-list-item-content>
          </v-list-item>
          <v-list-item @click="addReaderSpotStatistics">
            <v-list-item-icon>
              <v-icon>mdi-fish</v-icon>
            </v-list-item-icon>
            <v-list-item-content>本地钓场统计</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-dialog>

    <v-overlay :value="loading || showJumpingOverlay" opacity="0.9" z-index="9999">
      <div class="d-flex flex-column align-center">
        <v-progress-circular indeterminate size="64" />
        <div>{{ $t('list.loading') }}</div>
        <div class="d-flex flex-column align-center">
          <div>如出现无限加载，或者任何问题，可以加群或关注以下页面</div>
          <a
            href="https://ricecake302.coding.net/s/eb3a7844-db84-4792-90db-7805f6a941c1/3"
            target="_blank"
          >
            如有错误，请前往此页面
          </a>
        </div>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import ReaderTimerWindow from '@/entries/screen/views/ReaderTimerWindow'
import ReaderHistoryWindow from '@/entries/screen/views/ReaderHistoryWindow'
import ReaderSpotStatisticsWindow from '@/entries/screen/views/ReaderSpotStatisticsWindow'
import MainWindow from '@/entries/screen/views/MainWindow'
import AppMixin from '@/components/AppMixin'

export default {
  name: 'Screen',
  mixins: [AppMixin],
  components: {
    MainWindow,
    ReaderSpotStatisticsWindow,
    ReaderHistoryWindow,
    ReaderTimerWindow,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  // props: [
  //   'now',
  //   'lazySourceFishList',
  //   'lazyTransformedFishList',
  //   'lazyTransformedFishDict',
  //   'pinnedFishList',
  //   'fishListTimePart',
  //   'extraFishListTimePart',
  //   'fishListWeatherChangePart',
  //   'sortedFilteredFishList',
  //   'toBeNotifiedFishList',
  //   'selectedFish',
  //   'filteredFishIdSet',
  // ],
  data: () => ({
    showSideBar: true,
    miniSideBar: true,
    layout: [],
    colNum: 12,
    index: 0,
    windows: [],
    showWindowMenu: false,
    showMainWindow: false,
    mainPage: 'ListPage',
    mainPageTabIndex: 0,
    gridReady: false,
  }),
  created() {
    // this.addReaderTimer()
    // this.addReaderHistory()
    // this.addReaderSpotStatistics()
    // this.addFishList()
    // this.addWiki()
    this.addCompetition()
  },
  methods: {
    handleGridReady() {
      this.gridReady = true
    },
    handleResized(i, newH, newW, newHPx, newWPx) {
      if (this.gridReady) {
        this.windows[i] = {
          ...this.windows[i],
          isMobile:
            newWPx <
            this.$vuetify.breakpoint.thresholds[
              this.$vuetify.breakpoint.mobileBreakpoint
            ],
        }
      }
    },
    handleContainerResized(i, newH, newW, newHPx, newWPx) {
      if (this.gridReady) {
        this.windows[i] = {
          ...this.windows[i],
          isMobile:
            newWPx < this.$vuetify.breakpoint.thresholds[this.$vuetify.breakpoint.mobile],
        }
      }
    },
    openMainWindow() {
      this.showMainWindow = true
    },
    addReaderTimer() {
      this.addItem('READER_TIMER', 3, 4)
    },
    addReaderHistory() {
      this.addItem('READER_HISTORY', 3, 12)
    },
    addReaderSpotStatistics() {
      this.addItem('READER_SPOT_STATISTICS', 3, 12)
    },
    addFishList() {
      this.mainPage = 'ListPage'
      this.mainPageTabIndex = 0
      this.addMainWindowIfNotExist()
    },
    addNotificationList() {
      this.mainPage = 'ListPage'
      this.mainPageTabIndex = 1
      this.addMainWindowIfNotExist()
    },
    addWiki() {
      this.mainPage = 'WikiPage'
      this.addMainWindowIfNotExist()
    },
    addOceanFishing() {
      this.mainPage = 'OceanFishingPage54'
      this.addMainWindowIfNotExist()
    },
    addDiadem() {
      this.mainPage = 'DiademPage'
      this.addMainWindowIfNotExist()
    },
    addAquarium() {
      this.mainPage = 'AquariumPage'
      this.addMainWindowIfNotExist()
    },
    addCompetition() {
      this.mainPage = 'CompetitionPage'
      this.addMainWindowIfNotExist()
    },
    addRecord() {
      this.mainPage = 'RecordPage'
      this.addMainWindowIfNotExist()
    },
    addMainWindowIfNotExist() {
      if (!this.hasItem('MAIN')) {
        this.addItem('MAIN', 4, 12, 0, 0)
      }
    },
    hasItem(type) {
      return !!this.windows.find(it => it.type === type)
    },
    addItem(type, w, h, x = 0, y = 0) {
      // Add a new item. It must have a unique key!
      this.layout.push({
        x: x, //(this.layout.length * 2) % (this.colNum || 12),
        y: y, //this.layout.length + (this.colNum || 12), // puts it at the bottom
        w: w,
        h: h,
        i: this.index,
      })
      // Increment the counter to ensure key is always unique.
      this.index++
      this.windows.push({ type, isMobile: true })
    },
    removeItem(val) {
      const index = this.layout.map(item => item.i).indexOf(val)
      this.layout.splice(index, 1)
      this.windows.splice(index, 1)
    },
  },
}
</script>

<style scoped lang="sass">
@import "~@/styles/RcVariables"

::v-deep .vue-grid-item.vue-grid-placeholder
  background: gray

.screen
  height: 100%

.window-wrapper
  height: 100%
  width: 100%

.vue-grid-layout
  height: calc(100vh - #{ $top-system-bar-padding})
  overflow-y: scroll
  background: rgba(117, 117, 117, 0.5)
</style>
