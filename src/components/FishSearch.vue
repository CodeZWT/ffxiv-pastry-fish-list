<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.mobile" max-width="1264px" style="z-index: 9999">
    <v-card>
      <v-card-title>
        <span class="headline">{{ $t('search.dialog.title') }}</span>
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
                :label="$t('search.dialog.placeholder')"
                clearable
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <template v-if="fish != null">
          <v-divider class="mb-3" />
          <div style="position:relative;" class="py-4 px-6">
            <fish-list-expanded-header :value="fish" />
          </div>
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
        <v-btn color="default" text @click="dialog = false">{{ $t('search.dialog.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
    value: {
      type: Boolean,
      default: false,
    },
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
    fishId: undefined,
  }),
  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(showDialog) {
        return this.$emit('input', showDialog)
      },
    },
    fish() {
      return this.fishData.filter(it => it._id === this.fishId)[0]
    },
    fishSearchData() {
      return this.fishData.map(it => ({ id: it._id, name: this.getItemName(it._id) }))
    },
    getPredators() {
      return value =>
        DataUtil.getPredators(
          value,
          this.allFish,
          this.fishListTimePart,
          this.fishListWeatherChangePart,
          this.getFishCompleted(value._id)
        )
    },
    ...mapState({ allFish: 'fish' }),
    ...mapGetters(['getItemName', 'getFishCompleted']),
  },
  watch: {
    dialog() {
      this.fishId = undefined
    },
  },
}
</script>

<style scoped></style>
