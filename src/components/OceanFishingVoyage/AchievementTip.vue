<template>
  <div>
    <v-card flat color="system" class="mt-2">
      <v-card-title>
        <div class="d-flex justify-center">
          <div>{{ location.name }}</div>
          <v-icon>{{ location.icon }}</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-if="normalFish.length === 0">
          无
        </div>
        <div v-else v-for="(fish, index) in normalFish" :key="index">
          <fish-tip :fish="fish" show-achievement-tip />
        </div>
      </v-card-text>
    </v-card>

    <v-card flat color="info" class="mt-2">
      <v-card-title>
        <div class="d-flex justify-center">
          <div>{{ location.name }}幻海流</div>
          <v-icon>{{ location.icon }}</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-if="spectralCurrentFish.length === 0">
          无
        </div>
        <div v-else v-for="(fish, index) in spectralCurrentFish" :key="index">
          <fish-tip :fish="fish" show-achievement-tip />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import FishTip from '@/components/OceanFishingVoyage/FishTip'
export default {
  name: 'AchievementTip',
  components: { FishTip },
  props: {
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
      tip: {
        '2564': {
          // 加拉迪翁湾外海
          '237': [29751, 29750, 29751, 29782],
          '238-0': [29756, 29753, 29766],
          '238-1': [29782, 29751],
          // 梅尔托尔海峡南
          '240-0': [29758, 29755],
          '240-1': [29757, 29765],
          '240-2': [29763, 29758, 29789],
          // 罗塔诺海海面
          '242-0': [29770],
          '242-2': [29762],
          //梅尔托尔海峡北
          '244-1': [29764],
          '244-2': [29773],
        },
      },
    }
  },
}
</script>

<style scoped></style>
