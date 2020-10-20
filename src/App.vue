<template>
  <v-app :style="`opacity: ${opacity}`" :class="{ 'min-page': collapse }">
    <v-system-bar app v-show="!collapse">
      <div>
        <v-icon>mdi-fish</v-icon>
        {{ $t('top.systemBarTitle') }} Ver. {{ version }}
      </div>
      <v-spacer />
      <div><i class="xiv eorzea-time-chs mr-1"></i>{{ eorzeaTime }}</div>
      <div class="ml-2">
        <i class="xiv local-time-chs mr-1"></i
        >{{
          earthTime
            .getHours()
            .toString()
            .padStart(2, ' ')
        }}:{{
          earthTime
            .getMinutes()
            .toString()
            .padStart(2, '0')
        }}
      </div>
    </v-system-bar>
    <v-app-bar
      app
      color="primary"
      :collapse="collapse"
      :class="{ 'fish-app-bar': true, 'rounded-pill': collapse, 'fish-app-bar--collapsed': collapse }"
      dense
    >
      <click-helper @click="collapse = !collapse">
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <div class="d-flex">
              <v-avatar size="28" v-bind="attrs" v-on="on">
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
                          <v-icon left small>
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

      <v-toolbar-title>{{ $t('top.toolBarTitle') }}</v-toolbar-title>
      <template v-if="!collapse">
        <v-spacer />
        <click-helper @click="setShowSearchDialog(true)">
          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </click-helper>
        <click-helper @click="toggleFilterPanel">
          <v-btn icon>
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </click-helper>
        <div class="text-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <click-helper v-on="on" v-bind="attrs">
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </click-helper>
            </template>
            <v-list>
              <click-helper @click="setShowImportExportDialog(true)">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <v-icon>mdi-database</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>{{ $t('top.menu') }}</v-list-item-content>
                </v-list-item>
              </click-helper>
              <click-helper @click="showHelpDialog = true">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <v-icon dark>mdi-help-circle</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>{{ $t('top.help') }}</v-list-item-content>
                </v-list-item>
              </click-helper>
              <click-helper @click="showSettingDialog = true">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <v-icon dark>mdi-cog</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>{{ $t('top.setting') }}</v-list-item-content>
                </v-list-item>
              </click-helper>
              <click-helper @click="showPatchNoteDialog = true">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <v-icon dark>mdi-tag</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>{{ $t('top.patchNote') }}</v-list-item-content>
                </v-list-item>
              </click-helper>
              <click-helper @click="showAboutDialog = true">
                <v-list-item @click="noOp">
                  <v-list-item-icon>
                    <v-icon dark>mdi-information</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>{{ $t('top.about') }}</v-list-item-content>
                </v-list-item>
              </click-helper>
            </v-list>
          </v-menu>
        </div>
      </template>

      <template v-slot:extension>
        <v-tabs center-active :value="activeTabIndex" @change="setActiveTab">
          <v-tabs-slider color="white"></v-tabs-slider>

          <v-tab v-for="(notification, index) in listFishCnt" :key="index">
            <v-badge color="tertiary" :value="notification.cnt" :content="notification.cnt">
              <div class="d-flex">
                <v-icon left small>
                  {{ TABS[index].icon }}
                </v-icon>
                <div style="font-size: 16px">{{ $t(TABS[index].title) }}</div>
              </div>
            </v-badge>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <div class="py-0" v-show="!collapse">
        <router-view @fishCntUpdated="listFishCnt = $event" />
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
        <div class="text-truncate" :title="$t('footer.contact')">{{ $t('footer.contact') }}</div>
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
              更新地图范围提示，增加地图：红玉海, 雷克兰德, 拉凯提卡大森林, 游末邦。（持续更新中）
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
              <li>现在点击 "应用" 按钮才会生效。</li>
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
import EorzeaTime from '@/utils/Time'
import '@thewakingsands/axis-font-icons'
import fisher from '@/assets/icon/FSH-white.svg'
import { mapGetters, mapMutations, mapState } from 'vuex'
import helpHTML from '@/assets/doc/help.html'
import { version } from '../package.json'
import ResetButton from '@/components/ResetButton'
import ClickHelper from '@/components/basic/ClickHelper'
import DataUtil from '@/utils/DataUtil'
import FishSettingDialog from '@/components/FishSettingDialog'

export default {
  name: 'App',
  components: { FishSettingDialog, ClickHelper, ResetButton },
  data: () => ({
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
    listFishCnt: [{ cnt: 0 }, { cnt: 0 }, { cnt: 0 }],
    TABS: DataUtil.TABS,
  }),
  computed: {
    // TODO: CHECK different with real eorzea time of 1 minute
    eorzeaTime() {
      return new EorzeaTime(EorzeaTime.toEorzeaTime(this.now))
    },
    earthTime() {
      return new Date(this.now)
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    listFishCntForMini() {
      return this.listFishCnt.slice(0, 2)
    },
    ...mapState(['snackbar', 'activeTabIndex']),
    ...mapGetters(['opacity', 'websiteVersion']),
  },
  created() {
    setInterval(() => {
      this.now = Date.now()
    }, 1000)
    // console.log(Object.entries(this.zones).map(([key, zone]) => '{ key:' + key + ', zoneName: \'' + zone.name_en + '\'}').join('\n'))
    // const helpMd = import('@/assets/doc/help.md')
    // helpMd.then(it => {
    //   console.log(it.default)
    //   this.$refs.helpArea.innerHTML = it.default
    // })
    if (this.toComparableVersion(this.version) > this.toComparableVersion(this.websiteVersion)) {
      this.showPatchNoteDialog = true
    }
  },
  methods: {
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
    ...mapMutations([
      'toggleFilterPanel',
      'setShowSearchDialog',
      'setShowImportExportDialog',
      'setWebsiteVersion',
      'setActiveTab',
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
