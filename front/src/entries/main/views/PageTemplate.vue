<template>
  <div
    :class="{
      'detail-wrapper': true,
      'detail-wrapper--web': !isElectron,
      'detail-wrapper--electron': isElectron,
    }"
  >
    <slot />
    <v-spacer />
    <rc-footer />
  </div>
</template>

<script>
import EnvMixin from '@/components/basic/EnvMixin'
import RcFooter from '@/components/RcFooter'

export default {
  name: 'PageTemplate',
  components: { RcFooter },
  mixins: [EnvMixin],
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.detail-wrapper
  width: 100%
  overflow-scrolling: auto
  overflow-x: hidden
  overflow-y: auto
  display: flex
  flex-direction: column

  &--web
    height: 100%
    min-height: calc(100vh - #{ $wrapper-web })
    max-height: calc(100vh - #{ $wrapper-web })

  &--electron
    min-height: calc(100% - #{ $wrapper-desktop })
    max-height: calc(100% - #{ $wrapper-desktop })
</style>
