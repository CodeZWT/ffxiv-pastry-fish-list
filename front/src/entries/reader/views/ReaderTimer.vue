<template>
  <v-container fluid>
    <v-row no-gutters v-if="!mini">
      <!-- patch update wait note -->
      <!--      <v-alert outlined type="warning" border="left">-->
      <!--        更新国服5.41后，渔捞与同步功能不可用，请耐心等待自动更新。-->
      <!--      </v-alert>-->
      <!--      <v-banner v-if="showBanner" two-line>-->
      <!--        <v-avatar slot="icon" color="warning" size="40">-->
      <!--          <v-icon icon="mdi-lock" color="white">-->
      <!--            mdi-alert-->
      <!--          </v-icon>-->
      <!--        </v-avatar>-->

      <v-col cols="12" class="d-flex align-center" style="min-height: 32px">
        <div style="min-width: 100px">
          咬钩计时
          <!--          <span :title="isStrictMode ? '严格模式下禁用' : '迷你模式'">-->
          <!--            <v-btn small text icon @click="toggleMiniMode(true)" :disabled="isStrictMode">-->
          <!--              <new-feature-mark id="MiniMode-V.0.6.6-1">-->
          <!--                <v-icon small>mdi-dock-window</v-icon>-->
          <!--              </new-feature-mark>-->
          <!--            </v-btn>-->
          <!--          </span>-->
        </div>
        <v-spacer />
        <div class="mr-1" title="获得力/鉴别力/采集力">
          {{ playerStatus.text }}
        </div>
        <div class="d-flex align-center">
          <div v-for="effect in effects" :key="effect.id">
            <effect-icon :icon-class="effect.icon" :title="effect.name" />
          </div>
        </div>
      </v-col>
      <v-col cols="12">
        <v-progress-linear :value="intervalPercentage" :color="color" height="25" rounded>
          <template>
            <strong>{{ intervalText }} {{ tugText }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col cols="12" v-if="isOceanFishing">
        <div style="min-height: 32px" class="d-flex align-center">
          <div style="min-width: 60px">{{ weatherText }}</div>
          <v-spacer />
          <div class="text-right">
            <div v-if="isSpectralCurrent">钓场倒计时30s时，幻海流强制结束，请注意。</div>
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
        <v-tooltip top :disabled="disableTooltip">
          <template v-slot:activator="{ on, attrs }">
            <div
              style="min-height: 32px"
              class="d-flex align-center"
              v-bind="attrs"
              v-on="on"
            >
              <div class="mr-1">{{ serverName }}</div>
              <div>{{ weatherText }}</div>
            </div>
          </template>
          <div>
            <div>
              岛名@mm:ss，表示该云冠群岛副本将在每10分钟的mm:ss时刷新天气。[功能测试中]
            </div>
            <div>
              例：暖水鳟岛@6:27，表示 暖水鳟岛
              会在每个小时的6m:27s、16m:27s、26m:27s、36m:27s、46m:27s、56m:27s 刷新天气
            </div>
          </div>
        </v-tooltip>
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
        <div v-if="!bait.id">{{ $t('readerTimer.baitTip') }}</div>
        <div v-else class="d-flex align-center">
          <span class="mr-1">鱼饵</span>
          <item-icon :icon-class="bait.icon" :title="bait.name" small />
        </div>
        <v-spacer />

        <v-btn v-if="showJumpBtn" @click="showSpotPage" title="显示当前钓场图鉴" icon>
          <v-icon>mdi-notebook</v-icon>
        </v-btn>
        <v-btn @click="addReaderSpotStatistics" title="显示钓场统计" icon>
          <v-icon>mdi-chart-box</v-icon>
        </v-btn>
        <v-btn @click="addReaderHistory" title="显示历史记录" icon>
          <v-icon>mdi-history</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="12" v-if="isTest" class="mt-4">
        <v-btn @click="nextTestEvent" class="mr-1" color="info">next</v-btn>
        <v-btn @click="resetTest" color="error">reset</v-btn>
        <div>Test Data</div>
        <div>Status: {{ dataStatus }}</div>
        <div>Record: {{ dataCurrentRecord }}</div>
        <div>Prev: {{ dataPrevRecord }}</div>
      </v-col>
    </v-row>
    <v-row no-gutters v-else>
      <v-col cols="12" class="d-flex align-center mb-1">
        <v-progress-linear :value="intervalPercentage" :color="color" height="25" rounded>
          <template>
            <strong>{{ intervalText }} {{ tugText }}</strong>
          </template>
        </v-progress-linear>
        <!--        <v-btn small icon text @click="toggleMiniMode(false)" title="退出迷你模式">-->
        <!--          <new-feature-mark id="MiniModeRestore-V.0.6.6-1">-->
        <!--            <v-icon small>mdi-arrow-expand</v-icon>-->
        <!--          </new-feature-mark>-->
        <!--        </v-btn>-->
      </v-col>
      <v-col cols="12" v-if="isOceanFishing">
        <v-progress-linear
          :value="spectralCurrentIntervalPercentage"
          color="info"
          height="25"
          rounded
        >
          <template v-if="spectralCurrentCountDown">
            <strong>{{ weatherText }}: {{ spectralCurrentIntervalText }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col cols="12" v-if="isDiadem">
        <v-progress-linear
          :value="diademWeatherIntervalPercentage"
          color="primary"
          height="25"
          rounded
        >
          <template v-if="diademWeatherCountDown">
            <strong>{{ weatherText }}: {{ diademWeatherCountdownText }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
    </v-row>
    <rc-dialog :value="hasStrictModeViolation" persistent max-width="600">
      <v-card>
        <v-card-title>严格模式检查</v-card-title>
        <v-card-text>
          <v-alert outlined type="error" border="left">
            <div>{{ strictModeCheckTip }}</div>
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <div style="width: 100%" class="d-flex flex-column">
            <!--            <v-btn-->
            <!--              v-if="lastRecordCancelled"-->
            <!--              color="warning"-->
            <!--              @click="closeStrictMode"-->
            <!--              block-->
            <!--              class="my-1"-->
            <!--            >-->
            <!--              将本地上一条记录标记为非严格-->
            <!--            </v-btn>-->
            <v-btn
              v-if="(lastRecordCancelled || wrongHookset) && !skipAlert"
              @click="closeAlert"
              block
              class="mb-1"
            >
              {{
                `关闭提示框${
                  lastRecordCancelled ? '（请在后台页面自助删除对应数据）' : ''
                }`
              }}
            </v-btn>
            <v-btn color="error" @click="closeStrictMode" block>关闭严格模式</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </rc-dialog>
  </v-container>
</template>

<script>
import { ReaderFeatures } from 'Data/newFeatures'
import { SERVER_ID_NAMES } from 'Data/diadem'
import { WEATHER_TYPES } from 'Data/translation'
import { mapGetters, mapMutations, mapState } from 'vuex'
import COMMON from 'Data/common'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import EffectIcon from '@/components/basic/EffectIcon'
import ItemIcon from '@/components/basic/ItemIcon'
import RcDialog from '@/components/basic/RcDialog'
import WindowUtil from '@/entries/reader/util/WindowUtil'
import rcapiService from '@/service/rcapiService'

const DIADEM_WEATHER_COUNTDOWN_TOTAL = 10 * DataUtil.INTERVAL_MINUTE
const DIADEM_WEATHERS = [133, 134, 135, 136]
const SPECTRAL_CURRENT = 145

export default {
  name: 'ReaderTimer',
  components: { RcDialog, EffectIcon, ItemIcon },
  props: {
    mini: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mode: 'normal',
      dataStatus: {
        effects: [],
      },
      dataCurrentRecord: {},
      dataPrevRecord: {},
      spectralCurrentCountDownTotal: 2 * DataUtil.INTERVAL_MINUTE,
      HistoryFeatureId: ReaderFeatures.History,
      SpotStatisticsFeatureId: ReaderFeatures.SpotStatistics,
      closeAlertStartTime: undefined,
      now: Date.now(),
    }
  },
  computed: {
    ...mapState(['sounds', 'userData']),
    ...mapGetters([
      'readerSetting',
      'showBanner',
      'isUploadMode',
      'isStrictMode',
      'isRoseMode',
    ]),
    shouldCheckForStrictMode() {
      return (
        this.isRoseMode &&
        this.isStrictMode &&
        this.isUploadMode &&
        rcapiService.isLogin()
      )
    },
    noStatus() {
      return !this.playerStatus.gathering
    },
    noBait() {
      return !this.bait.id
    },
    surfaceScale() {
      return !!this.effects.find(effect => effect.id === 1803)
    },
    identicalCast() {
      return !!this.effects.find(effect => effect.id === 1804)
    },
    fishEyes() {
      return !!this.effects.find(effect => effect.id === 762)
    },
    lastRecordCancelled() {
      return !!this.dataPrevRecord?.cancelled
    },
    wrongHookset() {
      const { gatheringFortuneUp, catchAndRelease, hookset, tug } =
        this.dataPrevRecord ?? {}
      return (
        (catchAndRelease || gatheringFortuneUp) &&
        ((tug === 'light' && hookset !== 'precision') ||
          (tug === 'medium' && hookset !== 'powerful') ||
          hookset === 'double' ||
          hookset === 'normal')
      )
    },
    skipAlert() {
      return this.closeAlertStartTime === this.dataPrevRecord?.startTime
    },
    hasStrictModeViolation() {
      return (
        this.shouldCheckForStrictMode &&
        (this.surfaceScale ||
          this.identicalCast ||
          this.noStatus ||
          this.noBait ||
          this.fishEyes ||
          (!this.skipAlert && (this.lastRecordCancelled || this.wrongHookset)))
      )
    },
    strictModeCheckTip() {
      if (this.lastRecordCancelled && !this.skipAlert) {
        return this.$t('readerTimer.lastRecordCancelledTip')
      } else if (this.wrongHookset && !this.skipAlert) {
        return this.$t('readerTimer.wrongHooksetTip')
      } else if (this.noStatus) {
        return this.$t('readerTimer.statusTip')
      } else if (this.noBait) {
        return this.$t('readerTimer.baitTip')
      } else if (this.surfaceScale) {
        return this.$t('readerTimer.surfaceScaleTip')
      } else if (this.identicalCast) {
        return this.$t('readerTimer.identicalCastTip')
      } else if (this.fishEyes) {
        return this.$t('readerTimer.fishEyesTip')
      }
      return ''
    },
    disableTooltip() {
      return this.dataStatus?.serverId === -1
    },
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
          : this.$t('readerTimer.statusTip'),
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
      return this.readerSetting.timer.color[this.tug ?? 'default']
    },
    interval() {
      const startTime = this.dataCurrentRecord?.startTime ?? this.now
      const biteTime = this.dataCurrentRecord?.biteTime ?? this.now
      return Math.max(biteTime - startTime, 0)
    },
    intervalPercentage() {
      const percentage = this.interval / 60000
      return (percentage > 1 ? 1 : percentage) * 100
    },
    intervalText() {
      return this.interval ? (this.interval / 1000).toFixed(1) : ''
    },
    tugText() {
      return this.tug
        ? this.$t('tug.' + this.tug) + ' ' + DataUtil.TUG_ICON[this.tug]
        : ''
    },
    isOceanFishing() {
      // return true
      return this.zoneId === 3477 || this.weather === SPECTRAL_CURRENT
    },
    isDiadem() {
      return (
        this.zoneId === 1647 ||
        DIADEM_WEATHERS.includes(this.weather) ||
        this.dataStatus?.isDiadem
      )
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
    serverName() {
      return (
        `[${
          this.dataStatus.serverId === -1
            ? '请在打开鱼糕的状态下进入云冠空岛'
            : SERVER_ID_NAMES[this.dataStatus.serverId % SERVER_ID_NAMES.length] + '岛'
        }${this.serverDiadem10MinOffset >= 0 ? '@' + this.serverDiademMinute : ''}]` ?? ''
      )
    },
    serverDiadem10MinOffset() {
      return this.dataStatus?.diademServerDict[this.dataStatus.serverId]
    },
    serverDiademMinute() {
      const seconds = Math.round(this.serverDiadem10MinOffset / 1000)
      const INTERVAL_MINUTE = 60
      return `${Math.floor(seconds / INTERVAL_MINUTE)}m:${seconds % INTERVAL_MINUTE}s`
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
    fishingStartTime() {
      return this.dataCurrentRecord?.startTime
    },
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
    this.closeStrictMode()
    window.electron?.ipcRenderer?.on('fishingData', (event, data) => {
      this.dataStatus = {
        ...data.status,
        effects: Array.from(data.status && data.status.effects),
      }
      this.dataCurrentRecord = data.currentRecord
      this.dataPrevRecord = data.prevRecord
    })
    // ?.on('newRecord', (event, data) => {
    //   const isLogin = rcapiService.isLogin()
    //   data.uploadEnabled = this.isRoseMode && this.isUploadMode && isLogin
    //   data.isStrictMode = RecordValidator.judgeRecordStrictFlag(
    //     this.isRoseMode && this.isStrictMode && isLogin,
    //     data
    //   )
    //   console.log('store in reader', data)
    //   db.records.put(data).catch(error => console.error('storeError', error))
    // })
    // ?.on('fishCaught', (event, data) => {
    //   const fishId = data?.fishId
    //   this.setFishCompleted({ fishId: fishId, completed: true })
    // })
  },
  mounted() {
    // this.sendElectronEvent('updateWindowSetting', null)
    setInterval(() => {
      this.now = Date.now()
    }, 100)
  },
  methods: {
    // async markLastRecordNotStrict() {
    //   let table = db.records.orderBy('startTime').reverse()
    //   const records = await table
    //     .filter(record => record.fishId === -1 && record.canceled === true)
    //     .limit(1)
    //     .toArray()
    //   if (records.length > 0) {
    //     const record = records[0]
    //     record.isStrictMode = false
    //     db.records.put(record).catch(error => console.error('storeError', error))
    //   }
    // },
    closeStrictMode() {
      this.setStrictMode(false)
      // this.sendElectronEvent('setStrictMode', false)
    },
    closeAlert() {
      this.closeAlertStartTime = this.dataPrevRecord?.startTime
    },
    onDismiss() {
      this.setNotShowBanner()
    },
    nextTestEvent() {
      this.sendElectronEvent('nextTestEvent')
    },
    resetTest() {
      this.sendElectronEvent('resetTest')
    },
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
    showSpotPage() {
      this.sendElectronEvent('showSpotPage', this.spotId)
    },
    // toggleMiniMode(mini) {
    // console.log(mini)
    // this.sendElectronEvent('timerMiniMode', mini)
    // },
    ringBell(tugType) {
      DataUtil.ringBell(this.readerSetting.timer.sound, tugType, this.sounds)
    },
    addReaderHistory() {
      this.showWindow({
        type: 'READER_HISTORY',
      })
    },
    addReaderSpotStatistics() {
      this.showWindow({
        type: 'READER_SPOT_STATISTICS',
      })
    },
    ...mapMutations('screenWindow', ['showWindow']),
    ...mapMutations([
      'setFeatureViewed',
      'setFishCompleted',
      'setNotShowBanner',
      'setStrictMode',
    ]),
  },
}
</script>
