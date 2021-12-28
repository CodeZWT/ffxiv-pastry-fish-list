<template>
  <div v-if="!loading">
    <div v-if="fish.countDownType === WAITING">
      <v-progress-linear height="25" :color="fishingColor">
        <template>
          <v-tooltip top color="secondary">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" class="d-flex align-center">
                <strong>{{
                  $t(fish.countDownTypeName, { interval: countDownTimeText })
                }}</strong>
              </div>
            </template>
            <span>{{ fish.countDownTimePointText }}</span>
          </v-tooltip>
        </template>
      </v-progress-linear>
    </div>
    <div v-else-if="fish.countDownType === FISHING" style="height: 100%">
      <v-progress-linear
        :value="countDownRemainPercentage"
        height="25"
        :color="fishingColor"
      >
        <template v-slot="{ value }">
          <v-tooltip top color="secondary">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" class="d-flex align-center">
                <v-icon size="20">{{ mdiAlarm }}</v-icon>
                <strong>
                  {{ $t(fish.countDownTypeName, { interval: countDownTimeText }) }}
                  ({{ value }}%)
                </strong>
                <effect-icon
                  v-if="fish.addBuffSuffix"
                  :icon-class="fish.predatorsIcon"
                  :title="$t('list.item.countDown.fishShadowHint')"
                  style="margin-left: 2px"
                />
              </div>
            </template>
            <span>{{ fish.countDownTimePointText }}</span>
          </v-tooltip>
        </template>
      </v-progress-linear>
    </div>
    <div
      v-else-if="
        !fish.checkInfo ||
          (!fish.checkInfo.timeRestricted && !fish.checkInfo.weatherRestricted)
      "
      style="height: 100%"
    >
      <v-progress-linear :value="100" height="25" :color="fishingColor">
        <template>
          <strong>{{ $t(fish.countDownTypeName) }}</strong>
        </template>
      </v-progress-linear>
    </div>
    <div v-else class="d-flex justify-center">
      <v-icon small color="warning">{{ mdiAlertOutline }}</v-icon>
      <span class="warning--text">开荒中</span>
    </div>
  </div>
  <div v-else>
    <v-progress-linear :value="100" height="25" :color="fishingColor">
      <template>
        <strong>{{ $t('detail.countDown.loading') }}</strong>
      </template>
    </v-progress-linear>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiAlarm, mdiAlertOutline } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import EffectIcon from '@/components/basic/EffectIcon'
import _ from 'lodash'

export default {
  name: 'DetailItemCountdownBar',
  components: { EffectIcon },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
  },
  data: () => ({
    mdiAlarm,
    mdiAlertOutline,
    FISHING: DataUtil.FISHING,
    WAITING: DataUtil.WAITING,
    loading: true,
    countDownTimeText: '',
    countDownRemainPercentage: undefined,
  }),
  computed: {
    ...mapState(['now']),
    countDownTime() {
      return this.fish.countDownTimePoint - this.now
    },
    fishingColor() {
      return DataUtil.getColorByStatus(
        this.$vuetify.theme.currentTheme,
        this.fish.isCompleted,
        this.fish.countDownType
      )
    },
  },
  watch: {
    'fish.id': {
      handler: function() {
        this.loading =
          this.fish.countDownType !== DataUtil.ALL_AVAILABLE &&
          this.fish.countDownTime > DataUtil.INTERVAL_MINUTE
        setTimeout(() => (this.loading = false), 500)
      },
      immediate: true,
    },
    countDownTime(countDownTime) {
      const newCountDownTimeText = this.printCountDownTime(countDownTime, 2)
      if (!_.isEqual(this.countDownTimeText, newCountDownTimeText)) {
        this.countDownTimeText = newCountDownTimeText
      }

      const newPercentage = Math.ceil((countDownTime / this.fish.countDownTotal) * 100)
      if (this.countDownRemainPercentage !== newPercentage) {
        this.countDownRemainPercentage = newPercentage
      }
    },
  },
  methods: {
    printCountDownTime: DataUtil.printCountDownTime,
  },
}
</script>

<style scoped></style>
