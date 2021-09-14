<template>
  <div class="window">
    <v-system-bar class="window-top-bar rounded-t">
      <span class="mx-1">本地历史记录</span>
      <v-spacer />
      <v-btn @click="close" x-small text>
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-system-bar>
    <div class="window-content">
      <reader-spot-statistics :now="now" />
    </div>
  </div>
</template>

<script>
import ReaderSpotStatistics from '@/entries/reader/views/ReaderSpotStatistics'

export default {
  name: 'ReaderSpotStatisticsWindow',
  components: { ReaderSpotStatistics },
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

<style scoped lang="sass">
@import "~@/styles/RcVariables"

.window
  height: 100%

.window-content
  height: calc(100% - #{ $top-system-bar-padding })
  overflow-y: scroll

.window-top-bar
  -webkit-app-region: none
</style>
