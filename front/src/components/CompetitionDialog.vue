<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title>
        <div style="text-align: center; width: 100%" class="text-h5">
          {{ $t('top.competition') }}
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-row class="d-flex">
          <v-col :cols="isMobile ? 12 : 7" class="py-0">
            <v-carousel
              hide-delimiter-background
              show-arrows-on-hover
              v-model="currentIndex"
              height="600"
            >
              <v-carousel-item v-for="(image, i) in images" :key="i">
                <v-img :src="image" contain height="600" />
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <v-col :cols="isMobile ? 12 : 5" :class="isMobile ? '' : 'pa-0'">
            <div class="d-flex flex-column justify-space-around fill-height">
              <div>
                <div>什么是真正的渔夫？是幸运的宠儿，还是敢于拼搏的猛士？</div>
                <div>我们目睹过电闪雷鸣后的腾龙身影，也见识过遥远东方的七彩宸耀。</div>
                <div>从始至今，那些捕鱼人的传说！依然在这世上流传！</div>
                <div>如今！一场属于捕鱼人的盛典即将展开！</div>
                <div>第三届艾欧泽亚光之渔夫钓鱼大赛诚邀你的参与！</div>
                <div>
                  炎炎夏日，让我们在我们熟悉无比的航线上，角逐出那个真正的捕鱼大师吧。
                </div>
                <div>
                  你拥有熟练的技巧，笃定的信心，当然还有着卓越不凡的运气。点击下方链接进行报名，当然我们拒绝在船上投放莫莫拉·莫拉的渔夫。
                </div>
              </div>
              <div>
                <v-card outlined>
                  <v-card-title>
                    <div style="text-align: center; width: 100%">
                      2021年5月29日 全区招募中
                    </div>
                  </v-card-title>
                  <v-card-text class="d-flex align-center flex-column">
                    <div class="text-subtitle-1">详细内容以及报名链接：</div>
                    <div class="text-subtitle-1">
                      <a href="https://ngabbs.com/read.php?tid=26872848" target="_blank">
                        第三届光之渔夫钓鱼大赛
                      </a>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="handleClose" block>关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
import EnvMixin from '@/components/basic/EnvMixin'
import ImgUtil from '@/utils/ImgUtil'

export default {
  name: 'CompetitionDialog',
  mixins: [EnvMixin],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentIndex: 0,
      images: [1, 2, 3].map(number =>
        ImgUtil.getCompetitionImgUrl(`competition-3-${number}.jpg`)
      ),
    }
  },
  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(showDialog) {
        return this.$emit('input', showDialog)
      },
    },
  },
  methods: {
    handleClose() {
      this.dialog = false
    },
    ...mapMutations(['setFeatureViewed']),
  },
}
</script>

<style scoped></style>
