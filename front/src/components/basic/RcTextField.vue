<script>
import { VTextField } from 'vuetify/lib'
import { mapState } from 'vuex'
import { sendElectronEvent } from '@/utils/electronHelper'

export default {
  name: 'RcTextField',
  extends: VTextField,
  computed: {
    ...mapState(['window']),
  },
  watch: {
    isFocused: {
      handler(newValue) {
        if (this.window === 'screen') {
          sendElectronEvent('setFocused', newValue)
        }
      },
      immediate: true,
    },
  },
}
</script>
