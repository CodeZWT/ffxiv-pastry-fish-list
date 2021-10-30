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
    <template v-slot:header-buttons>
      <v-btn @click="toggleSetting" x-small text>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>
    <reader-history :lazyTransformedFishDict="lazyTransformedFishDict" />
  </screen-window>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ReaderHistory from '@/entries/reader/views/ReaderHistory'
import ScreenWindow from '@/components/basic/screen/ScreenWindow'
import WindowMixin from '@/components/basic/screen/WindowMixin'

export default {
  name: 'ReaderHistoryWindow',
  mixins: [WindowMixin],
  components: { ScreenWindow, ReaderHistory },
  props: ['lazyTransformedFishDict'],
  computed: {
    ...mapState('readerHistory', ['showConfig']),
  },
  methods: {
    ...mapMutations('readerHistory', ['setStates']),
    toggleSetting() {
      this.setStates({
        showConfig: !this.showConfig,
      })
    },
  },
}
</script>

<style scoped lang="sass"></style>
