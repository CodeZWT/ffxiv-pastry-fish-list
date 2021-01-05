<template>
  <v-row class="d-flex flex-wrap" no-gutters>
    <div class="col-12">
      <v-simple-table>
        <colgroup>
          <col span="1" style="width: 25%;" />
          <col span="1" style="width: 75%;" />
        </colgroup>
        <!--        <thead>-->
        <!--          <tr>-->
        <!--            <th>-->
        <!--              名称-->
        <!--            </th>-->
        <!--            <th>-->
        <!--              钓法-->
        <!--            </th>-->
        <!--          </tr>-->
        <!--        </thead>-->
        <tbody>
          <tr v-for="fish in spotData.fishList" :key="fish.id">
            <td>
              <div class="d-flex flex-column align-center my-1">
                <div style="position: relative">
                  <item-icon :icon-class="fish.icon" style="min-width: 48px" />
                  <div
                    v-if="fish.hasWeatherConstraint"
                    style="position: absolute; right: -10px; bottom: -8px"
                  >
                    <div
                      v-for="(weather, index) in fish.weatherSetDetail"
                      :key="index"
                      :title="weather.name"
                      class="d-flex flex-column align-center"
                    >
                      <div :class="weather.icon" :title="weather.name" />
                      <!--                      <div class="ml-1">{{ weather.name }}</div>-->
                    </div>
                  </div>
                </div>
                <div class="text-subtitle-1" :title="fish.name + '#' + fish.id">
                  {{ toSimpleName(fish.name) }}
                </div>
                <div class="d-flex align-center">
                  <v-badge
                    inline
                    :content="`${fish.version}期`"
                    :color="versionColorOf(fish.version)"
                  ></v-badge>
                  <click-helper @click.stop :copy-text="fish.name">
                    <v-btn text icon small :title="$t('list.item.copyHint')">
                      <v-icon small>mdi-content-copy</v-icon>
                    </v-btn>
                  </click-helper>
                  <click-helper @click.stop="goToFishAngelPage(fish.anglerFishId)">
                    <v-btn text icon small :title="$t('list.item.linkHint')">
                      <v-icon small>mdi-link-variant</v-icon>
                    </v-btn>
                  </click-helper>
                </div>
              </div>
            </td>
            <td>
              <div>
                <div class="d-flex flex-column">
                  <div class="d-flex align-center">
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
                <div>
                  <v-divider />
                  <v-row no-gutters>
                    <v-col v-if="fish.biteTimeText !== ''" class="text-center">
                      咬钩：{{ fish.biteTimeText }}
                    </v-col>
                    <v-col v-if="fish.doubleHook !== 0" class="text-center">
                      双提 {{ fish.doubleHook ? fish.doubleHook : '-' }}
                    </v-col>
                  </v-row>
                  <v-divider />
                  <v-row no-gutters>
                    <v-col class="d-flex align-center justify-end">
                      <div class="mr-1">{{ fish.scrips }}</div>
                      <div>
                        <v-img :src="scripsIcon" width="24" height="24" />
                      </div>
                    </v-col>
                    <v-col class="d-flex align-center justify-end">
                      <div class="mr-1">{{ fish.points }}</div>
                      <div>
                        <v-icon small>mdi-plus-circle</v-icon>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
    <div class="col-12">
      <detail-item-map :fish="toFishingSpotData(spotData)" :expanded="false" />
    </div>
  </v-row>
</template>

<script>
import DiademFishListMixin from '@/components/DiademFishList/DiademFishListMixin'

export default {
  name: 'DiademFishListSmall',
  mixins: [DiademFishListMixin],
  methods: {
    toSimpleName(name) {
      if (name.match('[\u4e00-\u9fff]+')) {
        return `${name.slice(7)}`
      } else {
        return `${name.slice(21)}`
      }
    },
    versionColorOf(version) {
      switch (version) {
        case 2:
          return 'primary'
        case 3:
          return 'info'
        default:
          return 'primary'
      }
    },
  },
}
</script>

<style lang="sass" scoped></style>
