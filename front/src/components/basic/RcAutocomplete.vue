<script>
import { VAutocomplete } from 'vuetify/lib'
import { sendElectronEvent } from '@/utils/electronHelper'

export default {
  name: 'RcAutocomplete',
  extends: VAutocomplete,
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
