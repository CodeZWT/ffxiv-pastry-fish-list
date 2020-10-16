<template>
  <div :class="clazz">
    <slot />
  </div>
</template>

<script>
import copy from 'copy-to-clipboard'
import { mapMutations } from 'vuex'

export default {
  // click helper to trigger click event for vuetify components in ACT
  name: 'ClickHelper',
  props: {
    block: {
      type: Boolean,
      default: false,
    },
    copyText: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    clazz() {
      return { block: this.block }
    },
  },
  mounted() {
    this.$el.addEventListener('click', e => {
      if (this.copyText != null) {
        copy(this.copyText)
        this.showSnackbar({ text: this.$t('importExport.dialog.message.copySuccess'), color: 'success' })
      }
      this.$emit('click', e)
    })
  },
  methods: {
    ...mapMutations(['showSnackbar']),
  },
}
</script>

<style scoped>
.block {
  width: 100%;
}
</style>