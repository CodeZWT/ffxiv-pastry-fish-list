<template>
  <v-container
    fluid
    :class="
      `detail-wrapper ${isElectron ? 'detail-wrapper--electron' : 'detail-wrapper--web'}`
    "
  >
    <v-tabs v-model="pageSection" centered icons-and-text grow>
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="(section, index) in pageSections" :key="index">
        {{ section.title }}
        <v-icon>{{ section.icon }}</v-icon>
      </v-tab>
    </v-tabs>

    <v-card v-if="pageSection === 0" class="mb-4">
      <v-card-title class="d-flex">
        <div>当前航班</div>
        <v-spacer />
        <div>
          <v-btn color="primary" @click="showBiteTimeDialog = true" class="mr-1">
            <v-icon left>mdi-information</v-icon>
            咬钩时间说明
          </v-btn>
          <v-btn color="info" @click="showUpdateDialog = true">
            <v-icon left>mdi-information</v-icon>
            5.4 版本更新说明
          </v-btn>
        </div>
      </v-card-title>
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
        <v-card-text>
          <div>
            时间表中标记冲分路线为推荐航线，其他（除双蓝）航线也可冲分，请查看“高分鱼”界面内容并参考攻略
          </div>
          <v-sheet outlined class="pa-2">
            <div class="d-flex flex-column">
              <a :href="tip.link" target="_blank">{{ tip.title }}</a>
              <span>{{ tip.author }}</span>
            </div>
          </v-sheet>
        </v-card-text>
        <div>
          <ocean-fishing-time-table
            :voyages="voyages"
            :targetOptions="targetOptions"
            @filterChanged="filterChanged"
            @voyage-selected="onVoyageSelected"
            show-current-route-indicator
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
    <v-dialog v-model="showUpdateDialog" width="500" persistent scrollable>
      <v-card>
        <v-card-title>
          5.4 版本更新说明
        </v-card-title>
        <v-card-text>
          <v-subheader>
            游戏内容更新说明
          </v-subheader>
          <v-alert outlined type="success" border="left" icon="mdi-ferry">
            <ul>
              <li>
                新增钓场：谢尔达莱群岛、绯汐海、罗斯利特湾
              </li>
              <li>
                新增线路：Bloodbrine Sea、Rothlyt Sound
              </li>
              <li>
                航线共12种，每种航线每天出现一次
              </li>
            </ul>
          </v-alert>
          <v-alert outlined type="info" border="left">
            <ul>
              <li>
                未触发幻海流时，下一个地点触发幻海流的几率会提升
              </li>
              <li>
                未触发幻海流或幻海流进行中状态下进入下一个钓场时，下一个地点的幻海流时间会延长
              </li>
            </ul>
          </v-alert>
          <v-alert outlined type="info" border="left" icon="mdi-fish">
            “沉寂者”、“剪碎手巴塞洛缪”的双提个数变为4
          </v-alert>
          <v-alert outlined type="error" border="left">
            中途退出后，不再能够申请进入本轮出海垂钓
          </v-alert>
          <v-alert outlined type="success" border="left" icon="mdi-format-list-checks">
            新增“任务”系统，完成任务会获得额外分数加成（5%/10%/20%）
          </v-alert>
          <v-subheader>
            鱼糕页面更新说明
          </v-subheader>
          <v-alert outlined border="left">
            <ul>
              <li>
                此页面为5.4海钓内容，将与原版海钓共存一段时间。（直至国服版本更新）
              </li>
              <li>
                原“幻光鱼/绿鱼/蓝鱼”变更为“稀有鱼”，增加天气鱼
              </li>
              <li>
                原“游钓大洋1-3(冲分)”变更为高分鱼，在所有航线都会显示
              </li>
              <li>
                时间表中标记冲分路线为推荐航线，其他（除双蓝）航线也可冲分，请查看“高分鱼”界面内容并参考攻略
              </li>
              <li>
                增加任务系统的支持，仅在“高分鱼”界面出现
              </li>
            </ul>
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="showUpdateDialog = false">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showBiteTimeDialog" width="500" persistent scrollable>
      <v-card>
        <v-card-title>
          咬钩时间说明
        </v-card-title>
        <v-card-text>
          <ul>
            <li>
              咬钩时间现已经改版，依据鱼糕桌面版收集的时间，并做了一定的近似处理。（例：1.2
              -> 1； 1.6 -> 1.5； 1.9 -> 2）
            </li>
            <li>
              鱼默认显示的咬钩时间是使用推荐鱼饵时的数据。
            </li>
            <li>
              部分鱼咬钩时间在使用
              <span class="error--text">不同鱼饵</span>的情况下
              <span class="error--text">差别很大</span>
              ，请注意！
            </li>
            <li>
              鼠标悬停咬钩时间可以查看所有鱼饵的咬钩时间
            </li>
            <li>
              查看原始数据与上传数据请看
              <a href="https://docs.qq.com/sheet/DUGNNQWlaUlNudk95" target="_blank">
                【腾讯文档】5.4数据收集
              </a>
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="showBiteTimeDialog = false">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import OceanFishingUtil from '@/utils/OceanFishing54/OceanFishingUtil'
import DataUtil from '@/utils/DataUtil'
import { DateTime, FixedOffsetZone } from 'luxon'
import { mapGetters, mapMutations } from 'vuex'
import OceanFishingTimeTable from '@/components/OceanFishing54/OceanFishingTimeTable/OceanFishingTimeTable'
import ImgUtil from '@/utils/ImgUtil'
import OceanFishingVoyage from '@/components/OceanFishing54/OceanFishingVoyage/OceanFishingVoyage'
import DATA_CN from 'Data/translation'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import { OCEAN_FISHING_TIPS } from '../../../../../data/fix'

// https://ngabbs.com/read.php?tid=20553241

const MINUTE = 60000

export default {
  name: 'OceanFishingPage54',
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
      filter: { voyageN: 12 },
      lazyNow: this.now,
      currentVoyageLastUpdate: 0,
      selectedVoyage: undefined,
      selectedTarget: undefined,
      isElectron: DevelopmentModeUtil.isElectron(),
      tip: OCEAN_FISHING_TIPS.tip3,
    }
  },
  computed: {
    showUpdateDialog: {
      get() {
        return this.showOFUpdateDialog
      },
      set(show) {
        return this.setShowOFUpdateDialog(show)
      },
    },
    showBiteTimeDialog: {
      get() {
        return this.showOFBiteTimeDialog
      },
      set(show) {
        return this.setShowOFBiteTimeDialog(show)
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
      'showOFUpdateDialog',
      'showOFBiteTimeDialog',
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
            // simpleName: voyageWithTip.voyageSimpleName,
            milliseconds: voyageWithTip.time,
            day: DataUtil.formatDateTime(voyageWithTip.time, 'MM-dd'),
            time: DataUtil.formatDateTime(voyageWithTip.time, 'HH:mm'),
            shiftIcon: shift2Icon(voyageWithTip.shift.type),
            name: voyageWithTip.shift.name,
            targets: targets,
            typeMission: voyageWithTip.typeMission,
            starMission: voyageWithTip.starMission,
            tugMission: voyageWithTip.tugMission,
            voyageLocations: voyageWithTip.locationTips.map(it => ({
              id: it.fishingSpots.normal,
              spectralCurrentId: it.fishingSpots.spectralCurrent,
              weatherSet: it.weatherSet,
              shift: it.shift,
              name: it.locationName,
              icon: shift2Icon(it.shift),
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
      if (!achievementId) return null
      const achievement = DATA_CN.OCEAN_FISHING_ACHIEVEMENTS[achievementId]
      return {
        id: achievementId,
        name: this.getAchievementName(achievementId),
        icon: this.getAchievementIconClass(achievementId),
        bonus: achievement.bonus,
        iconUrl: achievement.iconLocal && ImgUtil.getImgUrl(achievement.iconLocal),
        nonTipOptions: achievement.nonTipOptions,
        type: 'achievement',
      }
    },
    filterChanged(filter) {
      this.filter = filter
    },
    ...mapMutations(['setShowOFUpdateDialog', 'setShowOFBiteTimeDialog']),
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

  &--web
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

  &--electron
    max-height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding})
</style>
