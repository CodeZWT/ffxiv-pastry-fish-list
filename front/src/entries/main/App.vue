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
        <new-feature-mark :id="SettingFeatureId">
          <v-icon>mdi-cog</v-icon>
        </new-feature-mark>
      </v-btn>
      <toggle-button
        :value="alwaysOnTop"
        @input="toggleAlwaysOnTop"
        checked-icon="mdi-pin"
        unchecked-icon="mdi-pin-outline"
        :checked-title="$t('actions.pinTop.checked')"
        :unchecked-title="$t('actions.pinTop.unchecked')"
        small
        style="-webkit-app-region: none"
      />
      <v-btn @click="minimize" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-window-minimize</v-icon>
      </v-btn>
      <toggle-button
        :value="maximized"
        @input="maximizeOrRestore"
        checked-icon="mdi-window-restore"
        unchecked-icon="mdi-window-maximize"
        :checked-title="$t('actions.maximize.restore')"
        :unchecked-title="$t('actions.maximize.maximize')"
        small
        style="-webkit-app-region: none"
      />
      <!--      <v-btn @click="maximize" x-small text style="-webkit-app-region: none">-->
      <!--        <v-icon>mdi-window-maximize</v-icon>-->
      <!--      </v-btn>-->
      <!--      <v-btn @click="unmaximize" x-small text style="-webkit-app-region: none">-->
      <!--        <v-icon>mdi-window-maximize</v-icon>-->
      <!--      </v-btn>-->
      <v-btn @click="close" x-small text style="-webkit-app-region: none">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-system-bar>
    <v-app-bar height="56px" app class="fish-app-bar" dense color="system">
      <v-app-bar-nav-icon v-if="isMobile" @click.stop="showNavi">
        <v-img v-if="!isMobile" :src="fisher" height="42" width="42" />
      </v-app-bar-nav-icon>

      <v-avatar
        size="36"
        @click="onFishIconClicked"
        :style="`margin-left: ${isMobile ? 0 : -12}px; -webkit-app-region: none`"
      >
        <v-tooltip right z-index="10">
          <template v-slot:activator="{ on, attrs }">
            <v-img v-on="on" v-bind="attrs" :src="fisher" />
          </template>
          <div class="d-flex flex-column align-center">
            <v-img :src="fisher" />
            <div>Surprise!</div>
          </div>
        </v-tooltip>
      </v-avatar>
      <v-toolbar-title
        v-if="!isMobile"
        style="min-width: 85px !important"
        class="ml-1 text-truncate"
        :title="$t('top.navBarTitle', { title, version })"
      >
        <span>{{ title }}</span>
        <v-badge :content="version" class="px-1" />
      </v-toolbar-title>

      <v-spacer />
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

      <v-btn
        v-if="isWikiPage && isMobile"
        icon
        text
        @click="showMapMenu = !showMapMenu"
        title="点击选择钓场"
      >
        <v-icon>mdi-map</v-icon>
      </v-btn>

      <v-tooltip bottom v-if="!isWikiPage || !isMobile">
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-btn icon text @click="setShowSearchDialog(true)">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </div>
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
            <v-btn v-if="isWikiPage" icon text @click="setShowSearchDialog(true)">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <div>搜索 <kbd>/</kbd></div>
          </v-list-item>
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
          <v-list-item v-if="isListPage || isWikiPage" @click="toggleFishEyesUsed">
            <fish-eyes-toggle-button
              :value="fishEyesUsed"
              show-title
              @input="toggleFishEyesUsed"
            />
          </v-list-item>
        </v-list>
      </v-menu>

      <v-sheet class="d-flex flex-column ml-1 transparent" v-if="!isElectron">
        <div><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
        <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
      </v-sheet>
    </v-app-bar>

    <v-main>
      <v-navigation-drawer
        v-model="drawer"
        :mini-variant.sync="mini"
        :bottom="isMobile"
        :absolute="!isMobile"
        :fixed="isMobile"
        color="system"
        :expand-on-hover="!isMobile"
        style="z-index: 2"
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
          <!--          <v-list-item @click="toPage('OceanFishingPage')" link>-->
          <!--            <v-list-item-icon>-->
          <!--              <v-icon>mdi-ferry</v-icon>-->
          <!--            </v-list-item-icon>-->
          <!--            <v-list-item-content>-->
          <!--              <v-list-item-title>{{ $t('top.oceanFishing') }}</v-list-item-title>-->
          <!--            </v-list-item-content>-->
          <!--          </v-list-item>-->
          <v-list-item @click="toPage('OceanFishingPage54')" link>
            <v-list-item-icon>
              <v-icon>mdi-ferry</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t('top.oceanFishing') }}
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
              <v-icon>mdi-fishbowl</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.aquarium') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="toCompetitionPage" link>
            <v-list-item-icon>
              <new-feature-mark id="Competition-V.0.8.3-2">
                <v-icon>mdi-trophy</v-icon>
              </new-feature-mark>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.competition') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider class="mx-2" />
          <v-list-item v-if="!isElectron" @click="showDownload" link>
            <v-list-item-icon>
              <new-feature-mark :id="DesktopDownloadFeatureId">
                <v-icon>mdi-desktop-mac-dashboard</v-icon>
              </new-feature-mark>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.desktopVersion') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="isElectron" @click="openReader" link>
            <v-list-item-icon>
              <new-feature-mark :id="ReaderTimerFeatureId">
                <v-icon>mdi-fish</v-icon>
              </new-feature-mark>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.fishReader') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-if="isElectron && isRoseMode"
            @click="showRoseDialog = true"
            link
          >
            <v-list-item-icon>
              <v-icon>fas fa-user-secret</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.roseMode') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="isElectron && isRoseMode" @click="toPage('RecordPage')" link>
            <v-list-item-icon>
              <v-icon>mdi-chart-bar</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('top.record') }}</v-list-item-title>
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
              <click-helper @click="showSetting">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <new-feature-mark :id="SettingFeatureId">
                      <v-icon>mdi-tune</v-icon>
                    </new-feature-mark>
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
      <div :class="{ 'py-0': true, 'ml-14': !isMobile }" style="height: 100%">
        <v-overlay v-if="loading || showJumpingOverlay" opacity="0.9" z-index="9999">
          <div class="d-flex flex-column align-center">
            <v-progress-circular indeterminate size="64" />
            <div>{{ $t('list.loading') }}</div>
            <div class="d-flex flex-column align-center">
              <div>如出现无限加载，或者任何问题，可以加群或关注以下页面</div>
              <a
                href="https://ricecake302.coding.net/s/eb3a7844-db84-4792-90db-7805f6a941c1/3"
                target="_blank"
              >
                如有错误，请前往此页面
              </a>
            </div>
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
          :right-pane-full-screen="rightPaneFullScreen"
          :is-mobile="isMobile"
          :toggle-map-menu="showMapMenu"
          @fish-selected="onFishSelected"
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

    <v-footer app style="font-size: small; max-height: 31px">
      <div
        class="d-flex"
        style="width: 100%; cursor: pointer"
        @click="showAboutDialog = true"
      >
        <div class="text-truncate mr-2" :title="$t('footer.contact')">
          <span v-if="!isMobile">
            {{ $t('footer.author') }}
          </span>
          <span>
            <i class="fab fa-qq" aria-hidden="true"></i>
            1153646847
          </span>
          <span v-if="isMobile">
            {{ $t('footer.author') }}
          </span>
        </div>
        <template v-if="!isMobile">
          <div>
            <i class="fab fa-weibo" aria-hidden="true"></i>
            红豆年糕找不到
          </div>
          <div class="ml-2">
            合作：<i class="fab fa-weibo" aria-hidden="true"></i>
            光之渔夫bot
          </div>
        </template>
        <v-spacer />
        <div v-if="!isMobile" class="text-truncate" :title="$t('footer.ffRights')">
          {{ $t('footer.ffRights') }}
        </div>
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
    <v-dialog
      v-model="showAboutDialog"
      :fullscreen="isMobile"
      max-width="600px"
      scrollable
    >
      <v-card>
        <v-card-title>关于</v-card-title>
        <v-card-text class="contact-area">
          <div>ID：红豆年糕 @ 海猫茶屋</div>
          <div><i class="fab fa-qq" aria-hidden="true"></i> 群: 1153646847</div>
          <div>
            <i class="fab fa-weibo" aria-hidden="true"></i>
            红豆年糕找不到
          </div>
          <div>
            合作：<i class="fab fa-weibo" aria-hidden="true"></i>
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
    </v-dialog>
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
import '@thewakingsands/axis-font-icons'
import AppMixin from '@/components/AppMixin'
import MainWindowMixin from '@/components/MainWindowMixin'

export default {
  name: 'App',
  mixins: [AppMixin, MainWindowMixin],
  data() {
    return {
      rightPaneFullScreen: window.innerWidth < 1264,
    }
  },
  computed: {
    isListPage() {
      return this.$route.name === 'ListPage'
    },
    isWikiPage() {
      return this.$route.name === 'WikiPage'
    },
  },
  methods: {
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
      this.setFeatureViewed('Competition-V.0.8.3-2')
      this.toPage('CompetitionPage')
    },
  },
}
</script>

<style>
@import '~Assets/css/fish_icons.css';
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

.v-system-bar {
  -webkit-app-region: drag;
}
</style>
