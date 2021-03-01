<template>
  <v-container
    fluid
    :class="
      `detail-wrapper ${isElectron ? 'detail-wrapper--electron' : 'detail-wrapper--web'}`
    "
  >
    test
  </v-container>
</template>

<script>
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'

export default {
  name: 'AquariumPage',
  data() {
    return {
      isElectron: DevelopmentModeUtil.isElectron(),
    }
  },
  computed: {},
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.detail-wrapper
  width: 100%
  height: 100%
  overflow-scrolling: auto
  overflow-y: scroll
  overflow-x: hidden

  &--web
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

  &--electron
    max-height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding})
</style>
