<template>
  <v-dialog :value="show" @input="$emit('input', $event)" max-width="600">
    <v-card>
      <v-card-title>公告</v-card-title>
      <v-card-text>
        <div class="text-subtitle-1">
          最近本站的访问不是很稳定，建议使用左下角设置中的导出导入功能迁移至备用站点
        </div>
        <div>如果是第一次使用本站，直接跳转即可。</div>
        备用站点：
        <a href="https://ricecake500.gitee.io/ffxiv-pastry-fish-list" target="_blank">
          https://ricecake500.gitee.io/ffxiv-pastry-fish-list
        </a>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Fish302MigrationDialog',
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
