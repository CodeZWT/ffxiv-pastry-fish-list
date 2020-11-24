<template>
  <div style="width: 100%">
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

          <v-badge
            v-if="inPredator"
            :content="fish.requiredCnt"
            color="predatorCnt black--text"
            overlap
            bottom
            bordered
          >
            <item-icon :icon-class="fish.icon" small />
          </v-badge>
          <item-icon v-else :icon-class="fish.icon" />
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
import ToggleButton from '@/components/basic/ToggleButton'
import FishBaitList from '@/components/FishBaitList'
import FishingSpotColumn from '@/components/FishingSpotColumn'
import ItemIcon from '@/components/basic/ItemIcon'
import fishInfoRowMixin from '@/components/FishInfoRow/FishInfoRowMixin'

export default {
  name: 'FishInfoRowSmall',
  components: { ItemIcon, FishingSpotColumn, FishBaitList, ToggleButton },
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
