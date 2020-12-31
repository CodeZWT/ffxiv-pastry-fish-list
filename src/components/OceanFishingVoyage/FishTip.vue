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
      <v-card-text class="d-flex justify-center align-center" style="position:relative;">
        <div v-if="showPointTip || showAchievementTip" class="d-flex mr-2">
          <div>{{ fish.biteTimeMin }}s</div>
          <div v-if="fish.biteTimeMax">-{{ fish.biteTimeMax }}s</div>
        </div>
        <fish-bait-list :baits="fish.baits" :target="fish" />
        <div
          v-if="showPointTip"
          style="position: absolute; top: 0; right: 0"
          title="渔分 x 双提个数"
        >
          <v-chip label class="rounded-tl-0 rounded-bl-lg rounded-br-0" color="primary">
            {{ fish.points }} x {{ fish.doubleHook.join(',') }}
          </v-chip>
        </div>
        <div
          v-else-if="showAchievementTip"
          style="position: absolute; top: 0; right: 0"
          title="双提个数"
        >
          <v-chip label class="rounded-tl-0 rounded-bl-lg rounded-br-0" color="primary">
            {{ fish.doubleHook.join(',') }}
          </v-chip>
        </div>
        <div
          v-if="fish.hasWeatherConstraint || fish.hasRealWeatherConstraint"
          style="position: absolute; right: 0; bottom: 0"
        >
          <v-chip label class="rounded-bl-0 rounded-tl-lg rounded-tr-0" color="error">
            <fish-weather-not-available :item="fish" />
          </v-chip>
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
    showPointTip: {
      type: Boolean,
      default: false,
    },
    showAchievementTip: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped></style>
