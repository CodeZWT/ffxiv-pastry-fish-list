<template>
  <v-app :class="{ transparent: true, 'mini-mode': hideBar }">
    <template v-if="hideBar"></template>
    <v-system-bar app v-else-if="showTimerBar" :color="systemBarColor">
      <v-img :src="readerIcon" max-height="20" max-width="20" />
      <span class="mx-1">渔捞</span>
      <span v-if="readerRegion === 'CN'">国服</span>
      <span v-else>国际服</span>
      <v-spacer />
      <div class="mr-1"><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
      <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
      <v-spacer />
      <div style="-webkit-app-region: none">
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
      <v-btn @click="showSetting" x-small text style="-webkit-app-region: none">
        <v-icon>{{ mdiCog }}</v-icon>
      </v-btn>
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>{{ mdiWindowClose }}</v-icon>
      </v-btn>
    </v-system-bar>
    <v-system-bar app v-else-if="showSettingBar">
      <v-img :src="settingIcon" max-height="20" max-width="20" />
      <span class="ml-1">渔捞设置</span>
      <v-spacer />
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
    </v-system-bar>
    <v-system-bar app v-else-if="showHistoryBar">
      <v-img :src="readerIcon" max-height="20" max-width="20" />
      <span class="ml-1">历史记录</span>
      <v-spacer />
      <v-btn @click="toggleShowConfig" x-small text style="-webkit-app-region: none">
        <v-icon>{{ mdiCog }}</v-icon>
      </v-btn>
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
    </v-system-bar>
    <v-system-bar app v-else-if="showSpotStatisticsBar">
      <v-img :src="readerIcon" max-height="20" max-width="20" />
      <span class="ml-1">钓场统计</span>
      <v-spacer />
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
    </v-system-bar>
    <v-main>
      <router-view class="reader-wrapper" />
      <resize-indicator />
    </v-main>
    <v-snackbar
      :timeout="snackbar.timeout"
      v-model="snackbar.show"
      :color="snackbar.color"
      centered
      elevation="24"
    >
      <div class="text-center">{{ snackbar.text }}</div>
    </v-snackbar>
  </v-app>
</template>

<script>
import '@thewakingsands/axis-font-icons'
import { CN_PATCH_VERSION, GLOBAL_PATCH_VERSION } from 'Data/constants'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { mdiClose, mdiCog, mdiWindowClose } from '@mdi/js'
import { sendElectronEvent } from '@/utils/electronHelper'
import DataUtil from '@/utils/DataUtil'
import EorzeaTime from '@/utils/Time'
import READER_ICON from 'Assets/reader.png'
import ResizeIndicator from '@/components/basic/ResizeIndicator'
import SETTING_ICON from 'Assets/setting.png'
import WindowUtil from './util/WindowUtil'

export default {
  name: 'Reader',
  components: { ResizeIndicator },
  data: () => ({
    mdiCog,
    mdiWindowClose,
    mdiClose,
    showHistoryConfig: false,
    now: Date.now(),
    closeMode: 'HIDE',
    readerIcon: READER_ICON,
    settingIcon: SETTING_ICON,
    CN_PATCH_VERSION: CN_PATCH_VERSION,
    GLOBAL_PATCH_VERSION: GLOBAL_PATCH_VERSION,
    systemThemeMode: 'DARK',
    db: undefined,
  }),
  computed: {
    systemBarColor() {
      return this.isRoseMode && this.isUploadMode && this.isStrictMode
        ? 'deep-purple darken-1'
        : this.dark
        ? 'dark'
        : 'light'
    },
    dark() {
      if (this.themeMode === 'AUTO') {
        return this.systemThemeMode === 'DARK'
      } else {
        return this.themeMode === 'DARK'
      }
    },
    showTimerBar() {
      return this.$route.name === 'ReaderTimer'
    },
    showSettingBar() {
      return this.$route.name === 'ReaderSetting'
    },
    showHistoryBar() {
      return this.$route.name === 'ReaderHistory'
    },
    showSpotStatisticsBar() {
      return this.$route.name === 'ReaderSpotStatistics'
    },
    hideBar() {
      return this.readerTimerMiniMode
    },
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return DataUtil.formatDateTime(this.now, 'HH:mm')
    },
    ...mapState(['sounds', 'readerTimerMiniMode', 'snackbar']),
    ...mapState('readerHistory', ['showConfig']),
    ...mapGetters([
      'readerRegion',
      'isStrictMode',
      'isUploadMode',
      'isRoseMode',
      'themeMode',
    ]),
  },
  async created() {
    this.db = (await import('@/plugins/db')).default

    this.closeMode =
      window.process?.argv
        ?.find(it => it.indexOf('--close-mode') === 0)
        ?.split('=')?.[1] ?? 'HIDE'

    this.loadingSounds().then(sounds =>
      this.setSounds(DataUtil.toMap(sounds, it => it.key))
    )

    setInterval(() => {
      this.now = Date.now()
    }, 100)

    window.electron?.ipcRenderer?.on('broadcast', (event, { type, source }) => {
      console.debug('reloadSettingData according to', source)
      if (type === 'reloadSystemInfo') {
        // reloadSystemInfo()
        window.location.reload()
      } else if (type === 'reloadSetting') {
        this.boardCastReload()
        console.debug('loading sounds')
        this.loadingSounds().then(sounds =>
          this.setSounds(DataUtil.toMap(sounds, it => it.key))
        )
      }
    })
    // ?.on('getUploadRecords', UploadUtil.sendUploadRecord)

    this.systemThemeMode =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'DARK'
        : 'LIGHT'
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.systemThemeMode = e.matches ? 'DARK' : 'LIGHT'
    })
  },
  async mounted() {
    // trigger fishing data manually
    setTimeout(() => sendElectronEvent('getFishingData'), 2000)
  },
  watch: {
    dark: {
      handler(dark) {
        this.$vuetify.theme.dark = dark
      },
      immediate: true,
    },
  },
  methods: {
    toggleShowConfig() {
      this.setStates({ showConfig: !this.showConfig })
    },
    toggleStrictMode() {
      const newStrictMode = !this.isStrictMode
      this.setStrictMode(newStrictMode)
    },
    showSetting() {
      sendElectronEvent('showSetting')
    },
    minimize() {
      WindowUtil.minimizeWindow()
    },
    close() {
      if (this.closeMode === 'CLOSE') {
        WindowUtil.closeWindow()
      } else {
        WindowUtil.hideWindow()
      }
    },
    loadingSounds() {
      return DataUtil.loadingSounds(this.db)
    },
    ...mapMutations('readerHistory', ['setStates']),
    ...mapMutations(['setSounds', 'boardCastReload', 'setStrictMode']),
  },
}
</script>

<style>
@import '~Assets/css/keys.css';

@font-face {
  font-family: 'FFXIV';
  src: url('~Assets/font/FFXIV_Lodestone_SSF.ttf') format('truetype'),
    url('~Assets/font/FFXIV_Lodestone_SSF.woff') format('woff');
  unicode-range: U+E020-E0DB;
  font-display: swap;
}

/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}

/* scroller setting start */
/* Works on Chrome/Edge/Safari */

*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-track {
  background: #ffffff00;
}

*::-webkit-scrollbar-thumb {
  background-color: #ffffff66;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.4);
}

/* scroller setting end */

.v-system-bar {
  -webkit-app-region: drag;
}

.v-application.mini-mode {
  background-color: #ffffff00 !important;
}
</style>

<style lang="sass">
@import "~@/styles/RcVariables"

.reader-wrapper
  overflow-y: auto
  height: calc(100vh - #{ $system-bar-height })
</style>
