<template>
  <div>
    <div class="d-flex justify-center">{{ $t('detail.buffAndBaits.title') }}</div>
    <div class="d-flex justify-center align-center">
      <div
        v-if="fish.hasFishEyes"
        style="display: flex; align-items: center"
        data-ck-action-name="鱼眼"
      >
        <div :class="fish.fishEyesIcon" />
        <div class="ml-3">{{ fish.fishEyesText }}</div>
      </div>
      <div v-if="fish.hasPredators">
        <div :class="fish.predatorsIcon" />
      </div>
      <div v-if="fish.hasSnagging">
        <div :class="fish.snaggingIcon" data-ck-action-name="钓组" />
      </div>
      <div v-if="!fish.hasFishEyes && !fish.hasPredators && !fish.hasSnagging">
        {{ $t('none') }}
      </div>
      <!--      <fish-bait-list :baits="fish.baits" class="ml-3" />-->
      <div class="mx-2" style="font-size: x-large">|</div>
      <div v-if="fish.type === 'normal'" class="d-flex">
        <div class="d-flex align-center">
          <i
            class="xiv square-a"
            v-if="fish.baitsExtra.length > 0"
            title="一种可能情况A"
          />
          <fish-bait-list :baits="fish.baits" />
        </div>
        <template v-if="fish.baitsExtra.length > 0">
          <div class="d-flex align-center">
            <i class="xiv square-b" title="另一种可能情况B" />
            <fish-bait-list :baits="fish.baitsExtra" />
          </div>
        </template>
      </div>
      <div v-else class="d-flex align-center">
        <item-icon :icon-class="fish.gig.icon" :title="fish.gig.text" />
        <div>{{ fish.gig.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import FishBaitList from '@/components/FishBaitList'
import ItemIcon from '@/components/basic/ItemIcon'

export default {
  name: 'DetailItemBuffAndBaits',
  components: { ItemIcon, FishBaitList },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
  },
}
</script>

<style scoped></style>
