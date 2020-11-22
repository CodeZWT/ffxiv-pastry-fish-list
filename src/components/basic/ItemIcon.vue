<template>
  <div :title="title" style="width: 48px; height: 48px; position: relative" :class="{ 'zoom-in': small }">
    <div style="width: 40px; height: 40px; position: absolute; top: 2px; left: 4px">
      <div :class="iconClass" />
    </div>
    <div style="position: absolute; width: 48px; height: 48px">
      <v-img :src="cover" />
    </div>
  </div>
</template>

<script>
import cover from '@/assets/icon/item-icon-cover.png'

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
  data: () => ({
    cover: cover,
  }),
}
</script>

<style scoped>
.zoom-in {
  zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 0 0;
}
</style>
