<template>
  <div class="wrapper">
    <v-list>
      <div v-for="(record, index) in records" :key="index">
        <v-divider v-if="index > 0" />
        <v-list-item>
          <v-list-item-content>
            <v-row no-gutters class="d-flex align-center">
              <v-col class="d-flex align-center">
                <item-icon :icon-class="record.fish.icon" small />
                <span>{{ record.fish.name }}</span>
              </v-col>
              <v-col class="d-flex align-center">
                <div v-for="effect in record.effects" :key="effect.ID">
                  <div :class="effect.icon" :title="effect.name" />
                </div>
              </v-col>
              <v-col>
                <v-progress-linear
                  :value="record.biteIntervalPercentage"
                  :color="record.tug.color"
                  height="25"
                >
                  <template>
                    <strong>{{ record.biteInterval }}</strong>
                  </template>
                </v-progress-linear>
              </v-col>
            </v-row>
          </v-list-item-content>
          <item-icon :icon-class="record.bait.icon" small />
        </v-list-item>
      </div>
    </v-list>
    <v-btn
      v-if="remainingCnt > 0"
      block
      color="primary"
      class="rounded-t-0"
      @click="loadingMore"
    >
      {{ $t('loadingMoreWithRemainingCnt', { remainingCnt }) }}
    </v-btn>
  </div>
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
import DataUtil from '@/utils/DataUtil'
import max from 'lodash/max'
import COMMON from 'Data/common'

export default {
  name: 'ReaderHistory',
  components: { ItemIcon },
  props: {
    now: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      loadingCnt: 100,
      rawRecords: [
        {
          startTime: 1613408915525,
          biteTime: 1613408930229,
          fishId: -1,
          hq: false,
          size: 0,
          snagging: false,
          chum: false,
          fishEyes: false,
          surfaceScale: false,
          identicalCast: false,
          collectorGlove: true,
          baitId: 29717,
          mooch: false,
          spotId: 35,
          tug: 'medium',
          id: '5bc06efa-0092-4ee4-8355-4f0b7187fc1c',
        },
        {
          startTime: 1613408576339,
          biteTime: 1613408584958,
          hookset: 'normal',
          fishId: 4776,
          hq: false,
          size: 68,
          snagging: false,
          chum: true,
          fishEyes: false,
          surfaceScale: false,
          identicalCast: false,
          baitId: 29717,
          mooch: false,
          spotId: 35,
          tug: 'light',
          id: '38ab059d-9682-4b95-8c33-a345992fc6cd',
        },
        {
          startTime: 1613407785111,
          biteTime: 1613407808168,
          hookset: 'normal',
          fishId: 4885,
          hq: false,
          size: 350,
          snagging: false,
          chum: false,
          fishEyes: false,
          surfaceScale: false,
          identicalCast: false,
          baitId: 4869,
          mooch: true,
          spotId: 35,
          tug: 'medium',
          id: 'd1aa62f3-0589-4343-a369-7f05b17963bf',
        },
        {
          startTime: 1613407756588,
          biteTime: 1613407773949,
          hookset: 'normal',
          fishId: 4869,
          hq: false,
          size: 74,
          snagging: false,
          chum: false,
          fishEyes: false,
          surfaceScale: true,
          identicalCast: false,
          baitId: 29717,
          mooch: false,
          spotId: 35,
          tug: 'light',
          id: 'cbc797fd-e8db-4abe-90bc-a460c0af41a6',
        },
        {
          startTime: 1613407471456,
          biteTime: 1613407491955,
          hookset: 'normal',
          fishId: 4885,
          hq: false,
          size: 309,
          snagging: false,
          chum: false,
          fishEyes: false,
          surfaceScale: false,
          identicalCast: false,
          baitId: 4874,
          mooch: true,
          spotId: 35,
          tug: 'medium',
          id: '908f9558-04e7-43fa-8ac7-baf99a51b019',
        },
        {
          startTime: 1613407443413,
          biteTime: 1613407454788,
          hookset: 'normal',
          fishId: 4874,
          hq: false,
          size: 97,
          snagging: false,
          chum: false,
          fishEyes: false,
          surfaceScale: false,
          identicalCast: true,
          baitId: 29717,
          mooch: false,
          spotId: 35,
          tug: 'medium',
          id: '98053e0b-25cd-4688-a3db-5f9b58054f3d',
        },
        {
          startTime: 1613407423413,
          biteTime: 1613407434788,
          hookset: 'normal',
          fishId: 4874,
          hq: false,
          size: 97,
          snagging: false,
          chum: false,
          fishEyes: false,
          surfaceScale: false,
          identicalCast: false,
          baitId: 29717,
          mooch: false,
          spotId: 35,
          tug: 'medium',
          id: '98053e0b-25cd-4688-a3db-5f9b58054f3e',
        },
      ],
    }
  },
  computed: {
    remainingCnt() {
      return this.rawRecords.length - this.loadingCnt
    },
    records() {
      const records = this.rawRecords.slice(0, this.loadingCnt).map(record => {
        const biteInterval = +((record.biteTime - record.startTime) / 1000).toFixed(1)
        return {
          ...record,
          biteInterval: biteInterval,
          fish: {
            ...DataUtil.FISH_DATA[record.fishId],
            icon: DataUtil.getItemIconClass(record.fishId),
            name: DataUtil.getItemName(record.fishId),
          },
          bait: {
            id: record.baitId,
            icon: DataUtil.getItemIconClass(record.baitId),
            name: DataUtil.getItemName(record.baitId),
          },
          tug: {
            color: DataUtil.TUG_ICON_COLOR[DataUtil.TUG_ICON[record.tug]],
          },
          effects: Object.values(COMMON.STATUS)
            .filter(status => record[status.key])
            .map(effect => {
              return {
                icon: DataUtil.iconIdToClass(effect.icon),
                name: DataUtil.getName(effect),
              }
            }),
        }
      })

      const maxBiteInterval = max(records.map(it => it.biteInterval))
      let intervalMax = 60
      if (maxBiteInterval != null) {
        const maxBiteIntervalInteger = +maxBiteInterval.toFixed(1).split('.')[0]
        intervalMax = maxBiteIntervalInteger - (maxBiteIntervalInteger % 10) + 10
      }
      return records.map(record => {
        return {
          ...record,
          biteIntervalPercentage: (record.biteInterval / intervalMax) * 100,
        }
      })
    },
  },
  created() {
    window.electron?.ipcRenderer?.on('newRecord', (event, data) => {
      console.log('data', JSON.stringify(data))
      if (this.rawRecords.length > 0 && this.rawRecords[0].id === data.id) {
        this.rawRecords.splice(0, 1, data)
      } else {
        this.rawRecords.splice(0, 0, data)
      }
    })
  },
  methods: {
    loadingMore() {
      this.loadingCnt += 50
    },
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.wrapper
  height: calc(100vh - #{ $top-bars-padding-reader })
  overflow-y: scroll
  padding-left: 6px
</style>
