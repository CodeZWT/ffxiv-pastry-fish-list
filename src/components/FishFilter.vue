<template>
  <v-expand-transition>
    <v-card v-if="show && !loading" color="inner" class="mb-2 rounded-b-lg">
      <v-expand-transition>
        <template>
          <div v-if="isNormalTabActive">
            <v-card-text>
              <!-- Patches -->
              <v-row no-gutters>
                <v-col>
                  <div class="subtitle-2">{{ $t('filter.patch') }}</div>
                </v-col>
              </v-row>
              <v-row wrap no-gutters>
                <v-col
                  v-for="version in exVersion"
                  :key="version"
                  class="col-12 col-md-6 my-1"
                >
                  <div>
                    <div class="d-flex align-center">
                      <div class="mx-2">{{ version }}</div>
                      <v-btn text small @click="checkAll(version)">
                        全选
                        <v-icon>mdi-check-all</v-icon>
                      </v-btn>
                      <v-btn text small @click="uncheckAll(version)">
                        清空
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <v-btn-toggle
                      v-model="patchSelectedIndices[version]"
                      rounded
                      dense
                      multiple
                      active-class="primary"
                      @change="onChange"
                    >
                      <v-btn small v-for="patch in patches[version]" :key="patch">
                        {{ patch.toFixed(1) }}
                      </v-btn>
                    </v-btn-toggle>
                  </div>
                </v-col>
              </v-row>
              <!-- Mark & BigFish -->
              <v-row no-gutters class="my-2">
                <v-col class="col-12 col-md-6">
                  <div class="subtitle-2">{{ $t('filter.bigFish.title') }}</div>
                  <v-btn-toggle
                    v-model="bigFishTypes"
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
                  <!--                  <v-tooltip bottom>-->
                  <!--                    <template v-slot:activator="{ on, attrs }">-->
                  <!--                      <v-icon v-bind="attrs" v-on="on" class="mx-1">-->
                  <!--                        mdi-help-circle-outline-->
                  <!--                      </v-icon>-->
                  <!--                    </template>-->
                  <!--                    <div>-->
                  <!--                      默认列表中不包括没有时间与天气限制的普通鱼。（当前版本的鱼除外，仍会显示）-->
                  <!--                    </div>-->
                  <!--                    <div>-->
                  <!--                      请直接搜索，或进入图鉴页面查看。也可以使用固定功能可以将鱼显示在固定列表中。-->
                  <!--                    </div>-->
                  <!--                  </v-tooltip>-->
                </v-col>
                <v-col cols="6">
                  <div class="subtitle-2">{{ $t('filter.fishConstraint.title') }}</div>
                  <v-btn-toggle
                    v-model="fishConstraintTypes"
                    multiple
                    mandatory
                    rounded
                    active-class="primary"
                    dense
                    @change="onChange"
                  >
                    <v-btn small v-for="type in fishConstraintFilterTypes" :key="type">
                      {{ $t(`filter.fishConstraint.${type}`) }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="col-12">
                  <div class="subtitle-2">{{ $t('filter.mark.title') }}</div>
                  <v-btn-toggle
                    v-model="completeTypes"
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
            </v-card-text>
            <v-divider />
            <v-card-text>
              <v-row no-gutters>
                <v-col class="col-12">
                  <slot></slot>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider />
            <!--            <v-card-text>-->
            <!--              <v-row no-gutters>-->
            <!--                <v-col>-->
            <!--                  <div class="subtitle-2">{{ $t('filter.showFirstNFish.title') }}</div>-->
            <!--                </v-col>-->
            <!--              </v-row>-->
            <!--              <v-row no-gutters>-->
            <!--                <v-col>-->
            <!--                  <v-btn-toggle-->
            <!--                    v-model="fishNType"-->
            <!--                    dense-->
            <!--                    rounded-->
            <!--                    active-class="primary"-->
            <!--                    @change="onChange"-->
            <!--                  >-->
            <!--                    <v-btn small v-for="type in fishNFilterTypes" :key="type">-->
            <!--                      {{ $t(`filter.showFirstNFish.${type}`) }}-->
            <!--                    </v-btn>-->
            <!--                  </v-btn-toggle>-->
            <!--                </v-col>-->
            <!--              </v-row>-->
            <!--            </v-card-text>-->
            <!--            <v-divider />-->
          </div>
        </template>
      </v-expand-transition>
      <v-card-text>
        <v-row no-gutters>
          <v-col>
            <div class="subtitle-2">{{ $t('filter.sorter.title') }}</div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-btn-toggle
              v-model="sorterType"
              dense
              rounded
              mandatory
              active-class="primary"
              @change="onChange"
            >
              <v-btn small v-for="type in fishSorterTypes" :key="type">
                {{ $t(`filter.sorter.${type}`) }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-expand-transition>
</template>

<script>
import { mapGetters } from 'vuex'
import DataUtil from '@/utils/DataUtil'

const PATCHES = {
  '2.x': [2.0, 2.1, 2.2, 2.3, 2.4, 2.5],
  '3.x': [3.0, 3.1, 3.2, 3.3, 3.4, 3.5],
  '4.x': [4.0, 4.1, 4.2, 4.3, 4.4, 4.5],
  '5.x': [5.0, 5.1, 5.2, 5.3],
}
const FISH_N_FILTER_TYPES = ['10', '20', '50', 'ALL']

export default {
  name: 'FishFilter',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    filters: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      exVersion: ['2.x', '3.x', '4.x', '5.x'],
      patches: PATCHES,
      patchSelectedIndices: {
        '2.x': [],
        '3.x': [],
        '4.x': [],
        '5.x': [],
      },
      completeFilterTypes: DataUtil.COMPLETE_FILTER_TYPES,
      completeTypes: [],
      bigFishFilterTypes: DataUtil.BIG_FISH_FILTER_TYPES,
      bigFishTypes: [],
      fishNFilterTypes: FISH_N_FILTER_TYPES,
      fishNType: FISH_N_FILTER_TYPES.length - 1,
      fishSorterTypes: DataUtil.FISH_SORTER_TYPES,
      sorterType: DataUtil.FISH_SORTER_TYPES.indexOf('COUNTDOWN'),
      fishConstraintFilterTypes: DataUtil.FISH_CONSTRAINT_FILTER_TYPES,
      fishConstraintTypes: [],
    }
  },
  computed: {
    loading() {
      return this.filters === {}
    },
    filtersReturned() {
      const fishNTypeText = this.fishNFilterTypes[this.fishNType]
      return {
        patches: Object.entries(this.patchSelectedIndices)
          .flatMap(([version, patches]) =>
            patches.map(patch => this.patches[version][patch])
          )
          .sort(),
        completeTypes: this.completeTypes.map(i => this.completeFilterTypes[i]),
        bigFishTypes: this.bigFishTypes.map(i => this.bigFishFilterTypes[i]),
        fishN: fishNTypeText === 'ALL' ? -1 : +fishNTypeText,
        sorterType: this.fishSorterTypes[this.sorterType],
        fishConstraintTypes: this.fishConstraintTypes.map(
          i => this.fishConstraintFilterTypes[i]
        ),
      }
    },
    ...mapGetters(['isNormalTabActive']),
  },
  watch: {
    filters: {
      handler(filters) {
        this.init(filters)
      },
      immediate: true,
    },
  },
  methods: {
    init(filters) {
      this.patchSelectedIndices = {
        '2.x': this.getPatchesInVersion(filters?.patches, '2.x'),
        '3.x': this.getPatchesInVersion(filters?.patches, '3.x'),
        '4.x': this.getPatchesInVersion(filters?.patches, '4.x'),
        '5.x': this.getPatchesInVersion(filters?.patches, '5.x'),
      }
      this.completeTypes = (filters?.completeTypes ?? []).map(typeStr =>
        DataUtil.COMPLETE_FILTER_TYPES.indexOf(typeStr)
      )
      this.bigFishTypes = (filters?.bigFishTypes ?? []).map(typeStr =>
        DataUtil.BIG_FISH_FILTER_TYPES.indexOf(typeStr)
      )
      this.fishConstraintTypes = (filters?.fishConstraintTypes ?? []).map(typeStr =>
        DataUtil.FISH_CONSTRAINT_FILTER_TYPES.indexOf(typeStr)
      )
      this.fishNType = FISH_N_FILTER_TYPES.indexOf(this.fishN2Type(filters?.fishN))
      this.sorterType = DataUtil.FISH_SORTER_TYPES.indexOf(
        filters?.sorterType ?? 'COUNTDOWN'
      )
    },
    checkAll(version) {
      this.$set(
        this.patchSelectedIndices,
        version,
        this.patches[version].map((it, index) => index)
      )
      this.$emit('input', this.filtersReturned)
    },
    uncheckAll(version) {
      this.$set(this.patchSelectedIndices, version, [])
      this.$emit('input', this.filtersReturned)
    },
    onChange() {
      this.$emit('input', this.filtersReturned)
    },
    getPatchesInVersion(patches, version) {
      return (
        patches?.map(it => PATCHES[version].indexOf(it)).filter(patch => patch !== -1) ??
        []
      )
    },
    fishN2Type(fishN) {
      const n = fishN ?? -1
      return n === -1 ? 'ALL' : n.toString()
    },
  },
}
</script>

<style scoped></style>
