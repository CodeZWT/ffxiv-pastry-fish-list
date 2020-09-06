<template>
  <div class="d-flex justify-center align-content-center">
    <v-col cols="2">
      <div class="d-flex" style="height: 100%; width: 100%; align-items: center; flex-direction: row">
        <div class="mr-1">
          <v-img :lazy-src="fisher" width="40" height="40" :src="fish.icon" />
        </div>
        <div class="text-subtitle-1" :title="fish.id">{{ fish.name }}</div>
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
    <v-col cols="5" style="display: flex; flex-direction: row; align-items: center">
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
    <v-col cols="2" style="display: flex; flex-direction: column; justify-items: center">
      <div>
        {{ $t(fish.countDownType) }}
      </div>
      <div v-if="fish.hasTimeConstraint">
        {{ fish.countDownTimeText }}
      </div>
    </v-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'FishListBriefHeader',
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
  },
  data: () => ({
    weatherChangeTrigger: 0,
    fisher: fisher,
  }),
  computed: {
    fish() {
      return {
        id: this.value.id,
        icon: this.getItemIconUrl(this.value._id),
        name: this.getItemName(this.value._id),
        zone: this.getZoneName(this.value.location),
        fishingSpot: this.getFishingSpotsName(this.value.location),
        fishingSpotId: this.value.location,
        baits: this.getBaits(this.value),
        countDownType: DataUtil.getCountDownTypeName(this.fishTimePart.countDown.type),
        countDownTime: this.fishTimePart.countDown.time,
        countDownTimeText: this.printCountDownTime(this.fishTimePart.countDown.time, this.$t),
        hasTimeConstraint: DataUtil.hasTimeConstraint(this.fishTimePart.countDown),
      }
    },
    ...mapGetters(['getItemIconUrl', 'getItemName', 'getZoneName', 'getFishingSpotsName', 'getBaits']),
  },
  methods: {
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
