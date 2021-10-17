import { sendElectronEvent } from '@/utils/electronHelper'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import Vue from 'vue'
import _ from 'lodash'

const DEFAULT_LAYOUTS = {
  MAIN: {
    x: 0,
    y: 0,
    w: 600,
    h: 600,
    z: 0,
    type: 'MAIN',
    isMobile: true,
  },
  FISH_DETAIL: {
    x: 0,
    y: 0,
    w: 400,
    h: 600,
    z: 0,
    type: 'FISH_DETAIL',
    isMobile: true,
  },
  READER_TIMER: {
    x: 0,
    y: 0,
    w: 450,
    h: 150,
    z: 0,
    type: 'READER_TIMER',
    isMobile: true,
  },
  READER_TIMER_MINI: {
    x: 0,
    y: 0,
    w: 425,
    h: 85,
    z: 0,
    type: 'READER_TIMER_MINI',
    isMobile: true,
  },
  READER_HISTORY: {
    x: 0,
    y: 0,
    w: 420,
    h: 645,
    z: 0,
    type: 'READER_HISTORY',
    isMobile: true,
  },
  READER_SPOT_STATISTICS: {
    x: 0,
    y: 0,
    w: 500,
    h: 450,
    z: 0,
    type: 'READER_SPOT_STATISTICS',
    isMobile: true,
  },
  MENU: {
    x: 0,
    y: 0,
    w: 64,
    h: 64,
    z: 0,
    type: 'MENU',
    isMobile: true,
  },
}
const storedConfig = LocalStorageUtil.loadWindowLayouts()
const winId2LayoutId = winId => winId.split('-')[0]

const setWindowActive = (windows, layouts, windowId) => {
  const wins = _.sortBy(windows, winId => {
    if (winId === windowId) {
      return windows.length
    } else {
      return layouts[winId2LayoutId(winId)].z
    }
  })
  wins.forEach((winId, index) => {
    layouts[winId2LayoutId(winId)].z = index
  })
}

const ScreenWindowModule = {
  namespaced: true,
  state: {
    layouts: { ...DEFAULT_LAYOUTS, ...storedConfig?.layouts },
    windows: storedConfig?.windows ?? [],
    dialogs: [],
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
    registerDialog(state, dialogId) {
      state.dialogs.push(dialogId)
    },
    unRegisterDialog(state, dialogId) {
      const index = state.dialogs.indexOf(dialogId)
      if (index > -1) {
        state.dialogs.splice(index, 1)
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
      setWindowActive(state.windows, state.layouts, activeWindowId)
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
          state.layouts[winId2LayoutId(winId)].z = index
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
    setMenuWindowToScreenCenter(state, workAreaSize) {
      if (!state.menuInitialized) {
        Vue.set(state.layouts, 'MENU', {
          ...DEFAULT_LAYOUTS.MENU,
          x: Math.floor(workAreaSize.width / 2 - DEFAULT_LAYOUTS.MENU.w / 2),
          y: Math.floor(workAreaSize.height / 2 - DEFAULT_LAYOUTS.MENU.h / 2),
        })
        state.menuInitialized = true
      }
    },
  },
}

const SaveLayoutPlugin = store => {
  let prevState = _.cloneDeep({
    windows: store.state.screenWindow.windows,
    layouts: store.state.screenWindow.layouts,
    dialogs: store.state.screenWindow.dialogs,
  })
  store.subscribe((mutation, state) => {
    if (mutation.type.indexOf('screenWindow/') === 0) {
      let nextState = _.cloneDeep({
        windows: store.state.screenWindow.windows,
        layouts: store.state.screenWindow.layouts,
        dialogs: store.state.screenWindow.dialogs,
      })
      if (!_.isEqual(prevState, nextState)) {
        sendElectronEvent('updateWindowSetting', {
          windows: nextState.windows,
          layouts: nextState.layouts,
          dialogs: nextState.dialogs,
        })
      }
      prevState = nextState

      LocalStorageUtil.storeWindowLayouts({
        layouts: state.screenWindow.layouts,
        windows: state.screenWindow.windows,
        subPage: state.screenWindow.subPage,
        tabIndex: state.screenWindow.tabIndex,
        menuInitialized: state.screenWindow.menuInitialized,
      })
    }
  })
}

export { ScreenWindowModule, SaveLayoutPlugin, winId2LayoutId }
