<script>
import { mapMutations } from 'vuex'
import { mdiBrightnessAuto, mdiWeatherNight, mdiWeatherSunny } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import ImgUtil from '@/utils/ImgUtil'

export default {
  name: 'MainWindowMixin',
  data() {
    return {
      fisher: ImgUtil.getImgUrl('pastry-fish-heavensturn.webp', ImgUtil.CATEGORY.LOGO),
      THEME_SETTING_MODES: DataUtil.THEME_SETTING_MODES,
      THEME_MODE_ICONS: [mdiWeatherNight, mdiWeatherSunny, mdiBrightnessAuto],
      isElectron: DevelopmentModeUtil.isElectron(),
      showMapMenu: false,
    }
  },
  computed: {
    showHatCover() {
      return true
    },
    themeModeIndex() {
      return DataUtil.THEME_SETTING_MODES.indexOf(this.themeMode)
    },
    theme: {
      get() {
        return this.themeMode
      },
      set(theme) {
        this.setThemeMode(theme)
      },
    },
  },
  methods: {
    ...mapMutations([
      'disableStrictMode',
      'setOpacity',
      'setZoomFactor',
      'setFeatureViewed',
      'updateUserData',
      'setFishCompleted',
      'toggleFilterPanel',
      'setShowSearchDialog',
      'setWebsiteVersion',
      'setActiveTab',
      'showSnackbar',
      'setSounds',
      'setThemeMode',
      'startLoading',
      'finishLoading',
      'initialUserData',
      'setShowCompetitionDialog',
    ]),
    startReloadPage() {
      this.sendElectronEvent('startLoading')
      window.location.reload()
    },
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
    toggleFishEyesUsed() {
      this.showSnackbar({
        text: '设置成功，即将重新加载页面，请稍后...',
        color: 'success',
      })
      this.updateUserData({ path: 'fishEyesUsed', data: !this.fishEyesUsed })
      setTimeout(() => {
        this.startReloadPage()
      }, 1000)
    },
  },
}
</script>

<style scoped></style>
