<template>
  <v-container
    fluid
    :class="{
      'pa-0': true,
      'detail-wrapper': true,
      'detail-wrapper--web': !isElectron,
      'detail-wrapper--electron': isElectron && !original,
      'detail-wrapper--electron-original': isElectron && original,
    }"
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
          <v-btn color="primary" @click="showIKDBonusDialog = true" class="mr-1">
            <v-icon left>{{ mdiTable }}</v-icon>
            额外奖励表
          </v-btn>
          <v-btn color="info" @click="showBiteTimeDialog = true" class="mr-1">
            <v-icon left>{{ mdiInformation }}</v-icon>
            关于咬钩时间
          </v-btn>
          <!--          <v-btn color="info" @click="showUpdateDialog = true"> 5.4更新 </v-btn>-->
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
          :is-mobile="isMobile"
        />

        <ocean-fishing-voyage
          :voyage="currentVoyage.voyageList && currentVoyage.voyageList[0]"
          :fish-dict="lazyTransformedFishDict"
          :is-mobile="isMobile"
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
            :is-mobile="isMobile"
            show-current-route-indicator
            @filterChanged="filterChanged"
            @voyage-selected="onVoyageSelected"
          />
        </div>
      </v-card>

      <v-card v-if="selectedVoyage" class="my-4" id="selected-ikd-timetable">
        <v-card-title>
          <div class="d-flex justify-center">
            {{ selectedVoyage.name }}
            <v-icon>{{ selectedVoyage.shiftIcon }}</v-icon>
          </div>
        </v-card-title>
        <v-card-subtitle> 点击上方时间表以显示对应航线 </v-card-subtitle>
        <v-card-text>
          <ocean-fishing-voyage
            :voyage="selectedVoyage"
            :fish-dict="lazyTransformedFishDict"
            :default-target="selectedTarget"
            :is-mobile="isMobile"
          />
        </v-card-text>
      </v-card>
    </template>

    <rc-dialog v-model="showBiteTimeDialog" width="500" persistent scrollable>
      <v-card>
        <v-card-title> 咬钩时间说明 </v-card-title>
        <v-card-text>
          <ul>
            <li>
              咬钩时间做了一定的近似处理。
              <br />例：1.2 -> 1； 1.6 -> 1.5； 1.9 -> 2
            </li>
            <li>鱼默认显示的咬钩时间是使用推荐鱼饵时的数据。</li>
            <li>
              部分鱼咬钩时间在使用
              <span class="error--text">不同鱼饵</span>的情况下
              <span class="error--text">差别很大</span>
              ，请注意！
            </li>
            <li>鼠标悬停咬钩时间可以查看所有鱼饵的咬钩时间</li>
            <!--            <li>-->
            <!--              查看原始数据与上传数据请看-->
            <!--              <a href="https://docs.qq.com/sheet/DUGNNQWlaUlNudk95" target="_blank">-->
            <!--                【腾讯文档】5.4数据收集-->
            <!--              </a>-->
            <!--            </li>-->
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="showBiteTimeDialog = false"> 确认 </v-btn>
        </v-card-actions>
      </v-card>
    </rc-dialog>
    <rc-dialog v-model="showIKDBonusDialog" scrollable max-width="1080">
      <v-card>
        <v-card-title> 额外奖励表 </v-card-title>
        <v-card-text>
          <v-simple-table dense class="system">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">加成名称</th>
                  <th class="text-left">达成条件</th>
                  <th class="text-left">渔分加成比例</th>
                  <th class="text-left">备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(bonus, index) in ikdBonus" :key="index">
                  <td style="height: 40px" class="text-left d-flex align-center">
                    <item-icon :icon-class="bonus.icon" small />
                    {{ bonus.objective }}
                  </td>
                  <td style="height: 40px" class="text-left">
                    {{ bonus.requirement }}
                  </td>
                  <td style="height: 40px" class="text-left">{{ bonus.percentage }}%</td>
                  <td style="height: 40px" class="text-left">
                    <v-tooltip bottom v-if="bonus.comment">
                      <template v-slot:activator="{ on, attrs }">
                        <div v-bind="attrs" v-on="on">
                          <v-icon> {{ mdiInformation }} </v-icon>
                        </div>
                      </template>
                      <div>
                        {{ bonus.comment }}
                      </div>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="showIKDBonusDialog = false"> 确认 </v-btn>
        </v-card-actions>
      </v-card>
    </rc-dialog>
  </v-container>
</template>

<script>
import { OCEAN_FISHING_BONUS, OCEAN_FISHING_TIPS } from 'Data/oceanFishing'
import { mapGetters, mapMutations } from 'vuex'
import { mdiCalendar, mdiFerry, mdiInformation, mdiTable } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import IKDRouteMixin from '@/mixins/IKDRouteMixin'
import ImgUtil from '@/utils/ImgUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import OceanFishingTimeTable from '@/components/OceanFishing54/OceanFishingTimeTable/OceanFishingTimeTable'
import OceanFishingUtil from '@/utils/OceanFishing54/OceanFishingUtil'
import OceanFishingVoyage from '@/components/OceanFishing54/OceanFishingVoyage/OceanFishingVoyage'
import PageMixin from '@/components/OceanFishingFishList/PageMixin'
import RcDialog from '@/components/basic/RcDialog'

// https://ngabbs.com/read.php?tid=20553241

const MINUTE = 60000

export default {
  name: 'OceanFishingPage54',
  mixins: [PageMixin, IKDRouteMixin],
  components: { RcDialog, ItemIcon, OceanFishingVoyage, OceanFishingTimeTable },
  props: ['now', 'lazyTransformedFishDict', 'original'],
  data() {
    return {
      mdiTable,
      mdiInformation,
      mdiFerry,
      mdiCalendar,
      pageSections: [
        { title: '当前航班', icon: mdiFerry },
        { title: '海钓航班时间表', icon: mdiCalendar },
      ],
      pageSection: 0,
      achievementScore40: ImgUtil.getImgUrl('ocean-fishing-score-achievement-40x40.webp'),
      filter: { voyageN: 12 },
      lazyNow: this.now,
      currentVoyageLastUpdate: 0,
      selectedVoyage: undefined,
      selectedTarget: undefined,
      isElectron: DevelopmentModeUtil.isElectron(),
      tip: OCEAN_FISHING_TIPS.tip3,
      showIKDBonusDialog: false,
      ikdBonus: Object.values(OCEAN_FISHING_BONUS)
        .filter(it => !it.skip)
        .map(it => {
          return {
            ...it,
            requirement: it.requirement && it.requirement.substring(5),
            percentage: it.bonus - 100,
            icon: DataUtil.iconIdToClass(it.icon),
          }
        })
        .sort((a, b) => a.order - b.order),
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
    voyages() {
      return this.assembleVoyages(
        OceanFishingUtil.shiftTimeForCheckInLimit(Date.now()),
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
                icon: DataUtil.shift2Icon(target.shift),
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
    filterChanged(filter) {
      this.filter = filter
    },
    ...mapMutations(['setShowOFUpdateDialog', 'setShowOFBiteTimeDialog']),
  },
}
</script>
<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.detail-wrapper
  width: 100%
  overflow-scrolling: auto
  overflow-x: hidden
  overflow-y: auto

  &--web
    max-height: calc(100vh - #{ $wrapper-web })
  &--electron
    max-height: calc(100% - #{ $toolbar-height })
  &--electron-original
    max-height: calc(100vh - #{ $wrapper-desktop })
</style>
