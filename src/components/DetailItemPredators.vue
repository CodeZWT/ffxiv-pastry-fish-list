<template>
  <v-row column style="width: 100%">
    <v-col cols="12" class="mx-2">
      {{ $t('detail.predators.title') }}
    </v-col>
    <v-col cols="12">
      <div v-for="predator in value" :key="predator._id" style="position: relative">
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