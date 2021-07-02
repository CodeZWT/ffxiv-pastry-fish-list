<template>
  <v-container
    fluid
    :class="
      `detail-wrapper ${isElectron ? 'detail-wrapper--electron' : 'detail-wrapper--web'}`
    "
  >
    <v-row>
      <v-col cols="12">
        <v-sheet>
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
            <div class="d-flex">
              <div style="width: 48px"></div>
              <div v-for="fish in baitOfSpot.fishList" :key="fish.fishId">
                <item-icon :icon-class="fish.fishIcon" />
              </div>
            </div>
            <div
              v-for="{ bait, fishCntList, totalCnt } in baitOfSpot.baitFishCntList"
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
          </template>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-btn @click="refresh"><v-icon>mdi-refresh</v-icon></v-btn>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="records"
          multi-sort
          class="elevation-1"
          :loading="loading"
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
              <v-icon v-if="item.isStrictMode">mdi-check</v-icon>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EnvMixin from '@/components/basic/EnvMixin'
import rcapiService from '@/service/rcapiService'
import UploadUtil from '@/utils/UploadUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import throttle from 'lodash/throttle'
import * as _ from 'lodash'
import DataUtil from '@/utils/DataUtil'
import SPOT_FISH_DICT from 'Data/spotFishDict'
import PinyinMatch from 'pinyin-match'

export default {
  name: 'RecordPage',
  components: { ItemIcon },
  mixins: [EnvMixin],
  props: ['lazyTransformedFishDict', 'lazySourceFishList'],
  data() {
    return {
      modeFilters: [0, 1],
      modeFilterOptions: ['strict', 'normal'],
      loading: true,
      spotId: 122,
      totalRecords: 0,
      records: [],
      spotRecords: [],
      refresh: () => {},
      options: {
        sortBy: ['startTime'],
        sortDesc: [true],
        page: 1,
        itemsPerPage: 20,
      },
      headers: [
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
    }
  },
  watch: {
    options: {
      handler(options) {
        this.getDataFromApi(options)
      },
      deep: true,
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
    this.refresh = throttle(() => this.getDataFromApi(this.options), 5000, {
      leading: true,
    })
  },
  computed: {
    baitOfSpot() {
      const tugColor = {
        light: 'success',
        medium: 'error',
        heavy: 'warning',
      }
      const filters = this.modeFilters.map(i => this.modeFilterOptions[i])
      const showStrict = filters.includes('strict')
      const showNormal = filters.includes('normal')
      const baitFishCnt = _(this.spotRecords[0])
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
      const fishIdList = UploadUtil.fishListOfSpot(this.spotId)
      const baitFishCntList = Object.entries(baitFishCnt).map(([bait, fishCntDict]) => {
        const totalCnt = _.sum(Object.values(fishCntDict))
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
              tugColor:
                tugColor[fishInfo?.baits?.[fishInfo?.baits?.length - 1 ?? 0]?.tug],
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
    searchFilterOptions(item, searchText, itemText) {
      if (this.$i18n.locale === 'zh-CN') {
        return PinyinMatch.match(itemText, searchText) !== false
      } else {
        return itemText.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      }
    },
    getDataFromApi(options) {
      const { sortBy, sortDesc, page, itemsPerPage } = options
      this.loading = true
      rcapiService.getRecords(sortBy, sortDesc, page - 1, itemsPerPage).then(data => {
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
        this.loading = false
      })
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
