<template>
  <v-dialog max-width="600" v-model="show" persistent>
    <v-card>
      <v-card-title>
        检测到当前浏览器为Chrome，时区为西八区（UTC-08:00）
      </v-card-title>
      <v-card-subtitle>
        若确认与所在时区不符，那么这大概率是Chrome浏览器最近出现的问题
      </v-card-subtitle>
      <v-divider />
      <v-card-text class="my-2">
        <div>修复方法：</div>
        <div class="text-subtitle-1 my-2">
          修改系统时区至其他国家并且同为东八区(UTC+08:00)的城市，再改回原来的时区（通常是北京）。
        </div>
        <div>
          若按照以上方法还不能解决问题，建议先换一个浏览器，Windows10自带Edge目前没有问题。
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="d-flex justify-end">
        <v-btn @click="setNotShowDialog" color="error">
          不再显示
        </v-btn>
        <v-btn @click="closeDialog">
          关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'ChromeTimeZoneBugDialog',
  model: {
    prop: 'show',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    setNotShowDialog() {
      this.setNotShowChromeBugDialog()
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('input', false)
    },
    ...mapMutations(['setNotShowChromeBugDialog']),
  },
}
</script>

<style scoped></style>
