<template>
  <div v-resize="onWindowResize">
    <div class="d-flex align-center">
      <v-radio-group v-model="tipIndex" row>
        <v-radio v-for="(tip, index) in tips" :value="index" :key="index">
          <template v-slot:label>
            <item-icon
              :icon-class="tip.icon"
              :icon-url="tip.iconUrl"
              :type="tip.type"
              :title="tip.bonusRequirement"
            />
            <div :title="tip.bonusRequirement">{{ tip.name }}</div>
          </template>
        </v-radio>
      </v-radio-group>
    </div>
    <div v-if="currentTip.id === 'fish-list'">
      <v-tabs v-model="currentLocationIndex" centered icons-and-text grow show-arrows>
        <v-tabs-slider></v-tabs-slider>
        <v-tab v-for="(location, index) in currentLocations" :key="index">
          {{ location.name }}
          <v-icon>{{ location.icon }}</v-icon>
        </v-tab>
      </v-tabs>

      <v-expansion-panels
        :value="[0, 1]"
        multiple
        accordion
        class="my-2 rounded-b-lg rounded-t-0"
        flat
      >
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="d-flex my-4" style="width: 100%">
              <div class="text-h6">
                {{ currentFishingSpot && currentFishingSpot.mainName }}
              </div>
              <v-icon>{{ currentFishingSpot && currentFishingSpot.icon }}</v-icon>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <ocean-fishing-fish-list
              :fish-list="currentFishList"
              weather-filter
              :weather-set="currentWeatherSet"
              dense
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="d-flex my-4" style="width: 100%">
              <div class="text-h6">
                {{ currentFishingSpot && currentFishingSpot.subName }}
              </div>
              <v-icon>{{ currentFishingSpot && currentFishingSpot.icon }}</v-icon>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="my-1">
              <v-btn
                @click="toggleShiftFilter"
                :color="shiftFilterEnabled ? 'error' : 'primary'"
              >
                {{ shiftFilterEnabled ? '清除时间限制' : '只显示当前时间可钓的鱼' }}
              </v-btn>
            </div>
            <ocean-fishing-fish-list
              :fish-list="currentSpectralCurrentFishList"
              :shift-filter="shiftFilterEnabled"
              :shift="currentShift"
              dense
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-else-if="currentTip.id === 'fish-tip'">
      <v-row>
        <v-col cols="12">
          <v-switch v-model="enableSimpleMode" label="简化模式" inset />
        </v-col>
        <v-col
          v-for="(location, index) in currentLocations"
          :key="index"
          :cols="locationCols"
        >
          <v-row no-gutters>
            <v-col cols="12">
              <v-card outlined class="mt-2">
                <v-card-title>
                  <div class="d-flex justify-center">
                    <div>{{ location.mainName }}</div>
                    <v-icon>{{ location.icon }}</v-icon>
                  </div>
                </v-card-title>
                <v-card-text>
                  <div v-if="currentTipSpectralFishList[index]">
                    <fish-tip
                      :fish="currentTipSpectralFishList[index]"
                      :simple="enableSimpleMode"
                    />
                  </div>
                  <div v-if="currentTipNormalBigFishList[index]">
                    <div class="d-flex flex-column">
                      <fish-tip
                        :fish="currentTipNormalBigFishList[index]"
                        :simple="enableSimpleMode"
                      />
                    </div>
                  </div>
                  <div
                    v-for="fish in currentTipNormalFishLists[index]"
                    :key="'weather-fish-' + fish._id"
                  >
                    <fish-tip
                      v-if="
                        fish.notAvailableWeatherSet.length > 0 &&
                          currentTipSpectralFishList[index]._id !== fish._id &&
                          currentTipNormalBigFishList[index]._id !== fish._id
                      "
                      :fish="fish"
                      :simple="enableSimpleMode"
                    />
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" v-if="currentTipBlueFishList[index]">
              <v-card outlined color="info" class="mt-2">
                <v-card-title>
                  <div class="d-flex justify-center">
                    <div>{{ location.subName }}</div>
                    <v-icon>{{ location.icon }}</v-icon>
                  </div>
                </v-card-title>
                <v-card-text>
                  <fish-tip
                    :fish="currentTipBlueFishList[index]"
                    :simple="enableSimpleMode"
                  />
                </v-card-text>
                <template v-if="currentTipBlueFishList[index]._id">
                  <ocean-fishing-blue-fish-tip
                    :fish-id="currentTipBlueFishList[index]._id"
                    :tip="blueFishTip2"
                  />
                  <ocean-fishing-blue-fish-tip
                    :fish-id="currentTipBlueFishList[index]._id"
                    :tip="blueFishTip3"
                  />
                </template>
              </v-card>
            </v-col>
          </v-row>
          <!--          <pre>{{ location }}</pre>-->
        </v-col>
      </v-row>
    </div>
    <div v-else-if="currentTip.id === 'point-tip'">
      <v-row>
        <v-col cols="12">
          <v-switch v-model="enableSimpleMode" label="简化模式" inset />
        </v-col>
        <v-col cols="12">
          <v-expansion-panels accordion v-model="missionOpenStatus" multiple>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <div class="d-flex align-center">任务列表</div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-subheader class="pa-0">点击以显示任务提示</v-subheader>
                <v-row no-gutters>
                  <v-col cols="12" class="my-1">
                    <v-chip
                      @click="enableTypeMission = !enableTypeMission"
                      :color="enableTypeMission ? 'primary' : ''"
                      :outlined="!enableTypeMission"
                      small
                    >
                      {{ voyage.typeMission.description }}:
                      {{ voyage.typeMission.quantity }}
                    </v-chip>
                  </v-col>
                  <v-col cols="12" class="my-1">
                    <v-chip
                      @click="enableStarMission = !enableStarMission"
                      :color="enableStarMission ? 'info' : ''"
                      :outlined="!enableStarMission"
                      small
                    >
                      {{ voyage.starMission.description }}:
                      {{ voyage.starMission.quantity }}
                    </v-chip>
                  </v-col>
                  <v-col cols="12">
                    <div>
                      <v-chip-group
                        v-model="selectedTugMissionId"
                        active-class="error"
                        column
                        dense
                      >
                        <v-chip
                          class="my-0"
                          v-for="(mission, index) in voyage.tugMission"
                          :key="index"
                          :value="mission.id"
                          :outlined="selectedTugMissionId !== mission.id"
                          small
                        >
                          {{ mission.description }}: {{ mission.quantity }}
                        </v-chip>
                      </v-chip-group>
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <div class="d-flex align-center">任务经验分享</div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card outlined class="mt-2">
                  <v-card-subtitle>
                    {{ blueFishTip3.missionTip.extra }}
                  </v-card-subtitle>
                  <v-card-text v-html="blueFishTip3.missionTip[currentLocations[2].id]">
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col
          v-for="(location, index) in currentLocations"
          :key="location.id"
          :cols="locationCols"
        >
          <point-tip
            :location="location"
            :fish-dict="fishDict"
            :spectral-trigger-fish="currentTipSpectralFishList[index]"
            :normal-big-fish="currentTipNormalBigFishList[index]"
            :type-mission="enableTypeMission ? voyage.typeMission : undefined"
            :star-mission="enableStarMission ? voyage.starMission : undefined"
            :tug-mission="selectedTugMission"
            :normal-fish-list="currentTipNormalFishLists[index]"
            :sc-fish-list="currentTipSpectralCurrentFishLists[index]"
            :enable-simple-mode="enableSimpleMode"
          />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row>
        <v-col
          v-for="(location, index) in currentLocations"
          :key="location.id"
          :cols="locationCols"
        >
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
import { OCEAN_FISHING_TIPS } from 'Data/oceanFishing'
import { mapGetters } from 'vuex'
import AchievementTip from '@/components/OceanFishing54/OceanFishingVoyage/AchievementTip'
import DataUtil from '@/utils/DataUtil'
import FishTip from '@/components/OceanFishing54/OceanFishingVoyage/FishTip'
import ImgUtil from '@/utils/ImgUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import OceanFishingBlueFishTip from '@/components/OceanFishing54/OceanFishingVoyage/OceanFishingBlueFishTip'
import OceanFishingFishList from '@/components/OceanFishingFishList/OceanFishingFishList'
import PointTip from '@/components/OceanFishing54/OceanFishingVoyage/PointTip'
import regionTerritorySpots from 'Data/fishingSpots'

export default {
  name: 'OceanFishingVoyage',
  components: {
    OceanFishingBlueFishTip,
    AchievementTip,
    PointTip,
    FishTip,
    ItemIcon,
    OceanFishingFishList,
  },
  props: {
    voyage: {
      type: Object,
      default: undefined,
    },
    fishDict: {
      type: Object,
      default: undefined,
    },
    defaultTarget: {
      type: Object,
      default: undefined,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      locationCols: 12,
      missionOpenStatus: [0],
      enableSimpleMode: false,
      enableTypeMission: true,
      enableStarMission: false,
      selectedTugMissionId: undefined,
      currentLocationIndex: 0,
      shiftFilterEnabled: true,
      tipIndex: 0,
      achievementMacro: {
        // 八爪旅人
        2563:
          '/p ---钓场一：梅尔托尔海峡南-白天---\n' +
          '/p 保存GP，随便钓\n' +
          '/p ——————————————————————————————\n' +
          '/p ---钓场二：加拉迪翁湾外海-黄昏---\n' +
          '/p 磷虾，18s+[!!]→青色章鱼*4，阴云、薄雾18s即可双提，小雨、暴雨24s再双提，其他情况平提专一再双提。拍掉碧玉头后18s即可双提。\n' +
          '/p 幻海流中用磷虾，双提0-2.8s[!!]→人鱼发*4，2.8s以上平提\n' +
          '/p ——————————————————————————————\n' +
          '/p ---钓场三：梅尔托尔海峡北-夜晚---\n' +
          '/p 石沙蚕[!!!]精准提钩→幻光海马 触发幻海流\n' +
          '/p 幻海流中用磷虾，双提5s+[!!]→幻纱披风*4\n' +
          '/p 推荐连招：双重提钩-专一垂钓-双重提钩',
        // 捕鲨人
        2564:
          '/p ---钓场一：加拉迪翁湾外海-黄昏---\n' +
          '/p 暴雨天气直接跳船。\n' +
          '/p 刺螠[!!!]→暗淡鲨，满GP可以开个专一，可能会歪到幻光巨齿鲨。满了还没遇到鲨鱼可以适当撒饵。\n' +
          '/p 幻海流中用刺螠，双提[!!!]→漏斗鲨*4/3-4s[!!]→幽灵鲨*4，平提5-6s[!!]→流银刃\n' +
          '/p ——————————————————————————————\n' +
          '/p ---钓场二：梅尔托尔海峡南-夜晚---\n' +
          '/p 恢复GP，随便钓，可以用磷虾触发一下幻海\n' +
          '/p ——————————————————————————————\n' +
          '/p ---钓场三：罗塔诺海海面-白天---\n' +
          '/p 刺螠，双提24s前[!!!]→铬铁锤头鲨*4，24s后平提专一再双提，可能会歪到幻光鲈。\n' +
          '/p 幻海流中用刺螠，双提[!!!]→处刑者*4，平提[!!]→清道夫\n' +
          '/p 推荐连招：双重提钩-专一垂钓-双重提钩',
        // 水母狂魔
        2565:
          '/p 石沙蚕，认准4s[!]→拉诺西亚水母，自信双提\n' +
          '/p 建议使用宏：\n' +
          '/p /ac 抛竿\n' +
          '/p /wait 4\n' +
          '/p /ac 双重提钩\n' +
          '/p /ac 提钩\n' +
          '/p 第一个点钓完报数，不够就跳',
        // 龙马惊神
        2566:
          '/p ---钓场一：梅尔托尔海峡南-夜晚---\n' +
          '/p 薄雾、阴云天气直接跳船。\n' +
          '/p 石沙蚕，8s-16s的[!]→蓬松海龙，12s以上可以酌情双提\n' +
          '/p 如果触发了幻海流(不触发最好)，就用刺螠[!]→高级以太药虱 以小钓大4-5s[!!]→以太海龙\n' +
          '/p ——————————————————————————————\n' +
          '/p ---钓场二：加拉迪翁湾外海-白天---\n' +
          '/p 恢复GP，随便钓\n' +
          '/p ——————————————————————————————\n' +
          '/p ---钓场三：梅尔托尔海峡北-黄昏---\n' +
          '/p 石沙蚕[!!!]精准提钩→幻光海马 触发幻海流，幻海流中双提5s以上的[!]→珊瑚海龙*4\n' +
          '/p 推荐连招：双重提钩-专一垂钓-双重提钩',
      },
      blueFishTip2: OCEAN_FISHING_TIPS.tip2,
      blueFishTip3: OCEAN_FISHING_TIPS.tip3,
    }
  },
  computed: {
    selectedTugMission() {
      return this.voyage.tugMission.find(
        mission => mission.id === this.selectedTugMissionId
      )
    },
    tips() {
      return [
        {
          type: 'item',
          id: 'fish-list',
          icon: DataUtil.iconIdToClass(24),
          name: '鱼列表',
        },
        {
          type: 'item',
          id: 'fish-tip',
          icon: DataUtil.iconIdToClass(60034),
          name: '稀有鱼',
        },
        {
          type: 'achievement',
          id: 'point-tip',
          iconUrl: ImgUtil.getImgUrl('ocean-fishing-score-achievement-40x40.webp'),
          name: '高分鱼',
        },
        ...(this.voyage?.targets
          ?.filter(target => target.type === 'achievement' && !target.nonTipOptions)
          ?.map(achievement => {
            return {
              type: 'achievement',
              id: achievement.id,
              icon: achievement.icon,
              name: achievement.name,
              iconUrl: achievement.iconUrl,
              bonus: achievement.bonus,
              bonusRequirement: achievement.bonusRequirement,
            }
          }) ?? []),
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
        ?.territories //?.filter(it => it.id >= 3444 && it.id <= 3447)
        ?.flatMap(territory => territory.spots)
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
    currentTipSpectralCurrentFishLists() {
      return this.spectralCurrentFishingSpotIds.map((spotId, index) =>
        this.oceanFishingSpots
          ?.find(it => it.id === spotId)
          ?.fishList?.map(fishId => this.fishDict[fishId])
          ?.filter(fish =>
            this.isFishAvailableAtShift(fish, this.voyage?.voyageLocations[index].shift)
          )
      )
    },
    currentTipNormalFishLists() {
      return this.normalFishingSpotIds.map(spotId =>
        this.oceanFishingSpots
          ?.find(it => it.id === spotId)
          ?.fishList?.map(fishId => this.fishDict[fishId])
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
          ?.filter(fish => fish.fishTipType === 3)
          ?.map(fish => {
            return this.isFishAvailableAtShift(
              fish,
              this.currentLocations[locationIndex].shift
            )
              ? fish
              : null
          })
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
              this.isFishAvailableAtShift(
                fish,
                this.currentLocations[locationIndex].shift
              )
          )
      )
    },
    ...mapGetters(['getFishingSpotsName']),
  },
  watch: {
    'voyage.milliseconds'() {
      this.currentLocationIndex = 0
    },
    defaultTarget(defaultTarget) {
      if (defaultTarget == null) {
        this.tipIndex = 0
      } else if (defaultTarget.type === 'item') {
        this.tipIndex = 1
      } else if (defaultTarget.id === 2759) {
        this.tipIndex = 2
      } else {
        this.tipIndex = this.tips.length - 1
      }
    },
  },
  mounted() {
    this.onWindowResize()
  },
  methods: {
    onWindowResize() {
      this.locationCols =
        window.innerWidth < this.$vuetify.breakpoint.thresholds.sm ? 12 : 4
    },
    toggleShiftFilter() {
      this.shiftFilterEnabled = !this.shiftFilterEnabled
    },
    isFishAvailableAtShift(fish, shift) {
      return (
        fish.timeSet?.[0]?.time === 0 || !!fish.timeSet.find(it => it.time === shift + 1)
      )
    },
  },
}
</script>

<style lang="sass" scoped>
.tip-macro
  white-space: pre-wrap       /* Since CSS 2.1 */
  white-space: -moz-pre-wrap  /* Mozilla, since 1999 */
  white-space: -o-pre-wrap    /* Opera 7 */
  word-wrap: break-word       /* Internet Explorer 5.5+ */
</style>
