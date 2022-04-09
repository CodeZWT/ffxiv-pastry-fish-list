<template>
  <div class="fishing-tip3">
    <v-card v-if="tip" outlined tile>
      <v-card-subtitle>
        <div class="text-subtitle-1">
          <a href="https://ngabbs.com/read.php?tid=24457700" target="_blank">
            [5.3钓鱼氵]震惊，阿济兹拉旗舰岛竟然……
          </a>
        </div>
        <div class="d-flex">
          <div>
            <div>轩辕十四@沃仙曦染</div>
            <div>
              更新时间：2020/12/03
            </div>
          </div>
        </div>
      </v-card-subtitle>
      <v-divider />
      <v-card-text>
        <div>
          天钢之球在阿济兹拉旗舰岛只会提起白金鱼。（详情见帖子）
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'Tip3',
  props: ['id'],
  data: () => ({
    explanationDialog: false,
  }),
  computed: {
    tip() {
      return DataUtil.TIP3_FISH_IDS.includes(this.id)
    },
  },
}
</script>

<style lang="sass">
.fishing-tip3
  margin-top: 4px
  margin-bottom: 4px

  .red
    color: orangered !important
    background-color: unset !important
</style>
