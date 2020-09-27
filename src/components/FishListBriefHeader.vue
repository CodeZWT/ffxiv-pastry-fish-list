<template>
  <div style="width: 100%">
    <pin-button :value="fish.pinned" @input="setPinned($event)" />
    <v-row no-gutters class="d-flex justify-center align-content-center" style="width: 100%">
      <v-col class="col-8 col-md-3">
        <div class="d-flex" style="height: 100%; width: 100%; align-items: center; flex-direction: row">
          <div v-if="!inPredator" style="display: flex; align-items: center">
            <toggle-button :value="fish.completed" @input="setCompleted($event)" />
          </div>
          <div v-else style="display: flex; align-items: center; width: 36px; justify-content: center">
            <div class="text-subtitle-1">{{ fish.requiredCnt }}</div>
          </div>
          <div class="mr-1">
            <div :class="fish.icon" />
          </div>
          <div class="text-subtitle-1 text-truncate" :title="fish.id">{{ fish.name }}</div>
        </div>
      </v-col>
      <v-col style="display: flex; flex-direction: column; justify-content: center" class="col-4 col-md-3">
        <div class="text-subtitle-2 text-truncate">
          {{ fish.zone }}
        </div>
        <div v-if="fish.zone !== fish.fishingSpot" class="text-subtitle-2 text-truncate" :title="fish.fishingSpotId">
          {{ fish.fishingSpot }}
        </div>
      </v-col>
      <v-col style="display: flex; flex-direction: row; align-items: center" class="col-8 col-md-4">
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
      <v-col style="display: flex; flex-direction: column; justify-content: center" class="col-2">
        <div class="text-subtitle-2">
          {{ $t(fish.countDownType) }}
        </div>
        <div v-if="fish.hasTimeConstraint" class="text-subtitle-2">
          {{ fish.countDownTimeText }}
        </div>
      </v-col>
    </v-row>
    <div v-if="fish.hasPredators" class="mt-2">
      <v-divider />
      <fish-predators :value="fish.predators" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'

import ToggleButton from '@/components/basic/ToggleButton'
import PinButton from '@/components/basic/PinButton'
import FishBaitList from '@/components/FishBaitList'

export default {
  name: 'FishListBriefHeader',
  // to deal with recursive components
  components: { FishBaitList, PinButton, ToggleButton, FishPredators: () => import('@/components/FishPredators') },
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
  },
  data: () => ({
    fisher: fisher,
  }),
  computed: {
    fish() {
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
        hasPredators: Object.keys(this.value.predators).length > 0,
        predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
        hasSnagging: this.value.snagging,
        snaggingIcon: DataUtil.iconIdToClass(DataUtil.ICON_SNAGGING),
        countDownType: DataUtil.getCountDownTypeName(this.fishTimePart.countDown?.type),
        countDownTime: this.fishTimePart.countDown?.time,
        countDownTimeText: this.printCountDownTime(this.fishTimePart.countDown?.time),
        hasTimeConstraint: DataUtil.hasCountDown(this.fishTimePart.countDown),
        requiredCnt: this.value.requiredCnt ?? 0,
        predators: this.predators,
      }
    },
    ...mapGetters([
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
    },

    setPinned(pinned) {
      this.setFishPinned({ fishId: this.fish.id, pinned })
    },
    ...mapMutations(['setFishCompleted', 'setFishPinned']),
  },
}
</script>

<style scoped></style>
