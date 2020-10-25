<template>
  <v-row column style="width: 100%" no-gutters>
    <v-col cols="12" class="px-2">
      {{ $t('detail.predators.title') }}
    </v-col>
    <v-col cols="12">
      <div v-for="(predator, index) in fish.predators" :key="predator._id" style="position: relative">
        <v-divider v-if="index > 0" inset style="border-color: white"/>
        <fish-list-brief-header :fish="predator" :fish-time-part="predator.fishTimePart" in-predator :mode="mode" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import FishListBriefHeader from '@/components/FishListBriefHeader'
import { mapGetters } from 'vuex'

export default {
  name: 'DetailItemPredators',
  components: { FishListBriefHeader },
  props: {
    fish: {
      type: Object,
      default: undefined,
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