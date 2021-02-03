<template>
  <div>
    <v-col>
      <div>计时</div>
      <div>{{ dataCurrentRecord }}</div>
      <v-progress-linear
        v-show="this.interval > 0"
        :value="intervalPercentage"
        :color="color"
        height="25"
      >
        <template>
          <strong>{{ intervalText }}</strong>
        </template>
      </v-progress-linear>
    </v-col>
  </div>
</template>

<script>
import DUMMY_DATA from '@/entries/reader/util/DummyData'
import DataUtil from '@/utils/DataUtil'
import { mapState } from 'vuex'

export default {
  name: 'ReaderTimer',
  components: {},
  props: ['now'],
  data() {
    return {
      dataCurrentRecord: {},
    }
  },
  computed: {
    tug() {
      return this.dataCurrentRecord.tug
    },
    color() {
      return DataUtil.TUG_ICON_COLOR[DataUtil.TUG_ICON[this.tug]] ?? 'blue-grey'
    },
    interval() {
      const startTime = this.dataCurrentRecord?.startTime ?? this.now
      const biteTime = this.dataCurrentRecord?.biteTime ?? this.now
      return (biteTime - startTime) / 1000
    },
    intervalPercentage() {
      return (this.interval / 60 > 1 ? 1 : this.interval / 60) * 100
    },
    intervalText() {
      return this.interval.toFixed(1)
    },
    ...mapState(['sounds']),
  },
  watch: {
    tug(tug) {
      if (tug) {
        this.ringBell(tug)
      }
    },
  },
  created() {
    const data = DUMMY_DATA[2]
    this.dataStatus = data.status
    this.dataCurrentRecord = data.currentRecord
    this.dataRecords = data.records
    this.dataReadableRecords = data.readableRecords
    window.electron?.ipcRenderer?.on('fishingData', (event, data) => {
      console.log(JSON.stringify(data))
      this.dataStatus = {
        ...data.status,
        effects: Array.from(data.status && data.status.effects),
      }
      this.dataCurrentRecord = data.currentRecord
      this.dataRecords = data.records
      this.dataReadableRecords = data.readableRecords
    })
  },
  methods: {
    ringBell(key) {
      console.debug('try play', key)
      this.sounds[key]?.player?.volume(1).play()
    },
  },
}
</script>
