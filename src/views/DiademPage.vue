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
            <!--            {{ diademSpots }}-->
            <!--            <v-list>-->
            <!--              <v-list-item v-for="spot in diademSpots" :key="spot.id">-->
            <!--                {{ spot }}-->
            <!--              </v-list-item>-->
            <!--            </v-list>-->
            <v-row>
              <v-col cols="8">
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
              <v-col cols="4">
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
              <div class="d-flex flex-wrap">
                <div class="col-12">
                  <v-simple-table>
                    <colgroup>
                      <col span="1" style="width: 25%;" />
                      <col span="1" style="width: 8%;" />
                      <col span="1" style="width: 6%;" />
                      <col span="1" style="width: 5%;" />
                      <col span="1" style="width: 5%;" />
                      <col span="1" style="width: 7%;" />
                      <col span="1" style="width: 32%;" />
                      <col span="1" style="width: 12%;" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>
                          名称
                        </th>
                        <th class="text-center">
                          天气
                        </th>
                        <th class="text-center">天穹街<br />振兴票</th>
                        <th class="text-center">
                          技巧点
                        </th>
                        <th class="text-center">
                          双提
                        </th>
                        <th class="text-center">
                          咬钩(s)
                        </th>
                        <th>
                          钓法
                        </th>
                        <th>
                          分解
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="fish in item.fishList" :key="fish.id">
                        <td>
                          <!--                    {{ fish.id }}-->
                          <div class="d-flex align-center">
                            <item-icon :icon-class="fish.icon" style="min-width: 48px" />
                            <div class="d-flex flex-column ml-1">
                              <div
                                class="text-subtitle-1"
                                :title="fish.name + '#' + fish.id"
                              >
                                {{ fish.name }}
                              </div>
                              <div class="d-flex">
                                <click-helper @click.stop :copy-text="fish.name">
                                  <v-btn
                                    text
                                    icon
                                    small
                                    :title="$t('list.item.copyHint')"
                                  >
                                    <v-icon small>mdi-content-copy</v-icon>
                                  </v-btn>
                                </click-helper>
                                <click-helper
                                  @click.stop="goToFishAngelPage(fish.anglerFishId)"
                                >
                                  <v-btn
                                    text
                                    icon
                                    small
                                    :title="$t('list.item.linkHint')"
                                  >
                                    <v-icon small>mdi-link-variant</v-icon>
                                  </v-btn>
                                </click-helper>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div
                            class="d-flex justify-center"
                            v-if="fish.hasWeatherConstraint"
                          >
                            <div
                              v-for="(weather, index) in fish.weatherSetDetail"
                              :key="index"
                              :title="weather.name"
                              class="d-flex flex-column align-center"
                            >
                              <div :class="weather.icon" :title="weather.name" />
                              <div class="ml-1">{{ weather.name }}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex align-center justify-end">
                            <div class="text-subtitle-1 mr-1">{{ fish.scrips }}</div>
                            <div>
                              <v-img :src="scripsIcon" width="36" height="36" />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex align-center justify-end">
                            <div class="text-subtitle-1 mr-1">{{ fish.points }}</div>
                            <div>
                              <v-icon>mdi-plus-circle</v-icon>
                            </div>
                          </div>
                        </td>
                        <td class="text-center">
                          {{ fish.doubleHook ? fish.doubleHook : '-' }}
                        </td>
                        <td class="text-center">
                          {{ fish.biteTimeText }}
                        </td>
                        <td>
                          <!--                      {{ fish.baits }}-->
                          <fish-bait-list :baits="fish.baits" />
                        </td>
                        <td class="text-left">
                          {{ fish.desynthesis }}
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </div>
                <div class="col-12">
                  <detail-item-map :fish="toFishingSpotData(item)" :expanded="false" />
                </div>
              </div>
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
import ItemIcon from '@/components/basic/ItemIcon'
import DetailItemMap from '@/components/fish-detail-items/DetailItemMap'
import DIADEM from '@/store/diadem'
import ImgUtil from '@/utils/ImgUtil'
import FishBaitList from '@/components/FishBaitList'
import ClickHelper from '@/components/basic/ClickHelper'

export default {
  name: 'DiademPage',
  components: { ClickHelper, FishBaitList, DetailItemMap, ItemIcon },
  data() {
    return {
      regionTerritorySpots: regionTerritorySpots,
      scripsIcon: ImgUtil.getImgUrl('skybuilders-scrips-065073-36x36.png'),
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
              baits: this.getBaits(fish, DIADEM.FISH),
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
    toFishingSpotData(fishingSpot) {
      return {
        id: -1,
        fishingSpots: [fishingSpot],
      }
    },
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
    goToFishAngelPage: DataUtil.goToFishAngelPage,
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
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding + 40})
    margin-top: 40px

  &-pc
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

.red
  color: orangered !important
  background-color: unset !important
</style>
