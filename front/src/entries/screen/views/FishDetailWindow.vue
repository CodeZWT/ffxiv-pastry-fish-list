<template>
  <div class="window">
    <v-system-bar class="window-top-bar rounded-t vue-draggable-handle">
      <span class="mx-1">鱼详情</span>
      <v-spacer />
      <v-btn @click="close" x-small text>
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-system-bar>
    <div class="window-content no-drag">
      <fish-detail-page :fish="fish" :now="now" />
    </div>
  </div>
</template>

<script>
import FishDetailPage from '@/entries/main/views/FishDetailPage'

export default {
  name: 'FishDetailWindow',
  components: { FishDetailPage },
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
