<template>
  <screen-window
    :id="id"
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :z="item.z"
    frameless
    title="菜单"
    :resizable="false"
  >
    <div style="height: 64px; width: 64px" class="d-flex align-center justify-center">
      <rc-dialog v-model="showWindowMenu" max-width="600">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" elevation="2" fab outlined>
            <v-img
              src="https://cdn.jsdelivr.net/gh/ricecake404/images@main/img/pastry-fish.png"
              width="38"
              height="38"
              contain
            ></v-img>
            <!--        <v-icon large>mdi-cat</v-icon>-->
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <div class="d-flex align-center" style="width: 100%">
              <div>功能菜单</div>
              <v-spacer />
              <div>鱼糕</div>
              <v-badge :content="version" inline />
            </div>
          </v-card-title>
          <v-card-text>
            <v-row @click="showWindowMenu = false">
              <v-col>
                <v-subheader>鱼糕</v-subheader>
                <v-list>
                  <!--                  <v-list-item @click="addFishList">-->
                  <!--                    <v-list-item-icon>-->
                  <!--                      <v-icon>mdi-format-list-text</v-icon>-->
                  <!--                    </v-list-item-icon>-->
                  <!--                    <v-list-item-content>-->
                  <!--                      <v-list-item-title>{{-->
                  <!--                        $t('list.normalTitle')-->
                  <!--                      }}</v-list-item-title></v-list-item-content-->
                  <!--                    >-->
                  <!--                  </v-list-item>-->
                  <!--                  <v-list-item @click="addNotificationList">-->
                  <!--                    <v-list-item-icon>-->
                  <!--                      <v-icon>mdi-bell</v-icon>-->
                  <!--                    </v-list-item-icon>-->
                  <!--                    <v-list-item-content>-->
                  <!--                      <v-list-item-title>{{-->
                  <!--                        $t('list.toBeNotifiedTitle')-->
                  <!--                      }}</v-list-item-title></v-list-item-content-->
                  <!--                    >-->
                  <!--                  </v-list-item>-->
                  <!--                  <v-list-item @click="addWiki">-->
                  <!--                    <v-list-item-icon>-->
                  <!--                      <v-icon>mdi-notebook</v-icon>-->
                  <!--                    </v-list-item-icon>-->
                  <!--                    <v-list-item-content>-->
                  <!--                      <v-list-item-title>{{-->
                  <!--                        $t('top.fishWiki')-->
                  <!--                      }}</v-list-item-title></v-list-item-content-->
                  <!--                    >-->
                  <!--                  </v-list-item>-->
                  <!--                  <v-list-item @click="addOceanFishing">-->
                  <!--                    <v-list-item-icon>-->
                  <!--                      <v-icon>mdi-ferry</v-icon>-->
                  <!--                    </v-list-item-icon>-->
                  <!--                    <v-list-item-content>-->
                  <!--                      <v-list-item-title>{{-->
                  <!--                        $t('top.oceanFishing')-->
                  <!--                      }}</v-list-item-title></v-list-item-content-->
                  <!--                    >-->
                  <!--                  </v-list-item>-->
                  <!--                  <v-list-item @click="addDiadem">-->
                  <!--                    <v-list-item-icon>-->
                  <!--                      <v-img-->
                  <!--                        :src="dark ? diademDark : diademLight"-->
                  <!--                        height="24"-->
                  <!--                        width="24"-->
                  <!--                      ></v-img>-->
                  <!--                    </v-list-item-icon>-->
                  <!--                    <v-list-item-content>-->
                  <!--                      <v-list-item-title>{{-->
                  <!--                        $t('top.diadem')-->
                  <!--                      }}</v-list-item-title></v-list-item-content-->
                  <!--                    >-->
                  <!--                  </v-list-item>-->
                  <!--                  <v-list-item @click="addAquarium">-->
                  <!--                    <v-list-item-icon>-->
                  <!--                      <v-icon>mdi-fishbowl</v-icon>-->
                  <!--                    </v-list-item-icon>-->
                  <!--                    <v-list-item-content>-->
                  <!--                      <v-list-item-title>{{-->
                  <!--                        $t('top.aquarium')-->
                  <!--                      }}</v-list-item-title></v-list-item-content-->
                  <!--                    >-->
                  <!--                  </v-list-item>-->
                  <!--                  <v-list-item @click="addCompetition">-->
                  <!--                    <v-list-item-icon>-->
                  <!--                      <v-icon>mdi-trophy</v-icon>-->
                  <!--                    </v-list-item-icon>-->
                  <!--                    <v-list-item-content>-->
                  <!--                      <v-list-item-title>{{ $t('top.competition') }}</v-list-item-title>-->
                  <!--                    </v-list-item-content>-->
                  <!--                  </v-list-item>-->
                  <v-list-item @click="showExtraMainWindow()">
                    <v-list-item-icon>
                      <v-icon>mdi-desktop-mac-dashboard</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        鱼糕
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-subheader>其他</v-subheader>
                <v-list>
                  <v-list-item @click="showGlobalSettingDialog = true">
                    <v-list-item-icon>
                      <v-icon>mdi-cog</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        $t('top.uiConfig')
                      }}</v-list-item-title></v-list-item-content
                    >
                  </v-list-item>

                  <v-list-item @click="setShowImportExportDialog(true)">
                    <v-list-item-icon>
                      <v-icon>mdi-database</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title> {{ $t('top.menu') }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item v-if="downloadProgress > 0" link @click="showUpdateDialog">
                    <v-list-item-icon>
                      <div>
                        <v-progress-circular
                          rotate="-90"
                          size="24"
                          :value="downloadProgress"
                        >
                          <div style="font-size: x-small">
                            {{
                              downloadProgress === 100 ? '' : Math.floor(downloadProgress)
                            }}
                          </div>
                        </v-progress-circular>
                      </div>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{
                          downloadProgress === 100
                            ? $t('top.downloaded')
                            : $t('top.downloading')
                        }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="exit">
                    <v-list-item-icon>
                      <v-icon class="error--text">mdi-close</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="error--text">
                      <v-list-item-title> 退出鱼糕 </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col>
                <v-subheader>渔捞</v-subheader>
                <v-list>
                  <v-list-item @click="addReaderTimer">
                    <v-list-item-icon>
                      <v-icon>mdi-timer</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>计时器</v-list-item-title></v-list-item-content
                    >
                  </v-list-item>
                  <v-list-item @click="addReaderTimerMini">
                    <v-list-item-icon>
                      <v-icon>mdi-timer</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >迷你计时器</v-list-item-title
                      ></v-list-item-content
                    >
                  </v-list-item>
                  <v-list-item @click="addReaderHistory">
                    <v-list-item-icon>
                      <v-icon>mdi-history</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >本地历史记录</v-list-item-title
                      ></v-list-item-content
                    >
                  </v-list-item>
                  <v-list-item @click="addReaderSpotStatistics">
                    <v-list-item-icon>
                      <v-icon>mdi-map</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >本地钓场统计</v-list-item-title
                      ></v-list-item-content
                    >
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </rc-dialog>

      <update-dialog
        v-model="showCheckStartSetupDialog"
        :progress="downloadProgress"
        @update="startUpdate"
        @skip="skipUpdate"
      />
      <global-setting-dialog
        v-model="showGlobalSettingDialog"
        @show-setting="showMainSetting"
        @show-about="$emit('show-about')"
      />
    </div>
  </screen-window>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { sendElectronEvent } from '@/utils/electronHelper'
import { version } from '../../../../package.json'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import GlobalSettingDialog from '@/entries/screen/views/GlobalSettingDialog'
import ImgUtil from '@/utils/ImgUtil'
import RcDialog from '@/components/basic/RcDialog'
import ScreenWindow from '@/components/basic/screen/ScreenWindow'
import UpdateDialog from '@/components/Dialog/UpdateDialog'
import WindowMixin from '@/components/basic/screen/WindowMixin'

export default {
  name: 'MenuWindow',
  mixins: [WindowMixin],
  components: {
    GlobalSettingDialog,
    UpdateDialog,
    RcDialog,
    ScreenWindow,
  },
  props: {
    dark: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    showGlobalSettingDialog: false,
    isElectron: DevelopmentModeUtil.isElectron(),
    downloadProgress: 0,
    showCheckStartSetupDialog: false,
    showWindowMenu: false,
    diademDark: ImgUtil.getImgUrl('diadem-dark-24x24.png'),
    diademLight: ImgUtil.getImgUrl('diadem-light-24x24.png'),
  }),
  computed: {
    ...mapGetters(['isRoseMode']),
    ...mapGetters('screenWindow', ['isOpen']),
    version() {
      return version
    },
  },
  created() {
    window.electron?.ipcRenderer
      ?.on('setupDownload', (event, data) => {
        if (this.downloadProgress < 100) {
          this.downloadProgress = data.percent * 100
        }
      })
      ?.on('checkStartSetup', () => {
        this.downloadProgress = 100
        this.showUpdateDialog()
      })
      ?.on('toggleMenu', () => {
        this.showWindowMenu = !this.showWindowMenu
      })
      // ?.on('toggleMain', () => {
      //   if (this.isOpen('MAIN')) {
      //     this.closeWindow('MAIN')
      //   } else {
      //     this.showPrevMainWindow()
      //   }
      // })
      ?.on('toggleReaderTimer', () => {
        if (this.isOpen('READER_TIMER')) {
          this.closeWindow('READER_TIMER')
        } else {
          this.addReaderTimer()
        }
      })
      ?.on('toggleReaderTimerMini', () => {
        if (this.isOpen('READER_TIMER_MINI')) {
          this.closeWindow('READER_TIMER_MINI')
        } else {
          this.addReaderTimerMini()
        }
      })
      ?.on('toggleReaderHistory', () => {
        if (this.isOpen('READER_HISTORY')) {
          this.closeWindow('READER_HISTORY')
        } else {
          this.addReaderHistory()
        }
      })
      ?.on('toggleReaderSpotStatistics', () => {
        if (this.isOpen('READER_SPOT_STATISTICS')) {
          this.closeWindow('READER_SPOT_STATISTICS')
        } else {
          this.addReaderSpotStatistics()
        }
      })
  },
  methods: {
    ...mapActions('screenWindow', ['showPrevMainWindow']),
    ...mapMutations('screenWindow', ['showWindow']),
    ...mapMutations(['setShowImportExportDialog']),
    showExtraMainWindow() {
      sendElectronEvent('showMainWindow')
    },
    showAboutDialog() {
      this.$emit('show-about')
    },
    showUpdateDialog() {
      this.showCheckStartSetupDialog = true
    },
    startUpdate() {
      sendElectronEvent('startUpdate')
    },
    skipUpdate() {
      sendElectronEvent('skipUpdate')
      this.showCheckStartSetupDialog = false
    },
    showMainSetting() {
      this.$emit('show-setting')
    },
    addReaderTimer() {
      this.showWindow({
        type: 'READER_TIMER',
      })
    },
    addReaderTimerMini() {
      this.showWindow({
        type: 'READER_TIMER_MINI',
      })
    },
    addReaderHistory() {
      this.showWindow({
        type: 'READER_HISTORY',
      })
    },
    addReaderSpotStatistics() {
      this.showWindow({
        type: 'READER_SPOT_STATISTICS',
      })
    },
    addFishList() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'ListPage',
        tabIndex: 0,
      })
    },
    addNotificationList() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'ListPage',
        tabIndex: 1,
      })
    },
    addWiki() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'WikiPage',
      })
    },
    addOceanFishing() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'OceanFishingPage54',
      })
    },
    addDiadem() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'DiademPage',
      })
    },
    addAquarium() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'AquariumPage',
      })
    },
    addCompetition() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'CompetitionPage',
      })
    },
    addRecord() {
      this.showWindow({
        type: 'MAIN',
        subPage: 'RecordPage',
      })
    },
    exit() {
      sendElectronEvent('quit')
    },
  },
}
</script>

<style scoped lang="sass"></style>
