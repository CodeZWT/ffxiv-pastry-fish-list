<template>
  <v-layout column style="width: 100%" class="mt-2">
    <div v-for="(predator, index) in value" :key="predator._id" :class="fishColors[index]" style="position: relative">
      <fish-list-brief-header :value="predator" :fish-time-part="predator.fishTimePart" in-predator />
    </div>
  </v-layout>
</template>

<script>
import FishListBriefHeader from '@/components/FishListBriefHeader'
import DataUtil from '@/utils/DataUtil'
import { mapGetters } from 'vuex'

export default {
  name: 'FishPredators',
  components: { FishListBriefHeader },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    fishColors() {
      return this.value
        .map((fish, index) => {
          const oddIndex = index % 2
          const completed = fish.finalTargetCompleted
          const countDownType =
            fish.finalTargetCountDownType === DataUtil.FISHING ? DataUtil.FISHING : fish.fishTimePart?.countDown?.type
          return DataUtil.getColorByStatus(completed, countDownType, oddIndex)
        })
        .map(it => it.split(' '))
    },
    ...mapGetters(['getFishCompleted']),
  },
}
</script>

<style scoped></style>