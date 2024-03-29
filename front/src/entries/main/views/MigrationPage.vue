<template>
  <div class="fill-height">
    <v-overlay :value="migrationStep === 'migrating'" z-index="9999">
      <v-progress-circular :size="70" :width="7" indeterminate></v-progress-circular>
      <div class="subtitle-1 mt-2">数据迁移中</div>
    </v-overlay>
    <v-card v-if="migrationStep === 'finished'" class="fill-height">
      <v-card-text class="fill-height d-flex align-center text-h6 justify-center">
        <div v-if="migrateSuccess" class="d-flex align-center">
          <div>
            <v-icon color="primary" x-large class="mr-1">{{ mdiDatabaseCheck }}</v-icon>
            数据迁移成功！<br />
            桌面及手机网页版用户请更新收藏夹中的站点地址： <br />
            <div>https://ricecake.traveleorzea.com</div>
            <br />
            使用ACT ngld悬浮窗的用户无需更新地址（自动更新）。<br />
            即将跳转至鱼糕首页，请稍后...
          </div>
        </div>
        <div v-else class="d-flex align-center">
          <v-icon color="error" x-large class="mr-1">{{ mdiDatabaseRemove }}</v-icon>
          <div>
            数据迁移失败，请尝试手动从旧站导出，并导入新站，以完成迁移。<br />
            或直接联系：<br />
            群：1153646847 红豆年糕@海猫茶屋
          </div>
        </div>
      </v-card-text>
    </v-card>
    <rc-dialog :value="showDialog && !loading" persistent max-width="290">
      <v-card>
        <v-card-title> 请选择数据来源 </v-card-title>
        <v-card-text v-if="hasLocalData" class="subtitle-1 error--text">
          已进行过数据迁移，若再次迁移，新站数据将被旧站覆盖！请谨慎选择！
        </v-card-text>
        <v-card-text v-if="hasBothData" class="subtitle-1">
          同时检测到
          <span style="font-weight: bold">正式版</span>
          和
          <span style="font-weight: bold">测试版</span>
          的数据，请选择导入的数据来源。
        </v-card-text>
        <v-card-text>
          <div class="d-flex flex-column">
            <div v-if="hasLocalData" class="my-2" style="width: 100%">
              <v-btn @click="toIndexPage" large block> 跳过数据迁移 直接前往首页 </v-btn>
            </div>
            <template v-if="hasBothData">
              <div class="my-2" style="width: 100%">
                <v-btn color="primary" @click="migrateFromProd" large block>
                  从正式版导入
                </v-btn>
              </div>
              <div class="my-2" style="width: 100%">
                <v-btn color="info" @click="migrateFromTest" large block>
                  从测试版导入
                </v-btn>
              </div>
            </template>
            <div v-if="!hasBothData" class="my-2" style="width: 100%">
              <v-btn color="error" @click="migrate" large block> 导入数据 </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </rc-dialog>
    <iframe v-show="false" :src="migrationSrcUrl" id="migration-src"></iframe>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { mdiDatabaseCheck, mdiDatabaseRemove } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import RcDialog from '@/components/basic/RcDialog'

export default {
  name: 'MigrationPage.vue',
  components: { RcDialog },
  data: () => ({
    mdiDatabaseCheck,
    mdiDatabaseRemove,
    migrationStep: 'waiting',
    migrateSuccess: undefined,
    hasBothData: false,
    showDialog: false,
    dataToBeMigrated: undefined,
    data: undefined,
    testData: undefined,
    migrationSrcUrl: undefined,
  }),
  computed: {
    hasLocalData() {
      return window.localStorage.userData != null
    },
    ...mapState(['loading']),
  },
  created() {
    const migrationPage = 'migration.html'
    switch (this.$route.query.source) {
      case 'old':
        this.migrationSrcUrl = `https://ricecake404.gitee.io/ff14-list/${migrationPage}`
        break
      case 'main':
        this.migrationSrcUrl = `https://fish.ricecake302.com/${migrationPage}`
        break
      case 'sub':
        this.migrationSrcUrl = `https://ricecake500.gitee.io/ffxiv-pastry-fish-list/${migrationPage}`
        break
      default:
    }
  },
  mounted() {
    window.addEventListener('message', this.receiveUserData, false)
    const iFrame = document.getElementById('migration-src')
    iFrame.onload = function() {
      iFrame.contentWindow.postMessage('startMigration', '*')
    }
  },
  methods: {
    importData(dataStr) {
      this.migrationStep = 'migrating'
      if (dataStr == null) {
        console.debug('no data to migrate')
        this.endMigration()
        return
      }
      try {
        const data = JSON.parse(dataStr)
        if (DataUtil.validateImportData(data, DataUtil.USER_DEFAULT_DATA)) {
          this.setUserData(data)
          this.endMigration()
        } else {
          this.migrateSuccess = false
        }
      } catch (e) {
        console.error('import error', e)
        this.migrateSuccess = false
      }
    },
    endMigration() {
      this.migrationStep = 'finished'
      this.migrateSuccess = true
      setTimeout(() => {
        this.toIndexPage()
      }, 3000)
    },
    toIndexPage() {
      const url = window.location.href
      window.location.href = url.substring(0, url.indexOf('/#/'))
    },
    receiveUserData(event) {
      console.debug(event)
      if (event?.data?.type === 'migration-data') {
        console.debug('receiveUserData', event?.data)
        this.data = event?.data?.data
        this.testData = event?.data?.testData
        this.hasBothData = this.data && this.testData
        const hasNoData = !this.data && !this.testData
        if (this.data && !this.testData) {
          this.dataToBeMigrated = this.data
        } else if (!this.data && this.testData) {
          this.dataToBeMigrated = this.testData
        }
        this.showDialog = (this.hasLocalData && !hasNoData) || this.hasBothData
        if (!this.showDialog) {
          this.migrate()
        }
      }
    },
    migrateFromProd() {
      this.dataToBeMigrated = this.data
      this.migrate()
    },
    migrateFromTest() {
      this.dataToBeMigrated = this.testData
      this.migrate()
    },
    migrate() {
      this.showDialog = false
      this.importData(this.dataToBeMigrated)
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
