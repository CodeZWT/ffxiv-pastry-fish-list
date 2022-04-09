<template>
  <div class="d-flex flex-column align-center" style="background-color: #1e1e1e">
    <v-expansion-panels hover flat tile v-model="lazyExpansionValue">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div style="display: flex; align-items: center; justify-content: center">
            <div v-if="multiple">
              <v-menu v-model="showSpotMenu" offset-x top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon text v-bind="attrs" v-on="on">
                    <v-icon>{{ mdiViewList }}</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(spot, index) in fishingSpots"
                    :key="index"
                    @click.stop="currentSpotIndex = index"
                  >
                    <v-list-item-title class="d-flex align-center">
                      <link-list
                        :id="spot.fishingSpotId"
                        :angler-id="spot.fishingSpot.anglerLocationId"
                        :name="spot.fishingSpotName"
                        mode="spot"
                        :spot-mode="fish.type"
                        @click="listLinkClicked($event)"
                        :disabled="showSpotLink"
                      >
                        <v-hover v-slot="{ hover }">
                          <div
                            :class="
                              `text-subtitle-1 ${
                                hover && !showSpotLink ? 'text-decoration-underline' : ''
                              }`
                            "
                          >
                            {{ spot.fishingSpotName }}
                          </div>
                        </v-hover>
                      </link-list>
                      <v-spacer />
                      <div class="ml-2 subtitle-2">{{ spot.zone }}</div>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="text-subtitle-1" :title="toSpotTitle(currentSpot)">
              <link-list
                :id="currentSpot.fishingSpotId"
                :angler-id="currentSpot.fishingSpot.anglerLocationId"
                :name="currentSpot.fishingSpotName"
                :names="currentSpot.fishingSpotNames"
                mode="spot"
                :spot-mode="fish.type"
                :disabled="showSpotLink"
                @click="listLinkClicked($event)"
              >
                <v-hover v-slot="{ hover }">
                  <div
                    :class="
                      `text-subtitle-1 ${
                        hover && !showSpotLink
                          ? 'info--text text-decoration-underline'
                          : ''
                      }`
                    "
                  >
                    {{ currentSpot.fishingSpotName }}
                  </div>
                </v-hover>
              </link-list>
            </div>
            <div class="text-subtitle-2 ml-2">
              {{ currentSpot.zone }}
            </div>
            <div class="text-subtitle-1 ml-2">
              ({{ currentSpot.fishSpotPositionText }})
            </div>
          </div>
        </v-expansion-panel-header>
      </v-expansion-panel>
    </v-expansion-panels>
    <!--    <div-->
    <!--      v-if="lazyExpansionValue === 0"-->
    <!--      style="width: 100%; height: 512px"-->
    <!--      class="d-flex justify-center mt-4"-->
    <!--    >-->
    <v-row
      v-if="lazyExpansionValue === 0"
      v-resize="onWindowResize"
      :style="`width: 100%; height: 100%; max-width: 512px; max-height: ${mapWidth}px`"
      no-gutters
    >
      <eorzea-simple-map
        ref="simpleMap"
        :id="currentSpot.fishingSpot.mapFileId"
        :size-factor="currentSpot.fishingSpot.size_factor"
        :fishing-spots="fishingSpotsForMap"
        :show-fishing-range-helper="showFishingRangeHelper"
      />
    </v-row>
    <!--    </div>-->
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { mdiContentCopy, mdiViewList } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import LinkList from '@/components/basic/LinkList'

export default {
  name: 'DetailItemMap',
  components: { LinkList, EorzeaSimpleMap },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    showFishingRangeHelper: {
      type: Boolean,
      default: true,
    },
    showSpotLink: {
      type: Boolean,
      default: false,
    },
  },
  data: vm => ({
    mdiViewList,
    mdiContentCopy,
    currentSpotIndex: 0,
    lazyExpansionValue: vm.expanded ? 0 : undefined,
    showSpotMenu: false,
    mapWidth: 512,
  }),
  computed: {
    fishingSpots() {
      return this.fish.fishingSpots
    },
    currentSpot() {
      // { zone, fishingSpot, fishingSpotName, fishingSpotId, fishSpotPositionText }
      return this.fishingSpots[this.currentSpotIndex]
    },
    fishingSpotsForMap() {
      return [{ ...this.currentSpot.fishingSpot, name: this.currentSpot.fishingSpotName }]
    },
    multiple() {
      return this.fishingSpots.length > 1
    },
    ...mapGetters(['getFishingSpot']),
  },
  created() {
    this.onWindowResize()
    this.lazyExpansionValue = this.expanded ? 0 : undefined
  },
  watch: {
    expanded(expanded) {
      this.lazyExpansionValue = expanded ? 0 : undefined
    },
    'fish.id': function() {
      this.lazyExpansionValue = this.expanded ? 0 : undefined
      this.currentSpotIndex = 0
    },
  },
  methods: {
    toSpotTitle: DataUtil.toSpotTitle,
    onWindowResize() {
      console.log('on resize')
      setTimeout(() => {
        this.mapWidth = this.$refs.simpleMap?.containerWidth ?? 512
      }, 1000)
    },
    listLinkClicked(inner) {
      this.showSpotMenu = false
      if (inner) {
        this.$emit('close-dialog')
      }
    },
    getName: DataUtil.getName,
    ...mapMutations(['showSnackbar']),
  },
}
</script>

<style scoped></style>
