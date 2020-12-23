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
    :hide-spot-column="hideSpotColumn"
    :is-last="isLast"
    @click="$emit('click', $event)"
  />
</template>

<script>
import FishInfoRowLarge from '@/components/FishInfoRow/FishInfoRowLarge'
import FishInfoRowMedium from '@/components/FishInfoRow/FishInfoRowMedium'
import FishInfoRowSmall from '@/components/FishInfoRow/FishInfoRowSmall'

export default {
  props: [
    'fish',
    'fishTimePart',
    'predators',
    'inPredator',
    'color',
    'showDivider',
    'mode',
    'hideSpotColumn',
    'isLast',
  ],
  name: 'FishInfoRow',
  components: { FishInfoRowSmall, FishInfoRowMedium, FishInfoRowLarge },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    component() {
      const mode = this.mode ?? (this.isMobile ? 'small' : 'large')
      switch (mode) {
        case 'large':
          return 'FishInfoRowLarge'
        case 'medium':
          return 'FishInfoRowMedium'
        case 'small':
          return 'FishInfoRowSmall'
        default:
          return 'FishInfoRowLarge'
      }
    },
  },
}
</script>

<style scoped></style>
