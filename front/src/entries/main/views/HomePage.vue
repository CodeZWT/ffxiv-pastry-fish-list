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
          <v-col cols="12" lg="5" class="pa-0 d-flex justify-center">
            <v-img :src="largeLogo" height="300" contain max-width="400" />
          </v-col>
          <v-col cols="12" lg="7" class="fill-height d-flex align-center">
            <v-card flat color="background">
              <v-card-title class="text-h4">
                {{ $t('homePage.welcome') }}
                <v-btn rounded color="primary" depressed @click="showPatchNote">
                  <span class="subtitle-1">{{ version }}</span>
                </v-btn>
              </v-card-title>
              <v-card-text class="text-subtitle-1">
                <div v-html="$t('homePage.description')"></div>
                <div class="d-flex align-center mt-2">
                  <v-badge inline color="warning" content="Fix" />
                  <div>修复刺鱼鱼识及鱼影条件在搜索与笔记页面没有正常显示的问题</div>
                </div>
                <div class="d-flex align-center mt-2">
                  <v-badge inline color="primary" content="New" />
                  <div>增加钓场多语言支持</div>
                </div>
                <div class="d-flex align-center mt-2">
                  <v-badge inline color="primary" content="New" />
                  <div>更新恋人节贺图，感谢 马猴烧鱼@拉诺西亚 绘制的贺图！</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" class="pa-0">
            <v-col cols="12" class="pa-0">
              <v-subheader>{{ $t('homePage.section.nav') }}</v-subheader>
            </v-col>
            <v-col cols="12" class="my-0 py-0">
              <v-row class="py-0">
                <v-col cols="12" md="6">
                  <home-page-card @click="toPageSubList">
                    <template v-slot:title>
                      <v-icon class="mr-1">{{ mdiTimer }}</v-icon>
                      {{ $t('listPage.title') }}
                    </template>
                    <template v-slot:description>
                      {{ $t('listPage.description') }}
                    </template>
                  </home-page-card>
                </v-col>
                <v-col cols="12" md="6">
                  <home-page-card @click="toPage('WikiPage')">
                    <template v-slot:title>
                      <v-icon class="mr-1">{{ mdiNotebook }}</v-icon>
                      {{ $t('wikiPage.title') }}
                    </template>
                    <template v-slot:description>{{
                      $t('wikiPage.description')
                    }}</template>
                  </home-page-card>
                </v-col>
                <v-col cols="12" md="6">
                  <home-page-card @click="toPage('OceanFishingPage54')">
                    <template v-slot:title>
                      <v-icon class="mr-1">{{ mdiFerry }}</v-icon>
                      {{ $t('oceanFishingPage.title') }}
                    </template>
                    <template v-slot:description>
                      {{ $t('oceanFishingPage.description') }}
                    </template>
                  </home-page-card>
                </v-col>
                <v-col cols="12" md="6">
                  <home-page-card @click="toFAQ">
                    <template v-slot:title>
                      <v-icon class="mr-1">{{ mdiHammerWrench }}</v-icon>
                      {{ $t('faqPage.title') }}
                    </template>
                    <template v-slot:description>{{
                      $t('faqPage.description')
                    }}</template>
                  </home-page-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" class="pa-0">
              <v-subheader>{{ $t('homePage.section.contact') }}</v-subheader>
            </v-col>
            <v-col cols="12" class="my-0 py-0">
              <v-card outlined class="rounded-md">
                <v-list dense color="inner">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>{{ mdiAccount }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title> {{ $t('contact.author') }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openQQ">
                    <v-list-item-icon>
                      <v-icon>{{ mdiQqchat }}</v-icon>
                    </v-list-item-icon>
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
                    <v-list-item-icon>
                      <!--                    <span style="font-size: x-large">#</span>-->
                      <v-icon>{{ mdiQqchat }}</v-icon>
                    </v-list-item-icon>
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
                    <v-list-item-icon>
                      <v-icon>{{ mdiSinaWeibo }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>红豆年糕找不到</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openWeibo('7245459345')">
                    <v-list-item-icon>
                      <v-icon>{{ mdiSinaWeibo }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>光之渔夫bot（合作）</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-col>

          <v-col cols="12" md="6" class="pa-0">
            <v-col cols="12" class="pa-0">
              <v-subheader>{{ $t('homePage.section.weibo') }}</v-subheader>
            </v-col>
            <v-col cols="12" class="my-md-0 py-md-0">
              <v-card outlined style="height: 404px; overflow: hidden">
                <iframe
                  v-if="isDark"
                  width="100%"
                  height="435"
                  class="share_self"
                  frameborder="0"
                  scrolling="no"
                  src="https://widget.weibo.com/weiboshow/index.php?language=&width=0&height=435&fansRow=2&ptype=1&speed=0&skin=10&isTitle=0&noborder=0&isWeibo=1&isFans=0&uid=7546879530&verifier=586d174c&colors=d6f3f7,2d2d32,FAFAFA,38669b,2d2d32&dpc=1"
                ></iframe>
                <iframe
                  v-else
                  width="100%"
                  height="435"
                  class="share_self"
                  frameborder="0"
                  scrolling="no"
                  src="http://widget.weibo.com/weiboshow/index.php?language=&width=0&height=435&fansRow=2&ptype=1&speed=0&skin=2&isTitle=0&noborder=0&isWeibo=1&isFans=0&uid=7546879530&verifier=586d174c&colors=d6f3f7,f2f3f5,666666,0082cb,f2f3f5&dpc=1"
                ></iframe>
              </v-card>
            </v-col>
            <v-col cols="12" class="pa-0">
              <v-subheader>{{ $t('homePage.section.link') }}</v-subheader>
            </v-col>
            <v-col cols="12" class="my-0 py-0">
              <v-card outlined class="rounded-md">
                <v-list dense color="inner">
                  <v-list-item @click="openLink('http://www.ffxiv.co')">
                    <v-list-item-icon>
                      <v-icon>{{ mdiLink }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>飞艇坪 - 最终幻想14网址导航</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12" class="pa-0">
            <v-subheader>{{ $t('homePage.section.support') }}</v-subheader>
          </v-col>
          <v-col class="my-0 py-0">
            <v-alert border="left" colored-border color="secondary" class="mb-2">
              <div>{{ $t('homePage.support.description') }}</div>
            </v-alert>
          </v-col>

          <v-col
            cols="12"
            class="my-0 py-0"
            @click="openWeibo('7546879530')"
            style="cursor: pointer"
          >
            <v-alert border="left" colored-border color="secondary" class="mb-2">
              <div>关注作者微博 @红豆年糕找不到</div>
            </v-alert>
          </v-col>
          <v-col cols="12" class="d-flex my-0 py-0">
            <v-row no-gutters class="d-flex align-center">
              <div style="width: calc(100% - 50px)">
                <v-btn block x-large @click="openAfdian" color="#946ce6">
                  <span class="white--text text-h6"> 前往爱发电为鱼糕发电 </span>
                </v-btn>
              </div>
              <v-spacer />
              <rc-tooltip bottom>
                <v-btn large icon @click="showAfdianQRCode = true">
                  <v-icon large> {{ mdiQrcode }}</v-icon>
                </v-btn>
                <template v-slot:msg> 点击显示爱发电二维码 </template>
              </rc-tooltip>
            </v-row>
          </v-col>
          <v-col cols="12" class="mt-2 mb-0 py-0">
            <v-card outlined>
              <v-card-title>
                <div class="d-flex align-center" style="width: 100%">
                  <span>{{ $t('homePage.support.sponsorList') }}</span>
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
              <v-card-text style="overflow-y: auto; max-height: 566px">
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
  mdiHammerWrench,
  mdiHelpCircleOutline,
  mdiLink,
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
import LINK from 'Data/link'
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
      mdiHammerWrench,
      mdiQrcode,
      mdiHelpCircleOutline,
      mdiLink,
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
        'pastry-fish-fes-valentione.webp',
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
    toFAQ() {
      window.open(LINK.FAQ)
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
    openLink(link) {
      window.open(link)
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
