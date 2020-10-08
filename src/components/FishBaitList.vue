<template>
  <div
    style="display: flex; flex-direction: row; align-items: center; justify-content: start; line-height: 1; flex-wrap: wrap"
  >
    <div v-for="(bait, baitInx) in baits" :key="baitInx">
      <div class="d-flex align-center">
        <div v-if="baitInx !== 0" style="display: flex; align-items: center">
          <v-icon small>mdi-arrow-right</v-icon>
        </div>
        <div :data-ck-item-id="bait.baitId" style="height: 30px; width: 30px">
          <div class="bait-icon">
            <div :class="bait.baitIcon" :title="bait.baitName" />
          </div>
        </div>
        <v-row no-gutters class="d-flex" style="max-width: 27px">
          <v-col cols="12">
            <v-badge :color="TUG_ICON_COLOR[bait.tugIcon]" :content="bait.tugIcon" inline />
          </v-col>
          <v-col cols="12" style="height: 16px">
            <div :class="[bait.hooksetIcon, 'hookset-icon']" />
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'

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
    TUG_ICON_COLOR: DataUtil.TUG_ICON_COLOR,
  }),
}
</script>

<style scoped>
.hookset-icon {
  zoom: 0.4;
  -moz-transform: scale(0.4);
  -moz-transform-origin: 0 0;
}

.bait-icon {
  zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 0 0;
}

.v-badge >>> .v-badge__wrapper {
  margin: 0 !important;
}
</style>