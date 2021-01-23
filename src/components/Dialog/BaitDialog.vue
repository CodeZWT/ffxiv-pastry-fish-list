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
              <v-row>
                <v-col class="mx-2">
                  <div class="subtitle-2">{{ $t('filter.sorter.title') }}</div>
                  <v-btn-toggle
                    v-model="sorterTypeIndex"
                    dense
                    rounded
                    mandatory
                    active-class="primary"
                    @change="onChange"
                  >
                    <v-btn small v-for="type in sorterFilterTypes" :key="type">
                      {{ $t(`filter.sorter.${type}`) }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-expansion-panels>
              <v-expansion-panel v-for="(bait, index) in baits" :key="index">
                <v-expansion-panel-header>
                  <div class="d-flex align-center">
                    <item-icon
                      :icon-class="getItemIconClass(bait.baitId)"
                      small
                      class="mt-1"
                    />
                    <span>{{ getItemName(bait.baitId) }}</span>
                    <v-spacer />
                    <span>剩{{ bait.fishIds.length }}条</span>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div class="d-flex align-center flex-wrap" style="max-width: 500px">
                    <div
                      v-for="fishId in bait.fishIds"
                      :key="fishId"
                      class="d-flex align-center mx-1"
                    >
                      <item-icon
                        :icon-class="getItemIconClass(fishId)"
                        :title="getItemName(fishId)"
                      />
                      <span>{{ getItemName(fishId) }}</span>
                    </div>
                  </div>
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
import ItemIcon from '@/components/basic/ItemIcon'

export default {
  name: 'BaitDialog',
  components: { ItemIcon },
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
      sorterFilterTypes: DataUtil.BAIT_FISH_SORTER_TYPES,
      sorterTypeIndex: DataUtil.FISH_SORTER_TYPES.indexOf('QUANTITY'),
    }
  },
  computed: {
    completeTypes() {
      return this.completeTypeIndices.map(it => this.completeFilterTypes[it])
    },
    bigFishTypes() {
      return this.bigFishTypeIndices.map(it => this.bigFishFilterTypes[it])
    },
    sorterType() {
      return this.sorterFilterTypes[this.sorterTypeIndex]
    },
    baits() {
      const targetFishList = this.fishList.filter(fish => {
        const fishCompleted = this.getFishCompleted(fish._id)
        const isBigFish = this.bigFish.includes(fish._id)
        const isLivingLegend = DATA_CN.LIVING_LEGENDS.includes(fish._id)
        return (
          fish.gig == null &&
          ((this.completeTypes.includes('COMPLETED') && fishCompleted) ||
            (this.completeTypes.includes('UNCOMPLETED') && !fishCompleted)) &&
          ((this.bigFishTypes.includes('LIVING_LEGENDS') && isLivingLegend) ||
            (this.bigFishTypes.includes('OLD_ONES') && isBigFish && !isLivingLegend) ||
            (this.bigFishTypes.includes('NORMAL') && !isBigFish))
        )
      })
      const baitFishItems = targetFishList.map(fishData => {
        return {
          bait: fishData.bestCatchPath[0],
          fish: DataUtil.toItemId(fishData._id),
        }
      })
      const baitList = Object.values(_.groupBy(baitFishItems, 'bait')).map(
        baitFishList => {
          return {
            baitId: baitFishList[0].bait,
            fishIds: _.uniq(baitFishList.map(it => it.fish)),
          }
        }
      )
      console.debug(this.sorterType)
      return _.sortBy(baitList, bait => {
        if (this.sorterType === 'QUANTITY') {
          return -bait.fishIds.length
        } else {
          return bait.baitId
        }
      })
    },
    fishList() {
      return Object.values(this.fish)
    },
    ...mapState(['fish', 'bigFish']),
    ...mapGetters(['getFishCompleted', 'getItemName', 'getItemIconClass']),
  },
  methods: {
    onChange() {},
  },
}
</script>

<style scoped></style>
