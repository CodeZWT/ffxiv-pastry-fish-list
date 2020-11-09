<template>
  <div>
    <v-expansion-panels hover flat tile v-model="lazyExpansionValue">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div style="display: flex; align-items: center; justify-content: center">
            <div v-if="multiple">
              <v-menu open-on-hover offset-x top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-view-list</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(spot, index) in fishingSpots"
                    :key="index"
                    @click.stop="currentSpotIndex = index"
                  >
                    <v-list-item-title class="d-flex align-center">
                      <div class="subtitle-1">{{ spot.fishingSpotName }}</div>
                      <v-spacer />
                      <div class="ml-2 subtitle-2">{{ spot.zone }}</div>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="text-subtitle-1" :title="currentSpot.fishingSpotId">
              {{ currentSpot.fishingSpotName }}
            </div>
            <div class="text-subtitle-2 ml-2">
              {{ currentSpot.zone }}
            </div>
            <div class="text-subtitle-1 ml-2">({{ currentSpot.fishSpotPositionText }})</div>
            <click-helper @click.stop :copy-text="currentSpot.fishingSpotName">
              <v-btn class="my-2" text icon :title="$t('list.item.copyHint')">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </click-helper>
            <click-helper @click.stop="goToFishingSpotAngelPage(currentSpot.anglerLocationId)">
              <v-btn class="my-2" text icon :title="$t('list.item.linkHint')">
                <v-icon>mdi-link-variant</v-icon>
              </v-btn>
            </click-helper>
          </div>
        </v-expansion-panel-header>
      </v-expansion-panel>
    </v-expansion-panels>
    <div v-if="lazyExpansionValue === 0" style="width: 100%; height: 512px" class="d-flex justify-center mt-4">
      <div style="width: 100%; max-width: 512px">
        <eorzea-simple-map
          ref="simpleMap"
          :id="currentSpot.fishingSpot.mapFileId"
          :size-factor="currentSpot.fishingSpot.size_factor"
          :fishing-spots="fishingSpotsForMap"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ClickHelper from '@/components/basic/ClickHelper'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import DataUtil from '@/utils/DataUtil'
import { mapGetters } from 'vuex'

export default {
  name: 'DetailItemMap',
  components: { ClickHelper, EorzeaSimpleMap },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    // currentSpotIndex: {
    //   type: Number,
    //   default: 0,
    // },
  },
  data: vm => ({
    currentSpotIndex: 0,
    lazyExpansionValue: vm.expanded ? 0 : undefined,
  }),
  computed: {
    fishingSpots() {
      return this.fish.fishingSpots
    },
    currentSpot() {
      // { zone, fishingSpot, fishingSpotName, fishingSpotId, fishSpotPositionText }
      return this.fishingSpots[this.currentSpotIndex]
    },
    fishingSpotsForMap() {
      return [{ ...this.currentSpot.fishingSpot, name: this.currentSpot.fishingSpotName }]
    },
    multiple() {
      return this.fishingSpots.length > 1
    },
    ...mapGetters(['getFishingSpot']),
  },
  created() {
    this.lazyExpansionValue = this.expanded ? 0 : undefined
  },
  watch: {
    expanded(expanded) {
      this.lazyExpansionValue = expanded ? 0 : undefined
    },
    'fish.id': function() {
      this.lazyExpansionValue = this.expanded ? 0 : undefined
      this.currentSpotIndex = 0
    },
  },
  methods: {
    goToFishingSpotAngelPage(anglerLocationId) {
      window.open(`https://cn.ff14angler.com/?spot=${anglerLocationId}`)
    },

    getName: DataUtil.getName,
  },
}
</script>

<style scoped></style>