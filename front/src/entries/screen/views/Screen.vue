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
    <div class="py-0 ml-14" style="height: 100%">
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
      >
        <grid-item
          v-for="item in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
        >
          <v-sheet class="window-wrapper rounded elevation-4" color="background">
            <reader-timer-window :now="now" @close="() => removeItem(item.i)" />
          </v-sheet>
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import ReaderTimerWindow from '@/entries/screen/views/ReaderTimerWindow'

export default {
  name: 'Screen',
  components: {
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
  },
  methods: {
    addReaderTimer() {
      this.addItem(3, 4)
    },
    addItem: function(w, h) {
      // Add a new item. It must have a unique key!
      this.layout.push({
        x: 0, //(this.layout.length * 2) % (this.colNum || 12),
        y: 0, //this.layout.length + (this.colNum || 12), // puts it at the bottom
        w: w,
        h: h,
        i: this.index,
      })
      // Increment the counter to ensure key is always unique.
      this.index++
    },
    removeItem: function(val) {
      const index = this.layout.map(item => item.i).indexOf(val)
      this.layout.splice(index, 1)
    },
  },
}
</script>

<style scoped lang="sass">
::v-deep .vue-grid-item.vue-grid-placeholder
  background: gray

.screen
  height: 100%

.window-wrapper
  height: 100%
  width: 100%
</style>
