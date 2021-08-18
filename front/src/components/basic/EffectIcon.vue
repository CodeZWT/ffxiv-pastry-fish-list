<template>
  <div :title="title" class="item-icon-style">
    <div v-if="!iconUrl" :class="`${iconClass} effect-icon-24-32`" />
    <v-img v-else class="effect-icon-24-32" :src="iconUrl" />
  </div>
</template>

<script>
export default {
  name: 'EffectIcon',
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
  width: 24px;
  height: 32px;
  min-width: 24px;
  min-height: 32px;
}

.effect-icon-24-32 {
  position: absolute;
  width: 48px;
  height: 64px;
  top: 0;
  left: 0;

  zoom: 0.5;
  -moz-transform: scale(0.5);
  -moz-transform-origin: 0 0;
}
</style>
