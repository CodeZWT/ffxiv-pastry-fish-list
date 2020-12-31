<template>
  <div>
    <v-tabs v-model="currentLocationIndex" centered icons-and-text grow>
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-for="location in currentLocations" :key="location.id">
        {{ location.name }}
        <v-icon>{{ location.icon }}</v-icon>
      </v-tab>
    </v-tabs>

    <!--        <div>{{ currentFishList }}</div>-->
    <ocean-fishing-fish-list
      :fish-list="currentFishList"
      weather-filter
      :weather-set="currentWeatherSet"
    />
    <div class="d-flex my-4" style="width: 100%">
      <div class="text-h6">{{ currentFishingSpotSpectralCurrentName }}</div>
      <v-spacer />
      <v-btn @click="toggleShiftFilter" text color="error">
        {{ shiftFilterEnabled ? '清除时间限制' : '只显示当前时间可钓的鱼' }}
      </v-btn>
    </div>
    <ocean-fishing-fish-list
      :fish-list="currentSpectralCurrentFishList"
      :shift-filter="shiftFilterEnabled"
      :shift="currentShift"
    />
  </div>
</template>

<script>
import OceanFishingFishList from '@/components/OceanFishingFishList/OceanFishingFishList'
import regionTerritorySpots from '@/store/fishingSpots.json'
import { mapGetters } from 'vuex'

export default {
  name: 'OceanFishingVoyage',
  components: { OceanFishingFishList },
  props: {
    voyage: {
      type: Object,
      default: undefined,
    },
    fishDict: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      currentLocationIndex: 0,
      shiftFilterEnabled: true,
    }
  },
  computed: {
    currentLocations() {
      return this.voyage.voyageList?.[0]?.voyageLocations
    },
    currentFishingSpot() {
      return this.voyage.voyageList?.[0]?.voyageLocations[this.currentLocationIndex]
    },
    currentShift() {
      return this.currentFishingSpot?.shift
    },
    currentWeatherSet() {
      return this.currentFishingSpot?.weatherSet ?? []
    },
    currentFishingSpotId() {
      return this.currentFishingSpot?.id
    },
    currentFishingSpotSpectralCurrentId() {
      return this.currentFishingSpot?.spectralCurrentId
    },
    currentFishingSpotSpectralCurrentName() {
      return this.getFishingSpotsName(this.currentFishingSpotSpectralCurrentId)
    },
    oceanFishingSpots() {
      return regionTerritorySpots
        .find(it => it.id === 3443)
        ?.territories.find(it => it.id === 3477)?.spots
    },
    currentFishList() {
      return this.currentFishingSpotId == null
        ? []
        : this.oceanFishingSpots
            ?.find(it => it.id === this.currentFishingSpotId)
            ?.fishList?.map(fishId => this.fishDict[fishId])
    },
    currentSpectralCurrentFishList() {
      return this.currentFishingSpotSpectralCurrentId == null
        ? []
        : this.oceanFishingSpots
            ?.find(it => it.id === this.currentFishingSpotSpectralCurrentId)
            ?.fishList?.map(fishId => this.fishDict[fishId])
    },
    ...mapGetters(['getFishingSpotsName']),
  },
  methods: {
    toggleShiftFilter() {
      this.shiftFilterEnabled = !this.shiftFilterEnabled
    },
  },
}
</script>

<style scoped></style>
