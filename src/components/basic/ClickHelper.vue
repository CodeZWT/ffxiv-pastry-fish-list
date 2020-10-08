<template>
  <div :class="clazz">
    <slot />
  </div>
</template>

<script>
export default {
  // click helper to trigger click event for vuetify components in ACT
  name: 'ClickHelper',
  props: {
    block: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    clazz() {
      return { block: this.block }
    },
  },
  mounted() {
    this.$el.addEventListener('click', e => {
      console.debug('button click detected')
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