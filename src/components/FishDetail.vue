<template>
  <div>
    <template v-if="fish">
      <div style="position:relative;" class="py-4 px-6">
        <fish-list-expanded-header :value="fish" />
      </div>
      <fish-list-item-content
        :value="fish"
        :fish-time-part="fishTimePart"
        :fish-weather-change-part="fishWeatherChangePart"
        :predators="predators"
      ></fish-list-item-content>
    </template>
    <template v-else>
      empty
    </template>
  </div>
</template>

<script>
import FishListItemContent from '@/components/FishListItemContent'
import FishListExpandedHeader from '@/components/FishListExpandedHeader'

export default {
  name: 'FishDetail',
  components: { FishListExpandedHeader, FishListItemContent },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    fishTimePart() {
      return this.fish?.parts?.fishTimePart ?? {}
    },
    fishWeatherChangePart() {
      return this.fish?.parts?.fishWeatherChangePart ?? {}
    },
    predators() {
      return this.fish?.parts?.predators ?? []
    },
  },
}
</script>

<style scoped></style>