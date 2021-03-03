<template>
  <v-container
    fluid
    :class="
      `detail-wrapper ${isElectron ? 'detail-wrapper--electron' : 'detail-wrapper--web'}`
    "
  >
    <v-row>
      <v-card style="width: 100%" class="mx-2">
        <v-card-text>
          <v-row>
            <v-col>
              <v-subheader>鱼尺寸</v-subheader>
              <v-btn-toggle
                v-model="sizeIndicesToShow"
                rounded
                multiple
                mandatory
                active-class="primary"
              >
                <v-btn small v-for="size in allSizes" :key="size.id">
                  {{ size.size }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col>
              <v-subheader>水</v-subheader>
              <v-btn-toggle
                v-model="waterIndicesToShow"
                rounded
                multiple
                mandatory
                active-class="primary"
              >
                <v-btn small v-for="water in allWater" :key="water.id">
                  {{ water.name_chs }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col>
              <v-subheader>鱼版本</v-subheader>
              <v-btn-toggle
                v-model="fishPatchIndicesToShow"
                rounded
                multiple
                mandatory
                active-class="primary"
              >
                <v-btn small v-for="patch in PATCH_TEXT" :key="patch">
                  {{ patch }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col>
              <v-subheader>更新状态</v-subheader>
              <v-btn-toggle
                v-model="availableIndicesFilter"
                rounded
                multiple
                mandatory
                active-class="primary"
              >
                <v-btn small v-for="available in AVAILABLE_TYPES" :key="available">
                  {{ available }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-autocomplete
                ref="search"
                v-model="fishId"
                :items="filteredList"
                item-value="id"
                item-text="name"
                label="输入鱼名称搜索：珊瑚蝶或shd"
                clearable
                solo
                :filter="filterOptions"
              >
                <template v-slot:item="data">
                  <div class="d-flex">
                    <v-list-item-avatar>
                      <div :class="data.item.icon" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        <div>
                          {{ data.item.name }}
                        </div>
                      </v-list-item-title>
                    </v-list-item-content>
                  </div>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row>
      <v-col :cols="cols" v-for="fish in filteredList" :key="fish.id">
        <v-lazy
          :options="{
            threshold: 0.5,
          }"
          min-height="240"
          transition="fade-transition"
        >
          <v-card class="rounded-xl" elevation="8" style="overflow: hidden">
            <v-card-text>
              <div class="d-flex align-center">
                <item-icon :icon-class="fish.icon" />
                <div>
                  <div class="d-flex">
                    <div>{{ fish.name }}</div>
                    <v-badge
                      v-if="fish.available === 1"
                      color="primary"
                      inline
                      content="新"
                    ></v-badge>
                    <v-badge
                      v-if="fish.available === 2"
                      color="error"
                      inline
                      content="未实装"
                    ></v-badge>
                  </div>
                  <v-badge :content="fish.patch" inline></v-badge>
                </div>
                <v-spacer />
                <div>
                  <div class="d-flex flex-column align-end">
                    <div>{{ fish.size }}</div>
                    <div>{{ fish.water }}</div>
                  </div>
                </div>
              </div>
            </v-card-text>
            <gif-loader :src="fish.gif" :cover-src="fish.cover" />
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import { AQUARIUMS, AQUARIUM_FISH_SIZE, AQUARIUM_WATER } from 'Data/fix'
import DataUtil from '@/utils/DataUtil'
import ImgUtil from '@/utils/ImgUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import { OCEAN_FISHING_FISH } from 'Data/fix'
import GifLoader from '@/components/basic/GifLoader'
import PinyinMatch from 'pinyin-match'
const PATCHES_MIN = [2, 3, 4, 5]
export default {
  name: 'AquariumPage',
  components: { GifLoader, ItemIcon },
  data() {
    return {
      isElectron: DevelopmentModeUtil.isElectron(),
      sizeIndicesToShow: Object.keys(AQUARIUM_FISH_SIZE).map(it => it - 1),
      waterIndicesToShow: Object.keys(AQUARIUM_WATER).map(it => it - 1),
      PATCH_TEXT: PATCHES_MIN.map(it => it + '.X'),
      fishPatchIndicesToShow: PATCHES_MIN.map((_, index) => index),
      allSizes: AQUARIUM_FISH_SIZE,
      allWater: AQUARIUM_WATER,
      AVAILABLE_TYPES: ['普通', '版本新鱼', '未来版本'],
      availableIndicesFilter: [0, 1, 2],
      fishId: undefined,
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    cols() {
      return this.isMobile ? 12 : 4
    },
    aquariumFishList() {
      return Object.values(AQUARIUMS).map(aquarium => {
        const spotFishId =
          DataUtil.FISH_ID_TO_WIKI_IDS[aquarium.id]?.[0]?.split('-')?.[3] ?? aquarium.id
        const fishData = DataUtil.FISH_DATA[spotFishId] ?? OCEAN_FISHING_FISH[aquarium.id]
        return {
          id: aquarium.id,
          name: DataUtil.getItemName(aquarium.id),
          icon: DataUtil.getItemIconClass(aquarium.id),
          patch: DataUtil.toPatchText(fishData?.patch),
          water: DataUtil.getName(AQUARIUM_WATER[aquarium.aquariumWater]),
          waterId: aquarium.aquariumWater,
          sizeId: aquarium.size,
          size: AQUARIUM_FISH_SIZE[aquarium.size].size,
          gif: ImgUtil.getAquariumImgUrl(`${aquarium.id}.gif`),
          cover: ImgUtil.getAquariumImgUrl(`${aquarium.id}-cover.jpg`),
          available:
            aquarium.patch === DataUtil.toFishFilterPatch(DataUtil.PATCH_AVAILABLE_MAX)
              ? 1
              : aquarium.patch > DataUtil.PATCH_AVAILABLE_MAX
              ? 2
              : 0,
        }
      })
    },
    filteredList() {
      return this.aquariumFishList
        .filter(fish => {
          return this.sizeIndicesToShow.map(it => it + 1).includes(fish.sizeId)
        })
        .filter(fish => {
          return this.waterIndicesToShow.map(it => it + 1).includes(fish.waterId)
        })
        .filter(fish => {
          return this.fishPatchIndicesToShow
            .map(i => PATCHES_MIN[i])
            .includes(Math.floor(fish.patch))
        })
        .filter(fish => {
          return this.availableIndicesFilter.includes(fish.available)
        })
        .filter(fish => {
          return this.fishId == null || fish.id === this.fishId
        })
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

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.detail-wrapper
  width: 100%
  height: 100%
  overflow-scrolling: auto
  overflow-y: scroll
  overflow-x: hidden

  &--web
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

  &--electron
    max-height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding})
</style>
