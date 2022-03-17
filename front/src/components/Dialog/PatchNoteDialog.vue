<template>
  <rc-dialog
    :value="showPatchNoteDialog && !inMigrationPage"
    @input="$emit('input', $event)"
    max-width="600px"
    scrollable
  >
    <v-card>
      <v-card-title>
        {{ $t('top.patchNote') }}
        <!--        <v-spacer />-->
        <!--        <div class="d-flex flex-column align-center">-->
        <!--          <a-->
        <!--            href="https://ricecake302.coding.net/s/eb3a7844-db84-4792-90db-7805f6a941c1/3"-->
        <!--            target="_blank"-->
        <!--          >-->
        <!--            如有错误，请前往此页面-->
        <!--          </a>-->
        <!--        </div>-->
      </v-card-title>
      <v-divider />
      <v-card-text style="max-height: 600px">
        <!-- patch update wait note -->
        <!--        <v-alert outlined type="warning" border="left">-->
        <!--          更新国服5.57后，渔捞与同步功能不可用，请耐心等待通知，届时直接重启鱼糕即可。-->
        <!--        </v-alert>-->
        <!--        <v-subheader> 仅在网页版随时更新，改动将记入下一版本。</v-subheader>-->
        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 1.2.0-fix</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2022/03/17 10:00</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>更新鱼眼模式范围</li>
          <li>更新[large]为[大尺寸]</li>
        </ul>
        <v-divider />

        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 1.2.0</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2022/03/15 10:00</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>更新国服6.0数据支持（！！！注意可能的剧透！！！）</li>
          <li>
            PS：点击右上角齿轮图标可以打开快捷设置，切换国际服国服可以显示对应数据（目前国服6.0与国际服6.08并没有区别）
          </li>
          <li>增加通知系统，每次启动鱼糕时若有新通知将会弹窗显示。</li>
        </ul>
        <v-divider />

        <v-expansion-panels class="mt-4" flat>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <div>往期更新</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <PatchNoteHistory />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex flex-column flex-fill">
          <v-btn color="primary" block @click="onConfirmPatchNote">
            {{ $t('general.dialog.confirm') }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </rc-dialog>
</template>

<script>
import RcDialog from '@/components/basic/RcDialog'

export default {
  name: 'PatchNoteDialog',
  components: {
    PatchNoteHistory: () => import('@/components/Dialog/PatchNoteHistory'),
    RcDialog,
  },
  model: {
    prop: 'showPatchNoteDialog',
    event: 'input',
  },
  props: {
    showPatchNoteDialog: {
      type: Boolean,
      default: false,
    },
    inMigrationPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  methods: {
    onConfirmPatchNote() {
      this.$emit('confirm')
    },
  },
}
</script>

<style scoped></style>
