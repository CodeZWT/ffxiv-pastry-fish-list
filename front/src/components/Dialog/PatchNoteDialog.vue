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
        <!--                <v-subheader> 仅在网页版随时更新，改动将记入下一版本。</v-subheader>-->

        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 1.0.4</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/11/21 21:00</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>增加主页</li>
          <li>
            增加 爱发电 链接，若喜欢鱼糕带来的功能与帮助可以考虑：
            <ul>
              <li>
                关注作者微博
                <a href="https://weibo.com/u/7546879530" target="_blank">
                  @红豆年糕找不到
                </a>
                帮助鱼糕进行爱发电认证
              </li>
              <li>
                在
                <a href="https://afdian.net/@ricecake404" target="_blank">
                  爱发电
                </a>
                为鱼糕充电！
              </li>
            </ul>
          </li>
          <li>
            调整鱼糕进入小尺寸模式的宽度设置，以修复不同页面在同一窗体宽度下显示不同模式的问题。
          </li>
          <li>在鱼详情界面增加显示钓场的按钮，以在时钟页面快捷显示钓场页面。</li>
        </ul>
        <v-divider />

        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 1.0.3</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/11/14 20:00</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>钓鱼笔记海钓钓场支持概率统计图</li>
          <li>修复图标显示过大的问题</li>
          <li>在主界面设置中增加原先列表界面右侧详细界面的比例设置功能</li>
        </ul>
        <div class="text-h6 my-1">鱼糕桌面版</div>
        <ul>
          <li>恢复主界面缩放功能</li>
          <li>修复海钓页面小界面下的排版问题</li>
          <li>修复搜索快捷键</li>
        </ul>
        <div class="text-h6 my-1">渔捞</div>
        <ul>
          <li>将浅色模式下的读秒设为白色</li>
        </ul>
        <v-divider />
        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 1.0.2</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/11/07 19:02</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕桌面版</div>
        <ul>
          <li>修复1.0.1无限加载的问题</li>
        </ul>

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
import PatchNoteHistory from '@/components/Dialog/PatchNoteHistory'
import RcDialog from '@/components/basic/RcDialog'

export default {
  name: 'PatchNoteDialog',
  components: { PatchNoteHistory, RcDialog },
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
