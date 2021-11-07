<template>
  <div class="d-flex flex-column justify-center align-center fill-height">
    <div v-if="fish.hasTimeConstraint" class="d-flex align-center">
      <div
        :class="{
          'text-decoration-line-through': isTimeCheckSkipped,
          'mr-1': isTimeCheckSkipped,
        }"
      >
        {{ fish.startHourText }} - {{ fish.endHourText }}
      </div>
      <div v-if="mark.time" class="ml-1 pb-1">
        <rc-tooltip top color="secondary" max-width="300">
          <v-icon small>{{ mark.time.icon }}</v-icon>
          <template v-slot:msg> {{ mark.time.comment }} </template>
        </rc-tooltip>
      </div>
      <v-tooltip v-if="isTimeCheckSkipped" bottom color="secondary">
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <effect-icon icon-class="bg-011103" />
          </div>
        </template>
        <div>时间条件在鱼眼模式下忽略</div>
      </v-tooltip>
    </div>
    <div v-else-if="fish.checkInfo.timeRestricted">有时间限制</div>
    <div class="d-flex" v-if="fish.hasWeatherConstraint">
      <div style="display: flex">
        <div
          v-for="(weather, index) in fish.previousWeatherSetDetail"
          :key="index"
          class="zoom-in-predator"
        >
          <weather-icon :icon-class="weather.icon" :title="weather.name" type="weather" />
        </div>
        <v-icon v-if="fish.previousWeatherSet.length > 0" small> mdi-arrow-right </v-icon>
        <div
          v-for="weather in fish.weatherSetDetail"
          :key="weather.name"
          class="zoom-in-predator"
        >
          <weather-icon :icon-class="weather.icon" :title="weather.name" type="weather" />
        </div>
      </div>
    </div>
    <div v-else-if="fish.checkInfo.weatherRestricted">有天气限制</div>
    <div
      v-if="
        !fish.hasTimeConstraint &&
          !fish.hasWeatherConstraint &&
          !fish.checkInfo.timeRestricted &&
          !fish.checkInfo.weatherRestricted
      "
    >
      {{ $t('list.item.noConstraint') }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import EffectIcon from '@/components/basic/EffectIcon'
import RcTooltip from '@/components/basic/RcTooltip'
import WeatherIcon from '@/components/basic/WeatherIcon'

export default {
  name: 'WeatherTimeColumn',
  components: { RcTooltip, EffectIcon, WeatherIcon },
  props: {
    fish: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters(['fishEyesUsed']),
    isTimeCheckSkipped() {
      return DataUtil.skipTimeCheckOf(this.fish, this.fishEyesUsed)
    },
    mark() {
      if (this.fish.id === 33244) {
        return {
          time: {
            icon: 'mdi-help-circle',
            comment:
              '根据咬钩报告，长吻帆蜥鱼窗口期拓展至ET 2:01，更多的拓展空间请自行探索。同时也欢迎汇报范围外的数据。',
          },
        }
      } else {
        return {}
      }
    },
  },
}
</script>

<style scoped></style>
