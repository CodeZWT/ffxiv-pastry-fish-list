<template>
  <div class="window">
    <v-system-bar class="window-top-bar rounded-t">
      <span class="mx-1">本地历史记录</span>
      <v-spacer />
      <v-btn @click="showSetting" x-small text>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn @click="close" x-small text>
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-system-bar>
    <div class="window-content">
      <reader-history :now="now" />
    </div>
  </div>
</template>

<script>
import ReaderHistory from '@/entries/reader/views/ReaderHistory'

export default {
  name: 'ReaderHistoryWindow',
  components: { ReaderHistory },
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
    showSetting() {
      // TODO show setting dialog directly
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
