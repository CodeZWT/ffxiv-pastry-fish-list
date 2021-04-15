import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import DATA from 'Data/data'
import DATA_CN from 'Data/translation'
import DataUtil from '@/utils/DataUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import { loadBaitFilterUserData, loadUserData } from '@/utils/UserDataLoader'
import CONSTANTS from 'Data/constants'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fish: DataUtil.FISH_DATA,
    fishingSpots: DataUtil.FISHING_SPOTS,
    spearFishingSports: DATA.SPEARFISHING_SPOTS,
    items: DataUtil.ITEMS,
    achievements: DATA_CN.OCEAN_FISHING_ACHIEVEMENTS,
    weatherRates: DATA.WEATHER_RATES,
    weatherTypes: DATA_CN.WEATHER_TYPES,
    zones: DATA_CN.ZONES,
    bigFish: DATA_CN.BIG_FISH,
    newPatchFish: DATA_CN.NEW_PATCH_FISH,
    folklore: DATA_CN.FOLKLORE,
    showSearchDialog: false,
    showImportExportDialog: false,
    snackbar: {
      show: false,
      text: '',
      color: '',
    },
    activeTabIndex: DataUtil.TAB_INDEX_NORMAL,
    aetheryte: _.groupBy(DATA_CN.AETHERYTE, 'mapFileId'),
    sounds: {},
    showFishPageRightPane: false,
    loading: false,
    userData: loadUserData(),
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
    mainWindowCloseMode: state => {
      return state.userData.mainWindow.closeMode
    },
    // baitFilter: state => {
    //   return state.baitFilter
    // },
    readerRegion: state => {
      return state.userData.reader.region
    },
    listSetting: state => {
      return DataUtil.getUserDataPart(state)('listSetting')
    },
    fishEyesUsed: state => {
      return DataUtil.getUserDataPart(state)('fishEyesUsed')
    },
    readerSetting: state => {
      return DataUtil.getUserDataPart(state)('reader')
    },
    showChromeBugDialog: state => {
      return state.userData.showChromeBugDialog
    },
    defaultLinkOf: state => mode => {
      return state.userData.link.default[mode]
    },
    getItemIconUrl: state => id => {
      const iconId = state.items[DataUtil.toItemId(id)]?.icon ?? 1100
      // const localImg = require(`../assert/${iconId}.png`)
      // if (localImg) {
      //   return localImg
      // } else {
      return DataUtil.iconIdToUrl(iconId)
      // }
    },
    getItemIconClass: () => id => {
      return DataUtil.getItemIconClass(id)
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
        return DataUtil.getName(
          state.zones[state.weatherRates[fishingSpot.territory_id]?.zone_id]
        )
      } else {
        return ''
      }
    },
    getFishingSpotsName: state => id => {
      if (id != null) {
        return state.fishingSpots[id] && DataUtil.getName(state.fishingSpots[id])
      } else {
        return ''
      }
    },
    getFishingSpots: (_, getters) => locations =>
      locations.map(location => {
        const fishingSpot = getters.getFishingSpot(location)
        return {
          zone: getters.getZoneName(location),
          fishingSpot: fishingSpot,
          fishingSpotName: getters.getFishingSpotsName(location),
          fishingSpotId: location,
          fishSpotPositionText: DataUtil.toPositionText(fishingSpot),
        }
      }),
    getBaits: (state, getters) => (fish, customizedBestCatchPath, customizeFishDict) => {
      const bestCatchPath = customizedBestCatchPath ?? fish.bestCatchPath
      if (bestCatchPath == null || bestCatchPath.length < 1) return []
      const baitId = bestCatchPath[bestCatchPath.length - 1]
      const hookset = DataUtil.tugToHookset(fish.tug, fish.hookset)
      const optionalIndices = fish.optional ?? []
      const lastBait = {
        tug: fish.tug,
        tugIcon: DataUtil.TUG_ICON[fish.tug],
        hookset: hookset,
        hooksetIcon: DataUtil.iconIdToClass(DataUtil.HOOKSET_ICON[hookset]),
        hooksetSkillName: DataUtil.HOOKSET_SKILL_NAME_DICT[fish.hookset],
        baitId: baitId,
        baitName: getters.getItemName(baitId),
        baitIcon: getters.getItemIconClass(baitId),
      }
      if (bestCatchPath.length === 1) {
        return [lastBait]
      } else {
        return bestCatchPath.map((baitId, index, arr) => {
          if (index === arr.length - 1) {
            return lastBait
          } else {
            const fishDict = customizeFishDict ?? state.fish
            const baitFish = fishDict[arr[index + 1]]
            const hookset = DataUtil.tugToHookset(baitFish.tug, baitFish.hookset)
            return {
              tug: baitFish.tug,
              tugIcon: DataUtil.TUG_ICON[baitFish.tug],
              hookset: hookset,
              hooksetIcon: DataUtil.iconIdToClass(DataUtil.HOOKSET_ICON[hookset]),
              baitId: baitId,
              baitName: getters.getItemName(baitId),
              baitIcon: getters.getItemIconClass(baitId),
              optional: optionalIndices.includes(index),
            }
          }
        })
      }
    },
    getZoneId: state => id => {
      const fishingSpot = state.fishingSpots[id]
      if (fishingSpot) {
        return this.weatherRates[fishingSpot.territory_id].zone_id
      }
    },
    getWeather: state => weatherSet => {
      return weatherSet.map(id => {
        return {
          name: DataUtil.getName(state.weatherTypes[id]),
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
    filters: state => {
      return state.userData.filters
    },
    pinnedFishIds: state => {
      return state.userData.pinned
    },
    showFilter: state => {
      return state.userData.showFilter
    },
    showBanner: state => {
      return state.userData.showBanner
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
    rightPanePercentage: state => {
      return state.userData.rightPanePercentage
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
    startLight: state => {
      return state.userData.event.startLight
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
      //   LocalStorageUtil.loadAndBackupUserData()
      // )
      LocalStorageUtil.storeAndBackupUserData(state.userData)
    },
    setUserData(state, data) {
      state.userData = DataUtil.migrateOldVersionUserData({
        ..._.cloneDeep(DataUtil.USER_DEFAULT_DATA),
        ...data,
      })
      LocalStorageUtil.storeAndBackupUserData(state.userData)
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
        state.userData = updateUserDataStateRecords(
          state.userData,
          'toBeNotified',
          simpleFishIds,
          false
        )
      }
    },
    setFishCompleted(state, { fishId, completed }) {
      state.userData = updateUserDataStateRecords(
        state.userData,
        'completed',
        [DataUtil.toItemId(fishId)],
        completed
      )
      const newRemainingBaitIds = getRemainingBaitIdsWithUserData(state.userData)
      const removed = _.difference(state.remainingBaitIds, newRemainingBaitIds)
      if (removed.length > 0 && state.userData.bait.enableNotification) {
        state.baitIdsForNotification = removed
      }
      state.remainingBaitIds = newRemainingBaitIds
      if (completed) {
        state.userData = updateUserDataStateRecords(
          state.userData,
          'toBeNotified',
          [DataUtil.toItemId(fishId)],
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
      state.userData = updateUserDataStateRecords(
        state.userData,
        'toBeNotified',
        [DataUtil.toItemId(fishId)],
        toBeNotified
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
    showSnackbar(state, { text, color }) {
      state.snackbar = {
        show: true,
        text,
        color,
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
    setRightPanePercentage(state, rightPanePercentage) {
      state.userData = { ...state.userData, rightPanePercentage }
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
      console.log('update sounds', sounds)
      state.sounds = sounds
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
    setStartLight(state, startLight) {
      state.userData = {
        ...state.userData,
        event: { ...state.userData.event, startLight },
      }
      LocalStorageUtil.storeUserData(state.userData)
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
  modules: {},
})

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
  const userData = LocalStorageUtil.loadAndBackupUserData()
  return getRemainingBaitIdsWithUserData(userData)
}
