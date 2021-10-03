<template>
  <div class="my-2">
    <!--    <div class="text-subtitle-1">-->
    <!--      {{ fish.name }}-->
    <!--    </div>-->
    <v-card color="system">
      <v-card-text class="d-flex justify-center align-center" style="position: relative">
        <fish-bait-list
          :baits="fish.baits"
          :target="fish"
          :simple="simple"
          :bait-unique-type="fish.baitUniqueType"
        />
        <div v-if="!simple" class="ml-1 d-flex flex-column justify-center">
          <div>
            <fish-bite-time-list :item="fish" />
          </div>
          <div class="d-flex">
            <v-badge
              v-if="isTypeMissionTarget(fish)"
              color="primary"
              dot
              inline
              :title="typeMission.description"
            />
            <v-badge
              v-if="isStarMissionTarget(fish)"
              color="info"
              dot
              inline
              :title="starMission.description"
            />
            <v-badge
              v-if="isTugMissionTarget(fish)"
              color="error"
              dot
              inline
              :title="tugMission.description"
            />
          </div>
        </div>
        <div v-if="!simple" style="position: absolute; top: 0; left: 0">
          <v-chip label class="rounded-tr-0 rounded-br-lg rounded-bl-0" outlined>
            {{ fish.name }}
          </v-chip>
        </div>
        <div
          v-if="!simple && showMissionTip"
          style="position: absolute; bottom: 0; left: 0"
        >
          <v-chip label class="rounded-br-0 rounded-tr-lg rounded-tl-0" outlined>
            {{ fish.star.text }}
          </v-chip>
        </div>
        <div
          v-if="!simple && showPointTip"
          style="position: absolute; top: 0; right: 0"
          title="渔分 x 双提个数"
        >
          <v-chip
            label
            class="rounded-tl-0 rounded-bl-lg rounded-br-0"
            color="primary"
            outlined
          >
            {{ fish.points }} x {{ fish.doubleHook.join(',') }}
          </v-chip>
        </div>
        <div
          v-if="!simple && !showPointTip && showMissionTip && fish.doubleHook[0] > 1"
          style="position: absolute; top: 0; right: 0"
          title="双提个数"
        >
          <v-chip
            label
            class="rounded-tl-0 rounded-bl-lg rounded-br-0"
            color="primary"
            outlined
          >
            {{ fish.doubleHook.join(',') }}
          </v-chip>
        </div>
        <div
          v-else-if="!simple && showAchievementTip"
          style="position: absolute; top: 0; right: 0"
          title="双提个数"
        >
          <v-chip
            label
            class="rounded-tl-0 rounded-bl-lg rounded-br-0"
            color="primary"
            outlined
          >
            {{ fish.doubleHook.join(',') }}
          </v-chip>
        </div>
        <div
          v-if="
            !hideClearWeather(fish) &&
              (fish.hasWeatherConstraint || fish.hasRealWeatherConstraint)
          "
          style="position: absolute; right: 0; bottom: 0"
        >
          <v-chip
            label
            class="rounded-bl-0 rounded-tl-lg rounded-tr-0"
            color="error"
            outlined
          >
            <fish-weather-not-available :item="fish" dense />
          </v-chip>
        </div>
      </v-card-text>
      <div v-if="fish.hasPredators" class="background pt-2">
        <div class="d-flex justify-center align-center">
          <div>前置鱼</div>
        </div>
        <v-card-text
          v-for="(predator, index) in fish.predators"
          :key="index"
          class="d-flex justify-center align-center item-border"
          style="position: relative"
        >
          <fish-bait-list
            :baits="predator.baits"
            :target="predator"
            :simple="simple"
            :first-bait-unique="predator.isBaitUnique"
          />
          <div v-if="!simple" class="ml-1 d-flex flex-column justify-center">
            <div>
              <fish-bite-time-list :item="predator" />
            </div>
            <div class="d-flex">
              <v-badge
                v-if="isTypeMissionTarget(predator)"
                color="primary"
                dot
                inline
                :title="typeMission.description"
              />
              <v-badge
                v-if="isStarMissionTarget(predator)"
                color="info"
                dot
                inline
                :title="starMission.description"
              />
              <v-badge
                v-if="isTugMissionTarget(predator)"
                color="error"
                dot
                inline
                :title="tugMission.description"
              />
            </div>
          </div>
          <div v-if="!simple" style="position: absolute; top: 0; left: 0">
            <v-chip label class="rounded-t-0 rounded-br-lg rounded-bl-0" outlined>
              {{ predator.name }}
            </v-chip>
          </div>
          <div
            v-if="!simple && showMissionTip"
            style="position: absolute; bottom: 0; left: 0"
          >
            <v-chip label class="rounded-br-0 rounded-tr-lg rounded-tl-0" outlined>
              {{ predator.star.text }}
            </v-chip>
          </div>
          <div
            v-if="!simple && predator.doubleHook[0] > 1"
            style="position: absolute; top: 0; right: 0"
            title="双提个数"
          >
            <v-chip
              label
              class="rounded-tl-0 rounded-bl-lg rounded-br-0"
              color="primary"
              outlined
            >
              {{ predator.doubleHook.join(',') }}
            </v-chip>
          </div>
          <!--          <div-->
          <!--            v-if="predator.hasWeatherConstraint || predator.hasRealWeatherConstraint"-->
          <!--            style="position: absolute; right: 0; bottom: 0"-->
          <!--          >-->
          <!--            <v-chip-->
          <!--              label-->
          <!--              class="rounded-bl-0 rounded-tl-lg rounded-tr-0"-->
          <!--              color="error"-->
          <!--              outlined-->
          <!--            >-->
          <!--              <fish-weather-not-available :item="predator" dense />-->
          <!--            </v-chip>-->
          <!--          </div>-->
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
import FishBaitList from '@/components/FishBaitList'
import FishBiteTimeList from '@/components/FishBiteTimeList'
import FishWeatherNotAvailable from '@/components/OceanFishingFishList/FishWeatherNotAvailable'
export default {
  name: 'FishTip',
  components: { FishBiteTimeList, FishWeatherNotAvailable, FishBaitList },
  props: {
    fish: {
      type: Object,
      default: () => {},
    },
    showPointTip: {
      type: Boolean,
      default: false,
    },
    showAchievementTip: {
      type: Boolean,
      default: false,
    },
    showMissionTip: {
      type: Boolean,
      default: false,
    },
    // markTypeMissionTarget: {
    //   type: Boolean,
    //   default: false,
    // },
    // markStarMissionTarget: {
    //   type: Boolean,
    //   default: false,
    // },
    typeMission: {
      type: Object,
      default: undefined,
    },
    starMission: {
      type: Object,
      default: undefined,
    },
    tugMission: {
      type: Object,
      default: undefined,
    },
    simple: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    isTypeMissionTarget(fish) {
      return (
        this.showMissionTip &&
        this.typeMission != null &&
        this.typeMission.types.includes(fish.bonus.id)
      )
    },
    isStarMissionTarget(fish) {
      return this.showMissionTip && this.starMission != null && fish.star.quantity >= 3
    },
    isTugMissionTarget(fish) {
      return (
        this.showMissionTip && this.tugMission != null && fish.tug === this.tugMission.tug
      )
    },
    hideClearWeather(fish) {
      return (
        this.simple &&
        fish.notAvailableWeatherSet.length === 1 &&
        fish.notAvailableWeatherSet[0] === 1
      )
    },
  },
}
</script>

<style lang="sass" scoped>
.item-border
  border-width: 1px 0 0 0
  border-color: #272727
  border-style: solid
</style>
