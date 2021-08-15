<template>
  <v-container fluid>
    <v-row class="ml-2" v-show="records.length > 0">
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-switch v-model="chumBiteTime" label="撒饵" inset />
          <v-switch v-model="enableBaitFilter" inset label="鱼饵筛选" class="ml-4" />
          <v-spacer />
          <v-subheader v-if="updatedTime">{{ updatedTimeStr }} </v-subheader>
        </div>
        <div v-if="enableBaitFilter" class="d-flex flex-wrap">
          <div
            v-for="bait in baitList"
            :key="bait.baitId"
            class="d-flex align-center mr-2"
          >
            <v-checkbox v-model="baitSelected" :value="bait.baitId">
              <template v-slot:label>
                <div class="d-flex align-center">
                  <item-icon :icon-class="bait.baitIcon" />
                  <span>{{ bait.baitName }}</span>
                </div>
              </template>
            </v-checkbox>
          </div>
        </div>
        <div
          id="main"
          :style="`width: 800px;height: ${enableBaitFilter ? 800 : 400}px`"
        ></div>
      </v-col>
    </v-row>
    <v-row v-show="records.length === 0">暂无咬钩时长数据</v-row>
  </v-container>
</template>

<script>
import reverse from 'lodash/reverse'
import ItemIcon from '@/components/basic/ItemIcon'
import UploadUtil from '@/utils/UploadUtil'
import * as echarts from 'echarts/core'
import clone from 'lodash/clone'
import themes from '@/components/echart-theme/theme'
import * as _ from 'lodash'
import DataUtil from '@/utils/DataUtil'

echarts.registerTheme('dark', themes.dark)
echarts.registerTheme('light', themes.light)

export default {
  name: 'BiteIntervalChart',
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
    updatedTime: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      baitSelected: [],
      enableBaitFilter: false,
      chart: undefined,
      chumBiteTime: false,
    }
  },
  mounted() {
    this.chart = this.initChart(this.theme.isDark)
  },
  watch: {
    enableBaitFilter(enableBaitFilter) {
      if (enableBaitFilter) {
        this.baitSelected = clone(this.allBaitIds)
      }
      this.$nextTick(() => {
        this.chart.dispose()
        this.chart = this.initChart(this.theme.isDark)
        this.chart.setOption(this.option)
      })
    },
    option(option) {
      this.chart.clear()
      this.chart.setOption(option)
    },
    'theme.isDark'(isDark) {
      this.chart.dispose()
      this.chart = this.initChart(isDark)
      this.chart.setOption(this.option)
    },
  },
  computed: {
    updatedTimeStr() {
      return `※ 更新时间 ${new Date(this.updatedTime ?? 0).toLocaleString()}`
    },
    allBaitIds() {
      return this.dataOfSpot.baitList.map(({ baitId }) => +baitId)
    },
    filteredRecords() {
      const ret = {}
      Object.entries(this.dataOfSpot.biteTimes)
        .filter(
          ([baitId]) => this.baitSelected.includes(+baitId) || !this.enableBaitFilter
        )
        .forEach(([baitId, record]) => {
          ret[UploadUtil.toBait(baitId).baitName] = record
        })
      return ret
    },
    dataOfSpot() {
      const records = this.records
      const biteTimes = _(records)
        .chain()
        .filter(
          ({ fish, bait, chum }) => fish > 0 && bait > 0 && !!chum === this.chumBiteTime
        )
        .groupBy(({ bait }) => bait)
        .mapValues(records => {
          return _(records)
            .chain()
            .groupBy(({ fish }) => UploadUtil.toFish(fish).fishName)
            .mapValues(baitRec => [
              _.minBy(baitRec, 'biteIntervalMin')?.biteIntervalMin,
              _.maxBy(baitRec, 'biteIntervalMax')?.biteIntervalMax,
            ])
            .value()
        })
        .value()

      const allBaitBiteTimes = _(records)
        .chain()
        .filter(
          ({ fish, bait, chum }) => fish > 0 && bait > 0 && !!chum === this.chumBiteTime
        )
        .groupBy(({ fish }) => UploadUtil.toFish(fish).fishName)
        .mapValues(baitRec => [
          _.minBy(baitRec, 'biteIntervalMin')?.biteIntervalMin,
          _.maxBy(baitRec, 'biteIntervalMax')?.biteIntervalMax,
        ])
        .value()

      const fishNameList = UploadUtil.fishListOfSpot(this.spotId).map(fishId => {
        const fishInfo =
          this.fishDict[fishId] ??
          this.fishDict[
            Object.keys(this.fishDict).find(id => DataUtil.toItemId(id) === fishId)
          ]
        return fishInfo.name
      }) //.concat(['light', 'medium', 'heavy'])

      const baitList = Object.keys(biteTimes).map(bait => UploadUtil.toBait(bait))
      return {
        biteTimes,
        allBaitBiteTimes,
        fishNameList,
        baitList,
      }
    },
    spotId() {
      if (this.records.length > 0) {
        return this.records[0].spot
      } else {
        return -1
      }
    },
    fishList() {
      return this.dataOfSpot.fishNameList
    },
    baitList() {
      return this.dataOfSpot.baitList
    },
    itemNames() {
      return reverse(this.fishList)
    },
    allBaitRecords() {
      return this.dataOfSpot.allBaitBiteTimes
    },
    allBaitSeries() {
      return [
        {
          name: '辅助',
          type: 'bar',
          stack: 'allBait',
          itemStyle: {
            borderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
          emphasis: {
            itemStyle: {
              borderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)',
            },
          },
          data: this.itemNames.map(fishName => this.allBaitRecords[fishName]?.[0] ?? '-'),
        },
        {
          name: 'data',
          type: 'bar',
          stack: 'allBait',
          emphasis: {
            focus: 'series',
          },
          label: {
            show: true,
            position: 'inside',
            formatter: params => {
              // return params.name + '<br/>' + params.seriesName + ' : ' + params.value
              const [min, max] = this.allBaitRecords[params.name] ?? [0, 0]
              return min + '-' + max
            },
          },
          data: this.itemNames.map(
            fishName =>
              this.allBaitRecords[fishName]?.[1] - this.allBaitRecords[fishName]?.[0] ??
              '-'
          ),
        },
      ]
    },
    series() {
      return Object.entries(this.filteredRecords).flatMap(([baitName, record]) => {
        // const baitName = UploadUtil.toBait(baitId).baitName
        // console.log(baitName)
        return [
          {
            name: baitName + '辅助',
            type: 'bar',
            stack: baitName,
            itemStyle: {
              borderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)',
            },
            emphasis: {
              itemStyle: {
                borderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)',
              },
            },
            data: this.itemNames.map(fishName => record[fishName]?.[0] ?? '-'),
          },
          {
            name: baitName,
            type: 'bar',
            stack: baitName,
            emphasis: {
              focus: 'series',
            },
            label: {
              show: true,
              position: 'inside',
              formatter: params => {
                // return params.name + '<br/>' + params.seriesName + ' : ' + params.value
                const [min, max] = this.filteredRecords[params.seriesName]?.[
                  params.name
                ] ?? [0, 0]
                return min + '-' + max
              },
            },
            data: this.itemNames.map(fishName => {
              const r = record[fishName]
              if (r) {
                return record[fishName]?.[1] - record[fishName]?.[0]
              } else return '-'
            }),
          },
        ]
        // {
        //   name: '辅助',
        //     type: 'bar',
        //   stack: '总量',
        //   itemStyle: {
        //   barBorderColor: 'rgba(0,0,0,0)',
        //     color: 'rgba(0,0,0,0)',
        // },
        //   emphasis: {
        //     itemStyle: {
        //       barBorderColor: 'rgba(0,0,0,0)',
        //         color: 'rgba(0,0,0,0)',
        //     },
        //   },
        //   data: [0, 1700, 1400, 1200, 300, 0],
        // },
        // {
        //   name: '生活费',
        //     type: 'bar',
        //   stack: '总量',
        //   label: {
        //   show: true,
        //     position: 'inside',
        // },
        //   data: [2900, 1200, 300, 200, 900, 300],
        // },
      })
    },
    option() {
      if (this.enableBaitFilter) {
        return this.baitOption
      } else {
        return this.combineBaitOption
      }
    },
    combineBaitOption() {
      return {
        title: {
          text: '咬钩时间分布',
          // subtext: 'From ExcelHome',
          // sublink: 'http://e.weibo.com/1341556070/AjQH99che',
        },
        // legend: {
        //   data: [],
        // },
        // legend: {
        //   data: this.baitList.map(({ baitName }) => baitName),
        // },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: tar => {
            const data = this.allBaitRecords[tar.name]
            if (data) {
              const [min, max] = data
              return tar.name + ' : ' + min + '-' + max
            } else {
              return null
            }
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        yAxis: {
          type: 'category',
          splitLine: { show: false },
          data: this.itemNames,
        },
        xAxis: {
          type: 'value',
        },
        series: this.allBaitSeries,
      }
    },
    baitOption() {
      return {
        title: {
          text: '咬钩时间分布',
          // subtext: 'From ExcelHome',
          // sublink: 'http://e.weibo.com/1341556070/AjQH99che',
        },
        legend: {
          data: this.baitSelected.map(baitId => UploadUtil.toBait(baitId).baitName),
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: tar => {
            const data = this.filteredRecords[tar.seriesName]?.[tar.name]
            if (data) {
              const [min, max] = data
              return tar.name + '<br/>' + tar.seriesName + ' : ' + min + '-' + max
            } else {
              return null
            }
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        yAxis: {
          type: 'category',
          splitLine: { show: false },
          data: this.itemNames,
        },
        xAxis: {
          type: 'value',
        },
        series: this.series,
      }
    },
  },
  methods: {
    initChart(isDark) {
      return echarts.init(document.getElementById('main'), isDark ? 'dark' : 'light', {
        height: 'auto',
        width: 'auto',
      })
    },
    toJSON(d) {
      return JSON.stringify(d, null, 2)
    },
  },
}
</script>

<style scoped></style>
