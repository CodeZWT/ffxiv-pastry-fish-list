<template>
  <screen-window
    :id="id"
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :z="item.z"
    frameless
    title="渔捞迷你模式"
  >
    <template>
      <div class="d-flex align-start">
        <reader-timer :now="now" :mini="true" />
        <v-btn
          @click.stop="handleCloseWindow"
          x-small
          icon
          text
          class="my-3 mx-1"
          color="error"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </template>
  </screen-window>
</template>

<script>
import { CN_PATCH_VERSION, GLOBAL_PATCH_VERSION } from 'Data/constants'
import { mapGetters, mapMutations, mapState } from 'vuex'
import READER_ICON from 'Assets/reader.png'
import ReaderTimer from '@/entries/reader/views/ReaderTimer'
import ReaderTimerMixin from '@/entries/screen/views/ReaderTimerMixin'
import SETTING_ICON from 'Assets/setting.png'
import ScreenWindow from '@/components/basic/screen/ScreenWindow'
import WindowMixin from '@/components/basic/screen/WindowMixin'

export default {
  name: 'ReaderTimerMiniWindow',
  mixins: [WindowMixin, ReaderTimerMixin],
  components: { ScreenWindow, ReaderTimer },
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

<style scoped lang="sass"></style>
