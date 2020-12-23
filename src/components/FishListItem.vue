<template>
  <v-sheet
    v-ripple
    :key="fish._id"
    :color="color"
    :class="['v-list-item', 'v-list-item--link', 'px-0', borderClass]"
  >
    <fish-info-row
      :fish="fish"
      :fish-time-part="fishTimePart"
      :predators="[]"
      :in-predator="fish.isPredator"
      :hide-spot-column="hideSpotColumn"
      :is-last="position === 'last'"
      @click="$emit('click', $event)"
    />
  </v-sheet>
</template>

<script>
import FishInfoRow from '@/components/FishInfoRow/FishInfoRow'

export default {
  name: 'FishListItem',
  components: { FishInfoRow },
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
    position: {
      type: String,
      default: 'inside',
    },
    hideSpotColumn: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    roundedClass() {
      switch (this.position) {
        case 'first':
          return 'rounded-t-lg'
        case 'last':
          return 'rounded-b-lg'
        default:
          return ''
      }
    },
    borderClass() {
      if (this.fish.isPredator || this.position === 'first') {
        return 'border-none'
      } else {
        return 'border-normal'
      }
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
