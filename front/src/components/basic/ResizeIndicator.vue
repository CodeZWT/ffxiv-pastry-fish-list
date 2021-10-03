<template>
  <div class="resize-indicator" />
</template>

<script>
export default {
  name: 'ResizeIndicator',
}
</script>

<style lang="sass" scoped>
.resize-indicator
  width: 0
  height: 0
  position: absolute
  right: 0
  bottom: 0
  border-bottom: 8px solid grey
  border-left: 8px solid transparent
</style>
