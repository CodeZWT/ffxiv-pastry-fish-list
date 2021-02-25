<template>
  <div>
    <div class="meter rounded" style="display: flex">
      <div
        :class="`range-block ${color}`"
        :style="`left: ${left}%; width: ${length}%;`"
      ></div>
      <div class="range-block black--text" :style="`left: ${left}%;`">
        {{ text }}
      </div>
      <div
        class="range-block pointer"
        :style="`left: ${pointerPos}%; width: ${pointerWidth}%;`"
      ></div>
    </div>
  </div>
</template>

<script>
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'TimelineRow',
  props: {
    text: {
      type: String,
      default: 'placeholder',
    },
    pointer: {
      type: Number,
      default: 30,
    },
    start: {
      type: Number,
      default: 0,
    },
    end: {
      type: Number,
      default: 60,
    },
    min: {
      type: Number,
      default: 20,
    },
    max: {
      type: Number,
      default: 35,
    },
    tug: {
      type: String,
      default: 'heavy',
    },
    pointerWidth: {
      type: Number,
      default: 0.5,
    },
  },
  computed: {
    total() {
      return this.end - this.start
    },
    left() {
      return (this.min / this.total) * 100
    },
    length() {
      return Math.max(((this.max - this.min) / this.total) * 100, 0.5)
    },
    color() {
      return DataUtil.TUG_ICON_COLOR[DataUtil.TUG_ICON[this.tug]]
    },
    pointerPos() {
      return (this.pointer / this.total) * 100 - this.pointerWidth / 2
    },
  },
}
</script>

<style lang="sass" scoped>
.meter
  height: 25px
  position: relative
  background: #979dac

.range-block
  position: absolute
  height: 100%
  text-align: center

  &.pointer
    background: #ff006e
    box-shadow: 0 0 6px 2px #ff006e
</style>
