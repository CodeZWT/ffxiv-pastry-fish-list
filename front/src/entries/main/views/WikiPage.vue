<template>
  <div v-resize="onWindowResize" class="d-flex">
    <v-navigation-drawer
      v-if="showMapMenu || !isMobile"
      :value="showMapMenu || !isMobile"
      @input="showMapMenu = $event"
      :fixed="isMobile"
      :class="{
        'nav-bar--pc': !isMobile,
      }"
      :temporary="isMobile"
      z-index="1"
      hide-overlay
    >
      <div class="fill-height">
        <v-sheet class="pa-1 primary">
          <div class="d-flex align-center">
            <v-btn text icon @click="type = undefined">
              <v-icon> {{ mdiHome }} </v-icon>
            </v-btn>
            <rc-text-field
              v-model="searchText"
              :label="$t('wiki.searchTitle')"
              flat
              solo-inverted
              hide-details
              clearable
            ></rc-text-field>
          </div>
        </v-sheet>
        <div class="d-flex align-center px-1">
          <v-btn
            small
            icon
            text
            class="ml-1"
            @click="showBulkCompleteCheckbox = !showBulkCompleteCheckbox"
            :title="showBulkCompleteCheckbox ? '关闭批量模式' : '开启批量模式'"
          >
            <new-feature-mark id="WikiBulkButton-V.0.6.6-1">
              <v-icon v-if="!showBulkCompleteCheckbox" small>
                {{ mdiCheckboxMultipleBlankOutline }}
              </v-icon>
              <v-icon v-else small>{{ mdiCheckboxMultipleMarked }}</v-icon>
            </new-feature-mark>
          </v-btn>
          <v-btn small icon text class="ml-2" @click="collapseAll">
            <v-icon small>{{ mdiArrowCollapseVertical }}</v-icon>
          </v-btn>
          <v-spacer />
          <v-btn-toggle
            v-model="mode"
            color="primary"
            class="my-1"
            mandatory
            background-color="transparent"
            dense
          >
            <v-btn
              :value="mode.value"
              v-for="(mode, index) in modes"
              :key="index"
              @click="clearCurrentStatus(mode)"
            >
              <div class="d-flex align-center">
                <div :class="mode.icon"></div>
                <!--                <span>{{ mode.title }}</span>-->
              </div>
            </v-btn>
          </v-btn-toggle>
        </div>
        <v-divider />
        <v-card-text
          :class="{
            'spot-list': true,
            'spot-list--pc-web': !isMobile && !isElectron,
            'spot-list--pc-electron': !isMobile && isElectron && !original,
            'spot-list--pc-electron-original': !isMobile && isElectron && original,
            'spot-list--mobile-web': isMobile && !isElectron,
            'spot-list--mobile-electron': isMobile && isElectron && !original,
            'spot-list--mobile-electron-original': isMobile && isElectron && original,
          }"
        >
          <v-treeview
            v-show="mode === 'normal'"
            ref="normalSpotMenu"
            v-model="normalCompletedSpotFishIds"
            :items="regionTerritorySpots"
            item-key="id"
            hoverable
            dense
            activatable
            :selectable="showBulkCompleteCheckbox"
            :search="searchText"
            :filter="spotMenuSearchFn"
            :open.sync="openedItems"
            selected-color="primary"
            color="select"
            @update:active="onMenuItemActive"
          >
            <template v-if="!showBulkCompleteCheckbox" v-slot:prepend="{ selected }">
              <v-icon>
                {{ selected ? mdiCheck : '' }}
              </v-icon>
            </template>
          </v-treeview>
          <v-treeview
            v-show="mode === 'spear'"
            ref="spearSpotMenu"
            v-model="spearCompletedSpotFishIds"
            :items="spearRegionTerritorySpots"
            item-key="id"
            hoverable
            dense
            activatable
            :selectable="showBulkCompleteCheckbox"
            :search="searchText"
            :filter="spotMenuSearchFn"
            :open.sync="spearOpenedItems"
            selected-color="primary"
            color="select"
            @update:active="onMenuItemActive"
          >
            <template v-if="!showBulkCompleteCheckbox" v-slot:prepend="{ selected }">
              <v-icon>
                {{ selected ? mdiCheck : '' }}
              </v-icon>
            </template>
          </v-treeview>
        </v-card-text>
      </div>
    </v-navigation-drawer>
    <div
      :class="{
        'd-flex': true,
        'wiki-content': true,
        'wiki-content--pc-web': !isMobile && !isElectron,
        'wiki-content--pc-electron': !isMobile && isElectron && !original,
        'wiki-content--pc-electron-original': !isMobile && isElectron && original,
        'wiki-content--mobile-web': isMobile && !isElectron,
        'wiki-content--mobile-electron': isMobile && isElectron && !original,
        'wiki-content--mobile-electron-original': isMobile && isElectron && original,
      }"
      id="wiki-right-content"
    >
      <div
        :style="`flex: 1 1 ${mainPaneFlexPercentage}%; overflow: auto`"
        v-show="!rightPaneFullScreen || type !== 'fish'"
        ref="fishPageScrollTarget"
      >
        <div
          v-if="
            !type ||
              type === 'region' ||
              (type === 'territory' && isOceanFishingTerritory)
          "
          class="fill-height d-flex flex-column align-content-space-between grid-content"
        >
          <!--  show empty / region view  -->
          <div>
            <v-sheet outlined class="pa-4">
              <div class="text-h5">成就计数</div>
              <div class="text-subtitle-2">鼠标悬停成就数字可查看说明</div>
              <div v-if="isMobile" class="text-subtitle-2">
                点击上方
                <v-icon small>{{ mdiMap }}</v-icon>
                按钮显示钓场选择菜单
              </div>
              <v-divider />
              <v-subheader v-if="achievementInfo.iCatchThat.cn">
                {{
                  `${achievementInfo.iCatchThat.name}（${CN_PATCH_VERSION}最大值${achievementInfo.iCatchThat.cn}，${GLOBAL_PATCH_VERSION}最大值${counts.iCatchThat.total}）`
                }}
              </v-subheader>
              <v-subheader v-else>
                {{ achievementInfo.iCatchThat.name }}
              </v-subheader>
              <v-row>
                <v-col>
                  <achievement-progress
                    :value="counts.iCatchThat.record"
                    :total="counts.iCatchThat.total"
                    :ticks="counts.iCatchThat.ticks"
                  />
                </v-col>
              </v-row>
              <v-subheader>{{ achievementInfo.goBigOrGoHome.name }}</v-subheader>
              <v-row>
                <v-col>
                  <achievement-progress
                    :value="counts.goBigOrGoHome.record"
                    :total="counts.goBigOrGoHome.total"
                    :ticks="counts.goBigOrGoHome.ticks"
                  />
                </v-col>
              </v-row>
              <v-subheader v-if="achievementInfo.goBigFarFromHome.cn">
                {{
                  `${achievementInfo.goBigFarFromHome.name}（${CN_PATCH_VERSION}最大值${achievementInfo.goBigFarFromHome.cn}，${GLOBAL_PATCH_VERSION}最大值${counts.goBigFarFromHome.total}）`
                }}
              </v-subheader>
              <v-subheader v-else>
                {{ achievementInfo.goBigFarFromHome.name }}
              </v-subheader>
              <v-row>
                <v-col>
                  <achievement-progress
                    :value="counts.goBigFarFromHome.record"
                    :total="counts.goBigFarFromHome.total"
                    :ticks="counts.goBigFarFromHome.ticks"
                  />
                </v-col>
              </v-row>

              <v-subheader v-if="achievementInfo.noRiverWideEnough.cn">
                {{
                  `${achievementInfo.noRiverWideEnough.name}（${CN_PATCH_VERSION}最大值${achievementInfo.noRiverWideEnough.cn}，${GLOBAL_PATCH_VERSION}最大值${counts.noRiverWideEnough.total}）`
                }}
              </v-subheader>
              <v-subheader v-else>
                {{ achievementInfo.noRiverWideEnough.name }}
              </v-subheader>
              <v-row>
                <v-col>
                  <achievement-progress
                    :value="counts.noRiverWideEnough.record"
                    :total="counts.noRiverWideEnough.total"
                    :ticks="counts.noRiverWideEnough.ticks"
                  />
                </v-col>
              </v-row>
              <!-- TODO recover this -->
              <v-btn
                v-if="isElectron"
                color="primary"
                @click="showSyncDialog = true"
                block
                class="mt-2"
              >
                <v-icon left>{{ mdiSync }}</v-icon>
                同步游戏数据
              </v-btn>
            </v-sheet>
          </div>
        </div>
        <div v-else-if="type === 'territory'" class="grid-content">
          <!--  show territory view  -->
          <eorzea-simple-map
            ref="simpleMap"
            :id="currentMapInfo.mapFileId"
            :size-factor="currentMapInfo.size_factor"
            :fishing-spots="currentSpotList"
            :show-fishing-range-helper="mode === 'normal'"
          />
        </div>
        <div
          v-else-if="type === 'spot' || type === 'fish'"
          :class="{
            'grid-content': true,
            'grid-content--web': !isElectron,
          }"
        >
          <!--  show spot view  -->
          <wiki-spot-detail
            :mode="mode"
            :is-mobile="isMobile"
            :is-electron="isElectron"
            :current-spot-id="currentSpotId"
            :current-map-info="currentMapInfo"
            :lazy-transformed-fish-dict="lazyTransformedFishDict"
            :fish-list-time-part="fishListTimePart"
            :fish-list-weather-change-part="fishListWeatherChangePart"
            @fish-selected="onFishClicked($event)"
          />
        </div>
        <div
          :class="{
            'grid-content': true,
            'grid-content--web': !isElectron,
          }"
          v-else-if="type === 'fishGroupSelection'"
        >
          <v-sheet>
            <div class="text-h6">
              由于不同钓场的天气或钓法不同，此鱼有多个钓场分组，请选择一组钓场显示对应内容。
            </div>
            <v-divider />
            <v-list>
              <v-list-item
                v-for="fish in currentFishList"
                :key="fish._id"
                @click="toFishPageOfFishLocationPage(fish._id)"
              >
                <item-icon :icon-class="fish.icon"></item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ fish.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ fish.fishingSpots.map(it => it.fishingSpotName).join('，') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-sheet>
        </div>
      </div>

      <div
        :class="{
          'detail-part': true,
        }"
        v-if="type === 'fish' && !isOceanFishingSpot"
      >
        <fish-detail
          ref="wikiFishDetail"
          :fish="currentFish"
          :forceShowComponents="forceShowComponents"
          :show-fishing-range-helper="mode === 'normal'"
          show-close
          @close="closeFishDetailPage"
        />
      </div>
    </div>
    <rc-dialog v-model="showSyncDialog" max-width="320" scrollable persistent>
      <v-card>
        <!-- patch update wait note -->
        <!--        <v-alert outlined type="warning" border="left">-->
        <!--          更新国服5.5后，渔捞与同步功能不可用，请耐心等待自动更新。-->
        <!--        </v-alert>-->
        <v-card-title>数据同步</v-card-title>
        <v-card-subtitle v-if="!isElectron">
          数据同步为鱼糕桌面版功能，左侧可下载桌面版。
        </v-card-subtitle>
        <v-card-text v-if="syncStatus === 'not-start'">
          <item-icon :icon-class="iconIdToClass(24)" class="float-left" />
          <div>
            同步游戏内钓鱼笔记数据，当前已完成数据将会被
            <span class="font-weight-bold error--text"> 完全覆盖 </span>
            ，请注意！
          </div>
          <div>
            ※ <span class="text-subtitle-1 font-weight-bold">国际服</span>
            用户请在
            <span class="text-subtitle-1 font-weight-bold">渔捞</span>
            切换至国际服模式
          </div>
          <div>※固定列表不受影响</div>
          <div>※已完成的鱼将会从闹钟列表中移除</div>
        </v-card-text>
        <v-card-text v-if="syncStatus === 'waiting'" class="d-flex align-center">
          <v-progress-circular indeterminate />
          <span class="ml-2 text-h6"> 开始同步，请重新进入大厅登录角色（小退） </span>
        </v-card-text>
        <v-card-text v-if="syncStatus === 'waiting'" class="v-label">
          <v-expansion-panels :value="undefined" accordion class="my-2 rounded-lg">
            <v-expansion-panel>
              <v-expansion-panel-header>
                若登录游戏后仍未同步成功
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div>
                  若登录游戏后仍未同步成功，请打开左侧<v-icon small>{{ mdiFish }}</v-icon
                  >渔捞，点击右上角<v-icon small>{{ mdiCog }}</v-icon
                  >进入设置，按照黄字提示操作。
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-text v-if="syncStatus === 'finished'">
          <v-icon>{{ mdiCheckCircle }}</v-icon>
          <span class="ml-2"> 同步完成，请点击关闭退出同步对话框。 </span>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <!--          <div class="d-flex flex-column flex-fill">-->
          <v-btn
            :disabled="syncStatus !== 'not-start' && isElectron"
            class="mt-2"
            color="primary"
            @click="syncStatus = 'waiting'"
          >
            {{ syncStatus === 'not-start' ? '开始同步' : '同步中' }}
          </v-btn>
          <v-btn class="mt-2" color="default" @click="onSyncClose">
            {{
              syncStatus === 'finished'
                ? $t('general.dialog.close')
                : $t('general.dialog.cancel')
            }}
          </v-btn>
          <!--          </div>-->
        </v-card-actions>
      </v-card>
    </rc-dialog>
  </div>
</template>

<script>
import { CN_PATCH_VERSION, GLOBAL_PATCH_VERSION } from 'Data/constants'
import { OCEAN_FISHING_FISH } from 'Data/oceanFishing'
import { flow, groupBy, mapValues } from 'lodash/fp'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import {
  mdiArrowCollapseVertical,
  mdiCheck,
  mdiCheckCircle,
  mdiCheckboxMultipleBlankOutline,
  mdiCheckboxMultipleMarked,
  mdiCog,
  mdiFish,
  mdiHome,
  mdiMap,
  mdiSync,
} from '@mdi/js'
import AchievementProgress from '@/components/AchievementProgress'
import DATA_CN from 'Data/translation'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import FISH_PARAMETER from 'Data/fishParameter'
import FIX from 'Data/fix'
import FishDetail from '@/components/FishDetail'
import ImgUtil from '@/utils/ImgUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import NewFeatureMark from '@/components/basic/NewFeatureMark'
import PageMixin from '@/components/OceanFishingFishList/PageMixin'
import PinyinMatch from 'pinyin-match'
import RcDialog from '@/components/basic/RcDialog'
import RcTextField from '@/components/basic/RcTextField'
import SPEAR_FISHING_ITEM from 'Data/spearFishingItem'
import TreeModel from 'tree-model'
import WikiSpotDetail from '@/components/WikiSpotDetail'
import _ from 'lodash'
import normSpots from 'Data/fishingSpots'
import placeNames from 'Data/placeNames'

export default {
  name: 'WikiPage',
  mixins: [PageMixin],
  components: {
    WikiSpotDetail,
    RcTextField,
    RcDialog,
    AchievementProgress,
    ItemIcon,
    NewFeatureMark,
    FishDetail,
    EorzeaSimpleMap,
    // GridLayout: VueGridLayout.GridLayout,
    // GridItem: VueGridLayout.GridItem,
  },
  props: [
    'original',
    'lazyTransformedFishDict',
    'fishListTimePart',
    'now',
    'fishListWeatherChangePart',
    'extraFishListTimePart',
    'lazyFishSourceList',
    'lazyTransformedFishList',
    'toggleMapMenu',
  ],
  data: vm => ({
    mdiCheck,
    mdiHome,
    mdiCheckboxMultipleBlankOutline,
    mdiCheckboxMultipleMarked,
    mdiArrowCollapseVertical,
    mdiMap,
    mdiSync,
    mdiFish,
    mdiCog,
    mdiCheckCircle,
    CN_PATCH_VERSION: CN_PATCH_VERSION,
    GLOBAL_PATCH_VERSION: GLOBAL_PATCH_VERSION,
    currentFishIds: [],
    spearSpots: [],
    achievementInfo: {
      iCatchThat: { name: '专研钓鱼笔记' },
      goBigOrGoHome: { name: '愿者上钩' },
      goBigFarFromHome: { name: '净界太公' },
      noRiverWideEnough: { name: '太公仙路' }, // , cn: 243
    },
    showBulkCompleteCheckbox: false,
    modes: [
      { title: vm.$t('wiki.mode.normal'), icon: 'fishing-icon', value: 'normal' },
      { title: vm.$t('wiki.mode.spear'), icon: 'spear-icon', value: 'spear' },
    ],
    type: undefined,
    currentTerritoryId: -1,
    currentSpotId: -1,
    currentFishId: -1,
    // completedSpots: [],
    // regionTerritorySpots: [],
    openedItems: [],
    normalOpenedItems: [],
    searchOpenedItems: [],
    spearOpenedItems: [],
    spearNormalOpenedItems: [],
    spearSearchOpenedItems: [],
    spotDict: {},
    territoryDict: {},
    isSettingMode: false,
    searching: false,
    lazySearchText: '',
    activeItem: undefined,
    preActiveItem: undefined,
    isDetailFishWindowOpen: false,
    showMapMenu: true,
    root: undefined,
    searchResults: { text: '', nodeIds: [] },
    forceShowComponents: undefined,
    isElectron: DevelopmentModeUtil.isElectron(),
    showSyncDialog: false,
    syncStatus: 'not-start',
    rightPaneFullScreen: false,
  }),
  computed: {
    mode() {
      return this.typeOfSpot(this.currentSpotId)
    },
    currentFishList() {
      return this.currentFishIds.map(fishId => {
        return this.lazyTransformedFishDict[fishId]
      })
    },
    rightPanePercentage() {
      return Math.min(0.9, this.rightPanePercentageV2 + 0.1)
    },
    mainPaneFlexPercentage() {
      return Math.floor((100 * (1 - this.rightPanePercentage)) / this.rightPanePercentage)
    },
    currentRegionTerritorySpots() {
      return this.mode === 'normal'
        ? this.regionTerritorySpots
        : this.spearRegionTerritorySpots
    },
    regionTerritorySpots() {
      return this.loadWikiDataOfType('normal')
    },
    spearRegionTerritorySpots() {
      return this.loadWikiDataOfType('spear')
    },
    isOceanFishingTerritory() {
      return [3444, 3445, 3446, 3447, 3641, 3642, 3643].includes(this.currentTerritoryId)
    },
    isOceanFishingSpot() {
      return DataUtil.isOceanFishingSpot(this.currentSpotId)
    },
    // [TODO-TREE-PATH-AUTO-OPEN]
    // expandAllInSearching() {
    //   return this.searching && this.searchResults.nodeIds.length > 0 && this.searchResults.nodeIds.length < 10
    // },
    searchText: {
      get() {
        return this.lazySearchText
      },
      set(newSearchText) {
        this.debouncedSearchTextUpdater(newSearchText)
      },
    },
    currentMapInfo() {
      const currentSpot = _.first(this.currentSpotList)
      return {
        ...currentSpot,
        id: currentSpot._id,
        fishSpotPositionText: DataUtil.toPositionText(currentSpot),
        size_factor: currentSpot.size_factor,
        mapFileId: currentSpot.mapFileId,
      }
    },
    currentSpotList() {
      if (this.currentSpotId === -1 && this.currentTerritoryId === -1) {
        return []
      }
      switch (this.type) {
        case 'territory':
          return this.territoryDict[`${this.mode}-${this.currentTerritoryId}`].map(
            this.assembleSpot
          )
        case 'fish':
        case 'spot':
          return [this.assembleSpot(this.currentSpotId)]
        default:
          return []
      }
    },
    normalCompletedSpotFishIds: {
      get() {
        return this.getSpotsOfType('normal')
      },
      set(newSpotFishIds) {
        const oldSpotFishIds = this.normalCompletedSpotFishIds
        this.updateCompleted(oldSpotFishIds, newSpotFishIds)
      },
    },
    spearCompletedSpotFishIds: {
      get() {
        return this.getSpotsOfType('spear')
      },
      set(newSpotFishIds) {
        const oldSpotFishIds = this.spearCompletedSpotFishIds
        this.updateCompleted(oldSpotFishIds, newSpotFishIds)
      },
    },
    currentFish() {
      return DataUtil.assembleFishForDetail(
        this.currentFishId,
        this.allFish,
        this.lazyTransformedFishDict,
        this.fishListTimePart,
        this.extraFishListTimePart,
        this.fishListWeatherChangePart
      )
    },
    currentPatchFishIdSet() {
      return new Set(
        _.uniq(Object.keys(this.allFish).map(it => DataUtil.toItemId(it)))
          .concat(Object.keys(OCEAN_FISHING_FISH))
          .map(it => +it)
      )
    },
    allCompletedFishOfCurrentPatch() {
      return this.allCompletedFish.filter(fishId => {
        return this.currentPatchFishIdSet.has(fishId)
      })
    },
    fishCaughtCnt() {
      return this.allCompletedFishOfCurrentPatch.length
    },
    fishList() {
      return Object.values(this.allFish)
        .filter(it => it.type !== 'test')
        .map(it => ({ ...it, _id: DataUtil.toItemId(it._id) }))
    },
    counts() {
      // const globalNormalFish = 16
      // const globalBigFish = 11
      const podSpearFishDict = flow(
        groupBy(it => it._id),
        mapValues(it => it[0])
      )(this.fishList)
      const podSpearFish = Object.values(podSpearFishDict)
      const oceanFish = Object.values(OCEAN_FISHING_FISH)

      // let podNormalFish =[], podNormalFish =[],  podNormalFish =[], spearFish = [], podFish = []
      const iCatchThat = {
        record: this.allCompletedFishOfCurrentPatch.filter(
          it =>
            FISH_PARAMETER.find(param => param.Item === it)?.IsInLog ||
            SPEAR_FISHING_ITEM.find(param => param.Item === it)?.IsVisible
        ).length,
        // ticks: [
        //   // { title: '捕鱼大师戒指', cnt:  160   , itemId: 6137         },
        //   { title: '赐福渔灯钓竿', cnt: 460, itemId: 16968 },
        //   { title: '赐福渔采钓竿', cnt: 780, itemId: 24831 },
        //   { title: '5.5璀璨钓竿', cnt: 1140, itemId: 33358 },
        // ],
        ticks: [1731, 2176, 2832].map(achievementId => {
          const achievement = FIX.ACHIEVEMENT[achievementId]
          return {
            ...achievement,
            item: achievement.item
              ? {
                  id: achievement.item,
                  title: achievement.itemTitle,
                  iconUrl: ImgUtil.getIconUrl(achievement.itemIcon, true),
                }
              : undefined,
          }
        }),
        // .concat({
        //   data: [this.achievementInfo.iCatchThat.cn],
        //   name_chs: `国服${CN_PATCH_VERSION}版本最大值`,
        //   description: `国服${CN_PATCH_VERSION}版本共有${this.achievementInfo.iCatchThat.cn}条鱼属于成就记录范围。`,
        //   type: 'maxTip',
        //   nextLine: true,
        // }),
        total: podSpearFish.length + oceanFish.length, // + globalNormalFish + globalBigFish,
      }

      const goBigOrGoHomeFishIds = podSpearFish
        .filter(it => DATA_CN.BIG_FISH.includes(it._id) && it.patch < 5)
        .map(it => it._id)
      const goBigOrGoHome = {
        record: this.allCompletedFishOfCurrentPatch.filter(it =>
          goBigOrGoHomeFishIds.includes(it)
        ).length,
        // 鱼太公 烟波钓徒
        ticks: [1033, 2245].map(achievementId => FIX.ACHIEVEMENT[achievementId]),
        total: goBigOrGoHomeFishIds.length,
      }
      const goBigFarFromHomeFishIds = podSpearFish
        .filter(it => DATA_CN.BIG_FISH.includes(it._id) && it.patch >= 5)
        .map(it => it._id)
      const goBigFarFromHome = {
        record: this.allCompletedFishOfCurrentPatch.filter(it =>
          goBigFarFromHomeFishIds.includes(it)
        ).length,
        ticks: [2833].map(achievementId => FIX.ACHIEVEMENT[achievementId]),
        // .concat({
        //   data: [this.achievementInfo.goBigFarFromHome.cn],
        //   name_chs: `国服${CN_PATCH_VERSION}版本最大值`,
        //   description: `国服${CN_PATCH_VERSION}版本共有${this.achievementInfo.goBigFarFromHome.cn}条鱼属于成就记录范围。`,
        //   type: 'maxTip',
        //   nextLine: false,
        // }),
        total: goBigFarFromHomeFishIds.length, //+ globalBigFish,
      }

      const noRiverWideEnough = {
        record: this.allCompletedFishOfCurrentPatch.filter(
          it => goBigOrGoHomeFishIds.includes(it) || goBigFarFromHomeFishIds.includes(it)
        ).length,
        ticks: [2834].map(achievementId => FIX.ACHIEVEMENT[achievementId]),
        // .concat({
        //   data: [this.achievementInfo.noRiverWideEnough.cn],
        //   name_chs: `国服${CN_PATCH_VERSION}版本最大值`,
        //   description: `国服${CN_PATCH_VERSION}版本共有${this.achievementInfo.noRiverWideEnough.cn}条鱼属于成就记录范围。`,
        //   type: 'maxTip',
        //   nextLine: true,
        // }),
        total: goBigOrGoHomeFishIds.length + goBigFarFromHomeFishIds.length,
      }
      return _.mapValues(
        {
          iCatchThat,
          goBigOrGoHome,
          goBigFarFromHome,
          noRiverWideEnough,
        },
        it => ({ ...it, percentage: ((it.record / it.total) * 100).toFixed(0) })
      )
      //
      // Object.values(podSpearTestFish).forEach(fish => {
      //   if (fish.type !== 'test') {
      //     if (fish.tug == null) {
      //       spearFish.push({ ...fish, _id: DataUtil.toItemId(fish._id) })
      //     } else {
      //       podFish.push({ ...fish, _id: DataUtil.toItemId(fish._id) })
      //     }
      //   }
      // })
      // podFish = Object.values(_.mapValues(_.groupBy(podFish, '_id'), it => it[0]))
      // // const fishCompleted = this.getFishCompleted(fish.id)
      // const achievement204 = {record: }
      // podFish.forEach(podFishId => {
      //   const isBigFish = DATA_CN.BIG_FISH.includes(fish.id)
      //   const isLivingLegend = DATA_CN.LIVING_LEGENDS.includes(fish.id)
      //   if (isBigFish)
      // })
    },
    fishTotal() {
      return (
        _.uniq(Object.keys(this.allFish).map(id => DataUtil.toItemId(id))).length +
        Object.keys(OCEAN_FISHING_FISH).length -
        (DevelopmentModeUtil.isTest() ? 2 : 0)
      )
    },
    ...mapState({ allFish: 'fish' }),
    ...mapGetters([
      'getFishingSpotsName',
      'getFishingSpot',
      'getFishCompleted',
      'allCompletedFish',
      'isRoseMode',
      'rightPanePercentageV2',
    ]),
  },
  watch: {
    '$route.query': {
      handler(query) {
        console.debug('watch query', query)
        if (!query.spotId && query.fishId) {
          this.showSpotWithFish(query.fishId)
        } else {
          this.showSpot(query.spotId, query.fishId)
        }
      },
      immediate: true,
    },

    type(type) {
      if (type === 'fish') {
        this.scrollToTop()
      }
    },
    toggleMapMenu() {
      this.showMapMenu = !this.showMapMenu
    },
    currentRegionTerritorySpots(regionTerritorySpots) {
      if (regionTerritorySpots && regionTerritorySpots.length > 0) {
        this.root = new TreeModel().parse({
          name: 'root',
          children: this.regionTerritorySpots,
        })
      }
    },
  },
  created() {
    console.debug('nav with query', this.$route.query)
    this.openedItems = this.normalOpenedItems
    this.spearOpenedItems = this.spearNormalOpenedItems
    this.spearSpots = FIX.SPEAR_REGION_TERRITORY_POINT.flatMap(it =>
      it.territories.flatMap(t => t.spots.map(s => s.id))
    )

    this.debouncedSearchTextUpdater = _.debounce(text => {
      const t = text == null ? '' : text
      this.updateOpenItems(t, this.lazySearchText)
      this.lazySearchText = t
    }, 500)

    window.electron?.ipcRenderer
      ?.on('showSpotPage', (event, spotId) => {
        this.showSpot(spotId, 'normal')
      })
      ?.on('playerSetup', (event, data) => {
        if (this.syncStatus === 'waiting') {
          this.syncFishCompleted(data.caughtFishList)
          this.syncStatus = 'finished'
        }
      })
  },
  mounted() {
    this.throttledResizeFn = _.throttle(this.resizeInternal, 100)
    this.onWindowResize()
    this.$watch(
      function() {
        return JSON.stringify([this.currentSpotId, this.currentFishId])
      },
      function(val) {
        // console.log(val)
        const [spotId, fishId] = JSON.parse(val)
        if (
          spotId === +(this.$route.query.spotId ?? -1) &&
          fishId === +(this.$route.query.fishId ?? -1)
        ) {
          return
        }
        if (spotId > 0) {
          if (fishId > 0) {
            if (!this.isOceanFishingSpot) {
              this.$emit('fish-selected', { fishId: fishId })
            }
            this.$router.push({
              name: 'WikiPage',
              query: { spotId: spotId > 0 ? spotId : undefined, fishId: fishId },
            })
          } else {
            this.$router.push({ name: 'WikiPage', query: { spotId } })
          }
        }
      }
    )
  },
  methods: {
    typeOfSpot(spotId) {
      return this.spearSpots.includes(+spotId) ? 'spear' : 'normal'
    },
    resizeInternal() {
      // resizePaneInfos
      // this.rightPaneSize = resizePaneInfos[1].size
      this.$refs.wikiFishDetail?.resize()
    },
    onWindowResize() {
      this.rightPaneFullScreen =
        window.innerWidth < this.$vuetify.breakpoint.thresholds.md
      setTimeout(() => {
        this.throttledResizeFn()
      }, 500)
    },
    iconIdToClass: DataUtil.iconIdToClass,
    scrollToTop() {
      document
        .getElementById('wiki-right-content')
        .scroll({ top: 0, left: 0, behavior: 'auto' })
    },
    closeFishDetailPage() {
      this.currentFishId = -1
      this.type = 'spot'
    },
    showSpot(spotId, fishId) {
      if (DataUtil.isDiademSpot(spotId)) {
        return
      } else if (spotId > 0) {
        this.currentSpotId = +(spotId ?? -1)
        this.currentFishId = +(fishId ?? -1)
        this.type =
          this.currentSpotId !== -1
            ? this.currentFishId !== -1
              ? 'fish'
              : 'spot'
            : undefined
      }
    },
    showSpotWithFish(fishIdParam) {
      // case 1: 12345 -> 12345
      // case 2: 12345 -> 12345 -> [1110123456, 1120123456]
      // case 3: 111012345

      const fishIdNumber = +(fishIdParam ?? -1)
      if (fishIdNumber === -1) {
        return
      }
      const itemId = DataUtil.toItemId(fishIdNumber)
      let showSpotFish = false
      if (itemId !== fishIdNumber) {
        // redirect with locationFishId
        // case 3
        showSpotFish = true
      }

      let spotId = undefined
      let wikiIds = undefined

      if (!showSpotFish) {
        wikiIds = DataUtil.FISH_ID_TO_WIKI_IDS[fishIdNumber]
        showSpotFish = wikiIds == null
      }

      if (showSpotFish) {
        // case 1, case 3
        const assembledFish = this.lazyTransformedFishDict[fishIdNumber]
        const spots = assembledFish.fishingSpots
        spotId = spots[0].fishingSpotId
        // mode = assembledFish.type
        this.$router.replace({
          name: 'WikiPage',
          query: { spotId, fishId: fishIdNumber },
        })
      } else {
        // case 2
        this.type = 'fishGroupSelection'
        this.currentSpotId = -1
        this.currentFishId = -1
        this.currentFishIds = _.uniq(wikiIds.map(wikiId => +wikiId.split('-')[3]))
      }
    },
    clearCurrentStatus(mode) {
      if (mode !== this.mode) {
        this.type = undefined
        this.currentTerritoryId = -1
        this.currentSpotId = -1
        this.currentFishId = -1
        this.openedItems = this.normalOpenedItems = []
        this.searchOpenedItems = []
        this.spearOpenedItems = this.spearNormalOpenedItems = []
        this.spearSearchOpenedItems = []
      }
    },
    getSpotsOfType(type) {
      return this.allCompletedFishOfCurrentPatch.flatMap(fishId => {
        const wikiIds = DataUtil.FISH_ID_TO_WIKI_IDS[fishId]
        if (wikiIds) {
          const spotFishId = wikiIds[0].split('-')[3]
          const fishType = this.lazyTransformedFishDict[spotFishId]?.type
          if (fishType === type) {
            return wikiIds
          } else {
            return []
          }
        } else {
          const fish = this.lazyTransformedFishDict[fishId]
          if (fish?.type === type) {
            return (
              fish?.fishingSpots.map(
                spot => `spot-${spot.fishingSpotId}-fish-${fishId}`
              ) ?? []
            )
          } else {
            return []
          }
        }
      })
    },
    updateCompleted(oldSpotFishIds, newSpotFishIds) {
      if (_.isEqual(_.sortBy(oldSpotFishIds), _.sortBy(newSpotFishIds))) {
        return
      }

      const removed = _.difference(oldSpotFishIds, newSpotFishIds).map(it =>
        this.extractFishId(it)
      )
      const added = _.difference(newSpotFishIds, oldSpotFishIds).map(it =>
        this.extractFishId(it)
      )
      if (removed.length > 0) {
        this.batchSetFishCompleted({ fishIds: removed, completed: false })
      } else if (added.length > 0) {
        this.batchSetFishCompleted({ fishIds: added, completed: true })
      }
    },
    loadWikiDataOfType(type) {
      if (
        this.lazyTransformedFishDict &&
        Object.keys(this.lazyTransformedFishDict).length > 0
      ) {
        const tree = (type === 'normal' ? normSpots : FIX.SPEAR_REGION_TERRITORY_POINT)
          .filter(region => region.id != null)
          .map(region => {
            // output += `region,${region.id},${placeNames[region.id]}\n`
            return {
              id: 'region-' + region.id,
              name: placeNames[region.id],
              // TODO: arrange region & territory according to order
              children: region.territories.map(territory => {
                // output += `territory,${territory.id},${placeNames[territory.id]}\n`
                this.territoryDict[`${type}-${territory.id}`] = territory.spots.map(
                  spot => spot.id
                )
                return {
                  id: 'territory-' + territory.id,
                  name: placeNames[territory.id],
                  children: territory.spots.map(spot => {
                    // output += `spot,${spot.id},${this.getFishingSpotsName(spot.id)}\n`
                    // console.log(Object.keys(this.lazyTransformedFishDict))
                    const fishList = spot.fishList.filter(fishId => {
                      const fish = this.lazyTransformedFishDict[fishId]
                      if (!fish) {
                        console.warn('fish data missing for', fishId)
                      }
                      return fish
                    })
                    this.spotDict[spot.id] = {
                      spotId: spot.id,
                      territoryId: territory.id,
                      regionId: region.id,
                      // [NOTE][VERSION]
                      // filter future version fish out
                      fishList,
                    }
                    return {
                      id: 'spot-' + spot.id,
                      name:
                        type === 'normal'
                          ? this.getFishingSpotsName(spot.id)
                          : placeNames[
                              FIX.SPEAR_FISH_GATHERING_POINTS[spot.id].placeNameId
                            ],
                      children: fishList.map(fishId => {
                        return {
                          id: 'spot-' + spot.id + '-fish-' + fishId,
                          name: this.lazyTransformedFishDict[fishId].name,
                        }
                      }),
                    }
                  }),
                }
              }),
              _order: region.id === 3443 ? 9999 : region.id,
            }
          })
        return _.sortBy(tree, '_order')
      }
      return []
    },
    getPathNodesOf(id) {
      return (
        this.root
          ?.first(node => {
            return id != null && node.model.id === id
          })
          ?.getPath()
          ?.map(it => it.model.id)
          ?.filter(it => it != null) ?? []
      )
    },
    updateOpenItems(search, oldSearch) {
      if (search === '' && oldSearch !== '') {
        const activeNodes = this.getPathNodesOf(this.activeItem)

        if (this.mode === 'normal') {
          this.openedItems = _.uniq([...this.normalOpenedItems, ...activeNodes])
          this.searchOpenedItems = []
        } else {
          this.spearOpenedItems = _.uniq([...this.spearNormalOpenedItems, ...activeNodes])
          this.spearSearchOpenedItems = []
        }
        this.searching = false
      } else if (search !== '' && oldSearch === '') {
        if (this.mode === 'normal') {
          this.normalOpenedItems = this.openedItems
          this.openedItems = this.searchOpenedItems
        } else {
          this.spearNormalOpenedItems = this.spearOpenedItems
          this.spearOpenedItems = this.spearSearchOpenedItems
        }
        this.searching = true
      }
    },
    onFishClicked({ fishId, components }) {
      this.type = 'fish'
      this.forceShowComponents = components
      if (this.currentFishId !== fishId) {
        this.currentFishId = fishId
      }
    },
    toFishPageOfFishLocationPage(fishId) {
      this.$router.push({ name: 'WikiPage', query: { fishId } })
    },
    onMenuItemActive(items) {
      const targetOpenedItems =
        this.mode === 'normal' ? this.openedItems : this.spearOpenedItems
      if (items.length === 0) {
        if (this.preActiveItem != null) {
          targetOpenedItems.splice(targetOpenedItems.indexOf(this.preActiveItem), 1)
        }
        return
      }

      this.activeItem = items[0]

      const parts = this.activeItem.split('-')
      if (parts.length === 4) {
        this.type = parts[2]
      } else {
        this.type = parts[0]
      }
      switch (this.type) {
        case 'region':
          this.currentTerritoryId = -1
          this.currentSpotId = -1
          this.currentFishId = -1
          break
        case 'territory':
          this.currentTerritoryId = +parts[1]
          this.currentSpotId = -1
          this.currentFishId = -1
          break
        case 'spot':
          this.currentSpotId = +parts[1]
          this.currentFishId = -1
          break
        case 'fish':
          this.currentSpotId = +parts[1]
          this.currentFishId = +parts[3]
          break
        default:
          console.error('not supported')
      }

      if (this.type !== 'spot') {
        if (!targetOpenedItems.includes(this.activeItem)) {
          targetOpenedItems.push(this.activeItem)
        }
        this.preActiveItem = this.activeItem
      } else {
        this.preActiveItem = null
      }
    },
    extractFishId(spotFishId) {
      return +spotFishId.split('-')[3]
    },
    spotMenuSearchFn(item, searchText, textKey) {
      const itemText = item[textKey]
      let result
      if (this.$i18n.locale === 'zh-CN') {
        result = PinyinMatch.match(itemText ?? '', searchText) !== false
      } else {
        result = itemText.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      }

      // [TODO-TREE-PATH-AUTO-OPEN]
      // const nodeIds = result ? [item.id] : []
      // if (this.searchResults.text === searchText) {
      //   this.searchResults = { text: searchText, nodeIds: [...this.searchResults.nodeIds, ...nodeIds] }
      // } else {
      //   this.searchResults = { text: searchText, nodeIds: nodeIds }
      // }
      return result
    },
    expandAll() {
      this.$refs.normalSpotMenu?.updateAll(true)
      this.$refs.spearSpotMenu?.updateAll(true)
    },
    collapseAll() {
      this.$refs.normalSpotMenu?.updateAll(false)
      this.$refs.spearSpotMenu?.updateAll(false)
    },
    assembleSpot(spotId) {
      const mode = this.typeOfSpot(this.currentSpotId)
      if (mode === 'normal') {
        const spot = this.getFishingSpot(spotId)
        return {
          ...spot,
          name: DataUtil.getName(spot),
          zone: placeNames[spot.territoryId],
        }
      } else {
        const gatheringPoint = FIX.SPEAR_FISH_GATHERING_POINTS[spotId]
        // console.log('gp', spotId, {
        //   ...gatheringPoint,
        //   name: DataUtil.getName(gatheringPoint),
        // })
        return {
          ...gatheringPoint,
          name: DataUtil.getName(gatheringPoint),
          zone: placeNames[gatheringPoint.regionPlaceNameId],
        }
      }
    },
    onSyncClose() {
      this.syncStatus = 'not-start'
      this.showSyncDialog = false
    },
    ...mapMutations(['setFishCompleted', 'batchSetFishCompleted', 'showSnackbar']),
    ...mapActions(['syncFishCompleted']),
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.spear-icon
  width: 20px
  height: 20px
  background: url('https://rcstatic.traveleorzea.com/pastry-fish-static-files/img/misc/fishing-notebook.webp') -64px -28px

.fishing-icon
  width: 20px
  height: 20px
  background: url('https://rcstatic.traveleorzea.com/pastry-fish-static-files/img/misc/fishing-notebook.webp') -84px -28px

.grid-content
  overflow-x: hidden
  padding-left: 4px
  overflow-y: auto
  &--web
    height: 100%
    width: 100%

$wrapper-wiki-menu: $spot-menu-search-height + $spot-menu-toolbar-height + $divider-height

.spot-list
  overflow-y: auto
  &--pc
    &-web
      height: calc(100vh - #{ $wrapper-web + $wrapper-wiki-menu })
    &-electron
      height: calc(100% - #{ $wrapper-wiki-menu })
    &-electron-original
      height: calc(100vh - #{ $wrapper-desktop + $wrapper-wiki-menu })

  &--mobile
    &-web
      height: calc(100vh - #{ $wrapper-wiki-menu })
    &-electron
      height: calc(100% - #{ $wrapper-wiki-menu })
    &-electron-original
      height: calc(100vh - #{ $wrapper-wiki-menu })

.wiki-content
  display: flex
  overflow-y: auto
  width: 100%
  height: 100%

  &--mobile
    &-web
      max-height: calc(100vh - #{ $wrapper-web })
    &-electron
      max-height: calc(100% - #{ $toolbar-height })
    &-electron-original
      max-height: calc(100vh - #{ $wrapper-desktop })

  &--pc
    &-web
      max-height: calc(100vh - #{ $wrapper-web })
    &-electron
      max-height: calc(100% - #{ $toolbar-height })
    &-electron-original
      max-height: calc(100vh - #{ $wrapper-desktop })

.nav-bar
  &--pc
    width: 20vw
    min-width: 250px

.detail-part
  overflow-y: auto
  flex: 0 1 100%
  overflow-x: hidden
  padding-left: 4px
</style>
