<template>
  <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; line-height: 1;">
    <div v-for="(bait, baitInx) in baits" :key="baitInx">
      <div style="display: flex">
        <div v-if="baitInx !== 0" style="display: flex; align-items: center">
          <v-icon>mdi-arrow-right</v-icon>
        </div>
        <div :data-ck-item-id="bait.baitId">
          <div :class="bait.baitIcon" :title="bait.baitName" />
        </div>
        <div class="d-flex flex-column" style="max-height: 40px">
          <code>{{ bait.tugIcon }}</code>
          <v-spacer />
          <div :class="[bait.hooksetIcon, 'hookset-icon']" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fisher from '@/assets/fisher.png'

export default {
  name: 'FishBaitList',
  props: {
    baits: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    fisher,
  }),
}
</script>

<style scoped>
.hookset-icon {
  zoom: 0.5;
  -moz-transform: scale(0.5);
  -moz-transform-origin: 0 0;
}
</style>
