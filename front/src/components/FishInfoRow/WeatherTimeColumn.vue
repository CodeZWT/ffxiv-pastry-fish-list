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
            <weather-icon
              :icon-class="weather.icon"
              :title="weather.name"
              type="weather"
            />
          </div>
          <v-icon v-if="fish.previousWeatherSet.length > 0" small>
            mdi-arrow-right
          </v-icon>
          <div
            v-for="weather in fish.weatherSetDetail"
            :key="weather.name"
            class="zoom-in-predator"
          >
            <weather-icon
              :icon-class="weather.icon"
              :title="weather.name"
              type="weather"
            />
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

    <div v-if="mark.all" class="ml-1 pb-1">
      <rc-tooltip top color="secondary" max-width="300">
        <v-icon>{{ mark.all.icon }}</v-icon>
        <template v-slot:msg>
          <div v-html="mark.all.comment"></div>
        </template>
      </rc-tooltip>
    </div>
  </div>
</template>

<script>
import { SystemInfo } from 'Data/version'
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
      switch (this.fish.id) {
        case 33244:
          return {
            time: {
              icon: 'mdi-help-circle',
              comment:
                '根据咬钩报告，长吻帆蜥鱼窗口期拓展至ET 2:01，更多的拓展空间请自行探索。同时也欢迎汇报范围外的数据。',
            },
          }
        case 4906:
          return {
            all: {
              icon: 'mdi-information',
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: '鹦鹉螺',
                  preconditionFish: '满月沙丁鱼',
                }) +
                '<br />' +
                this.$t('list.tip.moochTip', { fish: '鹦鹉螺', moochFish: '满月沙丁鱼' }),
            },
          }
        case 4918:
          return {
            all: {
              icon: 'mdi-information',
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: '腔棘鱼',
                  preconditionFish: '满月沙丁鱼',
                }) +
                '<br />' +
                this.$t('list.tip.moochTip', { fish: '腔棘鱼', moochFish: '满月沙丁鱼' }),
            },
          }
        case 52004903:
          return {
            all: {
              icon: 'mdi-information',
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: '银鲨',
                  preconditionFish: '满月沙丁鱼',
                }) +
                '<br />' +
                this.$t('list.tip.moochTip', { fish: '银鲨', moochFish: '满月沙丁鱼' }),
            },
          }

        case 8763:
          return {
            all: {
              icon: 'mdi-information',
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: '杀手库诺',
                  preconditionFish: '加诺',
                }) +
                '<br />' +
                this.$t('list.tip.fisherIntuitionTip', { fish: '杀手库诺' }),
            },
          }
        case 8775:
          return {
            all: {
              icon: 'mdi-information',
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: '波太郎',
                  preconditionFish: '大泷太郎',
                }) +
                '<br />' +
                this.$t('list.tip.fisherIntuitionTip', { fish: '波太郎' }),
            },
          }
        case 24992:
          return {
            all: {
              icon: 'mdi-information',
              comment:
                '胸脊鲨只有时间限制，左侧显示的倒计时根据雕塑家窗口期进行“转换”。<br />' +
                '转换指：无论雕塑家是12-16ET或16-18ET或12-18ET，胸脊鲨的窗口期视为当天的16-18ET。<br />' +
                '理由是无论在何种情况下钓上雕塑家都可在16-18ET时间段内触发捕鱼人之识尝试钓上胸脊鲨。<br />' +
                '小提示：这意味着只要在16-18ET触发捕鱼人之识就有机会钓上胸脊鲨，详细操作请见攻略。',
            },
          }
        case 24994:
          return {
            all: {
              icon: 'mdi-information',
              comment:
                '七彩天主没有天气与时间限制，左侧显示的倒计时根据绿彩鱼窗口期进行“拓展”。<br />' +
                '拓展指：若绿彩鱼当天的窗口期为8-16ET，则向前拓展，变为0-16ET。<br />' +
                '理由是总能在0-4ET和4-8ET分别尝试钓蓝彩鱼和橙彩鱼。<br />' +
                (SystemInfo.region === 'Global'
                  ? '国际服开启鱼眼时，将直接同步显示绿彩鱼CD。<br />'
                  : '') +
                this.$t('list.tip.fisherIntuitionTip', { fish: '七彩天主' }),
            },
          }
        case 24203:
          return {
            all: {
              icon: 'mdi-information',
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: '蓝彩鱼',
                  preconditionFish: '紫彩鱼',
                }) +
                '<br />' +
                this.$t('list.tip.moochTip', { fish: '蓝彩鱼', moochFish: '紫彩鱼' }),
            },
          }
        case 23056:
          return {
            all: {
              icon: 'mdi-information',
              comment:
                this.$t('list.tip.fishCountdownReferTo', {
                  fish: '橙彩鱼',
                  preconditionFish: '红彩鱼',
                }) +
                '<br />' +
                this.$t('list.tip.moochTip', { fish: '橙彩鱼', moochFish: '红彩鱼' }),
            },
          }
        case 33240:
          return {
            all: {
              icon: 'mdi-information',
              comment:
                '自走鱼偶只有时间限制，左侧显示的倒计时根据变影鱼窗口期进行“拓展”。<br />' +
                '拓展指：自走鱼偶的窗口期视为可钓上变影鱼的当天10-16ET。<br />' +
                '小提示：这意味着只要在10-16ET触发捕鱼人之识就有机会钓上自走鱼偶。',
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
