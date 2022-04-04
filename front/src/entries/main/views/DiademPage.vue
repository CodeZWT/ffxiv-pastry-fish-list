<template>
  <page-template>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <div>{{ $t('diademPage.title') }}</div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col :cols="isMobile ? 12 : 8" class="pa-0">
                <v-card color="system" elevation="0">
                  <v-card-title>{{ simpleTip.title }}</v-card-title>
                  <v-card-text>
                    <div v-if="simpleTip.content" v-html="simpleTip.content" />
                    <div v-else>
                      <v-subheader class="px-0"
                        >{{ $t('diademPage.tip.spot1') }}
                      </v-subheader>
                      <div class="d-flex align-center">
                        <item-icon
                          :icon-url="diademAnyBaitIcon"
                          small
                          :title="$t('diademPage.tip.bait')"
                        />
                        <span class="d-flex flex-column">
                          <v-badge inline content="!" color="success"></v-badge>
                          <v-badge
                            inline
                            content="< 10s"
                            color="transparent label--text"
                          ></v-badge>
                        </span>
                        <v-icon small>{{ mdiChevronRight }}</v-icon>
                        <span>
                          <item-icon :icon-class="iconIdToClass(29716)" small />
                        </span>
                        <span class="d-flex flex-column" style="margin: 0 10px">
                          <v-badge inline content="!!!" color="warning"></v-badge>
                        </span>
                        <v-icon small>{{ mdiChevronRight }}</v-icon>
                        <span><item-icon :icon-class="iconIdToClass(28459)"/></span>
                        996 <v-icon>{{ mdiPlusCircle }}</v-icon>
                      </div>

                      <div class="d-flex align-center">
                        <div style="min-width: 113px" class="d-flex align-center">
                          <weather-icon
                            :icon-class="iconIdToClass(60290)"
                            title="$t('diademPage.tip.weather1')"
                          />
                          <span style="margin: 0 35px 0 4px">
                            {{ $t('diademPage.tip.or') }}
                          </span>
                        </div>
                        <v-icon>{{ mdiSubdirectoryArrowRight }}</v-icon>
                        <span class="d-flex flex-column">
                          <v-badge inline content="!!!" color="warning"></v-badge>
                          <v-badge
                            inline
                            content="> 30s"
                            color="transparent label--text"
                          ></v-badge>
                        </span>
                        <v-icon small>{{ mdiChevronRight }}</v-icon>
                        <span><item-icon :icon-class="iconIdToClass(29749)"/></span>
                        1078
                        <v-icon>{{ mdiPlusCircle }}</v-icon>
                      </div>

                      <v-subheader class="px-0"
                        >{{ $t('diademPage.tip.spot2') }}
                      </v-subheader>
                      <div class="d-flex align-center">
                        <item-icon
                          :icon-url="diademAnyBaitIcon"
                          small
                          :title="$t('diademPage.tip.bait')"
                        />
                        <span class="d-flex flex-column">
                          <v-badge inline content="!" color="success"></v-badge>
                          <v-badge
                            inline
                            content="< 10s"
                            color="transparent label--text"
                          ></v-badge>
                        </span>
                        <v-icon small>{{ mdiChevronRight }}</v-icon>
                        <span><item-icon :icon-class="iconIdToClass(29716)" small/></span>
                        <span class="d-flex flex-column">
                          <v-badge inline content="!!" color="error"></v-badge>
                          <v-badge
                            inline
                            content="> 20s"
                            color="transparent label--text"
                          ></v-badge>
                        </span>
                        <v-icon small>{{ mdiChevronRight }}</v-icon>
                        <span><item-icon :icon-class="iconIdToClass(29054)"/></span>
                        911 <v-icon>{{ mdiPlusCircle }}</v-icon>
                      </div>
                      <div class="d-flex align-center">
                        <div style="min-width: 113px" class="d-flex align-center">
                          <weather-icon
                            :icon-class="iconIdToClass(60291)"
                            title="$t('diademPage.tip.weather2')"
                          />
                          <span style="margin: 0 35px 0 4px">
                            {{ $t('diademPage.tip.or') }}
                          </span>
                        </div>
                        <v-icon>{{ mdiSubdirectoryArrowRight }}</v-icon>
                        <span class="d-flex flex-column">
                          <v-badge inline content="!!!" color="warning"></v-badge>
                          <v-badge
                            inline
                            content="> 30s"
                            color="transparent label--text"
                          ></v-badge>
                        </span>
                        <v-icon small>{{ mdiChevronRight }}</v-icon>
                        <span><item-icon :icon-class="iconIdToClass(29747)"/></span>
                        982
                        <v-icon>{{ mdiPlusCircle }}</v-icon>
                      </div>
                      <v-subheader class="px-0"
                        >{{ $t('diademPage.tip.note.title') }}
                      </v-subheader>
                      <ul>
                        <li>
                          {{ $t('diademPage.tip.note.gather') }}
                        </li>
                        <li>
                          {{ $t('diademPage.tip.note.baitTip1') }}
                          <div class="text--secondary">
                            {{ $t('diademPage.tip.note.baitTip2') }}
                          </div>
                        </li>
                        <li>
                          <div class="d-flex align-center flex-wrap">
                            <i18n
                              path="diademPage.tip.note.baitTip3"
                              tag="span"
                              class="d-inline-flex align-center"
                            >
                              <span place="icon">
                                <item-icon
                                  :icon-url="diademAnyBaitIcon"
                                  small
                                  :title="$t('diademPage.tip.bait')"
                                />
                              </span>
                            </i18n>
                          </div>
                          <div class="d-flex align-center">
                            <div data-ck-item-id="30278">
                              <item-icon :icon-class="iconIdToClass(27020)" small />
                            </div>
                            <div data-ck-item-id="30279">
                              <item-icon :icon-class="iconIdToClass(27025)" small />
                            </div>
                            <div data-ck-item-id="30280">
                              <item-icon :icon-class="iconIdToClass(27002)" small />
                            </div>
                            <div data-ck-item-id="30281">
                              <item-icon :icon-class="iconIdToClass(27022)" small />
                            </div>
                            <div data-ck-item-id="29717">
                              <item-icon :icon-class="iconIdToClass(27051)" small />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </v-card-text>
                  <v-divider />
                  <v-card-text v-if="simpleTip.baitTip" v-html="simpleTip.baitTip" />
                  <v-divider />
                  <v-card-text v-html="simpleTip.spotTip" />
                  <v-divider />
                  <v-card-text v-if="simpleTip.references">
                    <div>{{ $t('diademPage.tip.reference.title') }}</div>
                    <div v-for="(reference, index) in simpleTip.references" :key="index">
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
              </v-col>
              <v-col :cols="isMobile ? 12 : 4" class="py-0">
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
              <diadem-fish-list :spot-data="item" :is-mobile="isMobile" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </page-template>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { mdiChevronRight, mdiPlusCircle, mdiSubdirectoryArrowRight } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import DiademFishList from '@/components/DiademFishList/DiademFishList'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import ImgUtil from '@/utils/ImgUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import PageMixin from '@/components/OceanFishingFishList/PageMixin'
import PageTemplate from '@/entries/main/views/PageTemplate'
import WeatherIcon from '@/components/basic/WeatherIcon'
import _ from 'lodash'
import dataLoader from '@/utils/dataLoader'
import placeNames from 'Data/locale/placeNames'
import regionTerritorySpots from 'Data/fishingSpots'

export default {
  name: 'DiademPage',
  mixins: [PageMixin],
  components: { PageTemplate, WeatherIcon, ItemIcon, EorzeaSimpleMap, DiademFishList },
  props: ['original'],
  data() {
    return {
      mdiChevronRight,
      mdiPlusCircle,
      mdiSubdirectoryArrowRight,
      regionTerritorySpots: regionTerritorySpots,
      tipMaps: [
        ImgUtil.getImgUrl('diadem-tip-map-grade2.webp'),
        ImgUtil.getImgUrl('diadem-tip-map-grade3.webp'),
        ImgUtil.getImgUrl('diadem-tip-map-grade4.webp'),
      ],
      tabIndex: 0,
      isElectron: DevelopmentModeUtil.isElectron(),
      DIADEM: undefined,
    }
  },
  computed: {
    diademAnyBaitIcon() {
      return ImgUtil.getImgUrl('diadem-any-bait.webp')
    },
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
      return this.tabIndex + 2
    },
    allFish() {
      return this.fish
    },
    version() {
      return [2, 3, 4][this.versionIndex]
    },
    simpleTip() {
      return this.DIADEM?.SIMPLE_TIPS[this.versionIndex] ?? {}
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
    spotWithOldRoundFish() {
      return [10015, 10016, 10024, 10025]
    },
    diademSpots() {
      return !this.DIADEM
        ? []
        : _.sortBy(
            this.regionTerritorySpots
              .find(it => it.id === null)
              .territories[0].spots.filter(spot => this.versionSpots.includes(spot.id)),
            'id'
          ).map(spot => {
            const fishingSpot = this.getFishingSpot(spot.id)
            return {
              ...spot,
              fishingSpot,
              fishingSpotName: `${DataUtil.getName(placeNames[fishingSpot.placeNameId])}${
                this.spotWithOldRoundFish.includes(spot.id)
                  ? this.$t('diademPage.oldSpot')
                  : ''
              }`,
              fishingSpotId: spot.id,
              fishSpotPositionText: DataUtil.toPositionText(fishingSpot),
              fishList: spot.fishList.map(fishId => {
                const fish = this.DIADEM.FISH[fishId]
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
                  names: DataUtil.getItemNames(fishId),
                  icon: this.getItemIconClass(fishId),
                  points: fish.points[this.versionIndex],
                  scrips: fish.scrips[this.versionIndex],
                  hasWeatherConstraint: weatherSet.length > 0,
                  weatherSetDetail: this.getWeather(weatherSet),
                  baits: this.getBaits(fish, bestCatchPath, this.DIADEM.FISH, true),
                  baitsExtra:
                    bestCatchPathExtra.length > 0
                      ? this.getBaits(fish, bestCatchPathExtra, this.DIADEM.FISH, true)
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
  async mounted() {
    this.DIADEM = await dataLoader.DIADEM()
  },
  methods: {
    iconIdToClass: DataUtil.iconIdToClass,
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

.red
  color: orangered !important
  background-color: unset !important

::v-deep .v-expansion-panel-content__wrap
  padding: 0 !important
</style>
