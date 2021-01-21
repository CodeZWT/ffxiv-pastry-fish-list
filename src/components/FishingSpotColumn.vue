<template>
  <div class="d-flex flex-row align-center">
    <div :class="`d-flex ${direction}`">
      <div class="d-flex align-center flex-wrap">
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
                `text-subtitle-1 ${
                  hover ? 'primary--text text-decoration-underline' : ''
                }`
              "
            >
              {{ firstLocation.fishingSpotName }}
            </div>
          </v-hover>
        </link-list>
        <!--          <div-->
        <!--            class="d-flex align-center"-->
        <!--            :title="firstLocation.fishingSpotName + '#' + firstLocation.fishingSpotId"-->
        <!--            @click.stop="goToWikiPage(firstLocation.fishingSpotId, type)"-->
        <!--          >-->
        <!--            <span class="text-subtitle-1 text-truncate">-->
        <!--              {{ firstLocation.fishingSpotName }}-->
        <!--            </span>-->
        <!--          </div>-->
      </div>
      <div v-if="showZone" :class="`d-flex align-center ${small ? 'ml-1' : ''}`">
        <div class="text-subtitle-2 text-truncate">
          {{ firstLocation.zone }}
        </div>
        <div v-if="multiple && !small">
          <v-menu v-model="showSpotMenu" offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-btn small icon v-bind="attrs" v-on="on" @click.stop="">
                <v-icon small>mdi-view-list</v-icon>
              </v-btn>
            </template>
            <v-simple-table fixed-header color="secondary">
              <template v-slot:default>
                <tbody>
                  <tr v-for="(spot, index) in fishingSpots" :key="index">
                    <td>{{ spot.zone }}</td>
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
                              `text-subtitle-1 ${
                                hover ? 'text-decoration-underline' : ''
                              }`
                            "
                          >
                            {{ spot.fishingSpotName }}
                          </div>
                        </v-hover>
                      </link-list>
                    </td>
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
      return this.small ? 'flex-row' : 'flex-column'
    },
    showZone() {
      return this.firstLocation.zone !== this.firstLocation.fishingSpotName || !this.small
    },
  },
  methods: {
    goToFishingSpotAngelPage: DataUtil.goToFishingSpotAngelPage,
  },
}
</script>

<style scoped></style>
