<template>
  <div>
    <v-expansion-panels hover flat tile v-model="lazyExpansionValue">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div style="display: flex; align-items: center; justify-content: center">
            <div class="text-subtitle-1">
              {{ fish.zone }}
            </div>
            <div v-if="fish.zone !== fish.fishingSpotName" class="text-subtitle-1 ml-2" :title="fish.fishingSpotId">
              {{ fish.fishingSpotName }}
            </div>
            <div class="text-subtitle-1 ml-2">({{ fish.fishSpotPositionText }})</div>
            <click-helper @click.stop :copy-text="fish.fishingSpotName">
              <v-btn class="my-2" text icon :title="$t('list.item.copyHint')">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </click-helper>
            <click-helper @click.stop="goToFishingSpotAngelPage(fish.anglerLocationId)">
              <v-btn class="my-2" text icon :title="$t('list.item.linkHint')">
                <v-icon>mdi-link-variant</v-icon>
              </v-btn>
            </click-helper>
          </div>
        </v-expansion-panel-header>
      </v-expansion-panel>
    </v-expansion-panels>
    <div v-if="lazyExpansionValue === 0" style="width: 100%; height: 512px" class="d-flex justify-center mt-4">
      <div style="width: 100%; max-width: 512px">
        <eorzea-simple-map
          ref="simpleMap"
          :debug="false"
          :id="fish.fishingSpot.mapFileId"
          :x="fish.fishingSpot.x"
          :y="fish.fishingSpot.y"
          :size-factor="fish.fishingSpot.size_factor"
          :marker-radius="fish.fishingSpot.radius"
          :fishing-spot-name="getName(fish.fishingSpot)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ClickHelper from '@/components/basic/ClickHelper'
import EorzeaSimpleMap from '@/components/basic/EorzeaSimpleMap'
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'DetailItemMap',
  components: { ClickHelper, EorzeaSimpleMap },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
  },
  data: vm => ({
    lazyExpansionValue: vm.expanded ? 0 : undefined,
  }),
  created() {
    this.lazyExpansionValue = this.expanded ? 0 : undefined
  },
  watch: {
    expanded(expanded) {
      this.lazyExpansionValue = expanded ? 0 : undefined
    },
  },
  methods: {
    goToFishingSpotAngelPage(anglerLocationId) {
      window.open(`https://cn.ff14angler.com/?spot=${anglerLocationId}`)
    },

    getName: DataUtil.getName,
  },
}
</script>

<style scoped></style>