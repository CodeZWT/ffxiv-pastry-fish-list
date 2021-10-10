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
    layouts: storedConfig?.layouts ?? DEFAULT_LAYOUTS,
    windows: storedConfig?.windows ?? [],
    dragging: false,
    subPage: 'ListPage',
    tabIndex: 0,
  },
  getters: {
    getWindowLayout(state, windowId) {
      return state.layouts.find(l => l.id === windowId)
    },
  },
  mutations: {
    showWindow(state, windowInfo) {
      let windowId = windowInfo.type
      // if (windowInfo.type === 'MAIN') {
      //   windowId += '-' + windowInfo.subPage
      //   if (windowInfo.mainPageTabIndex != null) {
      //     windowId += '-' + windowInfo.mainPageTabIndex
      //   }
      // }
      state.subPage = windowInfo.subPage ?? state.subPage
      state.tabIndex = windowInfo.tabIndex ?? state.tabIndex

      const layoutId = windowInfo.type

      if (state.windows.includes(windowId)) {
        setWindowActive(state.windows, state.layouts, windowId)
        // state.windows.splice(windowIndex, 1, windowId)
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
  },
}

const SaveLayoutPlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type.indexOf('screenWindow/') === 0) {
      LocalStorageUtil.storeWindowLayouts({
        layouts: state.screenWindow.layouts,
        windows: state.screenWindow.windows,
      })
    }
  })
}

export { ScreenWindowModule, SaveLayoutPlugin, winId2LayoutId }
