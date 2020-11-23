<template>
  <div class="d-flex flex-row align-center">
    <div class="d-flex flex-column">
      <div class="d-flex align-center">
        <v-btn small text class="pl-1 pr-2">
          <div
            class="text-subtitle-1 text-truncate"
            :title="firstLocation.fishingSpot + '#' + firstLocation.fishingSpotId"
          >
            {{ firstLocation.fishingSpot }}
          </div>
          <v-icon small right>
            mdi-map
          </v-icon>
        </v-btn>
      </div>
      <div class="d-flex align-center px-1">
        <div class="text-subtitle-2 text-truncate">
          {{ firstLocation.zone }}
        </div>
        <div v-if="multiple">
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
                    <td>{{ spot.fishingSpot }}</td>
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
export default {
  name: 'FishingSpotColumn',
  props: {
    fishingSpots: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    firstLocation() {
      return this.fishingSpots[0]
    },
    multiple() {
      return this.fishingSpots.length > 1
    },
  },
}
</script>

<style scoped></style>
