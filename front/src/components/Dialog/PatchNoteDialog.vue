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
        <!--          更新国服5.55后，渔捞与同步功能不可用，请耐心等待自动更新。-->
        <!--        </v-alert>-->
        <!--        <v-subheader> 仅在网页版随时更新，改动将记入下一版本。</v-subheader>-->
        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 1.0.0</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/10/25 01:20</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>更新海外访问网页版的支持</li>
        </ul>
        <div class="text-h6 my-1">鱼糕桌面版</div>
        <ul>
          <li>
            现所有窗口支持与游戏同步操作。如：可以在鼠标点击窗口的同时操作游戏内角色。
          </li>
          <li>
            增加功能菜单，主窗口内容切换、所有渔捞窗口以及设置窗口均由此访问。
          </li>
          <li>
            <div>
              <div class="d-inline">
                <span>增加功能菜单可以通过鼠标点击渔捞图标</span>
                <img
                  style="height: 24px; width: 24px"
                  src="https://cdn.jsdelivr.net/gh/ricecake404/images@main/img/pastry-fish.png"
                /><span>或使用快捷键访问。（具体请查看键位设置）</span>
              </div>
            </div>
          </li>
          <li>
            渔捞界面现与主界面深浅色模式配置同步
          </li>
          <li>
            {{
              `鱼糕默认显示在主屏幕，多屏幕用户可在“${$t('top.screen')}”中配置显示的屏幕`
            }}
          </li>
        </ul>

        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 0.9.9</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/09/27 21:15</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>更新5.55鱼以及成就翻译</li>
          <li>更新5.55鱼皇攻略</li>
          <li>更新鱼饵概率图，增加说明以及显示总数</li>
        </ul>
        <!--TODO recover this-->
        <!--        <v-expansion-panels class="mt-4" flat>-->
        <!--          <v-expansion-panel>-->
        <!--            <v-expansion-panel-header>-->
        <!--              <div>往期更新</div>-->
        <!--            </v-expansion-panel-header>-->
        <!--            <v-expansion-panel-content>-->
        <!--              <PatchNoteHistory />-->
        <!--            </v-expansion-panel-content>-->
        <!--          </v-expansion-panel>-->
        <!--        </v-expansion-panels>-->
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
  components: { RcDialog },
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
  methods: {
    onConfirmPatchNote() {
      this.$emit('confirm')
    },
  },
}
</script>

<style scoped></style>
