<template>
  <v-row no-gutters>
    <v-col cols="2">
      <v-card class="mx-auto" max-width="500">
        <!--    <v-sheet class="pa-4 primary lighten-2">-->
        <!--      <v-text-field-->
        <!--          v-model="search"-->
        <!--          label="Search Company Directory"-->
        <!--          dark-->
        <!--          flat-->
        <!--          solo-inverted-->
        <!--          hide-details-->
        <!--          clearable-->
        <!--          clear-icon="mdi-close-circle-outline"-->
        <!--      ></v-text-field>-->
        <!--      <v-checkbox-->
        <!--          v-model="caseSensitive"-->
        <!--          dark-->
        <!--          hide-details-->
        <!--          label="Case sensitive search"-->
        <!--      ></v-checkbox>-->
        <!--    </v-sheet>-->

        <!--    :search="search"-->
        <!--    :filter="filter"-->
        <!--    :open.sync="open"-->

        <v-card-text class="spot-list">
          <v-treeview
            v-model="checkedSpots"
            :items="regionTerritorySpots"
            item-key="id"
            hoverable
            dense
            activatable
            open-on-click
            selectable
            @update:active="activeItems = $event"
          >
          </v-treeview>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="10">
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn @click="toggleSettingMode" icon>
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12">
          <grid-layout
            v-if="currentSpotId"
            :layout.sync="layout"
            :col-num="12"
            :row-height="30"
            :is-draggable="isSettingMode"
            :is-resizable="true"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="true"
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
                :id="currentSpot.mapFileId"
                :x="currentSpot.x"
                :y="currentSpot.y"
                :size-factor="currentSpot.size_factor"
                :marker-radius="currentSpot.radius"
                :fishing-spot-name="currentSpotName"
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
              <div>
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
              <fish-tug-table :value="currentFishList" />
            </grid-item>
          </grid-layout>
        </v-col>
      </v-row>
      <!--      <v-row class="flex-wrap" no-gutters>-->
      <!--        <v-col v-if="currentSpotId" cols="12">-->
      <!--          <div class="wiki-map">-->
      <!--            <eorzea-simple-map-->
      <!--              ref="simpleMap"-->
      <!--              :id="currentSpot.mapFileId"-->
      <!--              :x="currentSpot.x"-->
      <!--              :y="currentSpot.y"-->
      <!--              :size-factor="currentSpot.size_factor"-->
      <!--              :marker-radius="currentSpot.radius"-->
      <!--              :fishing-spot-name="currentSpotName"-->
      <!--              :ratio="0.4"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </v-col>-->
      <!--        <v-col cols="12" v-if="currentSpotId">-->
      <!--          <fish-tug-table :value="currentFishList" />-->
      <!--        </v-col>-->
      <!--        <v-col cols="12">-->
      <!--          <div v-for="fish in currentFlattenFishList" :key="fish._id" style="position: relative">-->
      <!--            <fish-list-item-->
      <!--              :fish="fish"-->
      <!--              :fish-time-part="fishListTimePart[fish._id]"-->
      <!--              @click="onFishClicked(fish._id)"-->
      <!--              show-constraints-instead-->
      <!--            />-->
      <!--          </div>-->
      <!--        </v-col>-->
      <!--      </v-row>-->
    </v-col>
  </v-row>
</template>

<script>
import regionTerritorySpots from '@/store/fishingSpots.json'
import placeNames from '@/store/placeNames.json'
import { mapGetters } from 'vuex'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import FishTugTable from '@/components/FishingTugTable'
import FishListItem from '@/components/FishListItem'
import VueGridLayout from 'vue-grid-layout'

export default {
  name: 'WikiPage',
  components: {
    FishListItem,
    FishTugTable,
    EorzeaSimpleMap,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  props: ['lazyTransformedFishDict', 'fishListTimePart', 'now'],
  data: () => ({
    checkedSpots: [],
    regionTerritorySpots: [],
    activeItems: [],
    spotDict: {},
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
  }),
  created() {
    this.regionTerritorySpots = regionTerritorySpots
      .map(region => {
        return {
          id: 'region-' + region.id,
          name: placeNames[region.id],
          // TODO: arrange region & territory according to order
          children: region.territories.map(territory => {
            return {
              id: 'territory-' + territory.id,
              name: placeNames[territory.id],
              children: territory.spots.map(spot => {
                this.spotDict[spot.id] = {
                  spotId: spot.id,
                  territoryId: territory.id,
                  regionId: region.id,
                  // [NOTE][VERSION]
                  // filter future version fish out
                  fishList: spot.fishList.filter(fishId => this.lazyTransformedFishDict[fishId]),
                }
                return {
                  id: 'spot-' + spot.id,
                  name: this.getFishingSpotsName(spot.id),
                }
              }),
            }
          }),
        }
      })
      .filter(it => it.id !== 'region-null' && it.id !== 'region-3443')
    console.log(regionTerritorySpots)
    console.log(this.regionTerritorySpots)
  },
  computed: {
    mapLayout() {
      return this.layout[0]
    },
    fishListLayout() {
      return this.layout[1]
    },
    baitTableLayout() {
      return this.layout[2]
    },
    currentSpotId() {
      const id = this.activeItems[0]?.split('-')?.[1]
      return id != null ? +id : undefined
    },
    currentSpot() {
      return this.getFishingSpot(this.currentSpotId)
    },
    currentSpotName() {
      return this.getFishingSpotsName(this.currentSpotId)
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
    ...mapGetters(['getFishingSpotsName', 'getFishingSpot']),
  },
  watch: {
    currentSpotId() {
      this.$refs.simpleMap?.resize()
    },
  },
  methods: {
    onFishClicked(fishId) {
      this.$emit('fish-selected', fishId)
    },
    onMapCardResized() {
      setTimeout(() => this.$refs.simpleMap?.resize(), 300)
    },
    toggleSettingMode() {
      this.isSettingMode = !this.isSettingMode
    },
  },
}
</script>

<style lang="sass" scoped>
@import "../styles/RcVariables"

//.wiki-map
//  width: 100%
//  height: calc(100vh - #{ $top-bars-padding + $footer-padding})

.vue-grid-layout
  background: #eee


.vue-grid-item:not(.vue-grid-placeholder)
  background: #ccc
  border: 1px solid black

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

.spot-list
  height: calc(100vh - #{ $top-bars-padding + $footer-padding})
  overflow-scrolling: auto
  overflow-y: scroll
</style>