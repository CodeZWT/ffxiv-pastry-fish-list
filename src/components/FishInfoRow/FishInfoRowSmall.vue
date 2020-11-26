<template>
  <div style="width: 100%" @click="onFishClicked()">
    <v-divider v-if="inPredator" inset style="border-color: white" />
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
            <item-icon :icon-class="fish.icon" small style="min-width: 36px" />
          </v-badge>
          <!-- or show normal icon for fish -->
          <item-icon v-else :icon-class="fish.icon" style="min-width: 48px" />
          <div :class="inPredator ? 'ml-4' : 'ml-1'">
            <div class="text-subtitle-1" :title="fish.name + '#' + fish.id">
              {{ fish.name }}
            </div>
            <!-- bottom actions line -->
            <div class="d-flex">
              <!-- alarm -->
              <toggle-button
                v-if="transformedFishTimePart.hasCountDown"
                :value="transformedFishPart.toBeNotified"
                :title="$t('list.item.notificationHint')"
                @input="setToBeNotified($event)"
                checked-icon="mdi-bell"
                unchecked-icon="mdi-bell-outline"
                small
              />
              <!-- fish angel link -->
              <click-helper @click.stop="goToFishAngelPage(fish.anglerFishId)">
                <v-btn text icon small :title="$t('list.item.linkHint')">
                  <v-icon small>mdi-link-variant</v-icon>
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
          {{ $t(transformedFishTimePart.countDownType) }}
        </div>
        <div v-else class="d-flex align-center">
          <div class="text-subtitle-1 d-flex">
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
          </div>
          <div
            v-if="fish.addBuffSuffix && transformedFishTimePart.isFishing"
            :title="$t('list.item.countDown.fishShadowHint')"
            :class="fish.predatorsIcon"
            style="margin-left: 2px"
          />
          <div class="text-subtitle-2 ml-1">
            {{ transformedFishTimePart.countDownNextInterval }}
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
      <v-col cols="1">
        <toggle-button
          v-if="!inPredator"
          :value="transformedFishPart.completed"
          @input="setCompleted($event)"
          :style="{ visibility: mode !== 'CONTENT' && inPredator ? 'hidden' : 'visible' }"
        />
      </v-col>
      <v-col
        class="col-11 col-sm-3 d-flex flex-row align-center justify-center justify-sm-start my-2 my-sm-0"
      >
        <div
          v-if="fish.hasFishEyes || fish.hasPredators || fish.hasSnagging"
          class="mr-1"
        >
          <div
            v-if="fish.hasFishEyes"
            style="display: flex; align-items: center"
            data-ck-action-name="鱼眼"
          >
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
import ToggleButton from '@/components/basic/ToggleButton'
import FishBaitList from '@/components/FishBaitList'
import FishingSpotColumn from '@/components/FishingSpotColumn'
import ItemIcon from '@/components/basic/ItemIcon'
import fishInfoRowMixin from '@/components/FishInfoRow/FishInfoRowMixin'
import ClickHelper from '@/components/basic/ClickHelper'

export default {
  name: 'FishInfoRowSmall',
  components: { ClickHelper, ItemIcon, FishingSpotColumn, FishBaitList, ToggleButton },
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
