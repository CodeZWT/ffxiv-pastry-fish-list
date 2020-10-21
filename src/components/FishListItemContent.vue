<template>
  <v-row no-gutters style="width: 100%">
    <template v-for="component in sortedDetailComponents">
      <v-col
        v-if="component.enabled && (!component.constraint || fish[component.constraint])"
        cols="12"
        class="my-2"
        :key="component.name"
      >
        <component
          v-bind:is="component.name"
          :fish="fish"
          :fish-weather-change-part="fishWeatherChangePart"
          :expanded="component.expanded"
        />
      </v-col>
    </template>
    <!--    <v-col v-if="fish.hasFishingSpot" cols="12" class="my-2">-->
    <!--      <detail-item-map :fish="fish" :expanded="true" />-->
    <!--    </v-col>-->
    <!--    <v-col cols="12" class="my-2">-->
    <!--      <detail-item-countdown-bar :fish="fish" />-->
    <!--    </v-col>-->
    <!--    <v-col cols="12" class="my-2">-->
    <!--      <detail-item-requirements :fish="fish" />-->
    <!--    </v-col>-->

    <!--    <v-col cols="12" class="my-2">-->
    <!--      <detail-item-buff-and-baits :fish="fish" />-->
    <!--    </v-col>-->

    <!--    <v-col v-if="fish.hasCountDown" cols="12" class="my-2">-->
    <!--      <detail-item-fish-window-table :fish="fish" :fish-weather-change-part="fishWeatherChangePart" :expanded="false" />-->
    <!--    </v-col>-->

    <!--    <v-col cols="12" v-if="fish.hasPredators" class="my-2">-->
    <!--      <detail-item-predators :value="fish.predators" />-->
    <!--    </v-col>-->

    <!--        <v-col>-->
    <!--          <fishing-spot-table :value="fish.fishingSpotFish" />-->
    <!--        </v-col>-->
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import DetailItemPredators from '@/components/DetailItemPredators'
import DetailItemMap from '@/components/fish-detail-items/DetailItemMap'
import DetailItemCountdownBar from '@/components/fish-detail-items/DetailItemCountdownBar'
import DetailItemRequirements from '@/components/fish-detail-items/DetailItemRequirements'
import DetailItemBuffAndBaits from '@/components/fish-detail-items/DetailItemBuffAndBaits'
import DetailItemFishWindowTable from '@/components/fish-detail-items/DetailItemFishWindowTable'
import { sortBy } from 'lodash'

export default {
  name: 'FishListItemContent',
  components: {
    DetailItemFishWindowTable,
    DetailItemBuffAndBaits,
    DetailItemRequirements,
    DetailItemCountdownBar,
    DetailItemMap,
    DetailItemPredators,
  },
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
  data: () => ({}),
  computed: {
    fish() {
      const fishingSpot = this.getFishingSpot(this.value.location)
      const hasPredators = Object.keys(this.value.predators).length > 0
      return {
        id: this.value._id,
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
    sortedDetailComponents() {
      return sortBy(this.detailComponents, 'order').map(it => ({
        ...it,
        constraint: DataUtil.DETAIL_ITEM_DISPLAY_CONSTRAINTS[it.name],
      }))
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
      'detailComponents',
    ]),
  },
  methods: {
    printCountDownTime: DataUtil.printCountDownTime,
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
    resize() {
      this.$refs.simpleMap?.resize()
    },
    getName: DataUtil.getName,
  },
}
</script>

<style scoped></style>