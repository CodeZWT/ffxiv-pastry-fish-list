<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="isMobile"
    max-width="1264px"
    style="z-index: 100"
    scrollable
  >
    <v-card>
      <v-card-title>
        <v-autocomplete
          ref="search"
          v-model="fishId"
          :items="fishSearchData"
          item-value="id"
          item-text="name"
          :label="$t('search.dialog.placeholder')"
          clearable
          solo
          :filter="filterOptions"
        >
          <template v-slot:item="data">
            <click-helper>
              <div class="d-flex">
                <v-list-item-avatar>
                  <raw-item-icon :icon-class="data.item.icon" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    <div>
                      {{ data.item.name }}
                    </div>
                    <div style="font-size: small">
                      {{ data.item.spotNamesSimple }}
                    </div>
                  </v-list-item-title>
                </v-list-item-content>
              </div>
            </click-helper>
          </template>
        </v-autocomplete>
      </v-card-title>
      <template v-if="fish != null">
        <v-divider />
        <v-card-text>
          <fish-detail :fish="fish" :now="now" @close-dialog="$emit('input', false)" />
        </v-card-text>
      </template>
      <v-divider />
      <v-card-actions>
        <click-helper @click="dialog = false" block>
          <v-btn color="primary" block>{{ $t('search.dialog.close') }}</v-btn>
        </click-helper>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import { mapGetters, mapState } from 'vuex'
import PinyinMatch from 'pinyin-match'
import ClickHelper from '@/components/basic/ClickHelper'
import FishDetail from '@/components/FishDetail'
import RawItemIcon from '@/components/basic/RawItemIcon'

export default {
  name: 'FishSearch',
  components: { RawItemIcon, FishDetail, ClickHelper },
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
    now: {
      type: Number,
      default: Date.now(),
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
    fishSearchData() {
      return this.fishData.map(it => {
        const fishingSpots = this.fishDict[it._id].fishingSpots
        let spotText = fishingSpots
          .slice(0, 3)
          .map(it => it.fishingSpotName)
          .join('，')
        const remaining = fishingSpots.length - 3
        if (remaining > 0) {
          spotText = this.$t('search.dialog.spot', { spots: spotText, remaining })
        }
        return {
          id: it._id,
          name: this.getItemName(it._id),
          icon: this.getItemIconClass(it._id),
          spotNamesSimple: spotText,
          spotNamesFull: fishingSpots.map(it => it.fishingSpotName).join(','),
        }
      })
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
    filterOptions(item, searchText) {
      if (this.$i18n.locale === 'zh-CN') {
        return (
          PinyinMatch.match(item.name, searchText) !== false ||
          PinyinMatch.match(item.spotNamesFull, searchText)
        )
      } else {
        return (
          item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
          item.spotNamesFull.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        )
      }
    },
  },
}
</script>

<style scoped></style>
