<template>
  <div class="window">
    <v-system-bar class="window-top-bar rounded-t vue-draggable-handle">
      <span class="mx-1">{{ pageTitle }}</span>
      <span class="mx-1" v-if="isMobile">mobile</span>
      <v-spacer />
      <v-btn @click="showSetting" x-small text>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn @click="close" x-small text>
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-system-bar>

    <div class="window-content no-drag">
      <v-toolbar height="56px" class="fish-app-bar" dense color="system">
        <v-tooltip bottom v-if="isWikiPage">
          <template v-slot:activator="{ on: tooltip, attrs }">
            <v-btn
              icon
              text
              v-bind="attrs"
              v-on="{ ...tooltip }"
              @click="showMapMenu = !showMapMenu"
            >
              <v-icon>mdi-map</v-icon>
            </v-btn>
          </template>
          <div>点击选择钓场</div>
        </v-tooltip>
        <v-spacer />
        <v-toolbar-items>
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

          <v-btn icon text v-if="isListPage" @click="toggleFilterPanel">
            <v-icon>mdi-filter</v-icon>
          </v-btn>

          <fish-eyes-toggle-button
            v-if="!isMobile && (isListPage || isWikiPage)"
            :value="fishEyesUsed"
            @input="toggleFishEyesUsed"
          />

          <v-btn
            icon
            text
            v-if="(isListPage || isWikiPage) && !isMobile"
            @click="showBaitDialog = true"
          >
            <v-icon>mdi-hook</v-icon>
          </v-btn>

          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip, attrs }">
              <v-btn
                icon
                text
                v-bind="attrs"
                v-on="{ ...tooltip }"
                @click="setShowSearchDialog(true)"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
            <div>按<kbd>/</kbd>键直接搜索</div>
          </v-tooltip>

          <v-menu offset-y v-if="!isMobile">
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn icon text v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                    <v-icon> mdi-theme-light-dark</v-icon>
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
        </v-toolbar-items>
        <v-menu v-if="isMobile" offset-y left>
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn icon text v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <div>更多</div>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item @click="showBaitDialog = true">
              <v-btn icon text v-if="isListPage || isWikiPage">
                <v-icon>mdi-hook</v-icon>
              </v-btn>
              <div>打开鱼饵筛选</div>
            </v-list-item>
            <v-list-item>
              <v-menu offset-x left top>
                <template v-slot:activator="{ on: menu, attrs }">
                  <div v-bind="attrs" v-on="{ ...menu }" class="d-flex align-center">
                    <v-btn text icon>
                      <v-icon>mdi-theme-light-dark</v-icon>
                    </v-btn>
                    <div>设置颜色模式</div>
                  </div>
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
            </v-list-item>
            <v-list-item @click="toggleFishEyesUsed">
              <fish-eyes-toggle-button
                v-if="isListPage || isWikiPage"
                :value="fishEyesUsed"
                show-title
                @input="toggleFishEyesUsed"
              />
            </v-list-item>
          </v-list>
        </v-menu>

        <!--        <v-sheet class="d-flex flex-column ml-1 transparent" v-if="!isElectron">-->
        <!--          <div><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>-->
        <!--          <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>-->
        <!--        </v-sheet>-->
      </v-toolbar>

      <fish-page
        v-if="page === 'ListPage'"
        :now="now"
        :is-mobile="isMobile"
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
        :active-tab-index="activeTabIndex"
        :right-pane-full-screen="true"
        @fish-selected="onFishSelected"
      />
      <wiki-page
        v-if="page === 'WikiPage'"
        :now="now"
        :is-mobile="isMobile"
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
        :right-pane-full-screen="true"
        :toggle-map-menu="showMapMenu"
        @fish-selected="onFishSelected"
      />
      <OceanFishingPage54
        v-else-if="page === 'OceanFishingPage54'"
        :now="now"
        :is-mobile="isMobile"
        :lazyTransformedFishDict="lazyTransformedFishDict"
        :selectedFish="selectedFish"
        @fish-selected="onFishSelected"
      />
      <DiademPage
        v-else-if="page === 'DiademPage'"
        :is-mobile="isMobile"
        :selectedFish="selectedFish"
        @fish-selected="onFishSelected"
      />
      <AquariumPage
        v-else-if="page === 'AquariumPage'"
        :is-mobile="isMobile"
        :selectedFish="selectedFish"
        @fish-selected="onFishSelected"
      />
      <CompetitionPage v-else-if="page === 'CompetitionPage'" :is-mobile="isMobile" />
      <RecordPage
        v-else-if="page === 'RecordPage'"
        :now="now"
        :is-mobile="isMobile"
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
    </div>
  </div>
</template>

<script>
import FishPage from '@/entries/main/views/FishPage'
import WikiPage from '@/entries/main/views/WikiPage'
import OceanFishingPage54 from '@/entries/main/views/OceanFishingPage54'
import RecordPage from '@/entries/main/views/RecordPage'
import CompetitionPage from '@/entries/main/views/CompetitionPage'
import AquariumPage from '@/entries/main/views/AquariumPage'
import DiademPage from '@/entries/main/views/DiademPage'
import MainWindowMixin from '@/components/MainWindowMixin'
import FishEyesToggleButton from '@/components/FishEyesToggleButton'
import { mapGetters } from 'vuex'

export default {
  name: 'MainWindow',
  mixins: [MainWindowMixin],
  components: {
    FishEyesToggleButton,
    DiademPage,
    AquariumPage,
    CompetitionPage,
    RecordPage,
    OceanFishingPage54,
    WikiPage,
    FishPage,
  },
  props: [
    'page',
    'activeTabIndex',
    'isMobile',
    'now',
    'lazySourceFishList',
    'lazyTransformedFishList',
    'lazyTransformedFishDict',
    'pinnedFishList',
    'fishListTimePart',
    'extraFishListTimePart',
    'fishListWeatherChangePart',
    'sortedFilteredFishList',
    'toBeNotifiedFishList',
    'selectedFish',
    'filteredFishIdSet',
  ],
  data() {
    return {
      showMapMenu: false,
    }
  },
  computed: {
    ...mapGetters([
      'listSetting',
      'isRoseMode',
      'mainWindowCloseMode',
      // 'readerRegion',
      // 'readerMonitorType',
      'fishEyesUsed',
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
      'showCompetitionDialog',
    ]),
    isListPage() {
      return this.page === 'ListPage'
    },
    isWikiPage() {
      return this.page === 'WikiPage'
    },
    pageTitle() {
      let title = ''
      switch (this.page) {
        case 'ListPage':
          title =
            this.activeTabIndex === 0
              ? this.$t('list.normalTitle')
              : this.$t('list.toBeNotifiedTitle')
          break
        case 'WikiPage':
          title = this.$t('top.fishWiki')
          break
        case 'OceanFishingPage54':
          title = this.$t('top.oceanFishing')
          break
        case 'RecordPage':
          title = this.$t('top.record')
          break
        case 'CompetitionPage':
          title = this.$t('top.competition')
          break
        case 'AquariumPage':
          title = this.$t('top.aquarium')
          break
        case 'DiademPage':
          title = this.$t('top.diadem')
          break
      }
      return title
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    showSetting() {
      // TODO show setting dialog directly
    },
    onFishSelected(e) {
      this.$emit('fish-selected', e)
    },
  },
}
</script>

<style scoped lang="sass">
@import "~@/styles/RcVariables"

.window
  height: 100%
  overflow: hidden

.window-content
  height: calc(100% - #{ $top-system-bar-padding })
  overflow-y: scroll

.window-top-bar
  -webkit-app-region: none
</style>
