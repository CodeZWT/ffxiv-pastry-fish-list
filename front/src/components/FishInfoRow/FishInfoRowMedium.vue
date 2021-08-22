<template>
  <div style="width: 100%" @click="onFishClicked()">
    <v-hover v-slot="{ hover }" open-delay="200" close-deplay="500">
      <div style="position: relative">
        <v-row
          no-gutters
          class="d-flex justify-center align-content-center"
          style="width: 100%"
        >
          <v-col :class="fishColClass">
            <div
              class="d-flex fill-height align-center flex-row px-1"
              style="min-height: 48px"
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
                      mode="item"
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
                          interval: transformedFishTimePart.countDownTimeText,
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
                :title="$t('list.item.countDown.fishShadowHint')"
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
                      {{ transformedFishTimePart.countDownNextInterval }}
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
                      <div class="bg-011103"></div>
                    </div>
                  </template>
                  <div>时间条件在鱼眼模式下忽略</div>
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
                <item-icon :icon-class="fish.gig.icon" :title="fish.gig.text" />
                <div>{{ fish.gig.text }}</div>
              </div>
              <div v-else class="d-flex">
                <div class="d-flex align-center">
                  <i
                    class="xiv square-a"
                    v-if="fish.baitsExtra.length > 0"
                    title="一种可能情况A"
                  />
                  <fish-bait-list :baits="fish.baits" />
                </div>
                <template v-if="fish.baitsExtra.length > 0">
                  <div class="d-flex align-center">
                    <i class="xiv square-b" title="另一种可能情况B" />
                    <fish-bait-list :baits="fish.baitsExtra" />
                  </div>
                </template>
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
                    checked-icon="mdi-pin"
                    unchecked-icon="mdi-pin-outline"
                    small
                    :checked-title="$t('actions.pin.checked')"
                    :unchecked-title="$t('actions.pin.unchecked')"
                  />
                  <!-- copy name -->
                  <click-helper @click.stop :copy-text="fish.name">
                    <v-btn text icon small :title="$t('list.item.copyHint')">
                      <v-icon small>mdi-content-copy</v-icon>
                    </v-btn>
                  </click-helper>
                  <!-- alarm -->
                  <toggle-button
                    v-if="transformedFishTimePart.hasCountDown"
                    :value="transformedFishPart.toBeNotified"
                    :title="transformedFishPart.notificationHint"
                    @input="setToBeNotified($event)"
                    checked-icon="mdi-bell"
                    unchecked-icon="mdi-bell-outline"
                    small
                  />
                </div>
              </v-col>
              <v-col :class="locationColClass">
                <div v-if="!inPredator && !hideSpotColumn" class="d-flex">
                  <v-btn text small icon @click.stop="onFishClicked(['DetailItemMap'])">
                    <v-icon small> mdi-map </v-icon>
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
import ToggleButton from '@/components/basic/ToggleButton'
import FishBaitList from '@/components/FishBaitList'
import FishingSpotColumn from '@/components/FishingSpotColumn'
import ItemIcon from '@/components/basic/ItemIcon'
import fishInfoRowMixin from '@/components/FishInfoRow/FishInfoRowMixin'
import ClickHelper from '@/components/basic/ClickHelper'
import LinkList from '@/components/basic/LinkList'
import WeatherIcon from '@/components/basic/WeatherIcon'
import EffectIcon from '@/components/basic/EffectIcon'

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
}
</script>

<style scoped>
.zoom-in-predator {
  zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 50% 50%;
}
</style>
