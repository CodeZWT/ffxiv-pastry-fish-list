<template>
  <click-helper @click="$emit('click')">
    <v-sheet
      v-ripple
      :key="fish._id"
      :color="color"
      :class="['v-list-item', 'v-list-item--link', fish.isPredator ? 'border-none' : 'border-normal']"
    >
      <fish-list-brief-header
        :value="fish"
        :fish-time-part="fishTimePart"
        :predators="[]"
        :in-predator="fish.isPredator"
        mode="HEADER"
      />
    </v-sheet>
  </click-helper>
</template>

<script>
import FishListBriefHeader from '@/components/FishListBriefHeader'
import ClickHelper from '@/components/basic/ClickHelper'

export default {
  name: 'FishListItem',
  components: { ClickHelper, FishListBriefHeader },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
    fishTimePart: {
      type: Object,
      default: undefined,
    },
    color: {
      type: String,
      default: undefined,
    },
  },
}
</script>

<style lang="sass" scoped>
.v-sheet
  min-height: 54px

  &.border-normal
    border-top: 2px solid #757575 !important

  &.border-fishing-divider
    border-top: 2px solid red !important

  &.border-none
    padding-top: 2px
</style>