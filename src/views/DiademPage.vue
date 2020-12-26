<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            云冠群岛
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
                <v-card color="system">
                  <v-card-title>{{ simpleTip.title }}</v-card-title>
                  <v-card-text>
                    <div v-html="simpleTip.content" />
                  </v-card-text>
                  <v-divider />
                  <v-card-text>
                    完整攻略请见：
                    <div class="text-subtitle-1">
                      <a href="https://bbs.nga.cn/read.php?tid=23009886" target="_blank">
                        [5.21][空岛][捕鱼人][第二次伊修加德复兴](已更新钓场地图)谁敢向我挑衅，我将终结他的生命！捕鱼人空岛垂钓符文已配备
                      </a>
                    </div>
                    <div>
                      高咲侑@红玉海
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-img :src="tipGarde2Map" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-expansion-panels focusable v-model="spotPanels" multiple>
          <v-expansion-panel v-for="(item, i) in diademSpots" :key="i">
            <v-expansion-panel-header>{{
              item.fishingSpotName
            }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <!--            <div>{{ JSON.stringify(item, null, 2) }}</div>-->
              <div class="d-flex flex-wrap">
                <div class="col-12">
                  <v-simple-table>
                    <colgroup>
                      <col span="1" style="width: 30%;" />
                      <col span="1" style="width: 15%;" />
                      <col span="1" style="width: 6%;" />
                      <col span="1" style="width: 5%;" />
                      <col span="1" style="width: 4%;" />
                      <col span="1" style="width: 40%;" />
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
                        <th>
                          钓法
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="fish in item.fishList" :key="fish.id">
                        <td>
                          <!--                    {{ fish.id }}-->
                          <div class="d-flex align-center">
                            <item-icon :icon-class="fish.icon" />
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
                              class="d-flex align-center"
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
                        <td>
                          <!--                      {{ fish.baits }}-->
                          <fish-bait-list :baits="fish.baits" />
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
import tipGarde2Map from '@/assets/cdn/misc/diadem-tip-map-grade2.jpg'
// https://ngabbs.com/read.php?tid=23286917
export default {
  name: 'DiademPage',
  components: { ClickHelper, FishBaitList, DetailItemMap, ItemIcon },
  data() {
    return {
      regionTerritorySpots: regionTerritorySpots,
      diademSpots: [],
      spotPanels: [],
      scripsIcon: ImgUtil.getImgUrl('skybuilders-scrips-065073-36x36.png'),
      simpleTip: DIADEM.SIMPLE_TIP,
      tipGarde2Map: tipGarde2Map,
    }
  },
  computed: {
    allFish() {
      return this.fish
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
  created() {
    this.diademSpots = this.getDiademSpots()
    this.spotPanels = this.diademSpots.map((it, index) => index).slice(3)
  },
  methods: {
    getDiademSpots() {
      return _.sortBy(
        this.regionTerritorySpots
          .find(it => it.id === null)
          .territories[0].spots.filter(spot => spot.id > 10000 && spot.id < 10008),
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
              hasWeatherConstraint: weatherSet.length > 0,
              weatherSetDetail: this.getWeather(weatherSet),
              baits: this.getBaits(fish, DIADEM.FISH),
            }
          }),
        }
      })
    },
    toFishingSpotData(fishingSpot) {
      return {
        id: -1,
        fishingSpots: [fishingSpot],
      }
    },
    goToFishAngelPage: DataUtil.goToFishAngelPage,
  },
}
</script>

<style scoped></style>
