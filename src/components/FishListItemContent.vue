<template>
  <v-col style="flex-direction: column">
    <v-row>
      <v-expansion-panels hover flat :value="0">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div style="display: flex; align-items: center; justify-content: center">
              <div class="text-subtitle-1">
                {{ fish.zone }}
              </div>
              <div v-if="fish.zone !== fish.fishingSpot" class="text-subtitle-1 ml-2" :title="fish.fishingSpotId">
                {{ fish.fishingSpotName }}
              </div>
              <div class="text-subtitle-1 ml-2">({{ fish.fishSpotPositionText }})</div>
              <div>
                <v-btn class="ma-2" text icon x-small @click.stop="goToFishingSpotAngelPage(fish.anglerLocationId)">
                  <v-icon x-small>mdi-link-variant</v-icon>
                </v-btn>
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
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

              <div style="height: 1000px; width: 100%; margin-top: 12px">
                <eorzea-simple-map
                  :debug="false"
                  :id="fish.fishingSpot.mapFileId"
                  :x="fish.fishingSpot.x"
                  :y="fish.fishingSpot.y"
                  :size-factor="fish.fishingSpot.size_factor"
                  :marker-radius="fish.fishingSpot.radius"
                >
                </eorzea-simple-map>
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
        <v-progress-linear height="25">
          <template>
            <strong>{{ $t(fish.countDownTypeName) }} {{ fish.countDownTimeText }}</strong>
          </template>
        </v-progress-linear>
      </v-row>
      <v-row v-else-if="fish.countDownType === FISHING" style="height: 100%">
        <v-progress-linear :value="fish.countDownRemainPercentage" height="25" rounded>
          <template v-slot="{ value }">
            <strong>{{ $t(fish.countDownTypeName) }} {{ fish.countDownTimeText }} ({{ Math.ceil(value) }}%)</strong>
          </template>
        </v-progress-linear>
      </v-row>
      <v-row v-else style="height: 100%">
        <v-progress-linear :value="100" height="25" rounded dark color="success">
          <template>
            <strong>{{ $t(fish.countDownTypeName) }}</strong>
          </template>
        </v-progress-linear>
      </v-row>
    </div>
    <!--    </v-row>-->
    <v-row v-if="fish.hasCountDown">
      <v-expansion-panels hover flat>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div style="display: flex; justify-content: center">
              <div><v-icon>mdi-calendar</v-icon> {{ $t('countDown.fishWindowBtn') }}</div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">开始时间</th>
                    <th class="text-center">时长</th>
                    <th class="text-center">距下个窗口期</th>
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
    <v-row>
      <v-col cols="4">
        <v-row class="justify-center">天气</v-row>
        <v-row class="justify-center" v-if="fish.hasWeatherConstraint">
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
        </v-row>
        <v-row class="justify-center" v-else>
          {{ $t('none') }}
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row class="justify-center">时间</v-row>
        <v-row class="justify-center">
          <div v-if="fish.hasTimeConstraint">{{ fish.startHour }} - {{ fish.endHour }}</div>
          <div v-else>
            {{ $t('none') }}
          </div>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row class="justify-center">鱼眼/鱼识/钓组</v-row>
        <v-row class="justify-center">
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
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <fish-bait-list :baits="fish.baits" />
      </v-col>
    </v-row>
    <!--        <v-row>-->
    <!--          <fishing-spot-table :value="fish.fishingSpotFish" />-->
    <!--        </v-row>-->

    <v-row v-if="fish.hasPredators">
      前置鱼
    </v-row>
    <v-row v-if="fish.hasPredators" class="mt-2">
      <fish-predators :value="fish.predators" />
    </v-row>
  </v-col>
</template>

<script>
import { mapGetters } from 'vuex'
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'
import FishPredators from '@/components/FishPredators'
import FishBaitList from '@/components/FishBaitList'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'

export default {
  name: 'FishListItemContent',
  components: { EorzeaSimpleMap, FishBaitList, FishPredators },
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
  },
  data: () => ({
    fisher: fisher,
    FISHING: DataUtil.FISHING,
    WAITING: DataUtil.WAITING,
    TUGS: Object.keys(DataUtil.TUG_ICON),
  }),
  computed: {
    fish() {
      const fishingSpot = this.getFishingSpot(this.value.location)
      return {
        startHour: this.value.startHour,
        endHour: this.value.endHour,
        hasTimeConstraint: this.value.startHour !== 0 || this.value.endHour !== 24,
        hasCountDown: DataUtil.hasCountDown(this.fishTimePart.countDown),
        hasFishEyes: this.value.fishEyes !== false,
        fishEyesIcon: DataUtil.iconIdToClass(DataUtil.ICON_FISH_EYES),
        fishEyesText: DataUtil.secondsToFishEyesString(this.value.fishEyes),
        fishEyesSeconds: this.value.fishEyes,
        hasPredators: this.predators.length > 0,
        predators: this.predators,
        predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
        hasSnagging: this.value.snagging,
        snaggingIcon: DataUtil.iconIdToClass(DataUtil.ICON_SNAGGING),
        zone: this.getZoneName(this.value.location),
        fishingSpot: fishingSpot,
        fishingSpotName: this.getFishingSpotsName(this.value.location),
        fishSpotPositionText: this.toPositionText(fishingSpot),
        fishingSpotFish: this.getFishingSpotFish(this.value.location),
        anglerFishId: this.value.anglerFishId,
        anglerLocationId: this.getFishingSpot(this.value.location).anglerLocationId,
        weatherSet: this.value.weatherSet,
        weatherSetDetail: this.getWeather(this.value.weatherSet),
        hasWeatherConstraint: this.value.previousWeatherSet.length > 0 || this.value.weatherSet.length > 0,
        previousWeatherSet: this.value.previousWeatherSet,
        previousWeatherSetDetail: this.getWeather(this.value.previousWeatherSet),
        countDownType: this.fishTimePart.countDown.type,
        countDownTypeName: DataUtil.getCountDownTypeName(this.fishTimePart.countDown.type),
        countDownTime: this.fishTimePart.countDown.time,
        countDownTimeText: this.printCountDownTime(this.fishTimePart.countDown.time),
        countDownTotal: this.fishTimePart.countDown.fishWindowTotal,
        countDownRemainPercentage:
          (this.fishTimePart.countDown.time / this.fishTimePart.countDown.fishWindowTotal) * 100,
        baits: this.getBaits(this.value),
      }
    },
    fishWindows() {
      return this.fishWeatherChangePart.fishWindows.map((fishWindow, index) => {
        const start = new Date(fishWindow[0])
        const end = new Date(fishWindow[1])
        return {
          start: start.toLocaleDateString() + ' ' + start.toLocaleTimeString(),
          end: end.toLocaleDateString() + ' ' + end.toLocaleTimeString(),
          interval: this.printCountDownTime(end - start),
          nextInterval:
            index < this.fishWeatherChangePart.fishWindows.length - 1
              ? this.printCountDownTime(this.fishWeatherChangePart.fishWindows[index + 1][0] - end)
              : '',
        }
      })
    },
    ...mapGetters([
      'getWeather',
      'getFishingSpot',
      'getBaits',
      'getFishingSpotFish',
      'getItemName',
      'getZoneName',
      'getFishingSpotsName',
    ]),
  },
  methods: {
    printCountDownTime: DataUtil.printCountDownTime,
    goToFishingSpotAngelPage(anglerLocationId) {
      window.open(`https://cn.ff14angler.com/?spot=${anglerLocationId}`)
    },
    toPositionText(fishingSpot) {
      return `${this.toPosStr(fishingSpot.size_factor, fishingSpot.x)} ,${this.toPosStr(
        fishingSpot.size_factor,
        fishingSpot.y
      )}`
    },
    toPosStr(sizeFactor, pos) {
      return DataUtil.pixelToPos(sizeFactor, pos).toFixed(2)
    },
  },
}
</script>

<style scoped></style>