<script>
import { mapMutations, mapState } from 'vuex'
import { winId2LayoutId } from '@/entries/screen/store/screenWindow'

export default {
  name: 'WindowMixin',
  props: {
    id: String,
  },
  computed: {
    ...mapState('screenWindow', ['layouts']),
    item() {
      return this.layouts[winId2LayoutId(this.id)]
    },
    isMobile() {
      return this.item.isMobile
    },
  },
  methods: {
    ...mapMutations('screenWindow', ['closeWindow']),
    handleCloseWindow() {
      this.closeWindow(this.id)
    },
  },
}
</script>
