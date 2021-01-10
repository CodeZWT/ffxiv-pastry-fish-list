<template>
  <v-dialog
    v-model="showSettingDialog"
    :fullscreen="isMobile"
    max-width="600px"
    scrollable
  >
    <v-card>
      <v-card-title>
        {{ $t('top.setting') }}
      </v-card-title>
      <v-card-subtitle>
        {{ $t('top.setting') }}
      </v-card-subtitle>
      <v-card-text class="py-0">
        <validation-observer ref="observer" v-slot="">
          <form>
            <v-row>
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
                  {{ $t('setting.dialog.opacity.title') }}
                </div>
                <v-slider
                  v-model="lazyOpacity"
                  max="1"
                  min="0.1"
                  step="0.01"
                  :label="$t('setting.dialog.opacity.slider')"
                  :hint="$t('setting.dialog.opacity.hint')"
                  thumb-label
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="lazyOpacity"
                      class="mt-0 pt-0"
                      type="number"
                      style="width: 60px"
                    />
                  </template>
                </v-slider>
                <v-divider />
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
                      <v-icon>mdi-alert</v-icon>
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
                      <v-icon>mdi-alert</v-icon>
                    </v-avatar>
                    {{
                      $t('setting.dialog.notification.message.notificationIsDeniedHint')
                    }}
                  </v-chip>
                </div>

                <div
                  v-for="setting in lazyNotificationSetting.settings"
                  :key="setting.key"
                  class="d-flex align-center"
                >
                  <v-row>
                    <v-col class="col-sm-4 col-6">
                      <v-checkbox
                        v-model="setting.enabled"
                        :label="$t(`setting.dialog.notification.enabled.${setting.key}`)"
                      />
                    </v-col>
                    <v-col class="col-sm-3 col-6">
                      <validation-provider
                        v-if="setting.hasBefore"
                        v-slot="{ errors }"
                        :name="`${setting.key}-before`"
                        rules="required|max_value:20|min_value:0"
                      >
                        <v-text-field
                          v-model="setting.before"
                          :label="$t('setting.dialog.notification.before')"
                          :suffix="$t('setting.dialog.notification.unit')"
                          min="0"
                          max="20"
                          step="1"
                          type="number"
                          prepend-icon="mdi-alarm-note"
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
                        @click="playSound(setting.sound)"
                        :disabled="!sounds[setting.sound].player"
                      >
                        <v-icon>mdi-play</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
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
  </v-dialog>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import { mapGetters, mapMutations, mapState } from 'vuex'
import _ from 'lodash'
import ClickHelper from '@/components/basic/ClickHelper'
import { required, min_value, max_value } from 'vee-validate/dist/rules'
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from 'vee-validate'
import i18n from '@/i18n'
import draggable from 'vuedraggable'
import DetailItemSettingEntry from '@/components/DetailItemSettingEntry'
import NotificationUtil from '@/utils/NotificationUtil'

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
  components: {
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
    NOTIFICATION_SOUNDS: DataUtil.NOTIFICATION_SOUNDS,
    lazyOpacity: undefined,
    lazyNotificationSetting: {},
    lazyEnabledDetailComponents: [],
    lazyDisabledDetailComponents: [],
    lazyIsSystemNotificationEnabled: false,
    notificationStatus: NotificationUtil.NOTIFICATION_PERMISSIONS.DEFAULT,
    isNotificationSupported: NotificationUtil.isNotificationSupported(),
    lazyShowFilter: true,
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
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    ...mapState(['sounds']),
    ...mapGetters([
      'opacity',
      'notification',
      'detailComponents',
      'isSystemNotificationEnabled',
      'showFilter',
    ]),
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
      this.setShowFilter(this.lazyShowFilter)
      this.setOpacity(this.lazyOpacity)
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
    ...mapMutations([
      'setOpacity',
      'setNotification',
      'setDetailArrangement',
      'enableSystemNotification',
      'disableSystemNotification',
      'showSnackbar',
      'setShowFilter',
    ]),
  },
}
</script>

<style scoped></style>
