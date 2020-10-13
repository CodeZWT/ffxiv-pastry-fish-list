<template>
  <v-row>
    <v-col cols="12">
      <div v-if="fishList.length <= 0" class="d-flex justify-center align-content-center pa-2">
        <slot name="empty" />
      </div>
      <div v-for="(fish, index) in flattenFishList" :key="fish._id + (fish.isPredator ? '-' + index : '')">
        <fish-list-item
          :fish="fish"
          :fish-time-part="fishListTimePart[fish._id]"
          :color="listItemColors[index]"
          @click="onFishClicked(fish._id)"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'
import FishListItem from '@/components/FishListItem'

export default {
  name: 'fish-list',
  components: { FishListItem },
  props: {
    fishList: {
      type: Array,
      default: () => [],
    },
    fishListTimePart: {
      type: Object,
      default: () => ({}),
    },
    fishListWeatherChangePart: {
      type: Object,
      default: () => ({}),
    },
    showFishDivider: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    fisher: fisher,
    openPanelIndex: undefined,
  }),
  computed: {
    flattenFishList() {
      return this.fishList.flatMap(fish => {
        // const predators = DataUtil.getPredators(
        //   fish,
        //   this.allFish
        //   // this.fishListTimePart,
        //   // this.fishListWeatherChangePart,
        //   // this.getFishCompleted(fish._id)
        // )
        return [fish, ...fish.predators]
      })
    },
    // fishColors() {
    //   return this.fishList.map(fish => {
    //     const completed = this.getFishCompleted(fish._id)
    //     const countDownType = this.fishListTimePart[fish._id].countDown?.type
    //     return DataUtil.getColorByStatus(completed, countDownType)
    //   })
    // },
    listItemColors() {
      let parentFishColor = ''
      let colorCounter = 0
      const fishListTimePart = this.fishListTimePart
      return this.flattenFishList.map(fish => {
        if (fish.isPredator) {
          return parentFishColor
        } else {
          const completed = this.getFishCompleted(fish._id)
          const countDownType = fishListTimePart[fish._id].countDown?.type
          const color = DataUtil.getColorByStatus(completed, countDownType, colorCounter++ % 2, 'BACKGROUND')
          parentFishColor = color
          return color
        }
      })
    },
    // firstFishWaitingIndex() {
    //   return this.flattenFishList.findIndex(
    //     fish => fish.isPredator !== true && this.fishListTimePart[fish._id].countDown?.type === DataUtil.WAITING
    //   )
    // },
    // listItemBorderColors() {
    //   return this.flattenFishList.map((fish, index) => {
    //     if (index === this.firstFishWaitingIndex) {
    //       return ['v-list-item', 'v-list-item--link', 'border-fishing-divider']
    //     } else if (fish.isPredator !== true) {
    //       return ['v-list-item', 'v-list-item--link', 'border-normal']
    //     } else {
    //       return ['v-list-item', 'v-list-item--link', 'border-none']
    //     }
    //   })
    // },
    // getPredators() {
    //   return value =>
    //     DataUtil.getPredators(
    //       value,
    //       this.allFish,
    //       this.fishListTimePart,
    //       this.fishListWeatherChangePart,
    //       this.getFishCompleted(value._id)
    //     )
    // },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    itemHeight() {
      return this.isMobile ? 126 : 56
    },
    scrollerHeight() {
      return this.itemHeight * (this.filters.fishN === -1 ? 20 : this.flattenFishList.length)
    },
    ...mapState({ allFish: 'fish' }),
    ...mapGetters(['getFishCompleted', 'getFishCompleted', 'filters']),
  },
  methods: {
    onFishClicked(fishId) {
      this.$emit('fish-selected', fishId)
    },
  },
}
</script>

<style lang="sass" scoped></style>