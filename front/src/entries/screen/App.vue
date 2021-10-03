<template>
  <v-app>
    <v-system-bar app>
      <div>{{ $t('top.navBarTitle', { title, version }) }}</div>
      <span class="ml-1"></span>
      <v-spacer />
      <div class="mr-1"><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
      <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
      <v-spacer></v-spacer>
      <v-btn @click="minimize" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-window-minimize</v-icon>
      </v-btn>
      <toggle-button
        :value="maximized"
        @input="maximizeOrRestore"
        checked-icon="mdi-window-restore"
        unchecked-icon="mdi-window-maximize"
        :checked-title="$t('actions.maximize.restore')"
        :unchecked-title="$t('actions.maximize.maximize')"
        small
        style="-webkit-app-region: none"
      />
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-main>
      <Screen />
    </v-main>
  </v-app>
</template>

<script>
import '@thewakingsands/axis-font-icons'
import { version } from '../../../package.json'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import EorzeaTime from '@/utils/Time'
import Screen from '@/entries/screen/views/Screen'
import ToggleButton from '@/components/basic/ToggleButton'
import WindowUtil from '@/entries/reader/util/WindowUtil'

export default {
  name: 'App',
  components: { Screen, ToggleButton },
  data: vm => ({
    now: Date.now(),
    version: version,
    title:
      vm.$t('top.systemBarTitle') +
      (DevelopmentModeUtil.isTest() ? vm.$t('top.testSuffix') : ''),
    maximized: false,
  }),
  computed: {
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return DataUtil.formatDateTime(this.now, 'HH:mm')
    },
  },
  mounted() {
    setInterval(() => {
      const now = Date.now()
      this.now = now
      // this.updateFishListTimePart(now)
      // this.checkNotification(now)
      // if (this.loading) {
      //   this.finishLoading()
      //   this.finishReloadPage()
      // }
    }, 1000)
  },
  methods: {
    minimize() {
      WindowUtil.minimizeWindow()
    },
    maximizeOrRestore(maximize) {
      if (maximize) {
        WindowUtil.maximizeWindow()
      } else {
        WindowUtil.unmaximizeWindow()
      }
      this.maximized = maximize
    },
    maximize() {
      WindowUtil.maximizeWindow()
    },
    unmaximize() {
      WindowUtil.unmaximizeWindow()
    },
    close() {
      if (this.mainWindowCloseMode === 'TRAY') {
        WindowUtil.hideWindow()
      } else {
        WindowUtil.closeWindow()
      }
    },
  },
}
</script>

<style lang="sass">
@import '../../../../assets/css/fish_icons.css'
@import '../../../../assets/css/keys.css'

@font-face
  font-family: 'FFXIV'
  src: url('../../../../assets/font/FFXIV_Lodestone_SSF.ttf') format('truetype')
  src: url('../../../../assets/font/FFXIV_Lodestone_SSF.woff') format('woff')
  unicode-range: U+E020-E0DB

.cafekit.ck-popup
  z-index: 9999 !important

/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar
  display: none


.v-application
  background-color: transparent !important

body
  overscroll-behavior: none

.v-system-bar
  -webkit-app-region: drag

*::-webkit-scrollbar
  width: 8px
  height: 8px


*::-webkit-scrollbar-track
  background: #ffffff00


*::-webkit-scrollbar-thumb
  background-color: #ffffff66
  border-radius: 10px
  border: 1px solid rgba(0, 0, 0, 0.4)
</style>
