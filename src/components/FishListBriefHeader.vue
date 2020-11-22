<template>
  <div style="width: 100%">
    <!--    <div-->
    <!--      v-if="!inPredator"-->
    <!--      style="position: absolute; top: 10%; bottom: 10%; left: 2px; width: 4px; z-index: 1;border-radius: 2px"-->
    <!--      :class="color"-->
    <!--    />-->
    <!--    <div v-if="showDivider" style="position: absolute; top: 0; width: 100%; height: 2px; z-index: 1" class="error" />-->

    <!--    <pin-button :value="transformedFishPart.pinned" @input="setPinned($event)" />-->
    <v-divider v-if="inPredator && mode !== 'CONTENT'" inset style="border-color: white" />
    <v-row no-gutters class="d-flex justify-center align-content-center" style="width: 100%">
      <v-col class="col-6 col-sm-3">
        <div class="d-flex fill-height align-center flex-row pr-1" style="min-height: 48px">
          <div
            class="d-flex align-center"
            :style="{
              visibility: mode !== 'CONTENT' && inPredator ? 'hidden' : 'visible',
              'flex-direction': mode === 'CONTENT' ? 'column' : 'row',
            }"
          >
            <toggle-button
              :value="transformedFishPart.pinned"
              @input="setPinned($event)"
              checked-icon="mdi-pin"
              unchecked-icon="mdi-pin-outline"
            />
            <toggle-button v-if="!isMobile" :value="transformedFishPart.completed" @input="setCompleted($event)" />
          </div>

          <v-badge v-if="inPredator" :content="fish.requiredCnt" color="quaternary black--text" overlap bottom bordered>
            <div style="width: 40px; height: 40px" :class="{ 'zoom-in-predator': inPredator }">
              <div :class="fish.icon" />
            </div>
          </v-badge>
          <div v-else style="width: 40px; height: 40px" :class="{ 'zoom-in-predator': inPredator }">
            <div :class="fish.icon" />
          </div>
          <div class="text-subtitle-1 text-truncate ml-1" :title="fish.name + '#' + fish.id">{{ fish.name }}</div>
        </div>
      </v-col>
      <v-col v-if="!isMobile" class="col-3 d-flex flex-column justify-center my-2 my-sm-0">
        <div class="text-subtitle-2 d-flex">
          <div>
            {{ $t(transformedFishTimePart.countDownType) }}
          </div>
          <div v-if="fish.rate < 1">
            <v-tooltip right color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">({{ fish.rateText }})</div>
              </template>
              <div class="d-flex flex-column">
                <div>{{ $t('list.item.rateHint') }}</div>
              </div>
            </v-tooltip>
          </div>
        </div>
        <div v-if="transformedFishTimePart.hasCountDown" class="d-flex align-center">
          <div>
            <v-tooltip right color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  v-bind="attrs"
                  v-on="on"
                  :input-value="transformedFishPart.toBeNotified"
                  small
                  outlined
                  color="white"
                  class="mr-1"
                  @click.stop="setToBeNotified(!transformedFishPart.toBeNotified)"
                >
                  <v-icon left size="16">
                    {{ transformedFishPart.toBeNotified ? 'mdi-bell' : 'mdi-bell-outline' }}
                  </v-icon>
                  <div v-bind="attrs" v-on="on" class="text-subtitle-2">
                    {{ transformedFishTimePart.countDownTimeText }}
                  </div>
                </v-chip>
              </template>
              <div class="d-flex flex-column">
                <div>{{ transformedFishTimePart.countDownTimePointText }}</div>
                <div v-if="transformedFishPart.toBeNotified">{{ $t('list.item.notificationHintOff') }}</div>
                <div v-else>{{ $t('list.item.notificationHint') }}</div>
              </div>
            </v-tooltip>
          </div>
          <div
            v-if="fish.addBuffSuffix && transformedFishTimePart.isFishing"
            :title="$t('list.item.countDown.fishShadowHint')"
            :class="fish.predatorsIcon"
            style="margin-left: 2px"
          />
          <div>
            <v-tooltip v-if="transformedFishTimePart.isFishing" right color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="text-subtitle-2">
                  {{ transformedFishTimePart.countDownNextInterval }}
                </div>
              </template>
              <span>{{ transformedFishTimePart.countDownNextTimePointText }}</span>
            </v-tooltip>
          </div>
          <div>
            <v-tooltip v-if="transformedFishTimePart.isWaiting" right color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="text-subtitle-2">
                  ({{ transformedFishTimePart.countDownTotal }})
                </div>
              </template>
              <span>{{ transformedFishTimePart.countDownTotalHint }}</span>
            </v-tooltip>
          </div>
        </div>
      </v-col>
      <v-col class="col-6 col-sm-3 d-flex flex-column justify-center">
        <div v-if="showConstraintsInstead && fish.hasTimeConstraint">
          {{ fish.startHourText }} - {{ fish.endHourText }}
        </div>
        <div class="d-flex" v-if="showConstraintsInstead && fish.hasWeatherConstraint">
          <div style="display: flex">
            <div v-for="(weather, index) in fish.previousWeatherSetDetail" :key="index" class="zoom-in-predator">
              <div :class="weather.icon" :title="weather.name" />
            </div>
            <v-icon v-if="fish.previousWeatherSet.length > 0" small>
              mdi-arrow-right
            </v-icon>
            <div v-for="weather in fish.weatherSetDetail" :key="weather.name" class="zoom-in-predator">
              <div :class="weather.icon" :title="weather.name" />
            </div>
          </div>
        </div>

        <!--        <div class="text-subtitle-2 text-truncate" v-if="!inPredator">-->
        <!--          {{ fish.zone }}-->
        <!--        </div>-->
        <!--        <div-->
        <!--          v-if="!inPredator"-->
        <!--          class="text-subtitle-2 text-truncate"-->
        <!--          :title="fish.fishingSpot + '#' + fish.fishingSpotId"-->
        <!--        >-->
        <!--          {{ fish.fishingSpot }}-->
        <!--        </div>-->
        <div v-if="!showConstraintsInstead">
          <fishing-spot-column :fishing-spots="fish.fishingSpots" />
        </div>
        <div v-if="isMobile && !transformedFishTimePart.hasCountDown" class="text-subtitle-2">
          {{ $t(transformedFishTimePart.countDownType) }}
        </div>
        <div v-else-if="isMobile" class="d-flex align-center">
          <div>
            <v-tooltip top color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  v-bind="attrs"
                  v-on="on"
                  :input-value="transformedFishPart.toBeNotified"
                  small
                  outlined
                  color="white"
                  class="mr-1"
                  @click.stop="setToBeNotified(!transformedFishPart.toBeNotified)"
                >
                  <v-icon left size="16">
                    {{ transformedFishPart.toBeNotified ? 'mdi-bell' : 'mdi-bell-outline' }}
                  </v-icon>

                  <div v-bind="attrs" v-on="on" class="text-subtitle-2">
                    {{ transformedFishTimePart.countDownTimeText }}
                  </div>
                </v-chip>
              </template>
              <div class="d-flex flex-column">
                <div>{{ transformedFishTimePart.countDownTimePointText }}</div>
                <div v-if="transformedFishPart.toBeNotified">{{ $t('list.item.notificationHintOff') }}</div>
                <div v-else>{{ $t('list.item.notificationHint') }}</div>
              </div>
            </v-tooltip>
          </div>
          <div
            v-if="fish.addBuffSuffix && transformedFishTimePart.isFishing"
            :title="$t('list.item.countDown.fishShadowHint')"
            :class="fish.predatorsIcon"
            style="margin-left: 2px"
          />
          <div>
            <v-tooltip v-if="transformedFishTimePart.isFishing" right color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="text-subtitle-2">
                  {{ transformedFishTimePart.countDownNextInterval }}
                </div>
              </template>
              <span>{{ transformedFishTimePart.countDownNextTimePointText }}</span>
            </v-tooltip>
          </div>
          <div>
            <v-tooltip v-if="transformedFishTimePart.isWaiting" top color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="text-subtitle-2">
                  ({{ transformedFishTimePart.countDownTotal }})
                </div>
              </template>
              <span>{{ transformedFishTimePart.countDownTotalHint }}</span>
            </v-tooltip>
          </div>
        </div>
      </v-col>
      <v-col v-if="isMobile" cols="1">
        <toggle-button
          :value="transformedFishPart.completed"
          @input="setCompleted($event)"
          :style="{ visibility: mode !== 'CONTENT' && inPredator ? 'hidden' : 'visible' }"
        />
      </v-col>
      <v-col class="col-11 col-sm-3 d-flex flex-row align-center justify-center justify-sm-start my-2 my-sm-0">
        <div v-if="fish.hasFishEyes || fish.hasPredators || fish.hasSnagging" class="mr-1">
          <div v-if="fish.hasFishEyes" style="display: flex; align-items: center" data-ck-action-name="鱼眼">
            <div :class="fish.fishEyesIcon" />
            <div class="ml-1">{{ fish.fishEyesText }}</div>
          </div>
          <div v-if="fish.hasPredators">
            <div :class="fish.predatorsIcon" />
          </div>
          <div v-if="fish.hasSnagging">
            <div :class="fish.snaggingIcon" data-ck-action-name="钓组" />
          </div>
        </div>
        <fish-bait-list :baits="fish.baits" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'
import ToggleButton from '@/components/basic/ToggleButton'
import FishBaitList from '@/components/FishBaitList'
import FishingSpotColumn from '@/components/FishingSpotColumn'

export default {
  name: 'FishListBriefHeader',
  components: { FishingSpotColumn, FishBaitList, ToggleButton },
  props: {
    fish: {
      type: Object,
      default: () => ({}),
    },
    fishTimePart: {
      type: Object,
      default: undefined,
    },
    predators: {
      type: Array,
      default: () => [],
    },
    inPredator: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
    showDivider: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'CONTENT',
    },
    showConstraintsInstead: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    fisher: fisher,
    rootPath: process.env.ASSET_PATH,
  }),
  computed: {
    transformedFishPart() {
      return {
        completed: this.getFishCompleted(this.fish.id),
        pinned: this.getFishPinned(this.fish.id),
        toBeNotified: this.getFishToBeNotified(this.fish.id),
      }
    },
    transformedFishTimePart() {
      const fishTimePart = this.fishTimePart ?? { id: this.fish.id, countDown: { type: DataUtil.ALL_AVAILABLE } }
      return {
        countDownType: DataUtil.getCountDownTypeName(fishTimePart.countDown?.type),
        countDownTime: fishTimePart.countDown?.time,
        countDownTimeText: this.printCountDownTime(fishTimePart.countDown?.time),
        countDownTimePoint: fishTimePart.countDown?.timePoint,
        countDownTimePointText: this.$t('countDown.timePointHint', {
          timePoint: DataUtil.formatDateTime(fishTimePart.countDown?.timePoint),
        }),
        countDownTotal: this.printCountDownTime(fishTimePart.countDown?.fishWindowTotal, 1, false),
        countDownTotalHint: this.$t('countDown.intervalHint', {
          interval: this.printCountDownTime(fishTimePart.countDown?.fishWindowTotal, 2),
        }),
        countDownNextInterval: this.$t('countDown.nextInterval', {
          nextInterval: this.printCountDownTime(fishTimePart.countDown?.nextInterval, 1, false),
        }),
        countDownNextTimePointText: this.$t('countDown.timePointHint', {
          timePoint: DataUtil.formatDateTime(fishTimePart.countDown?.nextTimePoint),
        }),
        hasCountDown: DataUtil.hasCountDown(fishTimePart.countDown),
        isWaiting: fishTimePart.countDown?.type === DataUtil.WAITING,
        isFishing: fishTimePart.countDown?.type === DataUtil.FISHING,
      }
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    ...mapGetters([
      'getWeather',
      'getItemIconClass',
      'getItemName',
      'getZoneName',
      'getFishingSpotsName',
      'getBaits',
      'getFishCompleted',
      'getFishPinned',
      'getFishToBeNotified',
    ]),
  },
  methods: {
    printCountDownTime: DataUtil.printCountDownTime,
    setCompleted(completed) {
      this.setFishCompleted({ fishId: this.fish.id, completed })
    },

    setPinned(pinned) {
      this.setFishPinned({ fishId: this.fish.id, pinned })
    },

    setToBeNotified(toBeNotified) {
      this.setFishToBeNotified({ fishId: this.fish.id, toBeNotified })
    },
    ...mapMutations(['setFishCompleted', 'setFishPinned', 'setFishToBeNotified']),
  },
}
</script>

<style scoped>
.zoom-in-predator {
  zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 50% 50%;
}
</style>
