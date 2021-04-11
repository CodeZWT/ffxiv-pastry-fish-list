<template>
  <div>
    <component
      :is="componentType"
      :voyages="voyages"
      :targetOptions="targetOptions"
      :voyageN="voyageN"
      :targets="targets"
      :hide-filters="hideFilters"
      @filterChanged="filterChanged"
      @voyage-selected="onVoyageSelected"
      :show-current-route-indicator="showCurrentRouteIndicator"
    />
  </div>
</template>

<script>
import OceanFishingTimeTableLarge from '@/components/OceanFishing54/OceanFishingTimeTable/OceanFishingTimeTableLarge'
import OceanFishingTimeTableSmall from '@/components/OceanFishing54/OceanFishingTimeTable/OceanFishingTimeTableSmall'

export default {
  name: 'OceanFishingTimeTable',
  components: { OceanFishingTimeTableSmall, OceanFishingTimeTableLarge },
  props: {
    targets: {
      type: Array,
      default: undefined,
    },
    voyageN: {
      type: Number,
    },
    voyages: {
      type: Array,
      default: () => [],
    },
    targetOptions: {
      type: Array,
      default: () => [],
    },
    hideFilters: {
      type: Boolean,
      default: false,
    },
    showCurrentRouteIndicator: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    componentType() {
      return this.isMobile ? 'OceanFishingTimeTableSmall' : 'OceanFishingTimeTableLarge'
    },
  },
  methods: {
    filterChanged(filter) {
      this.$emit('filterChanged', filter)
    },
    onVoyageSelected(voyage) {
      this.$emit('voyage-selected', voyage)
    },
  },
}
</script>

<style scoped></style>
