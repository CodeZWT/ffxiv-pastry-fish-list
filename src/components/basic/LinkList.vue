<template>
  <div>
    <v-menu open-on-hover offset-x nudge-right="4" open-delay="300" close-delay="300">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" @click.stop="goToDefaultPage">
          <slot />
        </div>
      </template>
      <v-card>
        <div class="d-flex align-center">
          <v-subheader>{{ title }}</v-subheader>
          <v-spacer />
          <v-btn icon @click="showConfigDialog = true" class="mr-1" title="设置默认跳转">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </div>
        <v-list dense>
          <v-list-item
            v-for="(link, index) in links"
            :key="index"
            @click="goToPage(link)"
          >
            <v-list-item-icon>
              <v-img :src="link.icon" height="24" width="24" />
            </v-list-item-icon>
            <v-list-item-title>
              <div>
                <span>{{ link.title }}</span>
                <v-badge v-show="index === defaultLinkIndex" content="默认" inline />
              </div>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <v-dialog v-model="showConfigDialog" max-width="300">
      <v-card>
        <v-card-title>
          设置默认跳转
        </v-card-title>
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
    </v-dialog>
  </div>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'LinkList',
  props: {
    id: {
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
    mode: {
      type: String,
      default: 'item',
    },
    spotMode: {
      type: String,
      default: 'normal',
    },
  },
  data() {
    return {
      showConfigDialog: false,
    }
  },
  computed: {
    title() {
      return DataUtil.toItemTitle({ name: this.name, id: this.id })
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
              id: this.id,
              name: this.name,
              mode: this.spotMode,
            }),
          }
        })
    },
    defaultLinkIndex() {
      return this.links.findIndex(it => it.id === this.defaultLinkOf(this.mode))
    },
    ...mapGetters(['getItemName', 'defaultLinkOf']),
  },
  methods: {
    goToPage(link) {
      if (link.inner) {
        this.$router.push(link.url)
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
