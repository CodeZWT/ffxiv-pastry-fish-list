<script>
import { mapMutations } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import FIX from 'Data/fix'
import ImgUtil from '@/utils/ImgUtil'

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
      'setStartLight',
      'initialUserData',
      'setShowCompetitionDialog',
    ]),
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
    toggleFishEyesUsed() {
      this.updateUserData({ path: 'fishEyesUsed', data: !this.fishEyesUsed })
    },
    selectThemeMode(index) {
      this.setThemeMode(DataUtil.THEME_SETTING_MODES[index])
    },
  },
}
</script>

<style scoped></style>
