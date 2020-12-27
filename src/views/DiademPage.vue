<template>
  <v-container
    fluid
    :class="`detail-wrapper ${isMobile ? 'detail-wrapper-mobile' : 'detail-wrapper-pc'}`"
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
                  <v-tabs v-model="versionIndex">
                    <v-tab>第二期重建</v-tab>
                    <v-tab>第三期重建</v-tab>
                  </v-tabs>
                  <v-card color="system">
                    <v-card-title>{{ simpleTip.title }}</v-card-title>
                    <v-card-text>
                      <div v-html="simpleTip.content" />
                    </v-card-text>
                    <v-divider />
                    <v-card-text>
                      攻略及下方资料参考：
                      <div class="text-subtitle-1">
                        <a :href="simpleTip.reference.link" target="_blank">
                          {{ simpleTip.reference.title }}
                        </a>
                      </div>
                      <div>
                        {{ simpleTip.reference.author }}
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-col>
              <v-col class="col-12 col-md-4">
                <v-img :src="tipMap" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-expansion-panels focusable v-model="spotPanels" multiple>
          <v-expansion-panel v-for="(item, i) in diademSpots" :key="i">
            <v-expansion-panel-header
              >{{ item.fishingSpotName }}
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
import regionTerritorySpots from '@/store/fishingSpots.json'
import _ from 'lodash'
import { mapGetters, mapState } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import DIADEM from '@/store/diadem'
import ImgUtil from '@/utils/ImgUtil'
import DiademFishList from '@/components/DiademFishList/DiademFishList'

export default {
  name: 'DiademPage',
  components: { DiademFishList },
  data() {
    return {
      regionTerritorySpots: regionTerritorySpots,
      tipMaps: [
        ImgUtil.getImgUrl('diadem-tip-map-grade2.png'),
        ImgUtil.getImgUrl('diadem-tip-map-grade3.png'),
      ],
      versionIndex: 0,
    }
  },
  computed: {
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
          return []
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
            }
          }),
        }
      })
    },
    spotPanels() {
      return this.diademSpots.map((it, index) => index).slice(3)
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
@import "../styles/RcVariables"

.detail-wrapper
  width: 100%

  height: 100%
  overflow-scrolling: auto
  overflow-y: scroll
  overflow-x: hidden

  &-mobile
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

  &-pc
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

.red
  color: orangered !important
  background-color: unset !important
</style>
