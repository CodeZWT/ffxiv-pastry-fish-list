import LocalStorageUtil from '@/utils/LocalStorageUtil'

const DEFAULT_FLAGS = {
  newPatchIntroductionFlag: false,
}

const ONE_TIME_FLAG_KEY = 'flag'
let storedConfig = LocalStorageUtil.get(ONE_TIME_FLAG_KEY)

const FlagModule = {
  namespaced: true,
  state: {
    flags: {
      ...DEFAULT_FLAGS,
      ...storedConfig?.flags,
    },
  },
  mutations: {
    setFlag(state, flagInfo) {
      const { value, key } = flagInfo
      state.flags[key] = value
    },
  },
}

const FlagPlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type.indexOf('flag/') === 0) {
      LocalStorageUtil.set(ONE_TIME_FLAG_KEY, state.flag)
    }
  })
}

export { FlagModule, FlagPlugin }
