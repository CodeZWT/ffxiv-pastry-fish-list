<template>
  <rc-dialog v-model="show" max-width="600" scrollable>
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
              <v-icon v-if="displayId === targetDisplayId">{{ mdiCheck }}</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-btn block color="info" @click="getAllDisplays"> 重新检测屏幕 </v-btn>

        <v-subheader>窗口设置</v-subheader>
        <v-btn block color="error" @click="resetLayouts"> 重置窗口 </v-btn>

        <v-subheader>窗口透明度</v-subheader>
        <v-row>
          <v-col v-for="win in opacityWindows" cols="12" :key="win.winId">
            <v-slider
              :value="layouts[win.winId].opacity"
              @input="setWindowOpacity({ winId: win.winId, opacity: $event })"
              max="1"
              min="0.1"
              step="0.05"
              ticks
              :label="win.title"
              thumb-label
            >
            </v-slider>
          </v-col>
        </v-row>
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
import { mdiCheck } from '@mdi/js'
import RcDialog from '@/components/basic/RcDialog'

export default {
  name: 'ScreenSettingDialog',
  components: { RcDialog },
  data() {
    return {
      mdiCheck,
      displayIds: [],
      targetDisplayId: undefined,
      opacityWindows: [
        {
          winId: 'MAIN',
          title: '主界面',
        },
        {
          winId: 'READER_TIMER',
          title: '计时器',
        },
        {
          winId: 'READER_TIMER_MINI',
          title: '迷你计时器',
        },
        {
          winId: 'READER_HISTORY',
          title: '本地历史记录',
        },
        {
          winId: 'READER_SPOT_STATISTICS',
          title: '本地钓场统计',
        },
        {
          winId: 'FISH_DETAIL',
          title: '鱼详情',
        },
      ],
    }
  },
  computed: {
    ...mapState('dialog', ['screenSettingDialog']),
    ...mapState('screenWindow', ['layouts']),
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
    ...mapMutations('screenWindow', ['resetLayouts', 'setWindowOpacity']),
    ...mapMutations('dialog', ['setShowDialog']),
    getAllDisplays() {
      invokeElectronEvent('getAllDisplays', null, ({ displayIds, screenDisplayId }) => {
        this.displayIds = displayIds
        this.targetDisplayId = screenDisplayId
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
