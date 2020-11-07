<template>
  <v-app :style="`opacity: ${opacity}`" :class="{ 'min-page': collapse }">
    <v-app-bar
      height="56px"
      app
      :collapse="collapse"
      :class="{ 'fish-app-bar': true, 'rounded-pill': collapse, 'fish-app-bar--collapsed': collapse }"
      dense
    >
      <v-app-bar-nav-icon v-if="!collapse && isMobile" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <!--      <click-helper @click="collapse = !collapse">-->
      <!--        <v-tooltip right>-->
      <!--          <template v-slot:activator="{ on, attrs }">-->
      <!--            <div class="d-flex">-->
      <!--              <v-avatar size="28" v-bind="attrs" v-on="on">-->
      <!--                <img :src="fisher" />-->
      <!--              </v-avatar>-->
      <!--              <div class="d-flex flex-column" v-if="collapse">-->
      <!--                <v-chip-->
      <!--                  v-for="(notification, index) in listFishCntForMini"-->
      <!--                  :key="index"-->
      <!--                  x-small-->
      <!--                  color="transparent"-->
      <!--                  @click="setActiveTabLater(index)"-->
      <!--                >-->
      <!--                  <v-tooltip right>-->
      <!--                    <template v-slot:activator="{ on, attrs }">-->
      <!--                      <click-helper v-on="on" v-bind="attrs">-->
      <!--                        <div>-->
      <!--                          <v-icon left small disabled>-->
      <!--                            {{ TABS[index].icon }}-->
      <!--                          </v-icon>-->
      <!--                          {{ notification.cnt }}-->
      <!--                        </div>-->
      <!--                      </click-helper>-->
      <!--                    </template>-->
      <!--                    <span>{{ $t(TABS[index].title) }}</span>-->
      <!--                  </v-tooltip>-->
      <!--                </v-chip>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </template>-->
      <!--          <span>{{ $t('top.collapseHint') }}</span>-->
      <!--        </v-tooltip>-->
      <!--      </click-helper>-->

      <!--      <v-toolbar-title>{{ title }}</v-toolbar-title>-->

      <template v-if="!collapse">
        <v-spacer />
        <v-tabs :value="activeTabIndex" @change="setActiveTab" center-active show-arrows centered>
          <!--          <v-tabs-slider color="white"></v-tabs-slider>-->

          <v-tab
            v-for="(notification, index) in listFishCnt"
            :key="index"
            :class="{ 'primary--text': activeTabIndex === index }"
          >
            <v-badge color="tertiary" :value="notification.cnt" :content="notification.cnt" style="z-index: 10">
              <div class="d-flex">
                <v-icon left small :color="activeTabIndex === index ? 'primary-text' : '#ffffff99'">
                  {{ TABS[index].icon }}
                </v-icon>
                <div v-if="!isMobile" style="font-size: 16px">{{ $t(TABS[index].title) }}</div>
              </div>
            </v-badge>
          </v-tab>
        </v-tabs>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <click-helper @click="setShowSearchDialog(true)">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </click-helper>
          </template>
          <div>按 <code>/</code> 键直接搜索</div>
        </v-tooltip>
        <click-helper @click="toggleFilterPanel">
          <v-btn icon>
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </click-helper>
        <!--        <div class="text-center">-->
        <!--          <v-menu offset-y>-->
        <!--            <template v-slot:activator="{ on, attrs }">-->
        <!--              <click-helper v-on="on" v-bind="attrs">-->
        <!--                <v-btn icon>-->
        <!--                  <v-icon>mdi-dots-vertical</v-icon>-->
        <!--                </v-btn>-->
        <!--              </click-helper>-->
        <!--            </template>-->
        <!--            -->
        <!--          </v-menu>-->
        <!--        </div>-->
        <div v-if="!isMobile" class="d-flex flex-column ml-1">
          <div><i class="xiv local-time-chs mr-1"></i>{{ earthTime }}</div>
          <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
        </div>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" bottom app color="#272727">
      <template v-slot:prepend>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img :src="fisher" />
          </v-list-item-avatar>

          <v-list-item-title>
            {{ $t('top.navBarTitle', { title, version }) }}
          </v-list-item-title>

          <v-btn v-if="!isMobile" icon @click.stop="mini = !mini">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
      </template>

      <v-list nav dense>
        <click-helper @click="toPage('ListPage')">
          <v-list-item @click="noOp">
            <v-list-item-icon>
              <v-icon>mdi-alarm</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ $t('top.fishList') }}</v-list-item-content>
          </v-list-item>
        </click-helper>
        <click-helper @click="toPage('WikiPage')">
          <v-list-item @click="noOp">
            <v-list-item-icon>
              <v-icon>mdi-notebook</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ $t('top.fishWiki') }}</v-list-item-content>
          </v-list-item>
        </click-helper>
      </v-list>

      <template v-slot:append>
        <v-list nav dense>
          <v-spacer />
          <v-divider />
          <v-list-group prepend-icon="mdi-cog">
            <template v-slot:activator>
              <v-list-item-content>{{ $t('top.setting') }}</v-list-item-content>
            </template>
            <!--        <v-list-item-group active-class="primary&#45;&#45;text">-->

            <click-helper @click="setShowImportExportDialog(true)">
              <v-list-item @click="noOp">
                <v-list-item-icon>
                  <v-icon>mdi-database</v-icon>
                </v-list-item-icon>
                <v-list-item-content>{{ $t('top.menu') }}</v-list-item-content>
              </v-list-item>
            </click-helper>
            <click-helper @click="showSettingDialog = true">
              <v-list-item @click="noOp">
                <v-list-item-icon>
                  <v-icon>mdi-tune</v-icon>
                </v-list-item-icon>
                <v-list-item-content>{{ $t('top.uiConfig') }}</v-list-item-content>
              </v-list-item>
            </click-helper>
            <click-helper @click="showHelpDialog = true">
              <v-list-item @click="noOp">
                <v-list-item-icon>
                  <v-icon>mdi-help-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>{{ $t('top.help') }}</v-list-item-content>
              </v-list-item>
            </click-helper>
            <click-helper @click="showPatchNoteDialog = true">
              <v-list-item @click="noOp">
                <v-list-item-icon>
                  <v-icon>mdi-tag</v-icon>
                </v-list-item-icon>
                <v-list-item-content>{{ $t('top.patchNote') }}</v-list-item-content>
              </v-list-item>
            </click-helper>
            <click-helper @click="showAboutDialog = true">
              <v-list-item @click="noOp">
                <v-list-item-icon>
                  <v-icon>mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-content>{{ $t('top.about') }}</v-list-item-content>
              </v-list-item>
            </click-helper>
            <!--        </v-list-item-group>-->
          </v-list-group>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <div class="py-0" v-show="!collapse">
        <v-overlay :value="loading">
          <div class="d-flex flex-column align-center">
            <v-progress-circular indeterminate size="64" />
            <div>{{ $t('list.loading') }}</div>
          </div>
        </v-overlay>
        <router-view
          :now="now"
          :lazyFishSourceList="lazyFishSourceList"
          :lazyTransformedFishList="lazyTransformedFishList"
          :lazyTransformedFishDict="lazyTransformedFishDict"
          :pinnedFishList="pinnedFishList"
          :fishListTimePart="fishListTimePart"
          :extraFishListTimePart="extraFishListTimePart"
          :fishListWeatherChangePart="fishListWeatherChangePart"
          :sortedFilteredFishList="sortedFilteredFishList"
          :toBeNotifiedFishList="toBeNotifiedFishList"
          :selectedFish="selectedFish"
          @select-fish="selectedFishId = $event"
          @search-fish="searchedFishId = $event"
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
    <v-footer app style="font-size: small; max-height: 31px" v-if="!collapse">
      <div class="d-flex" style="width: 100%">
        <div class="text-truncate mr-2" :title="$t('footer.contact')">{{ $t('footer.contact') }}</div>
        <v-spacer />
        <div class="text-truncate" :title="$t('footer.ffRights')">{{ $t('footer.ffRights') }}</div>
      </div>
      <div class="resize-indicator" />
    </v-footer>

    <fish-setting-dialog v-model="showSettingDialog" />

    <v-dialog v-model="showPatchNoteDialog" max-width="600px" scrollable>
      <v-card>
        <v-card-title>
          {{ $t('top.patchNote') }}
        </v-card-title>
        <v-card-text style="max-height: 600px;">
          <div class="text-h6">Version 0.2.4</div>
          <ul>
            <li>
              更新地图范围提示：（4.x, 5.x 完成，剩余地图持续更新中）
            </li>
            <ul>
              <li>3.x: 阿巴拉提亚云海</li>
              <li>4.x: 红玉海，白银乡，黄金港，基拉巴尼亚边区，基拉巴尼亚湖区，神拳痕</li>
              <li>5.x: 雷克兰德，拉凯提卡大森林，游末邦</li>
            </ul>
            <li>
              更新时间文本，增加“今天”，“明天”，“周一”等的文本。
            </li>
            <li>
              更新列表中的前置鱼，隐去了“固定”和“完成”的勾选按钮，详细界面中不变。
            </li>
            <li>
              更新详细界面的倒计时，现在会显示2个时间单位，如“10分09秒”。
            </li>
            <li>
              增加系统提示支持
            </li>
            <ul>
              <li>需要在浏览器授权，地址栏弹框时选择“允许”。</li>
              <li>在Windows10系统中的“设置-通知和操作”中授权。</li>
              <li>系统管理员会有一系列问题，请使用普通用户。</li>
              <li>请关闭Windows的“专注助手”，以正常跳出通知。</li>
            </ul>
            <li>增加部分钓鱼技能的悬浮提示。</li>
            <li>增加按键 ' / ' 可以直接搜索，以及打开搜索界面自动开始搜索输入的功能。</li>
            <li>
              修复“复制道具名”按钮。
            </li>
          </ul>
          <p />
          <v-divider />

          <div class="text-h6">Version 0.2.3</div>
          <ul>
            <li>增加闹钟列表，点击列表中时间或详细列表中铃铛即可添加，详细设置在设置对话框中。</li>
            <li>更新列表：在CD中的鱼显示下一次窗口期时间。</li>
            <li>更新设置</li>
            <ul>
              <li>现在点击“应用”按钮才会生效。</li>
              <li>添加闹钟相关选项。</li>
              <li>添加详情页面的自定义布局功能。</li>
            </ul>
            <li>
              更新地图范围提示，增加地图：翻云雾海，龙堡内陆低地，基拉巴尼亚山区，安慕·艾兰，伊尔美格，黑风海。（持续更新中）
            </li>
            <li>修复详细列表中的前置鱼列表。</li>
          </ul>
          <p />
          <v-divider />

          <div class="text-h6">Version 0.2.2</div>
          <ul>
            <li>修复列表固定鱼完成按钮的问题。</li>
            <li>更新地图范围提示：延夏，高脚孤丘，魔大陆阿济兹拉。（持续更新中）</li>
          </ul>
          <p />
          <v-divider />

          <div class="text-h6">Version 0.2.1</div>
          <ul>
            <li>提升页面流畅度。</li>
            <li>更新地图，增加水晶和部分地图的钓点范围提示，持续更新中。</li>
            <li>范围都是 <span class="font-weight-bold">轩辕十四@沃仙曦染</span> 大佬的标的，万分感谢！</li>
            <li>修复了一些复制的问题。</li>
          </ul>
          <p />
          <v-divider />

          <div class="text-h6">Version 0.2.0</div>
          <ul>
            <li>界面更新，原先扩展列表变为右侧详细界面。</li>
            <li>固定和默认列表变为选项卡的形式。</li>
            <li>ACT界面（即较小的界面下），详细列表将全屏显示。</li>
            <li>ACT缩小模式更新。</li>
            <li>增加常驻（即全天可以钓）鱼王的筛选项。</li>
          </ul>
          <p />
          <v-divider />

          <div class="text-h6">Version 0.1.6</div>
          <ul>
            <li>修复等待状态，倒计时与持续时长乱序的问题。</li>
            <li>修复ACT下按钮有时没有相应的问题。</li>
            <li>修复道具提示框错位，被对话框遮挡的问题</li>
            <li>增加 猎手鱼 信息，咬钩：中杆，提钩：强力提钩。</li>
            <li>更新缩小模式，现在只显示鱼图标。</li>
            <li>搜索选项增加了鱼的图标。</li>
          </ul>
          <p />
          <v-divider />

          <div class="text-h6">Version 0.1.5</div>
          <ul>
            <li>更新帮助文档，ACT相关。现在通过配置ACT可以正常输入了。</li>
            <li>更新所有对话框的滚动条，以及一些样式更新。</li>
            <li>更新透明度滚动条，调整粒度变为0.01，可直接输入。</li>
            <li>调整复制、链接按钮大小。</li>
            <li>更新页脚。</li>
            <li>
              更新窗口期计算逻辑，现在窗口期正确地计算最长可能的时长（原先部分鱼的第一个和最后一个窗口期少计算了一部分时间）。
            </li>
            <li>更新倒计时和时长的显示位置。</li>
          </ul>
          <p />
          <v-divider />

          <div class="text-h6">Version 0.1.4</div>
          <ul>
            <li>更新后台算法，解决长时间后，倒计时出错的问题。</li>
            <li>增加ACT下使用的缩小功能，点击左上角，钓鱼时钟旁的鱼图标切换。</li>
            <li>更新帮助文档（ACT相关）。</li>
            <li>固定列表也按时间排序（和默认列表相同）。</li>
            <li>当一条鱼的界面处于展开模式时，以任意的形式从当前列表移除后，下一条鱼不会继承打开的状态。</li>
            <li>更新了 不朽巨鱼 的天气和咬钩 天气：从 阴云 修正为 晴朗/碧空 转 阴云/薄雾，补充了 咬钩 为 鱼王竿。</li>
          </ul>
          <p />
          <v-divider />

          <div class="text-h6">Version 0.1.3</div>
          <ul>
            <li>向关于页面增加了重置按钮。</li>
            <li>修复了对导入数据的检测。</li>
            <li>更新了 冥河灯 的ET时间：0-4 修正为 23-4。</li>
            <li>在默认列表中不再显示固定的鱼。</li>
          </ul>
          <p />
          <v-divider />

          <div class="text-h6">Version 0.1.2</div>
          <p>更新了 众神之爱 的ET时间：5-7 修正为 5:30-6:30。</p>
          <v-divider />

          <div class="text-h6">Version 0.1.1</div>
          <ul>
            <li>修正了FishTracker导入的问题。</li>
            <li>显示没有钓场的鱼。</li>
            <li>调整行间距更紧凑。</li>
            <li>调整整体配色更暗。</li>
            <li>将鱼的背景色也根据状态进行了调整</li>
            <li>将鱼饵，前置鱼，天气图标的大小调整的更小。</li>
            <li>更新了通知栏的文本。</li>
            <li>更新鱼，鱼饵，钓场的提示文本。</li>
            <li>
              增加“配置”功能，目前支持调整透明度。原先默认0.8，现在默认1.0（即不透明）。透明度功能主要为ACT悬浮窗提供支持。
            </li>
            <li>增加时间提示，当鼠标悬停在倒计时文字上时，显示具体的时刻。</li>
            <li>增加“更新笔记”功能，当版本更新时显示。</li>
            <li>给等待中的鱼加上下次窗口期的持续时间（简易显示一个时间单位，鼠标悬停显示全部）。</li>
          </ul>
          <p />
          <v-divider />
          <div class="text-h6">Version 0.1.0</div>
          <p>初始版本</p>
        </v-card-text>
        <v-card-actions>
          <div class="d-flex flex-column flex-fill">
            <click-helper @click="onConfirmPatchNote">
              <v-btn color="primary" block>
                {{ $t('general.dialog.confirm') }}
              </v-btn>
            </click-helper>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showHelpDialog" :fullscreen="isMobile" max-width="1264px" scrollable>
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
    <v-dialog v-model="showAboutDialog" :fullscreen="isMobile" max-width="600px" scrollable>
      <v-card>
        <v-card-text class="contact-area">
          <div>ID：红豆年糕 @ 海猫茶屋</div>
          <div>群：1153646847</div>
          <div>欢迎使用本站</div>
          <div>钓场的范围提示由 <span class="font-weight-bold">轩辕十四@沃仙曦染</span> 提供</div>
          <div>感谢来自于各个开源作者的支持：</div>
          <ul>
            <li>钓鱼数据：<a @click="goTo('https://ff14fish.carbuncleplushy.com/')">FFX|V Fish Tracker App</a></li>
            <li>
              游戏内相关数据(英文)：<a @click="goTo('https://xivapi.com/')">A FINAL FANTASY XIV: Online REST API</a>
            </li>
            <li>
              游戏内相关数据(中文)：<a @click="goTo('https://github.com/thewakingsands/ffxiv-datamining-cn')"
                >ffxiv-datamining-cn</a
              >
            </li>
            <li>道具悬浮提示框：<a @click="goTo('https://github.com/thewakingsands/cafe-kit')">cafe-kit</a></li>
            <li>
              FF XIV 字体：<a @click="goTo('https://github.com/thewakingsands/ffxiv-axis-font-icons')"
                >ffxiv-axis-font-icons</a
              >
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
    <!--    <input type="text" value="" id="clipboard" style="display: none" />-->
    <v-snackbar :timeout="2000" v-model="snackbar.show" :color="snackbar.color" centered elevation="24">
      <div class="text-center">{{ snackbar.text }}</div>
    </v-snackbar>
  </v-app>
</template>

<script>
import EorzeaTime, { WEATHER_CHANGE_INTERVAL_EARTH } from '@/utils/Time'
import '@thewakingsands/axis-font-icons'
import fisher from '@/assets/icon/FSH-white.svg'
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
import sortBy from 'lodash/sortBy'
import { isEqual, union } from 'lodash'
import FishWindow from '@/utils/FishWindow'

export default {
  name: 'App',
  components: { FishSettingDialog, ClickHelper, ResetButton },
  data: vm => ({
    now: Date.now(),
    fisher,
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
    title: vm.$t('top.systemBarTitle') + (DevelopmentModeUtil.isTest() ? vm.$t('top.testSuffix') : ''),
    drawer: true,
    mini: true,
    lazyFishSourceList: [],
    lazyTransformedFishList: [],
    lazyTransformedFishDict: {},
    weatherChangeTrigger: 1,
    sortedFishIds: [],
    fishListTimePart: {},
    notifiedBefore: 0,
    searchedFishId: undefined,
    selectedFishId: undefined,
    fishListWeatherChangePart: {},
    loading: true,
    extraFishListTimePart: {

    },
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
          return (
            this.filters.patches.includes(fish.patch) &&
            (this.filters.completeType === 'ALL' ||
              (this.filters.completeType === 'COMPLETED' && this.getFishCompleted(fish.id)) ||
              (this.filters.completeType === 'UNCOMPLETED' && !this.getFishCompleted(fish.id))) &&
            (this.filters.bigFishType === 'ALL' ||
              (this.filters.bigFishType === 'BIG_FISH' && this.bigFish.includes(fish.id)) ||
              (this.filters.bigFishType === 'ALL_AVAILABLE_BIG_FISH' &&
                this.bigFish.includes(fish.id) &&
                this.fishListTimePart[fish.id]?.countDown?.type === DataUtil.ALL_AVAILABLE) ||
              (this.filters.bigFishType === 'NOT_BIG_FISH' && !this.bigFish.includes(fish.id)))
          )
        })
        .forEach(it => idSet.add(it._id))
      return idSet
    },
    sortedFilteredFishList() {
      const idSet = this.filteredFishIdSet
      return this.sortedFishIds
        .filter(id => idSet.has(id))
        .map(id => this.lazyTransformedFishDict[id])
        .filter(it => !this.getFishPinned(it.id))
        .filter((it, index) => this.filters.fishN === -1 || index < this.filters.fishN)
    },
    pinnedFishList() {
      const fishSourceList = this.lazyTransformedFishList
      const sortedFishIds = this.sortedFishIds
      return sortBy(
        fishSourceList.filter(it => this.getFishPinned(it.id)),
        [
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
      return [this.pinnedFishList, this.sortedFilteredFishList, this.toBeNotifiedFishList].map(list => {
        if (Object.keys(fishListTimePart).length === 0) {
          return {
            type: DataUtil.COUNT_DOWN_TYPE[DataUtil.FISHING],
            cnt: 0,
          }
        }

        const firstNotFishingIndex = list.findIndex(it => fishListTimePart[it.id]?.countDown?.type !== DataUtil.FISHING)
        return {
          type: DataUtil.COUNT_DOWN_TYPE[DataUtil.FISHING],
          cnt: firstNotFishingIndex === -1 ? list.length : firstNotFishingIndex,
        }
      })
    },
    toBeNotifiedFishList() {
      const fishSourceList = this.lazyTransformedFishList
      const sortedFishIds = this.sortedFishIds
      return sortBy(
        fishSourceList.filter(it => this.getFishToBeNotified(it.id)),
        [fish => sortedFishIds.indexOf(fish.id)]
      )
    },
    selectedFish() {
      const fish = this.allFish[this.selectedFishId]
      if (fish) {
        return {
          ...fish,
          parts: {
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
    ...mapState([
      'snackbar',
      'activeTabIndex',
      'showSearchDialog',
      'fish',
      'items',
      'fishingSpots',
      'zones',
      'bigFish',
      'showImportExportDialog',
      'sounds',
    ]),
    ...mapGetters([
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
    ]),
  },
  watch: {
    isMobile: {
      handler(isMobile) {
        if (isMobile) {
          this.mini = false
        }
      },
      immediate: true,
    },
    fishListTimePart: {
      handler: function(fishListTimePart) {
        const newSortedFishIds = sortBy(fishListTimePart, ['countDown.type', 'countDown.time']).map(it => it.id)
        if (!isEqual(this.sortedFishIds, newSortedFishIds)) {
          this.sortedFishIds = newSortedFishIds
        }
      },
      deep: true,
    },
    listFishCnt(listFishCnt) {
      this.$emit('fishCntUpdated', listFishCnt)
    },
    weatherChangeTrigger() {
      this.updateWeatherChangePart(this.now)
    },
  },
  created() {
    this.loading = true
    this.drawer = !this.isMobile
    // setInterval(() => {
    //   this.now = Date.now()
    // }, 1000)
    // console.log(Object.entries(this.zones).map(([key, zone]) => '{ key:' + key + ', zoneName: \'' + zone.name_en + '\'}').join('\n'))
    // const helpMd = import('@/assets/doc/help.md')
    // helpMd.then(it => {
    //   console.log(it.default)
    //   this.$refs.helpArea.innerHTML = it.default
    // })
    if (this.toComparableVersion(this.version) > this.toComparableVersion(this.websiteVersion)) {
      this.showPatchNoteDialog = true
    }

    hotkeys('/', event => {
      if (!this.showSearchDialog) {
        this.setShowSearchDialog(true)
      }
      event.preventDefault()
    })
  },
  async mounted() {
    this.cafeKitTooltipCopyPatch()

    NotificationUtil.requestNotificationPermission().then(status => {
      if (status === 'default') {
        this.showSnackbar({
          text: this.$t('setting.dialog.notification.message.requestNotificationPermissionNotSelected'),
          color: 'quaternary',
        })
      } else if (status === 'denied') {
        this.showSnackbar({
          text: this.$t('setting.dialog.notification.message.requestNotificationPermissionDenied'),
          color: 'tertiary',
        })
      }
    })

    this.now = Date.now()
    this.lazyFishSourceList = Object.values(this.allFish).filter(
      it => it.gig == null && (it.patch == null || it.patch <= DataUtil.PATCH_MAX)
    )
    this.lazyImportantFishSourceList = this.lazyFishSourceList.filter(
      it => this.bigFish.includes(it._id) || !DataUtil.isAllAvailableFish(it)
    )
    this.lazyTransformedFishList = this.assembleFish(this.lazyFishSourceList)
    this.lazyTransformedFishDict = DataUtil.toMap(this.lazyTransformedFishList, fish => fish.id)
    const sounds = await this.loadingSounds()
    this.setSounds(DataUtil.toMap(sounds, it => it.key))
    this.updateWeatherChangePart(this.now)

    setInterval(() => {
      const now = Date.now()
      this.now = now
      this.updateFishListTimePart(now)
      this.checkNotification(now)
      this.loading = false
    }, 1000)

    // this.weatherChangeTrigger *= -1
    setInterval(() => {
      this.weatherChangeTrigger *= -1
    }, WEATHER_CHANGE_INTERVAL_EARTH)
  },
  methods: {
    updateWeatherChangePart(now) {
      this.fishListWeatherChangePart = this.lazyImportantFishSourceList.reduce((fish2WeatherPart, fish) => {
        fish2WeatherPart[fish._id] = {
          fishWindows: this.getFishWindow(fish, now),
        }
        return fish2WeatherPart
      }, {})
    },
    loadingSounds() {
      return Promise.all(
        DataUtil.NOTIFICATION_SOUNDS.map(sound => {
          if (sound.filename == null) return Promise.resolve({ key: sound.key, player: null })
          return import(`@/assets/sound/${sound.filename}`).then(it => {
            return { key: sound.key, player: new Howl({ src: it?.default, preload: true }) }
          })
        })
      )
    },
    updateFishListTimePart(now) {
      this.lazyImportantFishSourceList.forEach(fish => {
        const countDown = this.fishListTimePart[fish._id]?.countDown
        if (countDown?.type === DataUtil.ALL_AVAILABLE) return

        const lazyStartTime = countDown?.timePoint
        let interval, intervalDate, hours, minutes, seconds
        if (lazyStartTime != null) {
          interval = lazyStartTime - now
          intervalDate = new Date(interval)

          hours = intervalDate.getUTCHours()
          minutes = intervalDate.getUTCMinutes()
          seconds = intervalDate.getUTCSeconds()
        }
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
          interval < DataUtil.INTERVAL_MINUTE ||
          (interval < DataUtil.INTERVAL_HOUR && seconds > 57) ||
          (interval < DataUtil.INTERVAL_DAY && minutes > 58 && seconds > 57) ||
          (hours > 22 && minutes > 58 && seconds > 57)
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
    assembleFish(fishSourceList, isPredator = false) {
      return fishSourceList.map(fish => {
        const hasPredators = Object.keys(fish.predators).length > 0
        return {
          // TODO remove _id
          _id: fish._id,
          id: fish._id,
          icon: this.getItemIconClass(fish._id),
          iconRemoteUrl: this.getItemIconUrl(fish._id),
          name: this.getItemName(fish._id),
          hasFishingSpot: fish.locations.length !== 0,
          // zone: this.getZoneName(fish.location),
          // fishingSpot: this.getFishingSpotsName(fish.location),
          fishingSpots: fish.locations.map(location => {
            return {
              zone: this.getZoneName(location),
              fishingSpot: this.getFishingSpotsName(location),
              fishingSpotId: location,
            }
          }),
          baits: this.getBaits(fish),
          hasFishEyes: fish.fishEyes !== false,
          fishEyesIcon: DataUtil.iconIdToClass(DataUtil.ICON_FISH_EYES),
          fishEyesText: DataUtil.secondsToFishEyesString(fish.fishEyes),
          fishEyesSeconds: fish.fishEyes,
          hasPredators: hasPredators,
          predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
          hasSnagging: fish.snagging,
          snaggingIcon: DataUtil.iconIdToClass(DataUtil.ICON_SNAGGING),
          startHourText: DataUtil.formatET(fish.startHour),
          endHourText: DataUtil.formatET(fish.endHour),
          hasTimeConstraint: fish.startHour !== 0 || fish.endHour !== 24,
          requiredCnt: fish.requiredCnt ?? 0,
          addBuffSuffix: hasPredators && DataUtil.isAllAvailableFish(fish),
          weatherSetDetail: this.getWeather(fish.weatherSet),
          hasWeatherConstraint: fish.previousWeatherSet.length > 0 || fish.weatherSet.length > 0,
          previousWeatherSet: fish.previousWeatherSet,
          weatherSet: fish.weatherSet,
          previousWeatherSetDetail: this.getWeather(fish.previousWeatherSet),
          patch: fish.patch,
          isPredator: isPredator,
          predators: this.assembleFish(DataUtil.getPredators(fish, this.allFish), true),
        }
      })
    },
    getCountDown(fish, now) {
      // utilize 8 hours fish windows computed if exists
      // and not out of time(use 2 fish window cached if necessary)
      const fishingSpot = this.fishingSpots[fish.locations[0]]
      if (fishingSpot) {
        const fishWindowsComputed =
          this.fishListWeatherChangePart[fish._id]?.fishWindows ??
          FishWindow.getNextNFishWindows(
            fishingSpot.territory_id,
            new EorzeaTime(now),
            fish.startHour,
            fish.endHour,
            fish.previousWeatherSet,
            fish.weatherSet,
            2
          )

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
            nextInterval: nextTargetFishWindow ? nextTargetFishWindow[0] - now : undefined,
            nextTimePoint: nextTargetFishWindow ? nextTargetFishWindow[0] : undefined,
          }
        }
      } else {
        return { type: DataUtil.ALL_AVAILABLE }
      }
    },
    getFishWindow(fish, now) {
      // console.debug(fish)
      if (Object.keys(fish.predators).length === 0) {
        return this.getFishWindowOfSingleFish(fish, now)
      } else {
        // TODO change to a more efficient way
        const predators = Object.keys(fish.predators).map(predatorId => {
          return this.allFish[predatorId]
        })
        if (predators.every(it => DataUtil.isAllAvailableFish(it) || this.isConstrainsEqual(fish, it))) {
          return this.getFishWindowOfSingleFish(fish, now)
        } else if (predators.length === 1) {
          if (DataUtil.isAllAvailableFish(fish)) {
            return this.getFishWindowOfSingleFish(predators[0], now)
          } else if (fish.weatherSet.length === 0 && fish.previousWeatherSet.length === 0) {
            return this.getFishWindowOfSingleFish(predators[0], now).map(fishWindow => {
              // if start of fish window > 0, i.e. its window is shrunk by the weather
              // change it back to 0, since other 2 predators are always available in [0,8]
              const startEorzeaTime = new EorzeaTime(EorzeaTime.toEorzeaTime(fishWindow[0]))
              if (startEorzeaTime.getHours() > 0) {
                return [
                  startEorzeaTime.timeOfHours(fish.startHour).toEarthTime(),
                  startEorzeaTime.timeOfHours(fish.endHour).toEarthTime(),
                ]
              } else {
                return fishWindow
              }
            })
          }
        } else {
          // So in real life, only 'Warden of the Seven Hues' i.e. "七彩天主" goes here,
          // let do some dirty work

          if (fish._id === 24994) {
            // just return the 'Green Prismfish' i.e. "绿彩鱼" fish windows
            return this.getFishWindowOfSingleFish(this.allFish[24204], now).map(fishWindow => {
              // if start of fish window > 0, i.e. its window is shrunk by the weather
              // change it back to 0, since other 2 predators are always available in [0,8]
              const startEorzeaTime = new EorzeaTime(EorzeaTime.toEorzeaTime(fishWindow[0]))
              if (startEorzeaTime.getHours() > 0) {
                return [startEorzeaTime.timeOfHours(0).toEarthTime(), fishWindow[1]]
              } else {
                return fishWindow
              }
            })
          } else {
            console.error('Unsupported fish!', fish._id)
            return this.getFishWindowOfSingleFish(fish, now)
          }
        }
      }
    },
    mergeConstraints(fish1, fish2) {
      const mergedFish = {
        ...fish1,
        previousWeatherSet: union(fish1.previousWeatherSet, fish2.previousWeatherSet),
        weatherSet: union(fish1.weatherSet, fish2.weatherSet),
        // TODO: actually some ranges are [20-8] but since we checked all fish with predators.
        // So just ignore those impossible cases here...
        startHour: Math.max(fish1.startHour, fish2.startHour),
        endHour: Math.min(fish1.endHour, fish2.endHour),
      }
      console.log(mergedFish)
      return mergedFish
    },
    getFishWindowOfSingleFish(fish, now) {
      return FishWindow.getNextNFishWindows(
        this.fishingSpots[fish.locations[0]]?.territory_id,
        new EorzeaTime(EorzeaTime.toEorzeaTime(now)),
        fish.startHour,
        fish.endHour,
        fish.previousWeatherSet,
        fish.weatherSet
      )
    },
    isConstrainsEqual(fish1, fish2) {
      return (
        isEqual(fish1.previousWeatherSet, fish2.previousWeatherSet) &&
        isEqual(fish1.weatherSet, fish2.weatherSet) &&
        fish1.startHour === fish2.startHour &&
        fish1.endHour === fish2.endHour
      )
    },
    toComparableVersion(version) {
      return version
        .split('.')
        .map(it => it.padStart('0', 5))
        .join('')
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
            this.showSnackbar({ text: this.$t('importExport.dialog.message.copySuccess'), color: 'success' })
            return window.document.getElementsByClassName('ck-item-name-name')[0].innerText.trim()
          }
        },
      })
    },
    toPage(page) {
      this.$router.push({ name: page })
    },
    ...mapMutations([
      'toggleFilterPanel',
      'setShowSearchDialog',
      'setShowImportExportDialog',
      'setWebsiteVersion',
      'setActiveTab',
      'showSnackbar',
      'setSounds',
    ]),
  },
}
</script>

<style>
@import './assets/css/fish_icons.css';

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
  scrollbar-color: #0000001f #00000061;
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
  border: 1px solid #ffffff1f;
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
</style>