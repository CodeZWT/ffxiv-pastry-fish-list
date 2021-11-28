const AlarmModule = {
  namespaced: true,
  state: {
    alarms: {},
  },
  mutations: {
    setAlarms(state, alarms) {
      state.alarms = alarms
    },
  },
}

export { AlarmModule }
