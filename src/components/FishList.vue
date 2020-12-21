<template>
  <v-row no-gutters class="my-4 rounded-lg inner elevation-4" style="overflow: hidden">
    <v-col cols="12">
      <div
        v-if="fishList.length <= 0"
        class="d-flex justify-center align-content-center pa-2"
      >
        <slot name="empty" />
      </div>
      <div
        v-for="(fish, index) in flattenFishList"
        :key="fish._id + (fish.isPredator ? '-' + index : '')"
      >
        <fish-list-item
          :fish="fish"
          :fish-time-part="fishListTimePart[fish._id]"
          :color="listItemColors[index]"
          :position="toPos(index)"
          :hide-spot-column="hideSpotColumn"
          @click="onFishClicked($event)"
        />
      </div>
    </v-col>
    <v-col cols="12" v-if="clearAllButton && flattenFishList.length > 0">
      <v-dialog v-model="showClearConfirmDialog" max-width="330">
        <template v-slot:activator="{ on, attrs }">
          <click-helper v-bind="attrs" v-on="on">
            <v-btn block color="error" class="rounded-t-0">
              <v-icon>mdi-playlist-remove</v-icon>
              <span>{{ $t('list.toBeNotified.clearAll') }}</span>
            </v-btn>
          </click-helper>
        </template>

        <v-card>
          <v-card-title class="headline">
            {{ $t('list.toBeNotified.dialog.title') }}
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <click-helper @click="showClearConfirmDialog = false">
              <v-btn text>
                {{ $t('general.dialog.cancel') }}
              </v-btn>
            </click-helper>
            <click-helper @click="onConfirmClear">
              <v-btn color="error" text>
                {{ $t('list.toBeNotified.dialog.confirm') }}
              </v-btn>
            </click-helper>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import FishListItem from '@/components/FishListItem'
import ClickHelper from '@/components/basic/ClickHelper'

export default {
  name: 'fish-list',
  components: { ClickHelper, FishListItem },
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
    clearAllButton: {
      type: Boolean,
      default: false,
    },
    hideSpotColumn: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    openPanelIndex: undefined,
    showClearConfirmDialog: false,
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
          const countDownType = fishListTimePart[fish._id]?.countDown?.type
          const color = DataUtil.getColorByStatus(
            this.$vuetify.theme.currentTheme,
            completed,
            countDownType,
            colorCounter++ % 2,
            'BACKGROUND'
          )
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
      return (
        this.itemHeight * (this.filters.fishN === -1 ? 20 : this.flattenFishList.length)
      )
    },
    ...mapState({ allFish: 'fish' }),
    ...mapGetters(['getFishCompleted', 'getFishCompleted', 'filters']),
  },
  methods: {
    toPos(index) {
      return index === 0
        ? 'first'
        : index === this.flattenFishList.length - 1
        ? 'last'
        : 'inside'
    },
    onFishClicked(fishAndComponents) {
      this.$emit('fish-selected', fishAndComponents)
    },
    onConfirmClear() {
      this.$emit('clear-all')
      this.showClearConfirmDialog = false
    },
  },
}
</script>

<style lang="sass" scoped></style>
