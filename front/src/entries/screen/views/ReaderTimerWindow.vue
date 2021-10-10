<template>
  <screen-window
    :id="id"
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :z="item.z"
    :title="title"
  >
    <template v-slot:header>
      <v-system-bar :color="systemBarColor" class="rounded-t">
        <v-img :src="readerIcon" max-height="20" max-width="20" />
        <span class="mx-1">{{ title }}</span>
        <v-spacer />
        <div class="dr-drag-cancel">
          <div>
            <v-tooltip bottom color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <v-switch
                    v-if="isUploadMode && isRoseMode"
                    :input-value="isStrictMode"
                    color="secondary"
                    dense
                    @change="toggleStrictMode"
                  />
                </div>
              </template>
              <div>切换严格模式</div>
            </v-tooltip>
          </div>
          <v-btn @click="showSetting" x-small text>
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          <v-btn @click="handleCloseWindow" x-small text>
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </div>
      </v-system-bar>
    </template>

    <template>
      <reader-timer :now="now" />

      <v-dialog v-model="showSettingDialog" max-width="600" scrollable>
        <v-card>
          <v-card-title>渔捞设置</v-card-title>
          <v-card-text>
            <reader-setting :now="now" />
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
  </screen-window>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import READER_ICON from 'Assets/reader.png'
import ReaderSetting from '@/entries/reader/views/ReaderSetting'
import ReaderTimer from '@/entries/reader/views/ReaderTimer'
import SETTING_ICON from 'Assets/setting.png'
import ScreenWindow from '@/components/basic/screen/ScreenWindow'
import WindowMixin from '@/components/basic/screen/WindowMixin'

export default {
  name: 'ReaderTimerWindow',
  mixins: [WindowMixin],
  components: { ScreenWindow, ReaderSetting, ReaderTimer },
  props: {
    now: {
      type: Number,
      default: 0,
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    readerIcon: READER_ICON,
    settingIcon: SETTING_ICON,
    showSettingDialog: false,
  }),
  computed: {
    ...mapState(['sounds', 'readerTimerMiniMode']),
    ...mapGetters(['readerRegion', 'isStrictMode', 'isUploadMode', 'isRoseMode']),
    title() {
      return `渔捞 ${this.readerRegion === 'CN' ? '国服' : '国际服'}`
    },
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
    showSetting() {
      this.showSettingDialog = true
    },
  },
}
</script>

<style scoped lang="sass"></style>
