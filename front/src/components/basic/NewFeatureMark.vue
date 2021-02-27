<template>
  <div @click="setFeatureViewed(id)">
    <v-badge :color="!id || viewed ? 'transparent' : 'error'" overlap dot>
      <slot />
    </v-badge>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

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
  methods: {
    ...mapMutations(['setFeatureViewed']),
  },
}
</script>

<style scoped></style>
