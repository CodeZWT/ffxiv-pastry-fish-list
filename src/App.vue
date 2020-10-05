<template>
  <v-app style="opacity: 0.8">
    <v-system-bar app>
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
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        {{ $t('top.toolBarTitle') }}
      </div>
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
            <v-list-item @click="showContactDialog = true">
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
      <v-container class="py-0">
        <router-view />
      </v-container>
    </v-main>
    <v-footer app style="font-size: small">
      <div class="d-flex flex-column" style="width: 100%">
        <div class="d-flex justify-space-between">
          <span>Animated icon by <a href="http://icons8.com">Icons8</a></span>
          <span>红豆年糕@海猫茶屋</span>
        </div>
        <div class="d-flex">
          <span>FINAL FANTASY XIV © 2010 - 2020 SQUARE ENIX CO., LTD. All Rights Reserved.</span>
        </div>
      </div>

      <div class="resize-indicator" />
    </v-footer>
    <v-dialog v-model="showHelpDialog" :fullscreen="isMobile">
      <v-card>
        <v-card-text class="help-area" v-html="helpMd" />
        <v-card-actions>
          <div class="d-flex flex-column flex-fill">
            <v-btn color="default" block text @click="showHelpDialog = false">{{ $t('general.dialog.close') }}</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showContactDialog" :fullscreen="isMobile">
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
            <v-btn color="default" block text @click="showContactDialog = false"
              >{{ $t('general.dialog.close') }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <input type="text" value="" id="clipboard" />
    <v-snackbar :timeout="2000" v-model="snackbar.show" :color="snackbar.color" centered absolute>
      <div class="text-center">{{ snackbar.text }}</div>
    </v-snackbar>
  </v-app>
</template>

<script>
import EorzeaTime from '@/utils/Time'
import '@thewakingsands/axis-font-icons'
import fisher from '@/assets/fisher.png'
import { mapMutations, mapState } from 'vuex'
import helpMd from '@/assets/doc/help.md'
import { version } from '../package.json'

export default {
  name: 'App',
  components: {},
  data: () => ({
    now: Date.now(),
    fisher,
    helpMd,
    version,
    showHelpDialog: false,
    showContactDialog: false,
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
    ...mapState(['snackbar']),
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
  },
  methods: {
    goTo(href) {
      window.open(href)
    },
    ...mapMutations(['toggleFilterPanel', 'setShowSearchDialog', 'setShowImportExportDialog']),
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

html,
body {
  overflow-y: hidden !important;
  /*height: 100%;*/
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

.help-area img {
  width: 100%;
}

.help-area h1 {
  margin-top: 8px;
  margin-bottom: 8px;
}

.help-area h2 {
  margin-top: 8px;
  margin-bottom: 8px;
}

.help-area h3 {
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>