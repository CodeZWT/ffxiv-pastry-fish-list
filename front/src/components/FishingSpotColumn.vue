<template>
  <div :class="`d-flex flex-column ${direction} mr-2`">
    <link-list
      :id="firstLocation.fishingSpotId"
      :angler-id="firstLocation.fishingSpot.anglerLocationId"
      :name="firstLocation.fishingSpotName"
      mode="spot"
      :spot-mode="type"
    >
      <v-hover v-slot="{ hover }">
        <div
          :class="
            `text-subtitle-1 ${hover ? 'info--text text-decoration-underline' : ''}`
          "
        >
          {{ firstLocation.fishingSpotName }}
        </div>
      </v-hover>
    </link-list>
    <div v-if="showZone" :class="`d-flex align-center ${small ? 'ml-1' : ''}`">
      <div class="text-subtitle-2 text-truncate">
        {{ firstLocation.zone }}
      </div>
      <div v-if="multiple && !small">
        <v-menu v-model="showSpotMenu" offset-x>
          <template v-slot:activator="{ on, attrs }">
            <v-btn small icon text v-bind="attrs" v-on="on" @click.stop="">
              <v-icon small>{{ mdiViewList }}</v-icon>
            </v-btn>
          </template>
          <v-simple-table fixed-header color="secondary">
            <template v-slot:default>
              <tbody>
                <tr v-for="(spot, index) in fishingSpots" :key="index">
                  <td>
                    <link-list
                      :id="spot.fishingSpotId"
                      :angler-id="spot.fishingSpot.anglerLocationId"
                      :name="spot.fishingSpotName"
                      mode="spot"
                      :spot-mode="type"
                      @click="showSpotMenu = false"
                    >
                      <v-hover v-slot="{ hover }">
                        <div
                          :class="
                            `text-subtitle-1 ${hover ? 'text-decoration-underline' : ''}`
                          "
                        >
                          {{ spot.fishingSpotName }}
                        </div>
                      </v-hover>
                    </link-list>
                  </td>
                  <td>{{ spot.zone }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { mdiViewList } from '@mdi/js'
import LinkList from '@/components/basic/LinkList'

export default {
  name: 'FishingSpotColumn',
  components: { LinkList },
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
  data() {
    return {
      mdiViewList,
      showSpotMenu: false,
    }
  },
  computed: {
    firstLocation() {
      return this.fishingSpots[0]
    },
    multiple() {
      return this.fishingSpots.length > 1
    },
    direction() {
      return this.small ? 'align-end' : 'align-start'
    },
    showZone() {
      return this.firstLocation.zone !== this.firstLocation.fishingSpotName || !this.small
    },
  },
}
</script>

<style scoped></style>
