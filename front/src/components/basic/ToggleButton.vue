<template>
  <click-helper @click.stop="toggleValue">
    <v-btn icon :small="small">
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
  },
  methods: {
    toggleValue() {
      this.$emit('input', !this.value)
    },
  },
}
</script>

<style scoped></style>
