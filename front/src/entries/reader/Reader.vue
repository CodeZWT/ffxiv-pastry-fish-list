<template>
  <v-app class="transparent">
    <v-system-bar app v-if="showTimerBar">
      <v-img :src="readerIcon" max-height="20" max-width="20" />
      <span class="ml-1">渔捞</span>
      <v-spacer />
      <div class="mr-1"><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
      <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
      <v-spacer></v-spacer>
      <v-btn @click="showSetting" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn @click="minimize" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-system-bar app v-else-if="showSettingBar">
      <v-img :src="readerIcon" max-height="20" max-width="20" />
      <span class="ml-1">渔捞设置</span>
      <v-spacer />
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-main>
      <router-view :now="now" />
    </v-main>
  </v-app>
</template>

<script>
import WindowUtil from './util/WindowUtil'
import '@thewakingsands/axis-font-icons'
import EorzeaTime from '@/utils/Time'
import DataUtil from '@/utils/DataUtil'
import { mapMutations, mapState } from 'vuex'
import READER_ICON from 'Assets/reader.png'

export default {
  name: 'Reader',
  components: {},
  data: () => ({
    now: Date.now(),
    readerIcon: READER_ICON,
  }),
  computed: {
    showTimerBar() {
      return this.$route.name === 'ReaderTimer'
    },
    showSettingBar() {
      return this.$route.name === 'ReaderSetting'
    },
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return DataUtil.formatDateTime(this.now, 'HH:mm')
    },
    ...mapState(['sounds']),
  },
  async created() {
    setInterval(() => {
      this.now = Date.now()
    }, 100)

    const sounds = await this.loadingSounds()
    this.setSounds(DataUtil.toMap(sounds, it => it.key))
  },
  methods: {
    showSetting() {
      window.electron?.ipcRenderer?.send('showSetting')
    },
    minimize() {
      WindowUtil.minimizeWindow()
    },
    close() {
      WindowUtil.hideWindow()
    },
    loadingSounds() {
      return DataUtil.loadingSounds(DataUtil.READER_SOUNDS)
    },
    ...mapMutations(['setSounds']),
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

.v-system-bar {
  -webkit-app-region: drag;
}

.v-application {
  /*background-color: #ffffff00 !important;*/
}
</style>
