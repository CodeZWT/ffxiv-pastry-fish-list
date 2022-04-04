<template>
  <v-footer
    class="text-subtitle-2 inner mt-10"
    style="border-top: 1px #494949 solid !important;"
  >
    <v-row class="d-flex justify-center text-center" no-gutters>
      <v-col cols="12" :md="columnCols">
        <v-row no-gutters>
          <v-subheader>
            联系方式
          </v-subheader>
          <v-col cols="12" class="link-item">
            <v-icon class="pr-1">{{ mdiIdentifier }}</v-icon>
            <div>{{ $t('footer.author') }}</div>
          </v-col>
          <v-col cols="12" class="link-item" @click="openQQ">
            <v-icon class="pr-1">{{ mdiQqchat }}</v-icon>
            <div>1153646847</div>
          </v-col>
          <v-col cols="12" class="link-item" @click="openWeibo('7546879530')">
            <v-icon class="pr-1">{{ mdiSinaWeibo }}</v-icon>
            <div>红豆年糕找不到</div>
          </v-col>
          <v-col cols="12" class="link-item" @click="openQQGuild">
            <v-icon class="pr-1">{{ mdiQqchat }}</v-icon>
            <div>频道：FF14 捕鱼人研究会</div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" :md="columnCols">
        <v-row no-gutters>
          <v-subheader>
            友情链接
          </v-subheader>
          <v-col cols="12" class="link-item" @click="openWeibo('7245459345')">
            <v-icon class="pr-1">{{ mdiSinaWeibo }}</v-icon>
            <div>光之渔夫bot</div>
          </v-col>
          <v-col cols="12" class="link-item" @click="openLink(GARLAND_URL + '/db/')">
            <v-icon class="pr-1">{{ mdiLink }}</v-icon>
            <div>Garland/花环国服数据站</div>
          </v-col>
          <v-col cols="12" class="link-item" @click="openLink('http://www.ffxiv.co')">
            <v-icon class="pr-1">{{ mdiLink }}</v-icon>
            <div>飞艇坪 - 最终幻想14网址导航</div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" :md="columnCols">
        <v-row no-gutters>
          <v-subheader>
            站点信息
          </v-subheader>
          <v-col
            cols="12"
            class="link-item"
            @click="openLink('https://github.com/ricecake404/ffxiv-pastry-fish-list')"
          >
            <v-icon class="pr-1">{{ mdiGithub }}</v-icon>
            <div>FFXIV Pastry Fish List</div>
          </v-col>
          <v-col
            cols="12"
            class="link-item"
            @click="
              openLink(
                'https://ricecake302.coding.net/s/569c25c7-3f53-4678-baaa-95641a4d27f3'
              )
            "
          >
            <v-icon class="pr-1">{{ mdiHammerWrench }}</v-icon>
            <div>{{ $t('faqPage.title') }}</div>
          </v-col>
          <v-col
            cols="12"
            class="link-item"
            @click="openLink('https://fish.ricecake302.com')"
          >
            <v-icon class="pr-1">{{ mdiEarth }}</v-icon>
            <div>{{ '国际站点' }}</div>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" :md="columns % 2 === 1 ? 12 : columnCols">
        <v-row no-gutters>
          <v-subheader>
            其他信息
          </v-subheader>
          <v-col cols="12" class="link-item">
            <a target="_blank" href="https://beian.miit.gov.cn" class="pl-6">
              黔ICP备2020011894号-1
            </a>
          </v-col>
          <v-col cols="12" class="link-item">
            <div class="d-flex justify-center">
              <v-img :src="beianIcon" max-width="20" max-height="20" class="mr-1" />
              <a
                target="_blank"
                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=52270102000276"
              >
                黔公网安备 52270102000276号
              </a>
            </div>
          </v-col>
          <v-col cols="12" class="link-item">
            <div>{{ $t('footer.ffRights') }}</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import {
  mdiEarth,
  mdiGithub,
  mdiHammerWrench,
  mdiIdentifier,
  mdiLink,
  mdiQqchat,
  mdiSinaWeibo,
} from '@mdi/js'
import EnvMixin from '@/components/basic/EnvMixin'
import beianIcon from 'Assets/beian-icon.png'

export default {
  name: 'RcFooter',
  mixins: [EnvMixin],
  props: {
    columns: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      GARLAND_URL: process.env.VUE_APP_GARLAND_HOST,
      beianIcon,
      showAboutDialog: false,
      mdiQqchat,
      mdiIdentifier,
      mdiSinaWeibo,
      mdiLink,
      mdiGithub,
      mdiHammerWrench,
      mdiEarth,
    }
  },
  computed: {
    columnCols() {
      return 12 / this.columns
    },
  },
  methods: {
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
  },
}
</script>

<style scoped lang="scss">
.link-item::v-deep {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: start;
  padding-left: 16px !important;
}
</style>
