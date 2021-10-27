<template>
  <screen-window
    :id="id"
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :z="item.z"
    :opacity="item.opacity"
    title="本地历史记录"
  >
    <reader-history />
  </screen-window>
</template>

<script>
import ReaderHistory from '@/entries/reader/views/ReaderHistory'
import ScreenWindow from '@/components/basic/screen/ScreenWindow'
import WindowMixin from '@/components/basic/screen/WindowMixin'

export default {
  name: 'ReaderHistoryWindow',
  mixins: [WindowMixin],
  components: { ScreenWindow, ReaderHistory },
  methods: {},
}
</script>

<style scoped lang="sass"></style>
