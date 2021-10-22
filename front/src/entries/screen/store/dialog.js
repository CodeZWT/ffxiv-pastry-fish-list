const DialogModule = {
  namespaced: true,
  state: {
    patchNoteDialog: false,
    readerSettingDialog: false,
  },
  mutations: {
    setShowDialog(state, showDialogInfo) {
      const { show, dialog } = showDialogInfo
      state[dialog] = show
    },
  },
}

export { DialogModule }
