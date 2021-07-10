<template>
  <div>
    <!--    <div>-->
    <!--      {{ baitList.map(({ baitName }) => baitName) }}-->
    <!--      {{ filteredRecords }}-->
    <!--      &lt;!&ndash;      <pre> {{ toJSON(option) }}</pre>&ndash;&gt;-->
    <!--    </div>-->
    <v-switch inset label="鱼饵筛选" v-model="enableBaitFilter" />
    <div v-if="enableBaitFilter" class="d-flex flex-wrap">
      <div v-for="bait in baitList" :key="bait.baitId" class="d-flex align-center mr-2">
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
    <div id="main" style="width: 800px;height: 800px"></div>
  </div>
</template>

<script>
import reverse from 'lodash/reverse'
import ItemIcon from '@/components/basic/ItemIcon'
import UploadUtil from '@/utils/UploadUtil'
import * as echarts from 'echarts/core'
import clone from 'lodash/clone'
import themes from '@/components/echart-theme/theme'

echarts.registerTheme('dark', themes.dark)
echarts.registerTheme('light', themes.light)

export default {
  name: 'BiteTimeChart',
  components: { ItemIcon },
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      baitSelected: [],
      enableBaitFilter: false,
      chart: undefined,
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
    allBaitIds() {
      return this.data.baitList.map(({ baitId }) => baitId)
    },
    filteredRecords() {
      const ret = {}
      Object.entries(this.records)
        .filter(
          ([baitId]) => this.baitSelected.includes(baitId) || !this.enableBaitFilter
        )
        .forEach(([baitId, record]) => {
          ret[UploadUtil.toBait(baitId).baitName] = record
        })
      return ret
    },
    fishList() {
      return this.data.fishList
    },
    records() {
      return this.data.records
    },
    baitList() {
      return this.data.baitList
    },
    // targetRecords() {
    //   if (this.enableBaitFilter) {
    //     return this.filteredRecords
    //   } else {
    //     return this.data.allBaitRecords
    //   }
    // },
    itemNames() {
      return reverse(this.fishList)
    },
    allBaitRecords() {
      return this.data.allBaitRecords
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
