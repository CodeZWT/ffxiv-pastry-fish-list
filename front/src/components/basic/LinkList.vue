<template>
  <div>
    <rc-menu
      :disabled="disabled"
      open-on-hover
      offset-x
      nudge-right="4"
      open-delay="300"
      close-delay="300"
      :right="right"
      :left="left"
      :top="top"
      :bottom="bottom"
      offset-overflow
    >
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" @click.stop="goToDefaultPage">
          <slot />
        </div>
      </template>
      <v-card>
        <div class="d-flex align-center">
          <v-subheader @click.ctrl="copyItemId">{{ title }}</v-subheader>
          <v-spacer />
          <click-helper @click.stop="emitClick" :copy-text="currLocaleName">
            <v-btn text icon small :title="$t('list.item.copyHint')">
              <v-icon small>{{ mdiContentCopy }}</v-icon>
            </v-btn>
          </click-helper>
          <v-btn
            text
            icon
            small
            @click="onSettingBtnClick"
            class="mr-1"
            title="设置默认跳转"
          >
            <v-icon small>{{ mdiCog }}</v-icon>
          </v-btn>
        </div>
        <v-list dense v-if="nameList.length > 0">
          <v-list-item
            v-for="(localeItem, index) in nameList"
            :key="index"
            @click="goToPage(localeItem)"
          >
            <v-list-item-title class="d-flex align-center">
              <div style="min-width: 40px">
                <v-img contain :src="localeItem.icon" height="18" width="24" />
              </div>
              <div>
                <span>{{ localeItem.name }}</span>
              </div>
            </v-list-item-title>
            <v-list-item-action>
              <click-helper @click.stop="emitClick" :copy-text="localeItem.name">
                <v-btn text icon small :title="$t('list.item.copyHint')">
                  <v-icon small>{{ mdiContentCopy }}</v-icon>
                </v-btn>
              </click-helper>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <div class="d-flex align-center">
          <v-badge
            v-for="(link, index) in links"
            :key="index"
            :value="index === defaultLinkIndex"
            dot
            overlap
            :title="`${link.title}${index === defaultLinkIndex ? '（默认跳转）' : ''}`"
          >
            <v-btn @click="goToPage(link)" style="min-width: 40px" text>
              <div>
                <!--                <span>{{ link.title }}</span>-->
                <v-img contain :src="link.icon" height="24" width="24" />
              </div>
            </v-btn>
          </v-badge>
        </div>
      </v-card>
    </rc-menu>

    <rc-dialog v-model="showConfigDialog" max-width="300">
      <v-card>
        <v-card-title> 设置默认跳转 </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item-group color="primary" :value="defaultLinkIndex">
              <v-list-item
                v-for="(link, index) in links"
                :key="index"
                @click="setDefaultLinkByIndex(index)"
              >
                <v-list-item-icon>
                  <v-img :src="link.icon" height="24" width="24" />
                </v-list-item-icon>
                <v-list-item-title>
                  {{ link.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>
    </rc-dialog>
  </div>
</template>

<script>
import { SystemInfo } from 'Data/version'
import { mapGetters, mapMutations } from 'vuex'
import { mdiCog, mdiContentCopy } from '@mdi/js'
import ClickHelper from '@/components/basic/ClickHelper'
import DataUtil from '@/utils/DataUtil'
import ImgUtil from '@/utils/ImgUtil'
import RcDialog from '@/components/basic/RcDialog'
import RcMenu from '@/components/basic/RcMenu'
import copy from 'copy-to-clipboard'

export default {
  name: 'LinkList',
  components: { RcMenu, RcDialog, ClickHelper },
  props: {
    id: {
      type: Number,
      default: undefined,
    },
    spotId: {
      type: Number,
      default: undefined,
    },
    anglerId: {
      type: Number,
      default: undefined,
    },
    name: {
      type: String,
      default: '',
    },
    names: {
      type: Object,
      default: () => ({}),
    },
    mode: {
      type: String,
      default: 'itemV2',
    },
    spotMode: {
      type: String,
      default: 'normal',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Boolean,
      default: false,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiContentCopy,
      mdiCog,
      showConfigDialog: false,
    }
  },
  computed: {
    title() {
      return DataUtil.toItemTitle({ name: this.currLocaleName, id: this.id })
    },
    links() {
      const fnName = this.mode + 'Fn'
      return Object.values(DataUtil.LINKS)
        .filter(it => it[fnName])
        .map(link => {
          return {
            ...link,
            url: link[fnName]({
              anglerId: this.anglerId,
              id: DataUtil.toItemId(this.id),
              name: this.name,
              mode: this.spotMode,
              spotId: this.spotId,
            }),
          }
        })
    },
    defaultLinkIndex() {
      return this.links.findIndex(it => it.id === this.defaultLinkOf(this.mode))
    },
    currLocaleName() {
      return this.names[SystemInfo.dataLocale] || this.names.en || this.name
    },
    nameList() {
      if (this.names == null || Object.keys(this.names).length === 0) {
        return []
      } else {
        const cnFlag = ImgUtil.getImgUrl('cn.svg', ImgUtil.CATEGORY.LANG)
        const usFlag = ImgUtil.getImgUrl('us.svg', ImgUtil.CATEGORY.LANG)
        const jpFlag = ImgUtil.getImgUrl('jp.svg', ImgUtil.CATEGORY.LANG)
        return [
          { locale: 'chs', name: this.names.chs, icon: cnFlag },
          { locale: 'en', name: this.names.en, icon: usFlag },
          { locale: 'ja', name: this.names.ja, icon: jpFlag },
        ].filter(it => it.name)
      }
    },
    ...mapGetters(['getItemName', 'defaultLinkOf']),
  },
  methods: {
    copyItemId() {
      copy(DataUtil.toItemId(this.id))
    },
    onSettingBtnClick() {
      this.showConfigDialog = true
      this.emitClick()
    },
    emitClick(inner) {
      this.$emit('click', !!inner)
    },
    goToPage(link) {
      this.emitClick(link.inner)
      if (link.inner) {
        if (
          (link.url.query.spotId ?? -1) !== (this.$route.query.spotId ?? -1) ||
          (link.url.query.fishId ?? -1) !== (this.$route.query.fishId ?? -1)
        ) {
          this.$router.push(link.url)
        }
      } else {
        window.open(link.url)
      }
    },
    setDefaultLinkByIndex(index) {
      this.setLinkDefault({ mode: this.mode, id: this.links[index].id })
      this.showConfigDialog = false
    },
    goToDefaultPage() {
      this.goToPage(this.links.find(it => it.id === this.defaultLinkOf(this.mode)))
    },
    ...mapMutations(['setLinkDefault']),
  },
}
</script>

<style scoped></style>
