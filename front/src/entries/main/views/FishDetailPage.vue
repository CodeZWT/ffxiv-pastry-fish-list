<template>
  <fish-detail :fish="fish" :now="now" in-pane />
</template>

<script>
import FishDetail from '@/components/FishDetail'

export default {
  name: 'FishDetailPage',
  components: { FishDetail },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
    now: {
      type: Number,
      default: Date.now(),
    },
  },
}
</script>

<style scoped></style>
