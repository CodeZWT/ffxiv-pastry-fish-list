<script>
export default {
  name: 'ClickThroughMixin',
  methods: {
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
    setClickThrough(through) {
      // console.log('set click through in window', through)
      this.sendElectronEvent('setClickThrough', through)
    },
  },
}
</script>
