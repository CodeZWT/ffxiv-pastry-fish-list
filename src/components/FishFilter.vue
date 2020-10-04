<template>
  <v-card v-if="!loading" color="grey darken-3">
    <v-card-text>
      <!-- Patches -->
      <v-row no-gutters>
        <v-col>
          <div class="subtitle-2">{{ $t('filter.patch') }}</div>
        </v-col>
      </v-row>
      <v-row wrap no-gutters>
        <v-col v-for="version in exVersion" :key="version" class="col-12 col-md-6 my-1">
          <div style="align-items: center">
            <v-btn
              v-if="patchSelectedIndices[version].length === patches[version].length"
              text
              small
              @click="uncheckAll(version)"
            >
              {{ version }}
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn v-else text small @click="checkAll(version)">
              {{ version }}
              <v-icon>mdi-check-all</v-icon>
            </v-btn>
            <v-btn-toggle
              v-model="patchSelectedIndices[version]"
              column
              dense
              multiple
              active-class="primary"
              @change="onChange"
            >
              <v-btn v-for="patch in patches[version]" :key="patch" small>
                {{ patch.toFixed(1) }}
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-col>
      </v-row>
      <!-- Mark & BigFish -->
      <v-row no-gutters>
        <v-col class="col-12 col-md-6">
          <div class="subtitle-2">{{ $t('filter.mark.title') }}</div>
          <v-btn-toggle v-model="completeType" mandatory active-class="primary" dense @change="onChange">
            <v-btn v-for="type in completeFilterTypes" :key="type" small>{{ $t(`filter.mark.${type}`) }}</v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="6">
          <div class="subtitle-2">{{ $t('filter.bigFish.title') }}</div>
          <v-btn-toggle v-model="bigFishType" mandatory active-class="primary" dense @change="onChange">
            <v-btn v-for="type in bigFishFilterTypes" :key="type" small>{{ $t(`filter.bigFish.${type}`) }}</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-text>
      <v-row no-gutters>
        <v-col>
          <div class="subtitle-2">{{ $t('filter.showFirstNFish.title') }}</div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-btn-toggle v-model="fishNType" dense active-class="primary" @change="onChange">
            <v-btn v-for="type in fishNFilterTypes" :key="type" small>
              {{ $t(`filter.showFirstNFish.${type}`) }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
  </v-card>
</template>

<script>
const PATCHES = {
  '2.x': [2.0, 2.1, 2.2, 2.3, 2.4, 2.5],
  '3.x': [3.0, 3.1, 3.2, 3.3, 3.4, 3.5],
  '4.x': [4.0, 4.1, 4.2, 4.3, 4.4, 4.5],
  '5.x': [5.0, 5.1, 5.2],
}
const COMPLETE_FILTER_TYPES = ['ALL', 'COMPLETED', 'UNCOMPLETED']
const BIG_FISH_FILTER_TYPES = ['ALL', 'BIG_FISH', 'NOT_BIG_FISH']
const FISH_N_FILTER_TYPES = ['10', '20', '50', 'ALL']

export default {
  name: 'FishFilter',
  props: {
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
      completeFilterTypes: COMPLETE_FILTER_TYPES,
      completeType: COMPLETE_FILTER_TYPES.indexOf('UNCOMPLETED'),
      bigFishFilterTypes: BIG_FISH_FILTER_TYPES,
      bigFishType: BIG_FISH_FILTER_TYPES.indexOf('BIG_FISH'),
      fishNFilterTypes: FISH_N_FILTER_TYPES,
      fishNType: FISH_N_FILTER_TYPES.length - 1,
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
          .flatMap(([version, patches]) => patches.map(patch => this.patches[version][patch]))
          .sort(),
        completeType: this.completeFilterTypes[this.completeType],
        bigFishType: this.bigFishFilterTypes[this.bigFishType],
        fishN: fishNTypeText === 'ALL' ? -1 : +fishNTypeText,
      }
    },
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
      this.completeType = COMPLETE_FILTER_TYPES.indexOf(filters?.completeType ?? 'UNCOMPLETED')
      this.bigFishType = BIG_FISH_FILTER_TYPES.indexOf(filters?.bigFishType ?? 'BIG_FISH')
      this.fishNType = FISH_N_FILTER_TYPES.indexOf(this.fishN2Type(filters?.fishN))
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
      return patches?.map(it => PATCHES[version].indexOf(it)).filter(patch => patch !== -1) ?? []
    },
    fishN2Type(fishN) {
      const n = fishN ?? -1
      return n === -1 ? 'ALL' : n.toString()
    },
  },
}
</script>

<style scoped></style>
