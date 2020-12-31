<template>
  <div>
    <v-subheader>{{ fish.name }}</v-subheader>
    <template v-if="fish.hasPredators">
      <v-card color="system">
        <v-card-text class="d-flex justify-center">
          <div class="d-flex align-center">
            <div>
              <div
                v-for="predator in fish.predators"
                :key="predator.id"
                class="d-flex align-center"
              >
                <fish-bait-list :baits="predator.baits" :target="predator" />
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <div class="d-flex justify-center my-1">
        <v-icon small>mdi-arrow-down</v-icon>
        <div :class="fish.predatorsIcon" style="margin-left: 2px" />
      </div>
    </template>
    <v-card :color="fish.hasPredators ? 'info' : 'system'">
      <v-card-text class="d-flex justify-center">
        <fish-bait-list :baits="fish.baits" :target="fish" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import FishBaitList from '@/components/FishBaitList'
export default {
  name: 'FishTip',
  components: { FishBaitList },
  props: {
    fish: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped></style>
