<template>
  <v-row column style="width: 100%" no-gutters>
    <template v-if="fish.hasShadowPredators">
      <div class="pl-2 subheader--text">
        {{ $t('detail.shadowPredators.title') }}
      </div>
      <v-col cols="12">
        <div
          v-for="(predator, index) in fish.shadowPredators"
          :key="predator._id"
          style="position: relative"
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
      <div class="pl-2 subheader--text">
        {{ $t('detail.predators.title') }}
      </div>
      <v-col cols="12">
        <div
          v-for="(predator, index) in fish.predators"
          :key="predator._id"
          style="position: relative"
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
