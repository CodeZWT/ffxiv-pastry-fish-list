<template>
  <div class="window vue-draggable-handle">
    <div class="window-content">
      <reader-timer :now="now" :mini="true" />
    </div>
  </div>
</template>

<script>
import { CN_PATCH_VERSION, GLOBAL_PATCH_VERSION } from 'Data/constants'
import { mapGetters, mapMutations, mapState } from 'vuex'
import READER_ICON from 'Assets/reader.png'
import ReaderTimer from '@/entries/reader/views/ReaderTimer'
import SETTING_ICON from 'Assets/setting.png'

export default {
  name: 'ReaderTimerMiniWindow',
  components: { ReaderTimer },
  props: {
    now: {
      type: Number,
      default: 0,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    mini: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    readerIcon: READER_ICON,
    settingIcon: SETTING_ICON,
    CN_PATCH_VERSION: CN_PATCH_VERSION,
    GLOBAL_PATCH_VERSION: GLOBAL_PATCH_VERSION,
    showSettingDialog: false,
  }),
  computed: {
    ...mapState(['sounds', 'readerTimerMiniMode']),
    ...mapGetters(['readerRegion', 'isStrictMode', 'isUploadMode', 'isRoseMode']),
    systemBarColor() {
      return this.isRoseMode && this.isUploadMode && this.isStrictMode
        ? 'deep-purple darken-1'
        : this.dark
        ? 'dark'
        : 'light'
    },
  },
  methods: {
    ...mapMutations(['setStrictMode']),
    toggleStrictMode() {
      const newStrictMode = !this.isStrictMode
      this.setStrictMode(newStrictMode)
    },
    close() {
      this.$emit('close')
    },
    showSetting() {
      this.showSettingDialog = true
    },
  },
}
</script>

<style scoped lang="sass">
@import "~@/styles/RcVariables"

.window
  height: 100%

.window-content
  height: calc(100% - #{ $top-system-bar-padding })
  overflow-y: scroll

.window-top-bar
  -webkit-app-region: none
</style>
