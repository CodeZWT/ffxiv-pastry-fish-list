<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            云冠群岛
          </v-card-title>
          <v-card-text>
            {{ diademSpots }}
            <v-list>
              <v-list-item v-for="spot in diademSpots" :key="spot.id">
                {{ spot }}
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-expansion-panels accordion v-model="spotPanels">
        <v-expansion-panel v-for="(item, i) in diademSpots" :key="i">
          <v-expansion-panel-header>{{ item.fishingSpotName }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div>{{ JSON.stringify(item, null, 2) }}</div>
            <div>
              <detail-item-map :fish="toFishingSpotData(item)" :expanded="false" />
            </div>
            <div class="d-flex">
              <v-list>
                <v-list-item v-for="fish in item.fishList" :key="fish.id">
                  {{ fish.id }}
                  <item-icon :icon-class="fish.icon" />
                  <div class="text-subtitle-1 ml-1" :title="fish.name + '#' + fish.id">
                    {{ fish.name }}
                  </div>
                </v-list-item>
              </v-list>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script>
import regionTerritorySpots from '@/store/fishingSpots.json'
import _ from 'lodash'
import { mapGetters, mapState } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import DetailItemMap from '@/components/fish-detail-items/DetailItemMap'
// https://ngabbs.com/read.php?tid=23286917
export default {
  name: 'DiademPage',
  components: { DetailItemMap, ItemIcon },
  data() {
    return {
      regionTerritorySpots: regionTerritorySpots,
      diademSpots: [],
      spotPanels: [],
    }
  },
  computed: {
    allFish() {
      return this.fish
    },
    ...mapState(['fish', 'items']),
    ...mapGetters([
      'getFishingSpot',
      'getFishingSpotsName',
      'getItemName',
      'getItemIconClass',
    ]),
  },
  created() {
    this.diademSpots = this.getDiademSpots()
    this.spotPanels = this.diademSpots.map((it, index) => index)
  },
  methods: {
    getDiademSpots() {
      return _.sortBy(
        this.regionTerritorySpots
          .find(it => it.id === null)
          .territories[0].spots.filter(spot => spot.id > 10000),
        'id'
      ).map(spot => {
        const fishingSpot = this.getFishingSpot(spot.id)
        return {
          ...spot,
          fishingSpot,
          fishingSpotName: this.getFishingSpotsName(spot.id),
          fishingSpotId: spot.id,
          fishSpotPositionText: DataUtil.toPositionText(fishingSpot),
          fishList: spot.fishList.map(fishId => {
            return {
              ...this.items[fishId],
              id: fishId,
              name: this.getItemName(fishId),
              icon: this.getItemIconClass(fishId),
            }
          }),
        }
      })
    },
    toFishingSpotData(fishingSpot) {
      return {
        id: -1,
        fishingSpots: [fishingSpot],
      }
    },
  },
}
</script>

<style scoped></style>
