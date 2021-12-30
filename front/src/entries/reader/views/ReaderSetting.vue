<template>
  <v-card>
    <v-card-text class="wrapper">
      <v-row no-gutters>
        <v-alert outlined type="warning" border="left">
          若渔捞以及自动同步图鉴功能没有效果，可按照以下步骤排查。
          <ul>
            <li>
              切换下方的检测方式为Npcap，注意第一次需要安装额外的软件，并且在国际服使用加速器时很可能无效。
            </li>
            <li>
              检查有无非系统自带防火墙或杀毒软件（如360、火绒）。建议先关闭后尝试，若可行再尝试加入信任区。
            </li>
            <li>如切换过国际服国服模式或检测模式请尝试重启</li>
            <li>
              如国服游戏窗口只显示“最终”而未显示“最终幻想XIV”，
              <ul>
                <li>
                  查看 控制面板 - 更改日期、时间或数字格式 - 管理 - 更改系统区域设置 -
                  取消勾选“使用Unicode UTF-8提供全球语言支持”
                </li>
                <li>若是其他语言系统可以尝试安装中文包</li>
              </ul>
            </li>
            <li>安装报错可以尝试重新下载安装包</li>
          </ul>
        </v-alert>
        <v-col cols="12" class="d-flex align-center my-1">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">区服</div>
          <v-btn-toggle v-model="region" rounded dense mandatory active-class="primary">
            <v-btn small>国服</v-btn>
            <v-btn small>国际服</v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="12" class="d-flex align-center my-1">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">检测方式</div>
          <v-btn-toggle
            v-model="monitorType"
            rounded
            dense
            mandatory
            active-class="primary"
          >
            <v-btn small>RawSocket</v-btn>
            <v-btn small>Npcap</v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="12">
          <ul>
            <li>RawSocket：受防火墙影响，支持加速器</li>
            <li>
              Npcap：不支持国际服加速器
              <ul>
                <li>第一次开启，需要安装Npcap，点击上方按钮后会弹窗安装</li>
                <li>安装后建议重启鱼糕</li>
              </ul>
            </li>
          </ul>
        </v-col>
        <v-col cols="12" :class="`${themeClass} v-label text-subtitle-1 mt-2`">
          若要设置鼠标穿透，请在右下角系统托盘处右键鱼糕图标选择“打开渔捞鼠标穿透”，或使用下方设置的快捷键。
        </v-col>
        <v-col cols="6" class="d-flex align-center">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">自动标记已完成</div>
          <v-switch inset v-model="lazySetting.autoSetCompleted" />
        </v-col>
        <v-col cols="6" class="d-flex align-center">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">
            仅HQ时标记已完成
          </div>
          <v-switch inset v-model="lazySetting.autoSetCompletedOnlyHQ" />
        </v-col>
        <v-col cols="12" class="d-flex align-center">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">
            仅在钓鱼时显示渔捞
          </div>
          <v-switch inset v-model="lazySetting.showReaderOnlyIfFishing" />
        </v-col>

        <v-col cols="12" v-if="isRoseMode">
          <v-card outlined width="100%" class="my-1">
            <div class="overline ml-2">数据上传</div>
            <v-card-text class="d-flex flex-column">
              <div class="d-flex align-center">
                <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">上传模式</div>
                <v-switch inset v-model="lazySetting.isUploadMode" :disabled="!isLogin" />
              </div>
              <div>
                开启此模式后，钓鱼数据将会上传至鱼糕服务器。无敏感数据，涵盖内容与导出文件中的范围一致。
              </div>
              <div class="d-flex align-center">
                <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">
                  严格数据收集模式
                </div>
                <v-switch inset v-model="lazySetting.isStrictMode" :disabled="!isLogin" />
              </div>

              <div class="font-weight-bold subtitle-1">
                <div>请测试人员在开始测试后开启此开关</div>
                <div>
                  不要使用非必要的技能（如专一，拍击水面，鱼眼）并提起所有咬钩的鱼。
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-card outlined width="100%" class="my-1">
          <div class="overline ml-2">快捷键</div>
          <v-card-text class="d-flex align-center">
            <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">
              切换鱼糕鼠标穿透
            </div>
            <div class="mr-2">
              <kbd class="text-subtitle-1">Alt</kbd>+
              <kbd class="text-subtitle-1">Shift</kbd>+
            </div>
            <v-text-field
              readonly
              :value="lazySetting.hotkey.mouseThrough"
              @keydown="setHotkey('mouseThrough', $event)"
              style="max-width: 36px"
              placeholder="]"
              outlined
              dense
              hide-details
            ></v-text-field>
          </v-card-text>
          <v-card-text class="d-flex align-center">
            <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">切换渔捞显示</div>
            <div class="mr-2">
              <kbd class="text-subtitle-1">Alt</kbd>+
              <kbd class="text-subtitle-1">Shift</kbd>+
            </div>
            <v-text-field
              readonly
              :value="lazySetting.hotkey.toggleReader"
              @keydown="setHotkey('toggleReader', $event)"
              style="max-width: 36px"
              placeholder="]"
              outlined
              dense
              hide-details
            ></v-text-field>
          </v-card-text>
        </v-card>
        <v-card outlined width="100%" class="my-1">
          <div class="overline ml-2">计时器</div>
          <v-card-text>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazyWindowSetting.timer.opacity"
                label="透明度"
                max="1"
                min="0.1"
                step="0.05"
                ticks
                thumb-label
              />
            </div>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazyWindowSetting.timer.zoomFactor"
                max="3"
                min="0.4"
                step="0.1"
                ticks
                label="缩放比例"
                thumb-label
              >
                <template v-slot:thumb-label="{ value }">
                  {{ Math.floor(value * 100) }}%
                </template>
              </v-slider>
            </div>
            <!--            <div class="d-flex align-center">-->
            <!--              <v-slider-->
            <!--                v-model="lazyWindowSetting.timerMini.opacity"-->
            <!--                label="迷你模式透明度"-->
            <!--                max="1"-->
            <!--                min="0.1"-->
            <!--                step="0.05"-->
            <!--                ticks-->
            <!--                thumb-label-->
            <!--              />-->
            <!--            </div>-->
            <div class="d-flex align-center">
              <v-slider
                v-model="lazyWindowSetting.timerMini.zoomFactor"
                max="3"
                min="0.4"
                step="0.1"
                ticks
                label="迷你模式缩放比例"
                thumb-label
              >
                <template v-slot:thumb-label="{ value }">
                  {{ Math.floor(value * 100) }}%
                </template>
              </v-slider>
            </div>
            <div
              v-for="tug in tugSettingTypes"
              class="d-flex flex-column"
              :key="`color-${tug}`"
            >
              <v-subheader class="pl-0">
                {{ $t('tug.' + tug) + '颜色' }}
              </v-subheader>
              <v-color-picker
                v-model="lazySetting.timer.color[tug]"
                mode="hexa"
                swatches-max-height="196"
                hide-canvas
              ></v-color-picker>
            </div>

            <div v-for="tug in TUG_TYPES" class="d-flex flex-column" :key="tug">
              <v-radio-group
                v-model="lazySetting.timer.sound[tug].source"
                :label="$t('tug.' + tug) + '提示音'"
                column
              >
                <v-radio label="内置" value="DEFAULT"></v-radio>
                <v-radio value="CUSTOMIZED">
                  <template v-slot:label>
                    <div class="d-flex align-center">
                      <div>自定义</div>
                      <v-btn
                        text
                        @click="showFileViewer(tug)"
                        :title="lazySetting.timer.sound[tug].customPath"
                      >
                        <v-icon>{{ mdiFileMusicOutline }}</v-icon>
                        <div class="text-truncate" style="max-width: 170px">
                          {{
                            toDisplayFileName(lazySetting.timer.sound[tug].customPath) ||
                              '未选择文件'
                          }}
                        </div>
                      </v-btn>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
              <div class="d-flex">
                <v-slider
                  v-model="lazySetting.timer.sound[tug].volume"
                  max="1"
                  min="0"
                  step="0.01"
                  :label="$t('setting.dialog.notification.volume')"
                  thumb-label
                >
                </v-slider>
                <v-btn icon text @click="ringBell(tug)">
                  <v-icon>{{ mdiPlay }}</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card outlined width="100%" class="my-1">
          <div class="overline ml-2">历史记录</div>
          <v-card-text>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazyWindowSetting.history.opacity"
                label="透明度"
                max="1"
                min="0.1"
                step="0.05"
                ticks
                thumb-label
              />
            </div>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazyWindowSetting.history.zoomFactor"
                max="3"
                min="0.4"
                step="0.1"
                ticks
                label="缩放比例"
                thumb-label
              >
                <template v-slot:thumb-label="{ value }">
                  {{ Math.floor(value * 100) }}%
                </template>
              </v-slider>
            </div>
          </v-card-text>
        </v-card>

        <v-card outlined width="100%" class="my-1">
          <div class="overline ml-2">钓场统计</div>
          <v-card-text>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazyWindowSetting.spotStatistics.opacity"
                label="透明度"
                max="1"
                min="0.1"
                step="0.05"
                ticks
                thumb-label
              />
            </div>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazyWindowSetting.spotStatistics.zoomFactor"
                max="3"
                min="0.4"
                step="0.1"
                ticks
                label="缩放比例"
                thumb-label
              >
                <template v-slot:thumb-label="{ value }">
                  {{ Math.floor(value * 100) }}%
                </template>
              </v-slider>
            </div>
          </v-card-text>
        </v-card>
        <!--        <div v-if="isTest">{{ lazySetting }}</div>-->
      </v-row>
    </v-card-text>
    <!--    <v-divider />-->
    <!--    <v-card-actions>-->
    <!--      <v-btn @click="saveSetting" block color="primary">应用设置</v-btn>-->
    <!--    </v-card-actions>-->
    <v-dialog v-model="showInstallNpcapPrompt" max-width="300">
      <v-card>
        <v-card-title>安装Npcap支持</v-card-title>
        <v-card-text v-if="!installing">
          <div>点击安装后会开始Npcap安装流程。</div>
          <div>建议安装后重新启动鱼糕。</div>
          <div>若杀毒软件出现弹窗，请选择允许。</div>
        </v-card-text>
        <v-card-text v-else>
          <div>安装中...按照默认配置安装即可</div>
          <div>若杀毒软件出现弹窗，请允许</div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="installNpcap()" color="primary" :disabled="installing">
            安装
          </v-btn>
          <v-btn @click="cancelInstall()">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { MONITOR_TYPES, REGIONS } from 'Data/constants'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { mdiFileMusicOutline, mdiPlay } from '@mdi/js'
import { sendElectronEvent } from '@/utils/electronHelper'
import DataUtil from '@/utils/DataUtil'
import EnvMixin from '@/components/basic/EnvMixin'
import _ from 'lodash'
import last from 'lodash/last'
import set from 'lodash/set'

export default {
  name: 'ReaderSetting',
  mixins: [EnvMixin],
  data() {
    return {
      db: undefined,
      mdiFileMusicOutline,
      mdiPlay,
      lazySetting: {},
      lazyWindowSetting: {
        timer: {},
        timerMini: {},
        history: {},
        spotStatistics: {},
      },
      TUG_TYPES: DataUtil.TUG_TYPES,
      tugSettingTypes: ['default', ...DataUtil.TUG_TYPES],
      showInstallNpcapPrompt: false,
      installing: false,
    }
  },
  computed: {
    themeClass() {
      return this.$vuetify.theme.dark ? 'theme--dark' : 'theme--light'
    },
    region: {
      get() {
        return REGIONS.indexOf(this.lazySetting.region)
      },
      set(regionIndex) {
        this.lazySetting.region = REGIONS[regionIndex]
      },
    },
    monitorType: {
      get() {
        return MONITOR_TYPES.indexOf(this.lazySetting.monitorType)
      },
      set(monitorTypeIndex) {
        this.lazySetting.monitorType = MONITOR_TYPES[monitorTypeIndex]
      },
    },
    ...mapState(['sounds']),
    ...mapGetters(['readerSetting', 'isRoseMode']),
  },
  watch: {
    readerSetting(readerSetting) {
      if (!_.isEqual(readerSetting, this.lazySetting)) {
        this.lazySetting = readerSetting
      }
    },
    lazySetting: {
      handler(lazySetting) {
        console.debug('update setting', lazySetting)
        this.updateReaderSetting(lazySetting)
        // sendElectronEvent('updateUserData', {
        //   path: 'reader',
        //   data: lazySetting,
        // })
        // this.saveSetting()
      },
      deep: true,
    },
    lazyWindowSetting: {
      handler(lazyWindowSetting) {
        console.debug('update window setting', lazyWindowSetting)
        if (lazyWindowSetting.setting) {
          sendElectronEvent('updateWindowSetting', lazyWindowSetting)
        }
      },
      deep: true,
    },
    // readerSetting(readerSetting) {
    //   if (!isEqual(readerSetting, this.lazySetting)) {
    //     this.lazySetting = readerSetting
    //   }
    // },
  },
  async created() {
    this.db = (await import('@/plugins/db')).default
    this.lazySetting = this.readerSetting
    this.lazyWindowSetting = await this.getWindowSetting()
    window.electron?.ipcRenderer
      ?.on('installNpcapPrompt', () => {
        this.showInstallNpcapPrompt = true
      })
      ?.on('installNpcapFishined', () => {
        this.installing = false
        this.showInstallNpcapPrompt = false
      })
  },
  methods: {
    setHotkey(hotkey, event) {
      if (event.code.indexOf('Key') === 0) {
        this.lazySetting.hotkey[hotkey] = this.keyCodeToKey(event.code)
      }
    },
    keyCodeToKey(code) {
      if (code.indexOf('Key') === 0) {
        return code.substring('Key'.length)
      } else {
        return code
      }
    },
    installNpcap() {
      this.installing = true
      return window.electron?.ipcRenderer.send('installNpcap')
    },
    cancelInstall() {
      this.installing = false
      this.showInstallNpcapPrompt = false
      this.monitorType = 0
    },
    getWindowSetting() {
      return window.electron?.ipcRenderer
        ?.invoke('getWindowSetting')
        ?.then(setting => (this.lazyWindowSetting = setting))
    },
    // saveSetting() {
    //   console.debug('update setting', this.lazySetting)
    //   sendElectronEvent('updateUserData', {
    //     path: 'reader',
    //     data: this.lazySetting,
    //   })
    //   sendElectronEvent('updateWindowSetting', this.lazyWindowSetting)
    // },
    toDisplayFileName(path) {
      return path && last(path.split('\\'))
    },
    showFileViewer(type) {
      window.electron?.ipcRenderer?.invoke('showOpenSoundFileDialog').then(result => {
        if (!result.cancelled) {
          this.db.sounds
            .put({
              id: `${type}-custom`,
              base64: result.base64,
              filePath: result.filePath,
            })
            .then(() => {
              set(this.lazySetting, `timer.sound.${type}.customPath`, result.filePath)
              console.debug('loading sounds in setting')
              this.loadingSounds().then(sounds =>
                this.setSounds(DataUtil.toMap(sounds, it => it.key))
              )
            })
            .catch(error => console.error('storeError', error))
        }
      })
    },
    ringBell(tugType) {
      DataUtil.ringBell(this.lazySetting.timer.sound, tugType, this.sounds)
    },
    loadingSounds() {
      return DataUtil.loadingSounds(this.db)
    },
    ...mapMutations(['setSounds', 'updateReaderSetting']),
  },
}
</script>

<style lang="sass" scoped>
//@import "~@/styles/RcVariables"
//.wrapper
//  height: calc(100vh - #{ $top-bars-padding-reader }) // - 52px
//  overflow-y: scroll
//  overflow-x: hidden
</style>
