<template>
  <v-badge :color="viewed ? 'transparent' : 'primary'" overlap dot>
    <slot />
  </v-badge>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NewFeatureMark',
  props: {
    id: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    viewed() {
      return this.viewedFeatures.includes(this.id)
    },
    ...mapState(['viewedFeatures']),
  },
}
</script>

<style scoped></style>
