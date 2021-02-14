<template>
  <v-dialog :value="show" @input="$emit('input', $event)" max-width="300" persistent>
    <v-card>
      <v-card-title>更新程序下载完成</v-card-title>
      <v-card-text>双击 PastryFishSetup.exe 直接更新</v-card-text>
      <v-card-actions>
        <v-btn @click="$emit('update')" color="primary">
          打开更新程序所在文件夹
        </v-btn>
        <v-btn @click="$emit('skip')">暂不更新</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'UpdateDialog',
  model: {
    prop: 'show',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped></style>
