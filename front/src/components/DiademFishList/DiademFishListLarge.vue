<template>
  <div class="d-flex flex-wrap">
    <div class="col-12">
      <v-simple-table>
        <colgroup>
          <col span="1" style="width: 25%" />
          <col span="1" style="width: 8%" />
          <col span="1" style="width: 6%" />
          <col span="1" style="width: 5%" />
          <col span="1" style="width: 5%" />
          <col span="1" style="width: 7%" />
          <col span="1" style="width: 32%" />
          <col span="1" style="width: 12%" />
        </colgroup>
        <thead>
          <tr>
            <th>名称</th>
            <th class="text-center">天气</th>
            <th class="text-center">天穹街<br />振兴票</th>
            <th class="text-center">技巧点</th>
            <th class="text-center">双提</th>
            <th class="text-center">咬钩(s)</th>
            <th>钓法</th>
            <th>分解</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fish in spotData.fishList" :key="fish.id">
            <td>
              <!--                    {{ fish.id }}-->
              <div class="d-flex align-center">
                <item-icon :icon-class="fish.icon" style="min-width: 48px" />
                <div class="d-flex flex-column ml-1">
                  <link-list
                    :id="fish.id"
                    :angler-id="fish.anglerFishId"
                    :name="fish.name"
                    mode="item"
                  >
                    <v-hover v-slot="{ hover }">
                      <div
                        :class="
                          `text-subtitle-1 ${hover ? 'text-decoration-underline' : ''}`
                        "
                      >
                        {{ fish.name }}
                      </div>
                    </v-hover>
                  </link-list>
                  <div class="d-flex">
                    <click-helper @click.stop :copy-text="fish.name">
                      <v-btn text icon small :title="$t('list.item.copyHint')">
                        <v-icon small>mdi-content-copy</v-icon>
                      </v-btn>
                    </click-helper>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="d-flex justify-center" v-if="fish.hasWeatherConstraint">
                <div
                  v-for="(weather, index) in fish.weatherSetDetail"
                  :key="index"
                  :title="weather.name"
                  class="d-flex flex-column align-center"
                >
                  <weather-icon
                    :icon-class="weather.icon"
                    :title="weather.name"
                    type="weather"
                  />
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
            <td>
              <div class="d-flex justify-center align-center">
                <div class="mr-1">{{ fish.doubleHook ? fish.doubleHook : '-' }}</div>
                <v-tooltip v-if="fish.doubleHookTip" right color="secondary">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small v-bind="attrs" v-on="on">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  <div>{{ fish.doubleHookTip }}</div>
                </v-tooltip>
              </div>
            </td>
            <td class="text-center">
              {{ fish.biteTimeText }}
            </td>
            <td>
              <div class="d-flex">
                <div class="d-flex align-center">
                  <template v-if="fish.hasPredators" class="d-flex">
                    <div
                      v-for="(fish, index) in fish.predators"
                      :key="index"
                      class="d-flex align-center ml-1"
                    >
                      <item-icon
                        :icon-class="fish.icon"
                        small
                        :title="`${fish.name}#${fish.id}`"
                      />
                      <span>X</span>
                      <v-badge
                        :content="fish.requiredCnt"
                        color="predatorCnt black--text"
                        inline
                        bottom
                        bordered
                      >
                      </v-badge>
                    </div>
                    <effect-icon
                      :icon-class="fish.predatorsIcon"
                      style="margin-left: 2px; margin-right: 2px"
                    />
                  </template>
                  <i
                    class="xiv square-a"
                    v-if="fish.baitsExtra.length > 0"
                    title="一种可能情况A"
                  />
                  <fish-bait-list :baits="fish.baits" />
                </div>
                <template v-if="fish.baitsExtra.length > 0">
                  <div class="d-flex align-center">
                    <i class="xiv square-b" title="另一种可能情况B" />
                    <fish-bait-list :baits="fish.baitsExtra" />
                  </div>
                </template>
              </div>
            </td>
            <td class="text-left">
              {{ fish.desynthesis }}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
    <div class="col-12">
      <detail-item-map
        :fish="toFishingSpotData(spotData)"
        :expanded="false"
        show-spot-link
      />
    </div>
  </div>
</template>

<script>
import DiademFishListMixin from '@/components/DiademFishList/DiademFishListMixin'
import EffectIcon from '@/components/basic/EffectIcon'
import LinkList from '@/components/basic/LinkList'
import WeatherIcon from '@/components/basic/WeatherIcon'

export default {
  name: 'DiademFishListLarge',
  components: { EffectIcon, WeatherIcon, LinkList },
  mixins: [DiademFishListMixin],
}
</script>

<style scoped></style>
