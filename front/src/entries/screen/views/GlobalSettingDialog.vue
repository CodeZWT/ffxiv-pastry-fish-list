<template>
  <div>
    <rc-dialog v-model="show" max-width="600">
      <v-card>
        <v-card-title>设置</v-card-title>
        <v-card-text @click="show = false">
          <v-list>
            <v-list-item @click="showMainSetting">
              <v-list-item-icon>
                <v-icon>mdi-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title> 主界面{{ $t('top.uiConfig') }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="showReaderSetting">
              <v-list-item-icon>
                <v-icon>mdi-fish</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title> 渔捞{{ $t('top.uiConfig') }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="showKeybindingDialog = true">
              <v-list-item-icon>
                <v-icon>mdi-keyboard</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('top.keybinding') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="showScreenSettingDialog = true">
              <v-list-item-icon>
                <v-icon>mdi-monitor</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t('top.screen') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="showPatchNote">
              <v-list-item-icon>
                <v-icon>mdi-tag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $t('top.patchNote') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="showAboutDialog">
              <v-list-item-icon>
                <v-icon>mdi-information</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $t('top.about') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <!--      <v-card-actions class="d-flex justify-end">-->
        <!--        <v-btn text @click="close">-->
        <!--          关闭-->
        <!--        </v-btn>-->
        <!--      </v-card-actions>-->
      </v-card>
    </rc-dialog>
    <key-binding-dialog v-model="showKeybindingDialog" />
    <screen-setting-dialog />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import KeyBindingDialog from '@/components/Dialog/KeyBindingDialog'
import RcDialog from '@/components/basic/RcDialog'
import ScreenSettingDialog from '@/components/Dialog/ScreenSettingDialog'

export default {
  name: 'GlobalSettingDialog',
  components: { ScreenSettingDialog, KeyBindingDialog, RcDialog },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showKeybindingDialog: false,
    }
  },
  computed: {
    ...mapState('dialog', ['screenSettingDialog']),
    show: {
      get() {
        return this.value
      },
      set(show) {
        this.$emit('input', show)
      },
    },
    showScreenSettingDialog: {
      get() {
        return this.screenSettingDialog
      },
      set(show) {
        this.setShowDialog({ dialog: 'screenSettingDialog', show: show })
      },
    },
  },
  methods: {
    ...mapMutations('dialog', ['setShowDialog']),
    close() {
      this.$emit('input', false)
    },
    showAboutDialog() {
      this.$emit('show-about')
    },
    showMainSetting() {
      this.$emit('show-setting')
    },
    showPatchNote() {
      this.setShowDialog({ dialog: 'patchNoteDialog', show: true })
    },
    showReaderSetting() {
      this.setShowDialog({ dialog: 'readerSettingDialog', show: true })
    },
  },
}
</script>

<style scoped></style>
