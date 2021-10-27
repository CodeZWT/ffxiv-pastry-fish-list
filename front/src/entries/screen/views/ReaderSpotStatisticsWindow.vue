<template>
  <screen-window
    :id="id"
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :z="item.z"
    :opacity="item.opacity"
    title="本地钓场统计"
  >
    <reader-spot-statistics />
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
}
</script>

<style scoped lang="sass"></style>
