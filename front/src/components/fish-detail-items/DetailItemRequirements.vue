<template>
  <v-row no-gutters>
    <v-col cols="6">
      <div class="d-flex justify-center">{{ $t('detail.requirements.weather') }}</div>
      <div class="d-flex justify-center" v-if="fish.hasWeatherConstraint">
        <div style="display: flex">
          <div
            v-for="(weather, index) in fish.previousWeatherSetDetail"
            :key="`prev-${index}`"
            :title="weather.name"
          >
            <weather-icon
              :icon-class="weather.icon"
              :title="weather.name"
              type="weather"
            />
          </div>
          <v-icon v-if="fish.previousWeatherSet.length > 0"> {{ mdiArrowRight }} </v-icon>
          <div
            v-for="(weather, index) in fish.weatherSetDetail"
            :key="`curr-${index}`"
            :title="weather.name"
          >
            <weather-icon
              :icon-class="weather.icon"
              :title="weather.name"
              type="weather"
            />
          </div>
        </div>
      </div>
      <div
        v-else-if="fish.checkInfo && fish.checkInfo.weatherRestricted"
        class="text-center"
      >
        {{ $t('list.item.weatherConstraint') }}
      </div>
      <div class="d-flex justify-center" v-else>
        {{ $t('none') }}
      </div>
    </v-col>
    <v-col cols="6">
      <div class="d-flex justify-center">{{ $t('detail.requirements.time') }}</div>
      <div class="d-flex justify-center">
        <div v-if="fish.hasTimeConstraint" class="d-flex align-center">
          <div
            :class="{
              'text-decoration-line-through': isTimeCheckSkipped,
              'mr-1': isTimeCheckSkipped,
            }"
          >
            {{ fish.startHourText }} - {{ fish.endHourText }}
          </div>
          <v-tooltip v-if="isTimeCheckSkipped" bottom color="secondary">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <effect-icon :icon-class="iconIdToClass(11103)" />
              </div>
            </template>
            <div>{{ $t('list.item.fishEyesTip') }}</div>
          </v-tooltip>
        </div>
        <div v-else-if="fish.checkInfo && fish.checkInfo.timeRestricted">
          {{ $t('list.item.timeConstraint') }}
        </div>
        <div v-else>
          {{ $t('none') }}
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { mdiArrowRight } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import EffectIcon from '@/components/basic/EffectIcon'
import WeatherIcon from '@/components/basic/WeatherIcon'

export default {
  name: 'DetailItemRequirements',
  components: { EffectIcon, WeatherIcon },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      mdiArrowRight,
    }
  },
  computed: {
    isTimeCheckSkipped() {
      return DataUtil.skipTimeCheckOf(this.fish, this.fishEyesUsed)
    },
    ...mapGetters(['fishEyesUsed']),
  },
  methods: {
    iconIdToClass: DataUtil.iconIdToClass,
  },
}
</script>

<style scoped></style>
