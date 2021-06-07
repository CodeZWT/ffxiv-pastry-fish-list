<template>
  <div style="height: 100%" class="d-flex">
    <v-navigation-drawer
      v-model="showMapMenu"
      :floating="isMobile"
      :fixed="isMobile"
      :class="{ 'nav-bar--pc': !isMobile }"
    >
      <div>
        <v-sheet class="pa-1 primary">
          <div class="d-flex align-center">
            <v-btn text icon @click="type = undefined">
              <v-icon> mdi-home </v-icon>
            </v-btn>
            <v-text-field
              v-model="searchText"
              :label="$t('wiki.searchTitle')"
              flat
              solo-inverted
              hide-details
              clearable
            ></v-text-field>
            <!-- expand all button -->
            <!--            <v-btn icon text class="ml-1" @click="expandAll">-->
            <!--              <v-icon>mdi-arrow-expand-vertical</v-icon>-->
            <!--            </v-btn>-->
            <!-- setting button -->
            <!--            <v-btn v-if="type === 'fish' || type === 'spot'" @click="toggleSettingMode" icon>-->
            <!--              <v-icon>mdi-cog</v-icon>-->
            <!--            </v-btn>-->
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
                mdi-checkbox-multiple-blank-outline
              </v-icon>
              <v-icon v-else small>mdi-checkbox-multiple-marked</v-icon>
            </new-feature-mark>
          </v-btn>
          <v-btn small icon text class="ml-2" @click="collapseAll">
            <v-icon small>mdi-arrow-collapse-vertical</v-icon>
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
        <v-card-text
          :class="{
            'spot-list': true,
            'spot-list--pc-web': !isMobile && !isElectron,
            'spot-list--mobile-web': isMobile && !isElectron,
            'spot-list--electron': isElectron,
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
                {{ selected ? 'mdi-check' : '' }}
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
                {{ selected ? 'mdi-check' : '' }}
              </v-icon>
            </template>
          </v-treeview>
        </v-card-text>
      </div>
    </v-navigation-drawer>
    <div style="height: 100%; width: 100%">
      <div
        :class="{
          'detail-wrapper': true,
          'detail-wrapper--pc-web': !isMobile && !isElectron,
          'detail-wrapper--pc-electron': !isMobile && isElectron,
          'detail-wrapper--mobile-web': isMobile && !isElectron,
          'detail-wrapper--mobile-electron': isMobile && isElectron,
        }"
      >
        <div
          v-if="
            !type ||
              type === 'region' ||
              (type === 'territory' && isOceanFishingTerritory)
          "
          class="fill-height d-flex flex-column align-content-space-between"
        >
          <!--  show empty / region view  -->
          <div>
            <v-sheet outlined class="pa-4">
              <div class="text-h6">成就计数</div>
              <div class="text-subtitle-1">鼠标悬停成就数字可查看说明</div>
              <v-divider />
              <v-subheader>专研钓鱼笔记（5.45最大值1159，5.55最大值1181）</v-subheader>
              <v-row>
                <v-col>
                  <achievement-progress
                    :value="counts.iCatchThat.record"
                    :total="counts.iCatchThat.total"
                    :ticks="counts.iCatchThat.ticks"
                  />
                </v-col>
              </v-row>
              <v-subheader>愿者上钩</v-subheader>
              <v-row>
                <v-col>
                  <achievement-progress
                    :value="counts.goBigOrGoHome.record"
                    :total="counts.goBigOrGoHome.total"
                    :ticks="counts.goBigOrGoHome.ticks"
                  />
                </v-col>
              </v-row>
              <v-subheader>净界太公（5.45最大值28）</v-subheader>
              <v-row>
                <v-col>
                  <achievement-progress
                    :value="counts.goBigFarFromHome.record"
                    :total="counts.goBigFarFromHome.total"
                    :ticks="counts.goBigFarFromHome.ticks"
                  />
                </v-col>
              </v-row>

              <v-subheader>No River Wide Enough（5.45最大值232）</v-subheader>
              <v-row>
                <v-col>
                  <achievement-progress
                    :value="counts.noRiverWideEnough.record"
                    :total="counts.noRiverWideEnough.total"
                    :ticks="counts.noRiverWideEnough.ticks"
                  />
                </v-col>
              </v-row>

              <v-btn color="primary" @click="showSyncDialog = true" block class="mt-2">
                <v-icon left>mdi-sync</v-icon>
                同步游戏数据
              </v-btn>
            </v-sheet>
          </div>
          <div
            class="d-flex justify-center align-center"
            style="width: 100%; height: 100%"
          >
            <v-icon size="200">mdi-book-open-page-variant</v-icon>
          </div>
        </div>
        <div v-else-if="type === 'territory'" style="width: 100%; height: 100%">
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
          v-else-if="(type === 'spot' || type === 'fish') && !isOceanFishingSpot"
          class="grid-content"
        >
          <!--  show spot/fish view  -->
          <v-row v-if="currentSpotId" no-gutters>
            <v-col cols="12" class="my-1">
              <v-expansion-panels hover flat tile :value="0">
                <v-expansion-panel class="systemSecondary">
                  <v-expansion-panel-header class="systemSecondary">
                    <div>
                      <div
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        "
                      >
                        <link-list
                          :id="currentMapInfo.id"
                          :angler-id="currentMapInfo.anglerLocationId"
                          :name="currentMapInfo.name"
                          mode="spot"
                          :spot-mode="mode"
                        >
                          <v-hover v-slot="{ hover }">
                            <div
                              :class="
                                `text-subtitle-1 ${
                                  hover ? 'info--text text-decoration-underline' : ''
                                }`
                              "
                            >
                              {{ currentMapInfo.name }}
                            </div>
                          </v-hover>
                        </link-list>
                        <!--                      <div-->
                        <!--                        class="text-subtitle-1"-->
                        <!--                        :title="currentMapInfo.name + '#' + currentMapInfo.id"-->
                        <!--                      >-->
                        <!--                        {{ currentMapInfo.name }}-->
                        <!--                      </div>-->
                        <div class="text-subtitle-1 ml-2">
                          ({{ currentMapInfo.fishSpotPositionText }})
                        </div>
                        <click-helper @click.stop :copy-text="currentMapInfo.name">
                          <v-btn class="my-2" text icon :title="$t('list.item.copyHint')">
                            <v-icon>mdi-content-copy</v-icon>
                          </v-btn>
                        </click-helper>
                        <!--                    {{ currentMapInfo }}-->
                      </div>

                      <div v-if="showSpotPredators" class="text-center">
                        此处为鱼影，需要刺前置鱼触发，详情见地图下方说明。
                      </div>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div
                      style="width: 100%; height: 512px"
                      class="d-flex justify-center mt-4"
                    >
                      <div style="width: 100%; max-width: 512px">
                        <eorzea-simple-map
                          ref="simpleMap"
                          :id="currentMapInfo.mapFileId"
                          :size-factor="currentMapInfo.size_factor"
                          :fishing-spots="currentSpotList"
                          :show-fishing-range-helper="mode === 'normal'"
                        />
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>

            <v-col cols="12" class="my-1">
              <div>
                <v-card v-if="showSpotPredators" color="info">
                  <v-card-title>
                    {{ $t('gigTip.fishShadow.title') }}
                  </v-card-title>
                  <v-card-text>
                    此处为鱼影，需要刺相应个数的前置鱼才能触发，触发后在小地图上会有鱼影位置提示。
                  </v-card-text>
                  <v-card-subtitle>
                    {{ $t('gigTip.fishShadow.location') }}
                  </v-card-subtitle>
                  <v-card-text>
                    <detail-item-map :fish="currentSpotPredators[0]" />
                  </v-card-text>
                  <v-card-subtitle>
                    {{ $t('gigTip.fishShadow.predators') }}
                  </v-card-subtitle>

                  <v-card-text>
                    <fish-list
                      :fish-list="currentSpotPredators"
                      :fish-list-time-part="fishListTimePart"
                      :fish-list-weather-change-part="fishListWeatherChangePart"
                      :show-fish-divider="false"
                      hide-spot-column
                      @fish-selected="onFishClicked($event)"
                    />
                  </v-card-text>
                </v-card>
              </div>
            </v-col>

            <v-col cols="12" class="my-1">
              <v-card>
                <v-card-text>
                  <fish-list
                    :fish-list="currentFishList"
                    :fish-list-time-part="fishListTimePart"
                    :fish-list-weather-change-part="fishListWeatherChangePart"
                    hide-spot-column
                    hide-predators
                    @fish-selected="onFishClicked($event)"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" class="my-1">
              <fish-tug-table v-if="mode === 'normal'" :value="currentFishList" />
              <fish-gig-table v-else :value="currentFishList" />
            </v-col>
          </v-row>
        </div>
        <div v-else-if="isOceanFishingSpot" class="grid-content">
          <ocean-fishing-fish-list :fish-list="currentFishList" class="ml-2" />
          <!--          <pre>{{ JSON.stringify(currentFishList, null, 2) }}</pre>-->
        </div>
      </div>
      <div
        v-if="isMobile"
        style="position: absolute; top: 4px; left: 0; right: 0; z-index: 1"
      >
        <v-btn @click="showMapMenu = !showMapMenu" block color="primary" tile>
          点击选择地图
        </v-btn>
      </div>
    </div>
    <v-dialog
      v-model="isDetailFishWindowOpen"
      max-width="70vh"
      :fullscreen="isMobile"
      scrollable
    >
      <v-card>
        <v-card-text>
          <fish-detail
            :fish="currentFish"
            :now="now"
            :forceShowComponents="forceShowComponents"
            :show-fishing-range-helper="mode === 'normal'"
            hide-map
          />
        </v-card-text>
        <v-card-actions>
          <div class="d-flex flex-column flex-fill">
            <click-helper @click="isDetailFishWindowOpen = false">
              <v-btn class="mt-2" color="default" block text>
                {{ $t('general.dialog.close') }}
              </v-btn>
            </click-helper>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showSyncDialog" max-width="320" :fullscreen="isMobile" scrollable>
      <v-card>
        <!-- patch update wait note -->
        <v-alert outlined type="warning" border="left">
          更新国服5.45后，渔捞与同步功能不可用，请耐心等待自动更新。
        </v-alert>
        <v-card-title>数据同步</v-card-title>
        <v-card-subtitle v-if="!isElectron">
          数据同步为鱼糕桌面版功能，左侧可下载桌面版。
        </v-card-subtitle>
        <v-card-text v-if="syncStatus === 'not-start'">
          <item-icon icon-class="bg-000024" class="float-left" />
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
                  若登录游戏后仍未同步成功，请打开左侧<v-icon small>mdi-fish</v-icon
                  >渔捞，点击右上角<v-icon small>mdi-cog</v-icon
                  >进入设置，按照黄字提示操作。
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-text v-if="syncStatus === 'finished'">
          <v-icon>mdi-check-circle</v-icon>
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
    </v-dialog>
  </div>
</template>

<script>
import normSpots from 'Data/fishingSpots'
import placeNames from 'Data/placeNames'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import _ from 'lodash'
import PinyinMatch from 'pinyin-match'
import DataUtil from '@/utils/DataUtil'
import FishDetail from '@/components/FishDetail'
import TreeModel from 'tree-model'
import ClickHelper from '@/components/basic/ClickHelper'
import FishList from '@/components/FishList'
import OceanFishingFishList from '@/components/OceanFishingFishList/OceanFishingFishList'
import FIX from 'Data/fix'
import FishGigTable from '@/components/FishingGigTable'
import FishTugTable from '@/components/FishingTugTable'
import DetailItemMap from '@/components/fish-detail-items/DetailItemMap'
import LinkList from '@/components/basic/LinkList'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import NewFeatureMark from '@/components/basic/NewFeatureMark'
import ItemIcon from '@/components/basic/ItemIcon'
import { GLOBAL_PATCH_VERSION, CN_PATCH_VERSION } from 'Data/constants'
import DATA_CN from 'Data/translation'
import AchievementProgress from '@/components/AchievementProgress'
import ImgUtil from '@/utils/ImgUtil'

export default {
  name: 'WikiPage',
  components: {
    AchievementProgress,
    ItemIcon,
    NewFeatureMark,
    LinkList,
    DetailItemMap,
    FishTugTable,
    FishGigTable,
    OceanFishingFishList,
    FishList,
    ClickHelper,
    FishDetail,
    EorzeaSimpleMap,
    // GridLayout: VueGridLayout.GridLayout,
    // GridItem: VueGridLayout.GridItem,
  },
  props: [
    'lazyTransformedFishDict',
    'fishListTimePart',
    'now',
    'fishListWeatherChangePart',
    'extraFishListTimePart',
    'lazyFishSourceList',
    'lazyTransformedFishList',
  ],
  data: vm => ({
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
    mode: 'normal',
    isElectron: DevelopmentModeUtil.isElectron(),
    showSyncDialog: false,
    syncStatus: 'not-start',
  }),
  computed: {
    showSpotPredators() {
      return (
        this.mode === 'spear' && this.currentFishList.some(it => it.predators.length > 0)
      )
    },
    currentSpotPredators() {
      return this.currentFishList.find(fish => fish.predators.length > 0)?.predators ?? []
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
      console.debug('Current Spot', currentSpot)
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
    currentFishList() {
      return this.spotDict?.[this.currentSpotId]?.fishList?.map(
        fishId => this.lazyTransformedFishDict[fishId]
      )
    },
    currentFlattenFishList() {
      return (
        this.currentFishList?.flatMap(fish => {
          return [fish, ...fish.predators]
        }) ?? []
      )
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
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    fishCaughtCnt() {
      return this.allCompletedFish.length
    },
    // total
    // | normal fish                                                                                   | spear fish                |
    // | normal fish                     | ocean fish                    |                             | normal fish | fish shadow |
    // | normal fish | big fish | legend | normal sea fish               | current fish                |                           |
    // |                                 | normal fish | intuition fish  | normal big fish | blue fish |                           |

    // spearFishTotal() {
    //
    // },
    // normalFishTotal() {
    //   return _.uniq(Object.keys(this.allFish).map(id => DataUtil.toItemId(id))).length +
    //     Object.keys(FIX.OCEAN_FISHING_FISH).length -
    //     (DevelopmentModeUtil.isTest() ? 2 : 0)
    // },
    region() {
      return 'CN'
    },
    patch() {
      return this.region === 'CN' ? CN_PATCH_VERSION : GLOBAL_PATCH_VERSION
    },
    counts() {
      // const globalNormalFish = 16
      // const globalBigFish = 11
      const podSpearFish = _.chain(
        Object.values(this.allFish).map(it => ({ ...it, _id: DataUtil.toItemId(it._id) }))
      )
        .groupBy(it => it._id)
        .mapValues(it => it[0])
        .filter(it => it.type !== 'test')
        .value()

      const oceanFish = Object.values(FIX.OCEAN_FISHING_FISH)

      // let podNormalFish =[], podNormalFish =[],  podNormalFish =[], spearFish = [], podFish = []
      const iCatchThat = {
        record: this.allCompletedFish.filter(
          it =>
            FIX.FISH_PARAMETER.find(param => param.Item === it)?.IsInLog ||
            FIX.SPEAR_FISHING_ITEM.find(param => param.Item === it)?.IsVisible
        ).length,
        // ticks: [
        //   // { title: '捕鱼大师戒指', cnt:  160   , itemId: 6137         },
        //   { title: '赐福渔灯钓竿', cnt: 460, itemId: 16968 },
        //   { title: '赐福渔采钓竿', cnt: 780, itemId: 24831 },
        //   { title: '5.5璀璨钓竿', cnt: 1140, itemId: 33358 },
        // ],
        ticks: [1731, 2176, 2832]
          .map(achievementId => {
            const achievement = FIX.ACHIEVEMENT[achievementId]
            return {
              ...achievement,
              item: achievement.item
                ? {
                    id: achievement.item,
                    title: achievement.itemTitle,
                    iconUrl: ImgUtil.getIconUrl(achievement.itemIcon),
                  }
                : undefined,
            }
          })
          .concat({
            data: [1159],
            name_chs: '国服5.45版本最大值',
            description: '国服5.45版本共有1159条鱼属于成就记录范围。',
            type: 'maxTip',
            nextLine: true,
          }),
        total: podSpearFish.length + oceanFish.length, // + globalNormalFish + globalBigFish,
      }

      const goBigOrGoHomeFishIds = podSpearFish
        .filter(it => DATA_CN.BIG_FISH.includes(it._id) && it.patch < 5)
        .map(it => it._id)
      const goBigOrGoHome = {
        record: this.allCompletedFish.filter(it => goBigOrGoHomeFishIds.includes(it))
          .length,
        // 鱼太公 烟波钓徒
        ticks: [1033, 2245].map(achievementId => FIX.ACHIEVEMENT[achievementId]),
        total: goBigOrGoHomeFishIds.length,
      }
      const goBigFarFromHomeFishIds = podSpearFish
        .filter(it => DATA_CN.BIG_FISH.includes(it._id) && it.patch >= 5)
        .map(it => it._id)
      const goBigFarFromHome = {
        record: this.allCompletedFish.filter(it => goBigFarFromHomeFishIds.includes(it))
          .length,
        ticks: [2833]
          .map(achievementId => FIX.ACHIEVEMENT[achievementId])
          .concat({
            data: [28],
            name_chs: '国服5.45版本最大值',
            description: '国服5.45版本共有28条鱼属于成就记录范围。',
            type: 'maxTip',
            nextLine: false,
          }),
        total: goBigFarFromHomeFishIds.length, //+ globalBigFish,
      }

      const noRiverWideEnough = {
        record: this.allCompletedFish.filter(
          it => goBigOrGoHomeFishIds.includes(it) || goBigFarFromHomeFishIds.includes(it)
        ).length,
        ticks: [2834].map(achievementId => FIX.ACHIEVEMENT[achievementId]),
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
        Object.keys(FIX.OCEAN_FISHING_FISH).length -
        (DevelopmentModeUtil.isTest() ? 2 : 0)
      )
    },
    ...mapState({ allFish: 'fish' }),
    ...mapGetters([
      'getFishingSpotsName',
      'getFishingSpot',
      'getFishCompleted',
      'allCompletedFish',
    ]),
  },
  watch: {
    currentRegionTerritorySpots(regionTerritorySpots) {
      if (regionTerritorySpots && regionTerritorySpots.length > 0) {
        this.root = new TreeModel().parse({
          name: 'root',
          children: this.regionTerritorySpots,
        })
        // this.updateCompletedSpot(this.allCompletedFish)
      }
    },
    currentSpotId(currentSpotId) {
      if (currentSpotId !== -1) {
        setTimeout(() => this.$refs.simpleMap?.resize(), 500)
      }
    },
    // completedSpots(newSpots, oldSpots) {
    //   console.debug('not used')
    //   // console.log(newSpots, oldSpots)
    //   const removed = _.difference(oldSpots, newSpots).map(
    //     it => +it.substring('spot-'.length)
    //   )
    //   const added = _.difference(newSpots, oldSpots).map(
    //     it => +it.substring('spot-'.length)
    //   )
    //   if (removed.length > 0) {
    //     _.uniq(removed.flatMap(it => this.spotDict[it].fishList)).forEach(it => {
    //       this.setFishCompleted({ fishId: it, completed: false })
    //     })
    //   } else if (added.length > 0) {
    //     _.uniq(added.flatMap(it => this.spotDict[it].fishList)).forEach(it => {
    //       this.setFishCompleted({ fishId: it, completed: true })
    //     })
    //   }
    // },
    currentFishId(fishId) {
      if (fishId > 0 && !this.isOceanFishingSpot) {
        this.isDetailFishWindowOpen = true
        this.$emit('fish-selected', { fishId })
      }
    },
    isDetailFishWindowOpen(isOpen) {
      if (!isOpen) {
        this.currentFishId = -1
      }
    },
    '$route.query': {
      handler(query) {
        console.debug('watch query', query)
        this.showSpot(query.spotId, query.mode)
        // this.mode = query.mode ?? 'normal'
        // this.currentSpotId = +(query.spotId ?? -1)
        // this.type = this.currentSpotId !== -1 ? 'spot' : undefined
      },
      immediate: true,
    },
  },
  created() {
    console.debug('nav with query', this.$route.query)
    // this.mode = this.$route.query.mode ?? 'normal'
    // this.currentSpotId = +(this.$route.query.spotId ?? -1)
    // this.type = this.currentSpotId !== -1 ? 'spot' : undefined
    this.openedItems = this.normalOpenedItems
    this.spearOpenedItems = this.spearNormalOpenedItems
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
  methods: {
    showSpot(spotId, mode) {
      if (DataUtil.isDiademSpot(spotId)) {
        return
      } else if (spotId > 0) {
        this.mode = mode ?? 'normal'
        this.currentSpotId = +(spotId ?? -1)
        this.type = this.currentSpotId !== -1 ? 'spot' : undefined
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
      return this.allCompletedFish.flatMap(fishId => {
        const wikiIds = DataUtil.FISH_ID_TO_WIKI_IDS[fishId]
        if (wikiIds) {
          const spotFishId = wikiIds[0].split('-')[3]
          const fishType = this.lazyTransformedFishDict[spotFishId].type
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
      // const oldSpotFishIds = this.normalCompletedSpotFishIds

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
        return (type === 'normal' ? normSpots : FIX.SPEAR_REGION_TERRITORY_POINT)
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
            }
          })
      }
      return []
    },
    toPos(index) {
      return index === 0
        ? 'first'
        : index === this.currentFlattenFishList.length - 1
        ? 'last'
        : 'inside'
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
      this.currentFishId = fishId
      this.forceShowComponents = components
    },
    onMapCardResized() {
      setTimeout(() => this.$refs.simpleMap?.resize(), 300)
    },
    toggleSettingMode() {
      this.isSettingMode = !this.isSettingMode
    },
    // updateCompletedSpot(allCompletedFish) {
    //   console.debug('not used')
    //   const completedSpots = []
    //   Object.values(this.spotDict).forEach(spot => {
    //     if (
    //       spot.fishList.length > 0 &&
    //       spot.fishList.every(fishId => allCompletedFish.includes(fishId))
    //     ) {
    //       completedSpots.push('spot-' + spot.spotId)
    //     }
    //   })
    //   // console.log(_.isEqual(this.completedSpots, completedSpots))
    //   if (!_.isEqual(_.sortBy(this.completedSpots), _.sortBy(completedSpots))) {
    //     this.completedSpots = completedSpots
    //   }
    // },
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
          break
        case 'territory':
          this.currentTerritoryId = +parts[1]
          break
        case 'spot':
          this.currentSpotId = +parts[1]
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
        if (itemText == null) {
          console.log(item.id)
        }
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
      if (this.mode === 'normal') {
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
  background: url('https://cdn.jsdelivr.net/gh/ricecake404/images@main/img/fishing-notebook.png') -64px -28px

.fishing-icon
  width: 20px
  height: 20px
  background: url('https://cdn.jsdelivr.net/gh/ricecake404/images@main/img/fishing-notebook.png') -84px -28px


.vue-grid-item .resizing
  opacity: 0.9


.vue-grid-item .text
  font-size: 24px
  text-align: center
  position: absolute

  top: 0
  bottom: 0
  left: 0
  right: 0
  margin: auto
  height: 100%
  width: 100%

.grid-content
  height: 100%
  overflow-scrolling: auto
  overflow-y: auto
  padding: 0 4px
  margin: 0 0 4px 0

.spot-list
  &--pc-web
    overflow-scrolling: auto
    overflow-y: scroll
    height: calc(100vh - #{ $top-bars-padding + $footer-padding + 56 + 56})
  &--mobile-web
    overflow-y: hidden
    height: calc(100vh - #{ $top-bars-padding + $footer-padding + 56 + 56})
  &--electron
    height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding + 56 + 56})

.detail-wrapper
  width: 100%
  height: 100%

  &--mobile
    &-web
      margin-top: 40px
      max-height: calc(100vh - #{ $top-bars-padding + $footer-padding + 40})
    &-electron
      margin-top: 40px
      max-height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding + 40})

  &--pc-web
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

  &--pc-electron
    max-height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding})

.nav-bar
  //overflow-y: hidden
  &--pc
    width: 20vw
    min-width: 250px
</style>
