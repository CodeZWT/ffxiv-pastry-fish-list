import LocalStorageUtil from '@/utils/LocalStorageUtil'

const ScreenWindowModule = {
  namespaced: true,
  state: {
    layouts: [],
    dragging: false,
  },
  getters: {
    getWindowLayout(state, windowId) {
      return state.layouts.find(l => l.id === windowId)
    },
  },
  mutations: {
    updateWindowLayout(state, layout) {
      const index = state.layouts.findIndex(l => l.id === layout.id)
      if (index > -1) {
        state.layouts.splice(index, 1, {
          ...state.layouts[index],
          ...layout,
        })
      } else {
        state.layouts.push(layout)
      }
    },
    removeWindowLayout(state, windowId) {
      const index = state.layouts.findIndex(l => l.id === windowId)
      state.layouts.splice(index, 1)
    },
    startDragging(state) {
      state.dragging = true
    },
    stopDragging(state) {
      state.dragging = false
    },
    loadLayouts(state) {
      const config = LocalStorageUtil.loadWindowLayouts()
      state.layouts = config.layouts
    },
  },
}

const SaveLayoutPlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type.indexOf('screenWindow/') === 0) {
      LocalStorageUtil.storeWindowLayouts({
        layouts: state.screenWindow.layouts,
      })
    }
  })
}

export { ScreenWindowModule, SaveLayoutPlugin }
