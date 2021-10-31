import { sendElectronEvent } from '@/utils/electronHelper'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import Vue from 'vue'
import _ from 'lodash'

const DEFAULT_LAYOUTS = {
  MAIN: {
    x: 100,
    y: 100,
    w: 960,
    h: 600,
    z: 0,
    type: 'MAIN',
    isMobile: false,
    opacity: 1,
  },
  FISH_DETAIL: {
    x: 100,
    y: 100,
    w: 400,
    h: 600,
    z: 0,
    type: 'FISH_DETAIL',
    isMobile: true,
    opacity: 1,
  },
  READER_TIMER: {
    x: 100,
    y: 100,
    w: 450,
    h: 150,
    z: 0,
    type: 'READER_TIMER',
    isMobile: true,
    opacity: 1,
  },
  READER_TIMER_MINI: {
    x: 100,
    y: 100,
    w: 425,
    h: 85,
    z: 0,
    type: 'READER_TIMER_MINI',
    isMobile: true,
    opacity: 1,
  },
  READER_HISTORY: {
    x: 100,
    y: 100,
    w: 420,
    h: 645,
    z: 0,
    type: 'READER_HISTORY',
    isMobile: true,
    opacity: 1,
  },
  READER_SPOT_STATISTICS: {
    x: 100,
    y: 100,
    w: 500,
    h: 450,
    z: 0,
    type: 'READER_SPOT_STATISTICS',
    isMobile: true,
    opacity: 1,
  },
  MENU: {
    x: 100,
    y: 100,
    w: 64,
    h: 64,
    z: 100,
    type: 'MENU',
    isMobile: true,
    opacity: 1,
  },
}
const storedConfig = LocalStorageUtil.loadWindowLayouts()
const fixMainWindowConfig = () => {
  // remove MAIN window since main window in screen is not used
  // to fix the bug that empty main window is created by the hotkey
  storedConfig.windows = storedConfig.windows.filter(winId => winId !== 'MAIN')
}
fixMainWindowConfig()
const winId2LayoutId = winId => winId.split('-')[0]

const SaveLayoutPlugin = store => {
  let prevState = _.cloneDeep({
    windows: store.state.screenWindow.windows,
    layouts: store.state.screenWindow.layouts,
    dialogs: store.state.screenWindow.dialogs,
    alerts: store.state.screenWindow.alerts,
    menus: store.state.screenWindow.menus,
    bottomNotifications: store.state.screenWindow.bottomNotifications,
  })
  store.subscribe((mutation, state) => {
    if (mutation.type.indexOf('screenWindow/') === 0) {
      let nextState = _.cloneDeep({
        windows: state.screenWindow.windows,
        layouts: state.screenWindow.layouts,
        dialogs: state.screenWindow.dialogs,
        alerts: state.screenWindow.alerts,
        menus: state.screenWindow.menus,
        bottomNotifications: state.screenWindow.bottomNotifications,
      })
      if (!_.isEqual(prevState, nextState)) {
        sendElectronEvent('updateWindowSetting', nextState)
      }
      prevState = nextState

      LocalStorageUtil.storeWindowLayouts({
        layouts: state.screenWindow.layouts,
        windows: state.screenWindow.windows,
        hiddenReaderWindows: state.screenWindow.hiddenReaderWindows,
        subPage: state.screenWindow.subPage,
        tabIndex: state.screenWindow.tabIndex,
        menuInitialized: state.screenWindow.menuInitialized,
      })
    }
  })
}

const setWindowActive = (windows, layouts, windowId) => {
  const wins = _.sortBy(windows, winId => {
    if (winId === windowId) {
      return windows.length
    } else {
      return layouts[winId2LayoutId(winId)].z
    }
  })
  wins.forEach((winId, index) => {
    layouts[winId2LayoutId(winId)].z = winId === 'MENU' ? 100 : index
  })
}

const ScreenWindowModule = {
  namespaced: true,
  state: {
    layouts: _.cloneDeep({ ...DEFAULT_LAYOUTS, ...storedConfig?.layouts }),
    windows: storedConfig?.windows ?? [],
    hiddenReaderWindows: storedConfig?.hiddenReaderWindows ?? [],
    dialogs: [],
    alerts: [],
    menus: [],
    bottomNotifications: [],
    dragging: false,
    subPage: storedConfig?.subPage ?? 'ListPage',
    tabIndex: storedConfig?.tabIndex ?? 0,
    globalClickThrough: false,
    menuInitialized: storedConfig?.menuInitialized ?? false,
  },
  getters: {
    isOpen: state => windowId => {
      return state.windows.indexOf(windowId) > -1
    },
  },
  mutations: {
    setHiddenReaderWindows(state, windowsIds) {
      state.hiddenReaderWindows = windowsIds
    },
    registerDialog(state, dialogId) {
      state.dialogs.push(dialogId)
    },
    unRegisterDialog(state, dialogId) {
      const index = state.dialogs.indexOf(dialogId)
      if (index > -1) {
        state.dialogs.splice(index, 1)
      }
    },
    registerAlert(state, id) {
      state.alerts.push(id)
    },
    unregisterAlert(state, id) {
      const index = state.alerts.indexOf(id)
      if (index > -1) {
        state.alerts.splice(index, 1)
      }
    },
    registerMenu(state, menu) {
      state.menus.push(menu)
    },
    unregisterMenu(state, id) {
      const index = state.menus.map(m => m.id).indexOf(id)
      if (index > -1) {
        state.menus.splice(index, 1)
      }
    },
    registerBottomNotification(state, id) {
      state.bottomNotifications.push(id)
    },
    unregisterBottomNotification(state, id) {
      const index = state.bottomNotifications.indexOf(id)
      if (index > -1) {
        state.bottomNotifications.splice(index, 1)
      }
    },
    setGlobalClickThrough(state, clickThrough) {
      state.globalClickThrough = clickThrough
    },
    showWindow(state, windowInfo) {
      let windowId = windowInfo.type
      state.subPage = windowInfo.subPage ?? state.subPage
      state.tabIndex = windowInfo.tabIndex ?? state.tabIndex

      const layoutId = windowInfo.type

      if (state.windows.includes(windowId)) {
        setWindowActive(state.windows, state.layouts, windowId)
      } else {
        state.layouts[layoutId].z = state.windows.length
        state.windows.push(windowId)
      }
    },
    activeWindow(state, activeWindowId) {
      if (state.windows.includes(activeWindowId)) {
        setWindowActive(state.windows, state.layouts, activeWindowId)
      }
    },
    closeWindow(state, windowId) {
      const index = state.windows.indexOf(windowId)
      if (index > -1) {
        state.layouts[winId2LayoutId(windowId)].z = 0
        state.windows.splice(index, 1)
        const wins = _.sortBy(state.windows, winId => {
          return state.layouts[winId2LayoutId(winId)].z
        })
        wins.forEach((winId, index) => {
          state.layouts[winId2LayoutId(winId)].z = winId === 'MENU' ? 100 : index
        })
      }
    },
    updateWindowLayout(state, layout) {
      const newLayout = {
        ...state.layouts[layout.id],
        ...layout,
      }
      Vue.set(state.layouts, newLayout.id, newLayout)
    },
    startDragging(state) {
      state.dragging = true
    },
    stopDragging(state) {
      state.dragging = false
    },
    resetLayouts(state) {
      state.layouts = _.cloneDeep(DEFAULT_LAYOUTS)
      state.menuInitialized = false
    },
    setWindowOpacity(state, data) {
      Vue.set(state.layouts, data.winId, {
        ...state.layouts[data.winId],
        opacity: data.opacity,
      })
    },
  },
  actions: {
    showPrevMainWindow({ commit, state }) {
      commit('showWindow', {
        type: 'MAIN',
        subPage: state.subPage,
        tabIndex: state.tabIndex,
      })
    },
  },
}

export { ScreenWindowModule, winId2LayoutId, SaveLayoutPlugin }
