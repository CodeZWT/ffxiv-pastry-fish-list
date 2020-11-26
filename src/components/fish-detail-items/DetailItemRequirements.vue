<template>
  <v-row no-gutters>
    <v-col cols="6">
      <div class="d-flex justify-center">{{ $t('detail.requirements.weather') }}</div>
      <div class="d-flex justify-center" v-if="fish.hasWeatherConstraint">
        <div style="display: flex">
          <div
            v-for="weather in fish.previousWeatherSetDetail"
            :key="weather.name"
            :title="weather.name"
          >
            <div :class="weather.icon" :title="weather.name" />
          </div>
          <v-icon v-if="fish.previousWeatherSet.length > 0">
            mdi-arrow-right
          </v-icon>
          <div
            v-for="weather in fish.weatherSetDetail"
            :key="weather.name"
            :title="weather.name"
          >
            <div :class="weather.icon" :title="weather.name" />
          </div>
        </div>
      </div>
      <div class="d-flex justify-center" v-else>
        {{ $t('none') }}
      </div>
    </v-col>
    <v-col cols="6">
      <div class="d-flex justify-center">{{ $t('detail.requirements.time') }}</div>
      <div class="d-flex justify-center">
        <div v-if="fish.hasTimeConstraint">
          {{ fish.startHourText }} - {{ fish.endHourText }}
        </div>
        <div v-else>
          {{ $t('none') }}
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DetailItemRequirements',
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
  },
}
</script>

<style scoped></style>
