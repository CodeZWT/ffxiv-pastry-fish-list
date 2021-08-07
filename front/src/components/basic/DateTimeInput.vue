<template>
  <div class="d-flex align-center">
    <date-input v-model="dateStr" :label="dateLabel" />
    <time-input v-model="timeStr" :label="timeLabel" />
  </div>
</template>

<script>
import DateInput from '@/components/basic/DateInput'
import TimeInput from '@/components/basic/TimeInput'

export default {
  name: 'DateTimeInput',
  components: { TimeInput, DateInput },
  props: {
    value: {
      type: Number,
      default: undefined,
    },
    dateLabel: {
      type: String,
      default: '',
    },
    timeLabel: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dateStr: '',
      timeStr: '00:00',
    }
  },
  watch: {
    dateStr(dateStr) {
      this.$emit('input', new Date(dateStr + ' ' + this.timeStr + ':00').getTime())
    },
    timeStr(timeStr) {
      this.$emit('input', new Date(this.dateStr + ' ' + timeStr + ':00').getTime())
    },
  },
}
</script>

<style scoped></style>
