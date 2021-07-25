<template>
  <v-row style="width: 100%">
    <v-col cols="12">
      <v-subheader>※ 杆型下方的百分比为未提竿或脱钩数据的占比</v-subheader>
    </v-col>
    <v-col cols="12">
      <div class="d-flex flex-column align-center">
        <div class="d-flex">
          <div style="width: 48px"></div>
          <div v-for="fish in baitOfSpot.fishList" :key="fish.fishId">
            <item-icon :icon-class="fish.fishIcon" />
          </div>
          <div
            v-for="tug in TUGS"
            :key="tug"
            style="width: 48px"
            class="d-flex align-center justify-center"
          >
            <v-avatar :color="tugColor[tug]" size="40">
              <span class="text-h6">{{ $t('tugShort.' + tug) }}</span>
            </v-avatar>
          </div>
        </div>
        <div
          v-for="{
            bait,
            fishCntList,
            tugCntList,
            totalCnt,
          } in baitOfSpot.baitFishCntList"
          :key="bait.baitId"
          class="d-flex"
        >
          <item-icon
            :icon-class="bait.baitIcon"
            :title="bait.baitName + '#' + bait.baitId"
          />
          <div
            v-for="{ fish, cnt, percentage, tugColor } in fishCntList"
            :key="bait.baitId + '-' + fish.fishId"
          >
            <div
              v-if="cnt > 0"
              style="position: relative"
              :title="percentage.toFixed(2) + '% [' + cnt + '/' + totalCnt + ']'"
            >
              <item-icon :icon-class="fish.fishIcon" style="opacity: 0.5" />
              <v-progress-circular
                :value="percentage"
                rotate="-90"
                style="position: absolute; top: 6px; left: 8px"
                :color="`${tugColor} ${theme.isDark ? 'lighten-2' : 'darken-1'}`"
              >
                <div :style="percentage === 100 ? 'font-size: x-small' : ''">
                  {{ percentage.toFixed(0) }}
                </div>
              </v-progress-circular>
            </div>
            <div v-else style="width: 48px"></div>
          </div>

          <div
            v-for="{ tug, cnt, percentage, tugColor } in tugCntList"
            :key="bait.baitId + '-' + tug"
          >
            <div
              v-if="cnt > 0"
              style="position: relative; width: 48px"
              :title="percentage.toFixed(2) + '% [' + cnt + '/' + totalCnt + ']'"
            >
              <v-progress-circular
                :value="percentage"
                rotate="-90"
                style="position: absolute; top: 6px; left: 8px"
                :color="tugColor + ' lighten-2'"
              >
                <div :style="percentage === 100 ? 'font-size: x-small' : ''">
                  {{ percentage.toFixed(0) }}
                </div>
              </v-progress-circular>
            </div>
            <div v-else style="width: 48px"></div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
import Constants from 'Data/constants'
export default {
  name: 'BaitPercentageChart',
  components: { ItemIcon },
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  props: {
    baitOfSpot: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      TUGS: Constants.TUGS,
      tugColor: Constants.TUG_COLOR,
    }
  },
}
</script>

<style scoped></style>
