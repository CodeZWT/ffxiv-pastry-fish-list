<template>
  <v-layout>
    <v-row>
      <v-col cols="12">
        <v-expansion-panels v-model="openPanelIndex">
          <!--              <v-virtual-scroll :items="fishList" :item-height="100" height="1000">-->
          <!--                <template v-slot="{ item: fish, index }">-->
          <v-expansion-panel v-for="(fish, index) in fishList" :key="index">
            <v-expansion-panel-header>
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
            <v-expansion-panel-content>
              <fish-list-item-content
                :open="index === openPanelIndex"
                :value="fish"
                :fish-time-part="fishListTimePart[fish._id]"
                :fish-weather-change-part="fishListWeatherChangePart[fish._id]"
                :predators="getPredators(fish)"
              ></fish-list-item-content>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!--              </v-virtual-scroll>-->
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-layout>
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
    fishListWeatherChangePart: {
      type: Object,
      default: () => ({}),
    },
    fishListTimePart: {
      type: Object,
      default: () => ({}),
    },
    fishList: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    fisher: fisher,
    openPanelIndex: undefined,
  }),
  computed: {
    getPredators() {
      return value => DataUtil.getPredators(value, this.allFish, this.fishListTimePart, this.fishListWeatherChangePart)
    },
    ...mapState({ allFish: 'fish' }),
    ...mapGetters(['getFishCompleted', 'filters']),
  },
}
</script>