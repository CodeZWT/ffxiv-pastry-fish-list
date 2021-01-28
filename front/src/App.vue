<template>
  <v-app :style="`opacity: ${opacity}`" :class="{ 'min-page': collapse }">
    <v-app-bar
      height="56px"
      app
      :collapse="collapse"
      :class="{
        'fish-app-bar': true,
        'rounded-pill': collapse,
        'fish-app-bar--collapsed': collapse,
      }"
      dense
      color="system"
    >
      <v-app-bar-nav-icon v-if="isMobile && !collapse" @click.stop="showNavi">
        <v-img v-if="!isMobile" :src="fisher" height="42" width="42" />
      </v-app-bar-nav-icon>
      <click-helper
        @click="onFishIconClicked"
        :style="`margin-left: ${collapse || isMobile ? 0 : -12}px`"
      >
        <v-tooltip bottom z-index="10">
          <template v-slot:activator="{ on, attrs }">
            <div class="d-flex">
              <v-avatar size="36" v-bind="attrs" v-on="on">
                <img :src="fisher" />
              </v-avatar>
              <div class="d-flex flex-column" v-if="collapse">
                <v-chip
                  v-for="(notification, index) in listFishCntForMini"
                  :key="index"
                  x-small
                  color="transparent"
                  @click="setActiveTabLater(index)"
                >
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <click-helper v-on="on" v-bind="attrs">
                        <div>
                          <v-icon left small disabled>
                            {{ TABS[index].icon }}
                          </v-icon>
                          {{ notification.cnt }}
                        </div>
                      </click-helper>
                    </template>
                    <span>{{ $t(TABS[index].title) }}</span>
                  </v-tooltip>
                </v-chip>
              </div>
            </div>
          </template>
          <span>{{ $t('top.collapseHint') }}</span>
        </v-tooltip>
      </click-helper>
      <v-toolbar-title
        v-if="!isMobile"
        style="min-width: 85px !important"
        class="ml-1 text-truncate"
        :title="$t('top.navBarTitle', { title, version })"
      >
        <span>{{ title }}</span>
        <v-badge :content="version" class="px-1" />
      </v-toolbar-title>
      <template v-if="!collapse">
        <v-spacer />
        <!--        <v-tabs-->
        <!--          v-if="isListPage && !isMobile"-->
        <!--          :value="activeTabIndex"-->
        <!--          @change="setActiveTab"-->
        <!--          center-active-->
        <!--          show-arrows-->
        <!--          centered-->
        <!--        >-->
        <!--          <v-tab-->
        <!--            v-for="(notification, index) in listFishCnt"-->
        <!--            :key="index"-->
        <!--            :class="{ 'primary&#45;&#45;text': activeTabIndex === index }"-->
        <!--          >-->
        <!--            <v-badge-->
        <!--              color="error"-->
        <!--              :value="notification.cnt"-->
        <!--              :content="notification.cnt"-->
        <!--              style="z-index: 10"-->
        <!--            >-->
        <!--              <div class="d-flex">-->
        <!--                <v-icon-->
        <!--                  left-->
        <!--                  small-->
        <!--                  :color="activeTabIndex === index ? 'primary-text' : ''"-->
        <!--                >-->
        <!--                  {{ TABS[index].icon }}-->
        <!--                </v-icon>-->
        <!--                <div v-if="!isMobile" style="font-size: 16px">-->
        <!--                  {{ $t(TABS[index].title) }}-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </v-badge>-->
        <!--          </v-tab>-->
        <!--        </v-tabs>-->
        <div v-if="inStartLight">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-switch
                  v-model="showHatCover"
                  inset
                  class="theme-switch"
                  color="pink darken-3"
                />
              </div>
            </template>
            <div>
              点击切换星芒节天气模式<br />
              在星芒节期间，三大主城以及四个住宅区的天气固定为小雪。<br />
              此开关开启时，将会以星芒节的小雪作为窗口期天气计算的条件。<br />
              关闭时，以地图区域的默认天气转换进行计算。
            </div>
          </v-tooltip>
        </div>

        <v-btn icon v-if="isListPage" @click="toggleFilterPanel">
          <v-icon>mdi-filter</v-icon>
        </v-btn>
        <v-btn icon v-if="isListPage || isWikiPage" @click="showBaitDialog = true">
          <v-icon>mdi-hook</v-icon>
        </v-btn>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <click-helper @click="setShowSearchDialog(true)">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </click-helper>
          </template>
          <span>按<kbd>/</kbd>键直接搜索</span>
        </v-tooltip>

        <v-menu offset-y>
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn icon v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <v-icon> mdi-theme-light-dark </v-icon>
                </v-btn>
              </template>
              <div>设置颜色模式</div>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item-group color="primary" :value="themeModeIndex">
              <v-tooltip
                v-for="(mode, index) in THEME_SETTING_MODES"
                :key="index"
                bottom
                :disabled="mode !== 'AUTO'"
              >
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <v-list-item @click="selectThemeMode(index)">
                      <v-list-item-icon>
                        <v-icon>{{ THEME_MODE_ICONS[index] }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>
                          <div class="d-flex align-center">
                            <div>{{ $t(`toolbar.theme.${mode}`) }}</div>
                          </div>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                </template>
                <div>WINDOWS10: 设置 -> 颜色 -> 选择颜色</div>
              </v-tooltip>
            </v-list-item-group>
          </v-list>
        </v-menu>

        <v-sheet class="d-flex flex-column ml-1 transparent">
          <div><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
          <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
        </v-sheet>
      </template>
    </v-app-bar>

    <v-main>
      <v-navigation-drawer
        v-if="!collapse"
        v-model="drawer"
        :mini-variant.sync="mini"
        :bottom="isMobile"
        :absolute="!isMobile"
        :fixed="isMobile"
        color="system"
        :expand-on-hover="!isMobile"
        style="z-index: 10"
      >
        <v-list dense>
          <v-list-item
            v-for="(notification, index) in listFishCnt"
            :key="index"
            @click="toPageSubList(index)"
          >
            <v-list-item-icon>
              <v-badge
                color="error"
                :value="notification.cnt"
                :content="notification.cnt"
                style="z-index: 10"
                overlap
              >
                <v-icon>
                  {{ TABS[index].icon }}
                </v-icon>
              </v-badge>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t(TABS[index].title) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="toPage('WikiPage')" link>
            <v-list-item-icon>
              <v-icon>mdi-notebook</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.fishWiki') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="toPage('OceanFishingPage')" link>
            <v-list-item-icon>
              <v-icon>mdi-ferry</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.oceanFishing') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="toPage('DiademPage')" link>
            <v-list-item-icon>
              <v-img
                :src="dark ? diademDark : diademLight"
                height="24"
                width="24"
              ></v-img>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.diadem') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <template v-slot:append>
          <v-list nav dense>
            <v-spacer />
            <v-divider />
            <v-list-group prepend-icon="mdi-cog" active-class="white--text">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('top.setting') }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <!--        <v-list-item-group active-class="primary--text">-->

              <click-helper @click="setShowImportExportDialog(true)">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <v-icon>mdi-database</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('top.menu') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </click-helper>
              <click-helper @click="showSettingDialog = true">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <v-icon>mdi-tune</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('top.uiConfig') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </click-helper>
              <click-helper @click="showHelpDialog = true">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <v-icon>mdi-help-circle</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('top.help') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </click-helper>
              <click-helper @click="showPatchNoteDialog = true">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <v-icon>mdi-tag</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('top.patchNote') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </click-helper>
              <click-helper @click="showAboutDialog = true">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <v-icon>mdi-information</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('top.about') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </click-helper>
              <!--        </v-list-item-group>-->
            </v-list-group>
          </v-list>
        </template>
      </v-navigation-drawer>
      <div
        :class="{ 'py-0': true, 'ml-14': !isMobile }"
        style="height: 100%"
        v-show="!collapse"
      >
        <v-overlay :value="loading || showJumpingOverlay" opacity="0.9" z-index="9999">
          <div class="d-flex flex-column align-center">
            <v-progress-circular indeterminate size="64" />
            <div>{{ $t('list.loading') }}</div>
          </div>
        </v-overlay>
        <router-view
          :now="now"
          :lazyFishSourceList="lazySourceFishList"
          :lazyTransformedFishList="lazyTransformedFishList"
          :lazyTransformedFishDict="lazyTransformedFishDict"
          :fishListTimePart="fishListTimePart"
          :extraFishListTimePart="extraFishListTimePart"
          :fishListWeatherChangePart="fishListWeatherChangePart"
          :pinnedFishList="pinnedFishList"
          :sortedFilteredFishList="sortedFilteredFishList"
          :toBeNotifiedFishList="toBeNotifiedFishList"
          :selectedFish="selectedFish"
          :filteredFishIdSet="filteredFishIdSet"
          @fish-selected="onFishSelected"
        />
        <!--                @fishCntUpdated="listFishCnt = $event"     -->
      </div>
      <!--      <v-container class="py-0" v-if="!collapse">-->
      <!--        <v-row>-->
      <!--          <v-col class="d-flex flex-row justify-end">-->
      <!--            <span>FINAL FANTASY XIV © 2010 - 2020 SQUARE ENIX CO., LTD. All Rights Reserved.</span>-->
      <!--          </v-col>-->
      <!--        </v-row>-->
      <!--      </v-container>-->
    </v-main>

    <fish-search
      v-model="showSearch"
      :fish-data="lazySourceFishList"
      :fish-dict="lazyTransformedFishDict"
      :fish-list-time-part="fishListTimePart"
      :extraFishListTimePart="extraFishListTimePart"
      :fish-list-weather-change-part="fishListWeatherChangePart"
      :now="now"
      @change="searchedFishId = $event"
    />

    <v-footer app style="font-size: small; max-height: 31px" v-if="!collapse">
      <div class="d-flex" style="width: 100%">
        <div class="text-truncate mr-2" :title="$t('footer.contact')">
          {{ $t('footer.contact') }}
        </div>
        <v-spacer />
        <div class="text-truncate" :title="$t('footer.ffRights')">
          {{ $t('footer.ffRights') }}
        </div>
      </div>
      <div class="resize-indicator" />
    </v-footer>

    <fish-setting-dialog v-model="showSettingDialog" />

    <patch-note-dialog
      v-model="showPatchNoteDialog"
      :in-migration-page="inMigrationPage"
      @confirm="onConfirmPatchNote"
    />
    <v-dialog
      v-model="showHelpDialog"
      :fullscreen="isMobile"
      max-width="1264px"
      scrollable
    >
      <v-card>
        <v-card-title>
          {{ $t('top.help') }}
        </v-card-title>
        <v-card-text v-html="helpHTML" />
        <v-card-actions>
          <div class="d-flex flex-column flex-fill">
            <click-helper @click="showHelpDialog = false">
              <v-btn color="default" block text>{{ $t('general.dialog.close') }}</v-btn>
            </click-helper>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showAboutDialog"
      :fullscreen="isMobile"
      max-width="600px"
      scrollable
    >
      <v-card>
        <v-card-text class="contact-area">
          <div>ID：红豆年糕 @ 海猫茶屋</div>
          <div>群：1153646847</div>
          <div>欢迎使用本站</div>
          <div>
            钓场的范围提示由 <span class="font-weight-bold">轩辕十四@沃仙曦染</span> 提供
          </div>
          <div>感谢来自于各个开源作者的支持：</div>
          <ul>
            <li>钓鱼数据：</li>
            <ul>
              <li>
                <a @click="goTo('https://ff14fish.carbuncleplushy.com/')">
                  FFX|V Fish Tracker App
                </a>
              </li>
              <li><a @click="goTo('http://garlandtools.org/db/')">Garland Data</a></li>
              <li><a @click="goTo('https://cn.ff14angler.com/')">饥饿的猫</a></li>
            </ul>
            <li>
              游戏内相关数据(英文)：
              <a @click="goTo('https://xivapi.com/')">
                A FINAL FANTASY XIV: Online REST API
              </a>
            </li>
            <li>
              游戏内相关数据(中文)：
              <a @click="goTo('https://github.com/thewakingsands/ffxiv-datamining-cn')">
                ffxiv-datamining-cn
              </a>
            </li>
            <li>
              道具悬浮提示框：
              <a @click="goTo('https://github.com/thewakingsands/cafe-kit')"> cafe-kit</a>
            </li>
            <li>
              FF XIV 字体：
              <a @click="goTo('https://github.com/thewakingsands/ffxiv-axis-font-icons')">
                ffxiv-axis-font-icons
              </a>
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <div class="d-flex flex-column flex-fill">
            <reset-button />
            <click-helper @click="showAboutDialog = false">
              <v-btn class="mt-2" color="default" block text>
                {{ $t('general.dialog.close') }}
              </v-btn>
            </click-helper>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showCheckStartSetupDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>
          更新程序下载完成Test
        </v-card-title>
        <v-card-text>
          <div>请双击随后打开文件夹中的 PastryFishSetup.exe 更新</div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="startUpdate" color="primary" block>
            开始更新
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <import-export-dialog v-model="showImportExport" />
    <bait-dialog
      v-model="showBaitDialog"
      :show-setting.camel.sync="showBaitNotificationSetting"
    />
    <chrome-time-zone-bug-dialog v-model="showChromeTimeZoneBugDialog" />
    <fish302-migration-dialog v-model="showMigrationDialog" />
    <v-snackbar
      :timeout="2000"
      v-model="snackbar.show"
      :color="snackbar.color"
      centered
      elevation="24"
    >
      <div class="text-center">{{ snackbar.text }}</div>
    </v-snackbar>
    <v-snackbar
      :timeout="baitIdsForNotification.length > 1 ? -1 : 5000"
      v-model="showBaitNotification"
      elevation="24"
    >
      <div class="d-flex align-center" v-if="baitIdsForNotification.length === 1">
        <item-icon
          :icon-class="getItemIconClass(baitIdsForNotification[0])"
          small
          class="mt-1"
        />
        <span>{{ getItemName(baitIdsForNotification[0]) }}</span>
        <span class="ml-2">已钓完所有鱼</span>
      </div>
      <div class="d-flex align-center" v-else>
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-header> 多个鱼饵已钓完所有鱼 </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div class="d-flex flex-wrap">
                <div
                  class="d-flex align-center"
                  v-for="baitId in baitIdsForNotification"
                  :key="baitId"
                >
                  <item-icon :icon-class="getItemIconClass(baitId)" small class="mt-1" />
                  <span>{{ getItemName(baitId) }}</span>
                </div>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn color="primary" text v-bind="attrs" @click="showBaitDialogOfSetting">
          设置
        </v-btn>
        <v-btn color="error" text v-bind="attrs" @click="showBaitNotification = false">
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import EorzeaTime from '@/utils/Time'
import '@thewakingsands/axis-font-icons'
import { mapGetters, mapMutations, mapState } from 'vuex'
import helpHTML from '@/assets/doc/help.html'
import { version } from '../package.json'
import ResetButton from '@/components/ResetButton'
import ClickHelper from '@/components/basic/ClickHelper'
import DataUtil from '@/utils/DataUtil'
import FishSettingDialog from '@/components/FishSettingDialog'
import NotificationUtil from '@/utils/NotificationUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import ClipboardJS from 'clipboard'
import hotkeys from 'hotkeys-js'
import { Howl } from 'howler'
import _ from 'lodash'
import FishWindow from '@/utils/FishWindow'
import FishSearch from '@/components/FishSearch'
import ImportExportDialog from '@/components/ImportExportDialog'
import ImgUtil from '@/utils/ImgUtil'
import FIX from '@/store/fix'
import placeNames from '@/store/placeNames.json'
import regionTerritorySpots from '@/store/fishingSpots.json'
import DATA_CN from '@/store/translation'
import PatchNoteDialog from '@/components/Dialog/PatchNoteDialog'
import BaitDialog from '@/components/Dialog/BaitDialog'
import ItemIcon from '@/components/basic/ItemIcon'
import ChromeTimeZoneBugDialog from '@/components/Dialog/ChromeTimeZoneBugDialog'
import Fish302MigrationDialog from '@/components/Dialog/Fish302MigrationDialog'

export default {
  name: 'App',
  components: {
    Fish302MigrationDialog,
    ChromeTimeZoneBugDialog,
    ItemIcon,
    BaitDialog,
    PatchNoteDialog,
    ImportExportDialog,
    FishSearch,
    FishSettingDialog,
    ClickHelper,
    ResetButton,
  },
  data: vm => ({
    THEME_MODE_ICONS: ['mdi-weather-night', 'mdi-weather-sunny', 'mdi-brightness-auto'],
    systemThemeMode: 'DARK',
    THEME_SETTING_MODES: DataUtil.THEME_SETTING_MODES,
    achievementScore40: ImgUtil.getImgUrl('ocean-fishing-score-achievement-40x40.png'),
    showJumpingOverlay: false,
    now: Date.now(),
    fisher: ImgUtil.getImgUrl('pastry-fish.png'),
    version,
    helpHTML,
    noOp: DataUtil.noOp,
    showHelpDialog: false,
    showAboutDialog: false,
    showSettingDialog: false,
    showPatchNoteDialog: false,
    collapse: false,
    // listFishCnt: [{ cnt: 0 }, { cnt: 0 }, { cnt: 0 }],
    TABS: DataUtil.TABS,
    title:
      vm.$t('top.systemBarTitle') +
      (DevelopmentModeUtil.isTest() ? vm.$t('top.testSuffix') : ''),
    drawer: true,
    mini: true,
    lazySourceFishList: [],
    lazySourceImportantFishList: [],
    lazyTransformedFishList: [],
    lazyTransformedFishDict: {},
    lazyFishConstraintDict: {},
    // weatherChangeTrigger: 1,
    sortedFishIds: [],
    fishListTimePart: {},
    notifiedBefore: 0,
    searchedFishId: undefined,
    selectedFishId: undefined,
    selectedFishFirstSpotId: undefined,
    fishListWeatherChangePart: {},
    extraFishListTimePart: {},
    lazyFishWindowRates: {},
    diademDark: ImgUtil.getImgUrl('diadem-dark-24x24.png'),
    diademLight: ImgUtil.getImgUrl('diadem-light-24x24.png'),
    showBaitDialog: false,
    showBaitNotificationSetting: false,
    showBaitNotification: false,
    showChromeTimeZoneBugDialog: false,
    showMigrationDialog: false,
    showCheckStartSetupDialog: false,
  }),
  computed: {
    // TODO: CHECK different with real eorzea time of 1 minute
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return DataUtil.formatDateTime(this.now, 'HH:mm')
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    listFishCntForMini() {
      return this.listFishCnt.slice(0, 2)
    },
    allFish() {
      return this.fish
    },
    filteredFishIdSet() {
      const idSet = new Set()
      this.lazyTransformedFishList
        .filter(fish => {
          const fishCompleted = this.getFishCompleted(fish.id)
          const isBigFish = this.bigFish.includes(fish.id)
          const isLivingLegend = DATA_CN.LIVING_LEGENDS.includes(fish.id)
          const restricted = this.lazyFishConstraintDict[fish.id]
          return (
            this.filters.patches.includes(DataUtil.toFishFilterPatch(fish.patch)) &&
            ((this.filters.completeTypes.includes('COMPLETED') && fishCompleted) ||
              (this.filters.completeTypes.includes('UNCOMPLETED') && !fishCompleted)) &&
            ((this.filters.bigFishTypes.includes('LIVING_LEGENDS') && isLivingLegend) ||
              (this.filters.bigFishTypes.includes('OLD_ONES') &&
                isBigFish &&
                !isLivingLegend) ||
              (this.filters.bigFishTypes.includes('NORMAL') && !isBigFish)) &&
            (this.filters.fishConstraintTypes.includes('RESTRICTED') === restricted ||
              this.filters.fishConstraintTypes.includes('NOT_RESTRICTED') === !restricted)
          )
        })
        .forEach(it => idSet.add(it._id))
      return idSet
    },
    baitFilteredFishIdSet() {
      const list = Array.from(this.filteredFishIdSet)
      const idSet = new Set()
      const baitIds = this.baitFilterIds
      list
        .filter(fishId => {
          const fish = this.allFish[fishId]
          return (
            !this.baitFilterEnabled ||
            (fish.bestCatchPath != null && baitIds.includes(fish.bestCatchPath[0]))
          )
        })
        .forEach(it => {
          idSet.add(it)
        })
      // console.log(baitIds)
      // console.log(Array.from(idSet))
      return idSet
    },
    sortedFilteredFishList() {
      const idSet = this.baitFilteredFishIdSet
      let countdownSortedFishList = this.sortedFishIds
        .filter(id => idSet.has(id))
        .map(id => this.lazyTransformedFishDict[id])
        .filter(it => !this.getFishPinned(it.id))
      // .filter((it, index) => this.filters.fishN === -1 || index < this.filters.fishN)

      if (this.filters.sorterType === 'RATE') {
        const firstWaitingFishLongerThanTwoHoursIndex = countdownSortedFishList.findIndex(
          fish => {
            const countDownType =
              this.fishListTimePart[fish._id]?.countDown.type ?? DataUtil.ALL_AVAILABLE
            if (countDownType === DataUtil.FISHING) {
              return false
            }
            const countDownTime =
              this.fishListTimePart[fish._id]?.countDown?.time ??
              DataUtil.INTERVAL_HOUR * 2
            if (countDownTime >= DataUtil.INTERVAL_HOUR * 2) {
              return true
            }
          }
        )

        const rateSortExcludedFish =
          firstWaitingFishLongerThanTwoHoursIndex === -1
            ? []
            : countdownSortedFishList.splice(
                firstWaitingFishLongerThanTwoHoursIndex,
                countdownSortedFishList.length - firstWaitingFishLongerThanTwoHoursIndex
              )

        countdownSortedFishList = _.sortBy(countdownSortedFishList, [
          fish =>
            this.fishListTimePart[fish._id]?.countDown.type ?? DataUtil.ALL_AVAILABLE,
          fish => this.lazyFishWindowRates[fish._id],
        ]).concat(rateSortExcludedFish)
      }

      return countdownSortedFishList
    },
    pinnedFishList() {
      const fishSourceList = this.lazyTransformedFishList
      const sortedFishIds = this.sortedFishIds
      return _.sortBy(
        fishSourceList.filter(it => this.getFishPinned(it.id)),
        [
          fish => {
            if (this.filters.sorterType === 'COUNTDOWN') {
              return 1
            } else {
              return this.lazyFishWindowRates[fish.id]
            }
          },
          fish => {
            const index = sortedFishIds.indexOf(fish.id)
            if (index === -1) {
              return sortedFishIds.length
            } else {
              return index
            }
          },
          fish => fish.id,
        ]
      )
    },
    listFishCnt() {
      const fishListTimePart = this.fishListTimePart
      const doFullCountSearch = [true, false, true]
      const allListCnt = [
        this.pinnedFishList,
        this.sortedFilteredFishList,
        this.toBeNotifiedFishList,
      ].map((list, index) => {
        if (Object.keys(fishListTimePart).length === 0) {
          return {
            type: DataUtil.COUNT_DOWN_TYPE[DataUtil.FISHING],
            cnt: 0,
          }
        }

        if (doFullCountSearch[index]) {
          return {
            type: DataUtil.COUNT_DOWN_TYPE[DataUtil.FISHING],
            cnt: list.reduce((cnt, fish) => {
              return (
                cnt +
                (fishListTimePart[fish.id]?.countDown?.type === DataUtil.FISHING ? 1 : 0)
              )
            }, 0),
          }
        } else {
          const firstNotFishingIndex = list.findIndex(
            it => fishListTimePart[it.id]?.countDown?.type !== DataUtil.FISHING
          )
          return {
            type: DataUtil.COUNT_DOWN_TYPE[DataUtil.FISHING],
            cnt: firstNotFishingIndex === -1 ? list.length : firstNotFishingIndex,
          }
        }
      })
      return [
        { type: allListCnt[1].type, cnt: allListCnt[0].cnt + allListCnt[1].cnt },
        allListCnt[2],
      ]
    },
    toBeNotifiedFishList() {
      const fishSourceList = this.lazyTransformedFishList
      const sortedFishIds = this.sortedFishIds
      return _.sortBy(
        fishSourceList.filter(it => this.getFishToBeNotified(it.id)),
        [
          fish => {
            if (this.filters.sorterType === 'COUNTDOWN') {
              return 1
            } else {
              return this.lazyFishWindowRates[fish.id]
            }
          },
          fish => sortedFishIds.indexOf(fish.id),
        ]
      )
    },
    selectedFish() {
      const fish = this.allFish[this.selectedFishId]
      if (fish) {
        return {
          ...fish,
          parts: {
            firstSpotId: this.selectedFishFirstSpotId,
            fishTimePart: this.extraFishListTimePart[this.selectedFishId],
            fishWeatherChangePart: this.fishListWeatherChangePart[this.selectedFishId],
            predators: DataUtil.getPredators(
              fish,
              this.lazyTransformedFishDict,
              this.fishListTimePart,
              this.fishListWeatherChangePart
            ),
          },
        }
      } else {
        return undefined
      }
    },
    isListPage() {
      return this.$route.name === 'ListPage'
    },
    isWikiPage() {
      return this.$route.name === 'WikiPage'
    },
    showSearch: {
      get() {
        return this.showSearchDialog
      },
      set(showSearch) {
        this.setShowSearchDialog(showSearch)
      },
    },
    showImportExport: {
      get() {
        return this.showImportExportDialog
      },
      set(show) {
        this.setShowImportExportDialog(show)
      },
    },
    // themeModeComputed: {
    //   get() {
    //     return this.themeMode
    //   },
    //   set(dark) {
    //     this.setThemeMode(dark)
    //   },
    // },
    showHatCover: {
      get() {
        return this.startLight
      },
      set(startLight) {
        this.setStartLight(startLight)
        this.showJumpingOverlay = true
        this.$nextTick(() => window.location.reload())
      },
    },
    inMigrationPage() {
      return this.$route.name === 'MigrationPage'
    },
    inStartLight() {
      return (
        this.now >= FIX.STARLIGHT_CELEBRATION.startTime &&
        this.now <= FIX.STARLIGHT_CELEBRATION.endTime
      )
    },
    dark() {
      if (this.themeMode === 'AUTO') {
        return this.systemThemeMode === 'DARK'
      } else {
        return this.themeMode === 'DARK'
      }
    },
    themeModeIndex() {
      return DataUtil.THEME_SETTING_MODES.indexOf(this.themeMode)
    },
    ...mapState([
      'loading',
      'snackbar',
      'activeTabIndex',
      'showSearchDialog',
      'fish',
      'items',
      'fishingSpots',
      'zones',
      'bigFish',
      'sounds',
      'showImportExportDialog',
      'newPatchFish',
      'folklore',
      'weatherRates',
      'baitFilterEnabled',
      'baitFilterIds',
      'baitIdsForNotification',
    ]),
    ...mapGetters([
      'showChromeBugDialog',
      'opacity',
      'websiteVersion',
      'getFishToBeNotified',
      'getFishCompleted',
      'filters',
      'showFilter',
      'showBanner',
      'getFishPinned',
      'rightPanePercentage',
      'getItemName',
      'getItemIconClass',
      'getZoneName',
      'getFishingSpotsName',
      'getBaits',
      'getWeather',
      'getFishToBeNotified',
      'notification',
      'getItemIconUrl',
      'isSystemNotificationEnabled',
      'getFishingSpots',
      'themeMode',
      'startLight',
      'getAchievementName',
      'getAchievementIconClass',
    ]),
  },
  watch: {
    baitIdsForNotification(baitIdsForNotification) {
      if (baitIdsForNotification.length > 0) {
        this.showBaitNotification = true
      }
    },
    // filters() {
    //   this.startLoading()
    // },
    isMobile: {
      handler(isMobile) {
        if (isMobile) {
          this.mini = false
          this.drawer = false
        } else {
          this.drawer = true
        }
      },
      immediate: true,
    },
    dark: {
      handler(dark) {
        this.$vuetify.theme.dark = dark
      },
      immediate: true,
    },
    fishListTimePart: {
      handler: function(fishListTimePart) {
        const newSortedFishIds = _.sortBy(fishListTimePart, [
          'countDown.type',
          'countDown.time',
        ]).map(it => it.id)
        if (!_.isEqual(this.sortedFishIds, newSortedFishIds)) {
          this.sortedFishIds = newSortedFishIds
        }
      },
      deep: true,
    },
    listFishCnt(listFishCnt) {
      this.$emit('fishCntUpdated', listFishCnt)
    },
    // weatherChangeTrigger() {
    // this.updateWeatherChangePart(this.now)
    // },
  },
  created() {
    // if (window.location.href.indexOf('fish.ricecake302.com') === -1) {
    //   this.showMigrationDialog = true
    // }

    if (DataUtil.isBugChromeTimeZone()) {
      this.showChromeTimeZoneBugDialog = this.showChromeBugDialog
    }

    console.debug(process.env.commit_hash)

    if (DevelopmentModeUtil.isElectron()) {
      window.electron?.ipcRenderer
        ?.on('fishingData', (event, data) => {
          console.log(JSON.stringify(data))
          // this.dataStatus = {
          //   ...data.status,
          //   effects: Array.from(data.status && data.status.effects),
          // }
          // this.dataCurrentRecord = data.currentRecord
          // this.dataRecords = data.records
          // this.dataReadableRecords = data.readableRecords
        })
        ?.on('setupDownload', (event, data) => {
          console.log(data)
        })
        ?.on('checkStartSetup', () => {
          this.showCheckStartSetupDialog = true
        })
    }

    this.startLoading()
    // this.drawer = !this.isMobile

    this.systemThemeMode =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'DARK'
        : 'LIGHT'
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.systemThemeMode = e.matches ? 'DARK' : 'LIGHT'
    })

    hotkeys('/', event => {
      if (!this.showSearchDialog) {
        this.setShowSearchDialog(true)
      }
      event.preventDefault()
    })
  },
  async mounted() {
    // setTimeout(async () => {
    this.initialUserData()

    if (
      DataUtil.toComparableVersion(this.version) >
      DataUtil.toComparableVersion(this.websiteVersion)
    ) {
      this.showPatchNoteDialog = true
    }
    this.cafeKitTooltipCopyPatch()

    this.now = Date.now()
    this.lazySourceFishList = Object.values(this.allFish).filter(
      it => it.patch == null || it.patch <= DataUtil.PATCH_MAX
    )
    this.checkFishNeedSplit(this.lazySourceFishList)
    this.lazySourceImportantFishList = this.lazySourceFishList.filter(it =>
      DataUtil.showFishInList(it)
    )
    this.updateWeatherChangePart(this.now)

    this.lazyFishConstraintDict = _.mapValues(
      this.fishListWeatherChangePart,
      it => it.fishWindows.length > 0
    )

    this.lazyTransformedFishList = this.assembleFish(this.lazySourceFishList).concat(
      this.assembleOceanFishList()
    )
    this.lazyTransformedFishDict = DataUtil.toMap(
      this.lazyTransformedFishList,
      fish => fish.id
    )
    const sounds = await this.loadingSounds()
    this.setSounds(DataUtil.toMap(sounds, it => it.key))

    setInterval(() => {
      const now = Date.now()
      this.now = now
      this.updateFishListTimePart(now)
      this.checkNotification(now)
      if (this.loading) {
        this.finishLoading()
      }
    }, 1000)

    // this.weatherChangeTrigger *= -1
    // setInterval(() => {
    //   this.weatherChangeTrigger *= -1
    // }, Math.floor(WEATHER_CHANGE_INTERVAL_EARTH))
    // }, 200)
  },
  methods: {
    startUpdate() {
      window.electron?.ipcRenderer?.send('startUpdate')
    },
    onFishSelected({ fishId, firstSpotId }) {
      this.selectedFishId = fishId
      this.selectedFishFirstSpotId = firstSpotId
    },
    showBaitDialogOfSetting() {
      this.showBaitDialog = true
      this.showBaitNotificationSetting = true
    },
    selectThemeMode(index) {
      this.setThemeMode(DataUtil.THEME_SETTING_MODES[index])
    },
    checkFishNeedSplit(fishList) {
      const spot2FishList = _.mapValues(
        _.keyBy(
          regionTerritorySpots.flatMap(it => it.territories.flatMap(t => t.spots)),
          'id'
        ),
        spot => spot.fishList
      )

      return fishList.forEach(fish => {
        const notAvailableSpots = []
        fish.locations.forEach(spotId => {
          const availableFishList = spot2FishList[spotId]
          if (
            fish.bestCatchPath != null &&
            !fish.bestCatchPath
              .slice(1)
              .every(smallFish => availableFishList.includes(smallFish))
          ) {
            notAvailableSpots.push(spotId)
          }
        })
        if (notAvailableSpots.length > 0) {
          console.log(
            this.getItemName(fish._id),
            fish._id,
            notAvailableSpots,
            notAvailableSpots.map(spotId => this.fishingSpots[spotId].name_chs)
          )
          return
        }

        if (
          fish.locations.length === 1 ||
          (fish.previousWeatherSet.length === 0 && fish.weatherSet.length === 0)
        ) {
          // return fish
          return
        }

        const territories = _.mapValues(
          _.groupBy(
            fish.locations.map(location => {
              return {
                key: JSON.stringify(
                  this.weatherRates[this.fishingSpots[location]?.territory_id]
                    ?.weather_rates
                ),
                location: location,
              }
            }),
            'key'
          ),
          infoList => infoList.map(it => it.location)
        )

        if (Object.keys(territories).length > 1) {
          console.log(this.getItemName(fish._id), fish._id, territories)
          // return Object.values(territories).map(locations => {
          //   return {
          //     ...fish,
          //     locations,
          //   }
          // })
        } else {
          // return fish
        }
      })
    },
    updateWeatherChangePart(now) {
      this.fishListWeatherChangePart = this.lazySourceImportantFishList.reduce(
        (fish2WeatherPart, fish) => {
          fish2WeatherPart[fish._id] = {
            fishWindows: this.getFishWindow(fish, now),
          }
          return fish2WeatherPart
        },
        {}
      )

      if (Object.keys(this.lazyFishWindowRates).length === 0) {
        this.lazySourceImportantFishList.forEach(fish => {
          const fishWindows = this.fishListWeatherChangePart[fish._id]?.fishWindows
          this.lazyFishWindowRates[fish._id] = DataUtil.computeRate(fishWindows)
        })
      }
    },
    loadingSounds() {
      return Promise.all(
        DataUtil.NOTIFICATION_SOUNDS.map(sound => {
          if (sound.filename == null)
            return Promise.resolve({ key: sound.key, player: null })
          return import(`@/assets/sound/${sound.filename}`).then(it => {
            return {
              key: sound.key,
              player: new Howl({ src: it?.default, preload: true }),
            }
          })
        })
      )
    },
    updateFishListTimePart(now) {
      this.lazySourceImportantFishList.forEach(fish => {
        const countDown = this.fishListTimePart[fish._id]?.countDown
        // if (fish._id === 999999) {
        //   console.debug(countDown)
        // }
        if (countDown?.type === DataUtil.ALL_AVAILABLE) return

        const lazyStartTime = countDown?.timePoint
        const currentInterval = countDown?.time
        if (
          (this.selectedFishId != null && fish._id === this.selectedFishId) ||
          (this.searchedFishId != null && fish._id === this.searchedFishId)
        ) {
          this.$set(this.extraFishListTimePart, fish._id, {
            id: fish._id,
            countDown: this.getCountDown(fish, now),
          })
        }

        if (
          !lazyStartTime ||
          !currentInterval ||
          DataUtil.shouldUpdate(lazyStartTime - now, currentInterval)
        ) {
          this.$set(this.fishListTimePart, fish._id, {
            id: fish._id,
            countDown: this.getCountDown(fish, now),
          })
        }
      })
    },
    checkNotification(now) {
      const rangeToEnsureAlarm = DataUtil.INTERVAL_SECOND * 2
      let notifications = []
      this.toBeNotifiedFishList.forEach(fish => {
        const countDown = this.fishListTimePart[fish.id]?.countDown
        if (countDown?.type === DataUtil.ALL_AVAILABLE) return false

        this.notification.settings.forEach(setting => {
          if (setting.enabled) {
            const fishWindows = this.fishListWeatherChangePart[fish.id]?.fishWindows ?? []
            fishWindows
              .map(fishWindow => fishWindow[0] - now)
              .filter((it, index) => it > 0 && index < 2)
              .some(interval => {
                // console.log(fish.id)
                const notifyMin = setting.before * DataUtil.INTERVAL_MINUTE
                const notifyMax = notifyMin + rangeToEnsureAlarm

                // let d = new Date(interval)
                // console.log(d.getUTCMinutes(), d.getUTCSeconds())
                // d = new Date(notifyMax)
                // console.log(d.getUTCMinutes(), d.getUTCSeconds())
                // console.log(interval < notifyMax && interval > notifyMin)
                if (interval < notifyMax && interval > notifyMin) {
                  // soundsToPlay.add(setting.sound)
                  notifications.push({ fish, setting })
                  return true
                } else {
                  return false
                }
              })
          }
        })
      })
      const toRingBell = notifications.length > 0

      if (toRingBell && this.notifiedBefore === 0) {
        this.ringBell(notifications.map(it => it.setting.sound))
        if (this.isSystemNotificationEnabled) {
          NotificationUtil.showFishNotification(notifications)
        }
        this.notifiedBefore = 3
      } else if (this.notifiedBefore > 0) {
        this.notifiedBefore--
      }
    },
    ringBell(soundsToPlay) {
      soundsToPlay.forEach(key => {
        this.sounds[key]?.player?.volume(this.notification.volume).play()
      })
    },
    assembleOceanFishList() {
      const fishList = Object.values(FIX.OCEAN_FISHING_FISH)
      return fishList.map(fish => this.assembleOceanFish(fish))
    },
    assembleOceanFish(fish) {
      const hasPredators = fish.predators && Object.keys(fish.predators).length > 0
      const bonus = FIX.OCEAN_FISHING_BONUS[fish.bonus]
      const realNotAvailableWeatherSet = this.getRealNotAvailableWeatherSet(fish._id)
      return {
        ...fish,
        id: fish._id,
        type: 'normal',
        name: this.getItemName(fish._id),
        icon: this.getItemIconClass(fish._id),
        hasFishingSpot: fish.locations.length !== 0,
        fishingSpots: this.getFishingSpots(fish.locations),
        baitId: fish.bait,
        bait: {
          id: fish.bait,
          name: this.getItemName(fish.bait),
          icon: this.getItemIconClass(fish.bait),
        },
        baitExtraId: fish.baitExtra,
        baitExtra: fish.baitExtra
          ? {
              id: fish.baitExtra,
              name: this.getItemName(fish.baitExtra),
              icon: this.getItemIconClass(fish.baitExtra),
            }
          : null,
        baits: this.getBaits(fish, undefined, FIX.OCEAN_FISHING_FISH),
        tug: fish.tug,
        tugIcon: DataUtil.TUG_ICON[fish.tug],
        biteTimeForSort: fish.biteTimeMin * 100 + (fish.biteTimeMax ?? 0),
        hasWeatherConstraint: fish.notAvailableWeatherSet.length > 0,
        hasRealWeatherConstraint:
          realNotAvailableWeatherSet.length > fish.notAvailableWeatherSet.length,
        notAvailableWeatherSetDetail: this.getWeather(realNotAvailableWeatherSet),
        notAvailableWeatherSet: realNotAvailableWeatherSet,
        time: fish.time,
        timeText: DataUtil.timeId2TimeText(fish.time),
        timeIcon: DataUtil.timeId2TimeIcon(fish.time),
        hasPredators: hasPredators,
        predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
        predators: hasPredators ? this.getOceanFishPredators(fish.predators) : [],
        bonusId: fish.bonus,
        bonus: {
          name: bonus.objective,
          icon: DataUtil.iconIdToClass(bonus.icon),
        },
      }
    },
    getRealNotAvailableWeatherSet(fishId) {
      const fish = FIX.OCEAN_FISHING_FISH[fishId]
      if (fish == null) return []

      const predatorIds = fish.predators ? Object.keys(fish.predators) : []
      return _.union(
        fish.notAvailableWeatherSet,
        fish.bestCatchPathExtra.length === 0
          ? fish.bestCatchPath.flatMap(fishId => {
              return this.getRealNotAvailableWeatherSet(fishId)
            })
          : _.intersection(
              fish.bestCatchPath.flatMap(fishId => {
                return this.getRealNotAvailableWeatherSet(fishId)
              }),
              fish.bestCatchPathExtra.flatMap(fishId => {
                return this.getRealNotAvailableWeatherSet(fishId)
              })
            ),
        predatorIds.flatMap(fishId => this.getRealNotAvailableWeatherSet(fishId))
      )
    },
    getOceanFishPredators(predators) {
      if (predators == null || Object.keys(predators).length === 0) {
        return []
      } else {
        return Object.entries(predators).map(([predatorId, count]) => {
          return {
            ...this.assembleOceanFish(FIX.OCEAN_FISHING_FISH[predatorId]),
            requiredCnt: count,
          }
        })
      }
    },
    assembleSpearFish(fish, isPredator = false) {
      const hasPredators = Object.keys(fish.predators).length > 0
      const rate = this.lazyFishWindowRates[fish._id]
      return {
        _id: fish._id,
        id: fish._id,
        type: 'spear',
        icon: this.getItemIconClass(fish._id),
        iconRemoteUrl: null,
        showHatCover: false,
        name: this.getItemName(fish._id),
        hasFishingSpot: true,
        fishingSpots: fish.locations.map(location => {
          const gatheringPoint = FIX.SPEAR_FISH_GATHERING_POINTS[location]
          return {
            zone: placeNames[gatheringPoint.territoryPlaceNameId],
            fishingSpot: gatheringPoint,
            fishingSpotName: DataUtil.getName(gatheringPoint),
            fishingSpotId: location,
            fishSpotPositionText: DataUtil.toPositionText(gatheringPoint),
          }
        }),
        baitsExtra: [],
        baits: [],
        hasFishEyes: false,
        hasPredators: hasPredators,
        hasSnagging: false,
        startHourText: DataUtil.formatET(fish.startHour),
        endHourText: DataUtil.formatET(fish.endHour),
        hasTimeConstraint: fish.startHour !== 0 || fish.endHour !== 24,
        requiredCnt: fish.requiredCnt ?? 0,
        addBuffSuffix: false,
        hasWeatherConstraint:
          fish.previousWeatherSet.length > 0 || fish.weatherSet.length > 0,
        previousWeatherSet: fish.previousWeatherSet,
        weatherSet: fish.weatherSet,
        previousWeatherSetDetail: this.getWeather(fish.previousWeatherSet),
        weatherSetDetail: this.getWeather(fish.weatherSet),
        patch: fish.patch,
        patchText:
          fish.patch.toString().indexOf('.') !== -1
            ? fish.patch.toString()
            : fish.patch.toFixed(1),
        folklore: null,
        collectable: fish.collectable,
        isFuturePatch: fish.patch > DataUtil.PATCH_AVAILABLE_MAX,
        rate: rate,
        rateText: this.$t('countDown.rate', {
          rate: ((rate ?? 1) * 100).toPrecision(2),
        }),
        isPredator: isPredator,
        anglerFishId: fish.anglerFishId,
        hasTips: DataUtil.hasTips(fish._id),
        predators: hasPredators ? this.getSpearFishPredators(fish.predators) : [],
        gig: fish.gig
          ? {
              id: fish.gig,
              type: DataUtil.GIG_DICT[fish.gig],
              icon: DataUtil.GIG_ICON[DataUtil.GIG_DICT[fish.gig]],
              text: this.$t('gig.' + DataUtil.GIG_DICT[fish.gig]),
            }
          : {},
      }
    },
    getSpearFishPredators(predators) {
      if (predators == null || Object.keys(predators).length === 0) {
        return []
      } else {
        return Object.entries(predators).map(([predatorId, count]) => {
          return {
            ...this.assembleSpearFish(FIX.SPEAR_FISH[predatorId], true),
            requiredCnt: count,
          }
        })
      }
    },
    assembleFish(fishSourceList, isPredator = false) {
      return fishSourceList.map(fish => {
        if (fish.gig != null) {
          // console.log('spear fish', fish)
          return this.assembleSpearFish(fish)
        }
        const hasPredators = Object.keys(fish.predators).length > 0
        const rate = this.lazyFishWindowRates[fish._id]
        const bestCatchPathExtra = fish.bestCatchPathExtra ?? []
        const folklore = fish.folklore && this.folklore[fish.folklore]
        return {
          // TODO remove _id
          _id: fish._id,
          id: fish._id,
          type: 'normal',
          icon: this.getItemIconClass(fish._id),
          iconRemoteUrl: this.getItemIconUrl(fish._id),
          showHatCover:
            this.inStartLight &&
            this.showHatCover &&
            FIX.STARLIGHT_CELEBRATION.fish.includes(fish._id),
          name: this.getItemName(fish._id),
          hasFishingSpot: fish.locations.length !== 0,
          // zone: this.getZoneName(fish.location),
          // fishingSpot: this.getFishingSpotsName(fish.location),
          fishingSpots: this.getFishingSpots(fish.locations),
          // .map(location => {
          // return {
          //   zone: this.getZoneName(location),
          //   fishingSpotName: this.getFishingSpotsName(location),
          //   fishingSpotId: location,
          // }
          // }),
          baitsExtra:
            bestCatchPathExtra.length > 0 ? this.getBaits(fish, bestCatchPathExtra) : [],
          baits: this.getBaits(fish),
          hasFishEyes: fish.fishEyes !== false,
          fishEyesIcon: DataUtil.iconIdToClass(DataUtil.ICON_FISH_EYES),
          fishEyesText: DataUtil.secondsToFishEyesString(fish.fishEyes),
          fishEyesSeconds: fish.fishEyes,
          hasPredators: hasPredators,
          predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
          hasSnagging: fish.snagging,
          snaggingIcon: DataUtil.iconIdToClass(DataUtil.ICON_SNAGGING),
          startHourText: fish.startHourText ?? DataUtil.formatET(fish.startHour),
          endHourText: fish.endHourText ?? DataUtil.formatET(fish.endHour),
          hasTimeConstraint: fish.startHour !== 0 || fish.endHour !== 24,
          requiredCnt: fish.requiredCnt ?? 0,
          addBuffSuffix: hasPredators && DataUtil.isAllAvailableFish(fish),
          hasWeatherConstraint:
            fish.previousWeatherSet.length > 0 || fish.weatherSet.length > 0,
          previousWeatherSet: fish.previousWeatherSet,
          weatherSet: fish.weatherSet,
          previousWeatherSetDetail: this.getWeather(fish.previousWeatherSet),
          weatherSetDetail: this.getWeather(fish.weatherSet),
          patch: fish.patch,
          patchText:
            fish.patch.toString().indexOf('.') !== -1
              ? fish.patch.toString()
              : fish.patch.toFixed(1),
          folklore: folklore && {
            id: folklore._id,
            itemId: folklore.itemId,
            name: this.getItemName(folklore.itemId),
            icon: this.getItemIconClass(folklore.itemId),
          },
          collectable: fish.collectable,
          isFuturePatch: fish.patch > DataUtil.PATCH_AVAILABLE_MAX,
          rate: rate,
          rateText: this.$t('countDown.rate', {
            rate: ((rate ?? 1) * 100).toPrecision(2),
          }),
          isPredator: isPredator,
          anglerFishId: fish.anglerFishId,
          hasTips: DataUtil.hasTips(fish._id),
          predators: this.assembleFish(DataUtil.getPredators(fish, this.allFish), true),
        }
      })
    },
    getCountDown(fish, now) {
      // utilize 8 hours fish windows computed if exists
      // and not out of time(use 2 fish window cached if necessary)
      const fishingSpot = fish.gig != null ? null : this.fishingSpots[fish.locations[0]]
      if (fishingSpot || fish.gig != null) {
        const remainingFishWindows = (
          this.fishListWeatherChangePart[fish._id]?.fishWindows ?? []
        ).filter(it => it[1] > now)

        const missingFishWindowN =
          FishWindow.FISH_WINDOW_FORECAST_N - remainingFishWindows.length

        let fishWindowsComputed
        if (missingFishWindowN > 0) {
          fishWindowsComputed = DataUtil.getFishWindow(
            fish,
            now,
            this.allFish,
            this.fishingSpots
          )
        } else {
          fishWindowsComputed = remainingFishWindows
        }
        this.fishListWeatherChangePart[fish._id] = {
          ...this.fishListWeatherChangePart[fish._id],
          fishWindows: fishWindowsComputed,
        }

        let targetFishWindow
        let nextTargetFishWindow

        for (let i = 0; i < fishWindowsComputed.length; i++) {
          if (fishWindowsComputed[i][1] >= now) {
            targetFishWindow = fishWindowsComputed[i]
            if (i + 1 < fishWindowsComputed.length) {
              nextTargetFishWindow = fishWindowsComputed[i + 1]
            }
            break
          }
        }

        if (targetFishWindow == null) {
          return { type: DataUtil.ALL_AVAILABLE }
        }
        if (now <= targetFishWindow[0]) {
          return {
            type: DataUtil.WAITING,
            time: targetFishWindow[0] - now,
            timePoint: targetFishWindow[0],
            fishWindowTotal: targetFishWindow[1] - targetFishWindow[0],
          }
        } else if (now <= targetFishWindow[1]) {
          return {
            type: DataUtil.FISHING,
            time: targetFishWindow[1] - now,
            timePoint: targetFishWindow[1],
            fishWindowTotal: targetFishWindow[1] - targetFishWindow[0],
            nextInterval: nextTargetFishWindow
              ? nextTargetFishWindow[0] - now
              : undefined,
            nextTimePoint: nextTargetFishWindow ? nextTargetFishWindow[0] : undefined,
          }
        }
      } else {
        return { type: DataUtil.ALL_AVAILABLE }
      }
    },
    getFishWindow(fish, now) {
      return DataUtil.getFishWindow(fish, now, this.allFish, this.fishingSpots)
    },
    goTo(href) {
      window.open(href)
    },
    onConfirmPatchNote() {
      this.setWebsiteVersion(version)
      this.showPatchNoteDialog = false
    },
    toggleCollapse() {
      this.collapse = !this.collapse
    },
    setActiveTabLater(index) {
      setTimeout(() => this.setActiveTab(index), 500)
    },
    cafeKitTooltipCopyPatch() {
      new ClipboardJS('.cafekit.ck-popup .ck-container button', {
        text: trigger => {
          if (trigger.innerText === '已复制') {
            this.showSnackbar({
              text: this.$t('importExport.dialog.message.copySuccess'),
              color: 'success',
            })
            return window.document
              .getElementsByClassName('ck-item-name-name')[0]
              .innerText.trim()
          }
        },
      })
    },
    toPage(page) {
      if (this.$route.name !== page) {
        this.$router.push({ name: page })
      }
    },
    toPageSubList(tabIndex) {
      this.toPage('ListPage')
      this.setActiveTab(tabIndex)
    },
    toggleNavMini() {
      this.mini = !this.mini
    },
    showNavi() {
      if (this.isMobile) {
        this.drawer = !this.drawer
      }
    },
    onFishIconClicked() {
      this.toggleCollapse()
    },
    ...mapMutations([
      'toggleFilterPanel',
      'setShowSearchDialog',
      'setShowImportExportDialog',
      'setWebsiteVersion',
      'setActiveTab',
      'showSnackbar',
      'setSounds',
      'setThemeMode',
      'startLoading',
      'finishLoading',
      'setStartLight',
      'initialUserData',
    ]),
  },
}
</script>

<style>
@import './assets/css/fish_icons.css';
@import './assets/css/keys.css';

@font-face {
  font-family: 'FFXIV';
  src: url('./assets/font/FFXIV_Lodestone_SSF.ttf') format('truetype'),
    url('./assets/font/FFXIV_Lodestone_SSF.woff') format('woff');
  unicode-range: U+E020-E0DB;
}

.cafekit.ck-popup {
  z-index: 9999 !important;
}

/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
html,
body {
  /*overflow-y: hidden !important;*/
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.bscroll-vertical-scrollbar {
  z-index: 9998;
}

.resize-indicator {
  width: 0;
  height: 0;
  position: absolute;
  right: 0;
  bottom: 0;
  border-bottom: 8px solid #ffffff;
  border-left: 8px solid transparent;
}

.v-expansion-panel-header {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}

.min-page {
  background: rgba(255, 255, 255, 0) !important;
  /*height: 64px;*/
}

#write {
  margin: 0 !important;
  padding: 0 !important;
}

/*.fish-app-bar.v-toolbar.v-toolbar--collapsed {*/

/*  max-width: 64px !important;*/
/*}*/

.v-application .fish-app-bar.fish-app-bar--collapsed {
  background-color: #004d4066 !important;
  border: 2px solid;
}

/* scroller setting start */
/* The emerging W3C standard
   that is currently Firefox-only */

* {
  scrollbar-width: thin;
  scrollbar-color: #ffffff66 rgba(0, 0, 0, 0.2);
}

/* Works on Chrome/Edge/Safari */

*::-webkit-scrollbar {
  width: 6px;
}

*::-webkit-scrollbar-track {
  background: #ffffff00;
}

*::-webkit-scrollbar-thumb {
  background-color: #ffffff66;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.4);
}

/* scroller setting end */

.splitpanes--vertical .splitpanes__pane {
  -webkit-transition: unset !important;
  transition: unset !important;
  /*transition-property: width;*/
  /*transition-duration: 0.2s;*/
  /*transition-timing-function: ease-out;*/
  /*transition-delay: 0s;*/
}

.theme-switch .v-messages {
  display: none !important;
}

.theme-switch .v-input__slot {
  margin-bottom: 0;
}

body {
  overscroll-behavior: none;
}
</style>
