<script>
import { VAutocomplete } from 'vuetify/lib'
import { mapState } from 'vuex'
import { sendElectronEvent } from '@/utils/electronHelper'
import { v4 as uuid } from 'uuid'

let prevFocus = undefined

export default {
  name: 'RcAutocomplete',
  extends: VAutocomplete,
  data() {
    return {
      focusId: uuid(),
    }
  },
  computed: {
    ...mapState(['window']),
  },
  watch: {
    isFocused: {
      handler(newValue) {
        if (this.window === 'screen') {
          if (newValue) {
            sendElectronEvent('setFocused', newValue)
            prevFocus = this.focusId
          } else {
            if (prevFocus === this.focusId) {
              sendElectronEvent('setFocused', newValue)
            } else {
              // console.debug('setFocused cancelled')
            }
          }
        }
      },
      immediate: true,
    },
  },
}
</script>
