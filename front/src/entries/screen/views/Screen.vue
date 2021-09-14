<template>
  <div class="screen">
    <v-navigation-drawer
      v-model="showSideBar"
      :mini-variant.sync="miniSideBar"
      color="system"
      absolute
      expand-on-hover
    >
      <v-list dense>
        <v-list-item @click="addReaderTimer">
          <v-list-item-icon>
            <v-icon>
              {{ 'mdi-fish' }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ '渔捞' }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div class="py-0 ml-14">
      <grid-layout
        :layout.sync="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="false"
        :responsive="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
        :auto-size="false"
      >
        <grid-item
          v-for="(item, i) in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
        >
          <v-sheet class="window-wrapper rounded elevation-4" color="background">
            <reader-timer-window
              v-if="windows[i].type === 'READER_TIMER'"
              :now="now"
              @close="() => removeItem(item.i)"
            />
            <reader-history-window
              v-if="windows[i].type === 'READER_HISTORY'"
              :now="now"
              @close="() => removeItem(item.i)"
            />
            <reader-spot-statistics-window
              v-if="windows[i].type === 'READER_SPOT_STATISTICS'"
              :now="now"
              @close="() => removeItem(item.i)"
            />
          </v-sheet>
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import ReaderTimerWindow from '@/entries/screen/views/ReaderTimerWindow'
import ReaderHistoryWindow from '@/entries/screen/views/ReaderHistoryWindow'
import ReaderSpotStatisticsWindow from '@/entries/screen/views/ReaderSpotStatisticsWindow'

export default {
  name: 'Screen',
  components: {
    ReaderSpotStatisticsWindow,
    ReaderHistoryWindow,
    ReaderTimerWindow,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  props: {
    now: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    showSideBar: true,
    miniSideBar: true,
    layout: [],
    colNum: 12,
    index: 0,
    windows: [],
  }),
  created() {
    this.addReaderTimer()
    this.addReaderHistory()
    this.addReaderSpotStatistics()
  },
  methods: {
    addReaderTimer() {
      this.addItem('READER_TIMER', 3, 4)
    },
    addReaderHistory() {
      this.addItem('READER_HISTORY', 3, 12)
    },
    addReaderSpotStatistics() {
      this.addItem('READER_SPOT_STATISTICS', 3, 12, 3, 0)
    },
    addItem(type, w, h, x = 0, y = 0) {
      // Add a new item. It must have a unique key!
      this.layout.push({
        x: x, //(this.layout.length * 2) % (this.colNum || 12),
        y: y, //this.layout.length + (this.colNum || 12), // puts it at the bottom
        w: w,
        h: h,
        i: this.index,
      })
      // Increment the counter to ensure key is always unique.
      this.index++
      this.windows.push({ type })
    },
    removeItem(val) {
      const index = this.layout.map(item => item.i).indexOf(val)
      this.layout.splice(index, 1)
      this.windows.splice(index, 1)
    },
  },
}
</script>

<style scoped lang="sass">
@import "~@/styles/RcVariables"

::v-deep .vue-grid-item.vue-grid-placeholder
  background: gray

.screen
  height: 100%

.window-wrapper
  height: 100%
  width: 100%

.vue-grid-layout
  height: calc(100vh - #{ $top-system-bar-padding})
  overflow-y: hidden
  background: rgba(117, 117, 117, 0.5)
</style>
