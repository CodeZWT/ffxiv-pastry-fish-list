<template>
  <v-badge :color="!id || viewed ? 'transparent' : 'error'" overlap dot>
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
