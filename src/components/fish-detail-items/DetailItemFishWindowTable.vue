<template>
  <v-expansion-panels hover flat tile :value="expansionValue">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <div style="display: flex; justify-content: center">
          <div>
            <v-icon>mdi-calendar</v-icon>
            {{ $t('countDown.fishWindowBtn') }}
          </div>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">{{ $t('list.item.fishWindowTable.startTime') }}</th>
                <th class="text-center">{{ $t('list.item.fishWindowTable.interval') }}</th>
                <th class="text-center">{{ $t('list.item.fishWindowTable.nextInterval') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fishWindow, index) in fishWindows" :key="index">
                <td class="text-center">{{ fishWindow.start }}</td>
                <td class="text-center">{{ fishWindow.interval }}</td>
                <td class="text-center">{{ fishWindow.nextInterval }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import FishWindow from '@/utils/FishWindow'
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'DetailItemFishWindowTable',
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
    fishWeatherChangePart: {
      type: Object,
      default: () => ({}),
    },
    expanded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    expansionValue() {
      return this.expanded ? 0 : undefined
    },
    fishWindows() {
      let fishWindows = this.fishWeatherChangePart.fishWindows.filter(it => it[1] >= Date.now())
      if (FishWindow.FISH_WINDOW_FORECAST_N > fishWindows.length) {
        console.warn('fish window cnt:', fishWindows.length)
      }
      fishWindows = fishWindows.slice(0, Math.min(FishWindow.FISH_WINDOW_FORECAST_N, fishWindows.length))

      return fishWindows.map((fishWindow, index) => {
        const start = new Date(fishWindow[0])
        const end = new Date(fishWindow[1])
        return {
          startTime: fishWindow[0],
          start: DataUtil.formatDateTime(fishWindow[0]),
          end: end.toLocaleDateString() + ' ' + end.toLocaleTimeString(),
          interval: this.printCountDownTime(end - start),
          nextInterval: index < fishWindows.length - 1 ? this.printCountDownTime(fishWindows[index + 1][0] - end) : '',
        }
      })
    },
  },
  methods: {
    printCountDownTime: DataUtil.printCountDownTime,
  },
}
</script>

<style scoped></style>