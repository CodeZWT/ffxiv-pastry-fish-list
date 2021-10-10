<template>
  <div class="inner">
    <template v-if="fish">
      <fish-list-expanded-header
        :value="fish"
        :fish-time-part="fishTimePart"
        :show-close="inPane || showClose"
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
          :forceShowComponents="forceShowComponents"
          :hide-map="hideMap"
          @close-dialog="$emit('close-dialog')"
        ></fish-detail-content>
      </div>
    </template>
    <template v-else>
      <div class="d-flex fill-height align-center justify-center">
        <div class="d-flex align-center">
          <v-icon x-large>mdi-fish</v-icon>
          <div>请选择鱼以显示详情</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import FishDetailContent from '@/components/FishDetailContent'
import FishListExpandedHeader from '@/components/FishListExpandedHeader'

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
    showClose: {
      type: Boolean,
      default: false,
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
      this.$refs.detailContent?.resize()
    },
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.inner
  width: 100%
  height: 100%

.detail-header
  overflow-scrolling: auto
  overflow-y: scroll
  &--web
    height: calc(100vh - #{ $top-bars-padding + $footer-padding + $detail-header-height + $divider-height})
  &--electron
    height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding + $detail-header-height + $divider-height})
</style>
