<template>
  <div class="d-flex justify-center align-content-center">
    <v-col cols="2">
      <div class="d-flex" style="height: 100%; width: 100%; align-items: center; flex-direction: row">
        <div class="mr-1">
          <v-img :lazy-src="fisher" width="40" height="40" :src="aggregatedFishInfo.icon" />
        </div>
        <div class="text-subtitle-1" :title="aggregatedFishInfo.id">{{ aggregatedFishInfo.name }}</div>
      </div>
    </v-col>
    <v-col cols="2" style="display: flex; flex-direction: column; justify-items: center">
      <div class="text-subtitle-2">
        {{ aggregatedFishInfo.zone }}
      </div>
      <div
        v-if="aggregatedFishInfo.zone !== aggregatedFishInfo.fishingSpot"
        class="text-subtitle-2"
        :title="aggregatedFishInfo.fishingSpotId"
      >
        {{ aggregatedFishInfo.fishingSpot }}
      </div>
    </v-col>
    <v-col>
      <v-list-item-subtitle>
        <div style="display: flex">
          <div v-for="(bait, baitInx) in aggregatedFishInfo.baits" :key="baitInx">
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
        </div>
      </v-list-item-subtitle>
    </v-col>
    <v-col>
      <v-list-item-subtitle>
        {{ $t(aggregatedFishInfo.countDownType) }}
      </v-list-item-subtitle>
      <v-list-item-subtitle v-if="aggregatedFishInfo.hasTimeConstraint">
        {{ aggregatedFishInfo.countDownTimeText }}
      </v-list-item-subtitle>
    </v-col>
  </div>
</template>

<script>
import prettyMilliseconds from 'pretty-ms'
import { mapGetters } from 'vuex'
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'FishListBriefHeader',
  props: {
    fish: {
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
    aggregatedFishInfo() {
      return {
        id: this.fish.id,
        icon: this.getItemIconUrl(this.fish._id),
        name: this.getItemName(this.fish._id),
        zone: this.getZoneName(this.fish.location),
        fishingSpot: this.getFishingSpotsName(this.fish.location),
        fishingSpotId: this.fish.location,
        baits: this.getBaits(this.fish),
        countDownType: DataUtil.getCountDownTypeName(this.fishTimePart.countDown.type),
        countDownTime: this.fishTimePart.countDown.time,
        countDownTimeText: this.printCountDownTime(this.fishTimePart.countDown.time),
        hasTimeConstraint: DataUtil.hasTimeConstraint(this.fishTimePart.countDown),
      }
    },
    ...mapGetters(['getItemIconUrl', 'getItemName', 'getZoneName', 'getFishingSpotsName', 'getBaits']),
  },
  methods: {
    printCountDownTime(time) {
      if (time != null) {
        return prettyMilliseconds(time, {
          verbose: true,
          unitCount: 2,
          secondsDecimalDigits: 0,
        })
          .split(' ')
          .map(it => {
            if (isNaN(it)) {
              return this.$t(`fishWindow.${it}`)
            } else return it
          })
          .join('')
      } else {
        return ''
      }
    },
  },
}
</script>

<style scoped></style>
