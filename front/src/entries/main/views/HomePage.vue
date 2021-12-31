<template>
  <v-container
    fluid
    :class="{
      'detail-wrapper': true,
      'detail-wrapper--web': !isElectron,
      'detail-wrapper--electron': isElectron && !original,
      'detail-wrapper--electron-original': isElectron && original,
    }"
  >
    <v-row>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12" md="4">
            <v-img :src="largeLogo" height="280" contain max-width="300" />
          </v-col>
          <v-col cols="12" md="8" class="fill-height d-flex align-center">
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
                <div class="d-flex align-center">
                  <v-badge inline color="info" content="New" />
                  <div>更新钓鱼笔记中链接支持，现在鱼也可以设置跳转鱼糕内部页面。</div>
                </div>

                <div class="d-flex align-center">
                  <v-icon color="warning" class="mr-1">{{ mdiAlertOutline }}</v-icon>
                  开启国际服模式时，注意可能的剧透！
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pa-0">
            <v-subheader> 联系我们 </v-subheader>
          </v-col>
          <v-col cols="12" md="6" class="my-0 py-0">
            <v-card outlined class="rounded-md">
              <v-list dense color="inner">
                <v-list-item>
                  <v-list-item-avatar>
                    <v-icon>{{ mdiAccount }}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title> 红豆年糕 @ 海猫茶屋 </v-list-item-title>
                </v-list-item>
                <v-list-item @click="openQQ">
                  <v-list-item-avatar>
                    <v-icon>{{ mdiQqchat }}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title> 鱼糕检修部（1153646847） </v-list-item-title>
                  <!--                <v-list-item-action>-->
                  <!--                  <rc-tooltip>-->
                  <!--{{                    <vIcon>mdiQrcode</vIcon>}}-->
                  <!--                    <template v-slot:msg>-->
                  <!--                      qrcode-->
                  <!--                    </template>-->
                  <!--                  </rc-tooltip>-->
                  <!--                </v-list-item-action>-->
                </v-list-item>
                <v-list-item @click="openQQGuild">
                  <v-list-item-avatar>
                    <!--                    <span style="font-size: x-large">#</span>-->
                    <v-icon>{{ mdiQqchat }}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title>FF14 捕鱼人研究会</v-list-item-title>
                  <!--                <v-list-item-action>-->
                  <!--                  <rc-tooltip>-->
                  <!--{{                    <vIcon>mdiQrcode</vIcon>}}-->
                  <!--                    <template v-slot:msg>-->
                  <!--                      qrcode-->
                  <!--                    </template>-->
                  <!--                  </rc-tooltip>-->
                  <!--                </v-list-item-action>-->
                </v-list-item>
                <v-list-item @click="openWeibo('7546879530')">
                  <v-list-item-avatar>
                    <v-icon>{{ mdiSinaWeibo }}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title>红豆年糕找不到</v-list-item-title>
                </v-list-item>
                <v-list-item @click="openWeibo('7245459345')">
                  <v-list-item-avatar>
                    <v-icon>{{ mdiSinaWeibo }}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title>光之渔夫bot（合作）</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" class="my-md-0 py-md-0">
            <v-card outlined style="height: 298px; overflow: hidden">
              <iframe
                v-if="isDark"
                width="100%"
                height="330"
                class="share_self"
                frameborder="0"
                scrolling="no"
                src="https://widget.weibo.com/weiboshow/index.php?language=&width=0&height=330&fansRow=2&ptype=1&speed=0&skin=10&isTitle=0&noborder=0&isWeibo=1&isFans=0&uid=7546879530&verifier=586d174c&colors=d6f3f7,2d2d32,FAFAFA,38669b,2d2d32&dpc=1"
              ></iframe>
              <iframe
                v-else
                width="100%"
                height="330"
                class="share_self"
                frameborder="0"
                scrolling="no"
                src="http://widget.weibo.com/weiboshow/index.php?language=&width=0&height=330&fansRow=2&ptype=1&speed=0&skin=2&isTitle=0&noborder=0&isWeibo=1&isFans=0&uid=7546879530&verifier=586d174c&colors=d6f3f7,f2f3f5,666666,0082cb,f2f3f5&dpc=1"
              ></iframe>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pa-0">
            <v-subheader>页面导航</v-subheader>
          </v-col>
          <v-col cols="12" class="my-0 py-0">
            <v-row class="py-0">
              <v-col cols="12" md="6">
                <home-page-card @click="toPageSubList">
                  <template v-slot:title>
                    <v-icon class="mr-1">{{ mdiTimer }}</v-icon
                    >钓鱼时钟
                  </template>
                  <template v-slot:description
                    >「烟波钓徒」「钓场之王」 我来啦！</template
                  >
                </home-page-card>
              </v-col>
              <v-col cols="12" md="6">
                <home-page-card @click="toPage('WikiPage')">
                  <template v-slot:title>
                    <v-icon class="mr-1">{{ mdiNotebook }}</v-icon
                    >{{ $t('top.fishWiki') }}
                  </template>
                  <template v-slot:description>目标全图鉴！附赠发光鱼竿哦~</template>
                </home-page-card>
              </v-col>
              <v-col cols="12" md="6">
                <home-page-card @click="toPage('OceanFishingPage54')">
                  <template v-slot:title>
                    <v-icon class="mr-1">{{ mdiFerry }}</v-icon
                    >{{ $t('top.oceanFishing') }}
                  </template>
                  <template v-slot:description>「海王」们上船钓蓝鱼了！</template>
                </home-page-card>
              </v-col>
              <v-col cols="12" md="6">
                <home-page-card @click="toPage('AquariumPage')">
                  <template v-slot:title>
                    <v-icon class="mr-1">{{ mdiFishbowl }}</v-icon
                    >{{ $t('top.aquarium') }}
                  </template>
                  <template v-slot:description>不在家里养点金鱼吗？</template>
                </home-page-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <v-row no-gutters>
          <v-col cols="12" style="margin: -12px 0 0 0">
            <v-subheader>支持鱼糕</v-subheader>
          </v-col>
          <v-col>
            <v-alert border="left" colored-border color="secondary" class="mb-2">
              <div>如果您喜欢鱼糕带来的功能，可以考虑以下方式支持鱼糕！🎉</div>
            </v-alert>
          </v-col>

          <v-col cols="12" @click="openWeibo('7546879530')" style="cursor: pointer">
            <v-alert border="left" colored-border color="secondary" class="mb-2">
              <div>关注作者微博 @红豆年糕找不到</div>
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
                  <v-icon large> {{ mdiQrcode }} </v-icon>
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
                    <v-icon>{{ mdiHelpCircleOutline }}</v-icon>
                    <template v-slot:msg>
                      <div class="text-no-wrap">
                        <div>非实时更新，约每5分钟刷新数据。</div>
                        <div>
                          以总发电量倒序排序。当月赞助者会根据赞助方案点亮颜色，电量越高颜色越深。自选发电量以超过的最高档显示颜色。
                        </div>
                        <div>更详细的感谢名单正在筹划中...</div>
                        <div class="text-decoration-line-through">
                          是的，2个年糕是我自己调试的时候给自己发了电
                        </div>
                      </div>
                    </template>
                  </rc-tooltip>
                </div>
              </v-card-title>
              <v-card-text style="overflow-y: auto; max-height: 560px">
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
import {
  mdiAccount,
  mdiAlertOutline,
  mdiFerry,
  mdiFishbowl,
  mdiHelpCircleOutline,
  mdiNotebook,
  mdiQqchat,
  mdiQrcode,
  mdiSinaWeibo,
  mdiTimer,
} from '@mdi/js'
import { version } from '@/../package.json'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
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
    original: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiAlertOutline,
      mdiAccount,
      mdiQqchat,
      mdiSinaWeibo,
      mdiTimer,
      mdiNotebook,
      mdiFerry,
      mdiFishbowl,
      mdiQrcode,
      mdiHelpCircleOutline,
      showAfdianQRCode: false,
      sponsors: [],
      isElectron: DevelopmentModeUtil.isElectron(),
    }
  },
  computed: {
    isDark() {
      return this.theme.isDark
    },
    coloredSponsors() {
      return this.sponsorsByTotalAmountDesc.map(sponsor => {
        const planIndex =
          4 -
          [50, 30, 15, 5, 0].findIndex(
            priceThreshold => sponsor.currentPlanPrice >= priceThreshold
          )
        return {
          planColor: [
            undefined,
            'orange lighten-4',
            'orange lighten-2',
            'deep-orange lighten-1',
            'deep-orange accent-3',
          ][planIndex],
          planTextColor: [
            this.theme.isDark ? undefined : 'grey--text text--darken-2',
            this.theme.isDark ? undefined : 'grey--text text--darken-3',
            undefined,
            undefined,
            undefined,
          ][planIndex],
          ...sponsor,
        }
      })
    },
    sponsorsByTotalAmountDesc() {
      return orderBy(
        this.sponsors,
        [sponsor => +sponsor.allSumAmount, 'lastPayTime'],
        ['desc', 'desc']
      )
    },
    largeLogo() {
      return ImgUtil.getImgUrl(
        'pastry-fish-fes-starlight.webp',
        ImgUtil.CATEGORY.HOME_LOGO
      )
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
    openQQGuild() {
      window.open(
        'https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&inviteCode=hCvFG&from=246610&biz=ka'
      )
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

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.detail-wrapper
  width: 100%
  overflow-scrolling: auto
  overflow-x: hidden
  overflow-y: auto

  &--web
    height: 100%
    max-height: calc(100vh - #{ $wrapper-web })
  &--electron
    max-height: calc(100% - #{ $toolbar-height })
  &--electron-original
    max-height: calc(100vh - #{ $wrapper-desktop })
</style>
