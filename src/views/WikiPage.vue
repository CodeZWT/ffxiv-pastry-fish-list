<template>
  <v-row no-gutters>
    <v-col cols="2">
      <v-card class="mx-auto" max-width="500">
        <v-sheet class="pa-1 primary">
          <div class="d-flex align-center">
            <v-text-field
              v-model="searchText"
              label="搜索鱼或地名"
              flat
              solo-inverted
              hide-details
              clearable
            ></v-text-field>
            <v-btn icon class="ml-1" @click="collapseAll">
              <v-icon>mdi-arrow-collapse-vertical</v-icon>
            </v-btn>
            <!-- expand all button -->
            <!--            <v-btn icon class="ml-1" @click="expandAll">-->
            <!--              <v-icon>mdi-arrow-expand-vertical</v-icon>-->
            <!--            </v-btn>-->
            <!-- setting button -->
            <!--            <v-btn v-if="type === 'fish' || type === 'spot'" @click="toggleSettingMode" icon>-->
            <!--              <v-icon>mdi-cog</v-icon>-->
            <!--            </v-btn>-->
          </div>
        </v-sheet>

        <v-card-text class="spot-list">
          <v-treeview
            ref="spotMenu"
            v-model="completedSpotFishIds"
            :items="regionTerritorySpots"
            item-key="id"
            hoverable
            dense
            activatable
            selectable
            selected-color="primary"
            :search="searchText"
            :filter="spotMenuSearchFn"
            :open.sync="openedItems"
            @update:active="onMenuItemActive"
          >
          </v-treeview>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="10">
      <v-row class="fill-height">
        <v-col cols="12">
          <!--          <code>{{ openedItems }}</code>-->
          <!--          <code>{{ currentTerritoryId }}</code>-->
          <!--          <code>{{ currentSpotId }}</code>-->
          <!--          <code>{{ currentFishId }}</code>-->
          <div v-if="!type || type === 'region'" class="d-flex justify-center align-center fill-height">
            <!--  show empty / region view  -->
            <v-icon size="200">mdi-book-open-page-variant</v-icon>
          </div>
          <div v-else-if="type === 'territory'" style="width: 100%; height: 100%">
            <!--  show territory view  -->
            <eorzea-simple-map
              ref="simpleMap"
              :id="currentMapInfo.mapFileId"
              :size-factor="currentMapInfo.size_factor"
              :fishing-spots="currentSpotList"
            />
          </div>
          <div v-else-if="type === 'spot' || type === 'fish'">
            <!--  show spot/fish view  -->
            <grid-layout
              v-if="currentSpotId"
              :layout.sync="layout"
              :col-num="12"
              :row-height="32"
              :is-draggable="isSettingMode"
              :is-resizable="isSettingMode"
              :is-mirrored="false"
              :vertical-compact="true"
              :margin="[10, 10]"
              :use-css-transforms="true"
              style="z-index: 0"
            >
              <grid-item
                :static="mapLayout.static"
                :x="mapLayout.x"
                :y="mapLayout.y"
                :w="mapLayout.w"
                :h="mapLayout.h"
                @resized="onMapCardResized"
                :i="mapLayout.i"
              >
                <eorzea-simple-map
                  ref="simpleMap"
                  :id="currentMapInfo.mapFileId"
                  :size-factor="currentMapInfo.size_factor"
                  :fishing-spots="currentSpotList"
                />
              </grid-item>

              <grid-item
                :static="fishListLayout.static"
                :x="fishListLayout.x"
                :y="fishListLayout.y"
                :w="fishListLayout.w"
                :h="fishListLayout.h"
                :i="fishListLayout.i"
              >
                <div class="grid-content">
                  <div
                    v-for="fish in currentFlattenFishList"
                    :key="`${currentSpotId}-${fish._id}-${fish.isPredator ? 'p' : ''}`"
                    style="position: relative"
                  >
                    <fish-list-item
                      :fish="fish"
                      :fish-time-part="fishListTimePart[fish._id]"
                      @click="onFishClicked(fish._id)"
                      show-constraints-instead
                    />
                  </div>
                </div>
              </grid-item>

              <grid-item
                :static="baitTableLayout.static"
                :x="baitTableLayout.x"
                :y="baitTableLayout.y"
                :w="baitTableLayout.w"
                :h="baitTableLayout.h"
                :i="baitTableLayout.i"
              >
                <fish-tug-table :value="currentFishList" class="grid-content" />
              </grid-item>
            </grid-layout>
          </div>
        </v-col>
      </v-row>
      <v-dialog v-model="isDetailFishWindowOpen" max-width="70vh">
        <fish-detail :fish="currentFish" :now="now" />
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import regionTerritorySpots from '@/store/fishingSpots.json'
import placeNames from '@/store/placeNames.json'
import { mapGetters, mapMutations, mapState } from 'vuex'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import FishTugTable from '@/components/FishingTugTable'
import FishListItem from '@/components/FishListItem'
import VueGridLayout from 'vue-grid-layout'
import _ from 'lodash'
import * as PinyinMatch from 'pinyin-match'
import DataUtil from '@/utils/DataUtil'
import FishDetail from '@/components/FishDetail'

export default {
  name: 'WikiPage',
  components: {
    FishDetail,
    FishListItem,
    FishTugTable,
    EorzeaSimpleMap,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  props: ['lazyTransformedFishDict', 'fishListTimePart', 'now', 'fishListWeatherChangePart', 'extraFishListTimePart'],
  data: () => ({
    type: undefined,
    currentTerritoryId: -1,
    currentSpotId: -1,
    currentFishId: -1,
    completedSpots: [],
    regionTerritorySpots: [],
    openedItems: [],
    spotDict: {},
    territoryDict: {},
    layout: [
      { x: 7, y: 0, w: 5, h: 17, i: 'map' },
      {
        x: 0,
        y: 4,
        w: 7,
        h: 13,
        i: 'fishList',
      },
      { x: 0, y: 0, w: 7, h: 4, i: 'fishTugList' },
    ],
    isSettingMode: false,
    lazySearchText: '',
    preActiveItem: undefined,
    isDetailFishWindowOpen: false,
  }),
  computed: {
    searchText: {
      get() {
        return this.lazySearchText
      },
      set(newSearchText) {
        this.debouncedSearchTextUpdater(newSearchText)
      },
    },
    mapLayout() {
      return this.layout[0]
    },
    fishListLayout() {
      return this.layout[1]
    },
    baitTableLayout() {
      return this.layout[2]
    },
    currentMapInfo() {
      const currentSpot = _.first(this.currentSpotList)
      return {
        size_factor: currentSpot.size_factor,
        mapFileId: currentSpot.mapFileId,
      }
    },
    currentSpotList() {
      switch (this.type) {
        case 'territory':
          return this.territoryDict[this.currentTerritoryId].map(this.assembleSpot)
        case 'fish':
        case 'spot':
          return [this.assembleSpot(this.currentSpotId)]
        default:
          return []
      }
    },
    currentFishList() {
      return this.spotDict?.[this.currentSpotId]?.fishList?.map(fishId => this.lazyTransformedFishDict[fishId])
    },
    currentFlattenFishList() {
      return (
        this.currentFishList?.flatMap(fish => {
          return [fish, ...fish.predators]
        }) ?? []
      )
    },
    completedSpotFishIds: {
      get() {
        return this.allCompletedFish.flatMap(
          fishId =>
            this.lazyTransformedFishDict[fishId]?.fishingSpots.map(
              spot => `spot-${spot.fishingSpotId}-fish-${fishId}`
            ) ?? []
        )
      },
      set(newSpotFishIds) {
        const oldSpotFishIds = this.completedSpotFishIds

        if (_.isEqual(_.sortBy(oldSpotFishIds), _.sortBy(newSpotFishIds))) {
          return
        }

        const removed = _.difference(oldSpotFishIds, newSpotFishIds).map(it => this.extractFishId(it))
        const added = _.difference(newSpotFishIds, oldSpotFishIds).map(it => this.extractFishId(it))
        if (removed.length > 0) {
          removed.forEach(id => this.setFishCompleted({ fishId: id, completed: false }))
        } else if (added.length > 0) {
          added.forEach(id => this.setFishCompleted({ fishId: id, completed: true }))
        }
      },
    },
    currentFish() {
      return DataUtil.assembleFishForDetail(
        this.currentFishId,
        this.allFish,
        this.lazyTransformedFishDict,
        this.fishListTimePart,
        this.extraFishListTimePart,
        this.fishListWeatherChangePart
      )
    },
    ...mapState({ allFish: 'fish' }),
    ...mapGetters(['getFishingSpotsName', 'getFishingSpot', 'getFishCompleted', 'allCompletedFish']),
  },
  watch: {
    // TODO update
    // currentSpotId() {
    //   this.$refs.simpleMap?.resize()
    // },
    // allCompletedFish(allCompletedFish) {
    //   this.updateCompletedSpot(allCompletedFish)
    // },
    completedSpots(newSpots, oldSpots) {
      // console.log(newSpots, oldSpots)
      const removed = _.difference(oldSpots, newSpots).map(it => +it.substring('spot-'.length))
      const added = _.difference(newSpots, oldSpots).map(it => +it.substring('spot-'.length))
      if (removed.length > 0) {
        _.uniq(removed.flatMap(it => this.spotDict[it].fishList)).forEach(it => {
          this.setFishCompleted({ fishId: it, completed: false })
        })
      } else if (added.length > 0) {
        _.uniq(added.flatMap(it => this.spotDict[it].fishList)).forEach(it => {
          this.setFishCompleted({ fishId: it, completed: true })
        })
      }
    },
    currentFishId(fishId) {
      if (fishId) {
        this.isDetailFishWindowOpen = true
      }
    },
    isDetailFishWindowOpen(isOpen) {
      if (!isOpen) {
        this.currentFishId = -1
      }
    },
  },
  created() {
    this.detailWindowLeft = window.innerWidth * 0.7 - 100
    this.detailWindowHeight = window.innerHeight * 0.7
    this.detailWindowWidth = window.innerWidth * 0.25
    this.debouncedSearchTextUpdater = _.debounce(text => {
      this.lazySearchText = text
    }, 500)

    this.regionTerritorySpots = regionTerritorySpots
      .map(region => {
        return {
          id: 'region-' + region.id,
          name: placeNames[region.id],
          // TODO: arrange region & territory according to order
          children: region.territories.map(territory => {
            this.territoryDict[territory.id] = territory.spots.map(spot => spot.id)
            return {
              id: 'territory-' + territory.id,
              name: placeNames[territory.id],
              children: territory.spots.map(spot => {
                const fishList = spot.fishList.filter(fishId => this.lazyTransformedFishDict[fishId])
                this.spotDict[spot.id] = {
                  spotId: spot.id,
                  territoryId: territory.id,
                  regionId: region.id,
                  // [NOTE][VERSION]
                  // filter future version fish out
                  fishList,
                }
                return {
                  id: 'spot-' + spot.id,
                  name: this.getFishingSpotsName(spot.id),
                  children: fishList.map(fishId => {
                    return {
                      id: 'spot-' + spot.id + '-fish-' + fishId,
                      name: this.lazyTransformedFishDict[fishId].name,
                    }
                  }),
                }
              }),
            }
          }),
        }
      })
      .filter(it => it.id !== 'region-null' && it.id !== 'region-3443')
    this.updateCompletedSpot(this.allCompletedFish)
    // console.log(regionTerritorySpots)
    // console.log(this.regionTerritorySpots)
  },
  methods: {
    onFishClicked(fishId) {
      this.currentFishId = fishId
      this.$emit('fish-selected', fishId)
    },
    onMapCardResized() {
      setTimeout(() => this.$refs.simpleMap?.resize(), 300)
    },
    toggleSettingMode() {
      this.isSettingMode = !this.isSettingMode
    },
    updateCompletedSpot(allCompletedFish) {
      const completedSpots = []
      Object.values(this.spotDict).forEach(spot => {
        if (spot.fishList.length > 0 && spot.fishList.every(fishId => allCompletedFish.includes(fishId))) {
          completedSpots.push('spot-' + spot.spotId)
        }
      })
      // console.log(_.isEqual(this.completedSpots, completedSpots))
      if (!_.isEqual(_.sortBy(this.completedSpots), _.sortBy(completedSpots))) {
        this.completedSpots = completedSpots
      }
    },
    onMenuItemActive(items) {
      if (items.length === 0) {
        if (this.preActiveItem != null) {
          this.openedItems.splice(this.openedItems.indexOf(this.preActiveItem), 1)
        }
        return
      }

      const activeItem = items[0]

      const parts = activeItem.split('-')
      if (parts.length === 4) {
        this.type = parts[2]
      } else {
        this.type = parts[0]
      }
      switch (this.type) {
        case 'region':
          break
        case 'territory':
          this.currentTerritoryId = +parts[1]
          break
        case 'spot':
          this.currentSpotId = +parts[1]
          break
        case 'fish':
          this.currentSpotId = +parts[1]
          this.currentFishId = +parts[3]
          break
        default:
          console.error('not supported')
      }

      if (this.type !== 'spot') {
        if (!this.openedItems.includes(activeItem)) {
          this.openedItems.push(activeItem)
        }
        this.preActiveItem = activeItem
      } else {
        this.preActiveItem = null
      }
    },
    extractFishId(spotFishId) {
      return +spotFishId.split('-')[3]
    },
    spotMenuSearchFn(item, searchText, textKey) {
      const itemText = item[textKey]
      if (this.$i18n.locale === 'zh-CN') {
        return PinyinMatch.match(itemText, searchText) !== false
      } else {
        return itemText.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      }
    },
    expandAll() {
      this.$refs.spotMenu.updateAll(true)
    },
    collapseAll() {
      this.$refs.spotMenu.updateAll(false)
    },
    assembleSpot(spotId) {
      const spot = this.getFishingSpot(spotId)
      return { ...spot, name: DataUtil.getName(spot) }
    },
    ...mapMutations(['setFishCompleted']),
  },
}
</script>

<style lang="sass" scoped>
@import "../styles/RcVariables"

//.wiki-map
//  width: 100%
//  height: calc(100vh - #{ $top-bars-padding + $footer-padding})

//.vue-grid-layout
  //background: #eee


.vue-grid-item:not(.vue-grid-placeholder)
  //background: #ccc
  //border: 1px solid black

.vue-grid-item .resizing
  opacity: 0.9


.vue-grid-item .text
  font-size: 24px
  text-align: center
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  margin: auto
  height: 100%
  width: 100%

.grid-content
  height: 100%
  overflow-scrolling: auto
  overflow-y: scroll

.spot-list
  height: calc(100vh - #{ $top-bars-padding + $footer-padding + 64})
  overflow-scrolling: auto
  overflow-y: scroll

.detail-wrapper
  max-height: 70vh
  overflow-scrolling: auto
  overflow-y: scroll
</style>