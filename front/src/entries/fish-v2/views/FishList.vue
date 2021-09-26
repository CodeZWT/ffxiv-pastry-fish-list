<template>
  <div>{{ test }}</div>
</template>

<script>
import { windowOf } from '@/entries/fish-v2/services/FishCalculator.ts'

export default {
  name: 'FishList',
  data() {
    return {
      test: '',
    }
  },
  created() {
    this.test = windowOf({
      etHourStart: 0,
      etHourEnd: 12,
      prevWeathers: [1],
      weathers: [2, 3],
    })
  },
}
</script>

<style scoped></style>
