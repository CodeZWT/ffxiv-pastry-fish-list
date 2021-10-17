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
  >
    <v-sheet
      v-if="dragging && dragPlaceholder"
      :color="'background'"
      class="drag-placeholder d-flex fill-height align-center justify-center"
    >
      <div style="font-size: x-large">{{ title }}</div>
    </v-sheet>
    <v-sheet
      v-else
      :class="{
        'window-wrapper': true,
        rounded: true,
        'elevation-4': !frameless,
      }"
      :color="frameless ? 'transparent' : 'background'"
    >
      <slot name="header" v-if="!frameless">
        <v-system-bar class="rounded-t" style="-webkit-app-region: none">
          <span class="mx-1">{{ title }}</span>
          <span class="mx-1" v-if="isMobile">mobile</span>
          <v-spacer />
          <div class="dr-drag-cancel">
            <slot name="header-buttons"> </slot>
            <v-btn @click.stop="handleCloseWindow" x-small text>
              <v-icon>mdi-window-close</v-icon>
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
    </v-sheet>
  </vue-draggable-resizable>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import VueDraggableResizable from 'vue-draggable-resizable'

export default {
  name: 'ScreenWindow',
  components: { VueDraggableResizable },
  props: {
    id: {
      type: String,
      default: undefined,
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
      active: false,
    }
  },
  computed: {
    ...mapState('screenWindow', ['dragging']),
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
    height: calc(100% - #{ $top-system-bar-padding })
</style>
