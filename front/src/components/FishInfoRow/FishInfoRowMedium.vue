<template>
  <div style="width: 100%" @click="onFishClicked()">
    <v-hover v-slot="{ hover }" open-delay="200" close-delay="500">
      <div style="position: relative">
        <v-row
          no-gutters
          class="d-flex justify-center align-content-center"
          style="width: 100%"
        >
          <v-col :class="fishColClass">
            <div
              class="d-flex fill-height align-center flex-row pr-2"
              style="min-height: 56px"
            >
              <div class="d-flex flex-column">
                <div class="d-flex">
                  <!-- show small icon with required count for predators -->
                  <v-badge
                    :content="fish.requiredCnt"
                    color="predatorCnt black--text"
                    overlap
                    bottom
                    bordered
                  >
                    <item-icon
                      :icon-class="fish.icon"
                      small
                      style="min-width: 48px"
                      :hat="fish.showHatCover"
                    />
                  </v-badge>

                  <div class="ml-1">
                    <link-list
                      :id="fish.id"
                      :angler-id="fish.anglerFishId"
                      :name="fish.name"
                      :names="fish.names"
                      mode="fish"
                    >
                      <v-hover v-slot="{ hover }">
                        <div
                          :class="
                            `text-subtitle-1 ${
                              hover ? 'info--text text-decoration-underline' : ''
                            }`
                          "
                        >
                          {{ fish.name }}
                        </div>
                      </v-hover>
                    </link-list>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
          <!--  1st: end / start count down  -->
          <v-col :class="`${countDownColClass} d-flex flex-column justify-center`">
            <div class="text-subtitle-1 d-flex">
              <div>
                <v-tooltip
                  right
                  color="secondary"
                  :disabled="!transformedFishTimePart.hasCountDown"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      {{
                        $t(transformedFishTimePart.countDownType, {
                          interval: countDownTimeText,
                        })
                      }}
                    </div>
                  </template>
                  <div class="d-flex flex-column">
                    <div>{{ transformedFishTimePart.countDownTimePointText }}</div>
                  </div>
                </v-tooltip>
              </div>
              <effect-icon
                v-if="fish.addBuffSuffix && transformedFishTimePart.isFishing"
                :title="$t('list.item.countDown.fisherIntuitionHint')"
                :icon-class="fish.predatorsIcon"
                style="margin-left: 2px"
              />
            </div>
            <!--  2nd: next count down / interval & fishing window rate -->
            <div v-if="transformedFishTimePart.hasCountDown" class="d-flex align-center">
              <div>
                <v-tooltip
                  v-if="transformedFishTimePart.isFishing"
                  right
                  color="secondary"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on" class="text-subtitle-2">
                      {{ countDownNextInterval }}
                    </div>
                  </template>
                  <span>{{ transformedFishTimePart.countDownNextTimePointText }}</span>
                </v-tooltip>
              </div>
              <div v-if="transformedFishTimePart.isWaiting">
                <div class="text-subtitle-2">
                  {{ transformedFishTimePart.countDownTotalHint }}
                </div>
              </div>
            </div>
          </v-col>
          <v-col :class="`${locationColClass} d-flex flex-column justify-center`">
            <fishing-spot-column
              v-if="!inPredator && !hideSpotColumn"
              :fishing-spots="fish.fishingSpots"
              @click="onFishClicked(['DetailItemMap'])"
            />
          </v-col>
          <v-col
            :class="
              `${buffAndBaitColClass} d-flex flex-column align-center justify-center`
            "
          >
            <div class="d-flex">
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
                    {{ mdiArrowRight }}
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
            </div>
            <div class="d-flex align-center">
              <div v-if="fish.hasPredators || fish.hasSnagging" class="mr-1">
                <div v-if="fish.hasPredators">
                  <effect-icon :icon-class="fish.predatorsIcon" />
                </div>
                <div v-if="fish.hasSnagging">
                  <effect-icon
                    :icon-class="fish.snaggingIcon"
                    data-ck-action-name="钓组"
                  />
                </div>
              </div>
              <div v-if="isSpearFish" class="d-flex align-center">
                <template v-if="isEndWalker">
                  <v-img
                    :src="fish.size.icon"
                    :max-height="32 * fish.size.sizeFactor"
                    :max-width="64"
                    contain
                  ></v-img>
                  <div style="min-width: 116px" class="ml-1">
                    <div>{{ fish.size.text }}</div>
                    <div v-if="fish.hasShadowPredators">
                      {{ $t('spearTip.hasShadowPredators') }}
                    </div>
                    <div v-else-if="fish.requiredCnt && !inPredator">
                      {{ $t('spearTip.isPredator', { requiredCnt: fish.requiredCnt }) }}
                    </div>
                  </div>
                </template>
                <template v-else class="d-flex align-center">
                  <item-icon :icon-class="fish.gig.icon" :title="fish.gig.text" />
                  <div>
                    <div>{{ fish.gig.text }}</div>
                    <div v-if="fish.hasPredators">
                      {{ $t('gigTip.hasPredators') }}
                    </div>
                    <div v-else-if="fish.requiredCnt && !inPredator">
                      {{ $t('gigTip.isPredator', { requiredCnt: fish.requiredCnt }) }}
                    </div>
                  </div>
                </template>
              </div>
              <div v-else class="d-flex">
                <div class="d-flex align-center">
                  <i class="xiv square-a" v-if="fish.baitsExtra.length > 0" />
                  <fish-bait-list :baits="fish.baits" :target="fish" />
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-expand-transition>
          <div
            v-if="hover || isMobile"
            style="height: 28px"
            class="d-flex; align-center; primary"
          >
            <v-row no-gutters>
              <v-col class="col-7">
                <!-- bottom actions line -->
                <div class="d-flex flex-wrap pl-1">
                  <!-- completed -->
                  <toggle-button
                    :value="transformedFishPart.completed"
                    @input="setCompleted($event)"
                    small
                    :checked-title="$t('actions.completed.checked')"
                    :unchecked-title="$t('actions.completed.unchecked')"
                  />
                  <!-- pin -->
                  <toggle-button
                    :value="transformedFishPart.pinned"
                    @input="setPinned($event)"
                    :checked-icon="mdiPin"
                    :unchecked-icon="mdiPinOutline"
                    small
                    :checked-title="$t('actions.pin.checked')"
                    :unchecked-title="$t('actions.pin.unchecked')"
                  />
                  <!-- copy name -->
                  <click-helper @click.stop :copy-text="fish.name">
                    <v-btn text icon small :title="$t('list.item.copyHint')">
                      <v-icon small>{{ mdiContentCopy }}</v-icon>
                    </v-btn>
                  </click-helper>
                  <!-- alarm -->
                  <toggle-button
                    v-if="transformedFishTimePart.hasCountDown"
                    :value="transformedFishPart.toBeNotified"
                    :title="transformedFishPart.notificationHint"
                    @input="setToBeNotified($event)"
                    :checked-icon="mdiBell"
                    :unchecked-icon="mdiBellOutline"
                    small
                  />
                </div>
              </v-col>
              <v-col :class="locationColClass">
                <div v-if="!inPredator && !hideSpotColumn" class="d-flex">
                  <v-btn text small icon @click.stop="onFishClicked(['DetailItemMap'])">
                    <v-icon small> {{ mdiMap }} </v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </div>
    </v-hover>
  </div>
</template>

<script>
import {
  mdiArrowRight,
  mdiBell,
  mdiBellOutline,
  mdiContentCopy,
  mdiMap,
  mdiPin,
  mdiPinOutline,
} from '@mdi/js'
import ClickHelper from '@/components/basic/ClickHelper'
import DataUtil from '@/utils/DataUtil'
import EffectIcon from '@/components/basic/EffectIcon'
import FishBaitList from '@/components/FishBaitList'
import FishingSpotColumn from '@/components/FishingSpotColumn'
import ItemIcon from '@/components/basic/ItemIcon'
import LinkList from '@/components/basic/LinkList'
import ToggleButton from '@/components/basic/ToggleButton'
import WeatherIcon from '@/components/basic/WeatherIcon'
import fishInfoRowMixin from '@/components/FishInfoRow/FishInfoRowMixin'

export default {
  name: 'FishInfoRowLarge',
  components: {
    EffectIcon,
    WeatherIcon,
    LinkList,
    ClickHelper,
    ItemIcon,
    FishingSpotColumn,
    FishBaitList,
    ToggleButton,
  },
  mixins: [fishInfoRowMixin],
  data() {
    return {
      mdiPin,
      mdiPinOutline,
      mdiBell,
      mdiBellOutline,
      mdiArrowRight,
      mdiContentCopy,
      mdiMap,
    }
  },
  computed: {
    fishColClass() {
      return 'col-4'
    },
    countDownColClass() {
      return 'col-3'
    },
    locationColClass() {
      return 'col-0'
    },
    timeAndWeatherColClass() {
      return 'col-0'
    },
    buffAndBaitColClass() {
      return 'col-5'
    },
  },
  methods: {
    iconIdToClass: DataUtil.iconIdToClass,
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
