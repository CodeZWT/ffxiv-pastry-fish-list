<template>
  <v-layout column>
    <v-row v-for="predator in value" :key="predator._id">
      <fish-list-brief-header :value="predator" :fish-time-part="predator.fishTimePart" />
    </v-row>
  </v-layout>
</template>

<script>
import FishListBriefHeader from '@/components/FishListBriefHeader'
export default {
  name: 'FishPredators',
  components: { FishListBriefHeader },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped></style>
