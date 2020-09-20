<template>
  <v-layout column>
    <div class="d-flex justify-center align-content-center" style="width: 100%">
      <v-col cols="2">
        <div class="d-flex" style="height: 100%; width: 100%; align-items: center; flex-direction: row">
          <toggle-button :value="fish.completed" @input="setCompleted($event)" />
          <toggle-button
            :value="fish.pinned"
            checked-icon="mdi-pin"
            unchecked-icon="mdi-pin-outline"
            @input="setPinned($event)"
          />
          <div v-if="fish.requiredCnt" class="text-subtitle-1 mr-1">{{ fish.requiredCnt }}</div>
          <div class="mr-1">
            <v-img :lazy-src="fisher" width="40" height="40" :src="fish.icon" />
          </div>
          <!--   TODO implement a link component for fish     -->
          <!--        <a target="_blank" rel="noopener noreferrer" :href="`https://cn.ff14angler.com/?search=${fish.name}`">-->
          <div class="text-subtitle-1" :title="fish.id">{{ fish.name }}</div>
          <!--        </a>-->
        </div>
      </v-col>
      <v-col cols="3" style="display: flex; flex-direction: column; justify-items: center">
        <div class="text-subtitle-2">
          {{ fish.zone }}
        </div>
        <div v-if="fish.zone !== fish.fishingSpot" class="text-subtitle-2" :title="fish.fishingSpotId">
          {{ fish.fishingSpot }}
        </div>
      </v-col>
      <v-col cols="4" style="display: flex; flex-direction: row; align-items: center">
        <div v-for="(bait, baitInx) in fish.baits" :key="baitInx">
          <div style="display: flex">
            <div v-if="baitInx !== 0" style="display: flex; align-items: center">
              <v-icon>mdi-arrow-right</v-icon>
            </div>
            <div>
              <v-img :lazy-src="fisher" :src="bait.baitIcon" width="36" height="36" :title="bait.baitName" />
            </div>
            <div>
              <code>{{ bait.tugIcon }}</code>
              <v-img :src="bait.hooksetIcon" width="16" height="16" />
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="1">
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
      <v-col cols="2" style="display: flex; flex-direction: column; justify-content: center">
        <div>
          {{ $t(fish.countDownType) }}
        </div>
        <div v-if="fish.hasTimeConstraint">
          {{ fish.countDownTimeText }}
        </div>
      </v-col>
    </div>
    <div>
      <fish-predators :value="fish.predators" />
    </div>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'

import ToggleButton from '@/components/basic/ToggleButton'

export default {
  name: 'FishListBriefHeader',
  // to deal with recursive components
  components: { ToggleButton, FishPredators: () => import('@/components/FishPredators') },
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
  },
  data: () => ({
    weatherChangeTrigger: 0,
    fisher: fisher,
  }),
  computed: {
    fish() {
      return {
        id: this.value._id,
        completed: this.getFishCompleted(this.value._id),
        pinned: this.getFishPinned(this.value._id),
        icon: this.getItemIconUrl(this.value._id),
        name: this.getItemName(this.value._id),
        zone: this.getZoneName(this.value.location),
        fishingSpot: this.getFishingSpotsName(this.value.location),
        fishingSpotId: this.value.location,
        baits: this.getBaits(this.value),
        hasFishEyes: this.value.fishEyes !== false,
        fishEyesIcon: DataUtil.iconIdToUrl(DataUtil.ICON_FISH_EYES),
        fishEyesText: DataUtil.secondsToFishEyesString(this.value.fishEyes),
        fishEyesSeconds: this.value.fishEyes,
        hasPredators: Object.keys(this.value.predators).length > 0,
        predatorsIcon: DataUtil.iconIdToUrl(DataUtil.ICON_PREDATORS),
        hasSnagging: this.value.snagging,
        snaggingIcon: DataUtil.iconIdToUrl(DataUtil.ICON_SNAGGING),
        countDownType: DataUtil.getCountDownTypeName(this.fishTimePart.countDown?.type),
        countDownTime: this.fishTimePart.countDown?.time,
        countDownTimeText: this.printCountDownTime(this.fishTimePart.countDown?.time),
        hasTimeConstraint: DataUtil.hasCountDown(this.fishTimePart.countDown),
        requiredCnt: this.value.requiredCnt ?? 0,
        predators: this.predators,
      }
    },
    ...mapGetters([
      'getItemIconUrl',
      'getItemName',
      'getZoneName',
      'getFishingSpotsName',
      'getBaits',
      'getFishCompleted',
      'getFishPinned',
    ]),
  },
  methods: {
    printCountDownTime(time) {
      const dict = DataUtil.TIME_UNITS.reduce((dict, unit) => {
        dict[unit] = this.$t(`countDown.unit.${unit}`)
        return dict
      }, {})
      return DataUtil.printCountDownTime(time, dict)
    },
    setCompleted(completed) {
      this.setFishCompleted({ fishId: this.fish.id, completed })
    },

    setPinned(pinned) {
      this.setFishPinned({ fishId: this.fish.id, pinned })
    },
    ...mapMutations(['setFishCompleted', 'setFishPinned']),
  },
}
</script>

<style scoped></style>
