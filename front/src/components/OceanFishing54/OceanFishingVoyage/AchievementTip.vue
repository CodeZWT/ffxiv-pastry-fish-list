<template>
  <div>
    <v-card outlined class="mt-2">
      <v-card-title>
        <div class="d-flex justify-center">
          <div>{{ location.name }}</div>
          <v-icon>{{ location.icon }}</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-if="normalFish.length === 0">无</div>
        <div v-else v-for="(fish, index) in normalFish" :key="index">
          <fish-tip :fish="fish" show-achievement-tip />
        </div>
      </v-card-text>
    </v-card>

    <v-card outlined color="info" class="mt-2">
      <v-card-title>
        <div class="d-flex justify-center">
          <div>{{ location.name }}幻海流</div>
          <v-icon>{{ location.icon }}</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-if="spectralCurrentFish.length === 0">无</div>
        <div v-else v-for="(fish, index) in spectralCurrentFish" :key="index">
          <fish-tip :fish="fish" show-achievement-tip />
        </div>
      </v-card-text>
    </v-card>

    <v-card outlined class="mt-2">
      <v-card-subtitle>
        <div class="d-flex">
          <a :href="oceanFishTipReference.link" target="_blank">
            {{ oceanFishTipReference.title }}
          </a>
          <v-spacer />
          <div>
            {{ oceanFishTipReference.author }}
          </div>
        </div>
      </v-card-subtitle>
      <!-- <v-card-subtitle>{{ achievementId }}-{{ location.id }}</v-card-subtitle> -->
      <v-card-text v-html="tip[achievementId][location.id]"></v-card-text>
    </v-card>
  </div>
</template>

<script>
import FishTip from '@/components/OceanFishing54/OceanFishingVoyage/FishTip'
import FIX from 'Data/fix'

export default {
  name: 'AchievementTip',
  components: { FishTip },
  props: {
    achievementId: {
      type: Number,
      default: undefined,
    },
    location: {
      type: Object,
      default: undefined,
    },
    normalFish: {
      type: Array,
      default: () => [],
    },
    spectralCurrentFish: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      oceanFishTipReference: FIX.OCEAN_FISHING_TIPS.tip3,
      tip: FIX.OCEAN_FISHING_TIPS.tip3.achievementTip,
    }
  },
}
</script>

<style scoped></style>
