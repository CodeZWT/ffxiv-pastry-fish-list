<script>
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'

export default {
  name: 'EnvMixin',
  computed: {
    isElectron() {
      return DevelopmentModeUtil.isElectron()
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
  },
}
</script>

<style scoped></style>
