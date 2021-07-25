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
import _ from 'lodash'
import UploadUtil from '@/utils/UploadUtil'
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'BaitPercentageChart',
  components: { ItemIcon },
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  props: {
    records: {
      type: Array,
      default: () => [],
    },
    fishDict: {
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
  computed: {
    spotId() {
      if (this.records.length > 0) {
        return this.records[0].spot
      } else {
        return -1
      }
    },
    baitOfSpot() {
      console.log('records', this.records)
      const records = this.records
      const baitFishCnt = _(records)
        .chain()
        .filter(({ fish, bait }) => fish > 0 && bait > 0)
        .groupBy(({ bait }) => bait)
        .mapValues(records => {
          return _(records)
            .chain()
            .groupBy(({ fish }) => fish)
            .mapValues(baitRec => baitRec.length)
            .value()
        })
        .value()
      const unknownFishCnt = _(records)
        .chain()
        .filter(({ fish, bait }) => fish === -1 && bait > 0)
        .groupBy(({ bait }) => bait)
        .mapValues(records => {
          return _(records)
            .chain()
            .groupBy(({ tug }) => {
              return this.TUGS[tug]
            })
            .mapValues(baitRec => baitRec.length)
            .value()
        })
        .value()

      const fishIdList = UploadUtil.fishListOfSpot(this.spotId) //.concat(['light', 'medium', 'heavy'])
      const baitFishCntList = Object.entries(baitFishCnt).map(([bait, fishCntDict]) => {
        const tugCntDict = unknownFishCnt[bait] ?? {}
        const totalCnt =
          _.sum(Object.values(fishCntDict)) + _.sum(Object.values(tugCntDict))

        return {
          bait: UploadUtil.toBait(bait),
          fishCntList: fishIdList.map(fishId => {
            const fishInfo =
              this.fishDict[fishId] ??
              this.fishDict[
                Object.keys(this.fishDict).find(id => DataUtil.toItemId(id) === fishId)
              ]
            // console.log(
            //   fishInfo,
            //   fishId,
            //   this.fishDict[fishId],
            //   fishLocationId
            // )
            const cnt = fishCntDict[fishId] ?? 0
            return {
              fish: UploadUtil.toFish(fishId),
              cnt: cnt,
              percentage: (cnt / totalCnt) * 100,
              tugColor: this.tugColor[
                fishInfo?.baits?.[fishInfo?.baits?.length - 1 ?? 0]?.tug
              ],
            }
          }),
          tugCntList: ['light', 'medium', 'heavy'].map(tug => {
            const cnt = tugCntDict[tug] ?? 0
            return {
              tug: tug,
              cnt: cnt,
              percentage: (cnt / totalCnt) * 100,
              tugColor: this.tugColor[tug],
            }
          }),
          totalCnt: totalCnt,
        }
      })

      return {
        fishList: fishIdList.map(fishId => UploadUtil.toFish(fishId)),
        baitFishCntList: _.sortBy(baitFishCntList, ({ bait: { baitId } }) => {
          // console.log(fishIdList, baitId, fishIdList.includes(baitId))
          return baitId * (fishIdList.includes(+baitId) ? 1000000 : 1)
        }),
      }
    },
  },
}
</script>

<style scoped></style>
