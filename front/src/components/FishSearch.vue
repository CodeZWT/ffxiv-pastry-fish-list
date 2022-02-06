<template>
  <rc-dialog
    v-model="dialog"
    :fullscreen="isMobile"
    max-width="1264px"
    style="z-index: 100"
    scrollable
    autofocus
  >
    <v-card>
      <v-card-title>
        <rc-autocomplete
          ref="search"
          v-model="targetId"
          :search-input.sync="searchText"
          :items="searchData"
          item-value="id"
          item-text="name"
          :label="$t('search.dialog.placeholder')"
          clearable
          outline
          :filter="filterOptions"
        >
          <template v-slot:item="data">
            <div class="d-flex">
              <v-list-item-avatar>
                <raw-item-icon
                  v-if="data.item.type === 'fish'"
                  :icon-class="data.item.icon"
                />
                <div v-else class="d-flex align-center">
                  <div :class="data.item.icon"></div>
                </div>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  <div>
                    {{ data.item.name }}
                  </div>
                  <div v-if="data.item.type === 'fish'" style="font-size: small">
                    {{ data.item.spotNamesSimple }}
                  </div>
                </v-list-item-title>
              </v-list-item-content>
            </div>
          </template>
        </rc-autocomplete>
      </v-card-title>
      <template v-if="fish != null">
        <v-divider />
        <v-card-text>
          <fish-detail :fish="fish" :now="now" @close-dialog="$emit('input', false)" />
        </v-card-text>
      </template>
      <!--      <template v-else-if="spearGatheringPointId != null">-->
      <!--        <v-divider />-->
      <!--        <v-card-text>-->
      <!--          <a>{{ spearGatheringPointId }}</a>-->
      <!--        </v-card-text>-->
      <!--      </template>-->
      <!--      <template v-else-if="fishingSpotId != null">-->
      <!--        <v-divider />-->
      <!--        <v-card-text>-->
      <!--          <a>{{ fishingSpotId }}</a>-->
      <!--        </v-card-text>-->
      <!--      </template>-->
      <v-divider />
      <v-card-actions>
        <click-helper @click="dialog = false" block>
          <v-btn color="primary" block>{{ $t('search.dialog.close') }}</v-btn>
        </click-helper>
      </v-card-actions>
    </v-card>
  </rc-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ClickHelper from '@/components/basic/ClickHelper'
import DATA_CN from 'Data/translation'
import DataUtil from '@/utils/DataUtil'
import EnvMixin from '@/components/basic/EnvMixin'
import FIX from 'Data/fix'
import FishDetail from '@/components/FishDetail'
import PinyinMatch from 'pinyin-match'
import RawItemIcon from '@/components/basic/RawItemIcon'
import RcAutocomplete from '@/components/basic/RcAutocomplete'
import RcDialog from '@/components/basic/RcDialog'

export default {
  name: 'FishSearch',
  mixins: [EnvMixin],
  components: { RcAutocomplete, RcDialog, RawItemIcon, FishDetail, ClickHelper },
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
    targetId: undefined,
    searchText: undefined,
  }),
  computed: {
    targetType() {
      if (this.targetId == null) {
        return undefined
      } else {
        return this.targetId.split('#')[0]
      }
    },
    fishId() {
      return this.targetType === 'fish' ? +this.targetId.split('#')[1] : undefined
    },
    fishingSpotId() {
      return this.targetType === 'fishing-spot' ? this.targetId.split('#')[1] : undefined
    },
    spearGatheringPointId() {
      return this.targetType === 'spear-gathering-point'
        ? this.targetId.split('#')[1]
        : undefined
    },
    dialog: {
      get() {
        return this.value
      },
      set(showDialog) {
        return this.$emit('input', showDialog)
      },
    },
    searchData() {
      return this.spotSearchData.concat(this.fishSearchData)
    },
    spotSearchData() {
      return Object.values(DATA_CN.FISHING_SPOTS)
        .filter(it => it._id > 0 && DataUtil.getName(it))
        .map(it => {
          return {
            type: 'fishing-spot',
            id: 'fishing-spot#' + it._id,
            name: DataUtil.getName(it),
            icon: 'fishing-icon',
          }
        })
        .concat(
          Object.values(FIX.SPEAR_FISH_GATHERING_POINTS).map(it => {
            return {
              type: 'spear-gathering-point',
              id: 'spear-gathering-point#' + it._id,
              name: DataUtil.getName(it),
              icon: 'spear-icon',
            }
          })
        )
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
          type: 'fish',
          id: 'fish#' + it._id,
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
    fishingSpotId(fishingSpotId) {
      if (fishingSpotId != null) {
        this.$router.push({
          name: 'WikiPage',
          query: { spotId: fishingSpotId },
        })
        this.dialog = false
      }
    },
    spearGatheringPointId(spearGatheringPointId) {
      if (spearGatheringPointId != null) {
        this.$router.push({
          name: 'WikiPage',
          query: { spotId: spearGatheringPointId },
        })
        this.dialog = false
      }
    },
    dialog(dialog) {
      this.targetId = undefined
      if (dialog) {
        setTimeout(() => {
          this.searchText = undefined
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

<style lang="sass" scoped>
.spear-icon
  width: 20px
  height: 20px
  background: url('https://rcstatic.traveleorzea.com/pastry-fish-static-files/img/misc/fishing-notebook.webp') -64px -28px

.fishing-icon
  width: 20px
  height: 20px
  background: url('https://rcstatic.traveleorzea.com/pastry-fish-static-files/img/misc/fishing-notebook.webp') -84px -28px
</style>
