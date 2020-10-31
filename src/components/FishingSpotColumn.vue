<template>
  <div class="d-flex flex-row align-center">
    <div class="d-flex flex-column">
      <div class="text-subtitle-1 text-truncate" :title="firstLocation.fishingSpot + '#' + firstLocation.fishingSpotId">
        {{ firstLocation.fishingSpot }}
      </div>
      <div class="text-subtitle-2 text-truncate">
        {{ firstLocation.zone }}
      </div>
    </div>
    <div v-if="multiple">
      <v-menu open-on-hover offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-view-list</v-icon>
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