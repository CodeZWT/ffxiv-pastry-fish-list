<template>
  <div class="window">
    <v-system-bar
      :color="
        isRoseMode && isUploadMode && isStrictMode ? 'deep-purple darken-1' : 'black'
      "
      class="window-top-bar rounded-t"
    >
      <v-img :src="readerIcon" max-height="20" max-width="20" />
      <span class="mx-1">渔捞</span>
      <span v-if="readerRegion === 'CN'">国服{{ CN_PATCH_VERSION }}</span>
      <span v-else>国际服{{ GLOBAL_PATCH_VERSION }}</span>
      <v-spacer />
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
      <v-btn @click="close" x-small text>
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-system-bar>
    <div class="window-content">
      <reader-timer :now="now" />
    </div>
  </div>
</template>

<script>
import ReaderTimer from '@/entries/reader/views/ReaderTimer'
import { mapGetters, mapState } from 'vuex'
import { CN_PATCH_VERSION, GLOBAL_PATCH_VERSION } from 'Data/constants'
import READER_ICON from 'Assets/reader.png'
import SETTING_ICON from 'Assets/setting.png'

export default {
  name: 'ReaderTimerWindow',
  components: { ReaderTimer },
  props: {
    now: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    readerIcon: READER_ICON,
    settingIcon: SETTING_ICON,
    CN_PATCH_VERSION: CN_PATCH_VERSION,
    GLOBAL_PATCH_VERSION: GLOBAL_PATCH_VERSION,
  }),
  computed: {
    ...mapState(['sounds', 'readerTimerMiniMode']),
    ...mapGetters(['readerRegion', 'isStrictMode', 'isUploadMode', 'isRoseMode']),
  },
  methods: {
    toggleStrictMode() {
      const newStrictMode = !this.isStrictMode
      this.setStrictMode(newStrictMode)
      this.sendElectronEvent('setStrictMode', newStrictMode)
    },
    close() {
      this.$emit('close')
    },
    showSetting() {
      // TODO show setting dialog directly
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