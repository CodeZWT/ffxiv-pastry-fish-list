<template>
  <div class="inner">
    <template v-if="fish">
      <fish-list-expanded-header
        :value="fish"
        :fishing-spots="fishingSpots"
        :fish-time-part="fishTimePart"
        :show-close="showClose"
        @close="$emit('close')"
        @show-spot="
          $emit('show-spot', { spotId: $event, mode: isSpear ? 'spear' : 'normal' })
        "
      />
      <v-divider />
      <div
        :class="{
          'detail-header': inPane,
          'detail-header--web': inPane && !isElectron,
          'detail-header--electron': inPane && isElectron && !original,
          'detail-header--electron-original': inPane && isElectron && original,
        }"
      >
        <fish-detail-content
          ref="detailContent"
          :value="fish"
          :fishing-spots="fishingSpots"
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
import { mapGetters, mapState } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import FIX from 'Data/fix'
import FishDetailContent from '@/components/FishDetailContent'
import FishListExpandedHeader from '@/components/FishListExpandedHeader'
import placeNames from 'Data/placeNames'

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
    ...mapState(['window']),
    ...mapGetters(['getFishingSpots']),
    original() {
      return this.window === 'main'
    },
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
    isSpear() {
      return this.fish.gig != null
    },
    fishingSpots() {
      return this.isSpear
        ? this.fish.locations.map(location => {
            const gatheringPoint = FIX.SPEAR_FISH_GATHERING_POINTS[location]
            return {
              zone: placeNames[gatheringPoint.territoryPlaceNameId],
              fishingSpot: gatheringPoint,
              fishingSpotName: DataUtil.getName(gatheringPoint),
              fishingSpotId: location,
              fishSpotPositionText: DataUtil.toPositionText(gatheringPoint),
            }
          })
        : this.getFishingSpots(this.fish.locations)
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

$detail-header-height: 104px
$wrapper-detail: $detail-header-height + $divider-height

.inner
  width: 100%
  height: 100%

.detail-header
  overflow-scrolling: auto
  overflow-y: scroll
  &--web
    height: calc(100vh - #{ $wrapper-web + $wrapper-detail })
  &--electron
    height: calc(100% - #{ $wrapper-detail })
  &--electron-original
    height: calc(100vh - #{ $wrapper-desktop + $wrapper-detail })
</style>
