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
    <!--    <v-btn v-if="collapse" @click="toggleCollapse"-->
    <!--           elevation="5"-->
    <!--           fab-->
    <!--           color="primary"-->
    <!--           class="mt-9 ml-2"-->
    <!--           small-->
    <!--    >-->
    <!--      <v-avatar size="28">-->
    <!--        <img :src="fisher" />-->
    <!--      </v-avatar>-->
    <!--    </v-btn>-->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="collapse = !collapse">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-avatar size="28" v-on="on">
              <img :src="fisher" />
            </v-avatar>
          </template>
          <span>{{ $t('top.collapseHint') }}</span>
        </v-tooltip>
      </v-app-bar-nav-icon>

      <v-toolbar-title>{{ $t('top.toolBarTitle') }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="setShowSearchDialog(true)">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon @click="toggleFilterPanel">
        <v-icon>mdi-filter</v-icon>
      </v-btn>
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="setShowImportExportDialog(true)">
              <v-list-item-icon>
                <v-icon>mdi-database</v-icon>
              </v-list-item-icon>
              <v-list-item-content>{{ $t('top.menu') }}</v-list-item-content>
            </v-list-item>
            <v-list-item @click="showHelpDialog = true">
              <v-list-item-icon>
                <v-icon dark>mdi-help-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content>{{ $t('top.help') }}</v-list-item-content>
            </v-list-item>
            <v-list-item @click="showSettingDialog = true">
              <v-list-item-icon>
                <v-icon dark>mdi-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-content>{{ $t('top.setting') }}</v-list-item-content>
            </v-list-item>
            <v-list-item @click="showPatchNoteDialog = true">
              <v-list-item-icon>
                <v-icon dark>mdi-tag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>{{ $t('top.patchNote') }}</v-list-item-content>
            </v-list-item>
            <v-list-item @click="showAboutDialog = true">
              <v-list-item-icon>
                <v-icon dark>mdi-information</v-icon>
              </v-list-item-icon>
              <v-list-item-content>{{ $t('top.about') }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main>
      <v-container class="py-0" v-if="!collapse">
        <router-view />
      </v-container>
      <v-container class="py-0" v-if="!collapse">
        <v-row>
          <v-col class="d-flex flex-row justify-end">
            <span>Animated icon by <a @click="goTo('http://icons8.com')">Icons8</a></span>
            <v-spacer />
            <span>FINAL FANTASY XIV © 2010 - 2020 SQUARE ENIX CO., LTD. All Rights Reserved.</span>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer app style="font-size: small" v-if="!collapse">
      <span>红豆年糕@海猫茶屋</span>
      <v-spacer />
      <span>群：1153646847</span>
      <div class="resize-indicator" />
    </v-footer>
    <v-dialog v-model="showSettingDialog" :fullscreen="isMobile" max-width="600px" scrollable>
      <v-card>
        <v-card-title>
          {{ $t('top.setting') }}
        </v-card-title>
        <v-card-text class="pt-10">
          <v-slider
            v-model="pageOpacity"
            max="1"
            min="0.1"
            step="0.01"
            :label="$t('setting.dialog.opacity')"
            :hint="$t('setting.dialog.opacityHint')"
            thumb-label
          >
            <template v-slot:append>
              <v-text-field
                :value="pageOpacityShowing"
                @input="pageOpacity = $event"
                class="mt-0 pt-0"
                type="number"
                style="width: 60px"
              />
            </template>
          </v-slider>
        </v-card-text>
        <v-card-actions>
          <div class="d-flex flex-column flex-fill">
            <v-btn color="default" block text @click="showSettingDialog = false">
              {{ $t('general.dialog.close') }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showPatchNoteDialog" max-width="600px" scrollable>
      <v-card>
        <v-card-title>
          {{ $t('top.patchNote') }}
        </v-card-title>
        <v-card-text style="max-height: 600px;">
          <div class="text-h6">Version 0.1.5</div>
          <ul>
            <li>更新帮助文档，ACT相关。现在通过配置ACT可以正常输入了。</li>
            <li>更新所有对话框的滚动条，以及一些样式更新。</li>
            <li>更新滚动条，调整粒度变为0.01，可直接输入。</li>
            <li>复制、链接按钮大小。</li>
            <li>更新页脚。</li>
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
            <v-btn color="primary" block @click="onConfirmPatchNote">
              {{ $t('general.dialog.confirm') }}
            </v-btn>
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
            <v-btn color="default" block text @click="showHelpDialog = false">{{ $t('general.dialog.close') }}</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showAboutDialog" :fullscreen="isMobile" max-width="600px" scrollable>
      <v-card>
        <v-card-text class="contact-area">
          <div>ID：红豆年糕 @ 海猫茶屋</div>
          <div>群：1153646847</div>
          <div>欢迎使用本站，感谢来自于各个开源作者的支持：</div>
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
            <v-btn class="mt-2" color="default" block text @click="showAboutDialog = false">
              {{ $t('general.dialog.close') }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <input type="text" value="" id="clipboard" />
    <v-snackbar :timeout="2000" v-model="snackbar.show" :color="snackbar.color" centered elevation="24">
      <div class="text-center">{{ snackbar.text }}</div>
    </v-snackbar>
  </v-app>
</template>

<script>
import EorzeaTime from '@/utils/Time'
import '@thewakingsands/axis-font-icons'
import fisher from '@/assets/fisher.png'
import { mapGetters, mapMutations, mapState } from 'vuex'
import helpHTML from '@/assets/doc/help.html'
import { version } from '../package.json'
import ResetButton from '@/components/ResetButton'
import { debounce } from 'lodash'

export default {
  name: 'App',
  components: { ResetButton },
  data: () => ({
    now: Date.now(),
    fisher,
    version,
    helpHTML,
    showHelpDialog: false,
    showAboutDialog: false,
    showSettingDialog: false,
    showPatchNoteDialog: false,
    collapse: false,
    debounceSetPageOpacity: undefined,
    pageOpacityShowing: 0,
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
    pageOpacity: {
      get() {
        return this.opacity
      },
      set(opacity) {
        this.pageOpacityShowing = opacity
        this.debounceSetPageOpacity(opacity)
      },
    },
    ...mapState(['snackbar']),
    ...mapGetters(['opacity', 'websiteVersion']),
  },
  created() {
    setInterval(() => {
      this.now = Date.now()
    }, 1000)
    this.debounceSetPageOpacity = debounce(this.setOpacity, 500)
    // console.log(Object.entries(this.zones).map(([key, zone]) => '{ key:' + key + ', zoneName: \'' + zone.name_en + '\'}').join('\n'))
    // const helpMd = import('@/assets/doc/help.md')
    // helpMd.then(it => {
    //   console.log(it.default)
    //   this.$refs.helpArea.innerHTML = it.default
    // })
    this.pageOpacityShowing = this.opacity
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
      console.log('click!!!!!!!')
    },
    ...mapMutations([
      'toggleFilterPanel',
      'setShowSearchDialog',
      'setShowImportExportDialog',
      'setOpacity',
      'setWebsiteVersion',
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
  z-index: 100 !important;
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
</style>