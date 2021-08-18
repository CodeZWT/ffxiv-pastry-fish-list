<template>
  <div style="width: 100%" @click="onFishClicked()">
    <v-divider v-if="inPredator" inset style="border-color: grey" />
    <v-row
      no-gutters
      class="d-flex justify-center align-content-center"
      style="width: 100%"
    >
      <v-col cols="6">
        <div
          class="d-flex fill-height align-center flex-row pr-1"
          style="min-height: 48px"
        >
          <!-- hide pin & complete button for predators in list view -->
          <div
            class="d-flex align-center"
            :style="{
              visibility: inPredator ? 'hidden' : 'visible',
              'flex-direction': 'column',
            }"
          >
            <toggle-button
              :value="transformedFishPart.pinned"
              @input="setPinned($event)"
              checked-icon="mdi-pin"
              unchecked-icon="mdi-pin-outline"
              :checked-title="$t('actions.pin.checked')"
              :unchecked-title="$t('actions.pin.unchecked')"
            />
          </div>

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
              style="min-width: 36px"
              :hat="fish.showHatCover"
            />
          </v-badge>
          <!-- or show normal icon for fish -->
          <item-icon
            v-else
            :icon-class="fish.icon"
            style="min-width: 48px"
            :hat="fish.showHatCover"
          />
          <div :class="inPredator ? 'ml-4' : 'ml-1'">
            <div class="text-subtitle-1 text-break" :title="toItemTitle(fish)">
              {{ fish.name }}
            </div>
            <!-- bottom actions line -->
            <div class="d-flex">
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
          </div>
        </div>
      </v-col>
      <v-col class="col-6 col-sm-3 d-flex flex-column justify-center">
        <div v-if="!inPredator && !hideSpotColumn">
          <fishing-spot-column :fishing-spots="fish.fishingSpots" small />
        </div>
        <div v-if="!transformedFishTimePart.hasCountDown" class="text-subtitle-2">
          <div v-if="fish.checkInfo.timeRestricted">
            有时间限制
          </div>
          <div v-if="fish.checkInfo.weatherRestricted">
            有天气限制
          </div>
          <div
            v-if="
              !fish.hasTimeConstraint &&
                !fish.hasWeatherConstraint &&
                !fish.checkInfo.timeRestricted &&
                !fish.checkInfo.weatherRestricted
            "
          >
            {{ $t(transformedFishTimePart.countDownType) }}
          </div>
          <div v-else-if="!transformedFishTimePart.hasCountDown && !fish.checking">
            {{ $t('countDown.allAvailable') }}
          </div>
        </div>
        <div v-else class="d-flex flex-column">
          <!--  1st: end / start count down  -->
          <div class="text-subtitle-1 d-flex">
            <template v-if="transformedFishTimePart.hasCountDown">
              <div>
                <v-tooltip right color="secondary">
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
                :icon-class="fish.predatorsIcon"
                :title="$t('list.item.countDown.fishShadowHint')"
                style="margin-left: 2px"
              />
            </template>
            <div v-if="fish.checking" title="开荒中一切数据仅供参考" class="ml-1">
              <v-icon small color="warning">mdi-alert-outline</v-icon>
              <span class="warning--text">开荒中</span>
            </div>
          </div>
          <!--  2nd: next count down / interval & fishing window rate -->
          <div v-if="transformedFishTimePart.hasCountDown" class="d-flex align-center">
            <div>
              <v-tooltip v-if="transformedFishTimePart.isFishing" right color="secondary">
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    v-on="on"
                    class="text-subtitle-2"
                    style="padding-top: 3px"
                  >
                    {{ transformedFishTimePart.countDownNextInterval }}
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
          </div>
        </div>
      </v-col>
      <v-col cols="1">
        <toggle-button
          v-if="!inPredator"
          :value="transformedFishPart.completed"
          @input="setCompleted($event)"
          :checked-title="$t('actions.completed.checked')"
          :unchecked-title="$t('actions.completed.unchecked')"
        />
      </v-col>
      <v-col
        class="col-11 col-sm-3 d-flex flex-row align-center justify-center justify-sm-start my-2 my-sm-0"
      >
        <div v-if="fish.hasPredators || fish.hasSnagging" class="mr-1">
          <div v-if="fish.hasPredators" class="d-flex flex-column align-center">
            <effect-icon :icon-class="fish.predatorsIcon" />
            <div
              v-if="fish.intuitionLength"
              :title="secondsToMinutesString(fish.intuitionLength)"
              class="text-subtitle-2"
            >
              {{ fish.intuitionLength }}s
            </div>
          </div>
          <div v-if="fish.hasSnagging">
            <div :class="fish.snaggingIcon" data-ck-action-name="钓组" />
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
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ToggleButton from '@/components/basic/ToggleButton'
import FishBaitList from '@/components/FishBaitList'
import FishingSpotColumn from '@/components/FishingSpotColumn'
import ItemIcon from '@/components/basic/ItemIcon'
import fishInfoRowMixin from '@/components/FishInfoRow/FishInfoRowMixin'
import ClickHelper from '@/components/basic/ClickHelper'
import EffectIcon from '@/components/basic/EffectIcon'

export default {
  name: 'FishInfoRowSmall',
  components: {
    EffectIcon,
    ClickHelper,
    ItemIcon,
    FishingSpotColumn,
    FishBaitList,
    ToggleButton,
  },
  mixins: [fishInfoRowMixin],
}
</script>

<style scoped>
.zoom-in-predator {
  zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 50% 50%;
}
</style>
