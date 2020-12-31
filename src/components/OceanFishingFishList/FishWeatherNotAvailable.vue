<template>
  <div class="d-flex align-center justify-center">
    <div v-if="!item.hasWeatherConstraint && !item.hasRealWeatherConstraint">
      无要求
    </div>
    <div v-else>
      在
    </div>
    <div
      v-for="(weather, index) in item.notAvailableWeatherSetDetail"
      :key="index"
      :title="weather.name"
      class="d-flex flex-column align-center"
    >
      <div :class="weather.icon" :title="weather.name" />
      <!--          <div class="ml-1">{{ weather.name }}</div>-->
    </div>
    <div v-if="item.hasWeatherConstraint">
      不出现
    </div>
    <div v-else-if="item.hasRealWeatherConstraint" title="条件无法满足">
      不可钓
    </div>
  </div>
</template>

<script>
export default {
  name: 'FishWeatherNotAvailable',
  props: ['item'],
}
</script>

<style scoped></style>
