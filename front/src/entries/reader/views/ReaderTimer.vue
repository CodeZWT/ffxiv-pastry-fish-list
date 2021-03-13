<template>
  <v-container fluid style="overflow-y: hidden; height: 100vh">
    <v-row no-gutters v-if="!readerTimerMiniMode">
      <v-col cols="12" class="d-flex align-center" style="min-height: 32px">
        <div>
          咬钩计时
          <v-btn small text icon @click="toggleMiniMode(true)" title="迷你模式">
            <new-feature-mark id="MiniMode-V.0.6.6-1">
              <v-icon small>mdi-dock-window</v-icon>
            </new-feature-mark>
          </v-btn>
        </div>
        <v-spacer />
        <div class="mr-1" title="获得力/鉴别力/采集力">
          {{ playerStatus.text }}
        </div>
        <div class="d-flex align-center">
          <div v-for="effect in effects" :key="effect.id">
            <div :class="effect.icon" :title="effect.name" />
          </div>
        </div>
      </v-col>
      <v-col cols="12">
        <v-progress-linear :value="intervalPercentage" :color="color" height="25" rounded>
          <template>
            <strong>{{ intervalText }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col cols="12" v-if="isOceanFishing">
        <div style="min-height: 32px" class="d-flex align-center">
          <div>{{ weatherText }}</div>
          <div v-if="isSpectralCurrent && readerRegion === 'Global'">
            国际服幻海流的补偿机制暂未支持。
          </div>
          <div v-if="isSpectralCurrent">
            （钓场倒计时30s时，幻海流强制结束，请注意。）
          </div>
        </div>
        <v-progress-linear
          :value="spectralCurrentIntervalPercentage"
          color="info"
          height="25"
          rounded
        >
          <template>
            <strong>{{ spectralCurrentIntervalText }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col cols="12" v-if="isDiadem">
        <div style="min-height: 32px" class="d-flex align-center">{{ weatherText }}</div>
        <v-progress-linear
          :value="diademWeatherIntervalPercentage"
          color="primary"
          height="25"
          rounded
        >
          <template>
            <strong>{{ diademWeatherCountdownText }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col cols="12" class="mt-4 d-flex">
        <div v-if="!bait.id">未检测到鱼饵，请切换至任意鱼饵以读取数据</div>
        <div v-else class="d-flex align-center">
          <span class="mr-1">鱼饵</span>
          <item-icon :icon-class="bait.icon" :title="bait.name" small />
        </div>
        <v-spacer />
        <v-btn
          v-if="showJumpBtn"
          color="info"
          @click="showSpotPage"
          class="mr-2"
          title="鱼糕显示对应钓场页面"
        >
          <new-feature-mark id="JumpWiki-V.0.6.6-1">
            <v-icon>mdi-notebook</v-icon>
          </new-feature-mark>
        </v-btn>
        <v-btn color="info" @click="showSpotStatistics" class="mr-2">
          <new-feature-mark :id="SpotStatisticsFeatureId">
            <v-icon>mdi-chart-box</v-icon>
          </new-feature-mark>
        </v-btn>
        <v-btn color="info" @click="showHistory">
          <new-feature-mark :id="HistoryFeatureId">
            <v-icon>mdi-history</v-icon>
          </new-feature-mark>
        </v-btn>
      </v-col>

      <v-col cols="12" v-if="isTest" class="mt-4">
        <div>Test Data</div>
        <div>{{ dataStatus }}</div>
      </v-col>
    </v-row>
    <v-row no-gutters v-else>
      <v-col class="d-flex align-center mb-1">
        <v-progress-linear
          :value="intervalPercentage"
          :color="color"
          height="25"
          rounded
          style="-webkit-app-region: drag"
        >
          <template>
            <strong>{{ intervalText }}</strong>
          </template>
        </v-progress-linear>
        <v-btn small icon text @click="toggleMiniMode(false)" title="退出迷你模式">
          <new-feature-mark id="MiniModeRestore-V.0.6.6-1">
            <v-icon small color="grey">mdi-arrow-expand</v-icon>
          </new-feature-mark>
        </v-btn>
      </v-col>
      <v-col cols="12" v-if="isOceanFishing" class="pr-7">
        <v-progress-linear
          :value="spectralCurrentIntervalPercentage"
          color="info"
          height="25"
          rounded
          style="-webkit-app-region: drag"
        >
          <template v-if="spectralCurrentCountDown">
            <strong>{{ weatherText }}: {{ spectralCurrentIntervalText }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col cols="12" v-if="isDiadem" class="pr-7">
        <v-progress-linear
          :value="diademWeatherIntervalPercentage"
          color="primary"
          height="25"
          rounded
          style="-webkit-app-region: drag"
        >
          <template v-if="diademWeatherCountDown">
            <strong>{{ weatherText }}: {{ diademWeatherCountdownText }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
    </v-row>
    <resize-indicator />
  </v-container>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import { mapGetters, mapMutations, mapState } from 'vuex'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import { WEATHER_TYPES } from 'Data/translation'
import { ReaderFeatures } from '../../../../../data/newFeatures'
import NewFeatureMark from '@/components/basic/NewFeatureMark'
import COMMON from 'Data/common'
import db from '@/plugins/db'
import ItemIcon from '@/components/basic/ItemIcon'
import WindowUtil from '@/entries/reader/util/WindowUtil'
import ResizeIndicator from '@/components/basic/ResizeIndicator'

const DIADEM_WEATHER_COUNTDOWN_TOTAL = 10 * DataUtil.INTERVAL_MINUTE
const DIADEM_WEATHERS = [133, 134, 135, 136]
const SPECTRAL_CURRENT = 145

export default {
  name: 'ReaderTimer',
  components: { ResizeIndicator, ItemIcon, NewFeatureMark },
  props: ['now'],
  data() {
    return {
      mode: 'normal',
      dataStatus: {
        effects: [],
      },
      dataCurrentRecord: {},
      // dataRecords: [],
      // dataReadableRecords: [],

      // spectralCurrentEndTime: undefined,
      // diademWeatherEndTime: undefined,
      // normalWeatherStartTime: undefined,
      spectralCurrentCountDownTotal: 2 * DataUtil.INTERVAL_MINUTE,
      HistoryFeatureId: ReaderFeatures.History,
      SpotStatisticsFeatureId: ReaderFeatures.SpotStatistics,
    }
  },
  computed: {
    ...mapGetters(['getWeather', 'readerRegion']),
    spotId() {
      return this.dataStatus?.spotId
    },
    showJumpBtn() {
      return (
        this.spotId > 0 &&
        !DataUtil.isOceanFishingSpot(this.spotId) &&
        !DataUtil.isDiademSpot(this.spotId)
      )
    },
    isTest() {
      return DevelopmentModeUtil.isTest()
    },
    isSpectralCurrent() {
      return this.weather === SPECTRAL_CURRENT
    },
    effects() {
      return (this.dataStatus?.effects ?? [])
        .map(it => COMMON.STATUS[it])
        .filter(it => it != null)
        .map(effect => {
          return {
            id: effect.id,
            name: DataUtil.getName(effect),
            icon: DataUtil.iconIdToClass(effect.icon),
          }
        })
    },
    playerStatus() {
      return {
        gathering: this.dataStatus?.gathering,
        perception: this.dataStatus?.perception,
        gp: this.dataStatus?.gp,
        text: this.dataStatus?.gathering
          ? `${this.dataStatus?.gathering}/${this.dataStatus?.perception}/${this.dataStatus?.gp}`
          : '请切换至其他职业再切回捕鱼人以获取获得力相关信息',
      }
    },
    bait() {
      const baitId = this.dataStatus?.baitId
      return this.dataStatus?.baitId > 0
        ? {
            id: baitId,
            icon: DataUtil.getItemIconClass(baitId),
            name: DataUtil.getItemName(baitId),
          }
        : {}
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
      return this.interval ? (this.interval / 1000).toFixed(1) : ''
    },
    isOceanFishing() {
      // return true
      return this.zoneId === 3477 || this.weather === SPECTRAL_CURRENT
    },
    isDiadem() {
      return this.zoneId === 1647 || DIADEM_WEATHERS.includes(this.weather)
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
      return this.spectralCurrentCountDown
        ? (this.spectralCurrentCountDown / 1000).toFixed(0)
        : ''
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
      return this.diademWeatherCountDown
        ? (this.diademWeatherCountDown / 1000).toFixed(0)
        : ''
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
    ...mapState(['sounds', 'readerTimerMiniMode', 'userData']),
  },
  watch: {
    tug(tug) {
      if (tug && !WindowUtil.isWindowHidden()) {
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
    const routeName =
      window.process?.argv
        ?.find(it => it.indexOf('--route-name') === 0)
        ?.split('=')?.[1] ?? 'ReaderTimer'
    if (routeName === 'ReaderTimer') {
      this.mode =
        window.process?.argv?.find(it => it.indexOf('--mode') === 0)?.split('=')?.[1] ??
        'normal'
    }
    console.log('window.process.argv', routeName, this.mode)
    this.updateReaderTimerMiniMode(this.mode === 'mini')

    if (routeName !== this.$route.name) {
      this.$router.push({ name: routeName })
    }
    // const data = {} // DevelopmentModeUtil.isTest() ? DUMMY_DATA[2] :
    // this.dataStatus = data.status
    // this.dataCurrentRecord = data.currentRecord
    // this.dataRecords = data.records
    // this.dataReadableRecords = data.readableRecords
    window.electron?.ipcRenderer
      ?.on('fishingData', (event, data) => {
        this.dataStatus = {
          ...data.status,
          effects: Array.from(data.status && data.status.effects),
        }
        this.dataCurrentRecord = data.currentRecord
        // this.dataRecords = data.records
        // this.dataReadableRecords = data.readableRecords
      })
      ?.on('newRecord', (event, data) => {
        db.records.put(data).catch(error => console.error('storeError', error))
      })
  },
  methods: {
    showSpotPage() {
      window.electron?.ipcRenderer?.send('showSpotPage', this.spotId)
    },
    toggleMiniMode(mini) {
      window.electron?.ipcRenderer?.send('timerMiniMode', mini)
    },
    ringBell(tugType) {
      DataUtil.ringBell(this.userData.reader.timer.sound, tugType, this.sounds)
    },
    showHistory() {
      window.electron?.ipcRenderer?.send('toggleHistory')
      this.setFeatureViewed(this.HistoryFeatureId)
    },
    showSpotStatistics() {
      window.electron?.ipcRenderer?.send('toggleSpotStatistics')
      this.setFeatureViewed(this.SpotStatisticsFeatureId)
    },
    ...mapMutations(['setFeatureViewed', 'updateReaderTimerMiniMode']),
  },
}
</script>
