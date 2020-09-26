<template>
  <v-layout column style="width: 100%" class="mt-2">
    <div v-for="predator in value" :key="predator._id">
      <fish-list-brief-header :value="predator" :fish-time-part="predator.fishTimePart" in-predator />
    </div>
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
