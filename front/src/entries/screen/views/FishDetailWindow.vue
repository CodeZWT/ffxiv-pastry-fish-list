<template>
  <screen-window
    :id="id"
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :z="item.z"
    :opacity="item.opacity"
    title="鱼详情"
  >
    <template>
      <fish-detail-page :fish="fish" :now="now" />
    </template>
  </screen-window>
</template>

<script>
import FishDetailPage from '@/entries/main/views/FishDetailPage'
import ScreenWindow from '@/components/basic/screen/ScreenWindow'
import WindowMixin from '@/components/basic/screen/WindowMixin'

export default {
  name: 'FishDetailWindow',
  mixins: [WindowMixin],
  components: { ScreenWindow, FishDetailPage },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
    now: {
      type: Number,
      default: Date.now(),
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="sass"></style>
