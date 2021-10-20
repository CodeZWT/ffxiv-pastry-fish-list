<script>
import { sendElectronEvent } from '@/utils/electronHelper'

export default {
  name: 'ReaderTimerMixin',
  mounted() {
    setTimeout(() => sendElectronEvent('getFishingData'), 2000)
  },
}
</script>
