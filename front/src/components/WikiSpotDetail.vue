<template>
  <div style="width: 100%">
    <div class="py-1 d-flex inner" style="width: 100%; position: relative">
      <h2 style="width: 100%; text-align: center" :class="`text-h5 ${locale}-font`">
        {{ currentMapInfo.name }}
      </h2>
      <v-btn
        v-if="showClose"
        @click="$emit('close')"
        plain
        icon
        style="position: absolute; right: 0"
      >
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
    </div>
    <v-divider />
    <v-row
      :class="{
        inner: true,
        'spot-detail': true,
        'spot-detail--pc-web': !isMobile && !isElectron,
        'spot-detail--pc-electron': !isMobile && isElectron,
        'spot-detail--mobile-web': isMobile && !isElectron,
        'spot-detail--mobile-electron': isMobile && isElectron,
      }"
      v-if="currentSpotId"
      no-gutters
    >
      <template v-if="mode === 'normal'">
        <v-col cols="12" class="my-1">
          <v-btn block tile color="primary" @click="showAboutChartDialog = true">
            <v-icon>{{ mdiInformation }}</v-icon>
            {{ $t('wikiPage.stats.about.btn') }}
          </v-btn>
        </v-col>
        <v-col cols="12" class="my-1">
          <bait-percentage-chart
            :spot-id="currentSpotId"
            :records="baitCountRecords"
            :fish-dict="lazyTransformedFishDict"
            :updatedTime="baitCountRecordUpdatedTime"
          />
        </v-col>
        <v-col v-if="!isOceanFishingSpot" cols="12" class="my-1">
          <bite-interval-chart
            :spot-id="currentSpotId"
            :records="biteIntervalRecords"
            :fish-dict="lazyTransformedFishDict"
            :updated-time="biteIntervalRecordsUpdatedTime"
            :is-mobile="isMobile"
          />
        </v-col>
      </template>

      <!-- fish shadow predators list -->
      <v-col v-if="showSpotPredators" cols="12" class="my-1">
        <div>
          <v-card color="info">
            <v-card-title>
              {{ $t('spearTip.fishShadow.title') }}
            </v-card-title>
            <v-card-text>
              {{ $t('spearTip.fishShadow.precondition') }}
            </v-card-text>
            <v-card-subtitle>
              {{ $t('spearTip.fishShadow.location') }}
            </v-card-subtitle>
            <v-card-text>
              <detail-item-map :fish="currentSpotPredators[0]" />
            </v-card-text>
            <v-card-subtitle>
              {{ $t('spearTip.fishShadow.predators') }}
            </v-card-subtitle>

            <v-card-text>
              <fish-list
                :fish-dict="lazyTransformedFishDict"
                :fish-ids="currentSpotPredatorIds"
                :fish-list-time-part="fishListTimePart"
                :fish-list-weather-change-part="fishListWeatherChangePart"
                :show-fish-divider="false"
                hide-spot-column
                :is-mobile="isMobile"
                @fish-selected="onFishClicked($event)"
              />
            </v-card-text>
          </v-card>
        </div>
      </v-col>

      <!-- fish list -->
      <v-col cols="12" class="my-1">
        <ocean-fishing-fish-list
          v-if="isOceanFishingSpot"
          :fish-list="currentFishList"
          class="ml-2"
        />
        <fish-list
          v-else
          :fish-dict="lazyTransformedFishDict"
          :fish-ids="currentFishIdList"
          :fish-list-time-part="fishListTimePart"
          :fish-list-weather-change-part="fishListWeatherChangePart"
          :current-spot-id="currentSpotId"
          hide-spot-column
          hide-predators
          :is-mobile="isMobile"
          @fish-selected="onFishClicked($event)"
        />
      </v-col>

      <!-- map -->
      <v-col v-if="!isOceanFishingSpot" cols="12" class="mt-1">
        <v-expansion-panels hover flat tile :value="0">
          <v-expansion-panel class="systemSecondary">
            <v-expansion-panel-header class="systemSecondary">
              <div>
                <div style="display: flex; align-items: center; justify-content: center">
                  <link-list
                    :id="currentMapInfo.id"
                    :angler-id="currentMapInfo.anglerLocationId"
                    :name="currentMapInfo.name"
                    mode="spot"
                    :spot-mode="mode"
                  >
                    <v-hover v-slot="{ hover }">
                      <div
                        :class="
                          `text-subtitle-1 ${
                            hover ? 'info--text text-decoration-underline' : ''
                          }`
                        "
                      >
                        {{ currentMapInfo.name }}
                      </div>
                    </v-hover>
                  </link-list>
                  <!--                      <div-->
                  <!--                        class="text-subtitle-1"-->
                  <!--                        :title="currentMapInfo.name + '#' + currentMapInfo.id"-->
                  <!--                      >-->
                  <!--                        {{ currentMapInfo.name }}-->
                  <!--                      </div>-->
                  <div class="text-subtitle-1 ml-2">
                    ({{ currentMapInfo.fishSpotPositionText }})
                  </div>
                  <click-helper @click.stop :copy-text="currentMapInfo.name">
                    <v-btn class="my-2" text icon :title="$t('list.item.copyHint')">
                      <v-icon>{{ mdiContentCopy }}</v-icon>
                    </v-btn>
                  </click-helper>
                  <!--                    {{ currentMapInfo }}-->
                </div>

                <!--                <div v-if="showSpotPredators" class="text-center">-->
                <!--                  此处为鱼影，需要刺前置鱼触发，详情见地图下方说明。-->
                <!--                </div>-->
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div style="width: 100%; height: 512px" class="d-flex justify-center mt-4">
                <div style="width: 100%; max-width: 512px">
                  <eorzea-simple-map
                    ref="simpleMap"
                    :id="currentMapInfo.mapFileId"
                    :size-factor="currentMapInfo.size_factor"
                    :fishing-spots="currentSpotList"
                    :show-fishing-range-helper="mode === 'normal'"
                  />
                </div>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <about-chart-dialog v-model="showAboutChartDialog" />
  </div>
</template>

<script>
import { mdiClose, mdiContentCopy, mdiInformation } from '@mdi/js'

import DataUtil from '@/utils/DataUtil'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import rcapiService from '@/service/rcapiService'

import { SystemInfo } from 'Data/version'
import { mapGetters } from 'vuex'
import AboutChartDialog from '@/components/Dialog/AboutChartDialog'
import BaitPercentageChart from '@/components/charts/BaitPercentageChart'
import BiteIntervalChart from '@/components/charts/BiteIntervalChart'
import ClickHelper from '@/components/basic/ClickHelper'
import DetailItemMap from '@/components/fish-detail-items/DetailItemMap'
import FIX from 'Data/fix'
import FishList from '@/components/FishList'
import FishingSpots from 'Data/fishingSpots'
import LinkList from '@/components/basic/LinkList'
import OceanFishingFishList from '@/components/OceanFishingFishList/OceanFishingFishList'
import PageMixin from '@/components/OceanFishingFishList/PageMixin'
import _ from 'lodash'
import placeNames from 'Data/locale/placeNames'

export default {
  name: 'WikiSpotDetail',
  mixins: [PageMixin],
  components: {
    AboutChartDialog,
    DetailItemMap,
    ClickHelper,
    LinkList,
    FishList,
    OceanFishingFishList,
    BiteIntervalChart,
    BaitPercentageChart,
    EorzeaSimpleMap,
  },
  props: {
    currentSpotId: {
      type: Number,
      default: undefined,
    },
    mode: {
      type: String,
    },
    lazyTransformedFishDict: {
      type: Object,
    },
    fishListWeatherChangePart: {
      type: Object,
    },
    fishListTimePart: {
      type: Object,
    },
    showClose: {
      type: Boolean,
    },
    isElectron: {
      type: Boolean,
    },
  },
  data() {
    return {
      mdiInformation,
      mdiContentCopy,
      mdiClose,
      showAboutChartDialog: false,
      spotRecordCountCache: {},
      spotBiteIntervalCache: {},
      locale: SystemInfo.dataLocale,
    }
  },
  computed: {
    ...mapGetters(['getFishingSpot', 'readChartTip']),
    currentSpotList() {
      return [this.assembleSpot(this.currentSpotId)]
    },
    currentMapInfo() {
      const currentSpot = _.first(this.currentSpotList)
      console.debug('Current Spot', currentSpot)
      return {
        ...currentSpot,
        id: currentSpot._id,
        fishSpotPositionText: DataUtil.toPositionText(currentSpot),
        size_factor: currentSpot.size_factor,
        mapFileId: currentSpot.mapFileId,
      }
    },
    isOceanFishingSpot() {
      return DataUtil.isOceanFishingSpot(this.currentSpotId)
    },
    spotDict() {
      return _.keyBy(
        (this.mode === 'normal'
          ? FishingSpots
          : FIX.SPEAR_REGION_TERRITORY_POINT
        ).flatMap(region => region.territories.flatMap(territory => territory.spots)),
        'id'
      )
    },
    currentFishIdList() {
      return this.spotDict[this.currentSpotId]?.fishList
    },
    currentFishList() {
      return this.currentFishIdList?.map(fishId => this.lazyTransformedFishDict[fishId])
    },

    baitCountRecords() {
      return this.spotRecordCountCache[this.currentSpotId]?.items || []
    },
    baitCountRecordUpdatedTime() {
      return this.spotRecordCountCache[this.currentSpotId]?.updatedTime
    },
    biteIntervalRecords() {
      return this.spotBiteIntervalCache[this.currentSpotId]?.items || []
    },
    biteIntervalRecordsUpdatedTime() {
      return this.spotBiteIntervalCache[this.currentSpotId]?.updatedTime
    },
    showSpotPredators() {
      return (
        this.mode === 'spear' &&
        this.currentFishList.some(it => it.shadowPredators.length > 0)
      )
    },
    currentSpotPredators() {
      return (
        this.currentFishList.find(fish => fish.shadowPredators.length > 0)
          ?.shadowPredators ?? []
      )
    },
    currentSpotPredatorIds() {
      return this.currentSpotPredators.map(it => it.id)
    },
  },
  watch: {
    currentSpotId: {
      handler(currentSpotId) {
        if (currentSpotId !== -1) {
          setTimeout(() => this.$refs.simpleMap?.resize(), 500)
          this.getBaitDataOfSpot(currentSpotId)
          this.getBiteIntervalDataOfSpot(currentSpotId)
        }
      },
      immediate: true,
    },
  },
  created() {
    this.showAboutChartDialog = !this.readChartTip
  },
  methods: {
    onFishClicked(e) {
      this.$emit('fish-selected', e)
    },
    async getBaitDataOfSpot(spotId) {
      const spotData = this.spotRecordCountCache[spotId]
      if (!spotData) {
        let data
        if (DataUtil.isOceanFishingSpot(spotId)) {
          data = await rcapiService.getSpotRecordCount(spotId, 'record-count-ikd')
        } else {
          data = await rcapiService.getSpotRecordCount(spotId, 'record-count')
        }
        this.$set(this.spotRecordCountCache, spotId, data)
      }
    },
    async getBiteIntervalDataOfSpot(spotId) {
      const spotData = this.spotBiteIntervalCache[spotId]
      if (!spotData) {
        this.$set(
          this.spotBiteIntervalCache,
          spotId,
          await rcapiService.getSpotBiteInterval(spotId)
        )
      }
    },

    assembleSpot(spotId) {
      if (this.mode === 'normal') {
        const spot = this.getFishingSpot(spotId)
        return {
          ...spot,
          name: DataUtil.getName(placeNames[spot.placeNameId]),
          zone: DataUtil.getName(placeNames[spot.territoryTypePlaceNameId]),
        }
      } else {
        const gatheringPoint = FIX.SPEAR_FISH_GATHERING_POINTS[spotId]
        // console.log('gp', spotId, {
        //   ...gatheringPoint,
        //   name: DataUtil.getName(gatheringPoint),
        // })
        return {
          ...gatheringPoint,
          name: DataUtil.getName(placeNames[gatheringPoint.placeNameId]),
          zone: DataUtil.getName(placeNames[gatheringPoint.territoryTypePlaceNameId]),
        }
      }
    },
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

$wrapper-wiki-menu: $spot-detail-title-height + $divider-height

.spot-detail
  overflow-y: auto
  &--pc
    &-web
      height: calc(100vh - #{ $wrapper-web + $wrapper-wiki-menu })
    &-electron
      height: calc(100vh - #{ $wrapper-desktop + $wrapper-wiki-menu })

  &--mobile
    &-web
      height: calc(100vh - #{ $wrapper-web + $wrapper-wiki-menu })
    &-electron
      height: calc(100vh - #{ $wrapper-desktop + $wrapper-wiki-menu })
</style>
