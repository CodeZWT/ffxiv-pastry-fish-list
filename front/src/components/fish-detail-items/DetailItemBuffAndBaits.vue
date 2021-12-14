<template>
  <div
    v-if="fish.checkInfo && fish.checkInfo.bestCatchPathUnknown"
    class="d-flex justify-center align-center"
  >
    <v-icon small color="warning">mdi-alert-outline</v-icon>
    <span class="warning--text">开荒中</span>
  </div>
  <div v-else class="d-flex justify-center align-center">
    <v-row no-gutters>
      <v-col cols="6" class="d-flex flex-column align-center">
        <div class="d-flex justify-center">{{ $t('detail.buff.title') }}</div>
        <div v-if="fish.hasPredators">
          <div class="d-flex flex-column align-center">
            <effect-icon :icon-class="fish.predatorsIcon" />
            <div>
              {{ fish.fishersIntuitionText }}
            </div>
          </div>
        </div>
        <div v-if="fish.hasShadowPredators">需要触发鱼影</div>
        <div v-if="fish.hasSnagging">
          <effect-icon :icon-class="fish.snaggingIcon" data-ck-action-name="钓组" />
        </div>
        <div v-if="!fish.hasPredators && !fish.hasSnagging && !fish.hasShadowPredators">
          {{ $t('none') }}
        </div>
      </v-col>

      <v-col cols="6" class="d-flex flex-column align-center">
        <div class="d-flex justify-center">
          {{
            isSpearFish
              ? isEndWalker
                ? $t('detail.fishSize.title')
                : $t('detail.gigSize.title')
              : $t('detail.baits.title')
          }}
        </div>
        <div v-if="fish.type === 'normal'" class="d-flex">
          <div class="d-flex align-center">
            <i
              class="xiv square-a"
              v-if="fish.baitsExtra.length > 0"
              title="一种可能情况A"
            />
            <fish-bait-list :baits="fish.baits" :target="fish" />
          </div>
          <template v-if="fish.baitsExtra.length > 0">
            <div class="d-flex align-center">
              <i class="xiv square-b" title="另一种可能情况B" />
              <fish-bait-list :baits="fish.baitsExtra" :target="fish" />
            </div>
          </template>
        </div>
        <div v-else class="d-flex flex-column align-center">
          <template v-if="isEndWalker">
            <v-img
              :src="fish.size.icon"
              :max-height="56 * fish.size.sizeFactor"
              :max-width="128"
              contain
            ></v-img>
            <div>{{ fish.size.text }}</div>
          </template>
          <template v-else class="d-flex align-center">
            <item-icon :icon-class="fish.gig.icon" :title="fish.gig.text" />
            <div>{{ fish.gig.text }}</div>
          </template>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { SystemInfo } from 'Data/version'
import DataUtil from '@/utils/DataUtil'
import EffectIcon from '@/components/basic/EffectIcon'
import FishBaitList from '@/components/FishBaitList'
import ItemIcon from '@/components/basic/ItemIcon'

export default {
  name: 'DetailItemBuffAndBaits',
  components: { EffectIcon, ItemIcon, FishBaitList },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    isSpearFish() {
      return this.fish.type === 'spear'
    },
    isEndWalker() {
      return SystemInfo.region === 'Global'
    },
  },
  methods: {
    secondsToMinutesString: DataUtil.secondsToMinutesString,
  },
}
</script>

<style scoped></style>
