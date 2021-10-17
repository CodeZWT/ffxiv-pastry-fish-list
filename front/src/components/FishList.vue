<template>
  <v-row no-gutters class="my-4 inner">
    <v-col cols="12">
      <div
        v-if="fishListToShow.length <= 0"
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
          :show-divider="showFishDivider"
          :type="type"
          :is-mobile="isMobile"
          @click="onFishClicked($event, fish.fishingSpots)"
        />
      </div>
    </v-col>
    <v-col
      cols="12"
      v-if="enableLoadMore && flattenFishList.length > 0 && remainingCnt > 0"
    >
      <v-btn block color="secondary" tile @click="loadMore">
        {{ $t('loadingMoreWithRemainingCnt', { remainingCnt }) }}
      </v-btn>
    </v-col>
    <v-col cols="12" v-if="clearAllButton && flattenFishList.length > 0">
      <rc-dialog v-model="showClearConfirmDialog" max-width="330">
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
      </rc-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ClickHelper from '@/components/basic/ClickHelper'
import DataUtil from '@/utils/DataUtil'
import FishListItem from '@/components/FishListItem'
import RcDialog from '@/components/basic/RcDialog'
import _ from 'lodash'

export default {
  name: 'fish-list',
  components: { RcDialog, ClickHelper, FishListItem },
  props: {
    fishDict: {
      type: Object,
      default: () => ({}),
    },
    fishIds: {
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
      default: true,
    },
    clearAllButton: {
      type: Boolean,
      default: false,
    },
    hideSpotColumn: {
      type: Boolean,
      default: false,
    },
    hidePredators: {
      type: Boolean,
      default: false,
    },
    enableLoadMore: {
      type: Boolean,
      default: false,
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
  data: () => ({
    openPanelIndex: undefined,
    showClearConfirmDialog: false,
    showN: 50,
    fishListToShow: [],
  }),
  computed: {
    remainingCnt() {
      return this.fishIds.length - this.showN
    },
    // watched
    fishIdsToShow() {
      return this.enableLoadMore ? this.fishIds.slice(0, this.showN) : this.fishIds
    },
    flattenFishList() {
      return this.fishListToShow.flatMap(fish => {
        return [
          fish,
          ...(this.hidePredators
            ? []
            : fish.predators.map(predator => {
                return {
                  ...predator,
                  fishingSpots: DataUtil.toSpotsOfPredator(
                    predator.fishingSpots,
                    fish.fishingSpots?.[0]?.fishingSpotId,
                    predator.gig != null
                  ),
                }
              })),
        ]
      })
    },
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
    ...mapState({ allFish: 'fish' }),
    ...mapGetters(['getFishCompleted', 'getFishCompleted', 'filters']),
  },
  watch: {
    fishIdsToShow: {
      handler(fishIds, old) {
        if (!_.isEqual(fishIds, old)) {
          console.debug('update fish list', fishIds.length)
          this.fishListToShow = fishIds.map(id => this.fishDict[id])
        }
      },
      immediate: true,
    },
  },
  methods: {
    loadMore() {
      this.showN += 20
    },
    toPos(index) {
      return index === 0
        ? 'first'
        : index === this.flattenFishList.length - 1
        ? 'last'
        : 'inside'
    },
    onFishClicked(fishAndComponents, spots) {
      this.$emit('fish-selected', {
        ...fishAndComponents,
        firstSpotId: spots?.[0]?.fishingSpotId,
      })
    },
    onConfirmClear() {
      this.$emit('clear-all')
      this.showClearConfirmDialog = false
    },
  },
}
</script>

<style lang="sass" scoped></style>
