<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col cols="2">
        <v-row>
          <v-col cols="12">
            <!--        <code>{{ effects }}</code>-->
            <div class="d-flex align-center">
              <div>状态</div>
              <v-spacer />
              <div v-for="effect in effects" :key="effect.ID">
                <v-img
                  :src="effect.iconUrl"
                  width="24"
                  height="32"
                  :title="effect.name"
                />
              </div>
            </div>
          </v-col>
          <v-col cols="12">
            <!--        <code>{{ bait }}</code>-->
            <div class="d-flex align-center">
              <div>钓饵</div>
              <v-spacer />
              <div v-if="bait" class="d-flex align-center">
                <div>{{ bait.name }}</div>
                <!--                <v-img :src="bait.iconUrl" width="32" height="32" :title="bait.name" />-->
                <item-icon :icon-class="bait.icon" :title="bait.name" small />
              </div>
              <div v-else>
                未知
              </div>
            </div>
          </v-col>
          <v-col>
            <div>计时</div>
            <v-progress-linear
              v-show="this.interval > 0"
              :value="intervalPercentage"
              color="blue-grey"
              height="25"
            >
              <template>
                <strong>{{ intervalText }}</strong>
              </template>
            </v-progress-linear>
          </v-col>
          <v-col cols="12">
            <div class="d-flex align-center">
              <div>钓场</div>
              <v-spacer />
              <div class="d-flex align-center">
                <div>{{ spot.name }}</div>
              </div>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="d-flex align-center">
              <div>天气</div>
              <v-spacer />
              <div v-if="weather" class="d-flex align-center">
                <div>{{ weather.name }}</div>
                <weather-icon
                  :icon-class="weather.icon"
                  :title="weather.name"
                  type="weather"
                />
              </div>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="d-flex align-center">
              <div>上一天气</div>
              <v-spacer />
              <div v-if="weather" class="d-flex align-center">
                <div>{{ prevWeather.name }}</div>
                <weather-icon
                  :icon-class="prevWeather.icon"
                  :title="prevWeather.name"
                  type="weather"
                />
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="currentChumForGraph"
              :items="chumOptions"
              item-text="name"
              item-value="value"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
            <!--            <apexchart type="rangeBar"-->
            <!--                       height="350"-->
            <!--                       :options="chartOptions"-->
            <!--                       :series="dataForChart"/>-->
            <fish-timeline-table :pointer="interval" :timelines="dataForChart" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-list>
          <v-list-item v-for="(record, index) in records" :key="index">
            <item-icon :icon-class="record.fishIcon" small />
            <v-list-item-content class="d-flex flex-row">
              <div v-html="record.fishText"></div>
            </v-list-item-content>
            <v-list-item-content class="d-flex flex-row">
              <v-progress-linear
                :value="record.biteIntervalPercentage"
                :color="record.tugClass"
                height="25"
              >
                <template>
                  <strong>{{ record.biteInterval }}</strong>
                </template>
              </v-progress-linear>
            </v-list-item-content>
            <item-icon :icon-class="record.baitIcon" small />
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <!--    <pre>{{ JSON.stringify(data, null, 2) }}</pre>-->
  </v-container>
</template>

<script>
import DUMMY_DATA from '../util/DummyData'
import DataUtil from '@/utils/DataUtil'
import FishTimelineTable from './FishTimelineTable'
import ItemIcon from '@/components/basic/ItemIcon'
import SubUtil, { WEATHER_CHANGE_INTERVAL_EARTH } from '../util/SubUtil'
import WeatherIcon from '@/components/basic/WeatherIcon'
import clone from 'lodash/clone'
import max from 'lodash/max'

export default {
  name: 'FisherStatus',
  components: { WeatherIcon, ItemIcon, FishTimelineTable },
  props: ['now'],
  data: () => ({
    dataStatus: {
      effects: [],
    },
    dataCurrentRecord: {},
    dataRecords: [],
    dataReadableRecords: [],
    chartOptions: {
      theme: {
        mode: 'dark',
        palette: 'palette1',
      },
      chart: {
        height: 350,
        type: 'rangeBar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val, opts) => {
          return opts.w.config.series[opts.seriesIndex].name
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      xaxis: {
        type: 'numeric',
      },
      legend: {
        position: 'top',
      },
    },
    currentChumForGraph: 'normal',
    chumOptions: [
      { name: '普通', value: 'normal' },
      { name: '撒饵', value: 'chum' },
    ],
  }),
  computed: {
    effects() {
      return this.dataStatus.effects
        .map(it => SubUtil.STATUS_DICT[it])
        .filter(it => it != null)
        .map(effect => {
          return {
            id: effect.ID,
            name: effect.Name,
            iconUrl: SubUtil.iconIdToUrl(effect.IconID),
          }
        })
    },
    bait() {
      return SubUtil.getItem(this.dataStatus?.baitId)
    },
    spot() {
      const spotId = this.dataStatus?.spotId
      return {
        id: spotId,
        name: SubUtil.toSpotText(spotId) ?? '未知',
      }
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
    weatherCheckPoint() {
      return this.now - (this.now % WEATHER_CHANGE_INTERVAL_EARTH) + 1
    },
    prevWeatherCheckPoint() {
      return this.weatherCheckPoint - WEATHER_CHANGE_INTERVAL_EARTH
    },
    weather() {
      return SubUtil.getWeather(this.spot.id, this.weatherCheckPoint)
    },
    prevWeather() {
      return SubUtil.getWeather(this.spot.id, this.prevWeatherCheckPoint)
    },
    records() {
      const records = clone(this.dataReadableRecords ?? []).reverse()
      const maxBiteInterval = max(records.map(it => it.biteInterval))
      let intervalMax = 60
      if (maxBiteInterval != null) {
        const maxBiteIntervalInteger = +maxBiteInterval.toFixed(1).split('.')[0]
        intervalMax = maxBiteIntervalInteger - (maxBiteIntervalInteger % 10) + 10
      }
      return records
        .filter(record => record.fishId !== -1)
        .map(record => {
          const fish = SubUtil.getItem(record.fishId)
          const bait = SubUtil.getItem(record.baitId)
          return {
            ...record,
            fishIcon: fish?.icon,
            baitIcon: bait?.icon,
            biteIntervalPercentage: (record.biteInterval / intervalMax) * 100,
            tugClass: DataUtil.TUG_ICON_COLOR[DataUtil.TUG_ICON[record.tug]],
          }
        })
    },

    selectedSpotId() {
      return this.dataStatus?.spotId
    },
    currentSpotRecords() {
      if (!this.selectedSpotId) return []
      else return this.records.filter(record => record.spotId === this.selectedSpotId)
    },
    dataForChart() {
      const fishDict = this.currentSpotRecords.reduce((fishDataDict, record) => {
        let fish = fishDataDict[record.fishId]
        if (!fish) {
          fish = fishDataDict[record.fishId] = {
            name: SubUtil.getItem(record.fishId)?.name,
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
  },
  created() {
    const data = DUMMY_DATA[2]
    this.dataStatus = data.status
    this.dataCurrentRecord = data.currentRecord
    this.dataRecords = data.records
    this.dataReadableRecords = data.readableRecords
    console.log(DUMMY_DATA)
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
}
</script>
