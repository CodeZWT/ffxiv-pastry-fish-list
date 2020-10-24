<template>
  <div>
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
        <fish-list-item-content
          ref="detailContent"
          :value="fish"
          :fish-time-part="fishTimePart"
          :fish-weather-change-part="fishWeatherChangePart"
          :predators="predators"
        ></fish-list-item-content>
      </div>
    </template>
    <template v-else>
      empty
    </template>
  </div>
</template>

<script>
import FishListItemContent from '@/components/FishListItemContent'
import FishListExpandedHeader from '@/components/FishListExpandedHeader'

export default {
  name: 'FishDetail',
  components: { FishListExpandedHeader, FishListItemContent },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
    inPane: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    fishTimePart() {
      return this.fish?.parts?.fishTimePart ?? {}
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