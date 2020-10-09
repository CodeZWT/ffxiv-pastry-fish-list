<template>
  <v-row>
    <v-col cols="12">
      <div v-if="fishList.length <= 0" class="d-flex justify-center align-content-center pa-2">
        <slot name="empty" />
      </div>
      <v-expansion-panels v-else v-model="openPanelIndex" hover tile>
        <v-virtual-scroll :items="flattenFishList" :item-height="isMobile ? 126 : 50" :height="isMobile ? 1260 : 800">
          <template v-slot="{ item: fish, index }">
            <v-sheet v-ripple :key="fish._id" :color="listItemColors[index]" :class="listItemBorderColors[index]">
              <fish-list-brief-header
                :value="fish"
                :fish-time-part="fishListTimePart[fish._id]"
                :predators="[]"
                :in-predator="fish.isPredator"
              />
            </v-sheet>

            <!--            <v-expansion-panel>-->
            <!--              <v-expansion-panel-header class="fish-header" :color="listItemColors[index]">-->
            <!--                <template v-slot:default="{ open }">-->
            <!--                  <div>-->
            <!--                    <div>-->
            <!--                      <v-fade-transition leave-absolute>-->
            <!--                        <div v-if="open">-->
            <!--                          <fish-list-expanded-header-->
            <!--                            :value="fish"-->
            <!--                            :color="fishColors[index]"-->
            <!--                            :show-divider="showFishDivider && firstFishWaitingIndex === index"-->
            <!--                          />-->
            <!--                        </div>-->
            <!--                        <div v-else>-->
            <!--                          <fish-list-brief-header-->
            <!--                            :value="fish"-->
            <!--                            :fish-time-part="fishListTimePart[fish._id]"-->
            <!--                            :predators="getPredators(fish)"-->
            <!--                            :color="fishColors[index]"-->
            <!--                            :show-divider="showFishDivider && firstFishWaitingIndex === index"-->
            <!--                          />-->
            <!--                        </div>-->
            <!--                      </v-fade-transition>-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                </template>-->
            <!--              </v-expansion-panel-header>-->
            <!--              <v-expansion-panel-content>-->
            <!--                <fish-list-item-content-->
            <!--                  :open="index === openPanelIndex"-->
            <!--                  :value="fish"-->
            <!--                  :fish-time-part="fishListTimePart[fish._id]"-->
            <!--                  :fish-weather-change-part="fishListWeatherChangePart[fish._id]"-->
            <!--                  :predators="getPredators(fish)"-->
            <!--                  :fishing-type-color="fishColors[index]"-->
            <!--                  list-item-color="default"-->
            <!--                ></fish-list-item-content>-->
            <!--              </v-expansion-panel-content>-->
            <!--            </v-expansion-panel>-->
          </template>
        </v-virtual-scroll>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import fisher from '@/assets/fisher.png'
import FishListBriefHeader from '@/components/FishListBriefHeader'
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'fish-list',
  components: { FishListBriefHeader },
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
        const predators = DataUtil.getPredators(
          fish,
          this.allFish
          // this.fishListTimePart,
          // this.fishListWeatherChangePart,
          // this.getFishCompleted(fish._id)
        )
        return [fish, ...predators]
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
      return this.flattenFishList.map(fish => {
        if (fish.isPredator) {
          return parentFishColor
        } else {
          const completed = this.getFishCompleted(fish._id)
          const countDownType = this.fishListTimePart[fish._id].countDown?.type
          const color = DataUtil.getColorByStatus(completed, countDownType, colorCounter++ % 2, 'BACKGROUND')
          parentFishColor = color
          return color
        }
      })
    },
    firstFishWaitingIndex() {
      return this.flattenFishList.findIndex(
        fish => fish.isPredator !== true && this.fishListTimePart[fish._id].countDown?.type === DataUtil.WAITING
      )
    },
    listItemBorderColors() {
      return this.flattenFishList.map((fish, index) => {
        if (index === this.firstFishWaitingIndex) {
          return ['v-list-item', 'v-list-item--link', 'border-fishing-divider']
        } else if (fish.isPredator !== true) {
          return ['v-list-item', 'v-list-item--link', 'border-normal']
        } else {
          return ['v-list-item', 'v-list-item--link', 'border-none']
        }
      })
    },
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
    ...mapState({ allFish: 'fish' }),
    ...mapGetters(['getFishCompleted', 'getFishCompleted', 'filters']),
  },
}
</script>

<style lang="sass" scoped>
//.fish-header
  padding-left: 0 !important
  padding-right: 0 !important

.v-sheet.border-normal
  border-top: 2px solid #757575 !important

.v-sheet.border-fishing-divider
  border-top: 2px solid red !important

.v-sheet.border-none
  padding-top: 2px
</style>