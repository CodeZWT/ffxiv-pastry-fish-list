<template>
  <v-container
    :class="`detail-wrapper ${isMobile ? 'detail-wrapper-mobile' : 'detail-wrapper-pc'}`"
  >
    <v-card>
      <v-card-title> 海钓航班时间表</v-card-title>
      <div>
        <!--        <div>-->
        <!--          {{ routes }}-->
        <!--        </div>-->
        <ocean-fishing-time-table :routes="routes" />
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

export default {
  name: 'OceanFishingPage',
  components: { OceanFishingTimeTable },
  props: ['now'],
  data() {
    return {}
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    routes() {
      return OceanFishingUtil.routesWithTipOf(this.now).map((routeWithTip, index) => {
        const showDay = index === 0 || getCNTime(routeWithTip.time).hour === 0
        const targets = routeWithTip.routeTip.achievements
          .map(it => this.assembleAchievement(it))
          .concat(
            routeWithTip.locationTips
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
          simpleName: routeWithTip.routeSimpleName,
          day: DataUtil.formatDateTime(routeWithTip.time, 'MM-dd'),
          time: DataUtil.formatDateTime(routeWithTip.time, 'HH:mm'),
          shiftIcon: shift2Icon(routeWithTip.shift.type),
          name: routeWithTip.shift.name,
          targets: targets,
          routeLocations: routeWithTip.locationTips.map(it => it.locationName),
        }
      })
    },
    ...mapGetters([
      'getItemName',
      'getItemIconClass',
      'getAchievementName',
      'getAchievementIconClass',
    ]),
  },
  methods: {
    assembleItem(itemId) {
      return (
        itemId && {
          id: itemId,
          name: this.getItemName(itemId),
          icon: this.getItemIconClass(itemId),
        }
      )
    },
    assembleAchievement(achievementId) {
      return (
        achievementId && {
          id: achievementId,
          name: this.getAchievementName(achievementId),
          icon: this.getAchievementIconClass(achievementId),
        }
      )
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
