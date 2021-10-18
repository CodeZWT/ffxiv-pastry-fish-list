<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <rc-text-field
        v-model="value"
        :label="label"
        prepend-icon="mdi-timer"
        readonly
        v-bind="attrs"
        v-on="on"
        solo
      ></rc-text-field>
    </template>
    <v-time-picker :value="value" @input="handleInput" format="24hr"></v-time-picker>
  </v-menu>
</template>

<script>
import RcTextField from '@/components/basic/RcTextField'
export default {
  name: 'TimeInput',
  components: { RcTextField },
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      menu: false,
    }
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value)
      this.menu = false
    },
  },
}
</script>

<style scoped></style>
