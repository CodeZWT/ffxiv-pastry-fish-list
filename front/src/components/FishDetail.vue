<template>
  <div class="wrapper inner">
    <template v-if="fish">
      <div style="position: sticky; top: 0; z-index: 5" class="inner">
        <fish-list-expanded-header
          :value="fish"
          :fishing-spots="fishingSpots"
          :fish-time-part="fishTimePart"
          :show-close="showClose"
          :show-spot-button="showSpotButton"
          @close="$emit('close')"
          @show-spot="
            $emit('show-spot', { spotId: $event, mode: isSpear ? 'spear' : 'normal' })
          "
        />
        <v-divider />
      </div>
      <fish-detail-content
        ref="detailContent"
        :value="fish"
        :fishing-spots="fishingSpots"
        :fish-time-part="fishTimePart"
        :fish-weather-change-part="fishWeatherChangePart"
        :predators="predators"
        :shadow-predators="shadowPredators"
        :forceShowComponents="forceShowComponents"
        :hide-map="hideMap"
        @close-dialog="$emit('close-dialog')"
      ></fish-detail-content>
    </template>
    <template v-else>
      <div class="d-flex fill-height align-center justify-center">
        <div class="d-flex align-center">
          <v-icon x-large>{{ mdiFish }}</v-icon>
          <div>请选择鱼以显示详情</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { mdiFish } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import EnvMixin from '@/components/basic/EnvMixin'
import FIX from 'Data/fix'
import FishDetailContent from '@/components/FishDetailContent'
import FishListExpandedHeader from '@/components/FishListExpandedHeader'
import placeNames from 'Data/locale/placeNames'

export default {
  name: 'FishDetail',
  mixins: [EnvMixin],
  components: { FishListExpandedHeader, FishDetailContent },
  props: {
    showSpotButton: {
      type: Boolean,
      default: false,
    },
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
      mdiFish,
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
    shadowPredators() {
      return this.fish?.parts?.shadowPredators ?? []
    },
    isSpear() {
      return this.fish.gig != null
    },
    fishingSpots() {
      return this.isSpear
        ? this.fish.locations.map(location => {
            const gatheringPoint = FIX.SPEAR_FISH_GATHERING_POINTS[location]
            return {
              zone: DataUtil.getName(placeNames[gatheringPoint.territoryPlaceNameId]),
              fishingSpot: gatheringPoint,
              fishingSpotName: DataUtil.getName(placeNames[gatheringPoint.placeNameId]),
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
.wrapper
  position: relative
  height: auto
  min-height: 100%
</style>
