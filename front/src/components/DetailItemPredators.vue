<template>
  <v-row column style="width: 100%; background-color: #1e1e1e" no-gutters>
    <template v-if="fish.hasShadowPredators">
      <v-subheader>
        {{ $t('detail.shadowPredators.title') }}
      </v-subheader>
      <v-col cols="12">
        <div
          v-for="(predator, index) in fish.shadowPredators"
          :key="predator._id"
          style="position: relative"
          class="px-4"
        >
          <v-divider v-if="index > 0" style="border-color: grey" />
          <fish-info-row
            :fish="predator"
            :fish-time-part="predator.fishTimePart"
            :in-predator="true"
            mode="medium"
            :hide-spot-column="true"
          />
        </div>
      </v-col>
    </template>
    <template v-if="fish.hasPredators">
      <v-subheader>
        {{ $t('detail.predators.title') }}
      </v-subheader>
      <v-col cols="12">
        <div
          v-for="(predator, index) in fish.predators"
          :key="predator._id"
          style="position: relative"
          class="px-4"
        >
          <v-divider v-if="index > 0" style="border-color: grey" />
          <fish-info-row
            :fish="predator"
            :fish-time-part="predator.fishTimePart"
            :in-predator="true"
            mode="medium"
            :hide-spot-column="true"
          />
        </div>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import FishInfoRow from '@/components/FishInfoRow/FishInfoRow'

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
