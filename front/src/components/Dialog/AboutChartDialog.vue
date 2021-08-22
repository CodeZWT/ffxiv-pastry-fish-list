<template>
  <div>
    <v-dialog
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
              图中均是统计数据，出现不在范围内的数据很正常
            </div>
            <div class="error--text font-weight-bold my-2" style="font-size: x-large">
              目前数据优先覆盖了5.X的钓场，查看数据前请注意右上角标记的数据量
            </div>
            <div class="error--text font-weight-bold my-2" style="font-size: x-large">
              请仔细阅读下方的QA说明
            </div>
          </div>
          <v-subheader>以下是问答环节：</v-subheader>
          <vue-markdown
            source="
## 这么多字我要读完吗？
是的，如果以后不看这统计表，可以不看。如果关心统计数据，请务必读完，谢谢。
### 这是什么？
这是通过收集的上传数据生成的数据统计图，可以用于了解钓场中鱼、鱼饵、咬钩概率、咬钩时间等信息。
### 数据来源是什么？
通过志愿者使用渔捞在对应钓场钓鱼获取。渔捞在先前版本中内置了数据上传的功能。（只对参与测试的志愿者开放，正常用户使用并不会上传任何数据。）
### 国服和国际服如何区分？
目前没有区分，上传的数据本身标记了上传的版本信息，将在钓场加入新鱼后根据实际情况进行调整。
### 数据是实时的吗？
不是，因此图的右侧显示了更新时间。由于技术与成本原因，更新时间大致是每天23点。~~艾欧泽亚人的一天的开始时间~~
### 如何解决技能影响概率的问题
在我们的测试中，不使用影响概率的**专一**、**拍击水面**技能。
### 如何解决钓场中不同鱼不同条件的问题
在我们的测试中，不使用**鱼眼**技能，并记录了**天气**、**咬钩时间ET**、**咬钩时长**、**钓组**、**鱼识**信息。
在图的上方，会有对应的筛选选项，可以使用这些选项筛选出几乎任意条件下的数据。因此，可以通过这样的方式查看目标鱼（如鱼王）CD中的实际比例。
当然，由于人力有限，目前数据大部分集中在鱼王CD中，非CD条件的数据较少。但是**默认配置是不进行任何筛选的**，请注意！
### 数据有问题，咬钩时间过长/短的，根本不可能用这个鱼饵?!
由于渔捞本身并不完全可靠，可能出现各种匪夷所思的数据，欢迎反馈。目前将人工进行修正。~~自动化修正在做了在做了~~
### 和我的“体感”不同？
10%的咬钩率并不意味着10次必有一次咬钩，也不意味着到了20、30、40次会有一次咬钩。钓鱼没有保底，红龙平均能在42条苦尔鳗后钓上，既有383人1条就能钓上，也有大神能在398条后钓上。体感是很不准确的，这也是统计数据的初衷。
### 我想成为志愿者上传数据！
鱼糕现在正在招收志愿者，欢迎所有愿意为钓鱼数据添砖加瓦的小伙伴加入！但是正如上面的说明，过程中不能使用很多技能，因此采集过程并不“效率”，会消耗大量的时间。不过对每位志愿者本身并不会有硬性时间要求，自助挑自己的闲暇时间测试即可，请放心。
"
          >
          </vue-markdown>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="d-flex justify-space-around" style="width: 100%">
            <v-btn color="primary" @click="showApplyDialog = true">
              申请成为志愿者
            </v-btn>
            <v-btn @click="handleClose">
              关闭
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showApplyDialog" max-width="400">
      <v-card>
        <v-card-title>
          <div>QQ群：796331554</div>
          <div>加群暗号：钓鱼数据测试</div>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { mapMutations } from 'vuex'

export default {
  name: 'AboutChartDialog',
  components: { VueMarkdown },
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
