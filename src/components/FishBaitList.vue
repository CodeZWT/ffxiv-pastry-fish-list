<template>
  <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; line-height: 1;">
    <div v-for="(bait, baitInx) in baits" :key="baitInx">
      <div style="display: flex">
        <div v-if="baitInx !== 0" style="display: flex; align-items: center">
          <v-icon>mdi-arrow-right</v-icon>
        </div>
        <div>
          <v-img :lazy-src="fisher" :src="bait.baitIcon" width="36" height="36" :title="bait.baitName" />
        </div>
        <div class="d-flex flex-column" style="max-height: 36px">
          <code>{{ bait.tugIcon }}</code>
          <v-spacer />
          <v-img :src="bait.hooksetIcon" max-width="22" max-height="22" />
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

<style scoped></style>