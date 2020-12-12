<template>
  <div>
    <component :is="componentType" :voyages="voyages" />
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
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    componentType() {
      return this.isMobile ? 'OceanFishingTimeTableSmall' : 'OceanFishingTimeTableLarge'
    },
  },
}
</script>

<style scoped></style>
