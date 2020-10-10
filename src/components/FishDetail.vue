<template>
  <div>
    <template v-if="fish">
      <div class="py-4 px-6">
        <fish-list-expanded-header :value="fish" />
        <click-helper @click="$emit('close')">
          <v-btn icon elevation="50" style="position: absolute; right: 8px; top: 8px; z-index: 2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </click-helper>
      </div>
      <fish-list-item-content
        ref="detailContent"
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
import ClickHelper from '@/components/basic/ClickHelper'

export default {
  name: 'FishDetail',
  components: { ClickHelper, FishListExpandedHeader, FishListItemContent },
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
  methods: {
    resize() {
      this.$refs.detailContent.resize()
    },
  },
}
</script>

<style scoped></style>