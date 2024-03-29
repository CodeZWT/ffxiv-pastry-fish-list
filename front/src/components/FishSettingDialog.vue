<template>
  <rc-dialog
    v-model="showSettingDialog"
    :fullscreen="isMobile"
    max-width="600px"
    scrollable
  >
    <v-card>
      <v-card-title>
        {{ $t('top.uiConfig') }}
      </v-card-title>
      <v-card-text class="py-0">
        <validation-observer ref="observer" v-slot="">
          <form>
            <v-row no-gutters>
              <v-col cols="12" v-if="isElectron">
                <div>
                  <v-radio-group
                    v-model="lazyMainWindowCloseMode"
                    label="关闭主窗口时"
                    row
                  >
                    <v-radio label="退出程序" value="CLOSE"></v-radio>
                    <v-radio label="最小化到托盘，不退出程序" value="TRAY"></v-radio>
                  </v-radio-group>
                </div>
              </v-col>
              <v-col v-if="isElectron" cols="12">
                <div class="text-subtitle-1">
                  {{ $t('setting.dialog.opacity.title') }}
                </div>
                <v-slider
                  v-model="lazyOpacity"
                  max="1"
                  min="0.1"
                  step="0.05"
                  ticks
                  :label="$t('setting.dialog.opacity.slider')"
                  thumb-label
                >
                </v-slider>
                <v-divider />
              </v-col>
              <v-col v-if="isElectron" cols="12">
                <div class="text-subtitle-1">
                  {{ $t('setting.dialog.zoom.title') }}
                </div>
                <v-slider
                  v-model="lazyZoomFactor"
                  max="3"
                  min="0.4"
                  step="0.1"
                  ticks
                  :label="$t('setting.dialog.zoom.slider')"
                  thumb-label
                >
                  <template v-slot:thumb-label="{ value }">
                    {{ Math.floor(value * 100) }}%
                  </template>
                </v-slider>
              </v-col>
              <v-col cols="12" v-if="isElectron">
                <div class="d-flex align-center">
                  <div class="v-label mr-2">
                    硬件加速
                  </div>
                  <v-switch v-model="lazyHardwareAcceleration" dense />
                </div>
                <div class="text-subtitle-2 mb-4" style="margin-top: -16px;">
                  ※ 关闭硬件加速可以解决一些显示问题。
                  改变硬件加速选项后，需要点击下方应用按钮并重启鱼糕才能生效。
                </div>
              </v-col>
              <v-col cols="12">
                <div class="text-subtitle-1">
                  {{ $t('setting.dialog.notification.title') }}
                </div>
                <div>
                  <v-slider
                    v-model="lazyNotificationSetting.volume"
                    max="1"
                    min="0"
                    step="0.01"
                    :label="$t('setting.dialog.notification.volume')"
                    thumb-label
                  >
                  </v-slider>
                </div>
                <div
                  v-if="isNotificationSupported"
                  class="d-flex flex-row align-center pr-3"
                >
                  <v-subheader>
                    {{ $t('setting.dialog.notification.systemNotification.title') }}
                  </v-subheader>
                  <v-switch
                    :label="
                      $t(
                        `setting.dialog.notification.systemNotification.${
                          lazyNotificationSetting.isSystemNotificationEnabled
                            ? 'enabled'
                            : 'disabled'
                        }`
                      )
                    "
                    class="pl-3"
                    v-model="lazyNotificationSetting.isSystemNotificationEnabled"
                  />
                  <v-chip
                    v-if="notificationStatus === 'default'"
                    class="mx-2"
                    color="quaternary"
                    text-color="white"
                    label
                    @click="requestSystemNotification"
                  >
                    <v-avatar left>
                      <v-icon>{{ mdiAlert }}</v-icon>
                    </v-avatar>
                    {{
                      $t(
                        'setting.dialog.notification.message.notificationIsNotSelectedHint'
                      )
                    }}
                  </v-chip>
                  <v-chip
                    v-else-if="notificationStatus === 'denied'"
                    label
                    class="mx-2"
                    color="error"
                    text-color="white"
                  >
                    <v-avatar left>
                      <v-icon>{{ mdiAlert }}</v-icon>
                    </v-avatar>
                    {{
                      $t('setting.dialog.notification.message.notificationIsDeniedHint')
                    }}
                  </v-chip>
                </div>
                <div>
                  <v-btn
                    v-if="lazyNotificationSetting.isSystemNotificationEnabled"
                    @click="testNotification"
                    color="info"
                    block
                  >
                    {{ $t('setting.dialog.notification.systemNotification.test') }}
                  </v-btn>
                </div>
                <v-subheader>{{ $t('top.fishList') }}</v-subheader>
                <div
                  v-for="setting in lazyNotificationSetting.settings"
                  :key="setting.key"
                  class="d-flex align-center"
                >
                  <v-row>
                    <v-col class="col-sm-4 col-6">
                      <v-checkbox
                        v-model="setting.enabled"
                        :label="$t(`setting.dialog.notification.fish.${setting.key}`)"
                      />
                    </v-col>
                    <v-col class="col-sm-3 col-6">
                      <validation-provider
                        v-if="setting.hasBefore"
                        v-slot="{ errors }"
                        :name="`${setting.key}-before`"
                        rules="required|max_value:20|min_value:0"
                      >
                        <rc-text-field
                          v-model="setting.before"
                          :label="$t('setting.dialog.notification.before')"
                          :suffix="$t('setting.dialog.notification.unit')"
                          min="0"
                          max="20"
                          step="1"
                          type="number"
                          :prepend-icon="mdiAlarmNote"
                          :error-messages="errors"
                          required
                        />
                      </validation-provider>
                    </v-col>
                    <v-col class="col-sm-5 col-12 d-flex align-center">
                      <v-select
                        v-model="setting.sound"
                        :items="NOTIFICATION_SOUNDS"
                        item-text="name_chs"
                        item-value="key"
                        :label="'选择音效'"
                      />
                      <v-btn
                        icon
                        text
                        @click="playSound(setting.sound)"
                        :disabled="!sounds[setting.sound].player"
                      >
                        <v-icon>{{ mdiPlay }}</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
                <v-divider />
                <v-subheader>{{ $t('oceanFishingPage.title') }}</v-subheader>
                <div
                  v-for="setting in lazyNotificationSetting.IKDRouteSettings"
                  :key="'IKDRouteSettings' + setting.key"
                  class="d-flex align-center"
                >
                  <v-row>
                    <v-col class="col-sm-4 col-6">
                      <v-checkbox
                        v-model="setting.enabled"
                        :label="$t(`setting.dialog.notification.IKDRoute.${setting.key}`)"
                      />
                    </v-col>
                    <v-col class="col-sm-3 col-6">
                      <validation-provider
                        v-if="setting.hasBefore"
                        v-slot="{ errors }"
                        :name="`${setting.key}-before`"
                        rules="required|max_value:14|min_value:0"
                      >
                        <rc-text-field
                          v-model="setting.before"
                          :label="$t('setting.dialog.notification.before')"
                          :suffix="$t('setting.dialog.notification.unit')"
                          min="0"
                          max="14"
                          step="1"
                          type="number"
                          :prepend-icon="mdiAlarmNote"
                          :error-messages="errors"
                          required
                        />
                      </validation-provider>
                    </v-col>
                    <v-col class="col-sm-5 col-12 d-flex align-center">
                      <v-select
                        v-model="setting.sound"
                        :items="NOTIFICATION_SOUNDS"
                        item-text="name_chs"
                        item-value="key"
                        :label="'选择音效'"
                      />
                      <v-btn
                        icon
                        text
                        @click="playSound(setting.sound)"
                        :disabled="!sounds[setting.sound].player"
                      >
                        <v-icon>{{ mdiPlay }}</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
                <v-divider />
              </v-col>
              <v-col cols="12">
                <div class="text-subtitle-1">
                  {{ $t('setting.dialog.showFilter.title') }}
                </div>
                <div>
                  <v-switch
                    v-model="lazyShowFilter"
                    :label="
                      lazyShowFilter
                        ? $t('setting.dialog.showFilter.show')
                        : $t('setting.dialog.showFilter.hide')
                    "
                  ></v-switch>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="text-subtitle-1">
                  {{ $t('setting.dialog.rightPanePercentageV2.title') }}
                </div>
                <div class="text-subtitle-2">
                  {{ $t('setting.dialog.rightPanePercentageV2.comment') }}
                </div>
                <v-slider
                  v-model="lazyRightPanePercentage"
                  max="0.9"
                  min="0.1"
                  step="0.05"
                  ticks
                  :label="$t('setting.dialog.rightPanePercentageV2.slider')"
                  thumb-label
                >
                  <template v-slot:thumb-label="{ value }">
                    {{ Math.floor(value * 100) }}%
                  </template>
                </v-slider>
                <v-divider />
              </v-col>
              <v-col cols="12">
                <div class="text-subtitle-1">
                  {{ $t('setting.dialog.detailArrangement.title') }}
                </div>
                <v-row>
                  <v-col cols="6">
                    <v-card rounded color="#00695c66" class="pa-2">
                      <v-card-title>
                        {{ $t('setting.dialog.detailArrangement.enabled') }}
                      </v-card-title>
                      <draggable
                        v-model="lazyEnabledDetailComponents"
                        group="componentSettings"
                      >
                        <div
                          v-for="component in lazyEnabledDetailComponents"
                          :key="component.name"
                        >
                          <detail-item-setting-entry :setting="component" />
                        </div>
                      </draggable>
                    </v-card>
                  </v-col>
                  <v-col cols="6">
                    <v-card rounded color="#ad145766" class="pa-2">
                      <v-card-title>
                        {{ $t('setting.dialog.detailArrangement.disabled') }}
                      </v-card-title>
                      <draggable
                        v-model="lazyDisabledDetailComponents"
                        group="componentSettings"
                        style="min-height: 160px"
                      >
                        <div
                          v-for="component in lazyDisabledDetailComponents"
                          :key="component.name"
                        >
                          <detail-item-setting-entry :setting="component" />
                        </div>
                      </draggable>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </form>
        </validation-observer>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex flex-row justify-end" style="width: 100%">
          <click-helper @click="onApply">
            <v-btn color="primary" class="mr-1">
              {{ $t('general.dialog.apply') }}
            </v-btn>
          </click-helper>
          <click-helper @click="showSettingDialog = false">
            <v-btn color="default" text>
              {{ $t('general.dialog.cancel') }}
            </v-btn>
          </click-helper>
        </div>
      </v-card-actions>
    </v-card>
  </rc-dialog>
</template>

<script>
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  setInteractionMode,
} from 'vee-validate'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { max_value, min_value, required } from 'vee-validate/dist/rules'
import { mdiAlarmNote, mdiAlert, mdiBellOutline, mdiPlay } from '@mdi/js'
import { sendElectronEvent } from '@/utils/electronHelper'
import ClickHelper from '@/components/basic/ClickHelper'
import DataUtil from '@/utils/DataUtil'
import DetailItemSettingEntry from '@/components/DetailItemSettingEntry'
import EnvMixin from '@/components/basic/EnvMixin'
import NotificationUtil from '@/utils/NotificationUtil'
import RcDialog from '@/components/basic/RcDialog'
import RcTextField from '@/components/basic/RcTextField'
import _ from 'lodash'
import draggable from 'vuedraggable'
import i18n from '@/i18n'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: i18n.t('setting.error.required'),
})
extend('max_value', {
  ...max_value,
  message: i18n.t('setting.error.maxValue'),
})

extend('min_value', {
  ...min_value,
  message: i18n.t('setting.error.minValue'),
})

export default {
  name: 'FishSettingDialog',
  mixins: [EnvMixin],
  components: {
    RcTextField,
    RcDialog,
    DetailItemSettingEntry,
    ClickHelper,
    ValidationObserver,
    ValidationProvider,
    draggable,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mdiPlay,
    mdiAlarmNote,
    mdiAlert,
    mdiBellOutline,
    NOTIFICATION_SOUNDS: DataUtil.NOTIFICATION_SOUNDS,
    lazyOpacity: undefined,
    lazyZoomFactor: undefined,
    lazyNotificationSetting: {},
    lazyEnabledDetailComponents: [],
    lazyDisabledDetailComponents: [],
    lazyIsSystemNotificationEnabled: false,
    notificationStatus: NotificationUtil.NOTIFICATION_PERMISSIONS.DEFAULT,
    isNotificationSupported: NotificationUtil.isNotificationSupported(),
    lazyShowFilter: true,
    lazyMainWindowCloseMode: undefined,
    lazyRightPanePercentage: 0.3,
    lazyHardwareAcceleration: true,
  }),
  computed: {
    showSettingDialog: {
      get() {
        return this.value
      },
      set(show) {
        this.$emit('input', show)
      },
    },
    ...mapState(['sounds']),
    ...mapGetters([
      'opacity',
      'zoomFactor',
      'notification',
      'detailComponents',
      'isSystemNotificationEnabled',
      'showFilter',
      'mainWindowCloseMode',
      'rightPanePercentageV2',
    ]),
    ...mapState('localSetting', ['settings']),
  },
  watch: {
    showSettingDialog(showSettingDialog) {
      if (showSettingDialog) {
        this.init()
      }
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$refs.observer?.reset()
      this.lazyOpacity = this.opacity
      this.lazyZoomFactor = this.zoomFactor
      this.lazyNotificationSetting = _.cloneDeep(this.notification)
      this.lazyEnabledDetailComponents = _.cloneDeep(
        this.detailComponents.filter(it => it.enabled)
      )
      this.lazyDisabledDetailComponents = _.cloneDeep(
        this.detailComponents.filter(it => !it.enabled)
      )
      this.lazyIsSystemNotificationEnabled = this.isSystemNotificationEnabled
      this.isSystemNotificationGranted = NotificationUtil.isNotificationGranted()
      this.notificationStatus = NotificationUtil.notificationStatus()
      this.lazyShowFilter = this.showFilter
      this.lazyMainWindowCloseMode = this.mainWindowCloseMode
      this.lazyRightPanePercentage = this.rightPanePercentageV2
      this.lazyHardwareAcceleration = this.settings.hardwareAcceleration
    },
    playSound(key) {
      this.sounds[key]?.player?.volume(this.lazyNotificationSetting.volume).play()
    },
    onApply() {
      this.$refs.observer.validate().then(valid => {
        if (valid) {
          this.apply()
          this.showSettingDialog = false
        }
      })
    },
    apply() {
      this.setMainWindowCloseMode(this.lazyMainWindowCloseMode)
      this.setLocalSetting({
        key: 'hardwareAcceleration',
        value: this.lazyHardwareAcceleration,
      })
      sendElectronEvent('updateMainConfig', {
        closeMode: this.lazyMainWindowCloseMode,
        hardwareAcceleration: this.lazyHardwareAcceleration,
      })
      this.setShowFilter(this.lazyShowFilter)
      this.setOpacity(this.lazyOpacity)
      this.setZoomFactor(this.lazyZoomFactor)
      sendElectronEvent('updateMainWindowSetting', {
        opacity: this.lazyOpacity,
        zoomFactor: this.lazyZoomFactor,
      })
      this.setRightPanePercentageV2(this.lazyRightPanePercentage)
      this.setNotificationSetting(_.cloneDeep(this.lazyNotificationSetting))
      this.setDetailArrangement(
        _.cloneDeep({
          components: this.lazyEnabledDetailComponents
            .map(it => ({
              ...it,
              enabled: true,
            }))
            .concat(
              this.lazyDisabledDetailComponents.map(it => ({
                ...it,
                enabled: false,
              }))
            )
            .map((it, index) => {
              return {
                ...it,
                order: index,
              }
            }),
        })
      )
    },
    setNotificationSetting(setting) {
      this.setNotification(setting)
    },
    requestSystemNotification() {
      if (!NotificationUtil.isNotificationGranted()) {
        NotificationUtil.requestNotificationPermission().then(status => {
          if (status === 'default') {
            this.showSnackbar({
              text: this.$t(
                'setting.dialog.notification.message.requestNotificationPermissionNotSelected'
              ),
              color: 'quaternary',
            })
          } else if (status === 'denied') {
            this.showSnackbar({
              text: this.$t(
                'setting.dialog.notification.message.requestNotificationPermissionDenied'
              ),
              color: 'error',
            })
          } else {
            this.showSnackbar({
              text: this.$t(
                'setting.dialog.notification.message.requestNotificationPermissionSuccessfully'
              ),
              color: 'success',
            })
          }
          this.notificationStatus = status
        })
      }
    },
    testNotification() {
      new Notification('系统通知测试', {
        icon: DataUtil.itemIconUrlOf(28495),
        body: '有鱼准备脱钩了！',
      })
    },
    ...mapMutations([
      'setMainWindowCloseMode',
      'setOpacity',
      'setZoomFactor',
      'setNotification',
      'setDetailArrangement',
      'enableSystemNotification',
      'disableSystemNotification',
      'showSnackbar',
      'setShowFilter',
      'setRightPanePercentageV2',
    ]),
    ...mapMutations('localSetting', {
      setLocalSetting: 'setSetting',
    }),
  },
}
</script>

<style scoped></style>
