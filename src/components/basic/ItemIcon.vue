<template>
  <div :title="title" style="width: 40px; height: 40px" :class="{ 'zoom-in': small }">
    <div :class="iconClass" />
  </div>
</template>

<script>
export default {
  name: 'ItemIcon',
  props: {
    iconClass: {
      type: String,
    },
    title: {
      type: String,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.zoom-in {
  zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 0 0;
}
</style>
