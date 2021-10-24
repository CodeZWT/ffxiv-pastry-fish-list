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
            <link-list
              :id="fish.id"
              :angler-id="fish.anglerFishId"
              :name="fish.name"
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
            <div v-if="isIntersecting" class="d-flex">
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
              <v-btn
                text
                icon
                small
                :title="$t('list.item.tipHint')"
                @click.stop="onFishClicked(['DetailItemTips'])"
              >
                <v-icon small>mdi-book</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
      <v-col class="col-6 d-flex flex-row align-center justify-center my-2">
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
            <effect-icon :icon-class="fish.snaggingIcon" data-ck-action-name="钓组" />
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
      </v-col>
      <v-col cols="1">
        <template v-if="isIntersecting">
          <toggle-button
            v-if="!inPredator"
            :value="transformedFishPart.completed"
            @input="setCompleted($event)"
            :checked-title="$t('actions.completed.checked')"
            :unchecked-title="$t('actions.completed.unchecked')"
          />
        </template>
        <template v-else>
          <div style="min-width: 36px"></div>
        </template>
      </v-col>
      <v-col cols="5">
        <template v-if="isIntersecting">
          <div v-if="!transformedFishTimePart.hasCountDown" class="text-subtitle-2 ml-2">
            <div v-if="fish.checkInfo.timeRestricted">有时间限制</div>
            <div v-if="fish.checkInfo.weatherRestricted">有天气限制</div>
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
          <div v-else class="d-flex flex-column ml-2">
            <!--  1st: end / start count down  -->
            <div class="text-subtitle-1 d-flex">
              <template v-if="transformedFishTimePart.hasCountDown">
                <div>
                  <v-tooltip right color="secondary">
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
            </div>
          </div>
        </template>
        <template v-else>
          <div class="ml-2" style="height: 53px">...</div>
        </template>
      </v-col>
      <v-col cols="6">
        <template v-if="!inPredator && !hideSpotColumn">
          <template v-if="isIntersecting">
            <fishing-spot-column :fishing-spots="fish.fishingSpots" small />
          </template>
          <template v-else>
            <div style="text-align: end" class="mr-2">...</div>
          </template>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EffectIcon from '@/components/basic/EffectIcon'
import FishBaitList from '@/components/FishBaitList'
import FishingSpotColumn from '@/components/FishingSpotColumn'
import ItemIcon from '@/components/basic/ItemIcon'
import LinkList from '@/components/basic/LinkList'
import ToggleButton from '@/components/basic/ToggleButton'
import fishInfoRowMixin from '@/components/FishInfoRow/FishInfoRowMixin'

export default {
  name: 'FishInfoRowSmall',
  components: {
    LinkList,
    EffectIcon,
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
