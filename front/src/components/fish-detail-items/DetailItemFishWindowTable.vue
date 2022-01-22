<template>
  <v-expansion-panels hover flat tile v-model="lazyExpansionValue">
    <v-expansion-panel class="system">
      <v-expansion-panel-header class="system">
        <div style="display: flex; justify-content: center">
          <div>
            <v-icon>{{ mdiCalendar }}</v-icon>
            {{ $t('countDown.fishWindowBtn') }}
          </div>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div
          v-if="fishWindowsToShow.length === 0"
          style="height: 352px"
          class="d-flex justify-center align-center"
        >
          <div class="d-flex align-center">
            <v-icon x-large>{{ mdiTableSearch }}</v-icon>
            <span>{{ $t('common.ui.loading') }}</span>
          </div>
        </div>
        <v-simple-table dense class="system" v-else>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">
                  {{ $t('list.item.fishWindowTable.startTime') }}
                </th>
                <th class="text-center">
                  {{ $t('list.item.fishWindowTable.interval') }}
                </th>
                <th class="text-center">
                  {{ $t('list.item.fishWindowTable.nextInterval') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fishWindow, index) in fishWindowsToShow" :key="index">
                <td class="text-center">{{ fishWindow.start }}</td>
                <td class="text-center">{{ fishWindow.interval }}</td>
                <td class="text-center">{{ fishWindow.nextInterval }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-btn block @click="showMore" :loading="loadingShowMore" color="primary">
          {{ $t('loadingMore') }}
        </v-btn>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { mdiCalendar, mdiTableSearch } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import FishWindow from '@/utils/FishWindow'

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
  data: vm => ({
    mdiCalendar,
    mdiTableSearch,
    lazyExpansionValue: vm.expanded ? 0 : undefined,
    recordsCntToShow: FishWindow.FISH_WINDOW_FORECAST_N,
    lazyFishWindows: [],
    fishWindowsToShow: [],
    loadingShowMore: false,
  }),
  created() {
    this.lazyExpansionValue = this.expanded ? 0 : undefined
  },
  watch: {
    expanded(expanded) {
      this.lazyExpansionValue = expanded ? 0 : undefined
    },
    'fish.id': function() {
      this.lazyExpansionValue = this.expanded ? 0 : undefined
      this.recordsCntToShow = FishWindow.FISH_WINDOW_FORECAST_N
      this.lazyFishWindows = []
      this.fishWindowsToShow = []
    },
    now(now) {
      if (
        this.recordsCntToShow ===
        this.fishWindowsProvided.filter(it => it.endTime > now).length
      ) {
        this.fishWindowsToShow = this.fishWindowsProvided
      } else {
        const existedFishWindows = this.lazyFishWindows.filter(it => it.endTime > now)
        if (existedFishWindows.length > this.recordsCntToShow) {
          this.fishWindowsToShow = existedFishWindows.slice(0, this.recordsCntToShow)
        } else if (existedFishWindows.length === this.recordsCntToShow) {
          // console.log('just return cached')
          this.fishWindowsToShow = existedFishWindows
        } else {
          this.fishWindowsToShow = this.lazyFishWindows = this.transformFishWindows(
            DataUtil.getFishWindow(
              this.allFish[this.fish.id],
              now,
              this.allFish,
              this.fishingSpots,
              this.fishEyesUsed,
              this.recordsCntToShow
            ),
            this.recordsCntToShow,
            now
          )
          this.loadingShowMore = false
        }
      }
    },
  },
  computed: {
    fishWindowsProvided() {
      return this.transformFishWindows(
        this.fishWeatherChangePart.fishWindows,
        FishWindow.FISH_WINDOW_FORECAST_N,
        this.now
      )
    },
    ...mapState({
      allFish: 'fish',
      fishingSpots: 'fishingSpots',
      now: 'now',
    }),
    ...mapGetters(['fishEyesUsed']),
  },
  methods: {
    transformFishWindows(original, n, now) {
      let fishWindows = original.filter(it => it[1] > now)
      if (n > fishWindows.length) {
        console.warn('fish window cnt less than n', fishWindows.length, n)
      }
      fishWindows = fishWindows.slice(0, Math.min(n, fishWindows.length))

      return fishWindows.map((fishWindow, index) => {
        const start = new Date(fishWindow[0])
        const end = new Date(fishWindow[1])
        return {
          startTime: fishWindow[0],
          endTime: fishWindow[1],
          start: DataUtil.formatDateTime(fishWindow[0]),
          end: DataUtil.formatDateTime(fishWindow[1]),
          interval: this.printCountDownTime(end.getTime() - start.getTime()),
          nextInterval:
            index < fishWindows.length - 1
              ? this.printCountDownTime(fishWindows[index + 1][0] - end.getTime())
              : '',
        }
      })
    },
    showMore() {
      if (!this.loadingShowMore) {
        this.recordsCntToShow += 10
        this.loadingShowMore = true
      }
    },
    printCountDownTime: DataUtil.printCountDownTime,
  },
}
</script>

<style scoped></style>
