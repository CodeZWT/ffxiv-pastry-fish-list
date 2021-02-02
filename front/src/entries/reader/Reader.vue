<template>
  <v-app>
    <v-system-bar app>
      <div class="mr-1"><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
      <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
      <v-spacer></v-spacer>
      <v-btn @click="minimize" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <!--      <v-btn @click="close" x-small text style="  -webkit-app-region: none">-->
      <!--        <v-icon>mdi-close</v-icon>-->
      <!--      </v-btn>-->
    </v-system-bar>
    <v-main>
      <router-view :now="now" />
    </v-main>
  </v-app>
</template>

<script>
import SubUtil from './util/SubUtil'
import WindowUtil from './util/WindowUtil'
import '@thewakingsands/axis-font-icons'

export default {
  name: 'Reader',
  components: {},
  data: () => ({
    now: Date.now(),
  }),
  computed: {
    eorzeaTime() {
      return SubUtil.formatDateTime(SubUtil.toET(this.now), 'HH:mm')
    },
    earthTime() {
      return SubUtil.formatDateTime(this.now, 'HH:mm')
    },
  },
  created() {
    setInterval(() => {
      this.now = Date.now()
    }, 100)
  },
  methods: {
    minimize() {
      WindowUtil.minimizeWindow()
    },
    // close() {
    //   WindowUtil.closeWindow()
    // }
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
</style>
