<template>
  <v-app :class="{ transparent: true, 'mini-mode': hideBar }">
    <template v-if="hideBar"></template>
    <v-system-bar app v-else-if="showTimerBar">
      <v-img :src="readerIcon" max-height="20" max-width="20" />
      <span class="mx-1">渔捞</span>
      <span v-if="readerRegion === 'CN'">国服{{ CN_PATCH_VERSION }}</span>
      <span v-else>国际服{{ GLOBAL_PATCH_VERSION }}</span>
      <v-spacer />
      <div class="mr-1"><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
      <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
      <v-spacer></v-spacer>
      <v-btn @click="showSetting" x-small text style="-webkit-app-region: none">
        <new-feature-mark :id="SettingFeatureId">
          <v-icon>mdi-cog</v-icon>
        </new-feature-mark>
      </v-btn>
      <!--      <v-btn @click="minimize" x-small text style="-webkit-app-region: none">-->
      <!--        <v-icon>mdi-window-minimize</v-icon>-->
      <!--      </v-btn>-->
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-system-bar app v-else-if="showSettingBar">
      <v-img :src="settingIcon" max-height="20" max-width="20" />
      <span class="ml-1">渔捞设置</span>
      <v-spacer />
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-system-bar app v-else-if="showHistoryBar">
      <v-img :src="readerIcon" max-height="20" max-width="20" />
      <span class="ml-1">历史记录</span>
      <v-spacer />
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-system-bar app v-else-if="showSpotStatisticsBar">
      <v-img :src="readerIcon" max-height="20" max-width="20" />
      <span class="ml-1">钓场统计</span>
      <v-spacer />
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-main>
      <router-view :now="now" class="reader-wrapper" />
      <resize-indicator />
    </v-main>
  </v-app>
</template>

<script>
import WindowUtil from './util/WindowUtil'
import '@thewakingsands/axis-font-icons'
import EorzeaTime from '@/utils/Time'
import DataUtil from '@/utils/DataUtil'
import { mapGetters, mapMutations, mapState } from 'vuex'
import READER_ICON from 'Assets/reader.png'
import SETTING_ICON from 'Assets/setting.png'
import { ReaderFeatures } from 'Data/newFeatures'
import NewFeatureMark from '@/components/basic/NewFeatureMark'
import { CN_PATCH_VERSION, GLOBAL_PATCH_VERSION } from 'Data/constants'
import db from '@/plugins/db'
import { Howl } from 'howler'
import ResizeIndicator from '@/components/basic/ResizeIndicator'
import UploadUtil from '@/utils/UploadUtil'

export default {
  name: 'Reader',
  components: { ResizeIndicator, NewFeatureMark },
  data: () => ({
    now: Date.now(),
    closeMode: 'HIDE',
    readerIcon: READER_ICON,
    settingIcon: SETTING_ICON,
    SettingFeatureId: ReaderFeatures.Setting,
    CN_PATCH_VERSION: CN_PATCH_VERSION,
    GLOBAL_PATCH_VERSION: GLOBAL_PATCH_VERSION,
  }),
  computed: {
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
    ...mapState(['sounds', 'readerTimerMiniMode']),
    ...mapGetters(['readerRegion']),
  },
  async created() {
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

    window.electron?.ipcRenderer
      ?.on('reloadUserData', () => {
        this.reloadUserData()
        console.info('loading sounds')
        this.loadingSounds().then(sounds =>
          this.setSounds(DataUtil.toMap(sounds, it => it.key))
        )
      })
      ?.on('getUploadRecords', UploadUtil.sendUploadRecord)
  },
  mounted() {
    // trigger fishing data manually
    setTimeout(() => this.sendElectronEvent('getFishingData'), 2000)
  },
  methods: {
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
    showSetting() {
      window.electron?.ipcRenderer?.send('showSetting')
      this.setFeatureViewed(this.SettingFeatureId)
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
      return Promise.all([
        db.sounds
          .bulkGet(['light-custom', 'medium-custom', 'heavy-custom'])
          .then(sounds => {
            return sounds
              .filter(it => it && it.base64)
              .map(sound => {
                return {
                  key: sound.id,
                  player: new Howl({ src: sound.base64, preload: true }),
                }
              })
          }),
        DataUtil.loadingSounds(DataUtil.READER_SOUNDS),
      ]).then(it => it.flatMap(sounds => sounds))
    },
    ...mapMutations(['setSounds', 'reloadUserData', 'setFeatureViewed']),
  },
}
</script>

<style>
@import '~Assets/css/fish_icons.css';
@import '~Assets/css/keys.css';

@font-face {
  font-family: 'FFXIV';
  src: url('~Assets/font/FFXIV_Lodestone_SSF.ttf') format('truetype'),
    url('~Assets/font/FFXIV_Lodestone_SSF.woff') format('woff');
  unicode-range: U+E020-E0DB;
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
  overflow-y: scroll
  height: calc(100vh - #{ $top-bars-padding-reader})
</style>
