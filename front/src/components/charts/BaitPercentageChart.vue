<template>
  <div style="width: 100%">
    <template v-if="records.length > 0">
      <div class="d-flex align-center">
        <div class="pl-2">
          <v-switch inset label="条件筛选" v-model="enableWeatherFilter" />
        </div>
        <v-spacer />
        <v-subheader v-if="updatedTime" :style="`width: ${isMobile ? 100 : 200}px`"
          >{{ isMobile ? dataMetaShort : dataMeta }}
        </v-subheader>
      </div>
      <v-subheader v-if="!enableWeatherFilter"
        >※
        当前显示范围包括了所有时间天气下的数据，未区分有无鱼识及钓组。打开条件筛选以设置条件。</v-subheader
      >
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
          <v-subheader :class="{ 'ml-7': !isMobile }">天气</v-subheader>
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
        <div class="d-flex align-center">
          <div class="d-flex flex-wrap align-center">
            <v-subheader :class="{ 'ml-7': !isMobile }">鱼识</v-subheader>
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

          <div class="d-flex flex-wrap align-center">
            <v-subheader class="ml-2">钓组</v-subheader>
            <v-btn-toggle
              v-model="snaggingFilter"
              rounded
              dense
              mandatory
              multiple
              active-class="primary"
            >
              <v-btn small v-for="option in snaggingOptions" :key="option">
                {{ $t('chart.snagging.' + option) }}
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </template>
      <div style="width: 100%; overflow-x: scroll">
        <div
          class="d-flex flex-column align-center"
          :style="`width: ${48 * (baitOfSpot.fishList.length + 5)}px`"
        >
          <div class="d-flex">
            <div style="width: 48px"></div>
            <div
              v-for="fish in baitOfSpot.fishList"
              :key="fish.fishId"
              :title="toItemTitle({ name: fish.fishName, id: fish.fishId })"
              style="margin-top: 22px"
            >
              <item-icon :icon-class="fish.fishIcon" />
            </div>
            <v-card outlined rounded>
              <div style="text-align: center">脱钩</div>
              <div class="d-flex align-center">
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
            </v-card>
            <div
              style="width: 48px"
              class="d-flex align-center justify-center pt-5"
              title="总记录数"
            >
              <v-avatar color="blue-grey darken-3" size="40">
                <span class="text-h6">总</span>
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
              :title="toItemTitle({ name: bait.baitName, id: bait.baitId })"
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
                  style="position: absolute; top: 8px; left: 8px"
                  :color="tugColor + ' lighten-2'"
                >
                  <div :style="percentage === 100 ? 'font-size: x-small' : ''">
                    {{ percentage.toFixed(0) }}
                  </div>
                </v-progress-circular>
              </div>
              <div v-else style="width: 48px"></div>
            </div>
            <div
              style="height: 48px; width: 48px"
              :class="'d-flex justify-center align-center'"
              :title="`共${totalCnt}条记录`"
            >
              <div style="font-size: large">{{ abbrNum(totalCnt, 1) }}</div>
            </div>
          </div>
        </div>
      </div>
      <v-subheader
        >※ 显示的数字为鱼在使用对应鱼饵时的统计概率，鼠标悬停查看具体数据。</v-subheader
      >
      <v-subheader>※ “轻、中、重”下方为脱钩数据，“总”下方为总记录数。</v-subheader>
    </template>
    <template v-else>暂无鱼饵概率数据</template>
  </div>
</template>

<script>
import Constants from 'Data/constants'
import DataUtil from '@/utils/DataUtil'
import EnvMixin from '@/components/basic/EnvMixin'
import ItemIcon from '@/components/basic/ItemIcon'
import SPOT_WEATHER from 'Data/spotWeather'
import UploadUtil from '@/utils/UploadUtil'
import WeatherIcon from '@/components/basic/WeatherIcon'
import _ from 'lodash'

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
  mixins: [EnvMixin],
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
      snaggingFilter: [0, 1],
      snaggingOptions: ['yes', 'no'],
    }
  },
  computed: {
    recordTotal() {
      return _.sumBy(this.records, ({ quantity }) => +quantity)
    },
    dataMetaShort() {
      return `※ 共 ${this.recordTotal} 条数据`
    },
    dataMeta() {
      return `${this.dataMetaShort}【更新于 ${new Date(
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
      const fishIdList = UploadUtil.fishListOfSpot(this.spotId)
      const filteredRecords = this.records
        .filter(({ fishersIntuition }) => {
          if (this.fishersIntuitionFilter.length === 2) {
            return true
          } else if (this.fishersIntuitionFilter.length === 1) {
            return (this.fishersIntuitionFilter[0] === 0) === fishersIntuition
          } else {
            return false
          }
        })
        .filter(({ snagging }) => {
          if (this.snaggingFilter.length === 2) {
            return true
          } else if (this.snaggingFilter.length === 1) {
            return (this.snaggingFilter[0] === 0) === snagging
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

      const baitFishCnt = _(filteredRecords)
        .chain()
        .filter(({ fish, bait }) => fish > 0 && bait > 0 && fishIdList.includes(fish))
        .groupBy(({ bait }) => bait)
        .mapValues(records => {
          return _(records)
            .chain()
            .groupBy(({ fish }) => fish)
            .mapValues(baitRec => _.sumBy(baitRec, ({ quantity }) => +quantity))
            .value()
        })
        .value()
      const unknownFishCnt = _(filteredRecords)
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
      return _.uniq((SPOT_WEATHER[this.spotId] ?? []).filter(it => it > 0))
        .sort()
        .map(weatherId => UploadUtil.toWeather(weatherId))
    },
  },
  watch: {
    spotWeathers: {
      handler(spotWeathers) {
        this.weatherFilter = spotWeathers.map(it => it.id)
        this.prevWeatherFilter = spotWeathers.map(it => it.id)
      },
      immediate: true,
    },
  },
  methods: {
    toItemTitle: DataUtil.toItemTitle,
    abbrNum(number, decPlaces) {
      // 2 decimal places => 100, 3 => 1000, etc
      decPlaces = Math.pow(10, decPlaces)

      // Enumerate number abbreviations
      const abbrev = ['k', 'm', 'b', 't']

      // Go through the array backwards, so we do the largest first
      for (let i = abbrev.length - 1; i >= 0; i--) {
        // Convert array index to "1000", "1000000", etc
        const size = Math.pow(10, (i + 1) * 3)

        // If the number is bigger or equal do the abbreviation
        if (size <= number) {
          // Here, we multiply by decPlaces, round, and then divide by decPlaces.
          // This gives us nice rounding to a particular decimal place.
          number = Math.round((number * decPlaces) / size) / decPlaces

          // Handle special case where we round up to the next abbreviation
          if (number === 1000 && i < abbrev.length - 1) {
            number = 1
            i++
          }

          // Add the letter for the abbreviation
          number += abbrev[i]

          // We are done... stop
          break
        }
      }

      return number
    },
  },
}
</script>

<style scoped></style>
