<script>
import { VDialog } from 'vuetify/lib'
import { mapMutations } from 'vuex'
import { v4 as uuid } from 'uuid'

export default {
  name: 'RcDialog',
  extends: VDialog,
  data() {
    return {
      dialogId: uuid(),
    }
  },
  watch: {
    isActive: {
      handler(newValue) {
        if (newValue) {
          this.registerDialog(this.dialogId)
        } else {
          this.unRegisterDialog(this.dialogId)
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
