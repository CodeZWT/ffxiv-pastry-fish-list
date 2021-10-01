<template>
  <v-row no-gutters style="width: 100%">
    <template v-for="component in sortedDetailComponents">
      <v-col
        v-if="component.enabled && (!component.constraint || fish[component.constraint])"
        cols="12"
        class="my-2"
        :key="component.name"
      >
        <component
          v-bind:is="component.name"
          :fish="fish"
          :fish-weather-change-part="fishWeatherChangePart"
          :expanded="component.expanded"
          :show-fishing-range-helper="fish.type === 'normal'"
          @close-dialog="$emit('close-dialog')"
        />
      </v-col>
    </template>
  </v-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import DetailItemPredators from '@/components/DetailItemPredators'
import DetailItemMap from '@/components/fish-detail-items/DetailItemMap'
import DetailItemCountdownBar from '@/components/fish-detail-items/DetailItemCountdownBar'
import DetailItemRequirements from '@/components/fish-detail-items/DetailItemRequirements'
import DetailItemBuffAndBaits from '@/components/fish-detail-items/DetailItemBuffAndBaits'
import DetailItemFishWindowTable from '@/components/fish-detail-items/DetailItemFishWindowTable'
import DetailItemTips from '@/components/fish-detail-items/DetailItemTips/DetailItemTips'
import DetailItemAquarium from '@/components/fish-detail-items/DetailItemAquarium'
import DetailItemQuest from '@/components/fish-detail-items/DetailItemQuest'
import _ from 'lodash'
import FIX from 'Data/fix'
import placeNames from 'Data/placeNames'

export default {
  name: 'FishDetailContent',

  components: {
    DetailItemFishWindowTable,
    DetailItemBuffAndBaits,
    DetailItemRequirements,
    DetailItemCountdownBar,
    DetailItemMap,
    DetailItemPredators,
    DetailItemTips,
    DetailItemAquarium,
    DetailItemQuest,
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    fishTimePart: {
      type: Object,
      default: () => ({}),
    },
    fishWeatherChangePart: {
      type: Object,
      default: () => ({}),
    },
    predators: {
      type: Array,
      default: () => [],
    },
    fishingTypeColor: {
      type: String,
      default: '',
    },
    listItemColor: {
      type: String,
      default: '',
    },
    forceShowComponents: {
      type: Array,
      default: undefined,
    },
    hideMap: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    fish() {
      const fish = this.value
      const hasPredators = Object.keys(fish.predators).length > 0
      const bestCatchPathExtra = fish.bestCatchPathExtra ?? []
      const isSpear = fish.gig != null
      const aquariumFish = FIX.AQUARIUMS[DataUtil.toItemId(fish._id)]
      const tasks = Object.values(FIX.QUEST)
        .filter(task => task.items.includes(fish._id))
        .map(task => {
          return {
            ...task,
            name: DataUtil.getName(task),
            items: task.items.map(itemId => {
              return {
                id: itemId,
                icon: this.getItemIconClass(itemId),
                name: this.getItemName(itemId),
                anglerFishId: this.allFish[itemId].anglerFishId,
              }
            }),
          }
        })
      return {
        ...fish,
        id: fish._id,
        type: isSpear ? 'spear' : 'normal',
        icon: this.getItemIconClass(fish._id),
        startHourText: fish.startHourText ?? DataUtil.formatET(fish.startHour),
        endHourText: fish.endHourText ?? DataUtil.formatET(fish.endHour),
        hasTimeConstraint: fish.startHour !== 0 || fish.endHour !== 24,
        hasCountDown: DataUtil.hasCountDown(this.fishTimePart.countDown),
        hasFishEyes: !!fish.fishEyes,
        fishEyesIcon: DataUtil.iconIdToClass(DataUtil.ICON_FISH_EYES),
        // fishEyesText: DataUtil.secondsToMinutesString(fish.fishEyes),
        fishEyesSeconds: fish.fishEyes,
        hasPredators: hasPredators,
        predators: this.predators,
        predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
        fishersIntuitionText: DataUtil.secondsToMinutesString(fish.intuitionLength),
        hasSnagging: !!fish.snagging,
        snaggingIcon: DataUtil.iconIdToClass(DataUtil.ICON_SNAGGING),
        zone: this.getZoneName(fish.location),
        hasFishingSpot: fish.locations.length > 0,
        fishingSpots: isSpear
          ? fish.locations.map(location => {
              const gatheringPoint = FIX.SPEAR_FISH_GATHERING_POINTS[location]
              return {
                zone: placeNames[gatheringPoint.territoryPlaceNameId],
                fishingSpot: gatheringPoint,
                fishingSpotName: DataUtil.getName(gatheringPoint),
                fishingSpotId: location,
                fishSpotPositionText: DataUtil.toPositionText(gatheringPoint),
              }
            })
          : this.getFishingSpots(fish.locations),
        anglerFishId: fish.anglerFishId,
        weatherSet: fish.weatherSet,
        weatherSetDetail: this.getWeather(fish.weatherSet),
        hasWeatherConstraint:
          fish.previousWeatherSet.length > 0 || fish.weatherSet.length > 0,
        previousWeatherSet: fish.previousWeatherSet,
        previousWeatherSetDetail: this.getWeather(fish.previousWeatherSet),
        countDownType: this.fishTimePart.countDown.type,
        countDownTypeName: DataUtil.getCountDownTypeName(
          this.fishTimePart.countDown.type
        ),
        countDownTimePoint: this.fishTimePart.countDown?.timePoint,
        countDownTimePointText: this.$t('countDown.timePointHint', {
          timePoint: DataUtil.formatDateTime(this.fishTimePart.countDown?.timePoint),
        }),
        countDownTotal: this.fishTimePart.countDown.fishWindowTotal,
        isFishing: this.fishTimePart.countDown?.type === DataUtil.FISHING,
        baitsExtra:
          bestCatchPathExtra.length > 0 ? this.getBaits(fish, bestCatchPathExtra) : [],
        availableBaitList: fish.catchPathList
          ? fish.catchPathList.map(it => this.getBaits(fish, it))
          : [],
        baits: this.getBaits(fish),
        isCompleted: this.getFishCompleted(fish._id),
        addBuffSuffix: hasPredators && DataUtil.isAllAvailableFish(fish),
        hasTips: DataUtil.hasTips(fish._id),
        gig: fish.gig
          ? {
              id: fish.gig,
              type: DataUtil.GIG_DICT[fish.gig],
              icon: DataUtil.GIG_ICON[DataUtil.GIG_DICT[fish.gig]],
              text: this.$t('gig.' + DataUtil.GIG_DICT[fish.gig]),
            }
          : {},
        aquarium: !!aquariumFish && DataUtil.assembleAquarium(aquariumFish, fish),
        tasks: tasks,
        hasTasks: tasks.length > 0,
      }
    },
    sortedDetailComponents() {
      if (this.forceShowComponents) {
        return DataUtil.getDetailComponentSettingTemplate(this.forceShowComponents).map(
          (component, index) => ({
            ...component,
            expanded: true,
            enabled: true,
            order: index,
          })
        )
      } else {
        return _.sortBy(
          this.detailComponents.filter(
            component =>
              DataUtil.USER_DEFAULT_DATA.detailArrangement.components.some(
                defaultComp => defaultComp.name === component.name
              ) &&
              (!this.hideMap || component.name !== 'DetailItemMap')
          ),
          'order'
        ).map(it => ({
          ...it,
          constraint: DataUtil.DETAIL_ITEM_DISPLAY_CONSTRAINTS[it.name],
        }))
      }
    },
    ...mapState({ allFish: 'fish' }),
    ...mapGetters([
      'getWeather',
      'getFishingSpot',
      'getBaits',
      'getItemName',
      'getZoneName',
      'getFishingSpotsName',
      'getFishCompleted',
      'detailComponents',
      'getFishingSpots',
      'getItemIconClass',
    ]),
  },

  methods: {
    resize() {
      this.$refs.simpleMap?.resize()
    },
    getName: DataUtil.getName,
  },
}
</script>

<style scoped></style>
