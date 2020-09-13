<template>
  <v-layout>
    <v-row>
      <v-col>
        <v-row style="display: flex; justify-items: center">
          <div>
            {{ $t(fish.countDownType) }}
          </div>
          <div v-if="fish.hasTimeConstraint">
            {{ fish.countDownTimeText }}
          </div>
        </v-row>
        <v-row
          v-if="fish.hasTimeConstraint"
        >
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-calendar</v-icon>
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
        </v-row>
        <v-row>
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
        <v-row>
          <div>{{ fish.startHour }} - {{ fish.endHour }}</div>
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
            :hierarchy="fish.fishingSpot.hierarchy"
          >
          </eorzea-map>
        </div>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import fisher from '@/assets/fisher.png'
import EorzeaMap from '@/components/EorzeaMap'
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'FishListItemContent',
  components: { EorzeaMap },
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
  },
  data: () => ({
    fisher: fisher,
  }),
  computed: {
    fish() {
      return {
        startHour: this.value.startHour,
        endHour: this.value.endHour,
        hasTimeConstraint: DataUtil.hasTimeConstraint(this.fishTimePart.countDown),
        fishingSpot: this.getFishingSpot(this.value.location),
        weatherSet: this.value.weatherSet,
        weatherSetDetail: this.getWeather(this.value.weatherSet),
        previousWeatherSet: this.value.previousWeatherSet,
        previousWeatherSetDetail: this.getWeather(this.value.previousWeatherSet),
        countDownType: DataUtil.getCountDownTypeName(this.fishTimePart.countDown.type),
        countDownTime: this.fishTimePart.countDown.time,
        countDownTimeText: this.printCountDownTime(this.fishTimePart.countDown.time, this.$t),
      }
    },
    ...mapGetters(['getWeather', 'getFishingSpot']),
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
