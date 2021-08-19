<template>
  <div class="inner">
    <template v-if="fish">
      <fish-list-expanded-header
        :value="fish"
        :fish-time-part="fishTimePart"
        :show-close="inPane"
        @close="$emit('close')"
      />
      <v-divider />
      <div
        :class="{
          'detail-header': inPane,
          'detail-header--web': inPane && !isElectron,
          'detail-header--electron': inPane && isElectron,
        }"
      >
        <fish-detail-content
          ref="detailContent"
          :value="fish"
          :fish-time-part="fishTimePart"
          :fish-weather-change-part="fishWeatherChangePart"
          :predators="predators"
          :now="now"
          :forceShowComponents="forceShowComponents"
          :hide-map="hideMap"
          @close-dialog="$emit('close-dialog')"
        ></fish-detail-content>
      </div>
    </template>
    <template v-else>
      empty
    </template>
  </div>
</template>

<script>
import FishDetailContent from '@/components/FishDetailContent'
import FishListExpandedHeader from '@/components/FishListExpandedHeader'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'

export default {
  name: 'FishDetail',
  components: { FishListExpandedHeader, FishDetailContent },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
    inPane: {
      type: Boolean,
      default: false,
    },
    now: {
      type: Number,
      default: Date.now(),
    },
    forceShowComponents: {
      type: Array,
      default: undefined,
    },
    hideMap: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isElectron: DevelopmentModeUtil.isElectron(),
    }
  },
  computed: {
    fishTimePart() {
      return (
        this.fish?.parts?.fishTimePart ?? { countDown: { type: DataUtil.ALL_AVAILABLE } }
      )
    },
    fishWeatherChangePart() {
      return this.fish?.parts?.fishWeatherChangePart ?? {}
    },
    predators() {
      return this.fish?.parts?.predators ?? []
    },
  },
  methods: {
    resize() {
      this.$refs.detailContent.resize()
    },
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.detail-header
  overflow-scrolling: auto
  overflow-y: scroll
  &--web
    height: calc(100vh - #{ $top-bars-padding + $footer-padding + $detail-header-height})
  &--electron
    height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding + $detail-header-height})
</style>
