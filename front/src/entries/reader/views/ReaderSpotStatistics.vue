<template>
  <v-card>
    <v-card-title> {{ fishingSpot.name }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-select
            v-model="currentChumForGraph"
            :items="chumOptions"
            item-text="name"
            item-value="value"
            label="数据类别"
          >
          </v-select>
        </v-col>
        <v-col cols="12">
          <div v-if="dataForChart.length === 0">暂无数据，请在钓场抛竿后查看</div>
          <div v-else>
            <v-slider
              :value="timer"
              :max="rangeMax"
              min="0"
              ticks="always"
              tick-size="4"
              step="1"
              :tick-labels="labels"
              disabled
            ></v-slider>
            <fish-timeline-table
              :pointer="interval"
              :timelines="dataForChart"
              :max="rangeMax"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import FishTimelineTable from '@/entries/reader/components/FishTimelineTable'
import STATUS from 'Data/patch/status'
import placeNames from 'Data/locale/placeNames'

export default {
  name: 'ReaderSpotStatistics',
  components: { FishTimelineTable },
  data() {
    return {
      now: Date.now(),
      dataStatus: {}, // spotId: 35
      dataCurrentRecord: {},
      currentChumForGraph: 'normal',
      chumOptions: [
        { name: '普通', value: 'normal' },
        { name: '撒饵', value: 'chum' },
      ],
      rawRecords: [],
    }
  },
  computed: {
    labels() {
      const labels = []
      for (let i = 0; i <= 60; i++) {
        labels.push(i % 5 === 0 ? i + '' : '')
      }
      return labels
    },
    interval() {
      const startTime = this.dataCurrentRecord?.startTime ?? this.now
      const biteTime = this.dataCurrentRecord?.biteTime ?? this.now
      return Math.max((biteTime - startTime) / 1000, 0)
    },
    timer() {
      return +(this.interval > 60 ? 60 : this.interval).toFixed(0)
    },
    intervalPercentage() {
      const percentage = this.interval / 60
      return (percentage > 1 ? 1 : percentage) * 100
    },
    intervalText() {
      return this.interval.toFixed(1)
    },
    selectedSpotId() {
      return this.dataStatus?.spotId
    },
    status() {
      return this.readerRegion === 'CN' ? STATUS.CN : STATUS.Global
    },
    effects() {
      return (this.dataStatus?.effects ?? [])
        .map(([statusId]) => {
          const effect = this.status[statusId]
          return effect && effect.id
        })
        .filter(it => it)
    },
    chum() {
      return !!this.effects.find(effect => effect === 763)
    },
    currentSpotRecords() {
      return this.rawRecords.map(record => {
        const biteInterval = +((record.biteTime - record.startTime) / 1000).toFixed(1)
        return {
          ...record,
          biteInterval: biteInterval,
        }
      })
    },
    fishingSpot() {
      const spotId = this.dataStatus?.spotId
      const spot =
        spotId > 0 ? DataUtil.FISHING_SPOTS[spotId] : { name_chs: '未检测到钓场' }
      return {
        ...spot,
        name: DataUtil.getName(placeNames[spot.placeNameId]),
      }
    },
    dataForChart() {
      const fishDict = this.currentSpotRecords
        .filter(record => record.fishId !== -1)
        .reduce((fishDataDict, record) => {
          let fish = fishDataDict[record.fishId]
          if (!fish) {
            fish = fishDataDict[record.fishId] = {
              name: DataUtil.getItemName(record.fishId),
              tug: record.tug,
              chum: { min: 60, max: 0 },
              normal: { min: 60, max: 0 },
            }
          }

          const fishRange = fish[record.chum ? 'chum' : 'normal']
          fish[record.chum ? 'chum' : 'normal'] = {
            min: Math.min(fishRange.min, record.biteInterval),
            max: Math.max(fishRange.max, record.biteInterval),
          }
          return fishDataDict
        }, {})
      return Object.values(fishDict)
        .map(fish => {
          const min = fish[this.currentChumForGraph].min
          const max = fish[this.currentChumForGraph].max
          if (min > max) return null
          return { name: fish.name, min, max, tug: fish.tug }
        })
        .filter(it => it !== null)
    },
    rangeMax() {
      if (this.dataForChart.length > 0) {
        return Math.max(...this.dataForChart.map(it => it.max)) * 1.25
      } else {
        return 60
      }
    },
  },
  watch: {
    selectedSpotId: {
      handler(spotId) {
        this.loadRecord(spotId)
      },
      immediate: true,
    },
    chum(chum) {
      this.currentChumForGraph = chum ? 'chum' : 'normal'
    },
  },
  async created() {
    this.db = (await import('@/plugins/db')).default

    window.electron?.ipcRenderer
      ?.on('fishingData', (event, data) => {
        this.dataStatus = {
          ...data.status,
          effects: Array.from(data.status && data.status.effects.entries()),
        }
        this.dataCurrentRecord = data.currentRecord
      })
      ?.on('newRecord', (event, data) => {
        // console.log('data', JSON.stringify(data))
        if (this.rawRecords.length > 0 && this.rawRecords[0].id === data.id) {
          this.rawRecords.splice(0, 1, data)
        } else {
          this.rawRecords.splice(0, 0, data)
        }
      })
      ?.on('reloadRecords', () => {
        this.loadRecord(this.selectedSpotId)
      })
    setInterval(() => {
      this.now = Date.now()
    }, 100)
  },
  methods: {
    async loadRecord(spotId) {
      if (spotId > -1) {
        this.rawRecords = await this.db.records
          .where('spotId')
          .equals(spotId)
          .toArray()
      } else {
        this.rawRecords = []
      }
    },
  },
}
</script>

<style scoped></style>
