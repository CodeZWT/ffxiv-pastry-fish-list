<template>
  <div style="background-color: #272727">
    <template v-if="fish">
      <div>
        <fish-list-expanded-header
          :value="fish"
          :fish-time-part="fishTimePart"
          :show-close="inPane"
          @close="$emit('close')"
        />
      </div>
      <div :class="{ 'detail-header': inPane }">
        <fish-detail-content
          ref="detailContent"
          :value="fish"
          :fish-time-part="fishTimePart"
          :fish-weather-change-part="fishWeatherChangePart"
          :predators="predators"
          :now="now"
          :forceShowComponents="forceShowComponents"
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
  },
  computed: {
    fishTimePart() {
      return this.fish?.parts?.fishTimePart ?? { countDown: { type: DataUtil.ALL_AVAILABLE } }
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
@import "../styles/RcVariables"

.detail-header
  height: calc(100vh - #{ $top-bars-padding + $footer-padding + $detail-header-height})
  overflow-scrolling: auto
  overflow-y: scroll
</style>
