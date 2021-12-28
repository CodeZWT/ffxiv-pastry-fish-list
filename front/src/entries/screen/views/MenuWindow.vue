<template>
  <screen-window
    :id="id"
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :z="item.z"
    frameless
    title="菜单"
    :resizable="false"
  >
    <div style="height: 64px; width: 64px" class="d-flex align-center justify-center">
      <v-btn elevation="2" fab outlined @click="showWindowMenu = true">
        <v-img
          src="https://rcstatic.traveleorzea.com/pastry-fish-static-files/img/logo/pastry-fish.webp"
          width="38"
          height="38"
          contain
        ></v-img>
      </v-btn>
    </div>
  </screen-window>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { sendElectronEvent } from '@/utils/electronHelper'
import { version } from '../../../../package.json'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import ImgUtil from '@/utils/ImgUtil'
import ScreenWindow from '@/components/basic/screen/ScreenWindow'
import WindowMixin from '@/components/basic/screen/WindowMixin'

export default {
  name: 'MenuWindow',
  mixins: [WindowMixin],
  components: {
    ScreenWindow,
  },
  props: {
    dark: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    showGlobalSettingDialog: false,
    isElectron: DevelopmentModeUtil.isElectron(),
    downloadProgress: 0,
    showCheckStartSetupDialog: false,
    diademDark: ImgUtil.getImgUrl('diadem-dark-24x24.webp'),
    diademLight: ImgUtil.getImgUrl('diadem-light-24x24.webp'),
  }),
  computed: {
    ...mapState('dialog', ['menuDialog']),
    ...mapGetters(['isRoseMode']),
    ...mapGetters('screenWindow', ['isOpen']),
    version() {
      return version
    },
    showWindowMenu: {
      get() {
        return this.menuDialog
      },
      set(val) {
        this.setShowDialog({
          show: val,
          dialog: 'menuDialog',
        })
      },
    },
  },
  created() {
    window.electron?.ipcRenderer
      ?.on('setupDownload', (event, data) => {
        if (this.downloadProgress < 100) {
          this.downloadProgress = data.percent * 100
        }
      })
      ?.on('checkStartSetup', () => {
        this.downloadProgress = 100
        this.showUpdateDialog()
      })
      ?.on('toggleMenu', () => {
        this.showWindowMenu = !this.showWindowMenu
      })
      // ?.on('toggleMain', () => {
      //   if (this.isOpen('MAIN')) {
      //     this.closeWindow('MAIN')
      //   } else {
      //     this.showPrevMainWindow()
      //   }
      // })
      ?.on('toggleReaderTimer', () => {
        if (this.isOpen('READER_TIMER')) {
          this.closeWindow('READER_TIMER')
        } else {
          this.addReaderTimer()
        }
      })
      ?.on('toggleReaderTimerMini', () => {
        if (this.isOpen('READER_TIMER_MINI')) {
          this.closeWindow('READER_TIMER_MINI')
        } else {
          this.addReaderTimerMini()
        }
      })
      ?.on('toggleReaderHistory', () => {
        if (this.isOpen('READER_HISTORY')) {
          this.closeWindow('READER_HISTORY')
        } else {
          this.addReaderHistory()
        }
      })
      ?.on('toggleReaderSpotStatistics', () => {
        if (this.isOpen('READER_SPOT_STATISTICS')) {
          this.closeWindow('READER_SPOT_STATISTICS')
        } else {
          this.addReaderSpotStatistics()
        }
      })
  },
  methods: {
    ...mapMutations('dialog', ['setShowDialog']),
    ...mapActions('screenWindow', ['showPrevMainWindow']),
    ...mapMutations('screenWindow', ['showWindow']),
    ...mapMutations(['setShowImportExportDialog']),
    showExtraMainWindow() {
      sendElectronEvent('showMainWindow')
    },
    showAboutDialog() {
      this.$emit('show-about')
    },
    showUpdateDialog() {
      this.showCheckStartSetupDialog = true
    },
    startUpdate() {
      sendElectronEvent('startUpdate')
    },
    skipUpdate() {
      sendElectronEvent('skipUpdate')
      this.showCheckStartSetupDialog = false
    },
    showMainSetting() {
      this.$emit('show-setting')
    },
    addReaderTimer() {
      this.showWindow({
        type: 'READER_TIMER',
      })
    },
    addReaderTimerMini() {
      this.showWindow({
        type: 'READER_TIMER_MINI',
      })
    },
    addReaderHistory() {
      this.showWindow({
        type: 'READER_HISTORY',
      })
    },
    addReaderSpotStatistics() {
      this.showWindow({
        type: 'READER_SPOT_STATISTICS',
      })
    },
    addFishList() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'ListPage',
        tabIndex: 0,
      })
    },
    addNotificationList() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'ListPage',
        tabIndex: 1,
      })
    },
    addWiki() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'WikiPage',
      })
    },
    addOceanFishing() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'OceanFishingPage54',
      })
    },
    addDiadem() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'DiademPage',
      })
    },
    addAquarium() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'AquariumPage',
      })
    },
    addCompetition() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'CompetitionPage',
      })
    },
    addRecord() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'RecordPage',
      })
    },
    exit() {
      sendElectronEvent('quit')
    },
  },
}
</script>

<style scoped lang="sass"></style>
