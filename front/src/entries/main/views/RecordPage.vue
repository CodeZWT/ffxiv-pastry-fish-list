<template>
  <v-container
    fluid
    :class="
      `detail-wrapper ${isElectron ? 'detail-wrapper--electron' : 'detail-wrapper--web'}`
    "
  >
    <v-tabs v-model="tabIndex" grow>
      <v-tab>钓场</v-tab>
      <v-tab>个人</v-tab>
      <v-tab>所有</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabIndex">
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-autocomplete
              ref="search"
              v-model="spotId"
              :items="spotsForSearch"
              item-value="id"
              item-text="name"
              label="请输入钓场"
              clearable
              solo
              :filter="searchFilterOptions"
            >
              <template v-slot:item="data">
                <div class="d-flex">
                  <v-list-item-content>
                    <v-list-item-title>
                      <div>
                        {{ data.item.name }}
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </div>
              </template>
            </v-autocomplete>
            <template v-if="spotId > 0">
              <div class="ma-4 d-flex align-center">
                <v-subheader>模式筛选</v-subheader>
                <v-btn-toggle
                  v-model="modeFilters"
                  rounded
                  dense
                  mandatory
                  multiple
                  active-class="primary"
                >
                  <v-btn small v-for="filter in modeFilterOptions" :key="filter">
                    {{ $t('upload.mode.' + filter) }}
                  </v-btn>
                </v-btn-toggle>
              </div>
              <v-subheader>※ 杆型下方的百分比为未提竿或脱钩数据的占比</v-subheader>
              <div>
                <div class="d-flex">
                  <div style="width: 48px"></div>
                  <div
                    v-for="fish in baitOfSpot.fishList"
                    :key="fish.fishId"
                    style="margin-top: 22px"
                  >
                    <item-icon :icon-class="fish.fishIcon" />
                  </div>
                  <v-card outlined rounded>
                    <div style="text-align: center">脱钩</div>
                    <div class="d-flex align-center">
                      <div
                        v-for="tug in TUGS"
                        :key="tug"
                        style="width: 48px"
                        class="d-flex align-center justify-center"
                      >
                        <v-avatar :color="tugColor[tug]" size="40">
                          <span class="text-h6">{{ $t('tugShort.' + tug) }}</span>
                        </v-avatar>
                      </div>
                    </div>
                  </v-card>
                  <v-card outlined rounded>
                    <div style="text-align: center">未提钩</div>
                    <div class="d-flex align-center">
                      <div
                        v-for="tug in TUGS"
                        :key="tug"
                        style="width: 48px"
                        class="d-flex align-center justify-center"
                      >
                        <v-avatar :color="tugColor[tug]" size="40">
                          <span class="text-h6">{{ $t('tugShort.' + tug) }}</span>
                        </v-avatar>
                      </div>
                    </div>
                  </v-card>
                </div>
                <div
                  v-for="{
                    bait,
                    fishCntList,
                    missedTugCntList,
                    cancelledTugCntList,
                    totalCnt,
                  } in baitOfSpot.baitFishCntList"
                  :key="bait.baitId"
                  class="d-flex"
                >
                  <item-icon
                    :icon-class="bait.baitIcon"
                    :title="bait.baitName + '#' + bait.baitId"
                  />
                  <div
                    v-for="{ fish, cnt, percentage, tugColor } in fishCntList"
                    :key="bait.baitId + '-' + fish.fishId"
                  >
                    <div
                      v-if="cnt > 0"
                      style="position: relative"
                      :title="percentage.toFixed(2) + '% [' + cnt + '/' + totalCnt + ']'"
                    >
                      <item-icon :icon-class="fish.fishIcon" style="opacity: 0.5" />
                      <v-progress-circular
                        :value="percentage"
                        rotate="-90"
                        style="position: absolute; top: 6px; left: 8px"
                        :color="`${tugColor} ${theme.isDark ? 'lighten-2' : 'darken-1'}`"
                      >
                        <div :style="percentage === 100 ? 'font-size: x-small' : ''">
                          {{ percentage.toFixed(0) }}
                        </div>
                      </v-progress-circular>
                    </div>
                    <div v-else style="width: 48px"></div>
                  </div>

                  <div
                    v-for="{ tug, cnt, percentage, tugColor } in missedTugCntList"
                    :key="`${bait.baitId}-${tug}-missed`"
                  >
                    <div
                      v-if="cnt > 0"
                      style="position: relative; width: 48px"
                      :title="percentage.toFixed(2) + '% [' + cnt + '/' + totalCnt + ']'"
                    >
                      <v-progress-circular
                        :value="percentage"
                        rotate="-90"
                        style="position: absolute; top: 6px; left: 8px"
                        :color="tugColor + ' lighten-2'"
                      >
                        <div :style="percentage === 100 ? 'font-size: x-small' : ''">
                          {{ percentage.toFixed(0) }}
                        </div>
                      </v-progress-circular>
                    </div>
                    <div v-else style="width: 48px"></div>
                  </div>

                  <div
                    v-for="{ tug, cnt, percentage, tugColor } in cancelledTugCntList"
                    :key="`${bait.baitId}-${tug}-cancelled`"
                  >
                    <div
                      v-if="cnt > 0"
                      style="position: relative; width: 48px"
                      :title="percentage.toFixed(2) + '% [' + cnt + '/' + totalCnt + ']'"
                    >
                      <v-progress-circular
                        :value="percentage"
                        rotate="-90"
                        style="position: absolute; top: 6px; left: 8px"
                        :color="tugColor + ' lighten-2'"
                      >
                        <div :style="percentage === 100 ? 'font-size: x-small' : ''">
                          {{ percentage.toFixed(0) }}
                        </div>
                      </v-progress-circular>
                    </div>
                    <div v-else style="width: 48px"></div>
                  </div>
                </div>
              </div>
            </template>
            <div v-if="spotId > 0">
              <v-switch v-model="chumBiteTime" label="撒饵" inset />
              <BiteTimeChart :data="biteTimeChartData" />
            </div>
            <div v-if="spotId > 0">
              <v-select
                v-model="fishSelected"
                :items="spotFishList"
                item-text="fishName"
                item-value="fishId"
                label="选择鱼"
              ></v-select>
              <div v-if="spotId > 0 && fishSelected > 0">
                <v-subheader>时间分布</v-subheader>
                <div
                  v-for="(daySection, i) in etBiteCounts"
                  :key="'daySection-' + i"
                  class="d-flex align-center"
                >
                  <div v-for="(etSection, j) in daySection" :key="`etSession-${i}-${j}`">
                    <v-menu
                      open-on-hover
                      open-delay="300"
                      close-deplay="300"
                      right
                      offset-x
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          v-bind="attrs"
                          v-on="on"
                          style="height: 40px; width: 40px; position: relative"
                          :class="
                            'd-flex justify-center align-center' +
                              (etSection > 0 ? ' secondary' : '')
                          "
                        >
                          <div
                            style="
                              position: absolute;
                              top: 0;
                              left: 0;
                              font-size: xx-small;
                              line-height: 14px;
                            "
                          >
                            {{ i * 8 + j }}
                          </div>
                          <div style="font-size: x-large">
                            {{ etSection }}
                          </div>
                        </div>
                      </template>
                      <v-card>
                        <v-card-title>
                          详情（ET {{ i * 8 + j }}时 共{{ etSection }}条记录）
                        </v-card-title>
                        <v-card-text>
                          <div class="d-flex flex-wrap">
                            <div
                              v-for="(entry, idx) in etBiteDetailOf(i * 8 + j, 1, 0.5)"
                              :key="'detail' + idx"
                              class="d-flex flex-column align-center"
                            >
                              <div>
                                {{ entry.time }}
                              </div>
                              <div
                                style="height: 40px; width: 40px"
                                :class="
                                  'd-flex justify-center align-center' +
                                    (entry.cnt > 0 ? ' secondary' : '')
                                "
                                :title="`${entry.cnt}条记录`"
                              >
                                <div style="font-size: x-large">{{ entry.cnt }}</div>
                              </div>
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </div>
                </div>
              </div>
              <div v-if="spotId > 0 && fishSelected > 0">
                <v-subheader>天气分布</v-subheader>
                <div
                  :style="
                    `padding-left: 60px; text-align: center; width: ${40 *
                      (spotWeathers.length + 1)}px`
                  "
                >
                  当前天气
                </div>
                <div class="d-flex align-center">
                  <div style="height: 40px; width: 60px" />
                  <div
                    v-for="(weather, i) in spotWeathers"
                    :key="'th-weather-' + i"
                    class="d-flex"
                  >
                    <div
                      style="height: 40px; width: 40px"
                      class="d-flex justify-center align-center"
                    >
                      <div :class="weather.icon" :title="weather.name" />
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <div style="width: 20px" class="d-flex align-center">
                    <div>前置天气</div>
                  </div>
                  <div>
                    <div
                      v-for="(weatherRow, i) in weatherBiteCounts"
                      :key="'weather-' + i"
                      class="d-flex"
                    >
                      <div style="height: 40px; width: 40px">
                        <div
                          :class="spotWeathers[i].icon"
                          :title="spotWeathers[i].name"
                        />
                      </div>
                      <div
                        v-for="(cnt, j) in weatherRow"
                        :key="'weather-' + i + '-' + j"
                        style="height: 40px; width: 40px"
                        :class="
                          'd-flex justify-center align-center' +
                            (cnt > 0 ? ' secondary' : '')
                        "
                        :title="`${cnt}条记录`"
                      >
                        <div style="font-size: x-large">{{ cnt }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <div v-if="!isLogin()">
              <div>未登录</div>
              <div>按 <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>y</kbd> 以登录</div>
            </div>
            <v-data-table
              :headers="userSpotStatsHeaders"
              :items="userSpotStats"
              multi-sort
              class="elevation-1"
              :loading="loadingUserSpotStats"
            >
              <template v-slot:item.spot="{ item }">
                <div class="d-flex align-center">
                  <div>{{ item.spot.spotName }}</div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-btn @click="refresh">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-data-table
                  :headers="userSpotStatsHeaders"
                  :items="totalSpotStats"
                  multi-sort
                  class="elevation-1"
                  :loading="loadingTotalSpotStats"
                >
                  <template v-slot:item.spot="{ item }">
                    <div class="d-flex align-center">
                      <div>{{ item.spot.spotName }}</div>
                    </div>
                  </template>
                  <template v-slot:item.finished="{ item }">
                    <div class="d-flex align-center">
                      <v-icon v-if="item.finished" color="primary"
                        >mdi-check-decagram</v-icon
                      >
                    </div>
                  </template>
                </v-data-table>
              </v-col>
              <v-col cols="6">
                <date-time-input
                  v-model="recordsStartMillis"
                  date-label="开始日期"
                  time-label="开始时间"
                />
              </v-col>
              <v-col cols="6">
                <date-time-input
                  v-model="recordsEndMillis"
                  date-label="结束日期"
                  time-label="结束时间"
                />
              </v-col>
              <v-col cols="12">
                <v-row no-gutters class="d-flex align-center">
                  <v-col>
                    <div class="d-flex align-center">
                      <v-subheader>模式筛选</v-subheader>
                      <v-btn-toggle
                        v-model="recordsStrictModeFilter"
                        rounded
                        dense
                        mandatory
                        multiple
                        active-class="primary"
                      >
                        <v-btn small v-for="filter in modeFilterOptions" :key="filter">
                          {{ $t('upload.mode.' + filter) }}
                        </v-btn>
                      </v-btn-toggle>
                    </div>
                  </v-col>
                  <v-col>
                    <v-switch v-model="recordsFilterSelf" label="只显示自己的数据" />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-switch v-model="isFixedOwnRecordMode" label="修正上传数据" inset />
              </v-col>
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="records"
                  multi-sort
                  class="elevation-1"
                  :loading="loadingRecords"
                  :server-items-length="totalRecords"
                  :options.sync="options"
                  :footer-props="{ itemsPerPageOptions: [20, 40, 60] }"
                >
                  <template v-slot:item.startTime="{ item }">
                    <div class="d-flex align-center">
                      <div>
                        {{ item.startTime.toLocaleDateString() }}
                        {{ item.startTime.toLocaleTimeString() }}
                      </div>
                    </div>
                  </template>
                  <template v-slot:item.spot="{ item }">
                    <div class="d-flex flex-column justify-center">
                      <div>
                        {{ item.zoneName }}
                      </div>
                      <div>
                        {{ item.spotName }}
                      </div>
                    </div>
                  </template>
                  <template v-slot:item.fish="{ item: record }">
                    <div class="d-flex align-center">
                      <v-badge
                        v-if="record.quantity > 1"
                        :content="record.quantity"
                        overlap
                        bottom
                        bordered
                      >
                        <item-icon :icon-class="record.fishIcon" />
                      </v-badge>
                      <item-icon v-else :icon-class="record.fishIcon" />
                      <div>
                        <span v-if="record.missed">{{ '脱钩' }}</span>
                        <span v-else-if="record.cancelled">{{ '未知鱼' }}</span>
                        <span v-else>
                          {{ record.fishName || '未知鱼' }}
                          <i class="xiv hq" v-if="record.hq"></i>
                        </span>
                        <div class="text-subtitle-2 d-flex">
                          <div
                            v-if="record.size > 0"
                            :class="['mr-2', record.quantity > 1 ? 'ml-2' : '']"
                            title="星寸：人族男性士兵的大拇指宽度、成熟的罗兰莓的长度"
                          >
                            {{ record.size }} Im
                          </div>
                          <!--                  <div-->
                          <!--                    v-if="showPlayerStatus"-->
                          <!--                    class="text-subtitle-2"-->
                          <!--                    title="获得力/鉴别力"-->
                          <!--                  >-->
                          <!--                    {{ record.playerStatus.text }}-->
                          <!--                  </div>-->
                        </div>
                      </div>
                    </div>
                    <!--            <div class="d-flex align-center">-->
                    <!--              <item-icon :icon-class="item.fishIcon"></item-icon>-->
                    <!--              <div>{{ item.fishName }}</div>-->
                    <!--            </div>-->
                  </template>
                  <template v-slot:item.bait="{ item }">
                    <div class="d-flex align-center">
                      <item-icon :icon-class="item.baitIcon"></item-icon>
                      <div>{{ item.baitName }}</div>
                    </div>
                  </template>
                  <template v-slot:item.biteInterval="{ item }">
                    <v-progress-linear
                      :value="item.biteIntervalPercentage"
                      :color="item.tugColor"
                      height="25"
                      rounded
                    >
                      <template>
                        <strong>{{ item.biteInterval }}</strong>
                      </template>
                    </v-progress-linear>
                  </template>
                  <template v-slot:item.userId="{ item }">
                    <div class="d-flex align-center">
                      {{ item.userNickname }}
                    </div>
                  </template>
                  <template v-slot:item.isStrictMode="{ item }">
                    <div class="d-flex align-center">
                      <v-icon v-if="item.isStrictMode">mdi-flag</v-icon>
                    </div>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      v-if="item.userId === currentUserId"
                      icon
                      text
                      color="deep-purple darken-1"
                      @click="throttledToggleRecordStrictMode(item)"
                    >
                      <v-icon>
                        {{
                          item.isStrictMode ? 'mdi-flag-remove-outline' : 'mdi-flag-plus'
                        }}
                      </v-icon>
                    </v-btn>
                    <v-btn
                      v-if="item.userId === currentUserId"
                      icon
                      text
                      color="error"
                      @click="throttledDeleteRecord(item)"
                    >
                      <v-icon>
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import EnvMixin from '@/components/basic/EnvMixin'
import rcapiService, { RC_ACCESS_TOKEN_KEY } from '@/service/rcapiService'
import UploadUtil from '@/utils/UploadUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import throttle from 'lodash/throttle'
import * as _ from 'lodash'
import DataUtil from '@/utils/DataUtil'
import SPOT_FISH_DICT from 'Data/spotFishDict'
import PinyinMatch from 'pinyin-match'
import BiteTimeChart from '@/components/BiteTimeChart'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import SPOT_WEATHER from 'Data/spotWeather'
import uniq from 'lodash/uniq'
import Constants from 'Data/constants'
import DateTimeInput from '@/components/basic/DateTimeInput'

export default {
  name: 'RecordPage',
  components: { DateTimeInput, BiteTimeChart, ItemIcon },
  mixins: [EnvMixin],
  props: ['lazyTransformedFishDict', 'lazySourceFishList'],
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  data() {
    return {
      currentUserId: undefined,
      isFixedOwnRecordMode: false,
      recordsStartMillis: undefined,
      recordsEndMillis: undefined,
      recordsFilterSelf: true,
      recordsStrictModeFilter: [0, 1],
      chumBiteTime: false,
      fishSelected: undefined,
      TUGS: Constants.TUGS,
      tabIndex: 0,
      modeFilters: [0, 1],
      modeFilterOptions: ['strict', 'normal'],
      loadingRecords: true,
      loadingTotalSpotStats: false,
      loadingUserSpotStats: false,
      spotId: -1,
      totalRecords: 0,
      records: [],
      spotRecords: [],
      userSpotStats: [],
      totalSpotStats: [],

      tugColor: {
        light: 'success',
        medium: 'error',
        heavy: 'warning',
      },
      refresh: () => {},
      throttledDeleteRecord: () => {},
      throttledToggleRecordStrictMode: () => {},
      options: {
        sortBy: ['startTime'],
        sortDesc: [true],
        page: 1,
        itemsPerPage: 20,
      },
      fixedHeaders: [
        {
          text: '时间',
          align: 'start',
          sortable: true,
          value: 'startTime',
        },
        {
          text: '钓场',
          align: 'start',
          sortable: true,
          value: 'spot',
        },
        {
          text: '鱼',
          align: 'start',
          sortable: true,
          value: 'fish',
        },
        {
          text: '鱼饵',
          align: 'start',
          sortable: true,
          value: 'bait',
        },
        {
          text: '咬钩时长',
          align: 'start',
          sortable: true,
          value: 'biteInterval',
        },
        {
          text: '上传者',
          align: 'start',
          sortable: true,
          value: 'userId',
        },
        {
          text: '严格模式',
          align: 'start',
          sortable: true,
          value: 'isStrictMode',
        },
      ],
      userSpotStatsHeaders: [
        {
          text: '钓场',
          align: 'start',
          sortable: true,
          value: 'spot',
          sort: (u, v) => u.spotId - v.spotId,
        },
        {
          text: '严格',
          align: 'start',
          sortable: true,
          value: 'strict',
        },
        {
          text: '普通',
          align: 'start',
          sortable: true,
          value: 'normal',
        },
        {
          text: '全部',
          align: 'center',
          sortable: true,
          value: 'total',
        },
        {
          text: '阶段性目标',
          align: 'start',
          sortable: true,
          value: 'finished',
        },
      ],
    }
  },
  watch: {
    options: {
      handler(options) {
        this.getRecords(options, this.filters)
      },
      deep: true,
    },
    filters: {
      handler(filters) {
        this.getRecords(this.options, filters)
      },
    },
    spotId(spotId) {
      if (spotId > 0) {
        rcapiService.getSpotRecords(spotId).then(records => {
          this.spotRecords = records
        })
      }
    },
  },
  async mounted() {
    const userProfile = await rcapiService.getUserProfile()
    this.currentUserId = userProfile.userId
    this.refresh = throttle(this.getTotalTabData, 5000, {
      leading: true,
    })
    this.throttledDeleteRecord = throttle(this.deleteRecord, 500, {
      leading: true,
    })
    this.throttledToggleRecordStrictMode = throttle(this.toggleRecordStrictMode, 500, {
      leading: true,
    })

    this.getTotalSpotStats()
    this.getUserSpotStats()
  },
  computed: {
    headers() {
      if (this.isFixedOwnRecordMode) {
        return [
          ...this.fixedHeaders,
          {
            text: '操作',
            align: 'start',
            sortable: false,
            value: 'actions',
          },
        ]
      } else {
        return this.fixedHeaders
      }
    },
    filters() {
      return {
        startTime: this.recordsStartMillis,
        endTime: this.recordsEndMillis,
        strictMode: this.recordsStrictModeFilter.map(
          filterIndex => this.modeFilterOptions[filterIndex]
        ),
        filterSelf: this.recordsFilterSelf,
      }
    },
    spotFishList() {
      return UploadUtil.fishListOfSpot(this.spotId).map(id => UploadUtil.toFish(id))
    },
    biteTimeChartData() {
      // :records="fishBiteTimes" :fish-list="spotFishList"
      return {
        records: this.fishBiteTimes,
        allBaitRecords: this.allBaitFishBiteTimes,
        fishList: this.spotFishList.map(it => it.fishName),
        baitList: Object.keys(this.fishBiteTimes).map(bait => UploadUtil.toBait(bait)),
      }
    },
    allBaitFishBiteTimes() {
      const filters = this.modeFilters.map(i => this.modeFilterOptions[i])
      const showStrict = filters.includes('strict')
      const showNormal = filters.includes('normal')
      const records = this.spotRecords[0] // [data, totalCnt]
      return _(records)
        .chain()
        .filter(
          ({ fish, bait, biteInterval, chum }) =>
            fish > 0 &&
            bait > 0 &&
            biteInterval > 0 &&
            biteInterval < 70 &&
            chum === this.chumBiteTime
        )
        .filter(({ isStrictMode }) => {
          return (isStrictMode && showStrict) || (!isStrictMode && showNormal)
        })
        .groupBy(({ fish }) => UploadUtil.toFish(fish).fishName)
        .mapValues(baitRec => [
          _.minBy(baitRec, 'biteInterval')?.biteInterval,
          _.maxBy(baitRec, 'biteInterval')?.biteInterval,
        ])
        .value()
    },
    spotWeathers() {
      return uniq((SPOT_WEATHER[this.spotId] ?? []).filter(it => it > 0))
        .sort()
        .map(weatherId => UploadUtil.toWeather(weatherId))
    },
    weatherBiteCounts() {
      const weathers = this.spotWeathers.map(it => it.id)
      let table = []
      for (const weather of weathers) {
        let row = []
        for (const prevWeather of weathers) {
          row.push(this.weatherBiteCountsDict[weather + '-' + prevWeather] ?? 0)
        }
        table.push(row)
      }
      return table
    },
    weatherBiteCountsDict() {
      const filters = this.modeFilters.map(i => this.modeFilterOptions[i])
      const showStrict = filters.includes('strict')
      const showNormal = filters.includes('normal')
      const records = this.spotRecords[0] // [data, totalCnt]
      return _(records)
        .chain()
        .filter(
          ({ fish, prevWeather, weather }) =>
            fish > 0 && prevWeather > 0 && weather > 0 && fish === this.fishSelected
        )
        .filter(({ isStrictMode }) => {
          return (isStrictMode && showStrict) || (!isStrictMode && showNormal)
        })
        .groupBy(({ prevWeather, weather }) => prevWeather + '-' + weather)
        .mapValues(records => records.length)
        .value()
    },
    etBiteCountsDict() {
      const filters = this.modeFilters.map(i => this.modeFilterOptions[i])
      const showStrict = filters.includes('strict')
      const showNormal = filters.includes('normal')
      const records = this.spotRecords[0] // [data, totalCnt]
      return _(records)
        .chain()
        .filter(
          ({ fish, etHour, etMinute }) =>
            fish > 0 &&
            etHour >= 0 &&
            etHour <= 23 &&
            etMinute >= 0 &&
            etMinute <= 59 &&
            fish === this.fishSelected
        )
        .filter(({ isStrictMode }) => {
          return (isStrictMode && showStrict) || (!isStrictMode && showNormal)
        })
        .groupBy(({ etHour, etMinute }) => etHour * 60 + Math.floor(etMinute / 30) * 30)
        .mapValues(records => records.length)
        .value()
    },
    etBiteCounts() {
      const all = this.etCountsOf(0, 24, 1)
      let table = []
      for (let j = 0; j < 24; j += 8) {
        let row = []
        for (let i = 0; i < 8; i += 1) {
          row.push(all[j + i])
        }
        table.push(row)
      }
      return table
    },
    fishBiteTimes() {
      const filters = this.modeFilters.map(i => this.modeFilterOptions[i])
      const showStrict = filters.includes('strict')
      const showNormal = filters.includes('normal')
      const records = this.spotRecords[0] // [data, totalCnt]
      return _(records)
        .chain()
        .filter(
          ({ fish, bait, biteInterval, chum }) =>
            fish > 0 &&
            bait > 0 &&
            biteInterval > 0 &&
            biteInterval < 70 &&
            chum === this.chumBiteTime
        )
        .filter(({ isStrictMode }) => {
          return (isStrictMode && showStrict) || (!isStrictMode && showNormal)
        })
        .groupBy(({ bait }) => bait)
        .mapValues(records => {
          return _(records)
            .chain()
            .groupBy(({ fish }) => UploadUtil.toFish(fish).fishName)
            .mapValues(baitRec => [
              _.minBy(baitRec, 'biteInterval')?.biteInterval,
              _.maxBy(baitRec, 'biteInterval')?.biteInterval,
            ])
            .value()
        })
        .value()
    },
    baitOfSpot() {
      const filters = this.modeFilters.map(i => this.modeFilterOptions[i])
      const showStrict = filters.includes('strict')
      const showNormal = filters.includes('normal')
      const records = this.spotRecords[0] // [data, totalCnt]
      const baitFishCnt = _(records)
        .chain()
        .filter(({ fish, bait }) => fish > 0 && bait > 0)
        .filter(({ isStrictMode }) => {
          return (isStrictMode && showStrict) || (!isStrictMode && showNormal)
        })
        .groupBy(({ bait }) => bait)
        .mapValues(records => {
          return _(records)
            .chain()
            .groupBy(({ fish }) => fish)
            .mapValues(baitRec => baitRec.length)
            .value()
        })
        .value()

      const cancelledFish = _(records)
        .chain()
        .filter(({ fish, bait, cancelled }) => fish === -1 && cancelled && bait > 0)
        .filter(({ isStrictMode }) => {
          return (isStrictMode && showStrict) || (!isStrictMode && showNormal)
        })
        .groupBy(({ bait }) => bait)
        .mapValues(records => {
          return _(records)
            .chain()
            .groupBy(({ tug }) => {
              return this.TUGS[tug]
            })
            .mapValues(baitRec => baitRec.length)
            .value()
        })
        .value()

      const missedFish = _(records)
        .chain()
        .filter(({ fish, bait, missed }) => fish === -1 && missed && bait > 0)
        .filter(({ isStrictMode }) => {
          return (isStrictMode && showStrict) || (!isStrictMode && showNormal)
        })
        .groupBy(({ bait }) => bait)
        .mapValues(records => {
          return _(records)
            .chain()
            .groupBy(({ tug }) => {
              return this.TUGS[tug]
            })
            .mapValues(baitRec => baitRec.length)
            .value()
        })
        .value()

      const fishIdList = UploadUtil.fishListOfSpot(this.spotId) //.concat(['light', 'medium', 'heavy'])
      const baitFishCntList = Object.entries(baitFishCnt).map(([bait, fishCntDict]) => {
        const missedTugCntDict = missedFish[bait] ?? {}
        const cancelledTugCntDict = cancelledFish[bait] ?? {}
        const totalCnt =
          _.sum(Object.values(fishCntDict)) +
          _.sum(Object.values(missedTugCntDict)) +
          _.sum(Object.values(cancelledTugCntDict))

        return {
          bait: UploadUtil.toBait(bait),
          fishCntList: fishIdList.map(fishId => {
            const fishInfo =
              this.lazyTransformedFishDict[fishId] ??
              this.lazyTransformedFishDict[
                Object.keys(this.lazyTransformedFishDict).find(
                  id => DataUtil.toItemId(id) === fishId
                )
              ]
            // console.log(
            //   fishInfo,
            //   fishId,
            //   this.lazyTransformedFishDict[fishId],
            //   fishLocationId
            // )
            const cnt = fishCntDict[fishId] ?? 0
            return {
              fish: UploadUtil.toFish(fishId),
              cnt: cnt,
              percentage: (cnt / totalCnt) * 100,
              tugColor: this.tugColor[
                fishInfo?.baits?.[fishInfo?.baits?.length - 1 ?? 0]?.tug
              ],
            }
          }),
          missedTugCntList: Constants.TUGS.map(tug => {
            const cnt = missedTugCntDict[tug] ?? 0
            return {
              tug: tug,
              cnt: cnt,
              percentage: (cnt / totalCnt) * 100,
              tugColor: this.tugColor[tug],
            }
          }),
          cancelledTugCntList: Constants.TUGS.map(tug => {
            const cnt = cancelledTugCntDict[tug] ?? 0
            return {
              tug: tug,
              cnt: cnt,
              percentage: (cnt / totalCnt) * 100,
              tugColor: this.tugColor[tug],
            }
          }),
          totalCnt: totalCnt,
        }
      })

      return {
        fishList: fishIdList.map(fishId => UploadUtil.toFish(fishId)),
        baitFishCntList: _.sortBy(baitFishCntList, ({ bait: { baitId } }) => {
          // console.log(fishIdList, baitId, fishIdList.includes(baitId))
          return baitId * (fishIdList.includes(+baitId) ? 1000000 : 1)
        }),
      }
    },
    spotsForSearch() {
      return Object.keys(SPOT_FISH_DICT).map(spotId => {
        const spot = UploadUtil.toSpot(spotId)
        return {
          id: spotId,
          name: spot.spotName,
        }
      })
    },
  },
  methods: {
    async toggleRecordStrictMode(record) {
      console.log('set to', !record.isStrictMode)
      await rcapiService.setOwnRecordStrictMode(record.id, !record.isStrictMode)
      this.getTotalTabData()
    },
    async deleteRecord(record) {
      console.log('remove', record)
      await rcapiService.removeOwnRecord(record.id)
      this.getTotalTabData()
    },
    etBiteDetailOf(start, duration, interval) {
      const ret = []
      const cnts = this.etCountsOf(start, duration, interval)
      for (let i = start, idx = 0; i < start + duration; i += interval, idx++) {
        const hour = Math.floor(i)
        const minute = (i - hour) * 60
        const paddingZero = it => (it >= 10 ? it : '0' + it)
        ret.push({ time: paddingZero(hour) + ':' + paddingZero(minute), cnt: cnts[idx] })
      }
      return ret
    },
    etCountsOf(start, duration, interval) {
      let table = []
      const intervalMinute = interval * 60
      for (let i = start * 60; i < (start + duration) * 60; i += intervalMinute) {
        let intervalCnt = 0
        for (let offset = 0; offset < intervalMinute; offset++) {
          intervalCnt += this.etBiteCountsDict[i + offset] ?? 0
        }
        table.push(intervalCnt)
      }
      return table
    },
    isLogin() {
      return !!LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)
    },
    searchFilterOptions(item, searchText, itemText) {
      if (this.$i18n.locale === 'zh-CN') {
        return PinyinMatch.match(itemText, searchText) !== false
      } else {
        return itemText.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      }
    },
    getTotalTabData() {
      this.getRecords(this.options, this.filters)
      this.getTotalSpotStats()
    },
    getRecords(options, filters) {
      const { sortBy, sortDesc, page, itemsPerPage } = options
      this.loadingRecords = true
      rcapiService
        .getRecords(
          sortBy,
          sortDesc,
          page - 1,
          itemsPerPage,
          filters.startTime,
          filters.endTime,
          filters.strictMode,
          filters.filterSelf
        )
        .then(data => {
          const [records, total] = data
          this.records = records
            .map(record => UploadUtil.toReadableData(record))
            .map(record => {
              return {
                ...record,
                fishBasicInfo: this.lazyTransformedFishDict[record.fishId] ?? {},
              }
            })
          this.totalRecords = total
          this.loadingRecords = false
        })
    },
    async getUserSpotStats() {
      this.loadingUserSpotStats = true
      const spots = await rcapiService.getUserSpotStats()
      const userSpot = _(spots)
        .chain()
        .groupBy('spot')
        .mapValues(records => {
          return {
            spot: UploadUtil.toSpot(records?.[0]?.spot),
            strict: records.find(it => it.isStrictMode)?.count ?? 0,
            normal: records.find(it => !it.isStrictMode)?.count ?? 0,
            total: _.sumBy(records, 'count'),
          }
        })
        .value()
      this.loadingUserSpotStats = false
      this.userSpotStats = Object.values(userSpot)
    },
    async getTotalSpotStats() {
      this.loadingTotalSpotStats = true
      const spots = await rcapiService.getTotalSpotStats()
      const userSpot = _(spots)
        .chain()
        .groupBy('spot')
        .mapValues(records => {
          const strict = records.find(it => it.isStrictMode)?.count ?? 0
          return {
            spot: UploadUtil.toSpot(records?.[0]?.spot),
            strict: strict,
            normal: records.find(it => !it.isStrictMode)?.count ?? 0,
            total: _.sumBy(records, 'count'),
            finished: strict >= 1000,
          }
        })
        .value()
      this.loadingTotalSpotStats = false
      this.totalSpotStats = Object.values(userSpot)
    },
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"
.detail-wrapper
  width: 100%
  height: 100%
  overflow-scrolling: auto
  overflow-y: scroll
  overflow-x: hidden

  &--web
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

  &--electron
    max-height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding})
</style>
