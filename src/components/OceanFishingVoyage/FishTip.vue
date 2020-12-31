<template>
  <div>
    <div class="text-subtitle-1">
      {{ fish.name }}
    </div>
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
      <v-card-text class="d-flex justify-center" style="position:relative;">
        <fish-bait-list :baits="fish.baits" :target="fish" />
        <div
          v-if="fish.hasWeatherConstraint || fish.hasRealWeatherConstraint"
          style="position: absolute; right: 4px; bottom: 4px"
        >
          <fish-weather-not-available :item="fish" />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import FishBaitList from '@/components/FishBaitList'
import FishWeatherNotAvailable from '@/components/OceanFishingFishList/FishWeatherNotAvailable'
export default {
  name: 'FishTip',
  components: { FishWeatherNotAvailable, FishBaitList },
  props: {
    fish: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped></style>
