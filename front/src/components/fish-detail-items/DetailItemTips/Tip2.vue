<template>
  <div class="fishing-tip2">
    <v-card v-if="tip" outlined tile>
      <v-card-subtitle>
        <div class="text-subtitle-1">
          <a href="https://ngabbs.com/read.php?tid=23672580" target="_blank">
            [烟波钓徒][我本烟波一钓徒][5.x]烟波204鱼王心得攻略
          </a>
        </div>
        <div class="d-flex">
          <div>
            <div>谈清若风柔@神拳痕</div>
            <div>更新时间：2021/04/06</div>
          </div>
          <v-spacer />
          <rc-dialog v-model="explanationDialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" text>
                <v-icon left>{{ mdiInformation }}</v-icon>
                作者说明
              </v-btn>
            </template>
            <v-card class="fishing-tip2">
              <v-card-title> 关于本篇攻略的一些补充说明 </v-card-title>
              <v-card-text>
                <ol>
                  <li>
                    鱼王条件(时间与天气)、参考钓法的数据均来自于钓鱼时钟。同时对直接由鱼饵钓起的鱼王有一个参考的“拍击水面”技能使用对象，数据参考来自于饿猫和我以及大多数捕鱼人的习惯，有些鱼王的“拍击水面”对象有多种，在对应描述中有补充。
                    <span class="orangered">
                      同时，如果参考钓法中出现了(*)符号，便代表我自己认为有相对于钓鱼时钟更加优化的钓法，请参考下面的“其他”中的内容理性抉择。
                    </span>
                  </li>
                  <li>
                    “数据可视化”是展示的该鱼王的最终上钩时间，对于直接由鱼饵钓起的鱼王包括“撒饵”“平钓”两个部分的数据，对于以小钓大的鱼王只有“平钓”一个部分的数据(以小钓大最后一步)。黑色数据来自我自己，真实但存在样本单一的问题；
                    <span class="orangered" style="font-weight: bold">红色数据</span>
                    来自饿猫以及我在补数据的时候询问的附近钓友(谢谢你们)，可能存在记录错误但样本多样。
                  </li>
                  <li>
                    “其他”部分是关于该鱼王的补充说明或者是废话杂谈，同时有几率出现一些钓法的参考(对于众所周知的鱼王，这种几率绝赞UP↑)。
                  </li>
                  <li>
                    由我本人提供的上钩时间数据由于使用的计时宏，所以只精确到了向下取整的整数秒。
                  </li>
                  <li>
                    因为我个人力量真的有限，大多数相关数据并不是很多，不具有统计学意义的参考价值，还请各位看官能够理性判断和参考。
                  </li>
                  <li>
                    少部分鱼王攻略中存在私货(赞扬亲友，谈天说地，扯梗玩笑)，如有不适，请指出，十分抱歉。
                  </li>
                </ol>
              </v-card-text>
            </v-card>
          </rc-dialog>
        </div>
      </v-card-subtitle>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <div class="text-subtitle-2" style="font-weight: bold">
              时间与天气
              <v-tooltip top color="secondary">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small v-bind="attrs" v-on="on">{{
                    mdiHelpCircleOutline
                  }}</v-icon>
                </template>
                <div>
                  {{ $t('pastryFishTip.title') }}
                  <div>
                    {{ $t('pastryFishTip.content') }}
                  </div>
                  <div>部分数据已在作者授权下更新，原贴将会在之后更新。</div>
                </div>
              </v-tooltip>
            </div>
            <div class="text--primary">
              {{ tip.weatherTime }}
            </div>
            <v-divider class="my-1" />
            <div class="text-subtitle-2" style="font-weight: bold">
              数据可视化
              <v-tooltip top color="secondary">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small v-bind="attrs" v-on="on">{{
                    mdiHelpCircleOutline
                  }}</v-icon>
                </template>
                <div>
                  <div>黑色数据来自作者：真实但存在样本单一</div>
                  <div>
                    <span class="orangered">红色数据</span
                    >来自饿猫以及钓友：可能存在记录错误但样本多样
                  </div>
                  <div>（详细说明请点击“作者说明”查看）</div>
                </div>
              </v-tooltip>
            </div>
            <div class="text--primary" v-html="tip.data"></div>
          </v-col>
          <v-col cols="6">
            <div class="text-subtitle-2" style="font-weight: bold">
              参考钓法
              <span v-if="tip.trickWithStar" class="orangered">(*)</span>
            </div>

            <div class="text--primary" v-html="tip.trick" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" v-if="tip.comment">
            <div class="d-flex align-center">
              <div class="text-subtitle-2" style="font-weight: bold">其他</div>
              <v-spacer />
              <v-tooltip top color="secondary">
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <div>鱼糕注：关于“入门”</div>
                  </div>
                </template>
                <div>
                  攻略中“入门”相关描述指钓法本身简单，并非指鱼容易咬钩，也不意味着不容易脱钩，即与最终钓上鱼的难度没有必然联系。
                </div>
              </v-tooltip>
            </div>
            <div class="text--primary" v-html="tip.comment"></div>
          </v-col>
        </v-row>
        <!--        <div v-html="tip.wholeHtml"></div>-->
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mdiHelpCircleOutline, mdiInformation } from '@mdi/js'
import RcDialog from '@/components/basic/RcDialog'
import tip2 from 'Data/tip2'

export default {
  name: 'Tip2',
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
  //         tip2.map(tip => {
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
      return tip2[this.id]
    },
  },
}
</script>

<style lang="sass">
.fishing-tip2
  margin-top: 4px
  margin-bottom: 4px

  .orangered
    color: orangered !important
</style>
