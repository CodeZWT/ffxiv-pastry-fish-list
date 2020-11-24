<template>
  <component
    :is="component"
    :fish="fish"
    :fishTimePart="fishTimePart"
    :predators="predators"
    :inPredator="inPredator"
    :color="color"
    :showDivider="showDivider"
    :mode="mode"
    :showConstraintsInstead="showConstraintsInstead"
  />
</template>

<script>
import FishInfoRowPC from '@/components/FishInfoRow/FishInfoRowPC'
import FishInfoRowMobile from '@/components/FishInfoRow/FishInfoRowMobile'
import FishInfoRowMedium from '@/components/FishInfoRow/FishInfoRowMedium'

export default {
  props: ['fish', 'fishTimePart', 'predators', 'inPredator', 'color', 'showDivider', 'mode', 'showConstraintsInstead'],
  name: 'FishInfoRow',
  components: { FishInfoRowMobile, FishInfoRowPC, FishInfoRowMedium },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    component() {
      const mode = this.mode ?? this.isMobile() ? 'small' : 'large'
      switch (mode) {
        case 'large':
          return 'FishInfoRowPC'
        case 'medium':
          return 'FishInfoRowMedium'
        case 'small':
          return 'FishInfoRowMobile'
        default:
          return 'FishInfoRowPC'
      }
    },
  },
}
</script>

<style scoped></style>
