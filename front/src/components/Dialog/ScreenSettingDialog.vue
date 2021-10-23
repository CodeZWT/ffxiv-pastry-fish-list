<template>
  <rc-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title> 屏幕设置 </v-card-title>
      <v-card-text>
        <v-subheader>显示器设置</v-subheader>
        <v-list>
          <v-list-item
            v-for="(displayId, index) in displayIds"
            :key="displayId"
            @click="() => setTargetDisplay(displayId)"
          >
            <v-list-item-title>
              {{ '显示器' + (index + 1) }}
            </v-list-item-title>
            <v-list-item-action>
              <v-icon v-if="displayId === targetDisplayId">mdi-check</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-btn block color="info" @click="getAllDisplays"> 重新检测屏幕 </v-btn>
        <v-subheader>窗口设置</v-subheader>
        <v-btn block color="error" @click="resetLayouts"> 重置窗口 </v-btn>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn text @click="show = false"> 关闭 </v-btn>
      </v-card-actions>
    </v-card>
  </rc-dialog>
</template>

<script>
import { invokeElectronEvent, sendElectronEvent } from '@/utils/electronHelper'
import { mapMutations, mapState } from 'vuex'
import RcDialog from '@/components/basic/RcDialog'

export default {
  name: 'ScreenSettingDialog',
  components: { RcDialog },
  data() {
    return {
      displayIds: [],
      targetDisplayId: undefined,
    }
  },
  computed: {
    ...mapState('dialog', ['screenSettingDialog']),
    show: {
      get() {
        return this.screenSettingDialog
      },
      set(show) {
        this.setShowDialog({ dialog: 'screenSettingDialog', show: show })
      },
    },
  },
  watch: {
    show(show) {
      if (show) {
        this.getAllDisplays()
      }
    },
  },
  methods: {
    ...mapMutations('screenWindow', ['resetLayouts']),
    ...mapMutations('dialog', ['setShowDialog']),
    getAllDisplays() {
      invokeElectronEvent('getAllDisplays', null, ({ displayIds, targetDisplayId }) => {
        this.displayIds = displayIds
        this.targetDisplayId = targetDisplayId
        console.log(this.displayIds)
      })
    },
    setTargetDisplay(displayId) {
      this.targetDisplayId = displayId
      sendElectronEvent('setDisplay', displayId)
    },
  },
}
</script>

<style scoped></style>
