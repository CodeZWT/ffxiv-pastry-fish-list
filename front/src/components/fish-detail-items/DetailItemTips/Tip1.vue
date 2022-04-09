<template>
  <div class="fishing-tip1">
    <v-card v-if="tip" outlined tile>
      <v-card-subtitle>
        <div class="text-subtitle-1">
          <a href="https://ngabbs.com/read.php?tid=18484723" target="_blank">
            [烟波钓徒]红莲之狂潮&苍穹之禁城 钓场之皇捕获指南
          </a>
        </div>
        <div class="d-flex">
          <div>
            <div>月咏泠音@摩杜纳</div>
            <div>
              更新时间：2020/06/04
            </div>
          </div>
          <v-spacer />
          <rc-dialog v-model="explanationDialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" text>
                <v-icon left>{{ mdiInformation }}</v-icon>
                作者说明
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                作者说明
              </v-card-title>
              <v-card-text>
                大部分内容是4.5写的，在新技能下可能不是最优解。
                本系列的攻略中的技巧偏向于钓
                <span style="font-weight: bold; color: orangered">HQ鱼</span>
                ，如果不追求HQ，请酌情参考攻略中的技巧。
              </v-card-text>
            </v-card>
          </rc-dialog>
        </div>

        <div class="red">
          本系列的攻略中的技巧偏向于钓
          <span style="font-weight: bold; color: orangered">HQ鱼</span>
          ，如果不追求HQ，请酌情参考攻略中的技巧。
        </div>
      </v-card-subtitle>
      <v-divider />
      <v-card-text>
        <div v-if="tip.type === 'simple'">
          <div v-html="tip.trick" />
        </div>
        <div v-else style="position: relative">
          <v-row no-gutters>
            <v-col cols="12">
              <div style="position: absolute; right: 0; top:0">
                <v-tooltip top color="secondary">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">{{ mdiHelpCircleOutline }}</v-icon>
                  </template>
                  <div>
                    {{ $t('pastryFishTip.title') }}
                    <div>
                      {{ $t('pastryFishTip.content') }}
                    </div>
                  </div>
                </v-tooltip>
              </div>
              <div v-html="tip.requirements" />
            </v-col>
            <v-col cols="12">
              <v-divider class="my-2" />
            </v-col>
            <v-col cols="12">
              <div class="text-subtitle-2" style="font-weight: bold">门票：</div>
              <div v-html="tip.predators" />
            </v-col>
            <v-col cols="12">
              <v-divider class="my-2" />
            </v-col>
            <v-col cols="12">
              <div class="text-subtitle-2" style="font-weight: bold">推荐流程：</div>
              <div v-html="tip.trick" />
            </v-col>
            <v-col cols="12" v-if="tip.trick2">
              <v-divider class="my-2" />
            </v-col>
            <v-col cols="12" v-if="tip.trick2">
              <div v-html="tip.trick2" />
            </v-col>
            <v-col cols="12">
              <v-divider class="my-2" v-if="tip.trick3" />
            </v-col>
            <v-col cols="12" v-if="tip.trick3">
              <div v-html="tip.trick3" />
            </v-col>
            <v-col cols="12">
              <v-divider class="my-2" />
            </v-col>
            <v-col cols="12">
              <div class="text-subtitle-2" style="font-weight: bold">笔者评价：</div>
              <div v-html="tip.remark" />
            </v-col>
            <v-divider />
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mdiHelpCircleOutline, mdiInformation } from '@mdi/js'
import RcDialog from '@/components/basic/RcDialog'
import tip1 from 'Data/tip1'

export default {
  name: 'Tip1',
  components: { RcDialog },
  props: ['id'],
  data: () => ({
    mdiInformation,
    mdiHelpCircleOutline,
    explanationDialog: false,
  }),
  // created() {
  //   const items = Object.values(CN_DATA.ITEMS)
  //   console.log(
  //     JSON.stringify(
  //       _.keyBy(
  //         tip1.map(tip => {
  //           const fish = items.find(item => item.name_chs === tip.name)
  //           if (!fish) console.log(tip)
  //           return {
  //             id: fish?._id,
  //             ...tip,
  //           }
  //         }),
  //         'id'
  //       ),
  //       null,
  //       2
  //     )
  //   )
  // },
  computed: {
    tip() {
      return tip1[this.id]
    },
  },
}
</script>

<style lang="sass">
.fishing-tip1
  margin-top: 4px
  margin-bottom: 4px

  .red
    color: orangered !important
    background-color: unset !important
</style>
