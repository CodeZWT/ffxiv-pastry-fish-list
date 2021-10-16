<template>
  <div
    @mouseover="() => setClickThrough(true)"
    @mouseleave="setClickThrough(false)"
    :class="{
      screen: true,
    }"
  >
    <template v-for="winId in windows">
      <main-window
        v-if="winId.indexOf('MAIN') === 0"
        :id="winId"
        :key="winId"
        :now="now"
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
        @show-setting="showSettingDialog = true"
      />

      <fish-detail-window
        v-else-if="winId.indexOf('FISH_DETAIL') === 0"
        :id="winId"
        :key="winId"
        :now="now"
        :fish="selectedFish"
      />

      <reader-timer-mini-window
        v-else-if="winId.indexOf('READER_TIMER_MINI') === 0"
        :id="winId"
        :key="winId"
        :now="readerNow"
        :dark="dark"
      />
      <reader-timer-window
        v-else-if="winId.indexOf('READER_TIMER') === 0"
        :id="winId"
        :key="winId"
        :now="readerNow"
        :dark="dark"
      />

      <reader-history-window
        v-else-if="winId.indexOf('READER_HISTORY') === 0"
        :id="winId"
        :key="winId"
        :now="readerNow"
      />
      <reader-spot-statistics-window
        v-else-if="winId.indexOf('READER_SPOT_STATISTICS') === 0"
        :id="winId"
        :key="winId"
        :now="readerNow"
      />
    </template>

    <v-menu v-model="showWindowMenu">
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
        <v-row>
          <v-col>
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

              <v-list-item v-if="isRoseMode" @click="addRecord">
                <v-list-item-icon>
                  <v-icon>mdi-chart-bar</v-icon>
                </v-list-item-icon>
                <v-list-item-content>{{ $t('top.record') }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col>
            <v-subheader>渔捞</v-subheader>
            <v-list>
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
            <v-subheader>其他</v-subheader>
            <v-list>
              <v-list-item @click="showMainSetting">
                <v-list-item-icon>
                  <v-icon>mdi-cog</v-icon>
                </v-list-item-icon>
                <v-list-item-content>主界面{{ $t('top.uiConfig') }}</v-list-item-content>
              </v-list-item>
              <v-list-item @click="showKeybindingDialog = true">
                <v-list-item-icon>
                  <v-icon>mdi-keyboard</v-icon>
                </v-list-item-icon>
                <v-list-item-content> {{ $t('top.keybinding') }} </v-list-item-content>
              </v-list-item>
              <v-list-item @click="showPatchNoteDialog = true">
                <v-list-item-icon>
                  <v-icon>mdi-tag</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('top.patchNote') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item @click="setShowImportExportDialog(true)">
                <v-list-item-icon>
                  <v-icon>mdi-database</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('top.menu') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item @click="showAboutDialog = true">
                <v-list-item-icon>
                  <v-icon>mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('top.about') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-if="isElectron && downloadProgress > 0"
                link
                @click="showUpdateDialog"
              >
                <v-list-item-icon>
                  <div>
                    <v-progress-circular rotate="-90" size="24" :value="downloadProgress">
                      <div style="font-size: x-small">
                        {{ downloadProgress === 100 ? '' : Math.floor(downloadProgress) }}
                      </div>
                    </v-progress-circular>
                  </div>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>
                    {{
                      downloadProgress === 100
                        ? $t('top.downloaded')
                        : $t('top.downloading')
                    }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-sheet>
    </v-menu>

    <v-overlay :value="loading || showJumpingOverlay" opacity="0.9" z-index="9999">
      <div class="d-flex flex-column align-center">
        <v-progress-circular indeterminate size="64" />
        <div>{{ $t('list.loading') }}</div>
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
    <key-binding-dialog v-model="showKeybindingDialog" />

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
import { INTERVAL_MINUTE } from 'Data/constants'
import { mapGetters, mapMutations, mapState } from 'vuex'
import AppMixin from '@/components/AppMixin'
import ClickThroughMixin from '@/components/ClickThroughMixin'
import FishDetailWindow from '@/entries/screen/views/FishDetailWindow'
import KeyBindingDialog from '@/components/Dialog/KeyBindingDialog'
import MainWindow from '@/entries/screen/views/MainWindow'
import ReaderHistoryWindow from '@/entries/screen/views/ReaderHistoryWindow'
import ReaderSpotStatisticsWindow from '@/entries/screen/views/ReaderSpotStatisticsWindow'
import ReaderTimerMiniWindow from '@/entries/screen/views/ReaderTimerMiniWindow'
import ReaderTimerWindow from '@/entries/screen/views/ReaderTimerWindow'
import RecordValidator from '@/utils/RecordValidator'
import UploadUtil from '@/utils/UploadUtil'
import rcapiService from '@/service/rcapiService'

export default {
  name: 'Screen',
  mixins: [AppMixin, ClickThroughMixin],
  components: {
    KeyBindingDialog,
    FishDetailWindow,
    ReaderSpotStatisticsWindow,
    ReaderHistoryWindow,
    ReaderTimerWindow,
    ReaderTimerMiniWindow,
    MainWindow,
  },
  data: () => ({
    showKeybindingDialog: false,
    showSideBar: true,
    miniSideBar: true,
    colNum: 12,
    showWindowMenu: false,
    readerNow: Date.now(),
  }),
  computed: {
    ...mapState('screenWindow', ['layouts', 'windows', 'subPage']),
    ...mapGetters('screenWindow', ['isOpen']),
  },
  async created() {
    // TODO readerConfig.showReaderOnlyIfFishing
    // TODO postLogin
    // TODO postLogout
    console.debug(process.env.commit_hash)
    const db = (await import('@/plugins/db')).default
    this.resetUploadSettingIfNecessary(db)
    // const windowSetting = await this.getWindowSetting()
    // if (windowSetting) {
    //   this.setOpacity(windowSetting.main.opacity)
    //   this.setZoomFactor(windowSetting.main.zoomFactor)
    // }

    setInterval(UploadUtil.sendUploadRecord, INTERVAL_MINUTE)
    window.electron?.ipcRenderer
      // ?.on('getUploadRecords', UploadUtil.sendUploadRecord)
      ?.on('showUpdateDialog', (event, newVersion) => {
        this.showUpdateAvailableDialog = true
        this.newVersion = newVersion
      })
      ?.on('fishCaught', (event, data) => {
        // Be care of spear fish!
        const fishId = data?.fishId
        const hq = data?.hq
        if (
          this.readerSetting.autoSetCompleted &&
          fishId > 0 &&
          (!this.readerSetting.autoSetCompletedOnlyHQ || hq)
        ) {
          this.setFishCompleted({ fishId: fishId, completed: true })
        }
      })
      ?.on('setupDownload', (event, data) => {
        if (this.downloadProgress < 100) {
          this.downloadProgress = data.percent * 100
        }
      })
      ?.on('checkStartSetup', () => {
        this.downloadProgress = 100
        this.showUpdateDialog()
      })
      // ?.on('updateUserData', (event, data) => {
      //   this.updateUserData(data)
      //   window.electron?.ipcRenderer?.send('reloadUserData')
      // })
      ?.on('reloadUserData', () => {
        this.reloadReaderUserData()
      })
      // ?.on('showSpotPage', (event, spotId) => {
      //   this.setMiniMode(false)
      //   if (!window.location.hash.startsWith('#/wiki')) {
      //     this.$router.push({ name: 'WikiPage', query: { spotId, mode: 'normal' } })
      //   }
      // })
      ?.on('newRecord', (event, data) => {
        const isLogin = rcapiService.isLogin()
        data.uploadEnabled = this.readerSetting.isUploadMode && this.isRoseMode && isLogin
        data.isStrictMode = RecordValidator.judgeRecordStrictFlag(
          this.readerSetting.isStrictMode && this.isRoseMode && isLogin,
          data
        )
        db.records.put(data).catch(error => console.error('storeError', error))
      })
      ?.on('showRoseModeDialog', () => {
        this.showRoseDialog = true
      })
      ?.on('toggleReaderTimer', () => {
        if (this.isOpen('READER_TIMER')) {
          this.closeWindow('READER_TIMER')
        } else {
          this.addReaderTimer()
        }
      })
      ?.on('toggleReaderTimerMini', () => {
        if (this.isOpen('READER_TIMER_MINI')) {
          this.closeWindow('READER_TIMER_MINI')
        } else {
          this.addReaderTimerMini()
        }
      })
      ?.on('toggleReaderHistory', () => {
        if (this.isOpen('READER_HISTORY')) {
          this.closeWindow('READER_HISTORY')
        } else {
          this.addReaderHistory()
        }
      })
      ?.on('toggleReaderSpotStatistics', () => {
        if (this.isOpen('READER_SPOT_STATISTICS')) {
          this.closeWindow('READER_SPOT_STATISTICS')
        } else {
          this.addReaderSpotStatistics()
        }
      })
      ?.on('setGlobalClickThrough', (event, clickThrough) => {
        this.setGlobalClickThrough(clickThrough)
      })
  },
  mounted() {
    setInterval(() => {
      this.readerNow = Date.now()
    }, 100)
  },
  methods: {
    ...mapMutations('screenWindow', [
      'updateWindowLayout',
      'showWindow',
      'closeWindow',
      'setGlobalClickThrough',
    ]),
    onFishSelected({ fishId, firstSpotId }) {
      this.selectedFishId = fishId
      this.selectedFishFirstSpotId = firstSpotId
      this.fishUpdater.selectedFishId = this.selectedFishId
      if (this.subPage === 'ListPage') {
        this.addFish()
      }
    },
    showMainSetting() {
      this.showSettingDialog = true
    },
    addReaderTimer() {
      this.showWindow({
        type: 'READER_TIMER',
      })
    },
    addReaderTimerMini() {
      this.showWindow({
        type: 'READER_TIMER_MINI',
      })
    },
    addReaderHistory() {
      this.showWindow({
        type: 'READER_HISTORY',
      })
    },
    addReaderSpotStatistics() {
      this.showWindow({
        type: 'READER_SPOT_STATISTICS',
      })
    },
    addFishList() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'ListPage',
        tabIndex: 0,
      })
    },
    addNotificationList() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'ListPage',
        tabIndex: 1,
      })
    },
    addWiki() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'WikiPage',
      })
    },
    addOceanFishing() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'OceanFishingPage54',
      })
    },
    addDiadem() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'DiademPage',
      })
    },
    addAquarium() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'AquariumPage',
      })
    },
    addCompetition() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'CompetitionPage',
      })
    },
    addFish() {
      this.showWindow({
        type: 'FISH_DETAIL',
      })
    },
    addRecord() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'RecordPage',
      })
    },
  },
}
</script>

<style scoped lang="sass">
@import "~@/styles/RcVariables"

.screen
  height: 100%
  &--normal
    background: rgba(117, 117, 117, 0.5)
</style>
