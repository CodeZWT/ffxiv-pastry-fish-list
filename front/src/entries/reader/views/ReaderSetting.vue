<template>
  <v-card>
    <v-card-text class="wrapper">
      <v-row no-gutters>
        <v-col cols="12" class="d-flex align-center">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">区服</div>
          <v-btn-toggle v-model="region" rounded dense mandatory active-class="primary">
            <v-btn small>国服</v-btn>
            <v-btn small>国际服</v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="12" class="d-flex align-center">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">自动标记已完成</div>
          <v-switch inset v-model="lazySetting.autoSetCompleted" />
        </v-col>
        <v-col cols="12" class="d-flex align-center">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">
            仅HQ时标记已完成
          </div>
          <v-switch inset v-model="lazySetting.autoSetCompletedOnlyHQ" />
        </v-col>
        <v-card outlined width="100%" class="my-1">
          <div class="overline ml-2">计时器</div>
          <v-card-text>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazyWindowSetting.timer.opacity"
                label="透明度"
                max="1"
                min="0.1"
                step="0.01"
                thumb-label
              />
            </div>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazyWindowSetting.timer.zoomFactor"
                max="3"
                min="0.3"
                step="0.1"
                label="缩放比例"
                thumb-label
              >
                <template v-slot:thumb-label="{ value }">
                  {{ Math.floor(value * 100) }}%
                </template>
              </v-slider>
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
                        <v-icon>mdi-file-music-outline</v-icon>
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
                  <v-icon>mdi-play</v-icon>
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
                step="0.01"
                thumb-label
              />
            </div>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazyWindowSetting.history.zoomFactor"
                max="3"
                min="0.3"
                step="0.1"
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
                step="0.01"
                thumb-label
              />
            </div>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazyWindowSetting.spotStatistics.zoomFactor"
                max="3"
                min="0.3"
                step="0.1"
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
    <v-divider />
    <v-card-actions>
      <v-btn @click="saveSetting" block color="primary">应用设置</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
// import isEqual from 'lodash/isEqual'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import { REGIONS } from 'Data/constants'
import set from 'lodash/set'
import last from 'lodash/last'
import db from '@/plugins/db'
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'ReaderSetting',
  props: {
    now: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      lazySetting: {},
      lazyWindowSetting: {
        region: undefined,
        timer: {},
        history: {},
        spotStatistics: {},
      },
      TUG_TYPES: DataUtil.TUG_TYPES,
    }
  },
  computed: {
    isTest() {
      return DevelopmentModeUtil.isTest()
    },
    themeClass() {
      return this.$vuetify.theme.dark ? 'theme--dark' : 'theme--light'
    },
    region: {
      get() {
        return REGIONS.indexOf(this.lazyWindowSetting.region)
      },
      set(regionIndex) {
        this.lazySetting.region = REGIONS[regionIndex]
      },
    },
    ...mapState(['sounds']),
    ...mapGetters(['readerSetting']),
  },
  watch: {
    // lazySetting: {
    //   handler(lazySetting) {
    //     console.debug('update setting', lazySetting)
    //     window.electron?.ipcRenderer?.send('updateUserData', {
    //       path: 'reader',
    //       data: lazySetting,
    //     })
    //   },
    //   deep: true,
    // },
    // readerSetting(readerSetting) {
    //   if (!isEqual(readerSetting, this.lazySetting)) {
    //     this.lazySetting = readerSetting
    //   }
    // },
  },
  async created() {
    this.lazySetting = this.readerSetting
    this.lazyWindowSetting = await this.getWindowSetting()
  },
  methods: {
    getWindowSetting() {
      return window.electron?.ipcRenderer
        ?.invoke('getWindowSetting')
        ?.then(setting => (this.lazyWindowSetting = setting))
    },
    saveSetting() {
      console.debug('update setting', this.lazySetting)
      window.electron?.ipcRenderer?.send('updateUserData', {
        path: 'reader',
        data: this.lazySetting,
      })
      window.electron?.ipcRenderer?.send('updateWindowSetting', this.lazyWindowSetting)
    },
    toDisplayFileName(path) {
      return path && last(path.split('\\'))
    },
    showFileViewer(type) {
      window.electron?.ipcRenderer?.invoke('showOpenSoundFileDialog').then(result => {
        console.info(result)
        if (!result.cancelled) {
          db.sounds
            .put({
              id: `${type}-custom`,
              base64: result.base64,
              filePath: result.filePath,
            })
            .then(() => {
              set(this.lazySetting, `timer.sound.${type}.customPath`, result.filePath)
            })
            .catch(error => console.error('storeError', error))
        }
      })
    },
    ringBell(tugType) {
      DataUtil.ringBell(this.lazySetting.timer.sound, tugType, this.sounds)
    },
    ...mapMutations(['updateReaderSetting']),
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"
.wrapper
  height: calc(100vh - #{ $top-bars-padding-reader } - 52px)
  overflow-y: scroll
  overflow-x: hidden
</style>
