const LocalSettingModule = {
  namespaced: true,
  state: {
    settings: {
      showSiteRegionDialog: true,
      hardwareAcceleration: true,
    },
  },
  getters: {
    getSetting: state => key => {
      return state.settings[key]
    },
  },
  mutations: {
    setSetting(state, settingPart) {
      const { key, value } = settingPart
      state.settings = {
        ...state.settings,
        [key]: value,
      }
    },
  },
}

export { LocalSettingModule }
