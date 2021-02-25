<template>
  <div class="wrapper">
    <v-row no-gutters>
      <v-col class="d-flex align-center">
        <div class="mr-2">显示未提钩记录</div>
        <v-switch v-model="showIgnoredRecord" inset />
      </v-col>
      <v-col class="d-flex align-center">
        <div class="mr-2">显示耐心状态</div>
        <v-switch v-model="showPatient" inset />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col class="d-flex align-center">
        <div class="mr-2">显示获得力&鉴别力</div>
        <v-switch v-model="showPlayerStatus" inset />
      </v-col>
      <v-col class="d-flex align-center">
        <div class="mr-2">显示提钩类别</div>
        <v-switch v-model="showHookset" inset />
      </v-col>
    </v-row>
    <v-list v-if="records.length > 0">
      <div v-for="(record, index) in records" :key="index">
        <v-divider v-if="index > 0" />
        <v-list-item>
          <v-list-item-content>
            <v-row no-gutters class="d-flex align-center">
              <v-col cols="5" class="d-flex align-center">
                <item-icon :icon-class="record.fish.icon" small />
                <div>
                  <span v-if="record.missed">{{ '脱钩' }}</span>
                  <span v-else-if="record.cancelled">{{ '未提钩' }}</span>
                  <span v-else>
                    {{ record.fish.name || '未提钩' }}
                    <i class="xiv hq" v-if="record.hq"></i>
                  </span>
                  <div
                    v-if="showPlayerStatus"
                    class="text-subtitle-2"
                    title="获得力/鉴别力"
                  >
                    {{ record.playerStatus.text }}
                  </div>
                </div>
              </v-col>
              <v-col cols="3" class="d-flex align-center flex-wrap">
                <div v-for="effect in record.effects" :key="effect.ID">
                  <div :class="effect.icon" :title="effect.name" />
                </div>
              </v-col>
              <v-col cols="4">
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
          <item-icon
            v-if="showHookset"
            :icon-class="record.hookset.icon"
            small
            type="action"
          />
          <item-icon :icon-class="record.bait.icon" small />
        </v-list-item>
      </div>
    </v-list>
    <div v-else class="text-center">
      没有历史记录
    </div>
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
import db from '@/plugins/db'
import capitalize from 'lodash/capitalize'
// import TEST from 'Data/test'

const INITIAL_LOADING_CNT = 100
const LOAD_MORE_CNT = 100

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
      loadingCnt: INITIAL_LOADING_CNT,
      rawRecords: [], //TEST.READER_HISTORY_RECORDS,
      dbRecordsCnt: 0,
      dbLoadedCnt: 0,
      showIgnoredRecord: true,
      showPatient: false,
      showPlayerStatus: false,
      showHookset: false,
    }
  },
  computed: {
    remainingCnt() {
      return this.dbRecordsCnt - this.loadingCnt
    },
    records() {
      const records = this.rawRecords.slice(0, this.loadingCnt).map(record => {
        const biteInterval = +((record.biteTime - record.startTime) / 1000).toFixed(1)
        return {
          ...record,
          biteInterval: biteInterval,
          fish: {
            ...DataUtil.FISH_DATA[record.fishId],
            icon: record.missed
              ? 'bg-060034'
              : record.cancelled
              ? 'bg-060027'
              : DataUtil.getItemIconClass(record.fishId, 60027),
            name: DataUtil.getItemName(record.fishId),
          },
          bait: {
            id: record.baitId,
            icon: DataUtil.getItemIconClass(record.baitId, 60051),
            name: DataUtil.getItemName(record.baitId),
          },
          tug: {
            color: DataUtil.TUG_ICON_COLOR[DataUtil.TUG_ICON[record.tug]],
          },
          hookset: {
            icon: DataUtil.iconIdToClass(
              DataUtil.HOOKSET_ICON[capitalize(record.hookset)]
            ),
          },
          effects: Object.values(COMMON.STATUS)
            .filter(status => record[status.key])
            .filter(
              status =>
                this.showPatient ||
                !['gatheringFortuneUp', 'catchAndRelease'].includes(status.key)
            )
            .map(effect => {
              return {
                icon: DataUtil.iconIdToClass(effect.icon),
                name: DataUtil.getName(effect),
              }
            }),
          playerStatus: {
            text: record.gathering ? `${record.gathering}/${record.perception}` : '',
          },
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
  watch: {
    showIgnoredRecord(showIgnoredRecord) {
      this.loadRecord(0, this.loadingCnt, showIgnoredRecord).then(data => {
        this.rawRecords = data
      })
    },
  },
  async created() {
    this.dbRecordsCnt = await db.records.count()
    this.rawRecords = await this.loadRecord(0, this.loadingCnt, this.showIgnoredRecord)
    this.dbLoadedCnt = this.rawRecords.length
    console.debug('Records Total', this.dbRecordsCnt, 'Loaded', this.dbLoadedCnt)

    window.electron?.ipcRenderer?.on('newRecord', (event, data) => {
      // console.log('data', JSON.stringify(data))
      if (this.rawRecords.length > 0 && this.rawRecords[0].id === data.id) {
        this.rawRecords.splice(0, 1, data)
      } else {
        this.rawRecords.splice(0, 0, data)
        this.dbLoadedCnt++
        this.dbRecordsCnt++
        console.debug('Records Total', this.dbRecordsCnt, 'Loaded', this.dbLoadedCnt)
      }
    })
  },
  methods: {
    async loadRecord(offset, limit, showIgnoredRecord) {
      let table = db.records.orderBy('startTime').reverse()
      if (!showIgnoredRecord) {
        table = table.filter(record => record.fishId !== -1 || record.missed === true)
      }
      return table
        .offset(offset)
        .limit(limit)
        .toArray()
    },
    async loadingMore() {
      this.loadingCnt += LOAD_MORE_CNT
      if (this.loadingCnt > this.dbLoadedCnt && this.dbLoadedCnt < this.dbRecordsCnt) {
        const newLoadedRecords = await this.loadRecord(
          this.dbLoadedCnt,
          LOAD_MORE_CNT,
          this.showIgnoredRecord
        )
        console.log('newLoadedRecords', newLoadedRecords)
        this.dbLoadedCnt += newLoadedRecords.length
        this.rawRecords = this.rawRecords.concat(newLoadedRecords)
      }
    },
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.wrapper
  height: calc(100vh - #{ $top-bars-padding-reader })
  overflow-y: scroll
  overflow-x: hidden
  padding-left: 6px
</style>
