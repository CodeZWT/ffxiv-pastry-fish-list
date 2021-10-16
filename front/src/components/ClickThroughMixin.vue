<script>
import { mapState } from 'vuex'

export default {
  name: 'ClickThroughMixin',
  computed: {
    ...mapState('screenWindow', ['globalClickThrough']),
  },
  methods: {
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
    setClickThrough(through) {
      // console.log('set click through in window', through)
      this.sendElectronEvent('setClickThrough', this.globalClickThrough || through)
    },
  },
}
</script>
