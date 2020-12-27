<template>
  <div
    class="d-flex align-center justify-start flex-wrap"
    style="line-height: 1; min-height: 44px"
  >
    <div v-for="(bait, baitInx) in baits" :key="baitInx">
      <div class="d-flex align-center">
        <!--        <span v-if="bait.optional" style="font-size: x-large">(</span>-->
        <div v-if="baitInx !== 0" style="display: flex; align-items: center">
          <v-icon small>mdi-arrow-right</v-icon>
        </div>
        <div
          :data-ck-item-id="toItemIdIfExisted(bait.baitId, bait.baitName)"
          style="height: 36px; width: 36px"
        >
          <item-icon :icon-class="bait.baitIcon" :title="bait.baitName" small />
        </div>
        <v-row no-gutters class="d-flex" style="max-width: 27px">
          <v-col cols="12">
            <v-badge
              v-show="bait.tug != null"
              :color="TUG_ICON_COLOR[bait.tugIcon]"
              :content="bait.tugIcon"
              inline
            />
          </v-col>
          <!--  :data-ck-action-name="bait.hooksetSkillName"  -->
          <v-col cols="12" style="height: 16px">
            <div
              v-show="bait.hookset != null"
              :class="[bait.hooksetIcon, 'hookset-icon']"
            />
          </v-col>
        </v-row>
        <!--        <span v-if="bait.optional" style="font-size: x-large">)</span>-->
      </div>
    </div>
  </div>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import ItemIcon from '@/components/basic/ItemIcon'

export default {
  name: 'FishBaitList',
  components: { ItemIcon },
  props: {
    baits: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    TUG_ICON_COLOR: DataUtil.TUG_ICON_COLOR,
  }),
  methods: {
    toItemIdIfExisted(id, name) {
      if (name.match('[\u4e00-\u9fff]+')) {
        return id
      } else {
        return null
      }
    },
  },
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
