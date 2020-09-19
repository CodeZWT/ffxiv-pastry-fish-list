<template>
  <v-layout style="flex-direction: column">
    <v-row>
      <v-col>
        <v-row style="display: flex; justify-items: center">
          <v-col>
            <v-row>
              <v-col cols="6">
                {{ $t(fish.countDownTypeName) }}
              </v-col>
              <v-col v-if="fish.hasCountDown" cols="6">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" tile outlined>
                      <v-icon>mdi-calendar</v-icon>
                      {{ $t('countDown.fishWindowBtn') }}
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item v-for="(fishWindow, index) in fishWeatherChangePart.fishWindows" :key="index">
                      <v-list-item-title>
                        {{ fishWindow.map(time => new Date(time).toLocaleTimeString()) }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
            <v-row v-if="fish.hasCountDown">
              <v-col v-if="fish.countDownType === WAITING">
                <v-progress-linear height="25" indeterminate rounded>
                  <template>
                    <strong>{{ fish.countDownTimeText }}</strong>
                  </template>
                </v-progress-linear>
              </v-col>
              <v-col v-else-if="fish.countDownType === FISHING" style="height: 100%">
                <v-progress-linear :value="fish.countDownRemainPercentage" height="25" rounded>
                  <template v-slot="{ value }">
                    <strong>{{ fish.countDownTimeText }} ({{ Math.ceil(value) }}%)</strong>
                  </template>
                </v-progress-linear>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-row>天气</v-row>
            <v-row v-if="fish.hasWeatherConstraint">
              <div style="display: flex">
                <div v-for="weather in fish.previousWeatherSetDetail" :key="weather.name" :title="weather.name">
                  <v-img :src="weather.icon" :alt="weather.name" width="32" height="32"></v-img>
                </div>
                <v-icon v-if="fish.previousWeatherSet.length > 0">
                  mdi-arrow-right
                </v-icon>
                <div v-for="weather in fish.weatherSetDetail" :key="weather.name" :title="weather.name">
                  <v-img :src="weather.icon" :alt="weather.name" width="32" height="32"></v-img>
                </div>
              </div>
            </v-row>
            <v-row v-else>
              {{ $t('none') }}
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row>时间</v-row>
            <v-row>
              <div v-if="fish.hasTimeConstraint">{{ fish.startHour }} - {{ fish.endHour }}</div>
              <div v-else>
                {{ $t('none') }}
              </div>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row>鱼眼/鱼识/钓组</v-row>
            <v-row>
              <div v-if="fish.hasFishEyes" style="display: flex; align-items: center">
                <v-img :lazy-src="fisher" width="28" height="36" :src="fish.fishEyesIcon" />
                <div class="ml-3">{{ fish.fishEyesText }}</div>
              </div>
              <div v-if="fish.hasPredators">
                <v-img :lazy-src="fisher" width="28" height="36" :src="fish.predatorsIcon" />
              </div>
              <div v-if="fish.hasSnagging">
                <v-img :lazy-src="fisher" width="28" height="36" :src="fish.snaggingIcon" />
              </div>
              <div v-if="!fish.hasFishEyes && !fish.hasPredators && !fish.hasSnagging">
                {{ $t('none') }}
              </div>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col style="display: flex; flex-direction: row; align-items: center">
            <div v-for="(bait, baitInx) in fish.baits" :key="baitInx">
              <div style="display: flex">
                <div v-if="baitInx !== 0" style="display: flex; align-items: center">
                  <v-icon>mdi-arrow-right</v-icon>
                </div>
                <div>
                  <v-img :lazy-src="fisher" :src="bait.baitIcon" width="36" height="36" />
                </div>
                <div>
                  <code>{{ bait.tugIcon }}</code>
                  <v-img :src="bait.hooksetIcon" width="16" height="16" />
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <div style="height: 400px; width: 400px">
          <eorzea-map
            v-if="open"
            :debug="false"
            :id="fish.fishingSpot.map"
            :x="fish.fishingSpot.x"
            :y="fish.fishingSpot.y"
            :size-factor="fish.fishingSpot.size_factor"
          >
          </eorzea-map>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="fish.hasPredators">
      前置鱼
    </v-row>
    <v-row v-for="(predator, index) in fish.predators" :key="predator._id">
      <v-divider v-if="index > 0" />
      <fish-list-brief-header
        :value="predator"
        :fish-time-part="predator.fishTimePart"
        :fish-weather-change-part="predator.fishWeatherChangePart"
      />
    </v-row>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import fisher from '@/assets/fisher.png'
import EorzeaMap from '@/components/EorzeaMap'
import DataUtil from '@/utils/DataUtil'
import FishListBriefHeader from '@/components/FishListBriefHeader'

export default {
  name: 'FishListItemContent',
  components: { FishListBriefHeader, EorzeaMap },
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
      default: () => ({}),
    },
  },
  data: () => ({
    fisher: fisher,
    FISHING: DataUtil.FISHING,
    WAITING: DataUtil.WAITING,
  }),
  computed: {
    fish() {
      return {
        startHour: this.value.startHour,
        endHour: this.value.endHour,
        hasTimeConstraint: this.value.startHour !== 0 || this.value.endHour !== 24,
        hasCountDown: DataUtil.hasCountDown(this.fishTimePart.countDown),
        hasFishEyes: this.value.fishEyes !== false,
        fishEyesIcon: DataUtil.iconIdToUrl(DataUtil.ICON_FISH_EYES),
        fishEyesText: DataUtil.secondsToFishEyesString(this.value.fishEyes),
        fishEyesSeconds: this.value.fishEyes,
        hasPredators: this.predators.length > 0,
        predators: this.predators,
        predatorsIcon: DataUtil.iconIdToUrl(DataUtil.ICON_PREDATORS),
        hasSnagging: this.value.snagging,
        snaggingIcon: DataUtil.iconIdToUrl(DataUtil.ICON_SNAGGING),
        fishingSpot: this.getFishingSpot(this.value.location),
        weatherSet: this.value.weatherSet,
        weatherSetDetail: this.getWeather(this.value.weatherSet),
        hasWeatherConstraint: this.value.previousWeatherSet.length > 0 || this.value.weatherSet.length > 0,
        previousWeatherSet: this.value.previousWeatherSet,
        previousWeatherSetDetail: this.getWeather(this.value.previousWeatherSet),
        countDownType: this.fishTimePart.countDown.type,
        countDownTypeName: DataUtil.getCountDownTypeName(this.fishTimePart.countDown.type),
        countDownTime: this.fishTimePart.countDown.time,
        countDownTimeText: this.printCountDownTime(this.fishTimePart.countDown.time, this.$t),
        countDownTotal: this.fishTimePart.countDown.fishWindowTotal,
        countDownRemainPercentage:
          (this.fishTimePart.countDown.time / this.fishTimePart.countDown.fishWindowTotal) * 100,
        baits: this.getBaits(this.value),
      }
    },
    ...mapGetters(['getWeather', 'getFishingSpot', 'getBaits']),
  },
  methods: {
    // todo add mixin
    printCountDownTime(time) {
      const dict = DataUtil.TIME_UNITS.reduce((dict, unit) => {
        dict[unit] = this.$t(`countDown.unit.${unit}`)
        return dict
      }, {})
      return DataUtil.printCountDownTime(time, dict)
    },
  },
}
</script>

<style scoped></style>