<template>
  <div>
    <!--    <div>-->
    <!--      {{ records }}-->
    <!--      {{ option }}-->
    <!--    </div>-->
    <div style="height: 400px;">
      <v-chart autoresize :option="option" />
    </div>
  </div>
</template>

<script>
import reverse from 'lodash/reverse'
import { THEME_KEY } from 'vue-echarts'

export default {
  name: 'BiteTimeChart',
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  provide: {
    [THEME_KEY]: 'dark',
  },
  props: {
    fishList: {
      type: Array,
      default: () => [],
    },
    records: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
  computed: {
    itemNames() {
      return reverse(this.fishList)
    },
    series() {
      return Object.entries(this.records).flatMap(([baitName, record]) => {
        return [
          {
            name: '辅助',
            type: 'bar',
            stack: baitName,
            itemStyle: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)',
            },
            emphasis: {
              itemStyle: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)',
              },
            },
            data: this.itemNames.map(fishName => record[fishName]?.[0] ?? '-'),
          },
          {
            name: baitName,
            type: 'bar',
            stack: baitName,
            label: {
              show: true,
              position: 'inside',
              formatter: params => {
                // return params.name + '<br/>' + params.seriesName + ' : ' + params.value
                const [min, max] = this.records[params.seriesName]?.[params.name] ?? [
                  0,
                  0,
                ]
                return min + '-' + max
              },
            },
            data: this.itemNames.map(fishName => record[fishName]?.[1] ?? '-'),
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
      return {
        title: {
          text: '咬钩时间分布',
          // subtext: 'From ExcelHome',
          // sublink: 'http://e.weibo.com/1341556070/AjQH99che',
        },
        legend: {
          data: Object.keys(this.records),
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: tar => {
            console.log(tar)
            const data = this.records[tar.seriesName]?.[tar.name]
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
}
</script>

<style scoped></style>
