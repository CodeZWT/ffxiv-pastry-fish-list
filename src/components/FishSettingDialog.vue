<template>
  <v-dialog v-model="showSettingDialog" :fullscreen="isMobile" max-width="600px" scrollable>
    <v-card>
      <v-card-title>
        {{ $t('top.setting') }}
      </v-card-title>
      <v-card-text class="py-0">
        <v-row>
          <v-col cols="12">
            <div class="text-subtitle-1">页面透明度</div>
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
            <v-divider />
          </v-col>
          <v-col cols="12">
            <div class="text-subtitle-1">闹钟</div>
            <div>
              <v-slider
                v-model="lazyNotificationSetting.volume"
                max="1"
                min="0"
                step="0.01"
                :label="$t('setting.dialog.notification.volume')"
                thumb-label
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="lazyNotificationSetting.volume"
                    class="mt-0 pt-0"
                    type="number"
                    style="width: 60px"
                  />
                </template>
              </v-slider>
            </div>
            <div v-for="setting in lazyNotificationSetting.settings" :key="setting.key" class="d-flex align-center">
              <v-row>
                <v-col class="col-sm-4 col-6">
                  <v-checkbox
                    v-model="setting.enabled"
                    :label="$t(`setting.dialog.notification.enabled.${setting.key}`)"
                  />
                </v-col>
                <v-col class="col-sm-3 col-6">
                  <v-text-field
                    v-if="setting.hasBefore"
                    v-model="setting.before"
                    label="提前"
                    suffix="分"
                    min="0"
                    max="20"
                    type="number"
                    prepend-icon="mdi-alarm-note"
                  />
                </v-col>
                <v-col class="col-sm-5 col-12 d-flex align-center">
                  <v-select
                    v-model="setting.sound"
                    :items="NOTIFICATION_SOUNDS"
                    item-text="name_chs"
                    item-value="key"
                    :label="'选择音效'"
                  />
                  <v-btn icon @click="playSound(setting.sound)">
                    <v-icon>mdi-play</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex flex-column flex-fill">
          <click-helper @click="showSettingDialog = false">
            <v-btn color="default" block text>
              {{ $t('general.dialog.close') }}
            </v-btn>
          </click-helper>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { cloneDeep, debounce } from 'lodash'
import ClickHelper from '@/components/basic/ClickHelper'
import { Howler } from 'howler'

export default {
  name: 'FishSettingDialog',
  components: { ClickHelper },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    debounceSetPageOpacity: undefined,
    debounceSetNotification: undefined,
    pageOpacityShowing: 0,
    NOTIFICATION_SOUNDS: DataUtil.NOTIFICATION_SOUNDS,
    lazyNotificationSetting: {},
  }),
  computed: {
    pageOpacity: {
      get() {
        return this.opacity
      },
      set(opacity) {
        this.pageOpacityShowing = opacity
        this.debounceSetPageOpacity(opacity)
      },
    },
    showSettingDialog: {
      get() {
        return this.value
      },
      set(show) {
        this.$emit('input', show)
      },
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    ...mapState(['sounds']),
    ...mapGetters(['opacity', 'notification']),
  },
  watch: {
    lazyNotificationSetting: {
      handler(setting) {
        this.debounceSetNotification(setting)
      },
      deep: true,
    },
  },
  created() {
    this.debounceSetPageOpacity = debounce(this.setOpacity, 500)
    this.debounceSetNotification = debounce(this.setNotificationSetting, 500)

    this.pageOpacityShowing = this.opacity
    this.lazyNotificationSetting = cloneDeep(this.notification)
  },
  methods: {
    playSound(key) {
      this.sounds[key]?.player.play()
    },
    setNotificationSetting(setting) {
      Howler.volume(setting.volume)
      this.setNotification(setting)
    },
    ...mapMutations(['setOpacity', 'setNotification']),
  },
}
</script>

<style scoped></style>