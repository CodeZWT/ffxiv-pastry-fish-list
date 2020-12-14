<template>
  <div>
    <component
      :is="componentType"
      :voyages="voyages"
      :targetOptions="targetOptions"
      @filterChanged="filterChanged"
    />
  </div>
</template>

<script>
import OceanFishingTimeTableLarge from '@/components/OceanFishingTimeTable/OceanFishingTimeTableLarge'
import OceanFishingTimeTableSmall from '@/components/OceanFishingTimeTable/OceanFishingTimeTableSmall'

export default {
  name: 'OceanFishingTimeTable',
  components: { OceanFishingTimeTableSmall, OceanFishingTimeTableLarge },
  props: {
    voyages: {
      type: Array,
      default: () => [],
    },
    targetOptions: {
      type: Array,
      default: () => [],
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
  },
}
</script>

<style scoped></style>
