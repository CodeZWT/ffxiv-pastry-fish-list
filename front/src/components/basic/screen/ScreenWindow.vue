<template>
  <vue-draggable-resizable
    :w="w"
    :h="h"
    :x="x"
    :y="y"
    :z="z"
    @dragging="onDrag"
    @resizing="onResize"
    @dragstop="onDragStop"
    :active.sync="active"
    @click.native="onActivated"
    :parent="true"
    :resizable="resizable"
    className="dr-wrapper"
    classNameHandle="dr-handle"
    drag-cancel=".dr-drag-cancel"
    style="-webkit-user-select: none"
    v-resize="onWindowResize"
  >
    <v-sheet
      v-if="dragging && dragPlaceholder"
      :color="'background'"
      class="drag-placeholder d-flex fill-height align-center justify-center"
    >
      <div style="font-size: x-large">{{ title }}</div>
    </v-sheet>
    <v-sheet
      v-show="!dragging || !dragPlaceholder"
      :class="{
        'window-wrapper': true,
        rounded: true,
        'elevation-4': !frameless,
      }"
      :style="`opacity: ${opacity}`"
      :color="frameless ? 'transparent' : 'background'"
    >
      <slot name="header" v-if="!frameless">
        <v-system-bar class="rounded-t" style="-webkit-app-region: none">
          <span class="mx-1">{{ title }}</span>
          <!-- <span class="mx-1">{{ z }}</span> -->
          <template v-if="showTime">
            <v-spacer />
            <div class="mr-1"><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
            <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
          </template>
          <v-spacer />
          <div class="dr-drag-cancel">
            <slot name="header-buttons"> </slot>
            <v-btn @click.stop="handleCloseWindow" x-small text>
              <v-icon>{{ mdiWindowClose }}</v-icon>
            </v-btn>
          </div>
        </v-system-bar>
      </slot>
      <div
        :class="{
          'window-content': true,
          'window-content--normal': !frameless,
          'dr-drag-cancel': !frameless,
        }"
      >
        <slot></slot>
      </div>

      <resize-indicator v-if="resizable" @mouseover.native="onActivated" />
    </v-sheet>
  </vue-draggable-resizable>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { mdiWindowClose } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import EorzeaTime from '@/utils/Time'
import ResizeIndicator from '@/components/basic/ResizeIndicator'
import VueDraggableResizable from 'vue-draggable-resizable'

export default {
  name: 'ScreenWindow',
  components: { ResizeIndicator, VueDraggableResizable },
  props: {
    id: {
      type: String,
      default: undefined,
    },
    showTime: {
      type: Boolean,
      default: false,
    },
    w: {
      type: Number,
      default: 200,
    },
    h: {
      type: Number,
      default: 200,
    },
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    z: {
      type: Number,
      default: 0,
    },
    opacity: {
      type: Number,
      default: 1,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: '',
    },
    frameless: {
      type: Boolean,
      default: false,
    },
    // show dragging placeholder when any window dragging
    dragPlaceholder: {
      type: Boolean,
      default: false,
    },
    resizable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      mdiWindowClose,
      active: false,
    }
  },
  computed: {
    ...mapState(['now']),
    ...mapState('screenWindow', ['dragging']),
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return DataUtil.formatDateTime(this.now, 'HH:mm')
    },
  },
  mounted() {
    this.updateWindowLayout({
      id: this.id,
      w: this.w,
      h: this.h,
      x: this.x,
      y: this.y,
      z: this.z,
    })
  },
  methods: {
    ...mapMutations('screenWindow', [
      'updateWindowLayout',
      'startDragging',
      'stopDragging',
      'closeWindow',
      'activeWindow',
    ]),
    handleCloseWindow() {
      this.closeWindow(this.id)
    },
    onResize(x, y, w, h) {
      this.updateWindowLayout({
        id: this.id,
        w: w,
        h: h,
        isMobile: w < this.$vuetify.breakpoint.thresholds.xs,
      })
    },
    onDrag(x, y) {
      this.startDragging()
      this.updateWindowLayout({
        id: this.id,
        x: x,
        y: y,
      })
    },
    onDragStop() {
      this.stopDragging()
    },
    onActivated() {
      this.active = true
      this.activeWindow(this.id)
    },
    onWindowResize() {
      this.updateWindowLayout({
        id: this.id,
        x: Math.max(0, Math.min(this.x, window.innerWidth - this.w)),
        y: Math.max(0, Math.min(this.y, window.innerHeight - this.h)),
      })
    },
  },
}
</script>

<style scoped>
@import '~vue-draggable-resizable/dist/VueDraggableResizable.css';
</style>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.drag-placeholder
  height: 100%
  width: 100%

.dr-wrapper
  position: absolute

::v-deep
  .dr-handle
    position: absolute

  .dr-handle-br
    width: 0
    position: absolute
    height: 0
    right: 0
    bottom: 0
    border-bottom: 8px solid #bbb5b5
    border-left: 8px solid transparent
    cursor: se-resize
    z-index: 10

.window-wrapper
  height: 100%
  width: 100%

.window-content
  overflow-y: auto
  &--normal
    height: calc(100% - #{ $system-bar-height })
</style>
