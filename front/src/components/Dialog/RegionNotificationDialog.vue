<template>
  <v-dialog
    :value="settings.showSiteRegionDialog"
    @input="setShow($event)"
    persistent
    max-width="400px"
  >
    <v-card>
      <v-card-title>
        欢迎来到鱼糕
      </v-card-title>
      <v-card-text>
        <div>当前访问的为国际服网站，多语言支持，数据统计文件访问优化正在建设中。</div>
        <div>若想访问国内站点请点击以下链接：</div>
        <a href="https://ricecake.traveleorzea.com" target="_blank">
          https://ricecake.traveleorzea.com
        </a>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="setShow(false)" block text color="primary">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'GlobalNotificationDialog',
  components: {},
  model: {
    prop: 'show',
    event: 'input',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('localSetting', ['settings']),
  },
  methods: {
    ...mapMutations('localSetting', ['setSetting']),
    setShow(show) {
      this.setSetting({ key: 'showSiteRegionDialog', value: show })
    },
  },
}
</script>

<style scoped></style>
