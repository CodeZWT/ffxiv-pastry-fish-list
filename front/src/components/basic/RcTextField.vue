<script>
import { VTextField } from 'vuetify/lib'
import { sendElectronEvent } from '@/utils/electronHelper'

export default {
  name: 'RcTextField',
  extends: VTextField,
  watch: {
    isFocused: {
      handler(newValue) {
        sendElectronEvent('setFocused', newValue)
      },
      immediate: true,
    },
  },
}
</script>
