<template>
  <v-container
    :class="`detail-wrapper ${isMobile ? 'detail-wrapper-mobile' : 'detail-wrapper-pc'}`"
  >
    <v-card class="mb-4">
      <v-card-title>当前航班</v-card-title>
      <v-card-text>
        <div>
          <span>{{ currentVoyage.status }}</span>
          <span v-if="currentVoyage.status === 'check-in'">
            {{ currentVoyage.checkInLimit }}
          </span>
        </div>
        <ocean-fishing-time-table
          :voyages="currentVoyage.voyage"
          :targetOptions="targetOptions"
          hide-filters
        />

        <!--        <div>{{ currentFishList }}</div>-->
        <ocean-fishing-fish-list :fish-list="currentFishList" />

        <pre>{{ JSON.stringify(currentVoyage, null, 2) }}</pre>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>海钓航班时间表</v-card-title>
      <v-card-subtitle>努力号航运表</v-card-subtitle>
      <div>
        <ocean-fishing-time-table
          :voyages="voyages"
          :targetOptions="targetOptions"
          @filterChanged="filterChanged"
        />
      </div>
    </v-card>
  </v-container>
</template>

<script>
import OceanFishingUtil from '@/utils/OceanFishingUtil'
import DataUtil from '@/utils/DataUtil'
import { DateTime, FixedOffsetZone } from 'luxon'
import { mapGetters } from 'vuex'
import OceanFishingTimeTable from '@/components/OceanFishingTimeTable/OceanFishingTimeTable'
import ImgUtil from '@/utils/ImgUtil'
import regionTerritorySpots from '@/store/fishingSpots.json'
import OceanFishingFishList from '@/components/OceanFishingFishList/OceanFishingFishList'

// https://ngabbs.com/read.php?tid=20553241

const MINUTE = 60000

export default {
  name: 'OceanFishingPage',
  components: { OceanFishingFishList, OceanFishingTimeTable },
  props: ['now', 'lazyTransformedFishDict'],
  data() {
    return {
      achievementScore40: ImgUtil.getImgUrl('ocean-fishing-score-achievement-40x40.png'),
      filter: { voyageN: 13 },
      lazyNow: this.now,
      currentVoyageLastUpdate: 0,
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    voyages() {
      return this.assembleVoyages(
        OceanFishingUtil.shiftTimeForCheckInLimit(this.lazyNow),
        this.filter.voyageN,
        this.filter.voyageTypes
      )
    },
    targetOptions() {
      return OceanFishingUtil.allTargets().map(group => {
        return {
          type: group.type,
          options: group.options.map(target => {
            if (target.type === 'item') {
              return { ...this.assembleItem(target.id), voyageTypes: target.voyageTypes }
            } else if (target.type === 'achievement') {
              return {
                ...this.assembleAchievement(target.id),
                voyageTypes: target.voyageTypes,
              }
            } else {
              return {
                ...target,
                icon: shift2Icon(target.shift),
              }
            }
          }),
        }
      })
    },
    // selectionChanged(selectedOptions) {
    //   return this.filterChanged({
    //     voyageTypes: ,
    //   })
    // },
    // targetVoyageTypes() {
    //   // todo map targets to voyage types
    //   return _.uniq(this.targets.flatMap(it => it.voyageTypes))
    // },
    currentVoyage() {
      const timeSlot = this.now % (2 * 60 * MINUTE)
      if (timeSlot < 60 * MINUTE) {
        const status = timeSlot < 15 * MINUTE ? 'check-in' : 'traveling'
        return {
          voyage: this.lazyCurrentVoyage,
          status: status,
          checkInLimit: DataUtil.printCountDownTime(15 * MINUTE - timeSlot, 2),
        }
      } else {
        return {
          voyage: this.lazyCurrentVoyage,
          nextInterval: DataUtil.printCountDownTime(2 * 60 * MINUTE - timeSlot, 2),
          status: 'none',
        }
      }
    },
    currentFishingSpotId() {
      return this.currentVoyage.voyage[0].voyageLocations[0].id
    },
    currentFishList() {
      return regionTerritorySpots
        .find(it => it.id === 3443)
        ?.territories.find(it => it.id === 3477)
        ?.spots.find(it => it.id === this.currentFishingSpotId)
        ?.fishList?.map(fishId => this.lazyTransformedFishDict[fishId])
    },
    ...mapGetters([
      'getItemName',
      'getItemIconClass',
      'getAchievementName',
      'getAchievementIconClass',
    ]),
  },
  watch: {
    now(now) {
      if (this.shouldUpdate(this.lazyNow, now)) {
        this.lazyNow = now
      }

      if (this.shouldUpdate(this.currentVoyageLastUpdate, this.now)) {
        this.lazyCurrentVoyage = this.assembleVoyages(
          OceanFishingUtil.shiftTimeForLimit(this.now, 60 * MINUTE),
          1
        )
        this.currentVoyageLastUpdate = this.now
      }
    },
  },
  methods: {
    shouldUpdate(lastUpdate, now) {
      return Math.floor(now / (15 * MINUTE)) > Math.floor(lastUpdate / (15 * MINUTE))
    },
    assembleVoyages(time, n, types) {
      return OceanFishingUtil.voyagesWithTipOf(time, n, types).map(
        (voyageWithTip, index) => {
          const showDay = index === 0 || getCNTime(voyageWithTip.time).hour === 0
          const targets = voyageWithTip.voyageTip.achievements
            .map(it => this.assembleAchievement(it))
            .concat(
              voyageWithTip.locationTips
                .map(locationTip => {
                  return {
                    blueFish: this.assembleItem(locationTip.blueFish),
                  }
                })
                .flatMap(it => {
                  return [it.blueFish]
                })
            )
            .filter(it => it)
          return {
            showDay,
            simpleName: voyageWithTip.voyageSimpleName,
            day: DataUtil.formatDateTime(voyageWithTip.time, 'MM-dd'),
            time: DataUtil.formatDateTime(voyageWithTip.time, 'HH:mm'),
            shiftIcon: shift2Icon(voyageWithTip.shift.type),
            name: voyageWithTip.shift.name,
            targets: targets,
            voyageLocations: voyageWithTip.locationTips.map(it => ({
              id: it.fishingSpots.normal,
              spectralCurrentId: it.fishingSpots.spectralCurrent,
              name: it.locationName,
              icon: shift2Icon(it.locationShift),
              hint: it.locationHint,
            })),
          }
        }
      )
    },
    assembleItem(itemId) {
      return (
        itemId && {
          id: itemId,
          name: this.getItemName(itemId),
          icon: this.getItemIconClass(itemId),
          type: 'item',
        }
      )
    },
    assembleAchievement(achievementId) {
      return (
        achievementId && {
          id: achievementId,
          name:
            achievementId === 2562
              ? '游钓大洋1-3(冲分)'
              : this.getAchievementName(achievementId),
          icon: this.getAchievementIconClass(achievementId),
          // 2562 游钓大洋3
          iconUrl: achievementId === 2562 ? this.achievementScore40 : null,
          type: 'achievement',
        }
      )
    },
    filterChanged(filter) {
      this.filter = filter
    },
  },
}

function getCNTime(milliSeconds) {
  return DateTime.fromMillis(milliSeconds).setZone(FixedOffsetZone.instance(480))
}

function shift2Icon(shift) {
  const shiftIconDict = ['mdi-weather-sunny', 'mdi-weather-sunset', 'mdi-weather-night']
  return shiftIconDict[shift]
}
</script>
<style lang="sass" scoped>
@import "../styles/RcVariables"

.detail-wrapper
  width: 100%
  height: 100%
  overflow-scrolling: auto
  overflow-y: scroll
  overflow-x: hidden

  &-mobile
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

  &-pc
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})
</style>
