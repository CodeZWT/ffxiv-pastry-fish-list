<template>
  <v-row>
    <v-col cols="12">
      <div v-if="fishList.length <= 0" class="d-flex justify-center align-content-center pa-2">
        <span>
          {{ $t('list.empty.prefix') }}
          <v-icon small style="transform: rotate(-45deg)" class="mx-1">mdi-pin-outline</v-icon>
          {{ $t('list.empty.suffix') }}
        </span>
      </div>
      <v-expansion-panels v-else v-model="openPanelIndex" hover tile>
        <!--              <v-virtual-scroll :items="fishList" :item-height="100" height="1000">-->
        <!--                <template v-slot="{ item: fish, index }">-->
        <v-expansion-panel v-for="(fish, index) in fishList" :key="index">
          <v-expansion-panel-header :color="fishColors[index]">
            <template v-slot:default="{ open }">
              <div>
                <div>
                  <v-fade-transition leave-absolute>
                    <div v-if="open">
                      <fish-list-expanded-header :value="fish" />
                    </div>
                    <div v-else>
                      <fish-list-brief-header
                        :value="fish"
                        :fish-time-part="fishListTimePart[fish._id]"
                        :predators="getPredators(fish)"
                      />
                    </div>
                  </v-fade-transition>
                </div>
              </div>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content :color="fishColors[index]">
            <fish-list-item-content
              :open="index === openPanelIndex"
              :value="fish"
              :fish-time-part="fishListTimePart[fish._id]"
              :fish-weather-change-part="fishListWeatherChangePart[fish._id]"
              :predators="getPredators(fish)"
              :color="fishColors[index]"
            ></fish-list-item-content>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!--              </v-virtual-scroll>-->
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import fisher from '@/assets/fisher.png'
import FishListBriefHeader from '@/components/FishListBriefHeader'
import FishListItemContent from '@/components/FishListItemContent'
import DataUtil from '@/utils/DataUtil'
import FishListExpandedHeader from '@/components/FishListExpandedHeader'

export default {
  name: 'fish-list',
  components: { FishListExpandedHeader, FishListItemContent, FishListBriefHeader },
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
  },
  data: () => ({
    fisher: fisher,
    openPanelIndex: undefined,
  }),
  computed: {
    fishColors() {
      return this.fishList.map((fish, index) => {
        const oddIndex = index % 2
        const completed = this.getFishCompleted(fish._id)
        const countDownType = this.fishListTimePart[fish._id].countDown?.type
        return DataUtil.getColorByStatus(completed, countDownType, oddIndex)
      })
    },
    getPredators() {
      return value =>
        DataUtil.getPredators(
          value,
          this.allFish,
          this.fishListTimePart,
          this.fishListWeatherChangePart,
          this.getFishCompleted(value._id)
        )
    },
    ...mapState({ allFish: 'fish' }),
    ...mapGetters(['getFishCompleted', 'getFishCompleted', 'filters']),
  },
}
</script>

<style scoped></style>
