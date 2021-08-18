<template>
  <v-container fluid>
    <v-row class="ml-2" v-if="records.length > 0">
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-switch
            inset
            label="条件筛选"
            v-model="enableWeatherFilter"
            style="width: 200px"
          />
          <v-spacer />
          <v-subheader v-if="updatedTime">{{ dataMeta }} </v-subheader>
        </div>
        <template v-if="enableWeatherFilter">
          <div class="d-flex flex-wrap align-center">
            <v-subheader class="pb-8">ET范围</v-subheader>
            <div class="d-flex flex-column">
              <div class="d-flex align-content-space-between">
                <v-autocomplete
                  v-model="etHourStartFilter"
                  :items="etHourOptions"
                  label="开始ET小时"
                  outlined
                  auto-select-first
                  style="width: 100px; min-width: 100px"
                ></v-autocomplete>
                <v-autocomplete
                  v-model="etMinuteStartFilter"
                  :items="etMinuteStartOptions"
                  label="开始ET分"
                  outlined
                  auto-select-first
                  class="ml-1"
                  style="width: 100px; min-width: 100px"
                ></v-autocomplete>
              </div>
              <div class="d-flex align-content-space-between">
                <v-autocomplete
                  v-model="etHourEndFilter"
                  :items="etHourOptions"
                  label="结束ET小时"
                  outlined
                  style="width: 100px; min-width: 100px"
                ></v-autocomplete>
                <v-autocomplete
                  v-model="etMinuteEndFilter"
                  :items="etMinuteEndOptions"
                  label="结束ET分"
                  outlined
                  class="ml-1"
                  style="width: 100px; min-width: 100px"
                ></v-autocomplete>
              </div>
            </div>
          </div>
          <div class="d-flex flex-wrap align-center">
            <v-subheader>前置天气</v-subheader>
            <div
              v-for="weather in spotWeathers"
              :key="weather.id"
              class="d-flex align-center mr-2"
            >
              <v-checkbox v-model="prevWeatherFilter" :value="weather.id">
                <template v-slot:label>
                  <div class="d-flex align-center">
                    <div style="height: 32px; width: 32px">
                      <weather-icon
                        :icon-class="weather.icon"
                        :title="weather.name"
                        type="weather"
                      />
                    </div>
                    <span class="ml-1">{{ weather.name }}</span>
                  </div>
                </template>
              </v-checkbox>
            </div>
          </div>
          <div class="d-flex flex-wrap align-center">
            <v-subheader class="ml-7">天气</v-subheader>
            <div
              v-for="weather in spotWeathers"
              :key="weather.id"
              class="d-flex align-center mr-2"
            >
              <v-checkbox v-model="weatherFilter" :value="weather.id">
                <template v-slot:label>
                  <div class="d-flex align-center">
                    <div style="height: 32px; width: 32px">
                      <weather-icon
                        :icon-class="weather.icon"
                        :title="weather.name"
                        type="weather"
                      />
                    </div>
                    <span class="ml-1">{{ weather.name }}</span>
                  </div>
                </template>
              </v-checkbox>
            </div>
          </div>
          <div class="d-flex flex-wrap align-center">
            <v-subheader class="ml-7">鱼识</v-subheader>
            <v-btn-toggle
              v-model="fishersIntuitionFilter"
              rounded
              dense
              mandatory
              multiple
              active-class="primary"
            >
              <v-btn small v-for="option in fishersIntuitionOptions" :key="option">
                {{ $t('chart.fishersIntuition.' + option) }}
              </v-btn>
            </v-btn-toggle>
          </div>
        </template>
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
          <v-subheader>※ 杆型下方的百分比为脱钩数据的占比</v-subheader>
        </div>
      </v-col>
    </v-row>
    <v-row v-else>暂无鱼饵概率数据</v-row>
  </v-container>
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
import Constants from 'Data/constants'
import _ from 'lodash'
import UploadUtil from '@/utils/UploadUtil'
import DataUtil from '@/utils/DataUtil'
import uniq from 'lodash/uniq'
import SPOT_WEATHER from 'Data/spotWeather'
import WeatherIcon from '@/components/basic/WeatherIcon'

const hourMinuteToMinutes = (hour, minute) => {
  return hour * 60 + minute
}

export default {
  name: 'BaitPercentageChart',
  components: { WeatherIcon, ItemIcon },
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
    updatedTime: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      TUGS: Constants.TUGS,
      tugColor: Constants.TUG_COLOR,
      prevWeatherFilter: [],
      weatherFilter: [],
      enableWeatherFilter: false,
      etHourStartFilter: 0,
      etHourEndFilter: 23,
      etMinuteStartFilter: 0,
      etMinuteEndFilter: 59,
      etStartFilter: null,
      etEndFilter: null,
      range: [0, 48],
      fishersIntuitionFilter: [0, 1],
      fishersIntuitionOptions: ['yes', 'no'],
    }
  },
  computed: {
    recordTotal() {
      return _.sumBy(this.records, ({ quantity }) => +quantity)
    },
    dataMeta() {
      return `※ 共 ${this.recordTotal} 条数据【更新于 ${new Date(
        this.updatedTime ?? 0
      ).toLocaleString()}】`
    },
    etHourOptions() {
      const options = []
      for (let i = 0; i < 24; i++) {
        options.push({ text: i, value: i })
      }
      return options
    },
    etMinuteStep() {
      return 30
    },
    etMinuteStartOptions() {
      const options = []
      for (let i = 0; i < 60; i += this.etMinuteStep) {
        options.push({ text: i, value: i })
      }
      return options
    },
    etMinuteEndOptions() {
      const options = []
      for (let i = this.etMinuteStep - 1; i < 60; i += this.etMinuteStep) {
        options.push({ text: i, value: i })
      }
      return options
    },
    etFilterTicks() {
      const options = []
      const tick = 0.5
      for (let i = 0; i < 48; i += tick) {
        options.push(i)
      }
      return options
    },
    etFilterTickLabels() {
      const labels = []
      const tick = 0.5
      for (let i = 0; i < 48; i += tick) {
        const hour = Math.floor(i)
        const minute = (i - hour) * 60
        if (minute > 0) {
          labels.push('')
        } else {
          labels.push(hour.toString())
        }
      }
      return labels
    },
    etHourStart() {
      return this.enableWeatherFilter ? this.etHourStartFilter : 0
    },
    etHourEnd() {
      return this.enableWeatherFilter ? this.etHourEndFilter : 23
    },
    etMinuteStart() {
      return this.enableWeatherFilter ? this.etMinuteStartFilter : 0
    },
    etMinuteEnd() {
      return this.enableWeatherFilter ? this.etMinuteEndFilter : 59
    },
    prevWeathers() {
      return this.enableWeatherFilter
        ? this.prevWeatherFilter
        : this.spotWeathers.map(it => it.id)
    },
    weathers() {
      return this.enableWeatherFilter
        ? this.weatherFilter
        : this.spotWeathers.map(it => it.id)
    },
    spotId() {
      if (this.records.length > 0) {
        return this.records[0].spot
      } else {
        return -1
      }
    },
    baitOfSpot() {
      const records = this.records
      const baitFishCnt = _(records)
        .chain()
        .filter(({ fish, bait }) => fish > 0 && bait > 0)
        .filter(({ fishersIntuition }) => {
          if (this.fishersIntuitionFilter.length === 2) {
            return true
          } else if (this.fishersIntuitionFilter.length === 1) {
            return (this.fishersIntuitionFilter[0] === 0) === fishersIntuition
          } else {
            return false
          }
        })
        .filter(({ prevWeather, weather }) => {
          return (
            this.prevWeathers.includes(prevWeather) && this.weathers.includes(weather)
          )
        })
        .filter(({ etHour, etMinuteStart }) => {
          const rangeStart = hourMinuteToMinutes(this.etHourStart, this.etMinuteStart)
          const rangeEnd = hourMinuteToMinutes(this.etHourEnd, this.etMinuteEnd)
          const time = hourMinuteToMinutes(etHour, etMinuteStart)
          if (rangeStart < rangeEnd) {
            return rangeStart <= time && time <= rangeEnd
          } else {
            return rangeStart <= time || time <= rangeEnd
          }
        })
        .groupBy(({ bait }) => bait)
        .mapValues(records => {
          return _(records)
            .chain()
            .groupBy(({ fish }) => fish)
            .mapValues(baitRec => _.sumBy(baitRec, ({ quantity }) => +quantity))
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
            .mapValues(baitRec => _.sumBy(baitRec, ({ quantity }) => +quantity))
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
          tugCntList: Constants.TUGS.map(tug => {
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
    spotWeathers() {
      return uniq((SPOT_WEATHER[this.spotId] ?? []).filter(it => it > 0))
        .sort()
        .map(weatherId => UploadUtil.toWeather(weatherId))
    },
  },
  watch: {
    spotWeathers(spotWeathers) {
      this.weatherFilter = spotWeathers.map(it => it.id)
      this.prevWeatherFilter = spotWeathers.map(it => it.id)
    },
  },
}
</script>

<style scoped></style>
