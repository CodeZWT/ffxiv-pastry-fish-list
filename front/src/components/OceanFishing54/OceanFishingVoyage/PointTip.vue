<template>
  <div>
    <v-card outlined class="mt-2">
      <v-card-title>
        <div class="d-flex justify-center">
          <div>{{ location.name }}</div>
          <v-icon>{{ location.icon }}</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <fish-tip
          :fish="spectralTriggerFish"
          show-mission-tip
          :type-mission="typeMission"
          :star-mission="starMission"
          :tug-mission="tugMission"
        />
        <fish-tip
          :fish="normalBigFish"
          show-mission-tip
          :type-mission="typeMission"
          :star-mission="starMission"
          :tug-mission="tugMission"
        />
        <template v-if="normalMissionFishList.length > 0">
          <v-subheader>任务</v-subheader>
          <div v-for="fish in normalMissionFishList" :key="fish._id">
            <fish-tip
              :fish="fish"
              show-mission-tip
              :type-mission="typeMission"
              :star-mission="starMission"
              :tug-mission="tugMission"
            />
          </div>
        </template>
      </v-card-text>
    </v-card>

    <v-card outlined color="info" class="mt-2">
      <v-card-title>
        <div class="d-flex justify-center">
          <div>{{ location.name }}幻海流</div>
          <v-icon>{{ location.icon }}</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-for="(fishId, index) in scPointFishIds" :key="index">
          <fish-tip
            :fish="fishDict[fishId]"
            show-point-tip
            show-mission-tip
            :type-mission="typeMission"
            :star-mission="starMission"
            :tug-mission="tugMission"
          />
        </div>
        <template v-if="scMissionFishList.length > 0">
          <v-subheader>任务</v-subheader>
          <div v-for="fish in scMissionFishList" :key="fish._id">
            <fish-tip
              :fish="fish"
              show-mission-tip
              :type-mission="typeMission"
              :star-mission="starMission"
              :tug-mission="tugMission"
            />
          </div>
        </template>
      </v-card-text>
    </v-card>

    <v-card outlined class="mt-2">
      <v-card-subtitle>
        <div class="d-flex">
          <a :href="tip.link" target="_blank">
            {{ tip.title }}
          </a>
          <v-spacer />
          <div>
            {{ tip.author }}
          </div>
        </div>
      </v-card-subtitle>
      <v-card-text v-html="tip.pointTip[location.id][location.shift].tipContent">
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import FishTip from '@/components/OceanFishingVoyage/FishTip'
import { OCEAN_FISHING_TIPS } from 'Data/fix'
export default {
  name: 'PointTip',
  components: { FishTip },
  props: {
    location: {
      type: Object,
      default: undefined,
    },
    spectralTriggerFish: {
      type: Object,
      default: undefined,
    },
    normalBigFish: {
      type: Object,
      default: undefined,
    },
    fishDict: {
      type: Object,
      default: undefined,
    },
    typeMission: {
      type: Object,
      default: undefined,
    },
    starMission: {
      type: Object,
      default: undefined,
    },
    normalFishList: {
      type: Array,
      default: () => [],
    },
    scFishList: {
      type: Array,
      default: () => [],
    },
    tugMission: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      tip: OCEAN_FISHING_TIPS.tip3,
    }
  },
  computed: {
    normalMissionFishList() {
      return this.normalFishList
        .filter(
          fish =>
            this.normalBigFish._id !== fish._id &&
            this.spectralTriggerFish._id !== fish._id
        )
        .filter(
          fish =>
            this.isTypeMissionTarget(fish) ||
            this.isStarMissionTarget(fish) ||
            this.isTugMissionTarget(fish)
        )
    },
    scMissionFishList() {
      return this.scFishList
        .filter(fish => !this.scPointFishIds.includes(fish._id))
        .filter(fish => this.isTypeMissionTarget(fish))
    },
    scPointFishIds() {
      return this.tip.pointTip[this.location.id][this.location.shift].fishList
    },
  },
  methods: {
    isTypeMissionTarget(fish) {
      return this.typeMission != null && this.typeMission.types.includes(fish.bonus.id)
    },
    isStarMissionTarget(fish) {
      return this.starMission != null && fish.star.quantity >= 3
    },
    isTugMissionTarget(fish) {
      return this.tugMission != null && fish.tug === this.tugMission.tug
    },
  },
}
</script>

<style scoped></style>
