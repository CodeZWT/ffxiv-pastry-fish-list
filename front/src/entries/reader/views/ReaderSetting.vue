<template>
  <v-card class="fill-height">
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" class="d-flex align-center">
          <div :class="themeClass + ' v-label text-subtitle-1 mr-4'">
            自动标记已完成
          </div>
          <v-switch inset v-model="lazySetting.autoSetCompleted" />
        </v-col>
        <v-col cols="12" class="d-flex align-center">
          <v-slider
            v-model="lazySetting.timerOpacity"
            label="设置计时器透明度"
            max="1"
            min="0.1"
            step="0.01"
            thumb-label
          />
        </v-col>
        <v-col cols="12" class="d-flex align-center">
          <v-slider
            v-model="lazySetting.historyOpacity"
            label="设置历史记录透明度"
            max="1"
            min="0.1"
            step="0.01"
            thumb-label
          />
        </v-col>
        <div v-if="isTest">{{ lazySetting }}</div>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import isEqual from 'lodash/isEqual'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'

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
  mounted() {
    this.lazySetting = this.readerSetting
  },
  methods: {
    ...mapMutations(['updateReaderSetting']),
  },
}
</script>

<style scoped></style>
