<template>
  <div :title="title" class="item-icon-style">
    <div v-if="!iconUrl" :class="`${iconClass} item-icon-40`" />
    <v-img v-else class="item-icon-40" :src="iconUrl" />
  </div>
</template>

<script>
export default {
  name: 'RawItemIcon',
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
  height: 40px;
  width: 40px;
  min-height: 40px;
  min-width: 40px;
}

.item-icon-40 {
  position: absolute;
  width: 80px;
  height: 80px;
  top: 0;
  left: 0;

  zoom: 0.5;
  -moz-transform: scale(0.5);
  -moz-transform-origin: 0 0;
}
</style>
