<script>
import { RC_ACCESS_TOKEN_KEY } from '@/service/rcapiService'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'

export default {
  name: 'EnvMixin',
  computed: {
    isElectron() {
      return DevelopmentModeUtil.isElectron()
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    isTest() {
      return DevelopmentModeUtil.isTest()
    },
    isLogin() {
      return !!LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)
    },
  },
  methods: {
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
  },
}
</script>

<style scoped></style>
