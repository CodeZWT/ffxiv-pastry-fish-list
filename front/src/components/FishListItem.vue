<template>
  <v-sheet
    v-ripple
    :color="color"
    :class="['v-list-item', 'v-list-item--link', 'px-0', borderClass]"
    v-observe-visibility="debouncedVisibilityChanged"
  >
    <fish-info-row
      :fish="fish"
      :fish-time-part="fishTimePart"
      :predators="[]"
      :in-predator="fish.isPredator"
      :hide-spot-column="hideSpotColumn"
      :is-last="position === 'last'"
      :show-divider="showDivider"
      :type="type"
      :is-mobile="isMobile"
      :is-intersecting="isIntersecting"
      @click="$emit('click', $event)"
    />
  </v-sheet>
</template>

<script>
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import FishInfoRow from '@/components/FishInfoRow/FishInfoRow'
import _ from 'lodash'

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
    showDivider: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'normal',
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.debouncedVisibilityChanged = _.debounce(this.visibilityChanged, 500, {
      leading: false,
      trailing: true,
    })
  },
  data() {
    return {
      isIntersecting: false,
      debouncedVisibilityChanged: () => {},
    }
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
  methods: {
    visibilityChanged(isVisible) {
      if (DevelopmentModeUtil.isElectron()) {
        this.isIntersecting = isVisible
      } else {
        if (isVisible) {
          this.isIntersecting = true
        }
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.v-sheet
  min-height: 74px

  &.border-normal
    border-top: 2px solid #757575 !important

  &.border-fishing-divider
    border-top: 2px solid red !important

  &.border-none
    padding-top: 2px
</style>
