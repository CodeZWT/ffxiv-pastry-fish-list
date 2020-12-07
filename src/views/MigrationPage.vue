<template>
  <div class="fill-height">
    <v-overlay :value="migrating" z-index="9999">
      <v-progress-circular :size="70" :width="7" indeterminate></v-progress-circular>
      <div class="subtitle-1 mt-2">数据迁移中</div>
    </v-overlay>
    <v-card v-if="!migrating" class="fill-height">
      <v-card-text class="fill-height d-flex align-center text-h6 justify-center">
        <div v-if="migrateSuccess">
          数据迁移成功！即将跳转至时钟首页。
        </div>
        <div v-else>
          数据迁移失败，请尝试手动从旧站导出，并导入新站，以完成迁移。或直接联系：群：1153646847
          红豆年糕@海猫茶屋
        </div>
      </v-card-text>
    </v-card>
    <iframe
      v-show="false"
      src="https://ricecake404.gitee.io/ff14-list-test/migration.html"
      id="migration-src"
    ></iframe>
  </div>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import { mapMutations } from 'vuex'

export default {
  name: 'MigrationPage.vue',
  data: () => ({ migrating: true, migrateSuccess: undefined }),
  mounted() {
    window.addEventListener('message', this.receiveUserData, false)
    const iFrame = document.getElementById('migration-src')
    iFrame.onload = function() {
      iFrame.contentWindow.postMessage('startMigration', 'https://ricecake404.gitee.io')
    }
  },
  methods: {
    importData(dataStr) {
      try {
        const data = JSON.parse(dataStr)
        if (DataUtil.validateImportData(data, DataUtil.USER_DEFAULT_DATA)) {
          this.setUserData(data)
          this.migrating = false
          this.migrateSuccess = true
          setTimeout(() => {
            this.$router.push({ name: 'ListPage' })
          }, 3000)
        } else {
          this.migrateSuccess = false
        }
      } catch (e) {
        console.error('import error', e)
        this.migrateSuccess = false
      }
    },
    receiveUserData(event) {
      if (event?.data?.type === 'migration-data') {
        console.log('receiveUserData', event?.data)
        this.importData(event?.data?.data)
      }
    },
    showInfo(text, color) {
      this.showSnackbar({
        text,
        color,
      })
    },
    ...mapMutations(['setUserData', 'showSnackbar']),
  },
}
</script>

<style scoped></style>
