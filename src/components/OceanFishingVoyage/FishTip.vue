<template>
  <div class="my-2">
    <!--    <div class="text-subtitle-1">-->
    <!--      {{ fish.name }}-->
    <!--    </div>-->
    <v-card color="system">
      <v-card-text class="d-flex justify-center align-center" style="position:relative;">
        <div class="d-flex mr-2">
          <div>{{ fish.biteTimeMin }}s</div>
          <div v-if="fish.biteTimeMax">-{{ fish.biteTimeMax }}s</div>
        </div>
        <fish-bait-list :baits="fish.baits" :target="fish" />
        <div style="position: absolute; top: 0; left: 0">
          <v-chip label class="rounded-tr-0 rounded-br-lg rounded-bl-0">
            {{ fish.name }}
          </v-chip>
        </div>
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
            <fish-weather-not-available :item="fish" dense />
          </v-chip>
        </div>
      </v-card-text>
      <div v-if="fish.hasPredators" class="background pt-2">
        <div class="d-flex justify-center align-center">
          <!--          <v-icon small>mdi-arrow-down</v-icon>-->
          <div>前置鱼</div>
          <!--          <div :class="fish.predatorsIcon" style="margin-left: 2px" />-->
        </div>
        <v-card-text
          v-for="(predator, index) in fish.predators"
          :key="index"
          class="d-flex justify-center align-center item-border"
          style="position: relative"
        >
          <div class="d-flex mr-2">
            <div>{{ predator.biteTimeMin }}s</div>
            <div v-if="predator.biteTimeMax">-{{ predator.biteTimeMax }}s</div>
          </div>
          <fish-bait-list :baits="predator.baits" :target="predator" />
          <div style="position: absolute; top: 0; left: 0">
            <v-chip label class="rounded-t-0 rounded-br-lg rounded-bl-0">
              {{ predator.name }}
            </v-chip>
          </div>
          <div
            v-if="predator.hasWeatherConstraint || predator.hasRealWeatherConstraint"
            style="position: absolute; right: 0; bottom: 0"
          >
            <!--            <v-chip label class="rounded-bl-0 rounded-tl-lg rounded-tr-0" color="error">-->
            <!--              <fish-weather-not-available :item="predator" dense />-->
            <!--            </v-chip>-->
          </div>
        </v-card-text>
      </div>
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

<style lang="sass" scoped>
.item-border
  border-width: 1px 0 0 0
  border-color: #272727
  border-style: solid
</style>
