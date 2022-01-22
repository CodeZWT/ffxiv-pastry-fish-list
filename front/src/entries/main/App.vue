<template>
  <v-app>
    <v-system-bar app v-if="isElectron">
      <div>{{ $t('top.navBarTitle', { title, version }) }}</div>
      <span class="ml-1"></span>
      <v-spacer />
      <div class="mr-1"><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
      <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
      <v-spacer></v-spacer>
      <v-btn @click="showSetting" x-small text style="-webkit-app-region: none">
        <v-icon>{{ mdiCog }}</v-icon>
      </v-btn>
      <toggle-button
        :value="alwaysOnTop"
        @input="toggleAlwaysOnTop"
        :checked-icon="mdiPin"
        :unchecked-icon="mdiPinOutline"
        :checked-title="$t('actions.pinTop.checked')"
        :unchecked-title="$t('actions.pinTop.unchecked')"
        small
        style="-webkit-app-region: none"
      />
      <v-btn @click="minimize" x-small text style="-webkit-app-region: none">
        <v-icon>{{ mdiWindowMinimize }}</v-icon>
      </v-btn>
      <toggle-button
        :value="maximized"
        @input="maximizeOrRestore"
        :checked-icon="mdiWindowRestore"
        :unchecked-icon="mdiWindowMaximize"
        :checked-title="$t('actions.maximize.restore')"
        :unchecked-title="$t('actions.maximize.maximize')"
        small
        style="-webkit-app-region: none"
      />
      <!--      <v-btn @click="maximize" x-small text style="-webkit-app-region: none">-->
      <!--{        <vIcon>mdiWindowMaximize</vIcon{>}}-->
      <!--      </v-btn>-->
      <!--      <v-btn @click="unmaximize" x-small text style="-webkit-app-region: none">-->
      <!--{        <vIcon>mdiWindowMaximize</vIcon{>}}-->
      <!--      </v-btn>-->
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>{{ mdiWindowClose }}</v-icon>
      </v-btn>
    </v-system-bar>
    <v-app-bar height="56px" app class="fish-app-bar" dense color="system" clipped-right>
      <v-app-bar-nav-icon v-if="isMobile" @click.stop="showNavi">
        <v-img v-if="!isMobile" :src="fisher" height="42" width="42" />
      </v-app-bar-nav-icon>

      <v-avatar
        size="36"
        @click="onFishIconClicked"
        :style="`margin-left: ${isMobile ? 0 : -12}px; -webkit-app-region: none`"
        tile
      >
        <v-tooltip right z-index="10">
          <template v-slot:activator="{ on, attrs }">
            <v-img v-on="on" v-bind="attrs" :src="fisher" />
          </template>
          <div class="d-flex flex-column align-center">
            <v-img :src="fisher" />
            <div>{{ $t('toolbar.easterEgg.description') }}</div>
          </div>
        </v-tooltip>
      </v-avatar>
      <v-toolbar-title
        v-if="!isMobile"
        class="ml-1 text-truncate"
        :title="$t('top.navBarTitle', { title, version })"
      >
        <span>{{ title }}</span>
      </v-toolbar-title>
      <template v-if="!isMobile">
        <v-badge :content="$t('top.region.' + region)" inline color="info" />
        <v-badge :content="version" inline />
      </template>
      <v-spacer />
      <div v-if="inStarLight && !isMobile">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              <v-btn icon text>
                <v-icon>{{ mdiSnowflakeVariant }}</v-icon>
              </v-btn>
            </div>
          </template>
          <div class="text-no-wrap">
            星芒节天气模式<br />
            星芒节（{{ region === 'CN' ? '国服' : '国际服' }}）：
            {{ new Date(starLightStart).toLocaleString() }} 至
            {{ new Date(starLightEnd).toLocaleString() }}（本地时间）<br />
            在星芒节期间，三大主城以及四个住宅区的天气固定为小雪。<br />
            对应钓场的鱼将会以小雪计算窗口期。
          </div>
        </v-tooltip>
      </div>

      <rc-tooltip
        v-if="isListPage"
        :message="$t('toolbar.filterSwitch.description')"
        bottom
      >
        <v-btn icon text @click="toggleFilterPanel">
          <v-icon>{{ mdiFilter }}</v-icon>
        </v-btn>
      </rc-tooltip>
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
        <v-icon>{{ mdiHook }}</v-icon>
      </v-btn>

      <v-btn
        v-if="isWikiPage && isMobile"
        icon
        text
        @click="showMapMenu = !showMapMenu"
        title="点击选择钓场"
      >
        <v-icon>{{ mdiMap }}</v-icon>
      </v-btn>

      <v-tooltip bottom v-if="!isWikiPage || !isMobile">
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-btn icon text @click="setShowSearchDialog(true)">
              <v-icon>{{ mdiMagnify }}</v-icon>
            </v-btn>
          </div>
        </template>
        <div>按<kbd>/</kbd>键直接搜索</div>
      </v-tooltip>

      <v-menu v-if="isMobile" offset-y left>
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon text v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <v-icon>{{ mdiDotsVertical }}</v-icon>
              </v-btn>
            </template>
            <div>更多</div>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item @click="showBaitDialog = true">
            <v-btn v-if="isWikiPage" icon text @click="setShowSearchDialog(true)">
              <v-icon>{{ mdiMagnify }}</v-icon>
            </v-btn>
            <div>搜索 <kbd>/</kbd></div>
          </v-list-item>
          <v-list-item @click="showBaitDialog = true">
            <v-btn icon text v-if="isListPage || isWikiPage">
              <v-icon>{{ mdiHook }}</v-icon>
            </v-btn>
            <div>打开鱼饵筛选</div>
          </v-list-item>
          <v-list-item v-if="isListPage || isWikiPage" @click="toggleFishEyesUsed">
            <fish-eyes-toggle-button
              :value="fishEyesUsed"
              show-title
              @input="toggleFishEyesUsed"
            />
          </v-list-item>
          <v-list-item @click="toggleQuickSetting">
            <v-btn icon text>
              <v-icon>{{ mdiCog }}</v-icon>
            </v-btn>
            <div>{{ $t('setting.quickSetting') }}</div>
          </v-list-item>
        </v-list>
      </v-menu>

      <rc-tooltip v-if="!isMobile" :message="$t('setting.quickSetting')">
        <v-btn icon text @click="toggleQuickSetting">
          <v-icon>{{ mdiCog }}</v-icon>
        </v-btn>
      </rc-tooltip>

      <v-sheet class="d-flex flex-column ml-1 transparent" v-if="!isElectron">
        <div><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
        <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
      </v-sheet>
    </v-app-bar>

    <v-main>
      <v-navigation-drawer
        v-model="showQuickSetting"
        absolute
        floating
        bottom
        right
        clipped
        color="system"
      >
        <v-list subheader>
          <v-subheader>{{ $t('setting.theme.title') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-row class="d-flex px-2">
                <div
                  v-for="(mode, index) in THEME_SETTING_MODES"
                  :key="mode"
                  class="ma-1"
                >
                  <rc-tooltip
                    :disabled="mode !== 'AUTO'"
                    :message="$t('setting.theme.hint')"
                    bottom
                  >
                    <v-btn
                      elevation="0"
                      x-large
                      left
                      :color="mode === theme ? 'primary' : undefined"
                      @click="theme = mode"
                    >
                      <v-icon>
                        {{ THEME_MODE_ICONS[index] }}
                      </v-icon>
                      {{ $t(`toolbar.theme.${mode}`) }}
                    </v-btn>
                  </rc-tooltip>
                </div>
              </v-row>
            </v-list-item-content>
          </v-list-item>

          <v-divider />

          <v-subheader>{{ $t('setting.locale.data') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-row class="d-flex px-2">
                <div v-for="(locale, index) in DATA_LOCALES" :key="locale" class="ma-1">
                  <v-btn
                    elevation="0"
                    x-large
                    left
                    :color="locale === dataLocale ? 'primary' : undefined"
                    @click="dataLocale = locale"
                  >
                    <div style="min-width: 40px">
                      <v-img contain :src="LOCALES_ICONS[index]" height="18" width="24" />
                    </div>
                    <div>{{ $t(`locale.title.${locale}`) }}</div>
                  </v-btn>
                </div>
              </v-row>
            </v-list-item-content>
          </v-list-item>

          <v-divider />

          <v-subheader>{{ $t('setting.locale.ui') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-row class="d-flex px-2">
                <div v-for="(locale, index) in UI_LOCALES" :key="locale" class="ma-1">
                  <v-btn
                    elevation="0"
                    x-large
                    left
                    :color="locale === uiLocale ? 'primary' : undefined"
                    @click="uiLocale = locale"
                    :disabled="locale !== 'zh-CN'"
                  >
                    <div style="min-width: 40px">
                      <v-img contain :src="LOCALES_ICONS[index]" height="18" width="24" />
                    </div>
                    <div>{{ $t(`locale.title.${locale}`) }}</div>
                  </v-btn>
                </div>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-navigation-drawer
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
          <v-list-item @click="toPage('HomePage')" link>
            <v-list-item-icon>
              <v-icon>{{ mdiHome }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.home') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="toPageSubList(0)" link>
            <v-list-item-icon>
              <v-badge
                color="error"
                :value="listFishCnt[0].cnt"
                :content="listFishCnt[0].cnt"
                style="z-index: 10"
                overlap
              >
                <v-icon>
                  {{ TABS[0].icon }}
                </v-icon>
              </v-badge>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t(TABS[0].title) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="toPage('AlarmPage')" link>
            <v-list-item-icon>
              <v-badge
                color="error"
                :value="listFishCnt[1].cnt"
                :content="listFishCnt[1].cnt"
                style="z-index: 10"
                overlap
              >
                <v-icon>
                  {{ TABS[1].icon }}
                </v-icon>
              </v-badge>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t(TABS[1].title) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="toPage('WikiPage')" link>
            <v-list-item-icon>
              <v-icon>{{ mdiNotebook }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('wikiPage.title') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!--          <v-list-item @click="toPage('OceanFishingPage')" link>-->
          <!--            <v-list-item-icon>-->
          <!--{              <vIcon>mdiFerry</vIcon{>}}-->
          <!--            </v-list-item-icon>-->
          <!--            <v-list-item-content>-->
          <!--              <v-list-item-title>{{ $t('oceanFishingPage.title') }}</v-list-item-title>-->
          <!--            </v-list-item-content>-->
          <!--          </v-list-item>-->
          <v-list-item @click="toPage('OceanFishingPage54')" link>
            <v-list-item-icon>
              <v-icon>{{ mdiFerry }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t('oceanFishingPage.title') }}
              </v-list-item-title>
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
          <v-list-item @click="toPage('AquariumPage')" link>
            <v-list-item-icon>
              <v-icon>{{ mdiFishbowl }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.aquarium') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="isRoseMode" @click="toPage('RecordPage')">
            <v-list-item-icon>
              <v-icon>{{ mdiChartBar }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{
                $t('top.record')
              }}</v-list-item-title></v-list-item-content
            >
          </v-list-item>

          <v-list-item v-if="isRoseMode" @click="showRoseDialog = true" link>
            <v-list-item-icon>
              <v-icon>{{ mdiAccount }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.roseMode') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="toCompetitionPage" link>
            <v-list-item-icon>
              <v-icon>{{ mdiTrophy }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.competition') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider class="mx-2" />

          <v-list-item v-if="!isElectron" @click="toDownloadPage" link>
            <v-list-item-icon>
              <v-icon>{{ mdiDesktopMacDashboard }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.desktopVersion') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else @click="toWebsite" link>
            <v-list-item-icon>
              <v-icon>{{ mdiWeb }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.website') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>{{ mdiEarth }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <v-btn-toggle
                  v-model="regionIndex"
                  mandatory
                  active-class="primary"
                  dense
                >
                  <v-btn x-small>
                    {{ $t(`top.region.CN`) }}
                  </v-btn>
                  <v-btn x-small>
                    {{ $t(`top.region.Global`) }}
                  </v-btn>
                </v-btn-toggle>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="isElectron" @click="openReader" link>
            <v-list-item-icon>
              <v-icon>{{ mdiFish }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.fishReader') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="isElectron && downloadProgress > 0"
            link
            @click="showUpdateDialog"
          >
            <v-list-item-icon>
              <div>
                <v-progress-circular rotate="-90" size="24" :value="downloadProgress">
                  <div style="font-size: x-small">
                    {{ downloadProgress === 100 ? '' : Math.floor(downloadProgress) }}
                  </div>
                </v-progress-circular>
              </div>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{
                  downloadProgress === 100 ? $t('top.downloaded') : $t('top.downloading')
                }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <template v-slot:append>
          <v-list nav dense>
            <v-spacer />
            <v-divider />
            <v-list-group :prepend-icon="mdiCog" active-class="white--text">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('top.setting') }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <!--        <v-list-item-group active-class="primary--text">-->

              <v-list-item @click="setShowImportExportDialog(true)">
                <v-list-item-icon>
                  <v-icon>{{ mdiDatabase }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('top.menu') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <click-helper @click="showSetting">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <v-icon>{{ mdiTune }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('top.uiConfig') }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </click-helper>
              <v-list-item @click="showPatchNoteDialog = true">
                <v-list-item-icon>
                  <v-icon>{{ mdiTag }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('top.patchNote') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="toFAQ">
                <v-list-item-icon>
                  <v-icon>{{ mdiHammerWrench }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('faqPage.title') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="showAboutDialog = true">
                <v-list-item-icon>
                  <v-icon>{{ mdiInformation }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ $t('top.about') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!--        </v-list-item-group>-->
            </v-list-group>
          </v-list>
        </template>
      </v-navigation-drawer>
      <div :class="{ 'py-0': true, 'ml-14': !isMobile }" style="height: 100%">
        <v-overlay v-if="loading || showJumpingOverlay" opacity="0.9" z-index="9999">
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
          :pinnedFishIdList="pinnedFishIdList"
          :sortedFilteredFishIdList="sortedFilteredFishIdList"
          :toBeNotifiedFishIdList="toBeNotifiedFishIdList"
          :selectedFish="selectedFish"
          :filteredFishIdSet="filteredFishIdSet"
          :activeTabIndex="activeTabIndex"
          :is-mobile="isMobile"
          :toggle-map-menu="showMapMenu"
          @fish-selected="onFishSelected"
          :original="true"
        />
      </div>
      <!--      <v-container class="py-0">-->
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
      @change="handleSearch"
    />

    <v-footer app style="font-size: small; max-height: 31px" :padless="isMobile">
      <div class="d-flex" style="width: 100%">
        <template v-if="!isMobile || isElectron">
          <div
            class="text-truncate mr-2"
            :title="$t('footer.contact')"
            @click="showAboutDialog = true"
            style="cursor: pointer"
          >
            <span v-if="!isMobile">
              {{ $t('footer.author') }}
            </span>
            <span>
              <v-icon small>{{ mdiQqchat }}</v-icon>
              1153646847
            </span>
            <span v-if="isMobile">
              {{ $t('footer.author') }}
            </span>
          </div>
          <v-spacer />
        </template>
        <template v-if="!isElectron">
          <div class="d-flex">
            <div class="mx-1" style="min-width: 150px">
              <a
                target="_blank"
                href="https://beian.miit.gov.cn"
                style="
                  display: inline-block;
                  text-decoration: none;
                  height: 20px;
                  line-height: 20px;
                "
              >
                <p
                  style="
                    float: left;
                    height: 20px;
                    line-height: 20px;
                    margin: 0px 0px 0px 5px;
                    color: #939393;
                  "
                >
                  黔ICP备2020011894号-1
                </p>
              </a>
            </div>
            <div class="mx-1" style="min-width: 200px">
              <a
                target="_blank"
                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=52270102000276"
                style="
                  display: inline-block;
                  text-decoration: none;
                  height: 20px;
                  line-height: 20px;
                "
              >
                <img v-if="!isMobile" :src="beianIcon" style="float: left" />
                <p
                  style="
                    float: left;
                    height: 20px;
                    line-height: 20px;
                    margin: 0px 0px 0px 5px;
                    color: #939393;
                  "
                >
                  黔公网安备 52270102000276号
                </p>
              </a>
            </div>
          </div>
        </template>
        <template v-if="!isMobile">
          <v-spacer />
          <div class="text-truncate" :title="$t('footer.ffRights')">
            {{ $t('footer.ffRights') }}
          </div>
        </template>
      </div>
      <resize-indicator />
    </v-footer>

    <fish-setting-dialog v-model="showSettingDialog" />
    <patch-note-dialog
      v-model="showPatchNoteDialog"
      :in-migration-page="inMigrationPage"
      @confirm="onConfirmPatchNote"
    />
    <help-dialog v-model="showHelpDialog" />
    <rc-dialog
      v-model="showAboutDialog"
      :fullscreen="isMobile"
      max-width="600px"
      scrollable
    >
      <v-card>
        <v-card-title>关于</v-card-title>
        <v-card-text class="contact-area">
          <div>ID：红豆年糕 @ 海猫茶屋</div>
          <div>
            <v-icon small>{{ mdiQqchat }}</v-icon>
            群: 1153646847
          </div>
          <div>
            <v-icon small>{{ mdiSinaWeibo }}</v-icon>
            红豆年糕找不到
          </div>
          <div>
            合作：
            <v-icon small>{{ mdiSinaWeibo }}</v-icon>
            光之渔夫bot
          </div>
          <div>欢迎使用本站</div>
          <div>
            钓场的范围提示由 <span class="font-weight-bold">轩辕十四@沃仙曦染</span> 提供
          </div>
          <div>感谢各开源项目及攻略网站的帮助：</div>
          <ul>
            <li>
              钓鱼数据：
              <ul>
                <li>
                  <a @click="goTo('https://ff14fish.carbuncleplushy.com/')">
                    FFX|V Fish Tracker App
                  </a>
                </li>
                <li>
                  <a @click="goTo('https://ffxiv.cyanclay.xyz/db/')">Garland 数据</a>
                </li>
                <li><a @click="goTo('https://cn.ff14angler.com/')">饥饿的猫</a></li>
                <li>
                  <a @click="goTo('https://ffxivteamcraft.com/')">FFXIV TEAMCRAFT</a>
                </li>
                <li>
                  <a @click="goTo('https://ffxiv.pf-n.co/ocean-fishing/')"
                    >Lulu's Tools - Ocean Fishing</a
                  >
                </li>
              </ul>
            </li>
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
          <div class="mt-10">
            {{ $t('footer.ffRights') }}
          </div>
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
    </rc-dialog>
    <update-dialog
      v-model="showCheckStartSetupDialog"
      :progress="downloadProgress"
      @update="startUpdate"
      @skip="skipUpdate"
    />
    <update-available-dialog v-model="showUpdateAvailableDialog" :hash="newVersion" />
    <import-export-dialog v-model="showImportExport" />
    <bait-dialog
      v-model="showBaitDialog"
      :show-setting.camel.sync="showBaitNotificationSetting"
    />
    <chrome-time-zone-bug-dialog v-model="showChromeTimeZoneBugDialog" />
    <migrate-to-travel-eorzea-dialog
      v-model="showMigrationDialog"
      :source="migrationSource"
    />
    <desktop-version-dialog v-model="showDownloadDialog" />
    <rose-mode-dialog v-model="showRoseDialog" />
    <!--    <competition-dialog v-model="showCompetitionDialogComputed" />-->
    <region-notification-dialog v-if="siteRegion === 'Global'" />
    <v-snackbar
      :timeout="snackbar.timeout"
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
            <v-expansion-panel-header>多个鱼饵已钓完所有鱼</v-expansion-panel-header>
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
import {
  mdiAccount,
  mdiChartBar,
  mdiCog,
  mdiDatabase,
  mdiDesktopMacDashboard,
  mdiDotsVertical,
  mdiEarth,
  mdiFerry,
  mdiFilter,
  mdiFish,
  mdiFishbowl,
  mdiHammerWrench,
  mdiHome,
  mdiHook,
  mdiInformation,
  mdiMagnify,
  mdiMap,
  mdiNotebook,
  mdiPin,
  mdiPinOutline,
  mdiQqchat,
  mdiSinaWeibo,
  mdiSnowflakeVariant,
  mdiTag,
  mdiThemeLightDark,
  mdiTranslate,
  mdiTrophy,
  mdiTune,
  mdiWeb,
  mdiWindowClose,
  mdiWindowMaximize,
  mdiWindowMinimize,
  mdiWindowRestore,
} from '@mdi/js'

import '@thewakingsands/axis-font-icons'
import { MainFeatures } from 'Data/newFeatures'
import { SystemInfo, setDataLocale, setRegion, setUILocale } from 'Data/version'
import { sendElectronEvent } from '@/utils/electronHelper'
import AlarmMixin from '@/mixins/AlarmMixin'
import AppMixin from '@/components/AppMixin'
import DataUtil from '@/utils/DataUtil'
import ImgUtil from '@/utils/ImgUtil'
import LINK from 'Data/link'
import MainWindowMixin from '@/components/MainWindowMixin'
import RcDialog from '@/components/basic/RcDialog'
import RegionNotificationDialog from '@/components/Dialog/RegionNotificationDialog'
import _ from 'lodash'
import beianIcon from 'Assets/beian-icon.png'

export default {
  name: 'App',
  components: { RegionNotificationDialog, RcDialog },
  mixins: [AppMixin, MainWindowMixin, AlarmMixin],
  data() {
    return {
      mdiAccount,
      mdiChartBar,
      mdiCog,
      mdiDatabase,
      mdiDesktopMacDashboard,
      mdiDotsVertical,
      mdiEarth,
      mdiFerry,
      mdiFilter,
      mdiFish,
      mdiFishbowl,
      mdiHome,
      mdiHook,
      mdiInformation,
      mdiMagnify,
      mdiMap,
      mdiNotebook,
      mdiPin,
      mdiPinOutline,
      mdiQqchat,
      mdiSinaWeibo,
      mdiSnowflakeVariant,
      mdiTag,
      mdiHammerWrench,
      mdiThemeLightDark,
      mdiTranslate,
      mdiTrophy,
      mdiTune,
      mdiWeb,
      mdiWindowClose,
      mdiWindowMaximize,
      mdiWindowMinimize,
      mdiWindowRestore,
      // rightPaneFullScreen: window.innerWidth < 1080,
      showDownloadDialog: false,
      DesktopDownloadFeatureId: MainFeatures.DesktopDownload,
      beianIcon: beianIcon,
      showCheckStartSetupDialog: false,
      showFinishedBaitDialog: false,
      showUpdateAvailableDialog: false,
      newVersion: undefined,
      DATA_LOCALES: DataUtil.DATA_LOCALES,
      UI_LOCALES: DataUtil.UI_LOCALES,
      LOCALES_ICONS: [
        ImgUtil.getImgUrl('cn.svg', ImgUtil.CATEGORY.LANG),
        ImgUtil.getImgUrl('us.svg', ImgUtil.CATEGORY.LANG),
        ImgUtil.getImgUrl('jp.svg', ImgUtil.CATEGORY.LANG),
      ],
      showQuickSetting: true,
    }
  },
  computed: {
    siteRegion() {
      return process.env.VUE_APP_SITE_REGION
    },
    regionIndex: {
      get() {
        return ['CN', 'Global'].indexOf(SystemInfo.region)
      },
      set(regionIndex) {
        setRegion(['CN', 'Global'][regionIndex])
        sendElectronEvent('broadcast', {
          source: 'main',
          type: 'reloadSystemInfo',
        })
        this.showSnackbar({
          text: this.$t('common.ui.reloadAfterSetting'),
          color: 'success',
        })
        setTimeout(() => {
          this.startReloadPage()
        }, 1000)
      },
    },
    dataLocale: {
      get() {
        return SystemInfo.dataLocale
      },
      set(dataLocale) {
        setDataLocale(dataLocale)
        sendElectronEvent('broadcast', {
          source: 'main',
          type: 'reloadSystemInfo',
        })
        this.showSnackbar({
          text: this.$t('common.ui.reloadAfterSetting'),
          color: 'success',
        })
        setTimeout(() => {
          this.startReloadPage()
        }, 1000)
      },
    },
    uiLocale: {
      get() {
        return SystemInfo.uiLocale
      },
      set(locale) {
        setUILocale(locale)
        sendElectronEvent('broadcast', {
          source: 'main',
          type: 'reloadSystemInfo',
        })
        this.showSnackbar({
          text: this.$t('common.ui.reloadAfterSetting'),
          color: 'success',
        })
        setTimeout(() => {
          this.startReloadPage()
        }, 1000)
      },
    },
    region() {
      return SystemInfo.region
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    isListPage() {
      return this.$route.name === 'ListPage'
    },
    isWikiPage() {
      return this.$route.name === 'WikiPage'
    },
    toBeNotifiedFishIdList() {
      // console.log('toBeNotifiedFishIdList triggered')
      const sortedFishIds = this.sortedToBeNotifiedIds
      if (this.filters.sorterType === 'COUNTDOWN') {
        return sortedFishIds
      } else {
        return _.sortBy(sortedFishIds, fishId => this.lazyFishWindowRates[fishId])
      }
    },
    listFishCnt() {
      // console.log('listFishCnt triggered')
      // TODO implement with id list instead
      const fishListTimePart = this.fishListTimePart
      const doFullCountSearch = [true, false, true]
      const allListCnt = [
        this.pinnedFishIdList,
        this.sortedFilteredFishIdList,
        this.toBeNotifiedFishIdList,
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
            cnt: list.reduce((cnt, fishId) => {
              return (
                cnt +
                (fishListTimePart[fishId]?.countDown?.type === DataUtil.FISHING ? 1 : 0)
              )
            }, 0),
          }
        } else {
          const firstNotFishingIndex = list.findIndex(
            it => fishListTimePart[it]?.countDown?.type !== DataUtil.FISHING
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
  },
  watch: {
    listFishCnt(listFishCnt, oldValue) {
      if (!_.isEqual(listFishCnt, oldValue)) {
        sendElectronEvent('listCntUpdated', listFishCnt)
      }
    },
  },
  mounted() {
    window.electron?.ipcRenderer?.on('showSpotPage', (event, spotId) => {
      if (!window.location.hash.startsWith('#/wiki')) {
        this.$router.push({ name: 'WikiPage', query: { spotId, mode: 'normal' } })
      }
    })
  },
  created() {
    window.electron?.ipcRenderer
      // ?.on('getUploadRecords', UploadUtil.sendUploadRecord)
      ?.on('showUpdateDialog', (event, newVersion) => {
        this.showUpdateAvailableDialog = true
        this.newVersion = newVersion
      })
      ?.on('setupDownload', (event, data) => {
        if (this.downloadProgress < 100) {
          this.downloadProgress = data.percent * 100
        }
      })
      ?.on('checkStartSetup', () => {
        this.downloadProgress = 100
        this.showUpdateDialog()
      })
  },
  methods: {
    toggleQuickSetting() {
      this.showQuickSetting = !this.showQuickSetting
    },
    toFAQ() {
      window.open(LINK.FAQ)
    },
    showUpdateDialog() {
      this.showCheckStartSetupDialog = true
    },
    openReader() {
      this.sendElectronEvent('openReader')
      this.setFeatureViewed(this.ReaderTimerFeatureId)
    },
    startUpdate() {
      this.sendElectronEvent('startUpdate')
    },
    skipUpdate() {
      this.sendElectronEvent('skipUpdate')
      this.showCheckStartSetupDialog = false
    },
    setMiniMode(mini) {
      this.sendElectronEvent('miniMode', mini)
    },
    showMenu() {
      this.showWindowMenu = true
    },
    showDownload() {
      this.showDownloadDialog = true
      this.setFeatureViewed(this.DesktopDownloadFeatureId)
    },
    toDownloadPage() {
      window.open('https://ricecake302.coding.net/s/b9ae2dd4-64e2-4412-acdd-d40ab55f85c3')
    },
    toWebsite() {
      window.open('https://ricecake.traveleorzea.com')
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
    toCompetitionPage() {
      this.toPage('CompetitionPage')
    },
  },
}
</script>

<style>
@import '~Assets/css/keys.css';

@font-face {
  font-family: 'FFXIV';
  src: url('~Assets/font/FFXIV_Lodestone_SSF.ttf') format('truetype'),
    url('~Assets/font/FFXIV_Lodestone_SSF.woff') format('woff');
  unicode-range: U+E020-E0DB;
  font-display: swap;
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

.v-expansion-panel-header {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}

.min-page {
  background: rgba(255, 255, 255, 0) !important;
  /*height: 64px;*/
}

/* scroller setting start */
/* The emerging W3C standard
   that is currently Firefox-only */

* {
  scrollbar-width: thin;
  scrollbar-height: thin;
  scrollbar-color: #ffffff66 rgba(0, 0, 0, 0.2);
}

/* Works on Chrome/Edge/Safari */

*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
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

.theme-switch .v-messages {
  display: none !important;
}

.theme-switch .v-input__slot {
  margin-bottom: 0;
}

body {
  overscroll-behavior: none;
}

.v-system-bar {
  -webkit-app-region: drag;
}
</style>
