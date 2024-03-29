<template>
  <div style="width: 100%" @click="onFishClicked()">
    <v-hover v-slot="{ hover }" open-delay="300" close-deplay="300">
      <div style="position: relative">
        <v-chip
          v-if="!!fish.tag && isSpearFish"
          label
          style="position: absolute; top: 0; right: 0"
          class="rounded-tl-0 rounded-bl-lg rounded-br-0"
          color="primary"
          outlined
        >
          {{ $t('spearTip.predator.' + fish.tag) }}
        </v-chip>
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
                    :checked-icon="mdiPin"
                    :unchecked-icon="mdiPinOutline"
                    :checked-title="$t('actions.pin.checked')"
                    :unchecked-title="$t('actions.pin.unchecked')"
                  />
                  <toggle-button
                    v-if="type === 'notification'"
                    :value="transformedFishPart.toBeNotifiedLocked"
                    @input="setToBeNotifiedLocked($event)"
                    :checked-icon="mdiLock"
                    :unchecked-icon="mdiLockOpenVariant"
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
                  :spot-id="currentSpotId"
                  :angler-id="fish.anglerFishId"
                  :name="fish.name"
                  :names="fish.names"
                  mode="fish"
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
                    :title="fish.isFuturePatch ? $t('list.item.inFuturePatch') : ''"
                    class="mr-1"
                  ></v-badge>
                  <div v-if="fish.hasTasks" class="mr-1">
                    <v-icon
                      small
                      title="$t('list.item.showTask')"
                      @click.stop="onFishClicked(['DetailItemQuest'], fish._id)"
                    >
                      {{ mdiAlertCircleOutline }}
                    </v-icon>
                  </div>
                  <div
                    v-if="fish.folklore"
                    :data-ck-item-id="
                      toItemIdIfExisted(fish.folklore.itemId, fish.folklore.name)
                    "
                    class="mr-1"
                    style="margin-top: -4px"
                  >
                    <v-icon small :title="fish.folklore.name">{{
                      mdiBookOpenVariant
                    }}</v-icon>
                  </div>
                  <div v-if="fish.aquarium" class="mr-1" style="margin-top: -2px">
                    <v-icon
                      small
                      :title="`[${fish.aquarium.size}] ${fish.aquarium.water}`"
                      >{{ mdiFishbowl }}</v-icon
                    >
                  </div>
                  <div v-if="fish.collectable">
                    <i class="xiv collectables" :title="$t('common.game.collectable')" />
                  </div>
                </div>
              </div>
            </div>
          </v-col>
          <v-col :class="`${countDownColClass} d-flex flex-column justify-center`">
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
                  :title="$t('list.item.countDown.fisherIntuitionHint')"
                  style="margin-left: 2px"
                />
              </template>
              <div
                v-if="
                  fish.checking &&
                    (fish.checkInfo.timeRestricted || fish.checkInfo.weatherRestricted)
                "
                title="$t('investigation.disclaimer')"
                class="ml-1"
              >
                <v-icon small color="warning">{{ mdiAlertOutline }}</v-icon>
                <span class="warning--text">{{ $t('investigation.investigating') }}</span>
              </div>
              <div
                v-if="
                  !transformedFishTimePart.hasCountDown &&
                    (!fish.checking ||
                      (!fish.checkInfo.timeRestricted &&
                        !fish.checkInfo.weatherRestricted))
                "
              >
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
          </v-col>
          <v-col :class="`${locationColClass} d-flex flex-column justify-center`">
            <fishing-spot-column
              v-if="!hideSpotColumn"
              :fishing-spots="fish.fishingSpots"
              :type="fish.type"
              @click="onFishClicked(['DetailItemMap'])"
            />
          </v-col>
          <v-col :class="`${timeAndWeatherColClass}`">
            <weather-time-column :fish="fish" />
          </v-col>
          <v-col
            :class="`${buffAndBaitColClass} d-flex flex-row align-center justify-center`"
          >
            <template v-if="isIntersecting">
              <div
                v-if="(fish.hasPredators && !isSpearFish) || fish.hasSnagging"
                class="mr-1"
              >
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
              <div v-if="fish.checkInfo && fish.checkInfo.bestCatchPathUnknown">
                <v-icon small color="warning">{{ mdiAlertOutline }}</v-icon>
                <span class="warning--text">{{ $t('investigation.investigating') }}</span>
              </div>
              <div v-else-if="isSpearFish" class="d-flex align-center">
                <template v-if="isEndWalker">
                  <div style="min-width: 32px">
                    <div v-if="fish.hasPredators" class="d-flex flex-column align-center">
                      <effect-icon :icon-class="fish.predatorsIcon" />
                      <div v-if="fish.intuitionLength" class="text-subtitle-2">
                        {{ secondsToMinutesString(fish.intuitionLength) }}
                      </div>
                    </div>
                  </div>

                  <v-img
                    :src="fish.size.icon"
                    :max-height="56 * fish.size.sizeFactor"
                    :max-width="128"
                    contain
                  ></v-img>
                  <div style="min-width: 116px">
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
              <div v-else class="d-flex align-center">
                <div class="d-flex align-center">
                  <i class="xiv square-a" v-if="fish.baitsExtra.length > 0" />
                  <fish-bait-list
                    :baits="fish.baits"
                    @fish-clicked="onFishClicked(undefined, $event)"
                    :target="fish"
                  />
                </div>
                <!-- <template v-if="fish.baitsExtra.length > 0">
                  <div class="d-flex align-center">
                    <i class="xiv square-b" title="另一种可能情况B" />
                    <fish-bait-list
                      :baits="fish.baitsExtra"
                      @fish-clicked="onFishClicked(undefined, $event)"
                    />
                  </div>
                </template> -->
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
                  <!--{{                    checkedIcon="mdiPin"}}-->
                  <!--{{                    uncheckedIcon="mdiPinOutline"}}-->
                  <!--                    small-->
                  <!--                  />-->
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
                  <!-- fish tips link -->
                  <v-btn
                    text
                    icon
                    small
                    :title="$t('list.item.tipHint')"
                    @click.stop="onFishClicked(['DetailItemTips'])"
                  >
                    <v-icon small>{{ mdiBook }}</v-icon>
                  </v-btn>
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
                    <v-icon small> {{ mdiCalendar }} </v-icon>
                  </v-btn>
                </div>
              </v-col>
              <v-col :class="locationColClass">
                <div v-if="!hideSpotColumn" class="d-flex">
                  <v-btn text small icon @click.stop="onFishClicked(['DetailItemMap'])">
                    <v-icon small> {{ mdiMap }} </v-icon>
                  </v-btn>
                  <click-helper @click.stop :copy-text="fishingSpotName">
                    <v-btn text icon small :title="$t('list.item.copyHint')">
                      <v-icon small>{{ mdiContentCopy }}</v-icon>
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
import {
  mdiAlertCircleOutline,
  mdiAlertOutline,
  mdiBell,
  mdiBellOutline,
  mdiBook,
  mdiBookOpenVariant,
  mdiCalendar,
  mdiContentCopy,
  mdiFishbowl,
  mdiLock,
  mdiLockOpenVariant,
  mdiMap,
  mdiPin,
  mdiPinOutline,
} from '@mdi/js'
import ClickHelper from '@/components/basic/ClickHelper'
import EffectIcon from '@/components/basic/EffectIcon'
import FishBaitList from '@/components/FishBaitList'
import FishingSpotColumn from '@/components/FishingSpotColumn'
import ItemIcon from '@/components/basic/ItemIcon'
import LinkList from '@/components/basic/LinkList'
import ToggleButton from '@/components/basic/ToggleButton'
import WeatherTimeColumn from '@/components/FishInfoRow/WeatherTimeColumn'
import fishInfoRowMixin from '@/components/FishInfoRow/FishInfoRowMixin'

export default {
  name: 'FishInfoRowLarge',
  components: {
    WeatherTimeColumn,
    EffectIcon,
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
      mdiAlertCircleOutline,
      mdiAlertOutline,
      mdiBell,
      mdiBellOutline,
      mdiBook,
      mdiBookOpenVariant,
      mdiCalendar,
      mdiContentCopy,
      mdiFishbowl,
      mdiLock,
      mdiLockOpenVariant,
      mdiMap,
      mdiPin,
      mdiPinOutline,
    }
  },
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
