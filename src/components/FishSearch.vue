<template>
  <v-row justify="center" style="padding: 0 12px">
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark block v-bind="attrs" v-on="on">
          Search
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Search Fish</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-autocomplete
                  v-model="fishId"
                  :items="fishSearchData"
                  item-value="id"
                  item-text="name"
                  label="Search"
                  clearable
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <template v-if="fish != null">
            <fish-list-expanded-header :value="fish" />
            <fish-list-item-content
              :open="dialog"
              :value="fish"
              :fish-time-part="fishListTimePart[fish._id]"
              :fish-weather-change-part="fishListWeatherChangePart[fish._id]"
              :predators="getPredators(fish)"
            ></fish-list-item-content>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="default" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import FishListItemContent from '@/components/FishListItemContent'
import { mapGetters, mapState } from 'vuex'
import FishListExpandedHeader from '@/components/FishListExpandedHeader'

export default {
  name: 'FishSearch',
  components: { FishListExpandedHeader, FishListItemContent },
  props: {
    fishData: {
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
    dialog: false,
    fishId: undefined,
  }),
  computed: {
    fish() {
      return this.fishData.filter(it => it._id === this.fishId)[0]
    },
    fishSearchData() {
      return this.fishData.map(it => ({ id: it._id, name: this.getItemName(it._id) }))
    },
    getPredators() {
      return value => DataUtil.getPredators(value, this.allFish, this.fishListTimePart, this.fishListWeatherChangePart)
    },
    ...mapState({ allFish: 'fish' }),
    ...mapGetters(['getItemName']),
  },
  watch: {
    dialog() {
      this.fishId = undefined
    },
  },
}
</script>

<style scoped></style>
