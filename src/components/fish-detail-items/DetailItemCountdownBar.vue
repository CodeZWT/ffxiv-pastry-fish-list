<template>
  <div v-if="!loading">
    <div v-if="fish.countDownType === WAITING">
      <v-progress-linear height="25" :color="fishingColor">
        <template>
          <v-tooltip top color="secondary">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" class="d-flex align-center">
                <strong>{{ $t(fish.countDownTypeName) }} {{ fish.countDownTimeText }}</strong>
              </div>
            </template>
            <span>{{ fish.countDownTimePointText }}</span>
          </v-tooltip>
        </template>
      </v-progress-linear>
    </div>
    <div v-else-if="fish.countDownType === FISHING" style="height: 100%">
      <v-progress-linear :value="fish.countDownRemainPercentage" height="25" rounded :color="fishingColor">
        <template v-slot="{ value }">
          <v-tooltip top color="secondary">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" class="d-flex align-center">
                <v-icon size="20">mdi-alarm</v-icon>
                <strong>{{ $t(fish.countDownTypeName) }} {{ fish.countDownTimeText }} ({{ Math.ceil(value) }}%)</strong>
                <div
                  v-if="fish.addBuffSuffix"
                  :title="$t('list.item.countDown.fishShadowHint')"
                  :class="fish.predatorsIcon"
                  style="margin-left: 2px"
                />
              </div>
            </template>
            <span>{{ fish.countDownTimePointText }}</span>
          </v-tooltip>
        </template>
      </v-progress-linear>
    </div>
    <div v-else style="height: 100%">
      <v-progress-linear :value="100" height="25" rounded :color="fishingColor">
        <template>
          <strong>{{ $t(fish.countDownTypeName) }}</strong>
        </template>
      </v-progress-linear>
    </div>
  </div>
  <div v-else>
    <v-progress-linear :value="100" height="25" rounded :color="fishingColor">
      <template>
        <strong>{{ $t('detail.countDown.loading') }}</strong>
      </template>
    </v-progress-linear>
  </div>
</template>

<script>
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'DetailItemCountdownBar',
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
  },
  data: () => ({
    FISHING: DataUtil.FISHING,
    WAITING: DataUtil.WAITING,
    loading: true,
  }),
  computed: {
    fishingColor() {
      return DataUtil.getColorByStatus(this.fish.isCompleted, this.fish.countDownType)
    },
  },
  watch: {
    'fish.id': {
      handler: function() {
        this.loading =
          this.fish.countDownType !== DataUtil.ALL_AVAILABLE && this.fish.countDownTime > DataUtil.INTERVAL_MINUTE
        setTimeout(() => (this.loading = false), 500)
      },
      immediate: true,
    },
  },
}
</script>

<style scoped></style>