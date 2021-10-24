<script>
import { VMenu } from 'vuetify/lib'
import { mapMutations } from 'vuex'
import { v4 as uuid } from 'uuid'

export default {
  name: 'RcMenu',
  extends: VMenu,
  data() {
    return {
      id: uuid(),
    }
  },
  watch: {
    isActive: {
      handler(newValue) {
        if (newValue) {
          setTimeout(() => {
            const rect = this.$refs.content.getBoundingClientRect()
            console.log('active', newValue)
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
      },
      immediate: false,
    },
  },
  methods: {
    ...mapMutations('screenWindow', ['registerMenu', 'unregisterMenu']),
  },
}
</script>
