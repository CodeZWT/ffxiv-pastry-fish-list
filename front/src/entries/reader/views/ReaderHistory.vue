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
// import TEST from 'Data/test'

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
      rawRecords: [], //TEST.READER_HISTORY_RECORDS,
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
