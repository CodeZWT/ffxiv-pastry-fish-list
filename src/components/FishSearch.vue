<template>
  <v-dialog v-model="dialog" :fullscreen="isMobile" max-width="1264px" style="z-index: 9998" scrollable>
    <v-card>
      <!--      <v-card-title>-->
      <!--        <span class="headline">{{ $t('search.dialog.title') }}</span>-->
      <!--      </v-card-title>-->
      <v-card-text>
        <div>
          <!--          <v-row v-if="isMobile">-->
          <!--            <v-col>-->
          <!--              <v-icon class="mr-1">mdi-information</v-icon>-->
          <!--              -->
          <!--            </v-col>-->
          <!--          </v-row>-->
          <v-row>
            <v-col>
              <v-autocomplete
                ref="search"
                v-model="fishId"
                :items="fishSearchData"
                item-value="id"
                item-text="name"
                :label="$t('search.dialog.placeholder')"
                clearable
                :filter="filterOptions"
                :hint="$t('search.dialog.hint')"
              >
                <template v-slot:item="data">
                  <click-helper>
                    <div class="d-flex">
                      <v-list-item-avatar>
                        <div :class="data.item.icon" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title v-html="data.item.name"></v-list-item-title>
                      </v-list-item-content>
                    </div>
                  </click-helper>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </div>
        <template v-if="fish != null">
          <v-divider class="mb-3" />
          <fish-detail :fish="fish" />
        </template>
      </v-card-text>
      <v-card-actions>
        <click-helper @click="dialog = false" block>
          <v-btn color="default" block text>{{ $t('search.dialog.close') }}</v-btn>
        </click-helper>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import { mapGetters, mapState } from 'vuex'
import * as PinyinMatch from 'pinyin-match'
import ClickHelper from '@/components/basic/ClickHelper'
import FishDetail from '@/components/FishDetail'

export default {
  name: 'FishSearch',
  components: { FishDetail, ClickHelper },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    fishData: {
      type: Array,
      default: () => [],
    },
    fishDict: {
      type: Object,
      default: () => ({}),
    },
    fishListTimePart: {
      type: Object,
      default: () => ({}),
    },
    fishListWeatherChangePart: {
      type: Object,
      default: () => ({}),
    },
    extraFishListTimePart: {
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
    // fish() {
    //   return this.fishData.filter(it => it._id === this.fishId)[0]
    // },
    fishSearchData() {
      return this.fishData.map(it => ({
        id: it._id,
        name: this.getItemName(it._id),
        icon: this.getItemIconClass(it._id),
      }))
    },
    // getPredators() {
    //   return value =>
    //     DataUtil.getPredators(this.allFish[value], this.allFish, this.fishListTimePart, this.fishListWeatherChangePart)
    // },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    fish() {
      return DataUtil.assembleFishForDetail(
        this.fishId,
        this.allFish,
        this.fishDict,
        this.fishListTimePart,
        this.extraFishListTimePart,
        this.fishListWeatherChangePart
      )
    },
    ...mapState({ allFish: 'fish' }),
    ...mapGetters(['getItemName', 'getFishCompleted', 'getItemIconClass']),
  },
  watch: {
    dialog(dialog) {
      this.fishId = undefined
      if (dialog) {
        setTimeout(() => {
          // this.$refs.search.focus()
          // console.log(this.$refs.search.$el.getElementsByTagName('input')[0])
          this.$refs.search.$el.getElementsByTagName('input')[0].click()
        }, 300)
      }
    },
    fishId(fishId) {
      if (fishId != null) {
        this.$emit('change', fishId)
      }
    },
  },
  methods: {
    filterOptions(item, searchText, itemText) {
      if (this.$i18n.locale === 'zh-CN') {
        return PinyinMatch.match(itemText, searchText) !== false
      } else {
        return itemText.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      }
    },
  },
}
</script>

<style scoped></style>