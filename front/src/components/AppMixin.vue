<script>
import { FishListUpdateWorker } from '@/utils/new/FishListUpdate'
import { INTERVAL_MINUTE } from 'Data/constants'
import { MainFeatures } from 'Data/newFeatures'
import {
  OCEAN_FISHING_BITE_TIME,
  OCEAN_FISHING_BITE_TIME_COLLECTED,
  OCEAN_FISHING_BONUS,
  OCEAN_FISHING_FISH,
} from 'Data/oceanFishing'
import { PageVisibilityUtil } from '@/utils/new/PageVisibilityUtil'
import { SystemInfo } from 'Data/version'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { version } from '../../package.json'
import BaitDialog from '@/components/Dialog/BaitDialog'
import ChromeTimeZoneBugDialog from '@/components/Dialog/ChromeTimeZoneBugDialog'
import ClickHelper from '@/components/basic/ClickHelper'
import ClipboardJS from 'clipboard'
import DATA_CN from 'Data/translation'
import DataUtil from '@/utils/DataUtil'
import DesktopVersionDialog from '@/components/Dialog/DesktopVersionDialog'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import EorzeaTime from '@/utils/Time'
import FIX, { SATISFACTION_SUPPLY_FISH } from 'Data/fix'
import FishEyesToggleButton from '@/components/FishEyesToggleButton'
import FishSearch from '@/components/FishSearch'
import FishSettingDialog from '@/components/FishSettingDialog'
import FishWindow from '@/utils/FishWindow'
import HelpDialog from '@/components/Dialog/HelpDialog'
import ImgUtil from '@/utils/ImgUtil'
import ImportExportDialog from '@/components/ImportExportDialog'
import ItemIcon from '@/components/basic/ItemIcon'
import MigrateToTravelEorzeaDialog from '@/components/Dialog/MigrateToTravelEorzeaDialog'
import NewFeatureMark from '@/components/basic/NewFeatureMark'
import PatchNoteDialog from '@/components/Dialog/PatchNoteDialog'
import RecordValidator from '@/utils/RecordValidator'
import ResetButton from '@/components/ResetButton'
import ResizeIndicator from '@/components/basic/ResizeIndicator'
import RoseModeDialog from '@/components/Dialog/RoseModeDialog'
import ToggleButton from '@/components/basic/ToggleButton'
import UpdateAvailableDialog from '@/components/Dialog/UpdateAvailableDialog'
import UpdateDialog from '@/components/Dialog/UpdateDialog'
import UploadUtil from '@/utils/UploadUtil'
import WindowUtil from '@/entries/reader/util/WindowUtil'
import _ from 'lodash'
import hotkeys from 'hotkeys-js'
import placeNames from 'Data/placeNames'
import rcapiService from '@/service/rcapiService'
import regionTerritorySpots from 'Data/fishingSpots'
import spearFishSize from 'Data/spearFishSize'

export default {
  name: 'AppMixin',
  components: {
    UpdateAvailableDialog,
    RoseModeDialog,
    ResizeIndicator,
    FishEyesToggleButton,
    HelpDialog,
    ToggleButton,
    NewFeatureMark,
    UpdateDialog,
    MigrateToTravelEorzeaDialog,
    DesktopVersionDialog,
    ChromeTimeZoneBugDialog,
    ItemIcon,
    BaitDialog,
    PatchNoteDialog,
    ImportExportDialog,
    FishSearch,
    FishSettingDialog,
    ClickHelper,
    ResetButton,
  },
  data: vm => ({
    downloadProgress: 0,
    isMouseThrough: false,
    isTempMouseThrough: false,
    fishUpdater: undefined,
    pageVisibilityUtil: undefined,
    showRoseDialog: false,
    lastCatchFishId: undefined,
    isElectron: DevelopmentModeUtil.isElectron(),
    systemThemeMode: 'DARK',
    THEME_SETTING_MODES: DataUtil.THEME_SETTING_MODES,
    achievementScore40: ImgUtil.getImgUrl('ocean-fishing-score-achievement-40x40.png'),
    showJumpingOverlay: false,
    now: Date.now(),
    version,
    noOp: DataUtil.noOp,
    showHelpDialog: false,
    showAboutDialog: false,
    showSettingDialog: false,
    showMigrationDialog: false,
    // listFishCnt: [{ cnt: 0 }, { cnt: 0 }, { cnt: 0 }],
    TABS: DataUtil.TABS,
    title:
      vm.$t('top.systemBarTitle') +
      (DevelopmentModeUtil.isTest() ? vm.$t('top.testSuffix') : ''),
    drawer: true,
    mini: true,
    lazySourceFishList: [],
    lazyTransformedFishList: [],
    lazyTransformedFishDict: {},
    lazyFishConstraintDict: {},
    sortedFishIds: [],
    sortedPinnedFishIds: [],
    sortedToBeNotifiedIds: [],
    fishListTimePart: {},
    searchedFishId: undefined,
    selectedFishId: undefined,
    selectedFishFirstSpotId: undefined,
    fishListWeatherChangePart: {},
    extraFishListTimePart: {},
    lazyFishWindowRates: {},
    diademDark: ImgUtil.getImgUrl('diadem-dark-24x24.png'),
    diademLight: ImgUtil.getImgUrl('diadem-light-24x24.png'),
    showBaitDialog: false,
    showBaitNotificationSetting: false,
    showBaitNotification: false,
    showChromeTimeZoneBugDialog: false,
    migrationSource: '',
    alwaysOnTop: false,
    maximized: false,
    ReaderTimerFeatureId: MainFeatures.ReaderTimer,
    FishEyesFeatureId: MainFeatures.FishEyesButton,
  }),
  computed: {
    ...mapState('dialog', ['menuDialog']),
    showWindowMenu: {
      get() {
        return this.menuDialog
      },
      set(val) {
        this.setShowDialog({
          show: val,
          dialog: 'menuDialog',
        })
      },
    },
    showPatchNoteDialog: {
      get() {
        return this.patchNoteDialog
      },
      set(show) {
        this.setShowDialog({ dialog: 'patchNoteDialog', show: show })
      },
    },
    // TODO: CHECK different with real eorzea time of 1 minute
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return DataUtil.formatDateTime(this.now, 'HH:mm')
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    // listFishCntForMini() {
    //   return this.listFishCnt.slice(0, 2)
    // },
    allFish() {
      // console.log('allFish triggered')
      return this.fish
    },
    filteredFishIdSet() {
      // console.log('filteredFishIdSet triggered')
      const idSet = new Set()
      this.lazyTransformedFishList
        .filter(fish => {
          if (!this.allFish[fish.id]) {
            return false
          }
          const fishCompleted = this.getFishCompleted(fish.id)
          const isBigFish = DATA_CN.BIG_FISH.includes(fish.id)
          const isLivingLegend = DATA_CN.LIVING_LEGENDS.includes(fish.id)
          const restricted =
            this.lazyFishConstraintDict[fish.id] ||
            fish.checkInfo?.weatherRestricted ||
            fish.checkInfo?.timeRestricted
          return (
            this.filters.patches.includes(DataUtil.toFishFilterPatch(fish.patch)) &&
            ((this.filters.completeTypes.includes('COMPLETED') && fishCompleted) ||
              (this.filters.completeTypes.includes('UNCOMPLETED') && !fishCompleted)) &&
            ((this.filters.bigFishTypes.includes('LIVING_LEGENDS') && isLivingLegend) ||
              (this.filters.bigFishTypes.includes('OLD_ONES') &&
                isBigFish &&
                !isLivingLegend) ||
              (this.filters.bigFishTypes.includes('NORMAL') && !isBigFish)) &&
            (this.filters.fishConstraintTypes.includes('RESTRICTED') === restricted ||
              this.filters.fishConstraintTypes.includes('NOT_RESTRICTED') === !restricted)
          )
        })
        .forEach(it => idSet.add(it._id))
      return idSet
    },
    baitFilteredFishIdSet() {
      // console.log('baitFilteredFishIdSet triggered')
      const list = Array.from(this.filteredFishIdSet)
      const idSet = new Set()
      const baitIds = this.baitFilter.baitIds
      list
        .filter(fishId => {
          const fish = this.allFish[fishId]
          return (
            !this.baitFilter.enabled ||
            (fish.bestCatchPath != null && baitIds.includes(fish.bestCatchPath[0]))
          )
        })
        .forEach(it => {
          idSet.add(it)
        })
      // console.log(baitIds)
      // console.log(Array.from(idSet))
      return idSet
    },
    sortedFilteredFishIdList() {
      // console.log('sortedFilteredFishIdList triggered')
      const now = Date.now()
      const idSet = this.baitFilteredFishIdSet
      let countdownSortedFishList = this.sortedFishIds
        .filter(id => idSet.has(id))
        .filter(
          id => this.listSetting.pinned.showPinnedInNormalList || !this.getFishPinned(id)
        )

      if (this.filters.sorterType === 'RATE') {
        const firstWaitingFishLongerThanTwoHoursIndex = countdownSortedFishList.findIndex(
          fishId => {
            const countDownType =
              this.fishListTimePart[fishId]?.countDown.type ?? DataUtil.ALL_AVAILABLE
            if (countDownType === DataUtil.FISHING) {
              return false
            }
            const timePoint = this.fishListTimePart[fishId]?.countDown?.timePoint
            const countDownTime = timePoint ? timePoint - now : DataUtil.INTERVAL_HOUR * 2
            if (countDownTime >= DataUtil.INTERVAL_HOUR * 2) {
              return true
            }
          }
        )

        const rateSortExcludedFish =
          firstWaitingFishLongerThanTwoHoursIndex === -1
            ? []
            : countdownSortedFishList.splice(
                firstWaitingFishLongerThanTwoHoursIndex,
                countdownSortedFishList.length - firstWaitingFishLongerThanTwoHoursIndex
              )

        countdownSortedFishList = _.sortBy(countdownSortedFishList, [
          fishId =>
            this.fishListTimePart[fishId]?.countDown.type ?? DataUtil.ALL_AVAILABLE,
          fishId => this.lazyFishWindowRates[fishId],
        ]).concat(rateSortExcludedFish)
      }

      return countdownSortedFishList
    },
    pinnedFishIdList() {
      // console.log('pinnedFishIdList triggered')
      const sortedFishIds = this.sortedPinnedFishIds
      if (this.filters.sorterType === 'COUNTDOWN') {
        return sortedFishIds
      } else {
        return _.sortBy(sortedFishIds, [fish => this.lazyFishWindowRates[fish.id]])
      }
    },
    selectedFish() {
      // console.log('selectedFish triggered')
      const fish = this.allFish[this.selectedFishId]
      if (fish) {
        return {
          ...fish,
          parts: {
            firstSpotId: this.selectedFishFirstSpotId,
            fishTimePart: this.extraFishListTimePart[this.selectedFishId],
            fishWeatherChangePart: this.fishListWeatherChangePart[this.selectedFishId],
            predators: DataUtil.getPredators(
              fish,
              this.lazyTransformedFishDict,
              this.fishListTimePart,
              this.fishListWeatherChangePart
            ),
            shadowPredators: fish.shadowPredators
              ? DataUtil.getPredators(
                  { predators: fish.shadowPredators },
                  this.lazyTransformedFishDict
                )
              : [],
          },
        }
      } else {
        return undefined
      }
    },
    showSearch: {
      get() {
        return this.showSearchDialog
      },
      set(showSearch) {
        this.setShowSearchDialog(showSearch)
      },
    },
    showImportExport: {
      get() {
        return this.showImportExportDialog
      },
      set(show) {
        this.setShowImportExportDialog(show)
      },
    },
    // themeModeComputed: {
    //   get() {
    //     return this.themeMode
    //   },
    //   set(dark) {
    //     this.setThemeMode(dark)
    //   },
    // },
    inMigrationPage() {
      return this.$route.name === 'MigrationPage'
    },
    inStartLight() {
      return (
        this.now >= FIX.STARLIGHT_CELEBRATION.startTime &&
        this.now <= FIX.STARLIGHT_CELEBRATION.endTime
      )
    },
    dark() {
      if (this.themeMode === 'AUTO') {
        return this.systemThemeMode === 'DARK'
      } else {
        return this.themeMode === 'DARK'
      }
    },
    showCompetitionDialogComputed: {
      get() {
        return this.showCompetitionDialog
      },
      set(show) {
        this.setShowCompetitionDialog(show)
      },
    },
    ...mapState('dialog', ['patchNoteDialog']),
    ...mapState('keybinding', ['keybindings']),
    ...mapState([
      'readerSetting',
      'userData',
      'baitFilter',
      'loading',
      'snackbar',
      'activeTabIndex',
      'showSearchDialog',
      'fish',
      'items',
      'fishingSpots',
      'zones',
      'bigFish',
      'sounds',
      'showImportExportDialog',
      'newPatchFish',
      'folklore',
      'weatherRates',
      'baitIdsForNotification',
    ]),
    ...mapGetters([
      'pinnedFishIds',
      'toBeNotifiedFishIds',
      'listSetting',
      'isRoseMode',
      'mainWindowCloseMode',
      // 'readerRegion',
      // 'readerMonitorType',
      'fishEyesUsed',
      'showChromeBugDialog',
      'opacity',
      'websiteVersion',
      'getFishToBeNotified',
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
      'getFishingSpots',
      'themeMode',
      'startLight',
      'getAchievementName',
      'getAchievementIconClass',
      'showCompetitionDialog',
    ]),
  },
  watch: {
    baitIdsForNotification(baitIdsForNotification) {
      if (baitIdsForNotification.length > 0) {
        this.showBaitNotification = true
      }
    },
    // filters() {
    //   this.startLoading()
    // },
    isMobile: {
      handler(isMobile) {
        if (isMobile) {
          this.mini = false
          this.drawer = false
        } else {
          this.drawer = true
        }
      },
      immediate: true,
    },
    dark: {
      handler(dark) {
        this.$vuetify.theme.dark = dark
      },
      immediate: true,
    },
    fishListTimePart: {
      handler: function(fishListTimePart) {
        // console.log('fishListTimePart watcher triggered')
        const newSortedFishIds = _.sortBy(fishListTimePart, [
          'countDown.type',
          'countDown.timePoint',
          'id',
        ]).map(it => it.id)
        if (!_.isEqual(this.sortedFishIds, newSortedFishIds)) {
          this.sortedFishIds = newSortedFishIds
        }
        const newSortedPinIds = newSortedFishIds.filter(id => this.getFishPinned(id))
        if (!_.isEqual(this.sortedPinnedFishIds, newSortedPinIds)) {
          this.sortedPinnedFishIds = newSortedPinIds
        }
        const newSortedNotifyIds = newSortedFishIds.filter(id =>
          this.getFishToBeNotified(id)
        )
        if (!_.isEqual(this.sortedToBeNotifiedIds, newSortedNotifyIds)) {
          this.sortedToBeNotifiedIds = newSortedNotifyIds
        }
      },
      deep: true,
    },
    pinnedFishIds(pinnedFishIds) {
      const newSortedPinIds = this.sortedFishIds.filter(fishId =>
        pinnedFishIds.includes(DataUtil.toItemId(fishId))
      )
      if (!_.isEqual(this.sortedPinnedFishIds, newSortedPinIds)) {
        this.sortedPinnedFishIds = newSortedPinIds
      }
    },
    toBeNotifiedFishIds(toBeNotifiedFishIds) {
      const newSortedToBeNotifiedIds = this.sortedFishIds.filter(fishId =>
        toBeNotifiedFishIds.includes(DataUtil.toItemId(fishId))
      )
      if (!_.isEqual(this.sortedToBeNotifiedIds, newSortedToBeNotifiedIds)) {
        this.sortedToBeNotifiedIds = newSortedToBeNotifiedIds
      }
    },
    // weatherChangeTrigger() {
    // this.updateWeatherChangePart(this.now)
    // },
  },
  async created() {
    switch (window.location.host) {
      case 'fish.ricecake302.com':
        this.migrationSource = 'main'
        this.showMigrationDialog = true
        console.debug('migration match', this.migrationSource)
        break
      case 'ricecake500.gitee.io':
        this.migrationSource = 'sub'
        console.debug('migration match', this.migrationSource)
        this.showMigrationDialog = true
        break
      case 'ricecake404.gitee.io':
        this.migrationSource = 'old'
        console.debug('migration match', this.migrationSource)
        this.showMigrationDialog = true
        break
      default:
        console.debug('migration no match')
        this.showMigrationDialog = false
    }

    if (DataUtil.isBugChromeTimeZone()) {
      this.showChromeTimeZoneBugDialog = this.showChromeBugDialog
    }

    this.startLoading()
    // this.drawer = !this.isMobile

    this.systemThemeMode =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'DARK'
        : 'LIGHT'
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.systemThemeMode = e.matches ? 'DARK' : 'LIGHT'
    })

    // this.finishReloadPage()

    // this.sendElectronEvent('startReader', {
    //   region: this.readerRegion,
    //   monitorType: this.readerMonitorType,
    // })
    this.bindHotkeys()
    this.closeStrictMode()

    if (DevelopmentModeUtil.isElectron()) {
      const db = (await import('@/plugins/db')).default
      this.resetUploadSettingIfNecessary(db)
      const windowSetting = await this.getWindowSetting()
      if (windowSetting) {
        this.setOpacity(windowSetting.main.opacity)
        this.setZoomFactor(windowSetting.main.zoomFactor)
      }

      setInterval(UploadUtil.sendUploadRecord, INTERVAL_MINUTE)

      window.electron?.ipcRenderer?.on('broadcast', (event, { type, source }) => {
        console.debug('reloadSettingData according to', source)
        if (type === 'reloadSystemInfo') {
          // noop
        } else if (type === 'reloadSetting') {
          this.boardCastReload()
        }
      })

      // const that = this
      window.electron?.ipcRenderer
        // ?.on('getUploadRecords', UploadUtil.sendUploadRecord)
        // ?.on('showUpdateDialog', (event, newVersion) => {
        //   this.showUpdateAvailableDialog = true
        //   this.newVersion = newVersion
        // })
        ?.on('fishCaught', (event, data) => {
          const fishId = data?.fishId
          this.setFishCompleted({ fishId: fishId, completed: true })
        })
        // ?.on('updateUserData', (event, data) => {
        //   this.updateUserData(data)
        //   window.electron?.ipcRenderer?.send('reloadUserData')
        // })
        // ?.on('reloadUserData', () => {
        //   // this.reloadReaderUserData()
        //   this.boardCastReload()
        // })
        ?.on('showSpotPage', (event, spotId) => {
          this.setMiniMode(false)
          if (!window.location.hash.startsWith('#/wiki')) {
            this.$router.push({ name: 'WikiPage', query: { spotId, mode: 'normal' } })
          }
        })
        ?.on('newRecord', (event, data) => {
          const isLogin = rcapiService.isLogin()
          data.uploadEnabled =
            this.readerSetting.isUploadMode && this.isRoseMode && isLogin
          data.isStrictMode = RecordValidator.judgeRecordStrictFlag(
            this.readerSetting.isStrictMode && this.isRoseMode && isLogin,
            data
          )
          db.records.put(data).catch(error => console.error('storeError', error))
        })
        ?.on('showRoseModeDialog', () => {
          this.showRoseDialog = true
        })
    }
  },
  async mounted() {
    // setTimeout(async () => {
    const now = Date.now()
    this.now = now
    this.setNow(now)
    this.initialUserData()
    console.debug('website version', this.version)
    if (
      DataUtil.toComparableVersion(this.version) >
      DataUtil.toComparableVersion(this.websiteVersion)
    ) {
      this.showPatchNoteDialog = true
    }
    this.cafeKitTooltipCopyPatch()

    this.pageVisibilityUtil = new PageVisibilityUtil()
    if (DevelopmentModeUtil.isTest()) {
      this.checkFishNeedSplit(this.lazySourceFishList)
    }

    this.lazySourceFishList = Object.values(this.allFish).filter(
      it => it.patch == null || it.patch <= SystemInfo.patch
    )
    console.debug('update weather part')
    this.updateWeatherChangePart(this.now)
    console.debug('update weather part finished')

    this.lazyFishConstraintDict = _.mapValues(
      this.fishListWeatherChangePart,
      it => it.fishWindows.length > 0
    )

    this.lazyTransformedFishList = this.assembleFish(this.lazySourceFishList).concat(
      this.assembleOceanFishList()
    )
    this.lazyTransformedFishDict = DataUtil.toMap(
      this.lazyTransformedFishList,
      fish => fish.id
    )

    this.fishUpdater = new FishListUpdateWorker(
      this.lazySourceFishList,
      this.fishListTimePart,
      this.extraFishListTimePart,
      this.getCountDown
    )
    console.debug('init all fish time')
    this.fishUpdater.initAllFishTimePart(this.now)
    setInterval(() => {
      // in interval
      const now = Date.now()
      this.now = now
      this.setNow(now)
      if (this.pageVisibilityUtil.pageIsHidden) {
        // console.debug('triggered when hidden')
        this.fishUpdater.doAllOnce()
      }
      this.checkNotification(now)
      if (this.loading) {
        this.finishLoading()
        this.finishReloadPage()
      }
    }, 1000)
    window.requestAnimationFrame(() => this.fishUpdater.doNext())

    const sounds = await this.loadingSounds()
    this.setSounds(DataUtil.toMap(sounds, it => it.key))
    console.debug('sound loaded')
  },
  methods: {
    ...mapMutations('dialog', ['setShowDialog']),
    getWindowSetting() {
      return window.electron?.ipcRenderer
        ?.invoke('getWindowSetting')
        ?.then(setting => (this.lazyWindowSetting = setting))
    },
    finishReloadPage() {
      rcapiService
        .getOpcodeFileVersion()
        .then(version => {
          this.sendElectronEvent('finishLoading', {
            userData: this.userData,
            readerSetting: this.readerSetting,
            opcodeVersion: version,
          })
        })
        .catch(() => {
          this.sendElectronEvent('finishLoading', {
            userData: this.userData,
            readerSetting: this.readerSetting,
            opcodeVersion: 'latest',
          })
        })
    },
    bindHotkeys() {
      hotkeys('/', event => {
        if (!this.showSearchDialog) {
          this.setShowSearchDialog(true)
        }
        event.preventDefault()
      })
      if (!this.isElectron) {
        hotkeys('alt+shift+y', event => {
          this.showRoseDialog = true
          event.preventDefault()
        })
      }
    },
    handleSearch(fishId) {
      this.searchedFishId = fishId
      this.fishUpdater.searchedFishId = fishId
    },
    closeStrictMode() {
      this.disableStrictMode()
      // this.sendElectronEvent('setStrictMode', false)
    },
    async resetUploadSettingIfNecessary(db) {
      if (!this.isRoseMode) {
        console.debug('Rose Mode is Disabled, try reset upload setting for old data...')
        // Force set isStrictMode to false
        this.disableStrictMode()
        console.debug('[1/2] strict mode disabled')
        // Fix upload setting
        // uploadEnabled,uploaded,isStrictMode
        const recordsToDisableUpload = await db.records
          .filter(({ uploadEnabled, uploaded }) => uploadEnabled && !uploaded)
          .toArray()
        console.debug('[2/2] Records # to be reset:', recordsToDisableUpload.length)

        if (recordsToDisableUpload.length > 0) {
          await db.records.bulkPut(
            recordsToDisableUpload.map(record => ({
              ...record,
              uploadEnabled: false,
              isStrictMode: false,
            }))
          )
          console.debug('[2/2] Records reset')
        } else {
          console.debug('[2/2] No records to set')
        }
      }
    },
    showCompetition() {
      this.showCompetitionDialogComputed = true
      this.setFeatureViewed('Competition-V.0.8.3-2')
    },
    showSetting() {
      this.showSettingDialog = true
    },
    toggleAlwaysOnTop() {
      this.alwaysOnTop = !this.alwaysOnTop
      WindowUtil.setAlwaysOnTop(this.alwaysOnTop)
    },
    minimize() {
      WindowUtil.minimizeWindow()
    },
    maximizeOrRestore(maximize) {
      if (maximize) {
        WindowUtil.maximizeWindow()
      } else {
        WindowUtil.unmaximizeWindow()
      }
      this.maximized = maximize
    },
    maximize() {
      WindowUtil.maximizeWindow()
    },
    unmaximize() {
      WindowUtil.unmaximizeWindow()
    },
    close() {
      if (this.mainWindowCloseMode === 'TRAY') {
        WindowUtil.hideWindow()
      } else {
        WindowUtil.closeWindow()
      }
    },
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
    openReader() {
      this.sendElectronEvent('openReader')
      this.setFeatureViewed(this.ReaderTimerFeatureId)
    },
    onFishSelected({ fishId, firstSpotId }) {
      this.selectedFishId = fishId
      this.selectedFishFirstSpotId = firstSpotId
      this.fishUpdater.selectedFishId = this.selectedFishId
    },
    showBaitDialogOfSetting() {
      this.showBaitDialog = true
      this.showBaitNotificationSetting = true
    },
    checkFishNeedSplit(fishList) {
      const spot2FishList = _.mapValues(
        _.keyBy(
          regionTerritorySpots.flatMap(it => it.territories.flatMap(t => t.spots)),
          'id'
        ),
        spot => spot.fishList
      )

      return fishList.forEach(fish => {
        const notAvailableSpots = []
        fish.locations.forEach(spotId => {
          const availableFishList = spot2FishList[spotId]
          if (
            fish.bestCatchPath != null &&
            !fish.bestCatchPath
              .slice(1)
              .every(smallFish => availableFishList.includes(smallFish))
          ) {
            notAvailableSpots.push(spotId)
          }
        })
        if (notAvailableSpots.length > 0) {
          console.debug(
            this.getItemName(fish._id),
            fish._id,
            notAvailableSpots,
            notAvailableSpots.map(spotId => this.fishingSpots[spotId].name_chs)
          )
          return
        }

        if (
          fish.locations.length === 1 ||
          (fish.previousWeatherSet.length === 0 && fish.weatherSet.length === 0)
        ) {
          // return fish
          return
        }

        const territories = _.mapValues(
          _.groupBy(
            fish.locations.map(location => {
              return {
                key: JSON.stringify(
                  this.weatherRates[this.fishingSpots[location]?.territory_id]
                    ?.weather_rates
                ),
                location: location,
              }
            }),
            'key'
          ),
          infoList => infoList.map(it => it.location)
        )

        if (Object.keys(territories).length > 1) {
          console.debug(this.getItemName(fish._id), fish._id, territories)
          // return Object.values(territories).map(locations => {
          //   return {
          //     ...fish,
          //     locations,
          //   }
          // })
        } else {
          // return fish
        }
      })
    },
    updateWeatherChangePart(now) {
      this.fishListWeatherChangePart = this.lazySourceFishList.reduce(
        (fish2WeatherPart, fish) => {
          fish2WeatherPart[fish._id] = {
            fishWindows: this.getFishWindowOf(fish, now),
          }
          return fish2WeatherPart
        },
        {}
      )

      if (Object.keys(this.lazyFishWindowRates).length === 0) {
        this.lazySourceFishList.forEach(fish => {
          const fishWindows = this.fishListWeatherChangePart[fish._id]?.fishWindows
          this.lazyFishWindowRates[fish._id] = DataUtil.computeRate(fishWindows)
        })
      }
    },
    loadingSounds() {
      return DataUtil.loadingDefaultSounds(DataUtil.NOTIFICATION_SOUNDS)
    },
    // updateFishListTimePart(now) {
    //   this.lazySourceFishList.forEach(fish => {
    //     const countDown = this.fishListTimePart[fish._id]?.countDown
    //     // if (fish._id === 999999) {
    //     //   console.debug(countDown)
    //     // }
    //     if (countDown?.type === DataUtil.ALL_AVAILABLE) return
    //
    //     const lazyStartTime = countDown?.timePoint
    //     const currentInterval = countDown?.time
    //     if (
    //       (this.selectedFishId != null && fish._id === this.selectedFishId) ||
    //       (this.searchedFishId != null && fish._id === this.searchedFishId)
    //     ) {
    //       this.$set(this.extraFishListTimePart, fish._id, {
    //         id: fish._id,
    //         countDown: this.getCountDown(fish, now),
    //       })
    //     }
    //
    //     if (
    //       !lazyStartTime ||
    //       !currentInterval ||
    //       DataUtil.shouldUpdate(lazyStartTime - now, currentInterval)
    //     ) {
    //       this.$set(this.fishListTimePart, fish._id, {
    //         id: fish._id,
    //         countDown: this.getCountDown(fish, now),
    //       })
    //     }
    //   })
    // },
    assembleOceanFishList() {
      const fishList = Object.values(OCEAN_FISHING_FISH)
      return fishList.map(fish => this.assembleOceanFish(fish))
    },
    midRounding(num) {
      const decimal = Math.floor(num)
      const fraction = num * 10 - decimal * 10

      if (fraction >= 3 && fraction <= 7) {
        return decimal + 0.5
      } else if (fraction < 3) {
        return decimal
      } else {
        return decimal + 1
      }
    },
    assembleOceanFish(fish) {
      const hasPredators = fish.predators && Object.keys(fish.predators).length > 0
      const bonus = OCEAN_FISHING_BONUS[fish.bonus]
      const realNotAvailableWeatherSet = this.getRealNotAvailableWeatherSet(fish._id)

      const fishCollectedDataOfAllBaits = OCEAN_FISHING_BITE_TIME_COLLECTED.filter(
        it => it.fishId === fish._id
      ).map(it => ({
        baitId: it.baitId,
        baitName: it.bait,
        icon: this.getItemIconClass(it.baitId),
        biteTimeMin: this.midRounding(it.biteTimeMin),
        biteTimeMax: this.midRounding(it.biteTimeMax),
        count: it.count,
      }))

      const collectedBiteData = fishCollectedDataOfAllBaits.find(
        it => fish.bait === it.baitId
      )
      if (!collectedBiteData) {
        console.debug(this.getItemName(fish._id), 'miss data')
      }
      // else if (collectedBiteData.count < 10) {
      //   // console.log(collectedBiteData.fish, 'data not enough', collectedBiteData.count)
      // } else {
      //   // console.log(collectedBiteData.fish, 'used data cnt', collectedBiteData.count)
      //   // totalCnt += collectedBiteData.count
      // }

      const biteTimeMin =
        collectedBiteData?.biteTimeMin ??
        fish.biteTimeMin ??
        OCEAN_FISHING_BITE_TIME[fish._id]?.all?.[0]

      const biteTimeMax =
        collectedBiteData?.biteTimeMax ??
        fish.biteTimeMax ??
        OCEAN_FISHING_BITE_TIME[fish._id]?.all?.[1]

      return {
        ...fish,
        id: fish._id,
        type: 'normal',
        name: this.getItemName(fish._id),
        names: DataUtil.getItemNames(fish._id),
        icon: this.getItemIconClass(fish._id),
        hasFishingSpot: fish.locations.length !== 0,
        fishingSpots: this.getFishingSpots(fish.locations),
        biteTimeOfBaits: fishCollectedDataOfAllBaits,
        baitId: fish.bait,
        bait: {
          id: fish.bait,
          name: this.getItemName(fish.bait),
          icon: this.getItemIconClass(fish.bait),
        },
        baitExtraId: fish.baitExtra,
        baitExtra: fish.baitExtra
          ? {
              id: fish.baitExtra,
              name: this.getItemName(fish.baitExtra),
              icon: this.getItemIconClass(fish.baitExtra),
            }
          : null,
        baits: this.getBaits(fish, undefined, OCEAN_FISHING_FISH),
        availableBaitList: [],
        baitUniqueType: fish.isBaitUnique
          ? fish.baitExtra
            ? 'UNIQUE_WITHOUT_MOOCH'
            : 'UNIQUE'
          : 'NOT_UNIQUE',
        tug: fish.tug,
        tugIcon: DataUtil.TUG_ICON[fish.tug],
        hooksetIcon:
          fish.tug === 'heavy'
            ? DataUtil.iconIdToClass(DataUtil.HOOKSET_ICON[fish.hookset])
            : undefined,
        biteTimeMin: biteTimeMin,
        biteTimeMax: biteTimeMax,
        biteTimeForSort: biteTimeMin * 100 + (biteTimeMax ?? 0),
        hasWeatherConstraint: fish.notAvailableWeatherSet.length > 0,
        hasRealWeatherConstraint:
          realNotAvailableWeatherSet.length > fish.notAvailableWeatherSet.length,
        notAvailableWeatherSetDetail: this.getWeather(realNotAvailableWeatherSet),
        notAvailableWeatherSet: realNotAvailableWeatherSet,
        timeSet: fish.timeSet.map(time => ({
          time: time,
          timeText: DataUtil.timeId2TimeText(time),
          timeIcon: DataUtil.timeId2TimeIcon(time),
        })),
        hasPredators: hasPredators,
        predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
        predators: hasPredators ? this.getOceanFishPredators(fish.predators) : [],
        shadowPredators: [],
        bonusId: fish.bonus,
        bonus: {
          id: bonus._id,
          name: bonus.objective,
          icon: DataUtil.iconIdToClass(bonus.icon),
        },
        star: {
          quantity: fish.star,
          text: _.repeat('★', fish.star),
        },
      }
    },
    getRealNotAvailableWeatherSet(fishId) {
      const fish = OCEAN_FISHING_FISH[fishId]
      if (fish == null) return []

      const predatorIds = fish.predators ? Object.keys(fish.predators) : []
      return _.union(
        fish.notAvailableWeatherSet,
        fish.bestCatchPathExtra.length === 0
          ? fish.bestCatchPath.flatMap(fishId => {
              return this.getRealNotAvailableWeatherSet(fishId)
            })
          : _.intersection(
              fish.bestCatchPath.flatMap(fishId => {
                return this.getRealNotAvailableWeatherSet(fishId)
              }),
              fish.bestCatchPathExtra.flatMap(fishId => {
                return this.getRealNotAvailableWeatherSet(fishId)
              })
            ),
        predatorIds.flatMap(fishId => this.getRealNotAvailableWeatherSet(fishId))
      )
    },
    getOceanFishPredators(predators) {
      if (predators == null || Object.keys(predators).length === 0) {
        return []
      } else {
        return Object.entries(predators).map(([predatorId, count]) => {
          return {
            ...this.assembleOceanFish(OCEAN_FISHING_FISH[predatorId]),
            requiredCnt: count,
          }
        })
      }
    },
    getRequiredCntOfFish(fish, cnt) {
      if (fish.patch < 6 && SystemInfo.region === 'Global' && cnt === 10) {
        return 7
      }
      return cnt ?? 0
    },
    assembleSpearFish(fish, isPredator = false) {
      const hasPredators = Object.keys(fish.predators).length > 0
      const hasShadowPredators =
        fish.shadowPredators != null && Object.keys(fish.shadowPredators).length > 0
      const rate = this.lazyFishWindowRates[fish._id]
      const fishSize = spearFishSize[fish._id]
      return {
        _id: fish._id,
        id: fish._id,
        type: 'spear',
        icon: this.getItemIconClass(fish._id),
        iconRemoteUrl: null,
        showHatCover: false,
        name: this.getItemName(fish._id),
        names: DataUtil.getItemNames(fish._id),
        hasFishingSpot: true,
        fishingSpots: fish.locations
          .map(location => {
            const gatheringPoint = FIX.SPEAR_FISH_GATHERING_POINTS[location]
            return {
              locationId: location,
              zone: placeNames[gatheringPoint.territoryPlaceNameId],
              fishingSpot: gatheringPoint,
              fishingSpotName: DataUtil.getName(gatheringPoint),
              fishingSpotId: location,
              fishSpotPositionText: DataUtil.toPositionText(gatheringPoint),
            }
          })
          .sort((a, b) => a.locationId - b.locationId),
        baitsExtra: [],
        baits: [],
        availableBaitList: [],
        hasFishEyes: false,
        hasSnagging: false,
        startHourText: DataUtil.formatET(fish.startHour),
        endHourText: DataUtil.formatET(fish.endHour),
        hasTimeConstraint: fish.startHour !== 0 || fish.endHour !== 24,
        requiredCnt: this.getRequiredCntOfFish(fish, fish.requiredCnt),
        addBuffSuffix: false,
        hasWeatherConstraint:
          fish.previousWeatherSet.length > 0 || fish.weatherSet.length > 0,
        previousWeatherSet: fish.previousWeatherSet,
        weatherSet: fish.weatherSet,
        previousWeatherSetDetail: this.getWeather(fish.previousWeatherSet),
        weatherSetDetail: this.getWeather(fish.weatherSet),
        patch: fish.patch,
        patchText: DataUtil.toPatchText(fish.patch),
        folklore: null,
        collectable: fish.collectable,
        isFuturePatch: false, // fish.patch > DataUtil.PATCH_AVAILABLE_MAX,
        rate: rate,
        rateText: this.$t('countDown.rate', {
          rate: ((rate ?? 1) * 100).toPrecision(2),
        }),
        isPredator: isPredator,
        anglerFishId: fish.anglerFishId,
        hasTips: true, // DataUtil.hasTips(fish._id),
        hasShadowPredators: hasShadowPredators,
        shadowPredators: hasShadowPredators
          ? this.getSpearFishPredators(fish.shadowPredators)
          : [],
        predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
        intuitionLength: fish.intuitionLength,
        hasPredators: hasPredators,
        predators: hasPredators ? this.getSpearFishPredators(fish.predators) : [],
        gig: fish.gig
          ? {
              id: fish.gig,
              type: DataUtil.GIG_DICT[fish.gig],
              icon: DataUtil.GIG_ICON[DataUtil.GIG_DICT[fish.gig]],
              text: this.$t('gig.' + DataUtil.GIG_DICT[fish.gig]),
            }
          : {},
        size: {
          id: fishSize,
          icon: ImgUtil.getImgUrl(`${fishSize}.webp`),
          text: this.$t('size.' + fishSize),
          sizeFactor: fishSize === 'small' ? 0.5 : fishSize === 'average' ? 0.8 : 1,
        },
        checking: !!fish.checkInfo,
        checkInfo: fish.checkInfo ?? {},
      }
    },
    getSpearFishPredators(predators) {
      if (predators == null || Object.keys(predators).length === 0) {
        return []
      } else {
        return Object.entries(predators).map(([predatorId, count]) => {
          const predator = this.allFish[predatorId]
          return {
            ...this.assembleSpearFish(predator, true),
            requiredCnt: this.getRequiredCntOfFish(predator, count),
          }
        })
      }
    },
    assembleFish(fishSourceList, isPredator = false) {
      return fishSourceList.map(fish => {
        if (fish.gig != null) {
          // console.log('spear fish', fish)
          return this.assembleSpearFish(fish)
        }
        const hasPredators = Object.keys(fish.predators).length > 0
        const rate = this.lazyFishWindowRates[fish._id]
        const bestCatchPathExtra = fish.bestCatchPathExtra ?? []
        const folklore = fish.folklore && this.folklore[fish.folklore]
        const aquariumFish = FIX.AQUARIUMS[DataUtil.toItemId(fish._id)]
        const tasks = Object.values(FIX.QUEST).filter(task =>
          task.items.includes(fish._id)
        )
        return {
          // TODO remove _id
          _id: fish._id,
          id: fish._id,
          type: 'normal',
          isCustomDeliveriesTarget: SATISFACTION_SUPPLY_FISH.includes(fish._id),
          icon: this.getItemIconClass(fish._id),
          iconRemoteUrl: this.getItemIconUrl(fish._id),
          showHatCover:
            this.inStartLight &&
            this.showHatCover &&
            FIX.STARLIGHT_CELEBRATION.fish.includes(fish._id),
          name: this.getItemName(fish._id),
          names: DataUtil.getItemNames(fish._id),
          hasFishingSpot: fish.locations.length !== 0,
          // zone: this.getZoneName(fish.location),
          // fishingSpot: this.getFishingSpotsName(fish.location),
          fishingSpots: this.getFishingSpots(fish.locations),
          // .map(location => {
          // return {
          //   zone: this.getZoneName(location),
          //   fishingSpotName: this.getFishingSpotsName(location),
          //   fishingSpotId: location,
          // }
          // }),
          baitsExtra:
            bestCatchPathExtra.length > 0 ? this.getBaits(fish, bestCatchPathExtra) : [],
          availableBaitList: fish.catchPathList
            ? fish.catchPathList.map(it => this.getBaits(fish, it))
            : [],
          baits: this.getBaits(fish),
          tug: fish.tug,
          hasFishEyes: fish.fishEyes !== false,
          fishEyesIcon: DataUtil.iconIdToClass(DataUtil.ICON_FISH_EYES),
          fishEyesText: DataUtil.secondsToMinutesString(fish.fishEyes),
          fishEyesSeconds: fish.fishEyes,
          hasPredators: hasPredators,
          predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
          hasSnagging: fish.snagging,
          snaggingIcon: DataUtil.iconIdToClass(DataUtil.ICON_SNAGGING),
          startHourText: fish.startHourText ?? DataUtil.formatET(fish.startHour),
          endHourText: fish.endHourText ?? DataUtil.formatET(fish.endHour),
          hasTimeConstraint: fish.startHour !== 0 || fish.endHour !== 24,
          requiredCnt: fish.requiredCnt ?? 0,
          addBuffSuffix: hasPredators && DataUtil.isAllAvailableFish(fish),
          hasWeatherConstraint:
            fish.previousWeatherSet.length > 0 || fish.weatherSet.length > 0,
          previousWeatherSet: fish.previousWeatherSet,
          weatherSet: fish.weatherSet,
          previousWeatherSetDetail: this.getWeather(fish.previousWeatherSet),
          weatherSetDetail: this.getWeather(fish.weatherSet),
          patch: fish.patch,
          patchText:
            fish.patch.toString().indexOf('.') !== -1
              ? fish.patch.toString()
              : fish.patch.toFixed(1),
          folklore: folklore && {
            id: folklore._id,
            itemId: folklore.itemId,
            name: this.getItemName(folklore.itemId),
            icon: this.getItemIconClass(folklore.itemId),
          },
          collectable: fish.collectable,
          isFuturePatch: false, // fish.patch > DataUtil.PATCH_AVAILABLE_MAX,
          rate: rate,
          rateText: this.$t('countDown.rate', {
            rate: ((rate ?? 1) * 100).toPrecision(2),
          }),
          isPredator: isPredator,
          anglerFishId: fish.anglerFishId,
          hasTips: true, // DataUtil.hasTips(fish._id),
          predators: this.assembleFish(DataUtil.getPredators(fish, this.allFish), true),
          shadowPredators: [],
          aquarium: !!aquariumFish && {
            size: FIX.AQUARIUM_FISH_SIZE[aquariumFish.size].size,
            water: DataUtil.getName(FIX.AQUARIUM_WATER[aquariumFish.aquariumWater]),
          },
          tasks: tasks,
          hasTasks: tasks.length > 0,
          checking: !!fish.checkInfo,
          checkInfo: fish.checkInfo ?? {},
          intuitionLength: fish.intuitionLength,
        }
      })
    },
    getCountDown(fish, now) {
      // utilize 8 hours fish windows computed if exists
      // and not out of time(use 2 fish window cached if necessary)
      const fishingSpot = fish.gig != null ? null : this.fishingSpots[fish.locations[0]]
      if (fishingSpot || fish.gig != null) {
        const remainingFishWindows = (
          this.fishListWeatherChangePart[fish._id]?.fishWindows ?? []
        ).filter(it => it[1] > now)

        const missingFishWindowN =
          FishWindow.FISH_WINDOW_FORECAST_N - remainingFishWindows.length

        let fishWindowsComputed
        if (missingFishWindowN > 0) {
          fishWindowsComputed = this.getFishWindowOf(fish, now)
        } else {
          fishWindowsComputed = remainingFishWindows
        }
        this.fishListWeatherChangePart[fish._id] = {
          ...this.fishListWeatherChangePart[fish._id],
          fishWindows: fishWindowsComputed,
        }

        let targetFishWindow
        let nextTargetFishWindow

        for (let i = 0; i < fishWindowsComputed.length; i++) {
          if (fishWindowsComputed[i][1] >= now) {
            targetFishWindow = fishWindowsComputed[i]
            if (i + 1 < fishWindowsComputed.length) {
              nextTargetFishWindow = fishWindowsComputed[i + 1]
            }
            break
          }
        }

        if (targetFishWindow == null) {
          return { type: DataUtil.ALL_AVAILABLE }
        }
        if (now <= targetFishWindow[0]) {
          return {
            type: DataUtil.WAITING,
            // time: targetFishWindow[0] - now,
            timePoint: targetFishWindow[0],
            fishWindowTotal: targetFishWindow[1] - targetFishWindow[0],
          }
        } else if (now <= targetFishWindow[1]) {
          return {
            type: DataUtil.FISHING,
            // time: targetFishWindow[1] - now,
            timePoint: targetFishWindow[1],
            fishWindowTotal: targetFishWindow[1] - targetFishWindow[0],
            // nextInterval: nextTargetFishWindow              ? nextTargetFishWindow[0] - now              : undefined,
            nextTimePoint: nextTargetFishWindow ? nextTargetFishWindow[0] : undefined,
          }
        }
      } else {
        return { type: DataUtil.ALL_AVAILABLE }
      }
    },
    getFishWindowOf(fish, now) {
      return DataUtil.getFishWindow(
        fish,
        now,
        this.allFish,
        this.fishingSpots,
        this.fishEyesUsed
      )
    },
    goTo(href) {
      window.open(href)
    },
    onConfirmPatchNote() {
      this.setWebsiteVersion(version)
      this.showPatchNoteDialog = false
    },
    setMiniMode(mini) {
      this.sendElectronEvent('miniMode', mini)
    },
    setActiveTabLater(index) {
      setTimeout(() => this.setActiveTab(index), 500)
    },
    cafeKitTooltipCopyPatch() {
      new ClipboardJS('.cafekit.ck-popup .ck-container button', {
        text: trigger => {
          if (trigger.innerText === '已复制') {
            this.showSnackbar({
              text: this.$t('importExport.dialog.message.copySuccess'),
              color: 'success',
            })
            return window.document
              .getElementsByClassName('ck-item-name-name')[0]
              .innerText.trim()
          }
        },
      })
    },
    toggleNavMini() {
      this.mini = !this.mini
    },
    showNavi() {
      if (this.isMobile) {
        this.drawer = !this.drawer
      }
    },
    onFishIconClicked() {
      this.setMiniMode(true)
    },
    ...mapMutations('dialog', ['setShowDialog']),
    ...mapMutations([
      'setShowImportExportDialog',
      'disableStrictMode',
      'boardCastReload',
      'setOpacity',
      'setZoomFactor',
      'setFeatureViewed',
      'updateUserData',
      'setFishCompleted',
      'toggleFilterPanel',
      'setShowSearchDialog',
      'setWebsiteVersion',
      'setActiveTab',
      'showSnackbar',
      'setSounds',
      'setThemeMode',
      'startLoading',
      'finishLoading',
      'setStartLight',
      'initialUserData',
      'setShowCompetitionDialog',
      'setNow',
    ]),
  },
}
</script>

<style scoped></style>
