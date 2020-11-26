<template>
  <div class="d-flex flex-row align-center">
    <div class="d-flex flex-column">
      <div class="d-flex align-center">
        <div
          class="text-subtitle-1 text-truncate"
          :title="firstLocation.fishingSpotName + '#' + firstLocation.fishingSpotId"
        >
          {{ firstLocation.fishingSpotName }}
        </div>
        <v-btn small icon @click.stop="$emit('click')">
          <v-icon small>
            mdi-map
          </v-icon>
        </v-btn>
        <v-btn
          small
          icon
          :title="$t('list.item.linkHint')"
          @click.stop="
            goToFishingSpotAngelPage(firstLocation.fishingSpot.anglerLocationId)
          "
        >
          <v-icon small>mdi-link-variant</v-icon>
        </v-btn>
      </div>
      <div class="d-flex align-center">
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
  methods: {
    goToFishingSpotAngelPage(anglerLocationId) {
      window.open(`https://cn.ff14angler.com/?spot=${anglerLocationId}`)
    },
  },
}
</script>

<style scoped></style>
