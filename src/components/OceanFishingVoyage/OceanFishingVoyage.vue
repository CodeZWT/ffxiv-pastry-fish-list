<template>
  <div>
    <!--    <pre>{{ voyage }}</pre>-->
    <div>
      <v-radio-group v-model="tipIndex" row>
        <v-radio v-for="(tip, index) in tips" :value="index" :key="index">
          <template v-slot:label>
            <item-icon :icon-class="tip.icon" :icon-url="tip.iconUrl" :type="tip.type" />
            <div>{{ tip.name }}</div>
          </template>
        </v-radio>
      </v-radio-group>
    </div>
    <div v-if="currentTip.id === 'fish-list'">
      <v-tabs v-model="currentLocationIndex" centered icons-and-text grow>
        <v-tabs-slider></v-tabs-slider>

        <v-tab v-for="(location, index) in currentLocations" :key="index">
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
    <div v-else-if="currentTip.id === 'fish-tip'">
      <v-row>
        <v-col v-for="(location, index) in currentLocations" :key="index">
          <v-row no-gutters>
            <v-col cols="12">
              <div class="d-flex justify-center">
                {{ location.name }}
                <v-icon>{{ location.icon }}</v-icon>
              </div>
            </v-col>
            <v-col cols="12" v-if="currentTipSpectralFishList[index]">
              <fish-tip :fish="currentTipSpectralFishList[index]" />
            </v-col>
            <v-col cols="12" v-if="currentTipNormalBigFishList[index]">
              <div class="d-flex flex-column">
                <fish-tip :fish="currentTipNormalBigFishList[index]" />
              </div>
            </v-col>
            <v-col cols="12" v-if="currentTipBlueFishList[index]">
              <fish-tip :fish="currentTipBlueFishList[index]" />
            </v-col>
          </v-row>
          <!--          <pre>{{ location }}</pre>-->
        </v-col>
      </v-row>
    </div>
    <div v-else-if="currentTip.id === 2562">
      <v-row>
        <v-col v-for="location in currentLocations" :key="location.id">
          <v-col cols="12">
            <div class="d-flex justify-center">
              {{ location.name }}
              <v-icon>{{ location.icon }}</v-icon>
            </div>
          </v-col>
          <point-tip :location="location" :fish-dict="fishDict" />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row>
        <v-col v-for="(location, index) in currentLocations" :key="location.id">
          <!--          <v-col cols="12">-->
          <!--            <div class="d-flex justify-center">-->
          <!--              {{ location.name }}-->
          <!--              <v-icon>{{ location.icon }}</v-icon>-->
          <!--            </div>-->
          <!--          </v-col>-->
          <!--          <div>{{ location }}</div>-->
          <achievement-tip
            :achievement-id="currentTip.id"
            :location="location"
            :normal-fish="currentTipFish[index]"
            :spectral-current-fish="currentTipSpectralCurrentFish[index]"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import OceanFishingFishList from '@/components/OceanFishingFishList/OceanFishingFishList'
import regionTerritorySpots from '@/store/fishingSpots.json'
import { mapGetters } from 'vuex'
import ItemIcon from '@/components/basic/ItemIcon'
import FishTip from '@/components/OceanFishingVoyage/FishTip'
import PointTip from '@/components/OceanFishingVoyage/PointTip'
import AchievementTip from '@/components/OceanFishingVoyage/AchievementTip'

export default {
  name: 'OceanFishingVoyage',
  components: { AchievementTip, PointTip, FishTip, ItemIcon, OceanFishingFishList },
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
      tipIndex: 0,
    }
  },
  computed: {
    tips() {
      return [
        {
          type: 'item',
          id: 'fish-tip',
          icon: 'bg-060034',
          name: '幻光鱼/绿鱼/蓝鱼',
        },
        ...(this.voyage?.targets
          ?.filter(target => target.type === 'achievement')
          ?.map(achievement => {
            return {
              type: 'achievement',
              id: achievement.id,
              icon: achievement.icon,
              name: achievement.name,
              iconUrl: achievement.iconUrl,
              bonus: achievement.bonus,
            }
          }) ?? []),
        {
          type: 'item',
          id: 'fish-list',
          icon: 'bg-000024',
          name: '显示鱼列表',
        },
      ]
    },
    currentTip() {
      return this.tips[this.tipIndex]
    },
    // voyage() {
    //   return this.voyage.voyageList?.[0]
    // },
    currentLocations() {
      return this.voyage?.voyageLocations
    },
    normalFishingSpotIds() {
      return this.currentLocations.map(it => it.id)
    },
    spectralCurrentFishingSpotIds() {
      return this.currentLocations.map(it => it.spectralCurrentId)
    },
    currentFishingSpot() {
      return this.voyage?.voyageLocations[this.currentLocationIndex]
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
    currentTipSpectralFishList() {
      return this.normalFishingSpotIds.flatMap(spotId =>
        this.oceanFishingSpots
          ?.find(it => it.id === spotId)
          ?.fishList?.map(fishId => this.fishDict[fishId])
          ?.filter(fish => fish.fishTipType === 1)
      )
    },
    currentTipNormalBigFishList() {
      return this.normalFishingSpotIds.flatMap(spotId =>
        this.oceanFishingSpots
          ?.find(it => it.id === spotId)
          ?.fishList?.map(fishId => this.fishDict[fishId])
          ?.filter(fish => fish.fishTipType === 2)
      )
    },
    currentTipBlueFishList() {
      return this.spectralCurrentFishingSpotIds.flatMap((spotId, locationIndex) =>
        this.oceanFishingSpots
          ?.find(it => it.id === spotId)
          ?.fishList?.map(fishId => this.fishDict[fishId])
          ?.filter(
            fish =>
              fish.fishTipType === 3 &&
              (!fish.time || fish.time === this.currentLocations[locationIndex].shift + 1)
          )
      )
    },
    currentTipFish() {
      return this.normalFishingSpotIds.map(spotId =>
        this.oceanFishingSpots
          ?.find(it => it.id === spotId)
          ?.fishList?.map(fishId => this.fishDict[fishId])
          ?.filter(fish => fish.bonusId === this.currentTip.bonus)
      )
    },
    currentTipSpectralCurrentFish() {
      return this.spectralCurrentFishingSpotIds.map((spotId, locationIndex) =>
        this.oceanFishingSpots
          ?.find(it => it.id === spotId)
          ?.fishList?.map(fishId => this.fishDict[fishId])
          ?.filter(
            fish =>
              fish.bonusId === this.currentTip.bonus &&
              (!fish.time || fish.time === this.currentLocations[locationIndex].shift + 1)
          )
      )
    },
    ...mapGetters(['getFishingSpotsName']),
  },
  watch: {
    'voyage.milliseconds'() {
      this.currentLocationIndex = 0
      this.tipIndex = 0
    },
  },
  methods: {
    toggleShiftFilter() {
      this.shiftFilterEnabled = !this.shiftFilterEnabled
    },
  },
}
</script>

<style scoped></style>
