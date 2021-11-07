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
            <div class="text-h6">Version 1.0.1</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/11/07 12:20</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕桌面版</div>
        <ul>
          <li>
            基于0.9.9更新，在各个界面保持了0.9.9风格的前提下，包括了1.0.0中功能相关更新
          </li>
        </ul>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>
            修复咬钩时间统计图在点出鱼详情后不显示的问题
          </li>
        </ul>

        <v-divider />
        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 1.0.0</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/10/31 17:20</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>更新海外访问网页版的支持</li>
          <li>根据咬钩报告更新了长吻帆蜥鱼的时间范围</li>
          <li>更新部分鱼数据</li>
          <li>
            更新攻略：《5.0鱼王鱼皇心得攻略----有鱼的地方就有捕鱼人》。 感谢 颜君行@琥珀原
            、Aki秋山@摩杜纳、轩辕十四@沃仙曦染的持续更新！
          </li>
          <li>
            更新咬钩概率图的说明，鼠标悬停查看概率计算详情。
          </li>
          <li>
            更新列表中鱼饵的悬浮窗，其他页面的鱼饵悬浮窗将会陆续更新。
          </li>
        </ul>
        <div class="text-h6 my-1">渔捞</div>
        <ul>
          <li>渔捞历史记录支持搜索</li>
          <li>原上方筛选导出等功能可以隐藏</li>
          <li>导出功能优化</li>
        </ul>
        <div class="text-h6 my-1">鱼糕桌面版</div>
        <ul>
          <li>
            现除主窗口以外的所有窗口支持与游戏同步操作。如：可以在鼠标点击窗口的同时操作游戏内角色。
          </li>
          <li>
            渔捞中的输入框获取焦点后需要点击游戏界面才可以恢复游戏焦点接受键盘操作，但如果游戏使用“窗口全屏模式”则可以避免这个问题。
          </li>
          <li>
            增加功能菜单，主窗口，所有渔捞窗口以及设置窗口均可由此访问。
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
            渔捞界面现与主界面深浅色模式配置同步。（渔捞现在也可设置为浅色模式）
          </li>
          <li>
            {{
              `窗口默认显示在系统主屏幕，多屏幕用户可在“${$t(
                'top.screen'
              )}”中配置显示的屏幕。`
            }}
          </li>
          <li>
            主界面可以在多屏幕间自由拖动，其他窗口只会显示在“屏幕设置”配置的屏幕中。
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
