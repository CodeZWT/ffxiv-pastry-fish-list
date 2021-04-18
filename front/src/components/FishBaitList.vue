<template>
  <div
    class="d-flex align-center justify-start flex-wrap"
    style="line-height: 1; min-height: 44px"
  >
    <div v-for="(bait, baitInx) in baits" :key="baitInx">
      <div class="d-flex align-center">
        <!--        <span v-if="bait.optional" style="font-size: x-large">(</span>-->
        <div v-if="baitInx !== 0 && !simple" style="display: flex; align-items: center">
          <v-icon small>mdi-arrow-right</v-icon>
        </div>
        <div
          :data-ck-item-id="toItemIdIfExisted(bait.baitId, bait.baitName)"
          style="height: 36px; width: 36px"
          @click="onBaitOrFishClicked($event, bait.baitId)"
        >
          <v-badge
            v-if="firstBaitUnique"
            color="primary"
            icon="mdi-lock"
            offset-x="12"
            offset-y="12"
            left
            title="只能用该鱼饵"
          >
            <item-icon
              :icon-class="bait.baitIcon"
              :title="bait.baitName + '#' + bait.baitId"
              small
            />
          </v-badge>
          <item-icon
            v-else
            :icon-class="bait.baitIcon"
            :title="bait.baitName + '#' + bait.baitId"
            small
          />
          <div style="width: 36px" class="d-flex justify-center" title="可套娃">
            <v-icon v-if="bait.biteSelf" small>mdi-refresh</v-icon>
          </div>
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
          <v-col v-if="!simple || bait.tug === 'heavy'" cols="12" style="height: 16px">
            <div
              v-show="bait.hookset != null"
              :class="[bait.hooksetIcon, 'hookset-icon']"
            />
          </v-col>
        </v-row>
        <!--        <span v-if="bait.optional" style="font-size: x-large">)</span>-->
      </div>
    </div>
    <template v-if="target && !hideTarget">
      <v-icon v-if="!simple" small>mdi-arrow-right</v-icon>
      <item-icon :icon-class="target.icon" :title="target.name" />
      <template v-if="!hideQuantity && target.requiredCnt">
        <span class="mx-1">X</span>
        <v-badge
          :content="target.requiredCnt"
          color="predatorCnt black--text"
          inline
          bottom
          bordered
        />
      </template>
    </template>
    <v-menu
      v-if="!hideBaitList && target && target.availableBaitList.length > 0"
      max-width="400"
      open-on-hover
      left
    >
      <template v-slot:activator="{ on }">
        <v-btn text icon v-on="on">
          <v-icon>
            mdi-dots-vertical-circle-outline
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          可行钓法
        </v-card-title>
        <v-card-text>
          <div
            v-for="(catchPath, index) in target.availableBaitList"
            :key="index"
            class="my-1"
          >
            <fish-bait-list
              :baits="catchPath"
              @fish-clicked="onBaitOrFishClicked(undefined, $event)"
              :target="target"
              hide-bait-list
              hide-quantity
            />
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
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
    target: {
      type: Object,
      default: undefined,
    },
    simple: {
      type: Boolean,
      default: false,
    },
    firstBaitUnique: {
      type: Boolean,
      default: false,
    },
    hideTarget: {
      type: Boolean,
      default: false,
    },
    hideBaitList: {
      type: Boolean,
      default: false,
    },
    hideQuantity: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    TUG_ICON_COLOR: DataUtil.TUG_ICON_COLOR,
  }),
  methods: {
    toItemIdIfExisted: DataUtil.toItemIdIfExisted,
    onBaitOrFishClicked(event, itemId) {
      if (DataUtil.isFishId(itemId)) {
        this.$emit('fish-clicked', itemId)
        event?.stopPropagation()
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
