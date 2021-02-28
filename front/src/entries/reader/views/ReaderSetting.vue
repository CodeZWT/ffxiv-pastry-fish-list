<template>
  <v-card class="fill-height">
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" class="d-flex align-center">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">
            区服
          </div>
          <v-btn-toggle v-model="region" rounded dense mandatory active-class="primary">
            <v-btn small>
              国服
            </v-btn>
            <v-btn small>
              国际服
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="12" class="d-flex align-center">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">
            自动标记已完成
          </div>
          <v-switch inset v-model="lazySetting.autoSetCompleted" />
        </v-col>
        <v-col cols="12" class="d-flex align-center">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">
            仅HQ时标记已完成
          </div>
          <v-switch inset v-model="lazySetting.autoSetCompletedOnlyHQ" />
        </v-col>
        <v-card outlined width="100%" class="my-1">
          <div class="overline ml-2">
            计时器
          </div>
          <v-card-text>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazySetting.timer.opacity"
                label="透明度"
                max="1"
                min="0.1"
                step="0.01"
                thumb-label
              />
            </div>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazySetting.timer.zoomFactor"
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
          <div class="overline ml-2">
            历史记录
          </div>
          <v-card-text>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazySetting.history.opacity"
                label="透明度"
                max="1"
                min="0.1"
                step="0.01"
                thumb-label
              />
            </div>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazySetting.history.zoomFactor"
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
          <div class="overline ml-2">
            钓场统计
          </div>
          <v-card-text>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazySetting.spotStatistics.opacity"
                label="透明度"
                max="1"
                min="0.1"
                step="0.01"
                thumb-label
              />
            </div>
            <div class="d-flex align-center">
              <v-slider
                v-model="lazySetting.spotStatistics.zoomFactor"
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
        <div v-if="isTest">{{ lazySetting }}</div>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import isEqual from 'lodash/isEqual'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import { REGIONS } from 'Data/constants'

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
        return REGIONS.indexOf(this.lazySetting.region)
      },
      set(regionIndex) {
        const region = REGIONS[regionIndex]
        this.lazySetting.region = region
        window.electron?.ipcRenderer?.send('restartReader', {
          region,
        })
      },
    },
    ...mapGetters(['readerSetting']),
  },
  watch: {
    lazySetting: {
      handler(lazySetting) {
        console.debug('update setting', lazySetting)
        window.electron?.ipcRenderer?.send('updateUserData', {
          path: 'reader',
          data: lazySetting,
        })
      },
      deep: true,
    },
    readerSetting(readerSetting) {
      if (!isEqual(readerSetting, this.lazySetting)) {
        this.lazySetting = readerSetting
      }
    },
  },
  created() {
    this.lazySetting = this.readerSetting
  },
  methods: {
    ...mapMutations(['updateReaderSetting']),
  },
}
</script>

<style scoped></style>
