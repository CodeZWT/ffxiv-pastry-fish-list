<template>
  <div>
    <div v-for="(timeline, index) in timelines" class="timeline-row" :key="index">
      <timeline-row
        :pointer="pointer"
        :text="timeline.name"
        :tug="timeline.tug"
        :min="timeline.min"
        :max="timeline.max"
        :end="max"
      />
    </div>
  </div>
</template>

<script>
import TimelineRow from './FishTimelineTable/TimelineRow'
export default {
  name: 'FishTimelineTable',
  components: { TimelineRow },
  props: ['pointer', 'timelines', 'max'],
}
</script>

<style lang="sass" scoped>
.timeline-row
  margin: 4px 8px
</style>
