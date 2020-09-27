<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img :src="fisher" width="24px" height="24px" class="mr-1" />
        Fish List
      </div>
      <v-spacer />
      <div><i class="xiv eorzea-time-chs ml-1"></i>{{ eorzeaTime }}</div>
      <div class="ml-2">
        <i class="xiv local-time-chs ml-1"></i
        >{{
          earthTime
            .getHours()
            .toString()
            .padStart(2, ' ')
        }}:{{
          earthTime
            .getMinutes()
            .toString()
            .padStart(2, '0')
        }}
      </div>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import EorzeaTime from '@/utils/Time'
import '@thewakingsands/axis-font-icons'
import fisher from '@/assets/fisher.png'

export default {
  name: 'App',
  components: {},
  data: () => ({
    now: Date.now(),
    fisher,
  }),
  computed: {
    // TODO: CHECK different with real eorzea time of 1 minute
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return new Date(this.now)
    },
  },
  created() {
    setInterval(() => {
      this.now = Date.now()
    }, 1000)
    // console.log(Object.entries(this.zones).map(([key, zone]) => '{ key:' + key + ', zoneName: \'' + zone.name_en + '\'}').join('\n'))
  },
}
</script>

<style>
@import './assets/css/fish_icons.css';

@font-face {
  font-family: 'FFXIV';
  src: url('./assets/font/FFXIV_Lodestone_SSF.ttf') format('truetype'),
    url('./assets/font/FFXIV_Lodestone_SSF.woff') format('woff');
  unicode-range: U+E020-E0DB;
}
</style>