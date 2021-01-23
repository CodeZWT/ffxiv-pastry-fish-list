<template>
  <v-dialog :value="showBaitDialog" @input="$emit('input', $event)" max-width="600">
    <v-card>
      <v-card-title>
        鱼饵列表
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card color="system" outlined>
              <v-row>
                <v-col class="mx-2">
                  <div class="subtitle-2">{{ $t('filter.bigFish.title') }}</div>
                  <v-btn-toggle
                    v-model="bigFishTypeIndices"
                    multiple
                    mandatory
                    rounded
                    active-class="primary"
                    dense
                    @change="onChange"
                  >
                    <v-btn small v-for="type in bigFishFilterTypes" :key="type">
                      {{ $t(`filter.bigFish.${type}`) }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col class="mx-2">
                  <div class="subtitle-2">{{ $t('filter.mark.title') }}</div>
                  <v-btn-toggle
                    v-model="completeTypeIndices"
                    multiple
                    mandatory
                    rounded
                    active-class="primary"
                    dense
                    @change="onChange"
                  >
                    <v-btn small v-for="type in completeFilterTypes" :key="type">
                      {{ $t(`filter.mark.${type}`) }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-expansion-panels accordion class="my-2 rounded-lg">
              <v-expansion-panel v-for="(fishList, bait) in baits" :key="bait">
                <v-expansion-panel-header>
                  {{ bait }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  {{ fishList }}
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import { mapGetters, mapState } from 'vuex'
import DATA_CN from '@/store/translation'
import _ from 'lodash'

export default {
  name: 'BaitDialog',
  model: {
    prop: 'showBaitDialog',
    event: 'input',
  },
  props: {
    showBaitDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      completeFilterTypes: DataUtil.COMPLETE_FILTER_TYPES,
      completeTypeIndices: [0, 1],
      bigFishTypeIndices: [0, 1, 2],
      bigFishFilterTypes: DataUtil.BIG_FISH_FILTER_TYPES,
    }
  },
  computed: {
    completeTypes() {
      return this.completeTypeIndices.map(it => this.completeFilterTypes[it])
    },
    bigFishTypes() {
      return this.bigFishTypeIndices.map(it => this.bigFishFilterTypes[it])
    },
    baits() {
      const targetFishList = this.fishList.filter(fish => {
        const fishCompleted = this.getFishCompleted(fish.id)
        const isBigFish = this.bigFish.includes(fish.id)
        const isLivingLegend = DATA_CN.LIVING_LEGENDS.includes(fish.id)
        return (
          ((this.completeTypes.includes('COMPLETED') && fishCompleted) ||
            (this.completeTypes.includes('UNCOMPLETED') && !fishCompleted)) &&
          ((this.bigFishTypes.includes('LIVING_LEGENDS') && isLivingLegend) ||
            (this.bigFishTypes.includes('OLD_ONES') && isBigFish && !isLivingLegend) ||
            (this.bigFishTypes.includes('NORMAL') && !isBigFish))
        )
      })

      const baitFishItems = []
      targetFishList.forEach(fishData => {
        if (fishData.gig == null) {
          baitFishItems.push({
            bait: fishData.bestCatchPath[0],
            fish: DataUtil.toItemId(fishData._id),
          })
        }
      })
      return _.mapValues(_.groupBy(baitFishItems, 'bait'), baitFishList =>
        _.uniq(baitFishList.map(it => it.fish))
      )
    },
    fishList() {
      return Object.values(this.fish)
    },
    ...mapState(['fish', 'bigFish']),

    ...mapGetters(['getFishCompleted']),
  },
  methods: {
    onChange() {},
  },
}
</script>

<style scoped></style>
