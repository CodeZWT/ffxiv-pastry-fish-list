<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" class="d-flex align-center" style="min-height: 32px">
        <div>咬钩计时</div>
        <v-spacer />
        <div class="d-flex align-center">
          <div v-for="effect in effects" :key="effect.ID">
            <div :class="effect.icon" :title="effect.name" />
          </div>
        </div>
      </v-col>
      <v-col cols="12">
        <v-progress-linear :value="intervalPercentage" :color="color" height="25">
          <template>
            <strong>{{ intervalText }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col cols="12" v-if="isOceanFishing">
        <div style="min-height: 32px">{{ weatherText }}</div>
        <v-progress-linear
          :value="spectralCurrentIntervalPercentage"
          color="info"
          height="25"
        >
          <template>
            <strong>{{ spectralCurrentIntervalText }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col cols="12" v-if="isDiadem">
        <div style="min-height: 32px">{{ weatherText }}</div>
        <v-progress-linear
          :value="diademWeatherIntervalPercentage"
          color="primary"
          height="25"
        >
          <template>
            <strong>{{ diademWeatherCountdownText }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col cols="12" v-if="isTest" class="mt-4">
        <div>Test Data</div>
        <div>{{ dataStatus }}</div>
        <div>{{ dataLastCatchRecord }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import { mapGetters, mapState } from 'vuex'
import SubUtil from '@/entries/reader/util/SubUtil'

const DIADEM_WEATHER_COUNTDOWN_TOTAL = 10 * DataUtil.INTERVAL_MINUTE
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import { WEATHER_TYPES } from 'Data/translation'

export default {
  name: 'ReaderTimer',
  props: ['now'],
  data() {
    return {
      dataStatus: {
        effects: [],
      },
      dataCurrentRecord: {},
      dataLastCatchRecord: {},
      dataRecords: [],
      dataReadableRecords: [],

      // spectralCurrentEndTime: undefined,
      // diademWeatherEndTime: undefined,
      // normalWeatherStartTime: undefined,
      spectralCurrentCountDownTotal: 2 * DataUtil.INTERVAL_MINUTE,
    }
  },
  computed: {
    ...mapGetters(['getWeather']),
    isTest() {
      return DevelopmentModeUtil.isTest()
    },
    effects() {
      return (this.dataStatus?.effects ?? [])
        .map(it => SubUtil.STATUS_DICT[it])
        .filter(it => it != null)
        .map(effect => {
          return {
            id: effect.ID,
            name: effect.Name,
            icon: DataUtil.iconIdToClass(effect.IconID),
          }
        })
    },
    tug() {
      return this.dataCurrentRecord?.tug
    },
    color() {
      return DataUtil.TUG_ICON_COLOR[DataUtil.TUG_ICON[this.tug]] ?? 'blue-grey'
    },
    interval() {
      const startTime = this.dataCurrentRecord?.startTime ?? this.now
      const biteTime = this.dataCurrentRecord?.biteTime ?? this.now
      return biteTime - startTime
    },
    intervalPercentage() {
      const percentage = this.interval / 60000
      return (percentage > 1 ? 1 : percentage) * 100
    },
    intervalText() {
      return (this.interval / 1000).toFixed(1)
    },
    isOceanFishing() {
      // return true
      return this.zoneId === 3477 || this.weather === 145
    },
    isDiadem() {
      return this.zoneId === 1647
    },
    spectralCurrentCountDown() {
      return this.isOceanFishing &&
        this.spectralCurrentEndTime &&
        this.spectralCurrentEndTime - this.now > 0
        ? this.spectralCurrentEndTime - this.now
        : 0
    },
    spectralCurrentIntervalPercentage() {
      return (this.spectralCurrentCountDown / this.spectralCurrentCountDownTotal) * 100
    },
    spectralCurrentIntervalText() {
      return (this.spectralCurrentCountDown / 1000).toFixed(0)
    },

    diademWeatherCountDown() {
      return this.isDiadem &&
        this.diademWeatherEndTime &&
        this.diademWeatherEndTime - this.now > 0
        ? this.diademWeatherEndTime - this.now
        : 0
    },
    diademWeatherIntervalPercentage() {
      return (this.diademWeatherCountDown / DIADEM_WEATHER_COUNTDOWN_TOTAL) * 100
    },
    diademWeatherCountdownText() {
      return (this.diademWeatherCountDown / 1000).toFixed(0)
    },
    previousWeather() {
      return this.dataStatus?.previousWeather
    },
    weatherText() {
      // {
      //   name: DataUtil.getName(state.weatherTypes[id]),
      //     icon: DataUtil.iconIdToClass(state.weatherTypes[id].icon),
      // }
      // console.log(WEATHER_TYPES[this.weather])
      return this.weather && DataUtil.getName(WEATHER_TYPES[this.weather])
    },
    weather() {
      return this.dataStatus?.weather
    },
    zoneId() {
      return this.dataStatus?.zoneId
    },
    spectralCurrentEndTime() {
      return this.dataStatus?.spectralCurrentEndTime
    },
    diademWeatherEndTime() {
      return this.dataStatus?.diademWeatherEndTime
    },
    normalWeatherStartTime() {
      return this.dataStatus?.normalWeatherStartTime
    },
    ...mapState(['sounds']),
  },
  watch: {
    tug(tug) {
      if (tug) {
        this.ringBell(tug)
      }
    },
    // weather(weather) {
    //   if (!this.previousWeather) return
    //   if (weather === SPECTRAL_CURRENT_WEATHER_ID) {
    //     this.spectralCurrentEndTime = this.now + this.spectralCurrentCountDownTotal
    //   } else if (DIADEM_WEATHERS.includes(weather)) {
    //     this.diademWeatherEndTime = this.now + DIADEM_WEATHER_COUNTDOWN_TOTAL
    //   } else {
    //     this.normalWeatherStartTime = this.now
    //   }
    // },
  },
  created() {
    const routeName = window.process.argv
      .find(it => it.indexOf('--route-name') === 0)
      ?.split('=')?.[1]
    console.log('window.process.argv', routeName)

    if (routeName !== this.$route.name) {
      this.$router.push({ name: routeName })
    }
    // const data = {} // DevelopmentModeUtil.isTest() ? DUMMY_DATA[2] :
    // this.dataStatus = data.status
    // this.dataCurrentRecord = data.currentRecord
    // this.dataRecords = data.records
    // this.dataReadableRecords = data.readableRecords
    window.electron?.ipcRenderer?.on('fishingData', (event, data) => {
      console.log(JSON.stringify(data))
      this.dataStatus = {
        ...data.status,
        effects: Array.from(data.status && data.status.effects),
      }
      this.dataCurrentRecord = data.currentRecord
      this.dataRecords = data.records
      this.dataReadableRecords = data.readableRecords
      this.dataLastCatchRecord = data.lastCatchRecord
    })
  },
  methods: {
    ringBell(key) {
      this.sounds[key]?.player?.volume(1).play()
    },
  },
}
</script>
