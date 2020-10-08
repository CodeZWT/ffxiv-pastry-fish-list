<template>
  <v-col style="flex-direction: column; padding-bottom: 0">
    <v-row>
      <v-expansion-panels v-if="fish.hasFishingSpot" hover flat tile :value="0">
        <v-expansion-panel @change="addScrollRefreshCnt">
          <v-expansion-panel-header :color="listItemColor">
            <div style="display: flex; align-items: center; justify-content: center">
              <div class="text-subtitle-1">
                {{ fish.zone }}
              </div>
              <div v-if="fish.zone !== fish.fishingSpotName" class="text-subtitle-1 ml-2" :title="fish.fishingSpotId">
                {{ fish.fishingSpotName }}
              </div>
              <div class="text-subtitle-1 ml-2">({{ fish.fishSpotPositionText }})</div>
              <div>
                <click-helper @click.stop="goToFishingSpotAngelPage(fish.anglerLocationId)">
                  <v-btn class="ma-2" text icon :title="$t('list.item.linkHint')">
                    <v-icon>mdi-link-variant</v-icon>
                  </v-btn>
                </click-helper>
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content :color="listItemColor">
            <div>
              <!--              <div style="height: 400px; width: 100%; margin-top: 12px">-->
              <!--                <eorzea-map-->
              <!--                  v-if="open"-->
              <!--                  :debug="false"-->
              <!--                  :id="fish.fishingSpot.map"-->
              <!--                  :x="fish.fishingSpot.x"-->
              <!--                  :y="fish.fishingSpot.y"-->
              <!--                  :size-factor="fish.fishingSpot.size_factor"-->
              <!--                >-->
              <!--                </eorzea-map>-->
              <!--              </div>-->

              <div style="width: 100%" class="d-flex justify-center">
                <div style="width: 100%; max-width: 512px">
                  <eorzea-simple-map
                    :debug="false"
                    :id="fish.fishingSpot.mapFileId"
                    :x="fish.fishingSpot.x"
                    :y="fish.fishingSpot.y"
                    :size-factor="fish.fishingSpot.size_factor"
                    :marker-radius="fish.fishingSpot.radius"
                  />
                </div>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <!--    <v-row style="display: flex; justify-items: center">-->
    <!--            {{ $t(fish.countDownTypeName) }}-->
    <!--    </v-row>-->
    <!--    <v-row v-if="fish.hasCountDown">-->
    <div class="py-3">
      <v-row v-if="fish.countDownType === WAITING">
        <v-progress-linear height="25" :color="fishingColor">
          <template>
            <v-tooltip top color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="d-flex align-center">
                  <strong>{{ $t(fish.countDownTypeName) }} {{ fish.countDownTimeText }}</strong>
                </div>
              </template>
              <span>{{ fish.countDownTimePointText }}</span>
            </v-tooltip>
          </template>
        </v-progress-linear>
      </v-row>
      <v-row v-else-if="fish.countDownType === FISHING" style="height: 100%">
        <v-progress-linear :value="fish.countDownRemainPercentage" height="25" rounded :color="fishingColor">
          <template v-slot="{ value }">
            <v-tooltip top color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="d-flex align-center">
                  <lottie-icon v-if="fish.isFishing" :value="bellIcon" height="25" width="25" />
                  <strong
                    >{{ $t(fish.countDownTypeName) }} {{ fish.countDownTimeText }} ({{ Math.ceil(value) }}%)</strong
                  >
                  <div
                    v-if="fish.addBuffSuffix"
                    :title="$t('list.item.countDown.fishShadowHint')"
                    :class="fish.predatorsIcon"
                    style="margin-left: 2px"
                  />
                </div>
              </template>
              <span>{{ fish.countDownTimePointText }}</span>
            </v-tooltip>
          </template>
        </v-progress-linear>
      </v-row>
      <v-row v-else style="height: 100%">
        <v-progress-linear :value="100" height="25" rounded dark :color="fishingColor">
          <template>
            <strong>{{ $t(fish.countDownTypeName) }}</strong>
          </template>
        </v-progress-linear>
      </v-row>
    </div>
    <!--    </v-row>-->
    <v-row>
      <v-col cols="6">
        <div class="d-flex justify-center">天气</div>
        <div class="d-flex justify-center" v-if="fish.hasWeatherConstraint">
          <div style="display: flex">
            <div v-for="weather in fish.previousWeatherSetDetail" :key="weather.name" :title="weather.name">
              <div :class="weather.icon" :title="weather.name" />
            </div>
            <v-icon v-if="fish.previousWeatherSet.length > 0">
              mdi-arrow-right
            </v-icon>
            <div v-for="weather in fish.weatherSetDetail" :key="weather.name" :title="weather.name">
              <div :class="weather.icon" :title="weather.name" />
            </div>
          </div>
        </div>
        <div class="d-flex justify-center" v-else>
          {{ $t('none') }}
        </div>
      </v-col>
      <v-col cols="6">
        <div class="d-flex justify-center">时间</div>
        <div class="d-flex justify-center">
          <div v-if="fish.hasTimeConstraint">{{ fish.startHourText }} - {{ fish.endHourText }}</div>
          <div v-else>
            {{ $t('none') }}
          </div>
        </div>
      </v-col>
      <v-col cols="12">
        <div class="d-flex justify-center">需要状态 | 鱼饵/以小钓大</div>
        <div class="d-flex justify-center align-center">
          <div v-if="fish.hasFishEyes" style="display: flex; align-items: center">
            <div :class="fish.fishEyesIcon" />
            <div class="ml-3">{{ fish.fishEyesText }}</div>
          </div>
          <div v-if="fish.hasPredators">
            <div :class="fish.predatorsIcon" />
          </div>
          <div v-if="fish.hasSnagging">
            <div :class="fish.snaggingIcon" />
          </div>
          <div v-if="!fish.hasFishEyes && !fish.hasPredators && !fish.hasSnagging">
            {{ $t('none') }}
          </div>
          <fish-bait-list :baits="fish.baits" class="ml-3" />
        </div>
      </v-col>
    </v-row>
    <!--        <v-row>-->
    <!--          <fishing-spot-table :value="fish.fishingSpotFish" />-->
    <!--        </v-row>-->

    <v-row v-if="fish.hasCountDown">
      <v-expansion-panels hover flat tile>
        <v-expansion-panel @change="addScrollRefreshCnt">
          <v-expansion-panel-header :color="listItemColor">
            <div style="display: flex; justify-content: center">
              <div>
                <v-icon>mdi-calendar</v-icon>
                {{ $t('countDown.fishWindowBtn') }}
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content :color="listItemColor">
            <v-simple-table :class="listItemColor" dense dark>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">{{ $t('list.item.fishWindowTable.startTime') }}</th>
                    <th class="text-center">{{ $t('list.item.fishWindowTable.interval') }}</th>
                    <th class="text-center">{{ $t('list.item.fishWindowTable.nextInterval') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(fishWindow, index) in fishWindows" :key="index">
                    <td class="text-center">{{ fishWindow.start }}</td>
                    <td class="text-center">{{ fishWindow.interval }}</td>
                    <td class="text-center">{{ fishWindow.nextInterval }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <v-row v-if="fish.hasPredators">
      <v-col>前置鱼</v-col>
    </v-row>
    <v-row v-if="fish.hasPredators">
      <fish-predators :value="fish.predators" />
    </v-row>
  </v-col>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'
import FishPredators from '@/components/FishPredators'
import FishBaitList from '@/components/FishBaitList'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import LottieIcon from '@/components/basic/LottieIcon'
import bellIcon from '@/assets/icon/bell.json'
import FishWindow from '@/utils/FishWindow'
import ClickHelper from '@/components/basic/ClickHelper'

export default {
  name: 'FishListItemContent',
  components: { ClickHelper, LottieIcon, EorzeaSimpleMap, FishBaitList, FishPredators },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    fishTimePart: {
      type: Object,
      default: () => ({}),
    },
    fishWeatherChangePart: {
      type: Object,
      default: () => ({}),
    },

    predators: {
      type: Array,
      default: () => [],
    },
    fishingTypeColor: {
      type: String,
      default: '',
    },
    listItemColor: {
      type: String,

      default: '',
    },
  },
  data: () => ({
    fisher: fisher,
    FISHING: DataUtil.FISHING,
    WAITING: DataUtil.WAITING,
    TUGS: Object.keys(DataUtil.TUG_ICON),
    bellIcon: bellIcon,
  }),
  computed: {
    fish() {
      const fishingSpot = this.getFishingSpot(this.value.location)
      const hasPredators = Object.keys(this.value.predators).length > 0
      return {
        startHourText: DataUtil.formatET(this.value.startHour),
        endHourText: DataUtil.formatET(this.value.endHour),
        hasTimeConstraint: this.value.startHour !== 0 || this.value.endHour !== 24,
        hasCountDown: DataUtil.hasCountDown(this.fishTimePart.countDown),
        hasFishEyes: this.value.fishEyes !== false,
        fishEyesIcon: DataUtil.iconIdToClass(DataUtil.ICON_FISH_EYES),
        fishEyesText: DataUtil.secondsToFishEyesString(this.value.fishEyes),
        fishEyesSeconds: this.value.fishEyes,
        hasPredators: hasPredators,
        predators: this.predators,
        predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
        hasSnagging: this.value.snagging,
        snaggingIcon: DataUtil.iconIdToClass(DataUtil.ICON_SNAGGING),
        zone: this.getZoneName(this.value.location),
        hasFishingSpot: this.value.location != null,
        fishingSpot: fishingSpot,
        fishingSpotName: this.getFishingSpotsName(this.value.location),
        fishSpotPositionText: this.toPositionText(fishingSpot),
        // fishingSpotFish: this.getFishingSpotFish(this.value.location),
        anglerFishId: this.value.anglerFishId,
        anglerLocationId: fishingSpot?.anglerLocationId,
        weatherSet: this.value.weatherSet,
        weatherSetDetail: this.getWeather(this.value.weatherSet),
        hasWeatherConstraint: this.value.previousWeatherSet.length > 0 || this.value.weatherSet.length > 0,
        previousWeatherSet: this.value.previousWeatherSet,
        previousWeatherSetDetail: this.getWeather(this.value.previousWeatherSet),
        countDownType: this.fishTimePart.countDown.type,
        countDownTypeName: DataUtil.getCountDownTypeName(this.fishTimePart.countDown.type),
        countDownTime: this.fishTimePart.countDown.time,
        countDownTimeText: this.printCountDownTime(this.fishTimePart.countDown.time),
        countDownTimePoint: this.fishTimePart.countDown?.timePoint,
        countDownTimePointText: this.$t('countDown.timePointHint', {
          timePoint: DataUtil.formatDateTime(this.fishTimePart.countDown?.timePoint),
        }),
        countDownTotal: this.fishTimePart.countDown.fishWindowTotal,
        countDownRemainPercentage:
          (this.fishTimePart.countDown.time / this.fishTimePart.countDown.fishWindowTotal) * 100,
        isFishing: this.fishTimePart.countDown?.type === DataUtil.FISHING,
        baits: this.getBaits(this.value),
        isCompleted: this.getFishCompleted(this.value._id),
        addBuffSuffix: hasPredators && DataUtil.isAllAvailableFish(this.value),
      }
    },
    fishWindows() {
      let fishWindows = this.fishWeatherChangePart.fishWindows.filter(it => it[1] >= Date.now())
      if (FishWindow.FISH_WINDOW_FORECAST_N > fishWindows.length) {
        console.warn('fish window cnt:', fishWindows.length)
      }
      fishWindows = fishWindows.slice(0, Math.min(FishWindow.FISH_WINDOW_FORECAST_N, fishWindows.length))

      return fishWindows.map((fishWindow, index) => {
        const start = new Date(fishWindow[0])
        const end = new Date(fishWindow[1])
        return {
          startTime: fishWindow[0],
          start: DataUtil.formatDateTime(fishWindow[0]),
          end: end.toLocaleDateString() + ' ' + end.toLocaleTimeString(),
          interval: this.printCountDownTime(end - start),
          nextInterval: index < fishWindows.length - 1 ? this.printCountDownTime(fishWindows[index + 1][0] - end) : '',
        }
      })
    },
    fishingColor() {
      return DataUtil.getColorByStatus(this.fish.isCompleted, this.fish.countDownType)
    },
    ...mapGetters([
      'getWeather',
      'getFishingSpot',
      'getBaits',
      'getFishingSpotFish',
      'getItemName',
      'getZoneName',
      'getFishingSpotsName',
      'getFishCompleted',
    ]),
  },
  methods: {
    printCountDownTime: DataUtil.printCountDownTime,
    goToFishingSpotAngelPage(anglerLocationId) {
      window.open(`https://cn.ff14angler.com/?spot=${anglerLocationId}`)
    },
    toPositionText(fishingSpot) {
      if (fishingSpot == null) return ''
      return `X: ${this.toPosStr(fishingSpot.size_factor, fishingSpot.x)}, Y:${this.toPosStr(
        fishingSpot.size_factor,
        fishingSpot.y
      )}`
    },
    toPosStr(sizeFactor, pos) {
      return DataUtil.pixelToPos(sizeFactor, pos).toFixed(0)
    },
    ...mapMutations(['addScrollRefreshCnt']),
  },
}
</script>

<style scoped></style>
