<template>
  <v-btn icon @click.stop="toggleValue">
    <v-icon>{{ value ? checkedIcon : uncheckedIcon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'ToggleButton',
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
  },
  methods: {
    toggleValue() {
      this.$emit('input', !this.value)
    },
  },
}
</script>

<style scoped></style>
