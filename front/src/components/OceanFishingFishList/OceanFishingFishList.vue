<template>
  <div>
    <div v-if="weatherFilter" class="d-flex justify-space-between align-center">
      <v-radio-group v-model="currentWeather" row>
        <v-radio v-for="weather in weathers" :value="weather.id" :key="weather.id">
          <template v-slot:label>
            <div v-if="weather.icon" :class="weather.icon" :title="weather.name" />
            <div class="ml-1">{{ weather.name }}</div>
          </template>
        </v-radio>
      </v-radio-group>
      <!--      <v-btn @click="clearWeatherFilter" color="error" text>清除天气限制</v-btn>-->
    </div>
    <v-data-table
      :headers="oceanFishingHeaders"
      :items="transformFishList"
      :items-per-page="20"
      class="elevation-4 mt-2"
      hide-default-footer
      multi-sort
      :dense="dense"
    >
      <template v-slot:item.name="{ item }">
        <div class="d-flex align-center">
          <toggle-button
            :value="item.completed"
            @input="setCompleted(item.id, $event)"
            :checked-title="$t('actions.completed.checked')"
            :unchecked-title="$t('actions.completed.unchecked')"
          />
          <item-icon
            :icon-class="item.icon"
            :title="item.name"
            style="min-width: 48px"
            :small="dense"
          />
          <div>
            <div :title="`${item.name}#${item.id}`">{{ item.name }}</div>
            <div>{{ item.star.text }}</div>
          </div>
        </div>
      </template>
      <template v-slot:item.baitId="{ item }">
        <div class="d-flex align-center justify-center">
          <template v-if="item.hasPredators">
            <div
              v-for="(fish, index) in item.predators"
              :key="index"
              class="d-flex align-center ml-1"
            >
              <item-icon :icon-class="fish.icon" :small="dense" />
              <span>X</span>
              <v-badge
                :content="fish.requiredCnt"
                color="predatorCnt black--text"
                inline
                bottom
                bordered
              >
              </v-badge>
            </div>
            <div :class="item.predatorsIcon" style="margin-left: 2px" />
          </template>

          <v-badge
            v-if="item.isBaitUnique"
            color="primary"
            icon="mdi-lock"
            offset-x="12"
            offset-y="12"
            title="只能用该鱼饵"
          >
            <item-icon
              :data-ck-item-id="toItemIdIfExisted(item.bait.id, item.bait.name)"
              :icon-class="item.bait.icon"
              :title="item.bait.name"
              :small="dense"
            />
          </v-badge>
          <item-icon
            v-else
            :data-ck-item-id="toItemIdIfExisted(item.bait.id, item.bait.name)"
            :icon-class="item.bait.icon"
            :title="item.bait.name"
            :small="dense"
          />
          <!--        <div>{{ item.bait.name }}</div>-->
          <template v-if="item.baitExtra">
            <div>或</div>
            <item-icon
              :data-ck-item-id="toItemIdIfExisted(item.baitExtra.id, item.baitExtra.name)"
              :icon-class="item.baitExtra.icon"
              :title="item.baitExtra.name"
              :small="dense"
            />
            <!--          <div>{{ item.baitExtra.name }}</div>-->
          </template>
        </div>
      </template>
      <template v-slot:item.tugIcon="{ item }">
        <div class="d-flex align-center justify-center">
          <v-badge
            v-show="item.tug != null"
            :color="TUG_ICON_COLOR[item.tugIcon]"
            :content="item.tugIcon"
            inline
          />
        </div>
      </template>
      <template v-slot:item.biteTimeForSort="{ item }">
        <div class="d-flex align-center justify-center">
          <span>{{ item.biteTimeMin }}</span>
          <template v-if="item.biteTimeMax">
            <span class="mx-1">-</span>
            <span>{{ item.biteTimeMax }}</span>
          </template>
        </div>
      </template>
      <template v-slot:item.notAvailableWeatherSet="{ item }">
        <div class="d-flex align-center justify-center">
          <div v-if="!item.hasWeatherConstraint && !item.hasRealWeatherConstraint">
            无要求
          </div>
          <div v-else>在</div>
          <div
            v-for="(weather, index) in item.notAvailableWeatherSetDetail"
            :key="index"
            :title="weather.name"
            class="d-flex flex-column align-center"
          >
            <div :class="weather.icon" :title="weather.name" />
            <!--          <div class="ml-1">{{ weather.name }}</div>-->
          </div>
          <div v-if="item.hasWeatherConstraint">不出现</div>
          <div v-else-if="item.hasRealWeatherConstraint" title="条件无法满足">不可钓</div>
        </div>
      </template>

      <template v-slot:item.timeForSort="{ item }">
        <div class="d-flex align-center justify-center">
          <div v-if="item.timeForSort === 0">{{ item.timeSet[0].timeText }}</div>
          <template v-else>
            <v-icon v-for="time in item.timeSet" :title="time.timeText" :key="time.time">
              {{ time.timeIcon }}
            </v-icon>
          </template>
        </div>
      </template>

      <template v-slot:item.bonusId="{ item }">
        <div class="d-flex align-center justify-center">
          <item-icon
            v-if="item.bonusId !== 0"
            :title="item.bonus.name"
            :icon-class="item.bonus.icon"
            :small="dense"
          />
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
import { mapGetters, mapMutations } from 'vuex'
import ToggleButton from '@/components/basic/ToggleButton'
import DataUtil from '@/utils/DataUtil'
import FIX from 'Data/fix'

export default {
  name: 'OceanFishingFishList',
  components: { ToggleButton, ItemIcon },
  props: {
    dense: {
      type: Boolean,
      default: false,
    },
    fishList: {
      type: Array,
      default: () => [],
    },
    weatherFilter: {
      type: Boolean,
      default: false,
    },
    weatherSet: {
      type: Array,
      default: () => [],
    },
    shiftFilter: {
      type: Boolean,
      default: false,
    },
    shift: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      TUG_ICON_COLOR: DataUtil.TUG_ICON_COLOR,
      currentWeather: 0,
      currentShift: this.shift,
    }
  },
  computed: {
    weathers() {
      return this.weatherSet
        .map(weatherId => {
          const weather = FIX.OCEAN_FISHING_WEATHER[weatherId]
          return {
            id: weather._id,
            name: DataUtil.getName(weather),
            icon: DataUtil.iconIdToClass(weather.icon),
          }
        })
        .concat([
          {
            id: 0,
            name: '无特定',
            icon: null,
          },
        ])
    },
    filteredFishList() {
      return this.fishList.filter(
        fish =>
          (!this.weatherFilter ||
            !fish.notAvailableWeatherSet.includes(this.currentWeather)) &&
          (!this.shiftFilter ||
            this.currentShift == null ||
            fish.timeSet[0].time === 0 ||
            fish.timeSet.find(time => time.time === this.currentShift + 1))
      )
    },
    oceanFishingHeaders() {
      return [
        {
          text: '名称',
          align: 'start',
          sortable: false,
          value: 'name',
          width: '15%',
        },
        {
          text: '鱼饵',
          align: 'center',
          sortable: true,
          value: 'baitId',
          width: '15%',
        },
        {
          text: '杆型',
          align: 'center',
          sortable: true,
          value: 'tugIcon',
          width: '5%',
        },
        {
          text: '咬钩时间',
          align: 'center',
          sortable: true,
          value: 'biteTimeForSort',
          width: '10%',
        },
        {
          text: '渔分',
          align: 'center',
          sortable: true,
          value: 'points',
          width: '5%',
        },
        {
          text: '双提',
          align: 'center',
          sortable: true,
          value: 'doubleHook',
          width: '5%',
        },
        this.restrictColumnHeader,
        {
          text: '分类',
          align: 'center',
          sortable: true,
          value: 'bonusId',
          width: '10%',
        },
      ]
    },
    transformFishList() {
      return this.filteredFishList.map(fish => {
        return {
          completed: this.getFishCompleted(fish.id),
          timeForSort: fish.timeSet[0].time,
          ...fish,
        }
      })
    },
    isSpectralCurrentSpot() {
      return this.fishList.every(it => !it.hasWeatherConstraint)
    },
    restrictColumnHeader() {
      return this.isSpectralCurrentSpot
        ? {
            text: '时间',
            align: 'center',
            sortable: true,
            value: 'timeForSort',
            width: '15%',
          }
        : {
            text: '天气',
            align: 'center',
            sortable: false,
            value: 'notAvailableWeatherSet',
            width: '15%',
          }
    },
    ...mapGetters(['getFishCompleted']),
  },
  watch: {
    shift(shift) {
      this.currentShift = shift
    },
    weatherSet() {
      this.currentWeather = 0
    },
  },
  methods: {
    clearWeatherFilter() {
      this.currentWeather = null
    },
    setCompleted(fishId, completed) {
      this.setFishCompleted({ fishId, completed })
    },
    toItemIdIfExisted: DataUtil.toItemIdIfExisted,
    ...mapMutations(['setFishCompleted']),
  },
}
</script>

<style lang="sass" scoped>
.v-data-table::v-deep
  td
    padding: 0 !important
</style>
