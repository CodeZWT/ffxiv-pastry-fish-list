<template>
  <v-dialog :value="show" @input="$emit('input', $event)" max-width="300">
    <v-card>
      <v-card-title>鱼糕 当前版本 {{ version }}</v-card-title>
      <v-card-text v-if="updateInfo.version">
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
      </v-card-text>
      <v-card-text v-else>
        检测到更新
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn @click="handleDownloadUpdate" color="primary">下载更新</v-btn>
        <v-btn @click="handleSkipUpdate">忽略更新</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { version } from '../../../package.json'
import rcapiService from '@/service/rcapiService'

export default {
  name: 'UpdateAvailableDialog',
  model: {
    prop: 'show',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
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
        rcapiService.getPatchInfo().then(info => {
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
