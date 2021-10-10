<template>
  <screen-window
    :id="id"
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :z="item.z"
    title="本地历史记录"
  >
    <reader-spot-statistics :now="now" />
  </screen-window>
</template>

<script>
import ReaderSpotStatistics from '@/entries/reader/views/ReaderSpotStatistics'
import ScreenWindow from '@/components/basic/screen/ScreenWindow'
import WindowMixin from '@/components/basic/screen/WindowMixin'

export default {
  name: 'ReaderSpotStatisticsWindow',
  mixins: [WindowMixin],
  components: { ScreenWindow, ReaderSpotStatistics },
  props: {
    now: {
      type: Number,
      default: 0,
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
