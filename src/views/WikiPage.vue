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

        <v-card-text>
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
      <v-row class="flex-wrap" no-gutters>
        <!--        <v-col cols="12" style="position: absolute">-->
        <!--          <div>{{ activeItems }}</div>-->
        <!--          <div>{{ currentSpot }}</div>-->
        <!--        </v-col>-->
        <v-col v-if="currentSpotId" cols="12">
          <div class="wiki-map">
            <eorzea-simple-map
              ref="simpleMap"
              :id="currentSpot.mapFileId"
              :x="currentSpot.x"
              :y="currentSpot.y"
              :size-factor="currentSpot.size_factor"
              :marker-radius="currentSpot.radius"
              :fishing-spot-name="currentSpotName"
              :ratio="0.4"
            />
          </div>
        </v-col>
        <v-col cols="12">
          <div v-for="(fish, index) in currentFishList" :key="fish._id" style="position: relative">
            <v-divider v-if="index > 0" inset style="border-color: white" />
            <fish-list-brief-header :fish="fish" :fish-time-part="fishListTimePart[fish._id]" />
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import regionTerritorySpots from '@/store/fishingSpots.json'
import placeNames from '@/store/placeNames.json'
import { mapGetters } from 'vuex'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import FishListBriefHeader from '@/components/FishListBriefHeader'

export default {
  name: 'WikiPage',
  components: { FishListBriefHeader, EorzeaSimpleMap },
  props: ['lazyTransformedFishDict', 'fishListTimePart'],
  data: () => ({
    checkedSpots: [],
    regionTerritorySpots: [],
    activeItems: [],
    spotDict: {},
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
    currentSpotId() {
      return +this.activeItems[0]?.split('-')?.[1]
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
    ...mapGetters(['getFishingSpotsName', 'getFishingSpot']),
  },
  watch: {
    currentSpotId() {
      this.$refs.simpleMap?.resize()
    },
  },
}
</script>

<style lang="sass" scoped>
@import "../styles/RcVariables"

.wiki-map
  width: 100%
  height: calc(100vh - #{ $top-bars-padding + $footer-padding})
</style>