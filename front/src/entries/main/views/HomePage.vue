<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6">
        <v-row>
          <v-col cols="12">
            <v-img :src="largeLogo" height="200" contain max-width="300" />
            <v-card flat color="background">
              <v-card-title class="text-h4">
                欢迎来到鱼糕！
                <v-btn rounded color="primary" depressed @click="showPatchNote">
                  <span class="subtitle-1">{{ version }}</span>
                </v-btn>
              </v-card-title>
              <v-card-text class="text-subtitle-1">
                鱼糕致力于为各位光之渔夫提供一个便捷的数据查询场所。<br />
                目前已经包括了钓鱼时钟，钓鱼&叉鱼笔记，出海垂钓，云冠群岛，水族馆等功能。<br />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" class="ma-0 pa-0">
            <v-subheader> 页面导航 </v-subheader>
          </v-col>
          <v-col cols="12" md="6">
            <home-page-card @click="toPageSubList">
              <template v-slot:title>
                <v-icon class="mr-1">mdi-timer</v-icon>钓鱼时钟
              </template>
              <template v-slot:description>「烟波钓徒」「钓场之王」 我来啦！</template>
            </home-page-card>
          </v-col>
          <v-col cols="12" md="6">
            <home-page-card @click="toPage('WikiPage')">
              <template v-slot:title>
                <v-icon class="mr-1">mdi-notebook</v-icon>{{ $t('top.fishWiki') }}
              </template>
              <template v-slot:description>目标全图鉴！附赠发光鱼竿哦~</template>
            </home-page-card>
          </v-col>
          <v-col cols="12" md="6">
            <home-page-card @click="toPage('OceanFishingPage54')">
              <template v-slot:title>
                <v-icon class="mr-1">mdi-ferry</v-icon>{{ $t('top.oceanFishing') }}
              </template>
              <template v-slot:description>「海王」们上船钓蓝鱼了！</template>
            </home-page-card>
          </v-col>
          <v-col cols="12" md="6">
            <home-page-card @click="toPage('AquariumPage')">
              <template v-slot:title>
                <v-icon class="mr-1">mdi-fishbowl</v-icon>{{ $t('top.aquarium') }}
              </template>
              <template v-slot:description>不在家里养点金鱼吗？</template>
            </home-page-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6">
        <v-row>
          <v-col cols="12" class="pb-0 pl-0">
            <v-subheader> 联系我们 </v-subheader>
          </v-col>
          <v-col cols="12">
            <v-card outlined class="rounded-lg">
              <v-list dense color="inner">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title> 红豆年糕 @ 海猫茶屋 </v-list-item-title>
                </v-list-item>
                <v-list-item @click="openQQ">
                  <v-list-item-avatar>
                    <v-icon>mdi-qqchat</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title> 鱼糕检修部（1153646847） </v-list-item-title>
                  <!--                <v-list-item-action>-->
                  <!--                  <rc-tooltip>-->
                  <!--                    <v-icon>mdi-qrcode</v-icon>-->
                  <!--                    <template v-slot:msg>-->
                  <!--                      qrcode-->
                  <!--                    </template>-->
                  <!--                  </rc-tooltip>-->
                  <!--                </v-list-item-action>-->
                </v-list-item>
                <v-list-item @click="openWeibo('7546879530')">
                  <v-list-item-avatar>
                    <v-icon>mdi-sina-weibo</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title>红豆年糕找不到</v-list-item-title>
                </v-list-item>
                <v-list-item @click="openWeibo('7245459345')">
                  <v-list-item-avatar>
                    <v-icon>mdi-sina-weibo</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title>光之渔夫bot（合作）</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" class="pa-0">
            <v-subheader>支持鱼糕</v-subheader>
          </v-col>
          <v-col>
            <v-alert border="left" colored-border color="secondary" class="mb-2">
              <div>如果您喜欢鱼糕带来的功能，可以考虑以下方式支持鱼糕！🎉</div>
            </v-alert>
          </v-col>

          <v-col cols="12" @click="openWeibo('7546879530')" style="cursor: pointer">
            <v-alert border="left" colored-border color="secondary" class="mb-2">
              <div>关注作者微博 @红豆年糕找不到 帮助鱼糕进行爱发电认证</div>
              <div class="text-subtitle-2 grey--text">
                爱发电创作者需认证后即可发布动态、显示主页图片
              </div>
            </v-alert>
          </v-col>
          <v-col cols="12" class="d-flex">
            <v-row no-gutters class="d-flex align-center">
              <div style="width: calc(100% - 50px)">
                <v-btn block x-large @click="openAfdian" color="#946ce6">
                  <span class="white--text text-h6"> 前往爱发电为鱼糕发电 </span>
                </v-btn>
              </div>
              <v-spacer />
              <rc-tooltip bottom>
                <v-btn large icon @click="showAfdianQRCode = true">
                  <v-icon large> mdi-qrcode </v-icon>
                </v-btn>
                <template v-slot:msg> 点击显示爱发电二维码 </template>
              </rc-tooltip>
            </v-row>
          </v-col>
          <v-col cols="12" class="mt-2">
            <v-card outlined>
              <v-card-title>
                <div class="d-flex align-center" style="width: 100%">
                  <span>感谢名单</span>
                  <v-spacer />
                  <rc-tooltip tag="span" class="fill-height">
                    <v-icon>mdi-help-circle-outline</v-icon>
                    <template v-slot:msg>
                      <div>
                        非实时更新，约每5分钟刷新数据。
                      </div>
                      <div>
                        以总发电量倒序排序。当月赞助者会根据赞助方案点亮颜色，电量越高颜色越深。
                      </div>
                      <div>
                        更详细的感谢名单正在筹划中...
                      </div>
                      <div class="text-decoration-line-through">
                        是的，2个年糕是我自己调试的时候给自己发了电
                      </div>
                    </template>
                  </rc-tooltip>
                </div>
              </v-card-title>
              <v-card-text style="overflow-y: auto; max-height: 300px">
                <v-chip
                  v-for="sponsor in coloredSponsors"
                  :key="sponsor.userId"
                  pill
                  class="ma-1"
                  :color="sponsor.planColor"
                  outlined
                >
                  <v-avatar left>
                    <v-img :src="sponsor.avatar"></v-img>
                  </v-avatar>
                  <span :class="sponsor.planTextColor">
                    {{ sponsor.username }}
                  </span>
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="showAfdianQRCode" max-width="600">
      <v-img :src="afdianImage" />
    </v-dialog>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex'
import { version } from '@/../package.json'
import HomePageCard from '@/components/HomePageCard'
import ImgUtil from '@/utils/ImgUtil'
import RcTooltip from '@/components/basic/RcTooltip'
import orderBy from 'lodash/orderBy'
import rcapiService from '@/service/rcapiService'

export default {
  name: 'HomePage',
  components: { RcTooltip, HomePageCard },
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  props: {
    now: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showAfdianQRCode: false,
      sponsors: [],
    }
  },
  computed: {
    coloredSponsors() {
      return this.sponsorsByTotalAmountDesc.map(sponsor => {
        const planIndex =
          ['捕鱼专家', '鱼太公', '烟波钓徒', '钓场之王'].indexOf(
            sponsor.currentPlanName
          ) + 1
        return {
          planColor: [
            undefined,
            'orange lighten-4',
            'orange lighten-2',
            'deep-orange lighten-1',
            'deep-orange accent-3',
          ][planIndex],
          planTextColor: [
            undefined,
            this.theme.isDark ? undefined : 'black--text',
            undefined,
            undefined,
            undefined,
          ][planIndex],
          ...sponsor,
        }
      })
    },
    sponsorsByTotalAmountDesc() {
      return orderBy(this.sponsors, ['allSumAmount', 'lastPayTime'], ['desc', 'desc'])
    },
    largeLogo() {
      return ImgUtil.getImgUrl('pastry-fish-home-logo.webp')
    },
    version() {
      return version
    },
    afdianImage() {
      return ImgUtil.getImgUrl('afdian.webp')
    },
  },
  async mounted() {
    this.sponsors = await rcapiService.getSponsors()
  },
  methods: {
    ...mapMutations('dialog', ['setShowDialog']),
    ...mapMutations(['setActiveTab']),
    toPage(routeName) {
      this.$router.push({ name: routeName })
    },
    toPageSubList() {
      this.toPage('ListPage')
      this.setActiveTab(0)
    },
    openQQ() {
      window.open('https://jq.qq.com/?_wv=1027&k=E9LABNxT')
    },
    openWeibo(uid) {
      window.open(`https://weibo.com/u/${uid}`)
    },
    openAfdian() {
      window.open('https://afdian.net/@ricecake404')
    },
    showPatchNote() {
      this.setShowDialog({ dialog: 'patchNoteDialog', show: true })
    },
  },
}
</script>

<style scoped></style>
