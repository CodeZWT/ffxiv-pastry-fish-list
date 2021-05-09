<template>
  <v-container
    fluid
    :class="
      `detail-wrapper ${isElectron ? 'detail-wrapper--electron' : 'detail-wrapper--web'}`
    "
  >
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <div>云冠群岛</div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col class="col-12 col-md-8">
                <div>
                  <v-tabs v-model="tabIndex">
                    <!--                    <v-tab>第二期重建</v-tab>-->
                    <v-tab>第三期重建</v-tab>
                    <v-tab>第四期重建</v-tab>
                  </v-tabs>
                  <v-card color="system">
                    <v-card-title>{{ simpleTip.title }}</v-card-title>
                    <v-card-text>
                      <div v-if="simpleTip.content" v-html="simpleTip.content" />
                      <div v-else>
                        <v-subheader class="px-0">摇风云海</v-subheader>
                        <div class="d-flex align-center">
                          <item-icon icon-class="bg-027051" small />
                          <span class="d-flex flex-column">
                            <v-badge inline content="!" color="success"></v-badge>
                            <v-badge inline content="< 10s" color="transparent"></v-badge>
                          </span>
                          <v-icon small>mdi-chevron-right</v-icon>
                          <span><item-icon icon-class="bg-029716" small/></span>
                          <span class="d-flex flex-column" style="margin: 0 10px">
                            <v-badge inline content="!!!" color="warning"></v-badge>
                          </span>
                          <v-icon small>mdi-chevron-right</v-icon>
                          <span><item-icon icon-class="bg-028459"/></span>
                          996 <v-icon>mdi-plus-circle</v-icon>
                        </div>

                        <div class="d-flex align-center">
                          <div style="min-width: 113px" class="d-flex align-center">
                            <div class="bg-060290" title="灵飞电" />
                            <span style="margin: 0 35px 0 4px">时也可</span>
                          </div>
                          <v-icon>mdi-subdirectory-arrow-right</v-icon>
                          <span class="d-flex flex-column">
                            <v-badge inline content="!!!" color="warning"></v-badge>
                            <v-badge inline content="> 30s" color="transparent"></v-badge>
                          </span>
                          <v-icon small>mdi-chevron-right</v-icon>
                          <span><item-icon icon-class="bg-029749"/></span>
                          1078 <v-icon>mdi-plus-circle</v-icon>
                        </div>

                        <v-subheader class="px-0">旋风云海</v-subheader>
                        <div class="d-flex align-center">
                          <item-icon icon-class="bg-027051" small />
                          <span class="d-flex flex-column">
                            <v-badge inline content="!" color="success"></v-badge>
                            <v-badge inline content="< 10s" color="transparent"></v-badge>
                          </span>
                          <v-icon small>mdi-chevron-right</v-icon>
                          <span><item-icon icon-class="bg-029716" small/></span>
                          <span class="d-flex flex-column">
                            <v-badge inline content="!!" color="error"></v-badge>
                            <v-badge inline content="> 20s" color="transparent"></v-badge>
                          </span>
                          <v-icon small>mdi-chevron-right</v-icon>
                          <span><item-icon icon-class="bg-029054"/></span>
                          911 <v-icon>mdi-plus-circle</v-icon>
                        </div>
                        <div class="d-flex align-center">
                          <div style="min-width: 113px" class="d-flex align-center">
                            <div class="bg-060291" title="灵罡风" />
                            <span style="margin: 0 35px 0 4px">时也可</span>
                          </div>
                          <v-icon>mdi-subdirectory-arrow-right</v-icon>
                          <span class="d-flex flex-column">
                            <v-badge inline content="!!!" color="warning"></v-badge>
                            <v-badge inline content="> 30s" color="transparent"></v-badge>
                          </span>
                          <v-icon small>mdi-chevron-right</v-icon>
                          <span><item-icon icon-class="bg-029747"/></span>
                          982 <v-icon>mdi-plus-circle</v-icon>
                        </div>
                        <v-subheader class="px-0">注：</v-subheader>
                        <div>
                          冲分无双提获得力要求，冲成就可去狂风云海，2300获得力双提3条
                        </div>

                        <div class="d-flex align-center flex-wrap">
                          <span> 此处以及云冠群岛页面中所有标注 </span>
                          <div data-ck-item-id="29717">
                            <item-icon icon-class="bg-027051" small />
                          </div>

                          <span> 的鱼均可使用其他任意云冠鱼饵</span>
                          <div data-ck-item-id="30278">
                            <item-icon icon-class="bg-027020" small />
                          </div>
                          <div data-ck-item-id="30279">
                            <item-icon icon-class="bg-027025" small />
                          </div>
                          <div data-ck-item-id="30280">
                            <item-icon icon-class="bg-027002" small />
                          </div>
                          <div data-ck-item-id="30281">
                            <item-icon icon-class="bg-027022" small />
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                    <v-divider />
                    <v-card-text v-if="simpleTip.baitTip" v-html="simpleTip.baitTip" />
                    <v-divider />
                    <v-card-text v-html="simpleTip.spotTip" />
                    <v-divider />
                    <v-card-text v-if="simpleTip.references">
                      <div>参考资料：</div>
                      <div
                        v-for="(reference, index) in simpleTip.references"
                        :key="index"
                      >
                        <div class="text-subtitle-1">
                          <a :href="reference.link" target="_blank">
                            {{ reference.title }}
                          </a>
                        </div>
                        <div>
                          {{ reference.author }}
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-col>
              <v-col class="col-12 col-md-4">
                <v-img v-if="tipMap" :src="tipMap" />
                <template v-else>
                  <eorzea-simple-map
                    :id="currentVersionMapData.mapFileId"
                    :size-factor="currentVersionMapData.size_factor"
                    :fishing-spots="currentVersionMapData.fishingSpots"
                    show-fishing-range-helper
                  />
                </template>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-expansion-panels focusable :value="spotPanels" multiple>
          <v-expansion-panel v-for="(item, i) in diademSpots" :key="i">
            <v-expansion-panel-header>
              {{ item.fishingSpotName }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <!-- <div>{{ JSON.stringify(item, null, 2) }}</div> -->
              <diadem-fish-list :spot-data="item" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import regionTerritorySpots from 'Data/fishingSpots'
import _ from 'lodash'
import { mapGetters, mapState } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import DIADEM from 'Data/diadem'
import ImgUtil from '@/utils/ImgUtil'
import DiademFishList from '@/components/DiademFishList/DiademFishList'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import ItemIcon from '@/components/basic/ItemIcon'

export default {
  name: 'DiademPage',
  components: { ItemIcon, EorzeaSimpleMap, DiademFishList },
  data() {
    return {
      regionTerritorySpots: regionTerritorySpots,
      tipMaps: [
        ImgUtil.getImgUrl('diadem-tip-map-grade2.png'),
        ImgUtil.getImgUrl('diadem-tip-map-grade3.png'),
        ImgUtil.getImgUrl('diadem-tip-map-grade4.png'),
      ],
      tabIndex: 0,
      isElectron: DevelopmentModeUtil.isElectron(),
    }
  },
  computed: {
    currentVersionMapData() {
      return {
        mapFileId: this.diademSpots[0].fishingSpot.mapFileId,
        size_factor: this.diademSpots[0].fishingSpot.size_factor,
        fishingSpots: this.diademSpots.map(it => ({
          ...it.fishingSpot,
          name: it.fishingSpotName,
        })),
      }
    },
    versionIndex() {
      return this.tabIndex + 1
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    allFish() {
      return this.fish
    },
    version() {
      return [2, 3, 4][this.versionIndex]
    },
    simpleTip() {
      return DIADEM.SIMPLE_TIPS[this.versionIndex]
    },
    tipMap() {
      return this.tipMaps[this.versionIndex]
    },
    versionSpots() {
      switch (this.version) {
        case 2:
          return [10001, 10002, 10003, 10004, 10005, 10006, 10007]
        case 3:
          return [10008, 10009, 10010, 10011, 10012, 10013, 10014, 10015, 10016]
        default:
          return [10017, 10018, 10019, 10020, 10021, 10022, 10023, 10024, 10025]
      }
    },
    diademSpots() {
      return _.sortBy(
        this.regionTerritorySpots
          .find(it => it.id === null)
          .territories[0].spots.filter(spot => this.versionSpots.includes(spot.id)),
        'id'
      ).map(spot => {
        const fishingSpot = this.getFishingSpot(spot.id)
        return {
          ...spot,
          fishingSpot,
          fishingSpotName: this.getFishingSpotsName(spot.id),
          fishingSpotId: spot.id,
          fishSpotPositionText: DataUtil.toPositionText(fishingSpot),
          fishList: spot.fishList.map(fishId => {
            const fish = DIADEM.FISH[fishId]
            const bestCatchPath = fish.bestCatchPathGroup
              ? fish.bestCatchPathGroup[spot.id].bestCatchPath
              : fish.bestCatchPath
            const bestCatchPathExtra = fish.bestCatchPathGroup
              ? fish.bestCatchPathGroup[spot.id].bestCatchPathExtra
              : fish.bestCatchPathExtra
            const weatherSet = fish?.weatherSet ?? []
            return {
              ...fish,
              id: fishId,
              name: this.getItemName(fishId),
              icon: this.getItemIconClass(fishId),
              points: fish.points[this.versionIndex],
              scrips: fish.scrips[this.versionIndex],
              hasWeatherConstraint: weatherSet.length > 0,
              weatherSetDetail: this.getWeather(weatherSet),
              baits: this.getBaits(fish, bestCatchPath, DIADEM.FISH),
              baitsExtra:
                bestCatchPathExtra.length > 0
                  ? this.getBaits(fish, bestCatchPathExtra, DIADEM.FISH)
                  : [],
              biteTimeText: this.toBiteTimeText(fish.biteMin, fish.biteMax),
              hasPredators: fish.predators && Object.keys(fish.predators).length > 0,
              predators: Object.entries(fish.predators).map(([itemId, cnt]) => {
                return {
                  id: itemId,
                  icon: this.getItemIconClass(itemId),
                  name: this.getItemName(itemId),
                  requiredCnt: cnt,
                }
              }),
              predatorsIcon: DataUtil.iconIdToClass(DataUtil.ICON_PREDATORS),
            }
          }),
        }
      })
    },
    spotPanels() {
      return this.isMobile ? [] : this.diademSpots.map((it, index) => index).slice(3)
    },
    ...mapState(['fish', 'items']),
    ...mapGetters([
      'getFishingSpot',
      'getFishingSpotsName',
      'getItemName',
      'getItemIconClass',
      'getWeather',
      'getBaits',
    ]),
  },
  methods: {
    toBiteTimeText(min, max) {
      if (min == null && max == null) {
        return ''
      } else if (min == null) {
        return `< ${max}`
      } else if (max == null) {
        return `> ${min}`
      } else {
        return `${min} - ${max}`
      }
    },
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.detail-wrapper
  width: 100%
  height: 100%
  overflow-scrolling: auto
  overflow-y: scroll
  overflow-x: hidden

  &--web
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

  &--electron
    max-height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding})

.red
  color: orangered !important
  background-color: unset !important

::v-deep .v-expansion-panel-content__wrap
  padding: 0 !important
</style>
