<template>
  <div>
    <v-card outlined class="mt-2">
      <v-card-title>
        <div class="d-flex justify-center">
          <div>{{ location.mainName }}</div>
          <v-icon>{{ location.icon }}</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-if="normalFish.length === 0">无</div>
        <div v-else v-for="(fish, index) in normalFish" :key="index">
          <fish-tip :fish="fish" show-achievement-tip />
        </div>
      </v-card-text>
    </v-card>

    <v-card outlined color="info" class="mt-2">
      <v-card-title>
        <div class="d-flex justify-center">
          <div>{{ location.subName }}</div>
          <v-icon>{{ location.icon }}</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-if="spectralCurrentFish.length === 0">无</div>
        <div v-else v-for="(fish, index) in spectralCurrentFish" :key="index">
          <fish-tip :fish="fish" show-achievement-tip />
        </div>
      </v-card-text>
    </v-card>

    <v-card outlined class="mt-2">
      <v-card-subtitle>
        <div class="d-flex align-center">
          <a :href="oceanFishTipReference.link" target="_blank">
            {{ oceanFishTipReference.title }}
          </a>
          <v-spacer />
          <div>
            {{ oceanFishTipReference.author }}
          </div>
        </div>
      </v-card-subtitle>
      <!-- <v-card-subtitle>{{ achievementId }}-{{ location.id }}</v-card-subtitle> -->
      <v-card-text>
        <click-helper
          @click.stop
          :copy-text="toMacro(tip[achievementId][location.id])"
          style="position: absolute; right: 8px"
        >
          <v-btn text icon small title="复制宏">
            <v-icon small>{{ mdiContentCopy }}</v-icon>
          </v-btn>
        </click-helper>
        <pre class="tip-macro">{{ toText(tip[achievementId][location.id]) }}</pre>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { OCEAN_FISHING_TIPS } from 'Data/oceanFishing'
import { mdiContentCopy } from '@mdi/js'
import ClickHelper from '@/components/basic/ClickHelper'
import FishTip from '@/components/OceanFishing54/OceanFishingVoyage/FishTip'

export default {
  name: 'AchievementTip',
  components: { ClickHelper, FishTip },
  props: {
    achievementId: {
      type: Number,
      default: undefined,
    },
    location: {
      type: Object,
      default: undefined,
    },
    normalFish: {
      type: Array,
      default: () => [],
    },
    spectralCurrentFish: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      mdiContentCopy,
      oceanFishTipReference: OCEAN_FISHING_TIPS.tip3,
      tip: OCEAN_FISHING_TIPS.tip3.achievementTip,
    }
  },
  methods: {
    toText(textArray) {
      return textArray.join('\n')
    },
    toMacro(textArray) {
      const divider =
        '- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -'
      return [divider, ...textArray, divider].map(it => '/p ' + it).join('\n')
    },
  },
}
</script>

<style lang="sass" scoped>
.tip-macro
  white-space: pre-wrap       /* Since CSS 2.1 */
  white-space: -moz-pre-wrap  /* Mozilla, since 1999 */
  white-space: -o-pre-wrap    /* Opera 7 */
  word-wrap: break-word       /* Internet Explorer 5.5+ */
</style>
