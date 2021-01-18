<template>
  <div class="d-flex flex-row align-center">
    <div :class="`d-flex ${direction}`">
      <div class="d-flex align-center flex-wrap">
        <v-hover v-slot="{ hover }" open-delay="200" close-deplay="500">
          <div
            class="d-flex align-center"
            :title="firstLocation.fishingSpotName + '#' + firstLocation.fishingSpotId"
            @click.stop="goToWikiPage(firstLocation.fishingSpotId, type)"
          >
            <span class="text-subtitle-1 text-truncate">
              {{ firstLocation.fishingSpotName }}
            </span>
            <v-icon v-if="hover" small>mdi-arrow-right-circle-outline</v-icon>
          </div>
        </v-hover>
      </div>
      <div v-if="showZone" :class="`d-flex align-center ${small ? 'ml-1' : ''}`">
        <div class="text-subtitle-2 text-truncate">
          {{ firstLocation.zone }}
        </div>
        <div v-if="multiple && !small">
          <v-menu open-on-hover offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-btn small icon v-bind="attrs" v-on="on">
                <v-icon small>mdi-view-list</v-icon>
              </v-btn>
            </template>
            <v-simple-table fixed-header color="secondary">
              <template v-slot:default>
                <tbody>
                  <tr v-for="(spot, index) in fishingSpots" :key="index">
                    <td>{{ spot.zone }}</td>
                    <td>{{ spot.fishingSpotName }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'FishingSpotColumn',
  props: {
    fishingSpots: {
      type: Array,
      default: () => [],
    },
    small: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'normal',
    },
  },
  computed: {
    firstLocation() {
      return this.fishingSpots[0]
    },
    multiple() {
      return this.fishingSpots.length > 1
    },
    direction() {
      return this.small ? 'flex-row' : 'flex-column'
    },
    showZone() {
      return this.firstLocation.zone !== this.firstLocation.fishingSpotName || !this.small
    },
  },
  methods: {
    goToFishingSpotAngelPage: DataUtil.goToFishingSpotAngelPage,
    goToWikiPage(spotId, type) {
      this.$router.push({ name: 'WikiPage', query: { spotId, mode: type } })
    },
  },
}
</script>

<style scoped></style>
