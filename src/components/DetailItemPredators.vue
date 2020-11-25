<template>
  <v-row column style="width: 100%" no-gutters>
    <v-col cols="12" class="px-2">
      {{ $t('detail.predators.title') }}
    </v-col>
    <v-col cols="12">
      <div v-for="(predator, index) in fish.predators" :key="predator._id" style="position: relative">
        <v-divider v-if="index > 0" inset style="border-color: white" />
        <fish-info-row
          :fish="predator"
          :fish-time-part="predator.fishTimePart"
          :in-predator="true"
          mode="medium"
          :hide-spot-column="true"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import FishInfoRow from '@/components/FishInfoRow/FishInfoRow'
import { mapGetters } from 'vuex'

export default {
  name: 'DetailItemPredators',
  components: { FishInfoRow },
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
