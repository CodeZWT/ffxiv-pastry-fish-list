<template>
  <div>
    <div v-if="weatherFilter" class="d-flex justify-space-between align-center">
      <v-radio-group v-model="currentWeather" row>
        <v-radio v-for="weather in weathers" :value="weather.id" :key="weather.id">
          <template v-slot:label>
            <div :class="weather.icon" :title="weather.name" />
            <div class="ml-1">{{ weather.name }}</div>
          </template>
        </v-radio>
      </v-radio-group>
      <v-btn @click="clearWeatherFilter" color="error" text>清空天气</v-btn>
    </div>
    <v-data-table
      :headers="oceanFishingHeaders"
      :items="transformFishList"
      class="elevation-4 mt-2"
      hide-default-footer
      multi-sort
    >
      <template v-slot:item.name="{ item }">
        <div class="d-flex align-center">
          <toggle-button :value="item.completed" @input="setCompleted(item.id, $event)" />
          <item-icon :icon-class="item.icon" :title="item.name" style="min-width: 48px" />
          <div>{{ item.name }}</div>
        </div>
      </template>
      <template v-slot:item.baitId="{ item }">
        <div class="d-flex align-center justify-center" style="min-height: 70px">
          <template v-if="item.hasPredators">
            <div v-for="(fish, index) in item.predators" :key="index" class="pt-1 ml-1">
              <v-badge
                :content="fish.requiredCnt"
                color="predatorCnt black--text"
                overlap
                bottom
                bordered
              >
                <item-icon :icon-class="fish.icon" />
              </v-badge>
            </div>
            <div :class="item.predatorsIcon" style="margin-left: 2px" />
          </template>

          <item-icon
            :data-ck-item-id="toItemIdIfExisted(item.bait.id, item.bait.name)"
            :icon-class="item.bait.icon"
            :title="item.bait.name"
          />
          <!--        <div>{{ item.bait.name }}</div>-->
          <template v-if="item.baitExtra">
            <div>或</div>
            <item-icon
              :data-ck-item-id="toItemIdIfExisted(item.baitExtra.id, item.baitExtra.name)"
              :icon-class="item.baitExtra.icon"
              :title="item.baitExtra.name"
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
          <div v-if="!item.hasWeatherConstraint">
            无要求
          </div>
          <div v-else>
            在
          </div>
          <div
            v-for="(weather, index) in item.notAvailableWeatherSetDetail"
            :key="index"
            :title="weather.name"
            class="d-flex flex-column align-center"
          >
            <div :class="weather.icon" :title="weather.name" />
            <!--          <div class="ml-1">{{ weather.name }}</div>-->
          </div>
          <div v-if="item.hasWeatherConstraint">
            不出现
          </div>
        </div>
      </template>

      <template v-slot:item.time="{ item }">
        <div class="d-flex align-center justify-center">
          <v-icon :title="item.timeText">{{ item.timeIcon }}</v-icon>
        </div>
      </template>

      <template v-slot:item.bonusId="{ item }">
        <div class="d-flex align-center justify-center">
          <item-icon
            v-if="item.bonusId !== 0"
            :title="item.bonus.name"
            :icon-class="item.bonus.icon"
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
import FIX from '@/store/fix'

export default {
  name: 'OceanFishingFishList',
  components: { ToggleButton, ItemIcon },
  props: {
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
  },
  data() {
    return {
      TUG_ICON_COLOR: DataUtil.TUG_ICON_COLOR,
      currentWeather: null,
    }
  },
  computed: {
    weathers() {
      return this.weatherSet.map(weatherId => {
        const weather = FIX.OCEAN_FISHING_WEATHER[weatherId]
        return {
          id: weather._id,
          name: DataUtil.getName(weather),
          icon: DataUtil.iconIdToClass(weather.icon),
        }
      })
    },
    filteredFishList() {
      return this.fishList.filter(
        fish => !fish.notAvailableWeatherSet.includes(this.currentWeather)
      )
    },
    oceanFishingHeaders() {
      return [
        {
          text: '名称',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: '鱼饵',
          align: 'center',
          sortable: true,
          value: 'baitId',
        },
        {
          text: '杆型',
          align: 'center',
          sortable: true,
          value: 'tugIcon',
        },
        {
          text: '咬钩时间',
          align: 'center',
          sortable: true,
          value: 'biteTimeForSort',
        },
        {
          text: '分数',
          align: 'center',
          sortable: true,
          value: 'points',
        },
        {
          text: '双提',
          align: 'center',
          sortable: true,
          value: 'doubleHook',
        },
        this.restrictColumnHeader,
        {
          text: '分类',
          align: 'center',
          sortable: true,
          value: 'bonusId',
        },
      ]
    },
    transformFishList() {
      return this.filteredFishList.map(fish => {
        return {
          completed: this.getFishCompleted(fish.id),
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
            value: 'time',
          }
        : {
            text: '天气',
            align: 'center',
            sortable: false,
            value: 'notAvailableWeatherSet',
          }
    },
    ...mapGetters(['getFishCompleted']),
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

<style scoped></style>
