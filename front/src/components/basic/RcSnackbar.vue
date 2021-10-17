<script>
import { VSnackbar } from 'vuetify/lib'
import { mapMutations } from 'vuex'
import { v4 as uuid } from 'uuid'

export default {
  name: 'RcSnackbar',
  extends: VSnackbar,
  data() {
    return {
      id: uuid(),
    }
  },
  watch: {
    isActive: {
      handler(newValue) {
        if (this.centered) {
          if (newValue) {
            this.registerAlert(this.id)
          } else {
            this.unregisterAlert(this.id)
          }
        } else {
          if (newValue) {
            this.registerBottomNotification(this.id)
          } else {
            this.unregisterBottomNotification(this.id)
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('screenWindow', [
      'registerAlert',
      'unregisterAlert',
      'registerBottomNotification',
      'unregisterBottomNotification',
    ]),
  },
}
</script>
