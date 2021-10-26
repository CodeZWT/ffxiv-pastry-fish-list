<script>
import { VDialog } from 'vuetify/lib'
import { mapMutations, mapState } from 'vuex'
import { sendElectronEvent } from '@/utils/electronHelper'
import { v4 as uuid } from 'uuid'

export default {
  name: 'RcDialog',
  extends: VDialog,
  props: {
    autofocus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogId: uuid(),
    }
  },
  computed: {
    ...mapState(['window']),
  },
  watch: {
    isActive: {
      handler(isActive) {
        if (this.window === 'screen') {
          if (isActive) {
            this.registerDialog(this.dialogId)
          } else {
            this.unRegisterDialog(this.dialogId)
          }
          if (this.autofocus) {
            sendElectronEvent('setFocused', isActive)
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('screenWindow', ['registerDialog', 'unRegisterDialog']),
  },
}
</script>
