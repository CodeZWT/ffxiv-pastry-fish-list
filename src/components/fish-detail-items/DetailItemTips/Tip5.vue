<template>
  <div class="fishing-tip5">
    <v-card v-if="tip" outlined>
      <v-card-subtitle>
        <div class="text-subtitle-1">
          <a href="https://ngabbs.com/read.php?tid=25284991" target="_blank">
            [捕鱼人] 金属亮片钓饵的相关研究—云海蝴蝶螺的另一种可能
          </a>
        </div>
        <div class="d-flex">
          <div>
            <div>轩辕十四@沃仙曦染</div>
            <div>
              更新时间：2021/01/26
            </div>
          </div>
        </div>
      </v-card-subtitle>
      <v-divider />
      <v-card-text>
        <div>
          魔窟离岛钓场使用
          <span class="font-weight-bold red">金属亮片能且仅能钓起夕月天女和蛉蝎</span>
          ，概率大概为对半分，
          所以蝴蝶螺的门票甚至可以通过随便抛一杆-拍水-双提-拍水-平钓-专一-平钓(4杆1150gp搞定)，
          钓法的具体改动大家可以看自身情况灵活调整。
        </div>
        <div>
          （关于金属亮片在其他钓场的情况，请看帖子具体内容）
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'Tip5',
  props: ['id'],
  data: () => ({
    explanationDialog: false,
  }),
  computed: {
    tip() {
      return DataUtil.TIP5_FISH_IDS.includes(this.id)
    },
  },
}
</script>

<style lang="sass">
.fishing-tip5
  margin-top: 4px
  margin-bottom: 4px

  .red
    color: orangered !important
    background-color: unset !important
</style>
