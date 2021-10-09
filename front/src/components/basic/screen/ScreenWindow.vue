<template>
  <vue-draggable-resizable
    :w="w"
    :h="h"
    :x="x"
    :y="y"
    @dragging="onDrag"
    @resizing="onResize"
    @dragstop="onDragStop"
    :parent="true"
    className="dr-wrapper"
    classNameHandle="dr-handle"
  >
    <v-sheet v-if="dragging" color="background" class="drag-placeholder">
      dragging
    </v-sheet>
    <slot v-else></slot>
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
  },
  data() {
    return {}
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
    ]),
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
  },
}
</script>

<style scoped>
@import '~vue-draggable-resizable/dist/VueDraggableResizable.css';
</style>

<style lang="sass" scoped>
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
    border-bottom: 8px solid grey
    border-left: 8px solid transparent
    cursor: se-resize
</style>
