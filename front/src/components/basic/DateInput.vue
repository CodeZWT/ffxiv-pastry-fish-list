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
        :value="value"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        solo
      ></rc-text-field>
    </template>
    <v-date-picker
      :value="value"
      @input="handleInput"
      :first-day-of-week="0"
      locale="zh-cn"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { DateTime } from 'luxon'
import RcTextField from '@/components/basic/RcTextField'

export default {
  name: 'DateInput',
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
  computed: {
    date: {
      get() {
        return this.value ? this.milli2DateStr(this.value) : ''
      },
      set(dateStr) {
        this.$emit('input', new Date(dateStr).getTime())
      },
    },
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value)
      this.menu = false
    },
    milli2DateStr(milli) {
      return DateTime.fromMillis(milli).toFormat('yyyy-MM-dd')
    },
  },
}
</script>

<style scoped></style>
