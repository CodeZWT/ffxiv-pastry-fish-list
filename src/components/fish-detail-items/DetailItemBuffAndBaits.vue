<template>
  <div>
    <div class="d-flex justify-center">{{ $t('detail.buffAndBaits.title') }}</div>
    <div class="d-flex justify-center align-center">
      <div v-if="fish.hasFishEyes" style="display: flex; align-items: center">
        <div :class="fish.fishEyesIcon" />
        <div class="ml-3">{{ fish.fishEyesText }}</div>
      </div>
      <div v-if="fish.hasPredators">
        <div :class="fish.predatorsIcon" />
      </div>
      <div v-if="fish.hasSnagging">
        <div :class="fish.snaggingIcon" />
      </div>
      <div v-if="!fish.hasFishEyes && !fish.hasPredators && !fish.hasSnagging">
        {{ $t('none') }}
      </div>
      <fish-bait-list :baits="fish.baits" class="ml-3" />
    </div>
  </div>
</template>

<script>
import FishBaitList from '@/components/FishBaitList'

export default {
  name: 'DetailItemBuffAndBaits',
  components: { FishBaitList },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
  },
}
</script>

<style scoped></style>