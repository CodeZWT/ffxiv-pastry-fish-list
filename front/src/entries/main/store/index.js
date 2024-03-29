import { AlarmModule } from '@/entries/main/store/alarm'
import { AnnouncementModule } from '@/entries/main/store/announcement'
import { DialogModule } from '@/entries/screen/store/dialog'
import { FlagModule } from '@/entries/screen/store/oneTimeFlag'
import { KeybindingModule } from '@/entries/screen/store/keybinding'
import { LocalSettingModule } from '@/entries/main/store/localSetting'
import {
  loadBaitFilterUserData,
  loadReaderUserData,
  loadUserData,
} from '@/utils/UserDataLoader'
import { sendElectronEvent } from '@/utils/electronHelper'
import CONSTANTS from 'Data/constants'
import DATA from 'Data/data'
import DATA_CN from 'Data/translation'
import DataUtil from '@/utils/DataUtil'
import FISH from 'Data/fish'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import WEATHER_NAMES from 'Data/locale/weather'
import _ from 'lodash'
import placeNames from 'Data/locale/placeNames'
import router from '@/entries/main/router'

Vue.use(Vuex)

const ScreenPluginOf = router => store => {
  let prevState = _.cloneDeep({
    userData: store.state.userData,
    readerSetting: store.state.readerSetting,
  })
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep({
      userData: state.userData,
      readerSetting: state.readerSetting,
    })
    const source = router.currentRoute.name
    if (mutation.type === 'boardCastReload') {
      // skip boardCastReload mutation
    } else if (!_.isEqual(prevState, nextState)) {
      // if (
      //   mutation.type === 'setUserData' ||
      //   mutation.type === 'setUserDataToDefault' ||
      //   mutation.type === 'setStarLight' ||
      //   prevState.userData.fishEyesUsed !== nextState.userData.fishEyesUsed
      // ) {
      //   const isElectron = DevelopmentModeUtil.isElectron()
      //   state.snackbar = {
      //     show: true,
      //     text: `设置成功，即将${isElectron ? '重启' : '重新加载页面'}，请稍后...`,
      //     color: 'success',
      //     timeout: 2000,
      //   }
      //   if (isElectron) {
      //     setTimeout(() => {
      //       sendElectronEvent('relaunch')
      //     }, 1000)
      //   } else {
      //     setTimeout(() => {
      //       window.location.reload()
      //     }, 1000)
      //   }
      // } else {
      sendElectronEvent('broadcast', {
        source: source,
        type: 'reloadSetting',
        data: nextState,
      })
      // }
    }
    prevState = nextState
  })
}

const vuexLocal = new VuexPersistence({
  key: 'RC_LOCAL_SETTING',
  storage: window.localStorage,
  filter: mutation => {
    return mutation.type === 'localSetting/setSetting'
  },
  reducer: state => {
    return { localSetting: state.localSetting }
  },
})

const announcementStorage = new VuexPersistence({
  key: 'RC_ANNOUNCEMENT',
  storage: window.localStorage,
  filter: mutation => {
    return mutation.type.startsWith('announcement/')
  },
  reducer: state => {
    return { announcement: state.announcement }
  },
})

export const MainModule = {
  plugins: [ScreenPluginOf(router), vuexLocal.plugin, announcementStorage.plugin],
  state: {
    window: 'main',
    now: Date.now(),
    fish: FISH,
    fishingSpots: DataUtil.FISHING_SPOTS,
    spearFishingSports: DATA.SPEARFISHING_SPOTS,
    items: DataUtil.ITEMS,
    achievements: DATA_CN.OCEAN_FISHING_ACHIEVEMENTS,
    weatherRates: DATA.WEATHER_RATES,
    weatherTypes: DATA_CN.WEATHER_TYPES,
    bigFish: DATA_CN.BIG_FISH,
    folklore: DATA_CN.FOLKLORE,
    showSearchDialog: false,
    showImportExportDialog: false,
    snackbar: {
      show: false,
      text: '',
      color: '',
      timeout: 2000,
    },
    activeTabIndex: DataUtil.TAB_INDEX_NORMAL,
    aetheryte: _.groupBy(DATA_CN.AETHERYTE, 'mapFileId'),
    sounds: {},
    showFishPageRightPane: false,
    loading: false,
    userData: loadUserData(),
    readerSetting: loadReaderUserData(),
    // fish page filter
    // baitFilterEnabled: false,
    // baitFilterIds: [],
    baitFilter: loadBaitFilterUserData(),
    // bait notification cache
    remainingBaitIds: initRemainingBaitIds(),
    baitIdsForNotification: [],
    viewedFeatures: LocalStorageUtil.loadViewedFeatures(CONSTANTS.FEATURE_GROUP_MAIN),
    windowSetting: {
      opacity: 0.9,
      zoomFactor: 1,
    },
  },
  getters: {
    showCompetitionDialog: state => {
      return state.userData.showCompetitionDialog
    },
    mainWindowCloseMode: state => {
      return state.userData.mainWindow.closeMode
    },
    mainWindowConfig: state => {
      return state.userData.mainWindow
    },
    listSetting: state => {
      return DataUtil.getUserDataPart(state)('listSetting')
    },
    fishEyesUsed: state => {
      return DataUtil.getUserDataPart(state)('fishEyesUsed')
    },
    showChromeBugDialog: state => {
      return state.userData.showChromeBugDialog
    },
    defaultLinkOf: state => mode => {
      return state.userData.link.default[mode]
    },
    getItemIconUrl: state => id => {
      const iconId = state.items[DataUtil.toItemId(id)]?.icon ?? 1100
      // const localImg = require(`../assert/${iconId}.webp`)
      // if (localImg) {
      //   return localImg
      // } else {
      return DataUtil.iconIdToUrl(iconId)
      // }
    },
    getItemIconClass: () => id => {
      return DataUtil.getItemIconClass(id)
    },
    getDiademItemIconUrl: () => id => {
      return DataUtil.getDiademItemIconUrl(id)
    },
    getAchievementIconClass: state => id => {
      const iconId = state.achievements[id]?.icon ?? 1100
      return DataUtil.iconIdToClass(iconId)
    },
    getAchievementName: state => id => {
      return DataUtil.getName(state.achievements[id])
    },
    getItemName: () => id => {
      return DataUtil.getItemName(id)
    },
    getZoneName: state => id => {
      const fishingSpot = state.fishingSpots[id]
      if (fishingSpot) {
        return DataUtil.getName(placeNames[fishingSpot.territoryTypePlaceNameId])
      } else {
        return ''
      }
    },
    getFishingSpotsName: state => id => {
      if (id != null) {
        return (
          state.fishingSpots[id] &&
          DataUtil.getName(placeNames[state.fishingSpots[id].placeNameId])
        )
      } else {
        return ''
      }
    },
    getFishingSpotsNames: state => id => {
      if (id != null) {
        const names =
          state.fishingSpots[id] && placeNames[state.fishingSpots[id].placeNameId]
        return {
          chs: names.name_chs,
          en: names.name_en,
          ja: names.name_ja,
        }
      } else {
        return {}
      }
    },
    getFishingSpots: (_, getters) => locations =>
      locations.map(location => {
        const fishingSpot = getters.getFishingSpot(location)
        return {
          zone: getters.getZoneName(location),
          fishingSpot: fishingSpot,
          fishingSpotName: DataUtil.getPlaceName(fishingSpot.placeNameId),
          fishingSpotNames: DataUtil.getPlaceNames(fishingSpot.placeNameId),
          fishingSpotId: location,
          fishSpotPositionText: DataUtil.toPositionText(fishingSpot),
        }
      }),
    getBaits: (state, getters) => (
      fish,
      customizedBestCatchPath,
      customizeFishDict,
      diademAnyBait = false
    ) => {
      const bestCatchPath = customizedBestCatchPath ?? fish.bestCatchPath
      if (bestCatchPath == null || bestCatchPath.length < 1) return []
      const fishDict = customizeFishDict ?? state.fish
      const baitId = bestCatchPath[bestCatchPath.length - 1]
      const hookset = DataUtil.tugToHookset(fish.tug, fish.hookset, fish._id)
      const optionalIndices = fish.optional ?? []
      const lastBait = {
        tug: fish.tug,
        tugIcon: DataUtil.TUG_ICON[fish.tug],
        hookset: hookset,
        hooksetIcon: DataUtil.iconIdToClass(DataUtil.HOOKSET_ICON[hookset]),
        hooksetSkillName: DataUtil.HOOKSET_SKILL_NAME_DICT[fish.hookset],
        baitId: baitId,
        baitName: getters.getItemName(baitId),
        baitNames: DataUtil.getItemNames(baitId),
        baitIcon: getters.getItemIconClass(baitId),
        biteSelf: fishDict[baitId]?.biteSelf,
        diademAnyBait: diademAnyBait && baitId === 29717,
      }
      if (bestCatchPath.length === 1) {
        return [lastBait]
      } else {
        return bestCatchPath.map((baitId, index, arr) => {
          if (index === arr.length - 1) {
            return lastBait
          } else {
            const baitFish = fishDict[arr[index + 1]]
            const hookset = DataUtil.tugToHookset(
              baitFish.tug,
              baitFish.hookset,
              baitFish._id
            )
            return {
              tug: baitFish.tug,
              tugIcon: DataUtil.TUG_ICON[baitFish.tug],
              hookset: hookset,
              hooksetIcon: DataUtil.iconIdToClass(DataUtil.HOOKSET_ICON[hookset]),
              baitId: baitId,
              baitName: getters.getItemName(baitId),
              baitNames: DataUtil.getItemNames(baitId),
              baitIcon: getters.getItemIconClass(baitId),
              optional: optionalIndices.includes(index),
              biteSelf: fishDict[baitId]?.biteSelf,
              diademAnyBait: diademAnyBait && baitId === 29717,
            }
          }
        })
      }
    },
    getZoneId: state => id => {
      const fishingSpot = state.fishingSpots[id]
      if (fishingSpot) {
        return this.weatherRates[fishingSpot.territoryTypeId].zone_id
      }
    },
    getWeather: state => weatherSet => {
      return weatherSet.map(id => {
        return {
          name: DataUtil.getName(WEATHER_NAMES[id]),
          icon: DataUtil.iconIdToClass(state.weatherTypes[id].icon),
        }
      })
    },
    getFishingSpot: state => fishingSpotId => {
      return state.fishingSpots[fishingSpotId]
    },
    getFishCompleted: state => fishId => {
      return state.userData.completed.includes(DataUtil.toItemId(fishId))
    },
    allCompletedFish: state => {
      return state.userData.completed
    },
    getFishPinned: state => fishId => {
      return state.userData.pinned.includes(DataUtil.toItemId(fishId))
    },
    getFishToBeNotified: state => fishId => {
      return state.userData.toBeNotified.includes(DataUtil.toItemId(fishId))
    },
    getFishToBeNotifiedLocked: state => fishId => {
      return state.userData.toBeNotifiedLocked.includes(DataUtil.toItemId(fishId))
    },
    filters: state => {
      return state.userData.filters
    },
    pinnedFishIds: state => {
      return state.userData.pinned
    },
    toBeNotifiedFishIds: state => {
      return state.userData.toBeNotified
    },
    toBeNotifiedIKDRoutes: state => {
      return state.userData.toBeNotifiedIKDRoutes
    },
    showFilter: state => {
      return state.userData.showFilter
    },
    showBanner: state => {
      return state.userData.showBanner
    },
    isRoseMode: state => {
      return state.userData.isRoseMode
    },
    readChartTip: state => {
      return state.userData.readChartTip
    },
    opacity: state => {
      return state.windowSetting.opacity
    },
    zoomFactor: state => {
      return state.windowSetting.zoomFactor
    },
    websiteVersion: state => {
      return state.userData.websiteVersion
    },
    rightPanePercentageV2: state => {
      return state.userData.rightPanePercentageV2
    },
    isNormalTabActive: state => {
      return state.activeTabIndex === DataUtil.TAB_INDEX_NORMAL
    },
    notification: state => {
      return state.userData.notification
    },
    detailComponents: state => {
      return state.userData.detailArrangement.components
    },
    isSystemNotificationEnabled: state => {
      return state.userData.notification.isSystemNotificationEnabled
    },
    themeMode: state => {
      return state.userData.theme.mode
    },
    showOceanFishingWarningDialog: state => {
      return state.userData.oceanFishing.showWarningDialog
    },
    showOFUpdateDialog: state => {
      return state.userData.oceanFishing.showUpdateDialog
    },
    showOFBiteTimeDialog: state => {
      return state.userData.oceanFishing.showBiteTimeDialog
    },
    enableBaitNotification: state => {
      return state.userData.bait.enableNotification
    },
    baitSetting: state => {
      return state.userData.bait
    },
  },
  mutations: {
    clearIKDRouteToBeNotified(state) {
      state.userData.toBeNotifiedIKDRoutes = []
    },
    setNow(state, now) {
      state.now = now
    },
    setMainSetting(state, { path, value }) {
      state.userData = { ..._.set(state.userData, path, value) }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setReaderSetting(state, { path, value }) {
      state.readerSetting = { ..._.set(state.readerSetting, path, value) }
      LocalStorageUtil.storeReaderUserData(state.readerSetting)
    },
    disableStrictMode(state) {
      DataUtil.setReaderSettingPart(state, {
        path: 'isStrictMode',
        data: false,
      })
    },
    boardCastReload(state) {
      state.userData = loadUserData()
      state.readerSetting = loadReaderUserData()
    },
    setRoseMode(state, rose) {
      state.userData = { ...state.userData, isRoseMode: rose }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setReadChartTip(state, read) {
      state.userData = { ...state.userData, readChartTip: read }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setShowCompetitionDialog(state, show) {
      state.userData.showCompetitionDialog = show
      LocalStorageUtil.storeUserData(state.userData)
    },
    setMainWindowCloseMode(state, mode) {
      state.userData = {
        ...state.userData,
        mainWindow: { ...state.userData.mainWindow, closeMode: mode },
      }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setFeatureViewed(state, feature) {
      if (!state.viewedFeatures.includes(feature)) {
        state.viewedFeatures.push(feature)
      }
      LocalStorageUtil.storeViewedFeatures(
        CONSTANTS.FEATURE_GROUP_MAIN,
        state.viewedFeatures
      )
    },
    updateUserData(state, data) {
      DataUtil.setUserDataPart(state, data)
    },
    updateListExpanded(state, { listType, expanded }) {
      state.userData.listSetting[listType].expanded = expanded
      LocalStorageUtil.storeUserData(state.userData)
    },
    updateShowPinnedInNormalList(state, show) {
      DataUtil.setUserDataPartSilently(state, {
        path: 'listSetting.pinned.showPinnedInNormalList',
        data: show,
      })
    },

    updateUserBaitFilterData(state, { path, data }) {
      if (path) {
        const newBaitFilter = _.cloneDeep(state.baitFilter)
        _.set(newBaitFilter, path, data)
        state.baitFilter = newBaitFilter
      } else {
        state.baitFilter = _.cloneDeep(data)
      }
      LocalStorageUtil.storeBaitFilter(state.baitFilter)
    },
    updateRemainingBaitIdsWithoutCheck(state) {
      state.remainingBaitIds = getRemainingBaitIdsWithUserData(state.userData)
    },
    updateBaitSetting(state, baitSetting) {
      const cloneUserData = _.cloneDeep(state.userData)
      cloneUserData.bait = baitSetting
      state.userData = cloneUserData
      LocalStorageUtil.storeUserData(state.userData)
    },
    setLinkDefault(state, { mode, id }) {
      const cloneUserData = _.cloneDeep(state.userData)
      cloneUserData.link.default[mode] = id
      state.userData = cloneUserData
      LocalStorageUtil.storeUserData(state.userData)
    },
    // setBaitFilterEnabled(state, enabled) {
    //   state.baitFilterEnabled = enabled
    // },
    // setBaitFilterIds(state, ids) {
    //   DataUtil.setUserDataPart(state, {path: 'baitFiler.baitIds', data: ids})
    // },
    initialUserData(state) {
      // state.userData = DataUtil.mergeUserData(
      //   _.cloneDeep(DataUtil.USER_DEFAULT_DATA),
      //   LocalStorageUtil.loadUserData()
      // )
      LocalStorageUtil.storeUserData(state.userData)
    },
    setUserData(state, data) {
      state.userData = DataUtil.migrateOldVersionUserData({
        ..._.cloneDeep(DataUtil.USER_DEFAULT_DATA),
        ...data,
      })
      LocalStorageUtil.storeUserData(state.userData)
    },
    setUserDataToDefault(state) {
      state.userData = _.cloneDeep(DataUtil.USER_DEFAULT_DATA)
      state.baitFilter = _.cloneDeep(DataUtil.USER_DEFAULT_DATA.baitFilter)
      LocalStorageUtil.storeUserData(state.userData)
      LocalStorageUtil.storeBaitFilter(state.baitFilter)
    },
    resetFishCompleted(state, fishIds) {
      if (fishIds) {
        state.userData = {
          ...state.userData,
          completed: _.uniq(fishIds),
        }
      }
    },
    batchSetFishCompleted(state, { fishIds, completed }) {
      const simpleFishIds = fishIds.map(fishId => DataUtil.toItemId(fishId))
      state.userData = updateUserDataStateRecords(
        state.userData,
        'completed',
        simpleFishIds,
        completed
      )
      const newRemainingBaitIds = getRemainingBaitIdsWithUserData(state.userData)
      const removed = _.difference(state.remainingBaitIds, newRemainingBaitIds)
      if (removed.length > 0 && state.userData.bait.enableNotification) {
        state.baitIdsForNotification = removed
      }
      state.remainingBaitIds = newRemainingBaitIds
      if (completed) {
        const unlockedFishId = simpleFishIds.filter(
          fishId => !state.userData.toBeNotifiedLocked.includes(fishId)
        )
        state.userData = updateUserDataStateRecords(
          state.userData,
          'toBeNotified',
          unlockedFishId,
          false
        )
      }
    },
    setFishCompleted(state, { fishId, completed }) {
      const simpleFishId = DataUtil.toItemId(fishId)
      state.userData = updateUserDataStateRecords(
        state.userData,
        'completed',
        [simpleFishId],
        completed
      )
      const newRemainingBaitIds = getRemainingBaitIdsWithUserData(state.userData)
      const removed = _.difference(state.remainingBaitIds, newRemainingBaitIds)
      if (removed.length > 0 && state.userData.bait.enableNotification) {
        state.baitIdsForNotification = removed
      }
      state.remainingBaitIds = newRemainingBaitIds
      if (completed && !state.userData.toBeNotifiedLocked.includes(simpleFishId)) {
        state.userData = updateUserDataStateRecords(
          state.userData,
          'toBeNotified',
          [simpleFishId],
          false
        )
      }
    },
    setFishPinned(state, { fishId, pinned }) {
      state.userData = updateUserDataStateRecords(
        state.userData,
        'pinned',
        [DataUtil.toItemId(fishId)],
        pinned
      )
    },
    setFishToBeNotified(state, { fishId, toBeNotified }) {
      const simpleFishId = DataUtil.toItemId(fishId)
      state.userData = updateUserDataStateRecords(
        state.userData,
        'toBeNotified',
        [simpleFishId],
        toBeNotified
      )
      if (!toBeNotified) {
        state.userData = updateUserDataStateRecords(
          state.userData,
          'toBeNotifiedLocked',
          [simpleFishId],
          false
        )
      }
    },
    setIKDRouteToBeNotified(state, { routeId, toBeNotified }) {
      state.userData = updateUserDataStateRecords(
        state.userData,
        'toBeNotifiedIKDRoutes',
        [routeId],
        toBeNotified
      )
    },

    setFishToBeNotifiedLocked(state, { fishId, toBeNotifiedLocked }) {
      state.userData = updateUserDataStateRecords(
        state.userData,
        'toBeNotifiedLocked',
        [DataUtil.toItemId(fishId)],
        toBeNotifiedLocked
      )
    },
    setFilters(state, filters) {
      state.userData = { ...state.userData, filters }
      LocalStorageUtil.storeUserData(state.userData)
    },
    toggleFilterPanel(state) {
      state.userData = { ...state.userData, showFilter: !state.userData.showFilter }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setShowSearchDialog(state, show) {
      state.showSearchDialog = show
    },
    setShowImportExportDialog(state, show) {
      state.showImportExportDialog = show
    },
    showSnackbar(state, snackBarSetting) {
      state.snackbar = {
        show: true,
        text: snackBarSetting.text,
        color: snackBarSetting.color,
        timeout: snackBarSetting.timeout ?? 2000,
      }
    },
    setNotShowBanner(state) {
      state.userData = { ...state.userData, showBanner: false }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setShowFilter(state, showFilter) {
      state.userData = { ...state.userData, showFilter }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setOpacity(state, opacity) {
      // state.windowSetting.opacity = opacity
      state.windowSetting = { ...state.windowSetting, opacity }
      // LocalStorageUtil.storeUserData(state.userData)
    },
    setZoomFactor(state, zoomFactor) {
      state.windowSetting = { ...state.windowSetting, zoomFactor }
      // state.userData = { ...state.userData, zoomFactor }
      // LocalStorageUtil.storeUserData(state.userData)
    },
    setWebsiteVersion(state, websiteVersion) {
      state.userData = { ...state.userData, websiteVersion }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setMigrationVersion(state, migrationVersion) {
      state.userData = { ...state.userData, migrationVersion }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setRightPanePercentageV2(state, rightPanePercentageV2) {
      state.userData = { ...state.userData, rightPanePercentageV2 }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setActiveTab(state, activeTabIndex) {
      state.activeTabIndex = activeTabIndex
    },
    setNotification(state, notification) {
      state.userData = { ...state.userData, notification }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setSounds(state, sounds) {
      console.debug('update sounds', sounds)
      state.sounds = { ...state.sounds, ...sounds }
    },
    clearToBeNotified(state) {
      state.userData = { ...state.userData, toBeNotified: [] }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setDetailArrangement(state, detailArrangement) {
      state.userData = { ...state.userData, detailArrangement }
      LocalStorageUtil.storeUserData(state.userData)
    },
    enableSystemNotification(state) {
      state.userData = {
        ...state.userData,
        notification: {
          ...state.userData.notification,
          isSystemNotificationEnabled: true,
        },
      }
      LocalStorageUtil.storeUserData(state.userData)
    },
    disableSystemNotification(state) {
      state.userData = {
        ...state.userData,
        notification: {
          ...state.userData.notification,
          isSystemNotificationEnabled: false,
        },
      }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setShowFishPageRightPane(state, show) {
      state.showFishPageRightPane = show
    },
    setThemeMode(state, mode) {
      state.userData = {
        ...state.userData,
        theme: {
          ...state.userData.theme,
          mode: mode,
        },
      }
      LocalStorageUtil.storeUserData(state.userData)
    },
    startLoading(state) {
      state.loading = true
    },
    finishLoading(state) {
      state.loading = false
    },
    setShowOceanFishingWarningDialog(state, show) {
      state.userData = {
        ...state.userData,
        oceanFishing: { ...state.userData.oceanFishing, showWarningDialog: show },
      }
      LocalStorageUtil.storeUserData(state.userData)
    },
    setShowOFUpdateDialog(state, show) {
      _.set(state.userData, 'oceanFishing.showUpdateDialog', show)
      LocalStorageUtil.storeUserData(state.userData)
    },
    setShowOFBiteTimeDialog(state, show) {
      _.set(state.userData, 'oceanFishing.showBiteTimeDialog', show)
      LocalStorageUtil.storeUserData(state.userData)
    },
    setNotShowChromeBugDialog(state) {
      state.userData = { ...state.userData, showChromeBugDialog: false }
      LocalStorageUtil.storeUserData(state.userData)
    },
  },
  actions: {
    syncFishCompleted(context, fishIds) {
      context.commit('resetFishCompleted', fishIds)
      context.commit('batchSetFishCompleted', { fishIds, completed: true })
      return
    },
  },
  modules: {
    // screenWindow: ScreenWindowModule,
    keybinding: KeybindingModule,
    dialog: DialogModule,
    flag: FlagModule,
    alarm: AlarmModule,
    localSetting: LocalSettingModule,
    announcement: AnnouncementModule,
  },
}

export default new Vuex.Store(MainModule)
export { ScreenPluginOf }

function updateUserDataStateRecords(userData, type, keys, value) {
  // console.debug('set', type, value, keys)
  const temp = _.cloneDeep(userData)
  if (value) {
    const arr = temp[type]
    keys.forEach(key => {
      if (arr.indexOf(key) === -1 && key != null) {
        arr.push(key)
      }
    })
  } else {
    temp[type] = userData[type].filter(it => !keys.includes(it))
  }
  LocalStorageUtil.storeUserData(temp)
  return temp
}

function getRemainingBaitIds(completeTypes, bigFishTypes, completedFishIds) {
  const fishList = Object.values(DataUtil.FISH_DATA)
  const baitFishItems = DataUtil.generateBaitFishItems(
    fishList,
    completeTypes,
    bigFishTypes,
    completedFishIds
  )
  return Object.keys(_.groupBy(baitFishItems, 'bait')).map(key => +key)
}

function getRemainingBaitIdsWithUserData(userData) {
  return getRemainingBaitIds(
    userData?.bait?.notificationFilter?.completeTypes ?? ['UNCOMPLETED'],
    userData?.bait?.notificationFilter?.bigFishTypes ?? DataUtil.BIG_FISH_FILTER_TYPES,
    userData?.completed ?? []
  )
}

function initRemainingBaitIds() {
  const userData = LocalStorageUtil.loadUserData()
  return getRemainingBaitIdsWithUserData(userData)
}
