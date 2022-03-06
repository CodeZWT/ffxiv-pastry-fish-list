<template>
  <rc-dialog :value="show" @input="$emit('input', $event)" max-width="500" scrollable>
    <v-card>
      <v-card-title>鱼糕更新</v-card-title>
      <v-card-subtitle>
        更新时间：{{ new Date(releaseInfo.created_at).toLocaleString() }}
      </v-card-subtitle>
      <v-card-text>
        <!--        <v-alert outlined type="warning" border="left">-->
        <!--          若自动更新失败请尝试手动下载-->
        <!--        </v-alert>-->
        <div class="markdown-body" v-html="downloadInfo"></div>
      </v-card-text>

      <v-card-actions class="d-flex justify-center">
        <!--        <v-btn @click="handleDownloadUpdate" color="primary">自动更新</v-btn>-->
        <v-btn @click="handleGoToDownloadPage" color="info">手动下载更新</v-btn>
        <v-btn @click="handleSkipUpdate">忽略更新</v-btn>
      </v-card-actions>
    </v-card>
  </rc-dialog>
</template>

<script>
import * as MarkdownIt from 'markdown-it'
import { version } from '../../../package.json'
import RcDialog from '@/components/basic/RcDialog'

export default {
  name: 'UpdateAvailableDialog',
  components: { RcDialog },
  model: {
    prop: 'show',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    releaseInfo: {
      type: Object,
      default: () => ({}),
    },
    // hash: {
    //   type: String,
    //   default: undefined,
    // },
  },
  data() {
    return {
      version: version,
      md: new MarkdownIt(),
      downloadInfo: '',
    }
  },
  watch: {
    releaseInfo(releaseInfo) {
      if (releaseInfo) {
        this.downloadInfo = this.md.render(releaseInfo.body)
      }
    },
    show(show) {
      if (show) {
        // rcapiService.getPatchInfo(this.hash).then(info => {
        //   this.updateInfo = JSON.parse(info.content)
        // })
      }
    },
  },
  methods: {
    handleSkipUpdate() {
      this.sendElectronEvent('skipUpdate')
      this.$emit('input', false)
    },
    handleGoToDownloadPage() {
      window.open('https://ricecake302.coding.net/s/b9ae2dd4-64e2-4412-acdd-d40ab55f85c3')
    },
    handleDownloadUpdate() {
      this.sendElectronEvent('downloadUpdate')
      this.$emit('input', false)
    },
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
  },
}
</script>

<style scoped>
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
</style>
