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
            <div :class="weather.icon" :title="weather.name" />
          </div>
          <v-icon v-if="fish.previousWeatherSet.length > 0">
            mdi-arrow-right
          </v-icon>
          <div
            v-for="(weather, index) in fish.weatherSetDetail"
            :key="`curr-${index}`"
            :title="weather.name"
          >
            <div :class="weather.icon" :title="weather.name" />
          </div>
        </div>
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
                <div class="bg-011103"></div>
              </div>
            </template>
            <div>
              时间条件在鱼眼模式下忽略
            </div>
          </v-tooltip>
        </div>
        <div v-else>
          {{ $t('none') }}
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import { mapGetters } from 'vuex'

export default {
  name: 'DetailItemRequirements',
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    isTimeCheckSkipped() {
      return DataUtil.skipTimeCheckOf(this.fish, this.fishEyesUsed)
    },
    ...mapGetters(['fishEyesUsed']),
  },
}
</script>

<style scoped></style>
