<template>
  <v-row no-gutters>
    <v-col cols="2">
      <v-card class="mx-auto" max-width="300">
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
      <div>{{ activeItems }}</div>
      <!--      <div>{{ spotDict }}</div>-->
      <div>{{ currentSpot }}</div>
    </v-col>
  </v-row>
</template>

<script>
import regionTerritorySpots from '@/store/fishingSpots.json'
import placeNames from '@/store/placeNames.json'
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  name: 'WikiPage',
  data: () => ({
    checkedSpots: [],
    regionTerritorySpots: [],
    activeItems: [],
    spotDict: {},
  }),
  created() {
    this.regionTerritorySpots = _.chain(regionTerritorySpots)
      .map((territories, regionId) => {
        return {
          id: 'region-' + regionId,
          name: placeNames[regionId],
          children: _.map(territories, (spots, territoryId) => {
            return {
              id: 'territory-' + territoryId,
              name: placeNames[territoryId],
              children: spots.map(spot => {
                this.spotDict[spot.id] = {
                  spotId: spot.id,
                  territoryId,
                  regionId,
                  fishList: spot.fishList,
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
      .filter(it => it.id !== 'region-undefined' && it.id !== 'region-3443')
      .value()
  },
  computed: {
    currentSpot() {
      return this.spotDict[this.activeItems[0]?.split('-')?.[1]]
    },
    ...mapGetters(['getFishingSpotsName']),
  },
}
</script>

<style scoped></style>