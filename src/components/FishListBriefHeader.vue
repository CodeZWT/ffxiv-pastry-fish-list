<template>
  <div style="width: 100%">
    <div
      v-if="!inPredator"
      style="position: absolute; top: 10%; bottom: 10%; left: 2px; width: 4px; z-index: 1;border-radius: 2px"
      :class="color"
    />
    <div v-if="showDivider" style="position: absolute; top: 0; width: 100%; height: 2px; z-index: 1" class="tertiary" />

    <!--    <pin-button :value="fish.pinned" @input="setPinned($event)" />-->
    <v-row no-gutters class="d-flex justify-center align-content-center" style="width: 100%">
      <v-col class="col-6 col-sm-3">
        <div class="d-flex fill-height align-center flex-row" style="min-height: 48px">
          <div class="d-flex align-center flex-column flex-sm-row">
            <toggle-button
              :value="fish.pinned"
              @input="setPinned($event)"
              checked-icon="mdi-pin"
              unchecked-icon="mdi-pin-outline"
            />
            <toggle-button :value="fish.completed" @input="setCompleted($event)" />
          </div>
          <div style="width: 40px; height: 40px">
            <v-badge
              v-if="inPredator"
              :content="fish.requiredCnt"
              color="quaternary black--text"
              overlap
              bottom
              bordered
            >
              <div :class="fish.icon" />
            </v-badge>
            <div v-else :class="fish.icon" />
          </div>
          <div class="text-subtitle-1 text-truncate ml-1" :title="fish.id">{{ fish.name }}</div>
        </div>
      </v-col>
      <v-col v-if="!isMobile" class="col-2 d-flex flex-column justify-center my-2 my-sm-0">
        <div class="text-subtitle-2">
          {{ $t(fish.countDownType) }}
        </div>
        <div v-if="fish.hasCountDown" class="d-flex align-center">
          <lottie-icon v-if="fish.isFishing" :value="bellIcon" height="16" width="16" />
          <div class="text-subtitle-2">{{ fish.countDownTimeText }}</div>
          <div
            v-if="fish.addBuffSuffix"
            :title="$t('list.item.countDown.fishShadowHit')"
            :class="fish.predatorsIcon"
            style="margin-left: 2px"
          />
        </div>
      </v-col>
      <v-col class="d-flex flex-column justify-center col-4 col-sm-3">
        <div v-if="mode === 'CONTENT' && inPredator && fish.hasTimeConstraint">
          {{ fish.startHour }} - {{ fish.endHour }}
        </div>
        <div class="d-flex" v-if="mode === 'CONTENT' && inPredator && fish.hasWeatherConstraint">
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

        <div class="text-subtitle-2 text-truncate" v-show="!inPredator">
          {{ fish.zone }}
        </div>
        <div
          v-if="fish.zone !== fish.fishingSpot"
          class="text-subtitle-2 text-truncate"
          :title="fish.fishingSpotId"
          v-show="!inPredator"
        >
          {{ fish.fishingSpot }}
        </div>
        <div v-if="isMobile && !fish.hasCountDown" class="text-subtitle-2">
          {{ $t(fish.countDownType) }}
        </div>
        <div v-else-if="isMobile" class="d-flex align-center">
          <lottie-icon v-if="fish.isFishing" :value="bellIcon" height="16" width="16" />
          <div class="text-subtitle-2">{{ fish.countDownTimeText }}</div>
          <div
            v-if="fish.addBuffSuffix"
            :title="$t('list.item.countDown.fishShadowHit')"
            :class="fish.predatorsIcon"
            style="margin-left: 2px"
          />
        </div>
      </v-col>
      <v-col class="col-12 col-sm-4 d-flex flex-row align-center justify-center justify-sm-start my-2 my-sm-0">
        <div v-if="fish.hasFishEyes || fish.hasPredators || fish.hasSnagging" class="mr-1">
          <div v-if="fish.hasFishEyes" style="display: flex; align-items: center">
            <div :class="fish.fishEyesIcon" />
            <div class="ml-1">{{ fish.fishEyesText }}</div>
          </div>
          <div v-if="fish.hasPredators">
            <div :class="fish.predatorsIcon" />
          </div>
          <div v-if="fish.hasSnagging">
            <div :class="fish.snaggingIcon" />
          </div>
        </div>
        <fish-bait-list :baits="fish.baits" />
      </v-col>
    </v-row>
    <div v-if="fish.hasPredators" class="mt-2">
      <v-divider />
      <fish-predators :value="fish.predators" mode="HEADER" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'
import ToggleButton from '@/components/basic/ToggleButton'
import FishBaitList from '@/components/FishBaitList'
import bellIcon from '@/assets/icon/bell.json'
import LottieIcon from '@/components/basic/LottieIcon'

export default {
  name: 'FishListBriefHeader',
  // to deal with recursive components
  components: { LottieIcon, FishBaitList, ToggleButton, FishPredators: () => import('@/components/FishPredators') },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    fishTimePart: {
      type: Object,
      default: () => ({}),
    },
    predators: {
      type: Array,
      default: () => [],
    },
    inPredator: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
    showDivider: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'CONTENT',
    },
  },
  data: () => ({
    fisher: fisher,
    rootPath: process.env.ASSET_PATH,
    bellIcon: bellIcon,
  }),
  computed: {
    fish() {
      const hasPredators = Object.keys(this.value.predators).length > 0
      return {
        id: this.value._id,
        completed: this.getFishCompleted(this.value._id),
        pinned: this.getFishPinned(this.value._id),
        icon: this.getItemIconClass(this.value._id),
        name: this.getItemName(this.value._id),
        zone: this.getZoneName(this.value.location),
        fishingSpot: this.getFishingSpotsName(this.value.location),
        fishingSpotId: this.value.location,
        baits: this.getBaits(this.value),
        hasFishEyes: this.value.fishEyes !== false,
        fishEyesIcon: DataUtil.iconIdToClass(DataUtil.ICON_FISH_EYES),
        fishEyesText: DataUtil.secondsToFishEyesString(this.value.fishEyes),
        fishEyesSeconds: this.value.fishEyes,
        hasPredators: hasPredators,
        predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
        hasSnagging: this.value.snagging,
        snaggingIcon: DataUtil.iconIdToClass(DataUtil.ICON_SNAGGING),
        countDownType: DataUtil.getCountDownTypeName(this.fishTimePart.countDown?.type),
        countDownTime: this.fishTimePart.countDown?.time,
        countDownTimeText: this.printCountDownTime(this.fishTimePart.countDown?.time),
        hasCountDown: DataUtil.hasCountDown(this.fishTimePart.countDown),
        startHour: this.value.startHour,
        endHour: this.value.endHour,
        hasTimeConstraint: this.value.startHour !== 0 || this.value.endHour !== 24,
        isFishing: this.fishTimePart.countDown?.type === DataUtil.FISHING,
        requiredCnt: this.value.requiredCnt ?? 0,
        predators: this.predators,
        addBuffSuffix: hasPredators && DataUtil.isAllAvailableFish(this.value),
        weatherSetDetail: this.getWeather(this.value.weatherSet),
        hasWeatherConstraint: this.value.previousWeatherSet.length > 0 || this.value.weatherSet.length > 0,
        previousWeatherSet: this.value.previousWeatherSet,
        weatherSet: this.value.weatherSet,
        previousWeatherSetDetail: this.getWeather(this.value.previousWeatherSet),
      }
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    ...mapGetters([
      'getWeather',
      'getItemIconClass',
      'getItemName',
      'getZoneName',
      'getFishingSpotsName',
      'getBaits',
      'getFishCompleted',
      'getFishPinned',
    ]),
  },
  methods: {
    printCountDownTime: DataUtil.printCountDownTime,
    setCompleted(completed) {
      this.setFishCompleted({ fishId: this.fish.id, completed })
      this.addScrollRefreshCnt()
    },

    setPinned(pinned) {
      this.setFishPinned({ fishId: this.fish.id, pinned })
      this.addScrollRefreshCnt()
    },
    ...mapMutations(['setFishCompleted', 'setFishPinned', 'addScrollRefreshCnt']),
  },
}
</script>

<style scoped></style>
