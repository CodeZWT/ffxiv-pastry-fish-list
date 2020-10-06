<template>
  <v-layout column style="width: 100%">
    <div v-for="predator in value" :key="predator._id" style="position: relative">
      <fish-list-brief-header :value="predator" :fish-time-part="predator.fishTimePart" in-predator :mode="mode" />
    </div>
  </v-layout>
</template>

<script>
import FishListBriefHeader from '@/components/FishListBriefHeader'
import { mapGetters } from 'vuex'

export default {
  name: 'FishPredators',
  components: { FishListBriefHeader },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    mode: {
      type: String,
      default: 'CONTENT',
    },
  },
  computed: {
    ...mapGetters(['getFishCompleted']),
  },
}
</script>

<style scoped></style>