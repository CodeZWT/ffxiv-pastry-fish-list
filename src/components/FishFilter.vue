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

    <v-card-subtitle>Mark</v-card-subtitle>
    <v-card-text>
      <v-chip-group v-model="completeType" mandatory>
        <v-chip v-for="type in completeFilterTypes" :key="type" outlined @input="onChange">{{ type }}</v-chip>
      </v-chip-group>
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
export default {
  name: 'FishFilter',
  props: {
    fishData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fishId: undefined,
      exVersion: ['2.x', '3.x', '4.x', '5.x'],
      patches: {
        '2.x': [2.0, 2.1, 2.2, 2.3, 2.4, 2.5],
        '3.x': [3.0, 3.1, 3.2, 3.3, 3.4, 3.5],
        '4.x': [4.0, 4.1, 4.2, 4.3, 4.4, 4.5],
        '5.x': [5.0, 5.1, 5.2],
      },
      patchSelectedIndices: {
        '2.x': [],
        '3.x': [],
        '4.x': [],
        '5.x': [],
      },
      completeFilterTypes: ['ALL', 'COMPLETED', 'UNCOMPLETED'],
      completeType: 2,
    }
  },
  computed: {
    filters() {
      return {
        fishId: this.fishId,
        patches: Object.entries(this.patchSelectedIndices).flatMap(([version, patches]) =>
          patches.map(patch => this.patches[version][patch])
        ),
        completeType: this.completeFilterTypes[this.completeType],
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
      this.$emit('input', this.filters)
    },
    // customFilter(item, queryText, itemText) {
    //   const textOne = item.name.toLowerCase()
    //   const textTwo = item.abbr.toLowerCase()
    //   const searchText = queryText.toLowerCase()
    //
    //   return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
    // },
  },
}
</script>

<style scoped></style>
