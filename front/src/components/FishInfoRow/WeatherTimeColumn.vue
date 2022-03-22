<template>
  <div class="d-flex justify-center align-center fill-height">
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
              <effect-icon :icon-class="iconIdToClass(11103)" />
            </div>
          </template>
          <div>{{ $t('list.item.fishEyesTip') }}</div>
        </v-tooltip>
      </div>
      <div v-else-if="fish.checkInfo.timeRestricted">
        {{ $t('list.item.timeConstraint') }}
      </div>
      <div class="d-flex align-center" v-if="fish.hasWeatherConstraint">
        <div
          v-for="(weather, index) in fish.previousWeatherSetDetail"
          :key="index"
          class="zoom-in-predator"
        >
          <weather-icon :icon-class="weather.icon" :title="weather.name" type="weather" />
        </div>
        <v-icon v-if="fish.previousWeatherSet.length > 0" small>
          {{ mdiArrowRight }}
        </v-icon>
        <div
          v-for="weather in fish.weatherSetDetail"
          :key="weather.name"
          class="zoom-in-predator"
        >
          <weather-icon :icon-class="weather.icon" :title="weather.name" type="weather" />
        </div>
      </div>
      <div v-else-if="fish.checkInfo.weatherRestricted">
        {{ $t('list.item.weatherConstraint') }}
      </div>
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

    <div v-if="mark.all" class="ml-1 pb-1">
      <rc-tooltip top color="secondary" max-width="300">
        <v-icon>{{ mark.all.icon }}</v-icon>
        <template v-slot:msg>
          <div class="text-pre-line" v-text="mark.all.comment"></div>
        </template>
      </rc-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mdiArrowRight, mdiHelpCircle, mdiInformation } from '@mdi/js'
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
  data() {
    return {
      mdiArrowRight,
      mdiHelpCircle,
      mdiInformation,
    }
  },
  computed: {
    ...mapGetters(['fishEyesUsed']),
    isTimeCheckSkipped() {
      return DataUtil.skipTimeCheckOf(this.fish, this.fishEyesUsed)
    },
    mark() {
      switch (this.fish.id) {
        case 33244:
          return {
            time: {
              icon: mdiHelpCircle,
              comment: this.$t('investigation.special.fish-33244'),
            },
          }
        case 4906:
          return {
            all: {
              icon: mdiInformation,
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: DataUtil.getItemName(4906),
                  preconditionFish: DataUtil.getItemName(4898),
                }) +
                '\n' +
                this.$t('list.tip.moochTip', {
                  fish: DataUtil.getItemName(4906),
                  moochFish: DataUtil.getItemName(4898),
                }),
            },
          }
        case 4918:
          return {
            all: {
              icon: mdiInformation,
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: DataUtil.getItemName(4918),
                  preconditionFish: DataUtil.getItemName(4898),
                }) +
                '\n' +
                this.$t('list.tip.moochTip', {
                  fish: DataUtil.getItemName(4918),
                  moochFish: DataUtil.getItemName(4898),
                }),
            },
          }
        case 52004903:
          return {
            all: {
              icon: mdiInformation,
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: DataUtil.getItemName(4903),
                  preconditionFish: DataUtil.getItemName(4898),
                }) +
                '\n' +
                this.$t('list.tip.moochTip', {
                  fish: DataUtil.getItemName(4903),
                  moochFish: DataUtil.getItemName(4898),
                }),
            },
          }

        case 8763:
          return {
            all: {
              icon: mdiInformation,
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: DataUtil.getItemName(8763),
                  preconditionFish: DataUtil.getItemName(8762),
                }) +
                '\n' +
                this.$t('list.tip.fisherIntuitionTip', {
                  fish: DataUtil.getItemName(8763),
                }),
            },
          }
        case 8775:
          return {
            all: {
              icon: mdiInformation,
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: DataUtil.getItemName(8775),
                  preconditionFish: DataUtil.getItemName(8774),
                }) +
                '\n' +
                this.$t('list.tip.fisherIntuitionTip', {
                  fish: DataUtil.getItemName(8775),
                }),
            },
          }
        case 24992:
          return {
            all: {
              icon: mdiInformation,
              comment: this.$t('list.item.countDown.tip.24992'),
            },
          }
        case 24994:
          return {
            all: {
              icon: mdiInformation,
              comment:
                this.$t('list.item.countDown.tip.24994') +
                this.$t('list.tip.fisherIntuitionTip', {
                  fish: DataUtil.getItemName(24994),
                }),
            },
          }
        case 24203:
          return {
            all: {
              icon: mdiInformation,
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: DataUtil.getItemName(24203),
                  preconditionFish: DataUtil.getItemName(21177),
                }) +
                '\n' +
                this.$t('list.tip.moochTip', {
                  fish: DataUtil.getItemName(24203),
                  moochFish: DataUtil.getItemName(21177),
                }),
            },
          }
        case 23056:
          return {
            all: {
              icon: mdiInformation,
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: DataUtil.getItemName(23056),
                  preconditionFish: DataUtil.getItemName(22397),
                }) +
                '\n' +
                this.$t('list.tip.moochTip', {
                  fish: DataUtil.getItemName(23056),
                  moochFish: DataUtil.getItemName(22397),
                }),
            },
          }
        case 33240:
          return {
            all: {
              icon: mdiInformation,
              comment: this.$t('list.item.countDown.tip.33240'),
            },
          }
        default:
          return {}
      }
    },
  },
  methods: {
    iconIdToClass: DataUtil.iconIdToClass,
  },
}
</script>

<style scoped></style>
