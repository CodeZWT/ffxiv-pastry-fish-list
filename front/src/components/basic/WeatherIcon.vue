<template>
  <div :title="title" class="item-icon-style">
    <div v-if="!iconUrl" :class="`${iconClass} weather-icon-32`" />
    <v-img v-else class="weather-icon-32" :src="iconUrl" />
  </div>
</template>

<script>
export default {
  name: 'WeatherIcon',
  props: {
    iconClass: {
      type: String,
    },
    iconUrl: {
      type: String,
    },
    title: {
      type: String,
    },
  },
}
</script>

<style scoped>
.item-icon-style {
  position: relative;
  height: 32px;
  width: 32px;
  min-height: 32px;
  min-width: 32px;
}

.weather-icon-32 {
  position: absolute;
  width: 64px;
  height: 64px;
  top: 0;
  left: 0;

  zoom: 0.5;
  -moz-transform: scale(0.5);
  -moz-transform-origin: 0 0;
}
</style>
