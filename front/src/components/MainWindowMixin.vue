<script>
import ImgUtil from '@/utils/ImgUtil'
import { mapMutations } from 'vuex'
import FIX from 'Data/fix'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'

export default {
  name: 'MainWindowMixin',
  data() {
    return {
      fisher: ImgUtil.getImgUrl('pastry-fish-surprise.png'),
      THEME_SETTING_MODES: DataUtil.THEME_SETTING_MODES,
      THEME_MODE_ICONS: ['mdi-weather-night', 'mdi-weather-sunny', 'mdi-brightness-auto'],
      isElectron: DevelopmentModeUtil.isElectron(),
      showMapMenu: false,
    }
  },
  computed: {
    showHatCover: {
      get() {
        return this.startLight
      },
      set(startLight) {
        this.setStartLight(startLight)
        // this.showJumpingOverlay = true
        this.$emit('startReloadPage')
      },
    },
    inStartLight() {
      return (
        this.now >= FIX.STARLIGHT_CELEBRATION.startTime &&
        this.now <= FIX.STARLIGHT_CELEBRATION.endTime
      )
    },
    themeModeIndex() {
      return DataUtil.THEME_SETTING_MODES.indexOf(this.themeMode)
    },
  },
  methods: {
    ...mapMutations([
      'disableStrictMode',
      'reloadReaderUserData',
      'setOpacity',
      'setZoomFactor',
      'setFeatureViewed',
      'updateUserData',
      'setFishCompleted',
      'toggleFilterPanel',
      'setShowSearchDialog',
      'setShowImportExportDialog',
      'setWebsiteVersion',
      'setActiveTab',
      'showSnackbar',
      'setSounds',
      'setThemeMode',
      'startLoading',
      'finishLoading',
      'setStartLight',
      'initialUserData',
      'setShowCompetitionDialog',
    ]),
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
    startReloadPage() {
      this.sendElectronEvent('startLoading')
      window.location.reload()
    },
    toggleFishEyesUsed() {
      this.showSnackbar({
        text: '设置成功，即将重新加载页面，请稍后...',
        color: 'success',
      })
      this.updateUserData({ path: 'fishEyesUsed', data: !this.fishEyesUsed })
      setTimeout(() => {
        this.startReloadPage()
      }, 2000)
    },
    selectThemeMode(index) {
      this.setThemeMode(DataUtil.THEME_SETTING_MODES[index])
    },
  },
}
</script>

<style scoped></style>
