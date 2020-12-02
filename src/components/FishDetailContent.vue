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
          :now="component.name === 'DetailItemFishWindowTable' ? now : undefined"
        />
      </v-col>
    </template>
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
import DetailItemTips from '@/components/fish-detail-items/DetailItemTips/DetailItemTips'
import { sortBy } from 'lodash'

export default {
  name: 'FishDetailContent',
  components: {
    DetailItemFishWindowTable,
    DetailItemBuffAndBaits,
    DetailItemRequirements,
    DetailItemCountdownBar,
    DetailItemMap,
    DetailItemPredators,
    DetailItemTips,
  },
  props: {
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
    now: {
      type: Number,
      default: Date.now(),
    },
    forceShowComponents: {
      type: Array,
      default: undefined,
    },
  },
  data: () => ({}),
  computed: {
    fish() {
      // const fishingSpot = this.getFishingSpot(this.value.location)
      const hasPredators = Object.keys(this.value.predators).length > 0
      return {
        id: this.value._id,
        startHourText:
          this.value.startHourText ?? DataUtil.formatET(this.value.startHour),
        endHourText: this.value.endHourText ?? DataUtil.formatET(this.value.endHour),
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
        hasFishingSpot: this.value.locations.length > 0,
        fishingSpots: this.getFishingSpots(this.value.locations),
        // fishingSpot: fishingSpot,
        // fishingSpotName: this.getFishingSpotsName(this.value.location),
        // fishSpotPositionText: this.toPositionText(fishingSpot),

        // fishingSpotFish: this.getFishingSpotFish(this.value.location),
        anglerFishId: this.value.anglerFishId,
        // anglerLocationId: fishingSpot?.anglerLocationId,
        weatherSet: this.value.weatherSet,
        weatherSetDetail: this.getWeather(this.value.weatherSet),
        hasWeatherConstraint:
          this.value.previousWeatherSet.length > 0 || this.value.weatherSet.length > 0,
        previousWeatherSet: this.value.previousWeatherSet,
        previousWeatherSetDetail: this.getWeather(this.value.previousWeatherSet),
        countDownType: this.fishTimePart.countDown.type,
        countDownTypeName: DataUtil.getCountDownTypeName(
          this.fishTimePart.countDown.type
        ),
        countDownTime: this.fishTimePart.countDown.time,
        countDownTimeText: this.printCountDownTime(this.fishTimePart.countDown.time, 2),
        countDownTimePoint: this.fishTimePart.countDown?.timePoint,
        countDownTimePointText: this.$t('countDown.timePointHint', {
          timePoint: DataUtil.formatDateTime(this.fishTimePart.countDown?.timePoint),
        }),
        countDownTotal: this.fishTimePart.countDown.fishWindowTotal,
        countDownRemainPercentage:
          (this.fishTimePart.countDown.time /
            this.fishTimePart.countDown.fishWindowTotal) *
          100,
        isFishing: this.fishTimePart.countDown?.type === DataUtil.FISHING,
        baits: this.getBaits(this.value),
        isCompleted: this.getFishCompleted(this.value._id),
        addBuffSuffix: hasPredators && DataUtil.isAllAvailableFish(this.value),
        hasTips: DataUtil.hasTips(this.value._id),
      }
    },
    sortedDetailComponents() {
      if (this.forceShowComponents) {
        return DataUtil.getDetailComponentSettingTemplate(this.forceShowComponents).map(
          (component, index) => ({
            ...component,
            expanded: true,
            enabled: true,
            order: index,
          })
        )
      } else {
        return sortBy(
          this.detailComponents.filter(component =>
            DataUtil.USER_DEFAULT_DATA.detailArrangement.components.some(
              defaultComp => defaultComp.name === component.name
            )
          ),
          'order'
        ).map(it => ({
          ...it,
          constraint: DataUtil.DETAIL_ITEM_DISPLAY_CONSTRAINTS[it.name],
        }))
      }
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
      'getFishingSpots',
    ]),
  },
  methods: {
    printCountDownTime: DataUtil.printCountDownTime,
    resize() {
      this.$refs.simpleMap?.resize()
    },
    getName: DataUtil.getName,
  },
}
</script>

<style scoped></style>
