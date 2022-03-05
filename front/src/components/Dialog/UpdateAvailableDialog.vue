<template>
  <rc-dialog :value="show" @input="$emit('input', $event)" max-width="500">
    <v-card>
      <v-card-title>鱼糕 当前版本 {{ version }}</v-card-title>
      <v-card-text>
        <v-alert outlined type="warning" border="left">
          自动更新有每日总下载量的限制，下载人数过多后会下载失败，若下载失败请尝试手动下载。
        </v-alert>
        <template v-if="updateInfo.version">
          <div class="text-h6">最新版本 {{ updateInfo.version }}</div>
          <div class="text-subtitle-1">更新时间: {{ updateInfo.updateTime }}</div>
          <div class="text-subtitle-1">更新内容:</div>

          <div v-for="note in updateInfo.notes" :key="note.title">
            <div class="text-h5 text-center my-1">{{ note.title }}</div>
            <ul>
              <li v-for="item in note.items" :key="item.value">
                {{ item.value }}
                <ul v-if="item.type === 'list'">
                  <li v-for="subItem in item.items" :key="subItem.value">
                    {{ subItem.value }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </template>
        <template v-else>检测到更新</template>
      </v-card-text>

      <v-card-actions class="d-flex justify-center">
        <v-btn @click="handleGoToDownloadPage" color="info">手动下载更新</v-btn>
        <v-btn @click="handleDownloadUpdate" color="primary">下载更新</v-btn>
        <v-btn @click="handleSkipUpdate">忽略更新</v-btn>
      </v-card-actions>
    </v-card>
  </rc-dialog>
</template>

<script>
import { version } from '../../../package.json'
import RcDialog from '@/components/basic/RcDialog'
import rcapiService from '@/service/rcapiService'

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
    hash: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      version: version,
      updateInfo: {},
    }
  },
  watch: {
    show(show) {
      if (show) {
        rcapiService.getPatchInfo(this.hash).then(info => {
          this.updateInfo = JSON.parse(info.content)
        })
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

<style scoped></style>
