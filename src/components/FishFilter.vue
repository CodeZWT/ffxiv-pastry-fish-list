<template>
  <v-card class="my-2">
    <v-card-subtitle>Patches</v-card-subtitle>
    <v-card-text>
      <v-layout row wrap>
        <v-col v-for="version in exVersion" :key="version" cols="6">
          <div class="d-flex row">
            <v-btn
              v-if="patchSelectedIndices[version].length === patches[version].length"
              text
              @click="uncheckAll(version)"
            >
              {{ version }}
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn v-else text @click="checkAll(version)">
              {{ version }}
              <v-icon>mdi-check-all</v-icon>
            </v-btn>
            <v-chip-group v-model="patchSelectedIndices[version]" column multiple>
              <v-chip v-for="patch in patches[version]" :key="patch" outlined @input="onChange">
                {{ patch.toFixed(1) }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-col>
      </v-layout>
    </v-card-text>

    <!--    <v-card-subtitle>Mark</v-card-subtitle>-->
    <!--  TODO: sorter & pin list  -->
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <div class="subtitle-2">Mark</div>
          <v-chip-group v-model="completeType" mandatory>
            <v-chip v-for="type in completeFilterTypes" :key="type" outlined @input="onChange">{{ type }}</v-chip>
          </v-chip-group>
        </v-col>
        <v-col cols="6">
          <div class="subtitle-2">Big Fish</div>
          <v-chip-group v-model="bigFishType" mandatory>
            <v-chip v-for="type in bigFishFilterTypes" :key="type" outlined @input="onChange">{{ type }}</v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
    </v-card-text>

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
      completeFilterTypes: ['ALL', 'COMPLETED', 'UNCOMPLETED'],
      completeType: this.filters?.completeType ?? 2,
      bigFishFilterTypes: ['ALL', 'BIG_FISH', 'NOT_BIG_FISH'],
      bigFishType: this.filters?.bigFishType ?? 1,
    }
  },
  computed: {
    filtersReturned() {
      return {
        fishId: this.fishId,
        patches: Object.entries(this.patchSelectedIndices).flatMap(([version, patches]) =>
          patches.map(patch => this.patches[version][patch])
        ),
        completeType: this.completeFilterTypes[this.completeType],
        bigFishType: this.bigFishFilterTypes[this.bigFishType],
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
    },
    uncheckAll(version) {
      this.$set(this.patchSelectedIndices, version, [])
    },
    onChange() {
      this.$emit('input', this.filtersReturned)
    },
    getPatchesInVersion(version) {
      return this.filters?.patches?.map(it => PATCHES[version].indexOf(it)).filter(patch => patch !== -1) ?? []
    },
  },
}
</script>

<style scoped></style>