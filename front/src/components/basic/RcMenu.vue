<script>
import { VMenu } from 'vuetify/lib'
import { mapMutations, mapState } from 'vuex'
import { v4 as uuid } from 'uuid'

export default {
  name: 'RcMenu',
  extends: VMenu,
  data() {
    return {
      id: uuid(),
    }
  },
  computed: {
    ...mapState(['window']),
  },
  watch: {
    isActive: {
      handler(newValue) {
        if (this.window === 'screen') {
          if (newValue) {
            setTimeout(() => {
              const rect = this.$refs.content.getBoundingClientRect()
              this.registerMenu({
                id: this.id,
                x: rect.x,
                y: rect.y,
                w: rect.width,
                h: rect.height,
              })
            }, 200)
          } else {
            this.unregisterMenu(this.id)
          }
        }
      },
      immediate: false,
    },
  },
  methods: {
    ...mapMutations('screenWindow', ['registerMenu', 'unregisterMenu']),
  },
}
</script>
