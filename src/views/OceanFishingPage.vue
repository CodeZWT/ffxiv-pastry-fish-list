<template>
  <v-container
    :class="`detail-wrapper ${isMobile ? 'detail-wrapper-mobile' : 'detail-wrapper-pc'}`"
  >
    <v-card>
      <v-card-title> 海钓航班时间表</v-card-title>
      <div>{{ filter }}</div>
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

export default {
  name: 'OceanFishingPage',
  components: { OceanFishingTimeTable },
  props: ['now'],
  data() {
    return {
      achievementScore40: ImgUtil.getImgUrl('ocean-fishing-score-achievement-40x40.png'),
      filter: { voyageN: 13 },
      lazyNow: this.now,
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    voyages() {
      return OceanFishingUtil.voyagesWithTipOf(
        OceanFishingUtil.shiftTimeForCheckInLimit(this.lazyNow),
        this.filter.voyageN,
        this.targetVoyageTypes
      ).map((voyageWithTip, index) => {
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
          voyageLocations: voyageWithTip.locationTips.map(it => it.locationName),
        }
      })
    },
    targetOptions() {
      return OceanFishingUtil.allTargets().map(target => {
        if (target.type === 'item') {
          return this.assembleItem(target.id)
        } else {
          return this.assembleAchievement(target.id)
        }
      })
    },
    targetVoyageTypes() {
      // todo map targets to voyage types
      return [0, 1, 2, 3, 4, 5]
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
      if (now % 900000 < 2000) {
        this.lazyNow = now
      }
    },
  },
  methods: {
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
          name: this.getAchievementName(achievementId),
          icon: this.getAchievementIconClass(achievementId),
          // 2562 游钓大海
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
