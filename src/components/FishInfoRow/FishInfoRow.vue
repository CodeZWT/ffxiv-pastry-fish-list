<template>
  <FishInfoRowPC
    v-if="!isMobile"
    :fish="fish"
    :fishTimePart="fishTimePart"
    :predators="predators"
    :inPredator="inPredator"
    :color="color"
    :showDivider="showDivider"
    :mode="mode"
    :showConstraintsInstead="showConstraintsInstead"
  />
  <FishInfoRowMobile
    v-else
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

export default {
  props: ['fish', 'fishTimePart', 'predators', 'inPredator', 'color', 'showDivider', 'mode', 'showConstraintsInstead'],
  name: 'FishInfoRow',
  components: { FishInfoRowMobile, FishInfoRowPC },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
  },
}
</script>

<style scoped></style>
