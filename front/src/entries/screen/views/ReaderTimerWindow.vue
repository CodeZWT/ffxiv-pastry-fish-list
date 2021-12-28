<template>
  <screen-window
    :id="id"
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :z="item.z"
    :title="title"
    :opacity="item.opacity"
  >
    <template v-slot:header>
      <v-system-bar
        :color="systemBarColor"
        class="rounded-t"
        style="-webkit-app-region: none"
      >
        <v-img :src="readerIcon" max-height="20" max-width="20" />
        <span class="mx-1">{{ title }}</span>
        <v-spacer />
        <div class="mr-1"><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
        <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>

        <v-spacer />
        <div class="dr-drag-cancel d-flex align-center">
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
            <v-icon>{{ mdiCog }}</v-icon>
          </v-btn>
          <v-btn @click.stop="handleCloseWindow" x-small text>
            <v-icon>{{ mdiWindowClose }}</v-icon>
          </v-btn>
        </div>
      </v-system-bar>
    </template>

    <template>
      <reader-timer />
    </template>
  </screen-window>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import { mdiCog, mdiWindowClose } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import EorzeaTime from '@/utils/Time'
import READER_ICON from 'Assets/reader.png'
import ReaderTimer from '@/entries/reader/views/ReaderTimer'
import ReaderTimerMixin from '@/entries/screen/views/ReaderTimerMixin'
import SETTING_ICON from 'Assets/setting.png'
import ScreenWindow from '@/components/basic/screen/ScreenWindow'
import WindowMixin from '@/components/basic/screen/WindowMixin'

export default {
  name: 'ReaderTimerWindow',
  mixins: [WindowMixin, ReaderTimerMixin],
  components: { ScreenWindow, ReaderTimer },
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mdiCog,
    mdiWindowClose,
    readerIcon: READER_ICON,
    settingIcon: SETTING_ICON,
  }),
  computed: {
    ...mapState(['now']),
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
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return DataUtil.formatDateTime(this.now, 'HH:mm')
    },
  },
  methods: {
    ...mapMutations('dialog', ['setShowDialog']),
    ...mapMutations(['setStrictMode']),
    toggleStrictMode() {
      const newStrictMode = !this.isStrictMode
      this.setStrictMode(newStrictMode)
    },
    showSetting() {
      this.setShowDialog({ dialog: 'readerSettingDialog', show: true })
    },
  },
}
</script>

<style scoped lang="sass"></style>
