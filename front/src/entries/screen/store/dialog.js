import { sendElectronEvent } from '@/utils/electronHelper'
import _ from 'lodash'

const DialogPluginOf = source => store => {
  let prevState = _.cloneDeep({
    menuDialog: store.state.dialog.menuDialog,
  })
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep({
      menuDialog: state.dialog.menuDialog,
    })

    if (!_.isEqual(prevState, nextState)) {
      sendElectronEvent('broadcast', {
        source: source,
        type: 'dialog',
        data: nextState,
      })
    }
    prevState = nextState
  })
}

const DialogModule = {
  namespaced: true,
  state: {
    menuDialog: false,
    patchNoteDialog: false,
    readerSettingDialog: false,
    screenSettingDialog: false,
    newPatchIntroductionDialog: false,
  },
  mutations: {
    setShowDialog(state, showDialogInfo) {
      const { show, dialog } = showDialogInfo
      state[dialog] = show
    },
  },
}

export { DialogModule, DialogPluginOf }
