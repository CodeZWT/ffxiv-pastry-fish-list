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
                  <!--                  <v-tabs v-model="versionIndex">-->
                  <!--                    <v-tab>第二期重建</v-tab>-->
                  <!--                    <v-tab>第三期重建</v-tab>-->
                  <!--                  </v-tabs>-->
                  <v-card color="system">
                    <v-card-title>{{ simpleTip.title }}</v-card-title>
                    <v-card-text>
                      <div v-html="simpleTip.content" />
                    </v-card-text>
                    <v-divider />
                    <v-card-text>
                      <div>攻略及下方资料参考：</div>
                      <div class="text-subtitle-1">
                        <a :href="simpleTip.reference.link" target="_blank">
                          {{ simpleTip.reference.title }}
                        </a>
                      </div>
                      <div>
                        {{ simpleTip.reference.author }}
                      </div>
                    </v-card-text>
                    <v-divider />
                    <v-card-text>
                      <div>关于鱼饵的一些说明</div>
                      <div>
                        云冠群岛的可以使用的鱼饵有：万能拟饵，云冠大蚊，云冠浮游虫，云冠红气球虫，云冠气球虫。<br />
                        下方标记万能拟饵的鱼实际可用所有5种鱼饵。<br />
                        非以小钓大的特供白鱼实际可用2种鱼饵：飞蝠鲼可用：云冠红气球虫，云冠浮游虫；白丽鱼可用：云冠大蚊，云冠气球虫。（*注1）<br />
                        非以小钓大的特供绿鱼实际可用1种鱼饵：云鲨可用：云冠红气球虫；始祖鸟可用：云冠大蚊（*注1）<br />
                        <span style="font-size: small">
                          *注1：部分鱼也有万能拟饵的咬钩记录，可以自行尝试。
                        </span>
                      </div>
                    </v-card-text>
                    <v-divider />
                    <v-card-text>
                      <div>关于钓场的一些说明</div>
                      <div>
                        3个钓场有第三期的普通鱼<br />
                        4个钓场有第三期的特供鱼<br />
                        2个钓场有第二期的特供鱼
                        <span class="error--text">
                          （其中一个钓场【狂风云海】与第三期特供鱼钓场同名请注意看地图分辨！）
                        </span>
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
        <v-expansion-panels focusable :value="spotPanels" multiple>
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
import regionTerritorySpots from 'Data/fishingSpots'
import _ from 'lodash'
import { mapGetters, mapState } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import DIADEM from 'Data/diadem'
import ImgUtil from '@/utils/ImgUtil'
import DiademFishList from '@/components/DiademFishList/DiademFishList'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'

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
      versionIndex: 1,
      isElectron: DevelopmentModeUtil.isElectron(),
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
