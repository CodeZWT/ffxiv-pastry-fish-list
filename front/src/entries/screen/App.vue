<template>
  <v-app>
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
import WindowUtil from '@/entries/reader/util/WindowUtil'

export default {
  name: 'App',
  components: { Screen },
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
@import '../../../../assets/css/keys.css'

@font-face
  font-family: 'FFXIV'
  src: url('../../../../assets/font/FFXIV_Lodestone_SSF.ttf') format('truetype')
  src: url('../../../../assets/font/FFXIV_Lodestone_SSF.woff') format('woff')
  unicode-range: U+E020-E0DB
  font-display: swap

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
