<template>
  <div :class="clazz">
    <slot />
  </div>
</template>

<script>
import copy from 'copy-to-clipboard'

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
      return { block: this.block, 'clipboard-support': true }
    },
  },
  mounted() {
    this.$el.addEventListener('click', e => {
      if (this.copyText != null) {
        copy(this.copyText)
      }
      this.$emit('click', e)
    })
  },
}
</script>

<style scoped>
.block {
  width: 100%;
}
</style>