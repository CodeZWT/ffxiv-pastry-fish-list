<template>
  <div class="d-flex align-center justify-center">
    <div v-if="!item.hasWeatherConstraint && !item.hasRealWeatherConstraint">
      无要求
    </div>
    <div v-else-if="!dense">
      在
    </div>
    <div v-else>非</div>
    <div
      v-for="(weather, index) in item.notAvailableWeatherSetDetail"
      :key="index"
      :title="weather.name"
      class="d-flex flex-column align-center"
    >
      <weather-icon :icon-class="weather.icon" :title="weather.name" type="weather" />
      <!--          <div class="ml-1">{{ weather.name }}</div>-->
    </div>
    <div v-if="dense"></div>
    <div v-else-if="item.hasWeatherConstraint">
      不出现
    </div>
    <div v-else-if="item.hasRealWeatherConstraint" title="条件无法满足">
      不可钓
    </div>
  </div>
</template>

<script>
import WeatherIcon from '@/components/basic/WeatherIcon'
export default {
  name: 'FishWeatherNotAvailable',
  components: { WeatherIcon },
  props: {
    item: {
      type: Object,
      default: undefined,
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped></style>
