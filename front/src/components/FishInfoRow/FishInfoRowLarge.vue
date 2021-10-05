<template>
  <div style="width: 100%" @click="onFishClicked()">
    <v-hover v-slot="{ hover }" open-delay="300" close-deplay="300">
      <div style="position: relative">
        <v-divider
          v-if="inPredator && showDivider"
          class="ml-9"
          style="margin-top: -2px; margin-bottom: 2px; border-color: grey"
        />
        <v-row
          no-gutters
          class="d-flex justify-center align-content-center"
          style="width: 100%"
        >
          <v-col :class="fishColClass">
            <div
              class="d-flex fill-height align-center flex-row pr-1"
              style="min-height: 48px"
            >
              <template v-if="isIntersecting">
                <!-- hide pin & complete button for predators in list view -->
                <div
                  class="d-flex align-center"
                  :style="{
                    visibility: inPredator ? 'hidden' : 'visible',
                    'flex-direction': 'column',
                  }"
                >
                  <toggle-button
                    v-if="type === 'normal'"
                    :value="transformedFishPart.pinned"
                    @input="setPinned($event)"
                    checked-icon="mdi-pin"
                    unchecked-icon="mdi-pin-outline"
                    :checked-title="$t('actions.pin.checked')"
                    :unchecked-title="$t('actions.pin.unchecked')"
                  />
                  <toggle-button
                    v-if="type === 'notification'"
                    :value="transformedFishPart.toBeNotifiedLocked"
                    @input="setToBeNotifiedLocked($event)"
                    checked-icon="mdi-lock"
                    unchecked-icon="mdi-lock-open-variant"
                    :checked-title="$t('actions.toBeNotifiedLocked.checked')"
                    :unchecked-title="$t('actions.toBeNotifiedLocked.unchecked')"
                  />
                  <toggle-button
                    :value="transformedFishPart.completed"
                    @input="setCompleted($event)"
                    :checked-title="$t('actions.completed.checked')"
                    :unchecked-title="$t('actions.completed.unchecked')"
                  />
                </div>
              </template>
              <template v-else>
                <div style="min-width: 36px"></div>
              </template>
              <!-- show small icon with required count for predators -->
              <v-badge
                v-if="inPredator"
                :content="fish.requiredCnt"
                color="predatorCnt black--text"
                overlap
                bottom
                bordered
              >
                <item-icon
                  :icon-class="fish.icon"
                  small
                  style="min-width: 30px"
                  :hat="fish.showHatCover"
                />
              </v-badge>
              <!-- or show normal icon for fish -->
              <item-icon
                v-else
                :icon-class="fish.icon"
                style="min-width: 40px"
                :hat="fish.showHatCover"
              />
              <div :class="inPredator ? 'ml-4' : 'ml-1'">
                <link-list
                  :id="fish.id"
                  :angler-id="fish.anglerFishId"
                  :name="fish.name"
                  mode="item"
                >
                  <v-hover v-slot="{ hover }">
                    <div
                      :class="
                        `text-subtitle-1 text-break ${
                          hover ? 'info--text text-decoration-underline' : ''
                        }`
                      "
                    >
                      {{ fish.name }}
                    </div>
                  </v-hover>
                </link-list>
                <div v-if="isIntersecting" class="d-flex align-center flex-wrap">
                  <v-badge
                    inline
                    bordered
                    :color="fish.isFuturePatch ? 'grey' : 'primary'"
                    :content="fish.patchText"
                    :title="fish.isFuturePatch ? '未实装' : ''"
                    class="mr-1"
                  ></v-badge>
                  <div v-if="fish.hasTasks" class="mr-1">
                    <v-icon
                      small
                      title="点击查看任务及其他信息"
                      @click.stop="onFishClicked(['DetailItemQuest'], fish._id)"
                    >
                      mdi-alert-circle-outline
                    </v-icon>
                  </div>
                  <div
                    v-if="fish.folklore"
                    :data-ck-item-id="
                      toItemIdIfExisted(fish.folklore.itemId, fish.folklore.name)
                    "
                    class="mr-1"
                  >
                    <v-icon small :title="fish.folklore.name"
                      >mdi-book-open-variant</v-icon
                    >
                  </div>
                  <div v-if="fish.aquarium" class="mr-1">
                    <v-icon
                      small
                      :title="`[${fish.aquarium.size}] ${fish.aquarium.water}`"
                      >mdi-fishbowl</v-icon
                    >
                  </div>
                  <div v-if="fish.collectable">
                    <i class="xiv collectables" title="收藏品" />
                  </div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col :class="`${countDownColClass} d-flex flex-column justify-center`">
            <template v-if="isIntersecting">
              <!--  1st: end / start count down  -->
              <div class="text-subtitle-1 d-flex">
                <template v-if="transformedFishTimePart.hasCountDown">
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
                    :icon-class="fish.predatorsIcon"
                    :title="$t('list.item.countDown.fishShadowHint')"
                    style="margin-left: 2px"
                  />
                </template>
                <div v-if="fish.checking" title="开荒中一切数据仅供参考" class="ml-1">
                  <v-icon small color="warning">mdi-alert-outline</v-icon>
                  <span class="warning--text">开荒中</span>
                </div>
                <div v-if="!transformedFishTimePart.hasCountDown && !fish.checking">
                  {{ $t('countDown.allAvailable') }}
                </div>
              </div>
              <!--  2nd: next count down / interval & fishing window rate -->
              <div
                v-if="transformedFishTimePart.hasCountDown"
                class="d-flex align-center flex-wrap"
              >
                <div>
                  <v-tooltip
                    v-if="transformedFishTimePart.isFishing"
                    right
                    color="secondary"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        class="text-subtitle-2"
                        style="padding-top: 3px"
                      >
                        {{ countDownNextInterval }}
                      </div>
                    </template>
                    <span>{{ transformedFishTimePart.countDownNextTimePointText }}</span>
                  </v-tooltip>
                </div>
                <div v-if="transformedFishTimePart.isWaiting">
                  <div class="text-subtitle-2" style="padding-top: 3px">
                    {{ transformedFishTimePart.countDownTotalHint }}
                  </div>
                </div>
                <v-btn
                  small
                  v-if="fish.rate < 1 && !showWindowBtnNextLine"
                  text
                  class="pl-2 pr-1"
                  @click.stop="onFishClicked(['DetailItemFishWindowTable'])"
                >
                  {{ fish.rateText }}
                </v-btn>
              </div>
              <div v-if="fish.rate < 1 && showWindowBtnNextLine">
                <v-btn
                  small
                  text
                  style="padding: 0 1px"
                  @click.stop="onFishClicked(['DetailItemFishWindowTable'])"
                >
                  {{ fish.rateText }}
                </v-btn>
              </div>
            </template>
            <template v-else>
              <div>...</div>
            </template>
          </v-col>
          <v-col :class="`${locationColClass} d-flex flex-column justify-center`">
            <template v-if="isIntersecting">
              <fishing-spot-column
                v-if="!hideSpotColumn"
                :fishing-spots="fish.fishingSpots"
                :type="fish.type"
                @click="onFishClicked(['DetailItemMap'])"
              />
            </template>
            <template v-else>
              <div>...</div>
            </template>
          </v-col>
          <v-col
            :class="
              `${timeAndWeatherColClass} d-flex flex-column justify-center align-center`
            "
          >
            <template v-if="isIntersecting">
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
            </template>
            <template v-else>
              <div>...</div>
            </template>
          </v-col>
          <v-col
            :class="`${buffAndBaitColClass} d-flex flex-row align-center justify-center`"
          >
            <template v-if="isIntersecting">
              <div v-if="fish.hasPredators || fish.hasSnagging" class="mr-1">
                <div v-if="fish.hasPredators" class="d-flex flex-column align-center">
                  <effect-icon :icon-class="fish.predatorsIcon" />
                  <div v-if="fish.intuitionLength" class="text-subtitle-2">
                    {{ secondsToMinutesString(fish.intuitionLength) }}
                  </div>
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
                <div>
                  <div>{{ fish.gig.text }}</div>
                  <div v-if="fish.hasPredators">
                    {{ $t('gigTip.hasPredators') }}
                  </div>
                  <div v-else-if="fish.requiredCnt && !inPredator">
                    {{ $t('gigTip.isPredator', { requiredCnt: fish.requiredCnt }) }}
                  </div>
                </div>
              </div>
              <div v-else class="d-flex align-center">
                <div class="d-flex align-center">
                  <i
                    class="xiv square-a"
                    v-if="fish.baitsExtra.length > 0"
                    title="一种可能情况A"
                  />
                  <fish-bait-list
                    :baits="fish.baits"
                    @fish-clicked="onFishClicked(undefined, $event)"
                    :target="fish"
                    hide-target
                  />
                </div>
                <template v-if="fish.baitsExtra.length > 0">
                  <div class="d-flex align-center">
                    <i class="xiv square-b" title="另一种可能情况B" />
                    <fish-bait-list
                      :baits="fish.baitsExtra"
                      @fish-clicked="onFishClicked(undefined, $event)"
                    />
                  </div>
                </template>
              </div>
            </template>
            <template v-else>
              <div>...</div>
            </template>
          </v-col>
        </v-row>
        <v-expand-transition>
          <div
            v-if="hover && isIntersecting"
            style="position: absolute; height: 28px; z-index: 2; width: 100%"
            class="d-flex align-center primary rounded-b-lg elevation-2"
          >
            <v-row no-gutters>
              <v-col :class="fishColClass">
                <!-- bottom actions line -->
                <div class="d-flex flex-wrap pl-10">
                  <!--                  &lt;!&ndash; completed &ndash;&gt;-->
                  <!--                  <toggle-button-->
                  <!--                    :value="transformedFishPart.completed"-->
                  <!--                    @input="setCompleted($event)"-->
                  <!--                    small-->
                  <!--                  />-->
                  <!--                  &lt;!&ndash; pin &ndash;&gt;-->
                  <!--                  <toggle-button-->
                  <!--                    :value="transformedFishPart.pinned"-->
                  <!--                    @input="setPinned($event)"-->
                  <!--                    checked-icon="mdi-pin"-->
                  <!--                    unchecked-icon="mdi-pin-outline"-->
                  <!--                    small-->
                  <!--                  />-->
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
                  <!-- fish tips link -->
                  <click-helper
                    v-if="fish.hasTips"
                    @click.stop="onFishClicked(['DetailItemTips'])"
                  >
                    <v-btn text icon small :title="$t('list.item.tipHint')">
                      <v-icon small>mdi-book</v-icon>
                    </v-btn>
                  </click-helper>
                </div>
              </v-col>
              <v-col :class="countDownColClass">
                <div v-if="fish.rate < 1">
                  <v-btn
                    text
                    icon
                    small
                    style="padding: 0 1px"
                    @click.stop="onFishClicked(['DetailItemFishWindowTable'])"
                  >
                    <v-icon small> mdi-calendar </v-icon>
                  </v-btn>
                </div>
              </v-col>
              <v-col :class="locationColClass">
                <div v-if="!hideSpotColumn" class="d-flex">
                  <v-btn text small icon @click.stop="onFishClicked(['DetailItemMap'])">
                    <v-icon small> mdi-map </v-icon>
                  </v-btn>
                  <click-helper @click.stop :copy-text="fishingSpotName">
                    <v-btn text icon small :title="$t('list.item.copyHint')">
                      <v-icon small>mdi-content-copy</v-icon>
                    </v-btn>
                  </click-helper>
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
import ClickHelper from '@/components/basic/ClickHelper'
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
  computed: {
    fishColClass() {
      return this.hideSpotColumn
        ? 'col-3'
        : this.showWindowBtnNextLine
        ? 'col-3'
        : 'col-2'
    },
    countDownColClass() {
      return this.hideSpotColumn
        ? 'col-3'
        : this.showWindowBtnNextLine
        ? 'col-2'
        : 'col-3'
    },
    locationColClass() {
      return this.hideSpotColumn ? 'col-0' : 'col-2'
    },
    timeAndWeatherColClass() {
      return this.hideSpotColumn ? 'col-2' : 'col-2'
    },
    buffAndBaitColClass() {
      return this.hideSpotColumn ? 'col-4' : 'col-3'
    },
    fishingSpotName() {
      return this.fish.fishingSpots[0].fishingSpotName
    },
    showWindowBtnNextLine() {
      return window.innerWidth < 1264 || this.showFishPageRightPane
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
