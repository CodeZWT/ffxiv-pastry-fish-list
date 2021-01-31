<template>
  <div>
    <!--    <pre>{{ voyage }}</pre>-->
    <div>
      <v-radio-group v-model="tipIndex" row>
        <v-radio v-for="(tip, index) in tips" :value="index" :key="index">
          <template v-slot:label>
            <item-icon :icon-class="tip.icon" :icon-url="tip.iconUrl" :type="tip.type" />
            <div>{{ tip.name }}</div>
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

      <v-expansion-panels :value="0" accordion class="my-2 rounded-lg">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="d-flex my-4" style="width: 100%">
              <div class="text-h6">
                {{ currentFishingSpot && currentFishingSpot.name }}
              </div>
              <v-icon>{{ currentFishingSpot && currentFishingSpot.icon }}</v-icon>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <ocean-fishing-fish-list
              :fish-list="currentFishList"
              weather-filter
              :weather-set="currentWeatherSet"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!--      <ocean-fishing-fish-list-->
      <!--        :fish-list="currentFishList"-->
      <!--        weather-filter-->
      <!--        :weather-set="currentWeatherSet"-->
      <!--      />-->
      <v-expansion-panels :value="0" accordion class="my-2 rounded-lg">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="d-flex my-4" style="width: 100%">
              <div class="text-h6">{{ currentFishingSpotSpectralCurrentName }}</div>
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
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-else-if="currentTip.id === 'fish-tip'">
      <v-row>
        <v-col
          v-for="(location, index) in currentLocations"
          :key="index"
          cols="12"
          md="4"
        >
          <v-row no-gutters>
            <v-col cols="12">
              <v-card outlined class="mt-2">
                <v-card-title>
                  <div class="d-flex justify-center">
                    <div>{{ location.name }}</div>
                    <v-icon>{{ location.icon }}</v-icon>
                  </div>
                </v-card-title>
                <v-card-text>
                  <div v-if="currentTipSpectralFishList[index]">
                    <fish-tip :fish="currentTipSpectralFishList[index]" />
                  </div>
                  <div v-if="currentTipNormalBigFishList[index]">
                    <div class="d-flex flex-column">
                      <fish-tip :fish="currentTipNormalBigFishList[index]" />
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" v-if="currentTipBlueFishList[index]">
              <v-card outlined color="info" class="mt-2">
                <v-card-title>
                  <div class="d-flex justify-center">
                    <div>{{ location.name }}幻海流</div>
                    <v-icon>{{ location.icon }}</v-icon>
                  </div>
                </v-card-title>
                <v-card-text>
                  <fish-tip :fish="currentTipBlueFishList[index]" />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <!--          <pre>{{ location }}</pre>-->
        </v-col>
      </v-row>
    </div>
    <div v-else-if="currentTip.id === 2562">
      <v-row>
        <v-col
          v-for="(location, index) in currentLocations"
          :key="location.id"
          cols="12"
          md="4"
        >
          <point-tip
            :location="location"
            :fish-dict="fishDict"
            :spectral-trigger-fish="currentTipSpectralFishList[index]"
          />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row>
        <v-col
          v-for="(location, index) in currentLocations"
          :key="location.id"
          cols="12"
          md="4"
        >
          <achievement-tip
            :achievement-id="currentTip.id"
            :location="location"
            :normal-fish="currentTipFish[index]"
            :spectral-current-fish="currentTipSpectralCurrentFish[index]"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-expansion-panels accordion>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <div class="d-flex align-center">
                  {{ currentTip.name }}宏
                  <click-helper @click.stop :copy-text="achievementMacro[currentTip.id]">
                    <v-btn text icon small :title="$t('list.item.copyHint')">
                      <v-icon small>mdi-content-copy</v-icon>
                    </v-btn>
                  </click-helper>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-card outlined class="mt-2">
                  <v-card-text>
                    <pre class="tip-macro">{{ achievementMacro[currentTip.id] }}</pre>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import OceanFishingFishList from '@/components/OceanFishingFishList/OceanFishingFishList'
import regionTerritorySpots from 'Data/fishingSpots'
import { mapGetters } from 'vuex'
import ItemIcon from '@/components/basic/ItemIcon'
import FishTip from '@/components/OceanFishingVoyage/FishTip'
import PointTip from '@/components/OceanFishingVoyage/PointTip'
import AchievementTip from '@/components/OceanFishingVoyage/AchievementTip'
import ClickHelper from '@/components/basic/ClickHelper'

export default {
  name: 'OceanFishingVoyage',
  components: {
    ClickHelper,
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
  },
  data() {
    return {
      currentLocationIndex: 0,
      shiftFilterEnabled: true,
      tipIndex: 0,
      achievementMacro: {
        // 八爪旅人
        '2563':
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
        '2564':
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
        '2565':
          '/p 石沙蚕，认准4s[!]→拉诺西亚水母，自信双提\n' +
          '/p 建议使用宏：\n' +
          '/p /ac 抛竿\n' +
          '/p /wait 4\n' +
          '/p /ac 双重提钩\n' +
          '/p /ac 提钩\n' +
          '/p 第一个点钓完报数，不够就跳',
        // 龙马惊神
        '2566':
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
    }
  },
  computed: {
    tips() {
      return [
        {
          type: 'item',
          id: 'fish-list',
          icon: 'bg-000024',
          name: '鱼列表',
        },
        {
          type: 'item',
          id: 'fish-tip',
          icon: 'bg-060034',
          name: '幻光鱼/绿鱼/蓝鱼',
        },
        ...(this.voyage?.targets
          ?.filter(target => target.type === 'achievement')
          ?.map(achievement => {
            return {
              type: 'achievement',
              id: achievement.id,
              icon: achievement.icon,
              name: achievement.name,
              iconUrl: achievement.iconUrl,
              bonus: achievement.bonus,
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
        ?.territories?.filter(it => it.id >= 3444 && it.id <= 3447)
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
            return !fish.time ||
              fish.time === this.currentLocations[locationIndex].shift + 1
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
              (!fish.time || fish.time === this.currentLocations[locationIndex].shift + 1)
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
      } else if (defaultTarget.id === 2562) {
        this.tipIndex = 2
      } else {
        this.tipIndex = this.tips.length - 1
      }
    },
  },
  methods: {
    toggleShiftFilter() {
      this.shiftFilterEnabled = !this.shiftFilterEnabled
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
