<template>
  <v-dialog
    :value="showBaitDialog"
    @input="$emit('input', $event)"
    max-width="600"
    scrollable
  >
    <v-card color="">
      <v-card-title class="pa-0">
        <v-tabs v-model="tabIndex" grow>
          <v-tab>
            {{ $t('baitSearch.dialog.baitList') }}
          </v-tab>
          <v-tab>
            {{ $t('baitSearch.dialog.baitBell') }}
          </v-tab>
        </v-tabs>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row v-if="!isListTab" class="d-flex align-center">
          <v-col class="d-flex align-center">
            <span class="mr-2">开启鱼饵完成提醒</span>
            <v-switch
              :input-value="baitSetting.enableNotification"
              @change="onChange({ enableNotification: $event })"
            />
          </v-col>
        </v-row>
        <v-row no-gutters v-if="isListTab || enableBaitNotification">
          <v-col cols="12" class="my-2">
            <v-card color="system" outlined>
              <v-subheader v-if="isListTab">筛选查找范围</v-subheader>
              <v-subheader v-else>筛选提醒范围</v-subheader>
              <v-divider />
              <v-row>
                <v-col class="mx-2">
                  <div class="subtitle-2 ml-2">{{ $t('filter.bigFish.title') }}</div>
                  <v-btn-toggle
                    :value="bigFishTypeIndices"
                    multiple
                    mandatory
                    rounded
                    active-class="primary"
                    dense
                    @change="onFilterChange('bigFishTypes', bigFishFilterTypes, $event)"
                  >
                    <v-btn small v-for="type in bigFishFilterTypes" :key="type">
                      {{ $t(`filter.bigFish.${type}`) }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-col class="mx-2" v-if="isListTab">
                  <div class="subtitle-2 ml-2">{{ $t('filter.mark.title') }}</div>
                  <v-btn-toggle
                    :value="completeTypeIndices"
                    multiple
                    mandatory
                    rounded
                    active-class="primary"
                    dense
                    @change="onFilterChange('completeTypes', completeFilterTypes, $event)"
                  >
                    <v-btn small v-for="type in completeFilterTypes" :key="type">
                      {{ $t(`filter.mark.${type}`) }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
              <v-row v-if="isListTab">
                <v-col class="mx-2">
                  <div class="subtitle-2 ml-2">{{ $t('filter.sorter.title') }}</div>
                  <v-btn-toggle
                    :value="sorterTypeIndex"
                    dense
                    rounded
                    mandatory
                    active-class="primary"
                    @change="onFilterChange('sorterType', sorterFilterTypes, $event)"
                  >
                    <v-btn small v-for="type in sorterFilterTypes" :key="type">
                      {{ $t(`filter.sorter.${type}`) }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <template v-if="isListTab">
            <v-col cols="12" class="my-2">
              <v-autocomplete
                ref="search"
                v-model="searchBaitId"
                :items="baitsForSearch"
                item-value="id"
                item-text="name"
                :label="$t('baitSearch.dialog.placeholder')"
                clearable
                solo
                :filter="filterOptions"
                :hint="$t('baitSearch.dialog.hint')"
              >
                <template v-slot:item="data">
                  <click-helper>
                    <div class="d-flex">
                      <v-list-item-avatar>
                        <div :class="data.item.icon" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>
                          <div>
                            {{ data.item.name }}
                          </div>
                        </v-list-item-title>
                      </v-list-item-content>
                    </div>
                  </click-helper>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-expansion-panels>
                <v-expansion-panel v-for="(bait, index) in baits" :key="index">
                  <v-expansion-panel-header>
                    <div class="d-flex align-center">
                      <item-icon :icon-class="bait.icon" small class="mt-1" />
                      <span :title="toItemTitle(bait)">{{ bait.name }}</span>
                      <v-spacer />
                      <span>{{ bait.fishList.length }}条</span>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="d-flex align-center flex-wrap" style="max-width: 500px">
                      <div
                        v-for="fish in bait.fishList"
                        :key="fish.id"
                        class="d-flex align-center mx-1"
                      >
                        <item-icon :icon-class="fish.icon" />
                        <span :title="toItemTitle(fish)">{{ fish.name }}</span>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <click-helper @click="$emit('input', false)" block>
          <v-btn color="primary" block>{{ $t('search.dialog.close') }}</v-btn>
        </click-helper>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import { mapGetters, mapMutations, mapState } from 'vuex'
import _ from 'lodash'
import ItemIcon from '@/components/basic/ItemIcon'
import PinyinMatch from 'pinyin-match'
import ClickHelper from '@/components/basic/ClickHelper'
import FIX from '@/store/fix'

export default {
  name: 'BaitDialog',
  components: { ClickHelper, ItemIcon },
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
      // completeTypeIndices: [0, 1],
      // bigFishTypeIndices: [0, 1, 2],
      bigFishFilterTypes: DataUtil.BIG_FISH_FILTER_TYPES,
      sorterFilterTypes: DataUtil.BAIT_FISH_SORTER_TYPES,
      // sorterTypeIndex: DataUtil.FISH_SORTER_TYPES.indexOf('QUANTITY'),
      searchBaitId: undefined,
      tabIndex: 0,
      FILTER_TYPES: ['listFilter', 'notificationFilter'],
    }
  },
  computed: {
    filterType() {
      return this.FILTER_TYPES[this.tabIndex]
    },
    isListTab() {
      return this.tabIndex === 0
    },
    completeTypes() {
      return this.baitSetting[this.filterType].completeTypes
    },
    completeTypeIndices() {
      return this.completeTypes.map(type => this.completeFilterTypes.indexOf(type))
    },
    bigFishTypes() {
      return this.baitSetting[this.filterType].bigFishTypes
    },
    bigFishTypeIndices() {
      return this.bigFishTypes.map(type => this.bigFishFilterTypes.indexOf(type))
    },
    sorterType() {
      return this.baitSetting[this.filterType].sorterType
    },
    sorterTypeIndex() {
      return this.sorterFilterTypes.indexOf(this.sorterType)
    },
    baits() {
      const baitFishItems = DataUtil.generateBaitFishItems(
        this.fishList,
        this.completeTypes,
        this.bigFishTypes,
        this.allCompletedFish
      )
      const remainingBaitDict = _.mapValues(
        _.groupBy(baitFishItems, 'bait'),
        baitFishList => {
          return {
            baitId: baitFishList[0].bait,
            fishIds: _.uniq(baitFishList.map(it => it.fish)),
          }
        }
      )
      const baitList = FIX.BAITS.map(
        baitId => remainingBaitDict[baitId] ?? { baitId, fishIds: [] }
      )

      return _.sortBy(baitList, bait => {
        if (this.sorterType === 'QUANTITY') {
          return -bait.fishIds.length
        } else {
          return bait.baitId
        }
      })
        .filter(it => this.searchBaitId == null || it.baitId === this.searchBaitId)
        .map(it => this.assembleBait(it))
    },
    baitsForSearch() {
      return FIX.BAITS.map(baitId => {
        return {
          id: baitId,
          name: this.getItemName(baitId),
          icon: this.getItemIconClass(baitId),
        }
      })
    },
    fishList() {
      return Object.values(this.fish)
    },
    ...mapState(['fish', 'bigFish']),
    ...mapGetters([
      'allCompletedFish',
      'getItemName',
      'getItemIconClass',
      'enableBaitNotification',
      'baitSetting',
    ]),
  },
  methods: {
    onFilterChange(updatePath, types, indices) {
      let updatePart
      if (Array.isArray(indices)) {
        updatePart = indices.map(i => types[i])
      } else {
        updatePart = types[indices]
      }
      const baitSetting = _.cloneDeep(this.baitSetting)
      _.set(baitSetting, `${this.filterType}.${updatePath}`, updatePart)
      console.debug('update filter', baitSetting)
      this.updateBaitSetting(baitSetting)
      if (this.filterType === 'notificationFilter') {
        this.updateRemainingBaitIdsWithoutCheck()
      }
    },
    filterOptions(item, searchText, itemText) {
      if (this.$i18n.locale === 'zh-CN') {
        return PinyinMatch.match(itemText, searchText) !== false
      } else {
        return itemText.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      }
    },
    toItemTitle: DataUtil.toItemTitle,
    assembleBait(baitMeta) {
      return {
        id: baitMeta.baitId,
        icon: this.getItemIconClass(baitMeta.baitId),
        name: this.getItemName(baitMeta.baitId),
        fishList: baitMeta.fishIds.map(fishId => {
          return {
            id: fishId,
            icon: this.getItemIconClass(fishId),
            name: this.getItemName(fishId),
          }
        }),
      }
    },
    onChange(updatePart) {
      console.debug('on change', updatePart)
      this.updateBaitSetting({
        ...this.baitSetting,
        ...updatePart,
      })
    },
    ...mapMutations(['updateBaitSetting', 'updateRemainingBaitIdsWithoutCheck']),
  },
}
</script>

<style scoped></style>
