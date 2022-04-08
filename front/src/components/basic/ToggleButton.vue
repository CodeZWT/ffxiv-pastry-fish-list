<template>
  <v-btn
    text
    :icon="icon"
    :x-small="small"
    :title="value ? checkedTitle : uncheckedTitle"
    @click.stop="toggleValue"
  >
    <v-icon :small="small">{{ value ? checkedIcon : uncheckedIcon }}</v-icon>
  </v-btn>
</template>

<script>
import { mapMutations } from 'vuex'
import { mdiCheckboxBlankOutline, mdiCheckboxMarked } from '@mdi/js'

export default {
  name: 'ToggleButton',
  props: {
    icon: {
      type: Boolean,
      default: true,
    },
    featureId: {
      type: String,
      default: undefined,
    },
    value: {
      type: Boolean,
      default: false,
    },
    checkedIcon: {
      type: String,
      default: mdiCheckboxMarked,
    },
    uncheckedIcon: {
      type: String,
      default: mdiCheckboxBlankOutline,
    },
    small: {
      type: Boolean,
      default: false,
    },
    checkedTitle: {
      type: String,
      default: undefined,
    },
    uncheckedTitle: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    toggleValue() {
      if (this.featureId) {
        this.setFeatureViewed(this.featureId)
      }
      this.$emit('input', !this.value)
    },
    ...mapMutations(['setFeatureViewed']),
  },
}
</script>

<style scoped></style>
