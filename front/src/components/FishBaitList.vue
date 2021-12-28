<template>
  <div
    class="d-flex align-center justify-start flex-wrap"
    style="line-height: 1; min-height: 44px"
  >
    <div v-for="(bait, baitInx) in baits" :key="baitInx">
      <div class="d-flex align-center">
        <!--        <span v-if="bait.optional" style="font-size: x-large">(</span>-->

        <link-list
          :id="bait.baitId"
          :name="bait.baitName"
          :names="bait.baitNames"
          :mode="isFishId(bait.baitId) ? 'fish' : 'itemV2'"
          :angler-id="toAnglerId(bait.baitId)"
        >
          <div
            style="height: 36px; width: 36px"
            @click="onBaitOrFishClicked($event, bait.baitId)"
          >
            <v-badge
              v-if="firstBaitUnique"
              :color="baitUniqueType === 'UNIQUE' ? 'primary' : 'grey'"
              :icon="mdiLock"
              offset-x="12"
              offset-y="12"
              left
              :title="
                baitUniqueType === 'UNIQUE' ? '只能用该鱼饵' : '除以小钓大外只能用该鱼饵'
              "
            >
              <item-icon
                :icon-url="bait.diademAnyBait ? diademAnyBaitIcon : null"
                :icon-class="bait.baitIcon"
                small
              />
            </v-badge>
            <item-icon
              v-else
              :icon-url="bait.diademAnyBait ? diademAnyBaitIcon : null"
              :icon-class="bait.baitIcon"
              small
            />
            <div style="width: 36px" class="d-flex justify-center" title="可套娃">
              <v-icon v-if="bait.biteSelf" small>{{ mdiRefresh }}</v-icon>
            </div>
          </div>
        </link-list>

        <div v-if="!simple" style="display: flex; align-items: center">
          <v-icon small>{{ mdiArrowRight }}</v-icon>
        </div>
        <div
          class="d-flex flex-column align-center"
          :style="`width: 24px; margin-right: -2px; margin-bottom: 4px`"
        >
          <div
            :class="
              `d-flex justify-center align-center rounded-lg ${
                TUG_ICON_COLOR[bait.tugIcon]
              }`
            "
            style="width: 100%; height: 16px"
          >
            <div
              v-show="bait.tug != null"
              style="
                width: 100%;
                font-size: 12px;
                line-height: 1;
                text-align: center;
                padding-right: 0;
              "
            >
              {{ bait.tugIcon }}
            </div>
          </div>
          <!--  :data-ck-action-name="bait.hooksetSkillName"  -->
          <div
            v-if="!simple || bait.tug === 'heavy'"
            class="d-flex justify-end"
            style="height: 16px; margin-top: 2px"
          >
            <div
              v-show="bait.hookset != null"
              :class="[bait.hooksetIcon, 'hookset-icon']"
            />
          </div>
        </div>

        <!--        <span v-if="bait.optional" style="font-size: x-large">)</span>-->
      </div>
    </div>
    <template v-if="target">
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
      v-if="
        !hideBaitList &&
          target &&
          target.availableBaitList &&
          target.availableBaitList.length > 0
      "
      max-width="400"
      open-on-hover
      left
    >
      <template v-slot:activator="{ on }">
        <v-btn text icon v-on="on">
          <v-icon>{{ mdiDotsVerticalCircleOutline }}</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title> 可行钓法 </v-card-title>
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
import * as fishDict from 'Data/fish'
import { mdiArrowRight, mdiDotsVerticalCircleOutline, mdiLock, mdiRefresh } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import ImgUtil from '@/utils/ImgUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import LinkList from '@/components/basic/LinkList'

export default {
  name: 'FishBaitList',
  components: { LinkList, ItemIcon },
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
    baitUniqueType: {
      type: String,
      default: 'NOT_UNIQUE',
    },
    // hideTarget: {
    //   type: Boolean,
    //   default: false,
    // },
    hideBaitList: {
      type: Boolean,
      default: false,
    },
    hideQuantity: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    mdiDotsVerticalCircleOutline,
    mdiArrowRight,
    mdiRefresh,
    mdiLock,
    TUG_ICON_COLOR: DataUtil.TUG_ICON_COLOR,
  }),
  computed: {
    firstBaitUnique() {
      return this.baitUniqueType !== 'NOT_UNIQUE'
    },
    diademAnyBaitIcon() {
      return ImgUtil.getImgUrl('diadem-any-bait.webp')
    },
  },
  methods: {
    isFishId: id => DataUtil.isFishId(id),
    toAnglerId: fishId => fishDict[fishId]?.anglerFishId,
    toItemIdIfExisted: DataUtil.toItemIdIfExisted,
    tugWidthOf(tug) {
      switch (tug) {
        case '!':
          return 16
        case '! !':
          return 20
        case '! ! !':
          return 24
      }
    },
    onBaitOrFishClicked(event, itemId) {
      if (DataUtil.isFishId(itemId)) {
        this.$emit('fish-clicked', itemId)
        event?.stopPropagation()
      }
    },
    toItemTitle(itemName, itemId, diademAnyBait = false) {
      return diademAnyBait
        ? '云冠气球虫、云冠红气球虫、云冠大蚊、云冠浮游虫和万能拟饵皆可'
        : DataUtil.toItemTitle({ name: itemName, id: itemId })
    },
  },
}
</script>

<style scoped>
.hookset-icon {
  zoom: 0.2;
  -moz-transform: scale(0.2);
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
