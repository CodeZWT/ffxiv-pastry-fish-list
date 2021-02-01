<template>
  <click-helper @click.stop="toggleValue">
    <v-btn icon text :small="small" :title="value ? checkedTitle : uncheckedTitle">
      <v-icon :small="small">{{ value ? checkedIcon : uncheckedIcon }}</v-icon>
    </v-btn>
  </click-helper>
</template>

<script>
import ClickHelper from '@/components/basic/ClickHelper'

export default {
  name: 'ToggleButton',
  components: { ClickHelper },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    checkedIcon: {
      type: String,
      default: 'mdi-checkbox-marked',
    },
    uncheckedIcon: {
      type: String,
      default: 'mdi-checkbox-blank-outline',
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
      this.$emit('input', !this.value)
    },
  },
}
</script>

<style scoped></style>
