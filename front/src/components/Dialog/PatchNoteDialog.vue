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
            <div class="text-h6">Version 1.1.3</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/12/25 23:00</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>更新星芒节贺图.感谢 马猴烧鱼@拉诺西亚 绘制的贺图！</li>
          <li>更新6.0钓场范围提示图，感谢 轩辕十四 @ 沃仙曦染 测量绘制的范围图！</li>
          <li>更新台支持，感谢 美依礼芽@延夏 的大力协助！</li>
          <li>修复手机网页版的部分显示问题</li>
        </ul>
        <div class="text-h6 my-1">渔捞</div>
        <ul>
          <li>更新国际服6.01支持</li>
        </ul>
        <v-divider />

        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 1.1.2</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/12/19 20:00</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>修复饿猫链接。</li>
          <li>修复6.0钓场统计数据。</li>
          <li>更新部分鱼数据。</li>
          <li>
            增加多语言支持，支持鼠标悬停界面复制中日英的鱼以及鱼饵文本，也可以在左上角切换默认显示语言。
          </li>
          <li>
            更新国际服、国服星芒节支持，根据区服切换的设置运用对应的节日日期进行计算。
          </li>
          <li>首页增加微博区域。</li>
        </ul>

        <v-alert border="top" colored-border type="info" class="mt-4">
          <div>
            星芒节期间三主城固定小雪，因此一些鱼的窗口期会受影响：<br />
            星芒节期间全勤奖普通鱼：求雨鱼<br />
            星芒节期间窗口期变长：招雨王<br />
            星芒节期间无窗口期：倔强鲫鱼、抽须王、枪鼻头、芳香蝾螈 (<s>我们放寒假了~</s>）
          </div>
        </v-alert>

        <v-divider />

        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 1.1.1</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/12/14 23:00</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>修复部分地图无法加载的问题</li>
          <li>修复搜索中计时器固定显示“全天可钓”的问题</li>
          <li>修复国服同步数据数量超过实际值的问题</li>
          <li>更新6.0鱼的天气时间鱼饵信息</li>
          <li>更新6.0刺鱼相关信息</li>
        </ul>

        <v-divider />

        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 1.1.0</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/12/06 22:20</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>
            更新提钩列表，现在杆型以及精准、强力提钩显示在对应鱼的左侧，并将目标鱼加入列表
          </li>
          <li>
            更新区服切换，点击左侧菜单栏中的切换按钮切换区服数据。切换“国际服”会显示6.X相关数据，请注意会包含剧透信息！
          </li>
          <li>更新列表中6.X相关数据，开荒中的数据会陆续更新。</li>
          <li>更新鱼眼相关数据。</li>
          <li>暂未更新：钓场范围提示，水族馆等数据。</li>
        </ul>
        <div class="text-h6 my-1">渔捞</div>
        <ul>
          <li>更新国际服6.0支持</li>
          <li>刺鱼的自动记录功能暂未支持</li>
          <li>更新对大尺寸以及Angler's Fortune的支持</li>
        </ul>
        <v-divider />

        <v-alert color="secondary" outlined class="mt-4">
          <div class="d-flex align-center">
            <div class="text-h6">Version 1.0.5</div>
            <v-spacer />
            <div class="text-subtitle-1">更新时间: 2021/11/28 21:30</div>
          </div>
        </v-alert>
        <div class="text-h6 my-1">鱼糕</div>
        <ul>
          <li>修正感谢名单排序错误</li>
          <li>爱发电支持自选金额发电</li>
          <li>
            为所有根据以小钓大或鱼识前置鱼有所调整的鱼增加说明（鼠标悬停<v-icon>{{
              mdiInformation
            }}</v-icon
            >查看）
          </li>
          <li>
            增加海钓闹钟，在海钓航班处可以选择添加航班闹钟。闹钟列表与设置也增加了相应的内容
          </li>
          <li>
            增加中庸工艺馆任务鱼的提示。感谢 <strong>凛田莉子@红玉海</strong> 的测试！
          </li>
          <li>更新部分鱼的闹钟提示文本，增加海钓闹钟的提示文本</li>
          <li>调整各个页面切换简化模式的判定逻辑</li>
          <li>调整显示钓场按钮的样式</li>
          <li>调整鹦鹉螺、腔棘鱼、太阳海岸钓场银鲨的窗口期计算，现根据满月沙丁鱼显示</li>
          <li>
            增加部分任务鱼在列表中显示的可行鱼饵，显示低等级的鱼饵以适配职业任务时捕鱼人的实际等级
          </li>
          <li>修复“关于数据统计图”按钮失灵的问题</li>
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
import { mdiInformation } from '@mdi/js'
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
  data() {
    return {
      mdiInformation,
    }
  },
  methods: {
    onConfirmPatchNote() {
      this.$emit('confirm')
    },
  },
}
</script>

<style scoped></style>
