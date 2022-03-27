<template>
  <div>
    <rc-dialog
      :value="show"
      @input="$emit('input', $event)"
      max-width="600"
      scrollable
      persistent
    >
      <v-card color="">
        <v-card-title>数据统计图说明</v-card-title>
        <v-divider />
        <v-card-text>
          <div>
            <v-subheader>首先，请注意：</v-subheader>
            <div class="error--text font-weight-bold my-2" style="font-size: x-large">
              图中均是 统计数据 ，出现不在范围内的数据很正常
            </div>
            <div class="error--text font-weight-bold my-2" style="font-size: x-large">
              查看数据前请注意右上角标记的 数据量
            </div>
            <div class="error--text font-weight-bold my-2" style="font-size: x-large">
              ！不要看统计数据最小/最大是xx.x秒就直接判断！
            </div>
            <div class="error--text font-weight-bold my-2" style="font-size: x-large">
              ！不要看统计数据最小/最大是xx.x秒就直接判断！
            </div>
            <div class="error--text font-weight-bold my-2" style="font-size: x-large">
              ！不要看统计数据最小/最大是xx.x秒就直接判断！
            </div>
            <div class="error--text font-weight-bold my-2" style="font-size: x-large">
              请仔细阅读下方的QA说明
            </div>
          </div>
          <v-subheader>以下是问答环节：</v-subheader>
          <stats-explanation />
          <!--          <v-btn color="primary" block outlined @click="showApplyDialog = true">-->
          <!--            我已经认真读完了以上内容，申请成为志愿者-->
          <!--          </v-btn>-->
          <!--  stats-explanation.md (暗号:钓鱼数据测试)  -->
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn @click="handleClose" block> 关闭 </v-btn>
        </v-card-actions>
      </v-card>
    </rc-dialog>
    <rc-dialog v-model="showApplyDialog" max-width="400">
      <v-card>
        <v-card-title>
          <div>QQ群：796331554</div>
          <div>加群暗号在文章中，请仔细阅读</div>
        </v-card-title>
      </v-card>
    </rc-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import RcDialog from '@/components/basic/RcDialog'
import StatsExplanation from '@/doc/stats-explanation.md'

export default {
  name: 'AboutChartDialog',
  components: { RcDialog, StatsExplanation },
  model: {
    prop: 'show',
    event: 'input',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showApplyDialog: false,
    }
  },
  methods: {
    ...mapMutations(['setReadChartTip']),
    handleClose() {
      this.setReadChartTip(true)
      this.$emit('input', false)
    },
  },
}
</script>

<style scoped></style>
