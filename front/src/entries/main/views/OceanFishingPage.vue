<template>
  <v-container
    fluid
    :class="`detail-wrapper ${isMobile ? 'detail-wrapper-mobile' : 'detail-wrapper-pc'}`"
  >
    <v-tabs v-model="pageSection" centered icons-and-text grow>
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="(section, index) in pageSections" :key="index">
        {{ section.title }}
        <v-icon>{{ section.icon }}</v-icon>
      </v-tab>
    </v-tabs>

    <v-card v-if="pageSection === 0" class="mb-4">
      <v-card-title>当前航班</v-card-title>
      <v-card-text>
        <div>
          <span>{{ $t(`oceanFishing.currentVoyage.${currentVoyage.status}`) }}</span>
          <span v-if="currentVoyage.status === 'check-in'">
            {{ currentVoyage.checkInLimit }}
          </span>
          <span v-else-if="currentVoyage.status === 'none'">
            {{ currentVoyage.nextInterval }}
          </span>
        </div>
        <ocean-fishing-time-table
          :voyages="currentVoyage.voyageList"
          :targetOptions="targetOptions"
          hide-filters
        />

        <ocean-fishing-voyage
          :voyage="currentVoyage.voyageList && currentVoyage.voyageList[0]"
          :fish-dict="lazyTransformedFishDict"
        />
      </v-card-text>
    </v-card>

    <template v-else>
      <v-card>
        <v-card-title>海钓航班时间表</v-card-title>
        <v-card-subtitle>努力号航运表</v-card-subtitle>
        <div>
          <ocean-fishing-time-table
            :voyages="voyages"
            :targetOptions="targetOptions"
            @filterChanged="filterChanged"
            @voyage-selected="onVoyageSelected"
          />
        </div>
      </v-card>

      <v-card v-if="selectedVoyage" class="my-4">
        <v-card-title>
          <div class="d-flex justify-center">
            {{ selectedVoyage.name }}
            <v-icon>{{ selectedVoyage.shiftIcon }}</v-icon>
          </div>
        </v-card-title>
        <v-card-subtitle>
          点击上方时间表以显示对应航线
        </v-card-subtitle>
        <v-card-text>
          <ocean-fishing-voyage
            :voyage="selectedVoyage"
            :fish-dict="lazyTransformedFishDict"
            :default-target="selectedTarget"
          />
        </v-card-text>
      </v-card>
    </template>
    <v-dialog :value="showWarningDialog" width="500">
      <v-card>
        <v-card-title>
          攻略数据说明
        </v-card-title>
        <v-card-text>
          本页面中的攻略相关数据仅供参考。<br />
          <span class="font-weight-bold">咬钩时间</span>
          从攻略与网站收集，请结合实际情况酌情参考。
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="setShowOceanFishingWarningDialog(false)">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import OceanFishingUtil from '@/utils/OceanFishingUtil'
import DataUtil from '@/utils/DataUtil'
import { DateTime, FixedOffsetZone } from 'luxon'
import { mapGetters, mapMutations } from 'vuex'
import OceanFishingTimeTable from '@/components/OceanFishingTimeTable/OceanFishingTimeTable'
import ImgUtil from '@/utils/ImgUtil'
import OceanFishingVoyage from '@/components/OceanFishingVoyage/OceanFishingVoyage'
import DATA_CN from 'RCData/translation'

// https://ngabbs.com/read.php?tid=20553241

const MINUTE = 60000

export default {
  name: 'OceanFishingPage',
  components: { OceanFishingVoyage, OceanFishingTimeTable },
  props: ['now', 'lazyTransformedFishDict'],
  data() {
    return {
      pageSections: [
        { title: '当前航班', icon: 'mdi-ferry' },
        { title: '海钓航班时间表', icon: 'mdi-calendar' },
      ],
      pageSection: 0,
      achievementScore40: ImgUtil.getImgUrl('ocean-fishing-score-achievement-40x40.png'),
      filter: { voyageN: 10 },
      lazyNow: this.now,
      currentVoyageLastUpdate: 0,
      selectedVoyage: undefined,
      selectedTarget: undefined,
    }
  },
  computed: {
    showWarningDialog: {
      get() {
        return this.showOceanFishingWarningDialog
      },
      set(show) {
        return this.setShowOceanFishingWarningDialog(show)
      },
    },
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
          voyageList: this.lazyCurrentVoyage,
          status: status,
          checkInLimit: DataUtil.printCountDownTime(15 * MINUTE - timeSlot, 2),
        }
      } else {
        return {
          voyageList: this.lazyCurrentVoyage,
          nextInterval: DataUtil.printCountDownTime(2 * 60 * MINUTE - timeSlot, 2),
          status: 'none',
        }
      }
    },
    ...mapGetters([
      'getItemName',
      'getItemIconClass',
      'getAchievementName',
      'getAchievementIconClass',
      'showOceanFishingWarningDialog',
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
    voyages: {
      handler(voyages) {
        if (voyages?.length > 0) {
          this.selectedVoyage = voyages[0]
        }
      },
      immediate: true,
    },
  },
  methods: {
    onVoyageSelected(voyage) {
      this.selectedTarget = voyage.targetId
        ? { id: voyage.targetId, type: voyage.targetType }
        : null
      this.selectedVoyage = this.voyages[voyage.index]
    },
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
            milliseconds: voyageWithTip.time,
            day: DataUtil.formatDateTime(voyageWithTip.time, 'MM-dd'),
            time: DataUtil.formatDateTime(voyageWithTip.time, 'HH:mm'),
            shiftIcon: shift2Icon(voyageWithTip.shift.type),
            name: voyageWithTip.shift.name,
            targets: targets,
            voyageLocations: voyageWithTip.locationTips.map(it => ({
              id: it.fishingSpots.normal,
              spectralCurrentId: it.fishingSpots.spectralCurrent,
              weatherSet: it.weatherSet,
              shift: it.locationShift,
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
          bonus: DATA_CN.OCEAN_FISHING_ACHIEVEMENTS[achievementId].bonus,
          // 2562 游钓大洋3
          iconUrl: achievementId === 2562 ? this.achievementScore40 : null,
          type: 'achievement',
        }
      )
    },
    filterChanged(filter) {
      this.filter = filter
    },
    ...mapMutations(['setShowOceanFishingWarningDialog']),
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
@import "~@/styles/RcVariables"

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
