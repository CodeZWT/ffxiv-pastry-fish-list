<template>
  <div class="screen">
    <div>
      <grid-layout
        :layout.sync="windows"
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
          v-for="item in windows"
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
          <v-sheet
            v-if="item.type === 'READER_TIMER_MINI'"
            class="window-wrapper rounded elevation-4"
            color="transparent"
          >
            <reader-timer-mini-window
              v-if="item.type === 'READER_TIMER_MINI'"
              :now="readerNow"
              :dark="dark"
              @close="() => removeItem(item.i)"
            />
          </v-sheet>
          <v-sheet v-else class="window-wrapper rounded elevation-4" color="background">
            <reader-timer-window
              v-if="item.type === 'READER_TIMER'"
              :now="readerNow"
              :dark="dark"
              @close="() => removeItem(item.i)"
            />

            <reader-history-window
              v-if="item.type === 'READER_HISTORY'"
              :now="readerNow"
              @close="() => removeItem(item.i)"
            />
            <reader-spot-statistics-window
              v-if="item.type === 'READER_SPOT_STATISTICS'"
              :now="readerNow"
              @close="() => removeItem(item.i)"
            />
            <main-window
              v-if="item.type === 'MAIN'"
              :page="mainPage"
              :active-tab-index="mainPageTabIndex"
              :is-mobile="item.isMobile"
              :now="now"
              @close="() => removeItem(item.i)"
              :lazySourceFishList="lazySourceFishList"
              :lazyTransformedFishList="lazyTransformedFishList"
              :lazyTransformedFishDict="lazyTransformedFishDict"
              :fishListTimePart="fishListTimePart"
              :extraFishListTimePart="extraFishListTimePart"
              :fishListWeatherChangePart="fishListWeatherChangePart"
              :pinnedFishIdList="pinnedFishIdList"
              :sortedFilteredFishIdList="sortedFilteredFishIdList"
              :toBeNotifiedFishIdList="toBeNotifiedFishIdList"
              :selectedFish="selectedFish"
              :filteredFishIdSet="filteredFishIdSet"
              @fish-selected="onFishSelected"
              @startReloadPage="startReloadPage"
            />
          </v-sheet>
        </grid-item>
      </grid-layout>

      <v-menu v-model="showWindowMenu" max-width="300">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
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
        </template>
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
              <v-list-item-content>{{
                $t('list.toBeNotifiedTitle')
              }}</v-list-item-content>
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
            <v-list-item @click="showMainSetting">
              <v-list-item-icon>
                <v-icon>mdi-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-content>{{ $t('top.uiConfig') }}</v-list-item-content>
            </v-list-item>

            <v-subheader>渔捞</v-subheader>
            <v-list-item @click="addReaderTimer">
              <v-list-item-icon>
                <v-icon>mdi-timer</v-icon>
              </v-list-item-icon>
              <v-list-item-content>计时器</v-list-item-content>
            </v-list-item>
            <v-list-item @click="addReaderTimerMini">
              <v-list-item-icon>
                <v-icon>mdi-timer</v-icon>
              </v-list-item-icon>
              <v-list-item-content>迷你计时器</v-list-item-content>
            </v-list-item>
            <v-list-item @click="addReaderHistory">
              <v-list-item-icon>
                <v-icon>mdi-history</v-icon>
              </v-list-item-icon>
              <v-list-item-content>本地历史记录</v-list-item-content>
            </v-list-item>
            <v-list-item @click="addReaderSpotStatistics">
              <v-list-item-icon>
                <v-icon>mdi-map</v-icon>
              </v-list-item-icon>
              <v-list-item-content>本地钓场统计</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-menu>
    </div>

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

    <fish-search
      v-model="showSearch"
      :fish-data="lazySourceFishList"
      :fish-dict="lazyTransformedFishDict"
      :fish-list-time-part="fishListTimePart"
      :extraFishListTimePart="extraFishListTimePart"
      :fish-list-weather-change-part="fishListWeatherChangePart"
      :now="now"
      @change="handleSearch"
    />

    <fish-setting-dialog v-model="showSettingDialog" />
    <patch-note-dialog
      v-model="showPatchNoteDialog"
      :in-migration-page="inMigrationPage"
      @confirm="onConfirmPatchNote"
    />
    <help-dialog v-model="showHelpDialog" />
    <v-dialog
      v-model="showAboutDialog"
      :fullscreen="isMobile"
      max-width="600px"
      scrollable
    >
      <v-card>
        <v-card-title>关于</v-card-title>
        <v-card-text class="contact-area">
          <div>ID：红豆年糕 @ 海猫茶屋</div>
          <div><i class="fab fa-qq" aria-hidden="true"></i> 群: 1153646847</div>
          <div>
            <i class="fab fa-weibo" aria-hidden="true"></i>
            红豆年糕找不到
          </div>
          <div>
            合作：<i class="fab fa-weibo" aria-hidden="true"></i>
            光之渔夫bot
          </div>
          <div>欢迎使用本站</div>
          <div>
            钓场的范围提示由 <span class="font-weight-bold">轩辕十四@沃仙曦染</span> 提供
          </div>
          <div>感谢各开源项目及攻略网站的帮助：</div>
          <ul>
            <li>
              钓鱼数据：
              <ul>
                <li>
                  <a @click="goTo('https://ff14fish.carbuncleplushy.com/')">
                    FFX|V Fish Tracker App
                  </a>
                </li>
                <li>
                  <a @click="goTo('https://ffxiv.cyanclay.xyz/db/')">Garland 数据</a>
                </li>
                <li><a @click="goTo('https://cn.ff14angler.com/')">饥饿的猫</a></li>
                <li>
                  <a @click="goTo('https://ffxivteamcraft.com/')">FFXIV TEAMCRAFT</a>
                </li>
                <li>
                  <a @click="goTo('https://ffxiv.pf-n.co/ocean-fishing/')"
                    >Lulu's Tools - Ocean Fishing</a
                  >
                </li>
              </ul>
            </li>
            <li>
              游戏内相关数据(英文)：
              <a @click="goTo('https://xivapi.com/')">
                A FINAL FANTASY XIV: Online REST API
              </a>
            </li>
            <li>
              游戏内相关数据(中文)：
              <a @click="goTo('https://github.com/thewakingsands/ffxiv-datamining-cn')">
                ffxiv-datamining-cn
              </a>
            </li>
            <li>
              道具悬浮提示框：
              <a @click="goTo('https://github.com/thewakingsands/cafe-kit')"> cafe-kit</a>
            </li>
            <li>
              FF XIV 字体：
              <a @click="goTo('https://github.com/thewakingsands/ffxiv-axis-font-icons')">
                ffxiv-axis-font-icons
              </a>
            </li>
          </ul>
          <div class="mt-10">
            {{ $t('footer.ffRights') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <div class="d-flex flex-column flex-fill">
            <reset-button />
            <click-helper @click="showAboutDialog = false">
              <v-btn class="mt-2" color="default" block text>
                {{ $t('general.dialog.close') }}
              </v-btn>
            </click-helper>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <update-dialog
      v-model="showCheckStartSetupDialog"
      :progress="downloadProgress"
      @update="startUpdate"
      @skip="skipUpdate"
    />
    <update-available-dialog v-model="showUpdateAvailableDialog" :hash="newVersion" />
    <import-export-dialog v-model="showImportExport" />
    <bait-dialog
      v-model="showBaitDialog"
      :show-setting.camel.sync="showBaitNotificationSetting"
    />
    <chrome-time-zone-bug-dialog v-model="showChromeTimeZoneBugDialog" />
    <migrate-to-travel-eorzea-dialog
      v-model="showMigrationDialog"
      :source="migrationSource"
    />
    <desktop-version-dialog v-model="showDownloadDialog" />
    <rose-mode-dialog v-model="showRoseDialog" />
    <!--    <competition-dialog v-model="showCompetitionDialogComputed" />-->

    <v-snackbar
      :timeout="snackbar.timeout"
      v-model="snackbar.show"
      :color="snackbar.color"
      centered
      elevation="24"
    >
      <div class="text-center">{{ snackbar.text }}</div>
    </v-snackbar>
    <v-snackbar
      :timeout="baitIdsForNotification.length > 1 ? -1 : 5000"
      v-model="showBaitNotification"
      elevation="24"
    >
      <div class="d-flex align-center" v-if="baitIdsForNotification.length === 1">
        <item-icon
          :icon-class="getItemIconClass(baitIdsForNotification[0])"
          small
          class="mt-1"
        />
        <span>{{ getItemName(baitIdsForNotification[0]) }}</span>
        <span class="ml-2">已钓完所有鱼</span>
      </div>
      <div class="d-flex align-center" v-else>
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header>多个鱼饵已钓完所有鱼</v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="d-flex flex-wrap">
                <div
                  class="d-flex align-center"
                  v-for="baitId in baitIdsForNotification"
                  :key="baitId"
                >
                  <item-icon :icon-class="getItemIconClass(baitId)" small class="mt-1" />
                  <span>{{ getItemName(baitId) }}</span>
                </div>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn color="primary" text v-bind="attrs" @click="showBaitDialogOfSetting">
          设置
        </v-btn>
        <v-btn color="error" text v-bind="attrs" @click="showBaitNotification = false">
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid'
import AppMixin from '@/components/AppMixin'
import MainWindow from '@/entries/screen/views/MainWindow'
import ReaderHistoryWindow from '@/entries/screen/views/ReaderHistoryWindow'
import ReaderSpotStatisticsWindow from '@/entries/screen/views/ReaderSpotStatisticsWindow'
import ReaderTimerMiniWindow from '@/entries/screen/views/ReaderTimerMiniWindow'
import ReaderTimerWindow from '@/entries/screen/views/ReaderTimerWindow'
import VueGridLayout from 'vue-grid-layout'

export default {
  name: 'Screen',
  mixins: [AppMixin],
  components: {
    ReaderTimerMiniWindow,
    MainWindow,
    ReaderSpotStatisticsWindow,
    ReaderHistoryWindow,
    ReaderTimerWindow,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  data: () => ({
    showSideBar: true,
    miniSideBar: true,
    // layout: [],
    colNum: 12,
    index: 0,
    windows: [],
    showWindowMenu: false,
    mainPage: 'ListPage',
    mainPageTabIndex: 0,
    gridReady: false,
    readerNow: Date.now(),
  }),
  created() {
    // TODO readerConfig.showReaderOnlyIfFishing
    // TODO postLogin
    // TODO postLogout
    // this.addReaderTimerMini()
    // this.addReaderTimer()
    // this.addReaderHistory()
    // this.addReaderSpotStatistics()
    // this.addFishList()
    // this.addWiki()
    // this.addCompetition()
  },
  mounted() {
    setInterval(() => {
      this.now = Date.now()
    }, 1000)
    setInterval(() => {
      this.readerNow = Date.now()
    }, 100)
  },
  computed: {
    mobileThreshold() {
      return this.$vuetify.breakpoint.thresholds[this.$vuetify.breakpoint.mobile]
    },
  },
  methods: {
    showMainSetting() {
      this.showSettingDialog = true
    },
    handleGridReady() {
      this.gridReady = true
    },
    handleResized(i, newH, newW, newHPx, newWPx) {
      if (this.gridReady) {
        this.item = {
          ...this.item,
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
          isMobile: newWPx < this.mobileThreshold,
        }
      }
    },
    addReaderTimer() {
      this.addItemIfNotExist('READER_TIMER', 3, 4)
    },
    addReaderTimerMini() {
      this.addItemIfNotExist('READER_TIMER_MINI', 4, 3)
    },
    addReaderHistory() {
      this.addItemIfNotExist('READER_HISTORY', 3, 12)
    },
    addReaderSpotStatistics() {
      this.addItemIfNotExist('READER_SPOT_STATISTICS', 3, 12)
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
    addFish() {
      this.mainPage = 'FishDetailPage'
      this.addMainWindowIfNotExist()
    },
    addRecord() {
      this.mainPage = 'RecordPage'
      this.addMainWindowIfNotExist()
    },
    addMainWindowIfNotExist() {
      this.addItemIfNotExist('MAIN', 6, 12, false)
    },
    addItemIfNotExist(type, w, h, isMobile = true, x = 0, y = 0) {
      if (!this.hasItemOfType(type)) {
        this.addItem(type, w, h, isMobile, x, y)
      }
    },
    hasItemOfType(type) {
      return !!this.windows.find(it => it.type === type)
    },
    addItem(type, w, h, isMobile = true, x = 0, y = 0) {
      this.windows.push({
        i: uuid(),
        type,
        w: w,
        h: h,
        isMobile: isMobile,
        x: x,
        y: y,
      })
    },
    removeItem(id) {
      const index = this.windows.findIndex(it => it.i === id)
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
