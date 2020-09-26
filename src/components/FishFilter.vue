<template>
  <v-card class="my-2" v-if="!loading">
    <v-card-text>
      <!-- Patches -->
      <v-row no-gutters>
        <v-col>
          <div class="subtitle-2">Patches</div>
        </v-col>
      </v-row>
      <v-row wrap no-gutters>
        <v-col v-for="version in exVersion" :key="version" cols="6">
          <v-row style="align-items: center">
            <v-btn
              v-if="patchSelectedIndices[version].length === patches[version].length"
              text
              @click="uncheckAll(version)"
            >
              {{ version }}
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn v-else text @click="checkAll(version)" small>
              {{ version }}
              <v-icon>mdi-check-all</v-icon>
            </v-btn>
            <v-btn-toggle
              v-model="patchSelectedIndices[version]"
              column
              dense
              multiple
              active-class="primary--text"
              @change="onChange"
            >
              <v-btn v-for="patch in patches[version]" :key="patch" small>
                {{ patch.toFixed(1) }}
              </v-btn>
            </v-btn-toggle>
          </v-row>
        </v-col>
      </v-row>
      <!-- Mark & BigFish -->
      <v-row no-gutters>
        <v-col cols="6">
          <div class="subtitle-2">Mark</div>
          <v-btn-toggle v-model="completeType" mandatory active-class="primary--text" dense @change="onChange">
            <v-btn v-for="type in completeFilterTypes" :key="type" small>{{ type }}</v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="6">
          <div class="subtitle-2">Big Fish</div>
          <v-btn-toggle v-model="bigFishType" mandatory active-class="primary--text" dense
                        @change="onChange">
            <v-btn v-for="type in bigFishFilterTypes" :key="type" small>{{ type }}</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-text>
      <v-row no-gutters>
        <v-col>
          <div class="subtitle-2">Show first N fish</div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-btn-toggle v-model="fishNType" dense @change="onChange">
            <v-btn v-for="type in fishNFilterTypes" :key="type" color="primary--text" small>
              {{ type }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />

    <!-- Search -->
    <v-card-text>
      <v-autocomplete
        v-model="fishId"
        :items="fishData"
        item-value="id"
        item-text="name"
        label="Search"
        clearable
        @input="onChange"
      ></v-autocomplete>
    </v-card-text>
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
    fishData: {
      type: Array,
      default: () => [],
    },
    filters: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      fishId: this.filters?.fishId ?? undefined,
      exVersion: ['2.x', '3.x', '4.x', '5.x'],
      patches: PATCHES,
      patchSelectedIndices: {
        '2.x': this.getPatchesInVersion('2.x'),
        '3.x': this.getPatchesInVersion('3.x'),
        '4.x': this.getPatchesInVersion('4.x'),
        '5.x': this.getPatchesInVersion('5.x'),
      },
      completeFilterTypes: COMPLETE_FILTER_TYPES,
      completeType: COMPLETE_FILTER_TYPES.indexOf(this.filters?.completeType ?? 'UNCOMPLETED'),
      bigFishFilterTypes: BIG_FISH_FILTER_TYPES,
      bigFishType: BIG_FISH_FILTER_TYPES.indexOf(this.filters?.bigFishType ?? 'BIG_FISH'),
      fishNFilterTypes: FISH_N_FILTER_TYPES,
      fishNType: FISH_N_FILTER_TYPES.indexOf(this.fishN2Type(this.filters?.fishN)),
    }
  },
  computed: {
    loading() {
      console.log(this.filters)
      return this.filters === {}
    },
    filtersReturned() {
      const fishNTypeText = this.fishNFilterTypes[this.fishNType]
      return {
        fishId: this.fishId,
        patches: Object.entries(this.patchSelectedIndices).flatMap(([version, patches]) =>
          patches.map(patch => this.patches[version][patch])
        ),
        completeType: this.completeFilterTypes[this.completeType],
        bigFishType: this.bigFishFilterTypes[this.bigFishType],
        fishN: fishNTypeText === 'ALL' ? -1 : +fishNTypeText,
      }
    },
  },
  methods: {
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
    getPatchesInVersion(version) {
      return this.filters?.patches?.map(it => PATCHES[version].indexOf(it)).filter(patch => patch !== -1) ?? []
    },
    fishN2Type(fishN) {
      const n = fishN ?? -1
      return n === -1 ? 'ALL' : n.toString()
    },
  },
}
</script>

<style scoped></style>
