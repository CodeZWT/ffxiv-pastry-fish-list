<template>
  <div
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
        @show-setting="showSetting"
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

      <menu-window
        v-else-if="winId.indexOf('MENU') === 0"
        :id="winId"
        :key="winId"
        @show-setting="showSetting"
        @show-about="showAboutDialog = true"
        :dark="dark"
      />
    </template>

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
    <rc-dialog
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
    </rc-dialog>
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
    <rose-mode-dialog v-model="showRoseDialog" />
    <!--    <competition-dialog v-model="showCompetitionDialogComputed" />-->

    <rc-snackbar
      :timeout="snackbar.timeout"
      v-model="snackbar.show"
      :color="snackbar.color"
      centered
      elevation="24"
    >
      <div class="text-center">{{ snackbar.text }}</div>
    </rc-snackbar>
    <rc-snackbar
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
    </rc-snackbar>
  </div>
</template>

<script>
import { INTERVAL_MINUTE } from 'Data/constants'
import { mapMutations, mapState } from 'vuex'
import AppMixin from '@/components/AppMixin'
import FishDetailWindow from '@/entries/screen/views/FishDetailWindow'
import MainWindow from '@/entries/screen/views/MainWindow'
import MenuWindow from '@/entries/screen/views/MenuWindow'
import RcDialog from '@/components/basic/RcDialog'
import RcSnackbar from '@/components/basic/RcSnackbar'
import ReaderHistoryWindow from '@/entries/screen/views/ReaderHistoryWindow'
import ReaderSpotStatisticsWindow from '@/entries/screen/views/ReaderSpotStatisticsWindow'
import ReaderTimerMiniWindow from '@/entries/screen/views/ReaderTimerMiniWindow'
import ReaderTimerWindow from '@/entries/screen/views/ReaderTimerWindow'
import RecordValidator from '@/utils/RecordValidator'
import UploadUtil from '@/utils/UploadUtil'
import rcapiService from '@/service/rcapiService'

export default {
  name: 'Screen',
  mixins: [AppMixin],
  components: {
    RcSnackbar,
    MenuWindow,
    RcDialog,
    FishDetailWindow,
    ReaderSpotStatisticsWindow,
    ReaderHistoryWindow,
    ReaderTimerWindow,
    ReaderTimerMiniWindow,
    MainWindow,
  },
  data: () => ({
    showSideBar: true,
    miniSideBar: true,
    readerNow: Date.now(),
  }),
  computed: {
    ...mapState('screenWindow', [
      'layouts',
      'windows',
      'subPage',
      'dialogs',
      'alerts',
      'bottomNotifications',
    ]),
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
      ?.on('setGlobalClickThrough', (event, clickThrough) => {
        this.setGlobalClickThrough(clickThrough)
      })
      ?.on('showMenuWindow', (event, workAreaSize) => {
        console.log('showMenuWindow', workAreaSize)
        this.setMenuWindowToScreenCenter(workAreaSize)
      })
      ?.on('showSearch', () => {
        if (!this.showSearchDialog) {
          this.setShowSearchDialog(true)
        }
      })
      ?.on('showRoseDialog', () => {
        console.log('showRoseDialog')
        this.showRoseDialog = true
      })
    this.addMenu()
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
      'setMenuWindowToScreenCenter',
    ]),
    onFishSelected({ fishId, firstSpotId }) {
      this.selectedFishId = fishId
      this.selectedFishFirstSpotId = firstSpotId
      this.fishUpdater.selectedFishId = this.selectedFishId
      if (this.subPage === 'ListPage') {
        this.addFish()
      }
    },
    addFish() {
      setTimeout(() => {
        this.showWindow({
          type: 'FISH_DETAIL',
        })
      }, 200)
    },

    addMenu() {
      this.showWindow({
        type: 'MENU',
      })
    },

    finishReloadPage() {
      rcapiService
        .getOpcodeFileVersion()
        .then(version => {
          this.sendElectronEvent('finishLoading', {
            userData: this.userData,
            readerSetting: this.readerSetting,
            windowSetting: {
              layouts: this.layouts,
              windows: this.windows,
              dialogs: this.dialogs,
              alerts: this.alerts,
              bottomNotifications: this.bottomNotifications,
            },
            keybindings: this.keybindings,
            opcodeVersion: version,
          })
        })
        .catch(() => {
          this.sendElectronEvent('finishLoading', {
            userData: this.userData,
            readerSetting: this.readerSetting,
            windowSetting: {
              layouts: this.layouts,
              windows: this.windows,
              dialogs: this.dialogs,
              alerts: this.alerts,
              bottomNotifications: this.bottomNotifications,
            },
            keybindings: this.keybindings,
            opcodeVersion: 'latest',
          })
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
