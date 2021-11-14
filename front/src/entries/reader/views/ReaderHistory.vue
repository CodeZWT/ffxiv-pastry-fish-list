<template>
  <div class="wrapper">
    <v-expand-transition>
      <v-card v-if="showConfig">
        <v-card-text>
          <v-row no-gutters>
            <v-btn
              :readonly="exporting || generating"
              :disabled="deleting"
              @click="exportHistory"
              color="primary"
            >
              <template v-if="exporting && !generating">
                读取数据中 {{ exportPercentage }}
              </template>
              <template v-else-if="exporting && generating">生成文件中</template>
              <template v-else> <v-icon>mdi-file-table</v-icon>导出至文件</template>
            </v-btn>
            <v-btn
              icon
              text
              @click="openHelp"
              class="ml-1"
              title="点击查看如何使用导出文件"
            >
              <new-feature-mark id="ExportHelp-V.0.6.6-1">
                <v-icon>mdi-help-circle</v-icon>
              </new-feature-mark>
            </v-btn>
            <v-spacer />
            <v-btn
              :loading="deleting"
              :disabled="exporting"
              @click="showClearConfirmDialog = true"
              color="error"
            >
              <v-icon>mdi-file-remove</v-icon>清空记录
            </v-btn>
          </v-row>
          <v-row no-gutters>
            <v-col class="d-flex align-center">
              <div class="mr-2">显示未知鱼记录</div>
              <v-switch
                :input-value="showIgnoredRecord"
                @change="setStates({ showIgnoredRecord: $event })"
                inset
              />
            </v-col>
            <v-col class="d-flex align-center">
              <div class="mr-2">显示耐心状态</div>
              <v-switch
                :input-value="showPatient"
                @change="setStates({ showPatient: $event })"
                inset
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="d-flex align-center">
              <div class="mr-2">显示获得力&鉴别力</div>
              <v-switch
                :input-value="showPlayerStatus"
                @change="setStates({ showPlayerStatus: $event })"
                inset
              />
            </v-col>
            <v-col class="d-flex align-center">
              <div class="mr-2">显示提钩类别</div>
              <v-switch
                :input-value="showHookset"
                @change="setStates({ showHookset: $event })"
                inset
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <rc-autocomplete
                ref="search"
                v-model="recordsFilterSpotId"
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
              </rc-autocomplete>
            </v-col>
            <v-col cols="12">
              <rc-autocomplete
                ref="search"
                v-model="recordsFilterFishId"
                :items="fishForSearch"
                item-value="id"
                item-text="name"
                label="请输入鱼"
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
              </rc-autocomplete>
            </v-col>
            <v-col cols="12">
              <rc-autocomplete
                ref="search"
                v-model="recordsFilterBaitId"
                :items="baitForSearch"
                item-value="id"
                item-text="name"
                label="请输入鱼饵"
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
              </rc-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-expand-transition>
    <v-divider v-if="showConfig"></v-divider>
    <div v-if="records.length > 0">
      <v-list>
        <div v-for="(record, index) in records" :key="index">
          <v-divider v-if="index > 0" />
          <v-hover v-slot="{ hover }" open-delay="300" close-deplay="300">
            <v-list-item>
              <v-list-item-content>
                <v-row no-gutters class="d-flex align-center">
                  <v-col cols="5" class="d-flex align-center">
                    <v-badge
                      v-if="record.fish.quantity > 1"
                      :content="record.fish.quantity"
                      overlap
                      bottom
                      bordered
                    >
                      <item-icon :icon-class="record.fish.icon" small />
                    </v-badge>
                    <item-icon v-else :icon-class="record.fish.icon" small />
                    <div>
                      <span v-if="record.missed">{{ '脱钩' }}</span>
                      <span v-else-if="record.cancelled">{{ '未知鱼' }}</span>
                      <span v-else>
                        {{ record.fish.name || '未知鱼' }}
                        <i class="xiv hq" v-if="record.hq"></i>
                      </span>
                      <div class="text-subtitle-2 d-flex">
                        <div
                          v-if="record.size > 0"
                          :class="['mr-2', record.fish.quantity > 1 ? 'ml-2' : '']"
                          title="星寸：人族男性士兵的大拇指宽度、成熟的罗兰莓的长度"
                        >
                          {{ record.fish.size }}
                        </div>
                        <div
                          v-if="showPlayerStatus"
                          class="text-subtitle-2"
                          title="获得力/鉴别力"
                        >
                          {{ record.playerStatus.text }}
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="3" class="d-flex align-center flex-wrap">
                    <div v-for="effect in record.effects" :key="effect.ID">
                      <effect-icon :icon-class="effect.icon" :title="effect.name" />
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <v-progress-linear
                      :value="record.biteIntervalPercentage"
                      :color="record.tug.color"
                      height="25"
                      rounded
                    >
                      <template>
                        <strong>{{ record.biteInterval }}</strong>
                      </template>
                    </v-progress-linear>
                  </v-col>

                  <v-chip
                    v-if="hover && canDelete"
                    style="position: absolute; right: 0; top: 0"
                    class="rounded-r-0 rounded-bl-xl rounded-tl-0"
                    x-small
                    color="error"
                    v-ripple
                    @click="removeRecord(record)"
                  >
                    <v-icon x-small>mdi-close</v-icon>
                  </v-chip>
                </v-row>
              </v-list-item-content>
              <item-icon
                v-if="showHookset"
                :icon-class="record.hookset.icon"
                small
                type="action"
              />
              <item-icon :icon-class="record.bait.icon" small :title="record.bait.name" />
              <template v-if="isTest">
                <rc-tooltip v-if="record.uploaded">
                  <v-icon
                    style="position: absolute; right: 2px; top: 24px"
                    small
                    :color="record.isStrictMode ? 'deep-purple darken-1' : ''"
                  >
                    mdi-arrow-up-bold
                  </v-icon>
                  <template v-slot:msg>
                    {{ record.isStrictMode ? '严格模式已上传' : '已上传' }}
                  </template>
                </rc-tooltip>
                <rc-tooltip v-else-if="record.uploadEnabled">
                  <v-icon
                    style="position: absolute; right: 2px; top: 24px"
                    small
                    :color="record.isStrictMode ? 'deep-purple darken-1' : ''"
                  >
                    mdi-arrow-up-bold-outline
                  </v-icon>
                  <template v-slot:msg>
                    {{ record.isStrictMode ? '严格模式等待上传' : '等待上传' }}
                  </template>
                </rc-tooltip>
              </template>
            </v-list-item>
          </v-hover>
        </div>
      </v-list>
      <v-btn
        v-if="remainingCnt > 0"
        block
        color="primary"
        class="rounded-t-0"
        @click="loadingMore"
      >
        <!--        加载更多-->
        {{ $t('loadingMoreWithRemainingCnt', { remainingCnt }) }}
      </v-btn>
    </div>
    <div v-else>
      <v-card>
        <v-card-text>
          <div class="text-h6 text-center">无历史记录</div>
        </v-card-text>
      </v-card>
    </div>
    <rc-dialog v-model="showClearConfirmDialog" max-width="300">
      <v-card>
        <v-card-title> 确认清空所有记录吗？ </v-card-title>
        <v-card-text>
          此操作无法恢复！<br />
          导出的CSV文件无法用来恢复记录！
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn @click="showClearConfirmDialog = false"> 取消 </v-btn>
          <v-btn color="error" @click="clearHistory"> 清空 </v-btn>
        </v-card-actions>
      </v-card>
    </rc-dialog>
  </div>
</template>

<script>
import { DIADEM_ZONE, OCEAN_FISHING_ZONE } from 'Data/constants'
import { ITEMS as NameDict } from 'Data/translation'
import { invokeElectronEvent, sendElectronEvent } from '@/utils/electronHelper'
import { mapMutations, mapState } from 'vuex'
import BAITS from 'Data/bait'
import COMMON from 'Data/common'
import DATA from 'Data/data'
import DataUtil from '@/utils/DataUtil'
import EffectIcon from '@/components/basic/EffectIcon'
import EnvMixin from '@/components/basic/EnvMixin'
import EorzeaTime from '@/utils/Time'
import FishDict from 'Data/fish'
import ItemIcon from '@/components/basic/ItemIcon'
import NewFeatureMark from '@/components/basic/NewFeatureMark'
import PLACE_NAMES from 'Data/placeNames'
import PinyinMatch from 'pinyin-match'
import RcAutocomplete from '@/components/basic/RcAutocomplete'
import RcDialog from '@/components/basic/RcDialog'
import RcTooltip from '@/components/basic/RcTooltip'
import SPOT_FISH_DICT from 'Data/spotFishDict'
import UploadUtil from '@/utils/UploadUtil'
import Weather from '@/utils/Weather'
import _ from 'lodash'
import db from '@/plugins/db'
// import TEST from 'Data/test'

const INITIAL_LOADING_CNT = 100
const LOAD_MORE_CNT = 100

export default {
  name: 'ReaderHistory',
  mixins: [EnvMixin],
  components: {
    RcTooltip,
    RcAutocomplete,
    RcDialog,
    EffectIcon,
    NewFeatureMark,
    ItemIcon,
  },
  data() {
    return {
      recordsFilterSpotId: undefined,
      recordsFilterFishId: undefined,
      recordsFilterBaitId: undefined,
      targetFishId: undefined,
      totalExportCount: 0,
      exportedRecordCount: 0,
      loadingCnt: INITIAL_LOADING_CNT,
      rawRecords: [], //TEST.READER_HISTORY_RECORDS,
      dbRecordsCnt: 0,
      exporting: false,
      generating: false,
      deleting: false,
      showClearConfirmDialog: false,
      showExportError: false,
    }
  },
  computed: {
    ...mapState('readerHistory', [
      'showConfig',
      'showIgnoredRecord',
      'showPatient',
      'showPlayerStatus',
      'showHookset',
    ]),
    spotsForSearch() {
      return Object.keys(SPOT_FISH_DICT).map(spotId => {
        const spot = UploadUtil.toSpot(spotId)
        return {
          id: spotId,
          name: spot.spotName,
        }
      })
    },
    fishOptions() {
      return _.uniqBy(
        Object.values(FishDict).map(({ _id: id }) => {
          const itemId = DataUtil.toItemId(id)
          return {
            id: itemId,
            name: NameDict[itemId].name_chs,
          }
        }),
        'id'
      )
    },
    fishForSearch() {
      return [
        // { id: -2, name: '脱钩' },
        // { id: -3, name: '未知' },
        { id: -1, name: '脱钩或未知' },
      ].concat(this.fishOptions)
    },
    baitForSearch() {
      return []
        .concat(
          _.uniqBy(
            Object.entries(BAITS).map(([id, name]) => {
              return {
                id: DataUtil.toItemId(id),
                name: name,
              }
            }),
            'id'
          )
        )
        .concat(this.fishOptions)
    },
    canDelete() {
      return !this.deleting && !this.exporting && !this.generating
    },
    exportPercentage() {
      if (this.totalExportCount) {
        return ((this.exportedRecordCount / this.totalExportCount) * 100).toFixed(0) + '%'
      }
      return ''
    },
    dbLoadedCnt() {
      return this.rawRecords.length
    },
    remainingCnt() {
      return this.dbRecordsCnt - this.loadingCnt
    },
    records() {
      const records = this.rawRecords.slice(0, this.loadingCnt).map(record => {
        const biteInterval = +((record.biteTime - record.startTime) / 1000).toFixed(1)
        return {
          ...record,
          biteInterval: biteInterval,
          fish: {
            ...DataUtil.FISH_DATA[record.fishId],
            icon: record.missed
              ? 'bg-060034'
              : record.cancelled
              ? 'bg-060027'
              : DataUtil.getItemIconClass(record.fishId, 60027),
            name: DataUtil.getItemName(record.fishId),
            size: (record.size / 10).toFixed(1) + 'Im',
            quantity: record.quantity,
          },
          bait: {
            id: record.baitId,
            icon: DataUtil.getItemIconClass(record.baitId, 60051),
            name: DataUtil.getItemName(record.baitId) ?? '未检测到鱼饵',
          },
          tug: {
            color: DataUtil.TUG_ICON_COLOR[DataUtil.TUG_ICON[record.tug]],
          },
          hookset: {
            icon: DataUtil.iconIdToClass(
              DataUtil.HOOKSET_ICON[_.capitalize(record.hookset)]
            ),
          },
          effects: Object.values(COMMON.STATUS)
            .filter(status => record[status.key])
            .filter(
              status =>
                this.showPatient ||
                !['gatheringFortuneUp', 'catchAndRelease'].includes(status.key)
            )
            .map(effect => {
              return {
                icon: DataUtil.iconIdToClass(effect.icon),
                name: DataUtil.getName(effect),
              }
            }),
          playerStatus: {
            text: record.gathering ? `${record.gathering}/${record.perception}` : '',
          },
        }
      })

      const maxBiteInterval = _.max(records.map(it => it.biteInterval))
      let intervalMax = 60
      if (maxBiteInterval != null) {
        const maxBiteIntervalInteger = +maxBiteInterval.toFixed(1).split('.')[0]
        intervalMax = maxBiteIntervalInteger - (maxBiteIntervalInteger % 10) + 10
      }
      return records.map(record => {
        return {
          ...record,
          biteIntervalPercentage: (record.biteInterval / intervalMax) * 100,
        }
      })
    },
  },
  watch: {
    showIgnoredRecord(showIgnoredRecord) {
      this.loadRecord(0, this.loadingCnt, showIgnoredRecord).then(data => {
        this.rawRecords = data
      })
    },
  },
  async created() {
    await this.init()

    window.electron?.ipcRenderer
      ?.on('newRecord', (event, data) => {
        // console.log('data', JSON.stringify(data))
        if (this.rawRecords.length > 0 && this.rawRecords[0].id === data.id) {
          this.rawRecords.splice(0, 1, data)
        } else {
          this.rawRecords.splice(0, 0, data)
          // this.dbLoadedCnt++
          this.dbRecordsCnt++
          console.debug(
            'Records Total',
            this.dbRecordsCnt,
            'Loaded',
            this.rawRecords.length
          )
        }
      })
      ?.on('exportHistoryFinished', () => {
        this.exporting = false
      })
      ?.on('exportHistoryFailedWithBusyFile', () => {
        this.showExportError = true

        this.showSnackbar({
          text: '导出失败，文件已打开。',
          color: 'error',
        })

        this.generating = false
      })
  },
  mounted() {
    this.$watch(
      () => {
        return (
          this.recordsFilterSpotId + this.recordsFilterFishId + this.recordsFilterBaitId
        )
      },
      () => {
        this.loadRecord(0, INITIAL_LOADING_CNT, this.showIgnoredRecord).then(data => {
          this.rawRecords = data
          this.loadingCnt = INITIAL_LOADING_CNT
        })
      }
    )
  },
  methods: {
    ...mapMutations('readerHistory', ['setStates']),
    searchFilterOptions(item, searchText, itemText) {
      if (this.$i18n.locale === 'zh-CN') {
        return PinyinMatch.match(itemText, searchText) !== false
      } else {
        return itemText.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      }
    },
    removeRecord(record) {
      const index = this.rawRecords.findIndex(it => it.id === record.id)
      if (index > -1) {
        this.rawRecords.splice(index, 1)
        db.records.delete(record.id)
        this.dbRecordsCnt--
        this.sendElectronEvent('reloadRecords')
      }
    },
    openHelp() {
      window.open(
        'https://ricecake302.coding.net/s/eb3a7844-db84-4792-90db-7805f6a941c1/2'
      )
    },
    async init() {
      this.rawRecords = await this.loadRecord(0, this.loadingCnt, this.showIgnoredRecord)
      // this.dbLoadedCnt = this.rawRecords.length
      // console.log(this.toUploadData(this.rawRecords))
      console.debug('Records Total', this.dbRecordsCnt, 'Loaded', this.rawRecords.length)
    },
    async loadRecord(offset, limit, showIgnoredRecord) {
      let result = []
      if (
        this.recordsFilterSpotId != null ||
        this.recordsFilterFishId != null ||
        this.recordsFilterBaitId != null
      ) {
        const whereConfig = {}
        if (this.recordsFilterSpotId != null) {
          whereConfig.spotId = +this.recordsFilterSpotId
        }
        if (this.recordsFilterFishId != null) {
          // if (this.recordsFilterFishId === -2) {
          //   whereConfig.missed = true
          // } else if (this.recordsFilterFishId === -3) {
          //   whereConfig.cancelled = true
          // } else {
          whereConfig.fishId = +this.recordsFilterFishId
          // }
        }
        // else {
        //   if (!showIgnoredRecord) {
        //     whereConfig.cancelled = false
        //   }
        // }
        if (this.recordsFilterBaitId != null) {
          // if (this.recordsFilterBaitId === -1) {
          // whereConfig.baitId = undefined
          // } else {
          whereConfig.baitId = +this.recordsFilterBaitId
          // }
        }

        this.dbRecordsCnt = await db.records.where(whereConfig).count()
        result = await db.records
          .where(whereConfig)
          .offset(offset)
          .limit(limit)
          .reverse()
          .sortBy('startTime')
      } else {
        let table = db.records.orderBy('startTime').reverse()
        if (!showIgnoredRecord) {
          table = table.filter(record => !record.cancelled)
        }
        result = await table
          .offset(offset)
          .limit(limit)
          .toArray()
        // if (showIgnoredRecord) {
        this.dbRecordsCnt = await db.records.count()
        // } else {
        //   this.dbRecordsCnt = await db.records.where({ cancelled: false }).count()
        // }
      }

      return result
    },
    async loadingMore() {
      this.loadingCnt += LOAD_MORE_CNT
      if (this.loadingCnt > this.dbLoadedCnt && this.dbLoadedCnt < this.dbRecordsCnt) {
        const newLoadedRecords = await this.loadRecord(
          this.dbLoadedCnt,
          LOAD_MORE_CNT,
          this.showIgnoredRecord
        )
        // this.dbLoadedCnt += newLoadedRecords.length
        this.rawRecords = this.rawRecords.concat(newLoadedRecords)
      }
    },
    clearHistory() {
      this.deleting = true
      this.showClearConfirmDialog = false
      db.records
        .clear()
        .then(() => {
          this.init()
        })
        .then(() => {
          this.sendElectronEvent('reloadRecords')
          this.deleting = false
        })
    },
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
    async exportHistory() {
      if (!this.exporting) {
        this.exporting = true

        this.totalExportCount = await db.records.count()
        console.debug('[export] start export', this.totalExportCount, 'records')
        let allData = []
        const batchCnt = 100
        for (let i = 0; i < this.totalExportCount; i += batchCnt) {
          console.debug(
            `[export] exporting: ${i} to ${Math.min(i + batchCnt, this.totalExportCount) -
              1}`
          )
          const batchData = await db.records
            .offset(i)
            .limit(batchCnt)
            .toArray()
          this.exportedRecordCount = i
          allData.splice(0, 0, ...this.toExportData(batchData))
        }
        const max = Date.now()
        allData = _.sortBy(allData, it => max - it.timestamp)
        console.debug('[export] read data finished')
        this.generating = true
        invokeElectronEvent('showExportFileDialog', null, async continueExport => {
          this.exporting = false
          if (continueExport) {
            sendElectronEvent('exportHistory', allData)
          } else {
            this.generating = false
            console.debug('[export] generation finished')
          }
        })
      }
    },
    isDiademSpot: DataUtil.isDiademSpot,
    isOceanFishingSpot: DataUtil.isOceanFishingSpot,
    toExportData(records) {
      // console.log(JSON.stringify(records))
      return records
        .map(record => {
          try {
            const date = new Date(record.startTime)
            const spotId = record.spotId
            const et = new EorzeaTime(EorzeaTime.toEorzeaTime(record.startTime))
            const row = {
              日期: date.toLocaleDateString('zh-CN'),
              时间: date.toLocaleTimeString('zh-CN', { hour12: false }),
              ET: et.toString(),
              前置天气: Weather.weatherTextOf(
                spotId > 0
                  ? this.isOceanFishingSpot(spotId) || this.isDiademSpot(spotId)
                    ? record.prevWeatherDetected
                    : Weather.prevWeatherAtSpot(spotId, et)
                  : undefined
              ),
              天气: Weather.weatherTextOf(
                spotId > 0
                  ? this.isOceanFishingSpot(spotId) || this.isDiademSpot(spotId)
                    ? record.weatherDetected
                    : Weather.weatherAtSpot(spotId, et)
                  : undefined
              ),
              钓场: DataUtil.getName(
                spotId > 0 ? DataUtil.FISHING_SPOTS[spotId] : { name_chs: '' }
              ),
              地区:
                spotId > 0
                  ? PLACE_NAMES[
                      DATA.WEATHER_RATES[DataUtil.FISHING_SPOTS[spotId]?.territory_id]
                        ?.zone_id ??
                        (this.isDiademSpot(spotId)
                          ? DIADEM_ZONE
                          : this.isOceanFishingSpot(spotId)
                          ? OCEAN_FISHING_ZONE
                          : 0)
                    ]
                  : '',
              鱼: DataUtil.getItemName(record.fishId) ?? '未知',
              HQ: record.hq ? '是' : '否',
              '长度（星寸）': record.size > 0 ? (record.size / 10).toFixed(1) : '',
              鱼版本: DataUtil.toPatchText(DataUtil.getFishPatch(record.fishId)),
              脱钩: record.missed ? '是' : '否',
              未提钩: record.cancelled ? '是' : '否',
              鱼饵: DataUtil.getItemName(record.baitId),
              '咬钩时长（秒）': ((record.biteTime - record.startTime) / 1000).toFixed(1),
              撒饵: record.chum ? '是' : '否',
              提钩:
                DataUtil.HOOKSET_SKILL_NAME_DICT[_.capitalize(record.hookset)] ?? '提钩',
              个数: record.quantity,
              获得力: record.gathering,
              鉴别力: record.perception,
              采集力: record.gp,
              钓组: record.snagging ? '是' : '否',
              拍击水面: record.surfaceScale ? '是' : '否',
              拍击的鱼: record.surfaceScale
                ? DataUtil.getItemName(record.surfaceScaleFishId) ?? '未记录'
                : '',
              专一垂钓: record.identicalCast ? '是' : '否',
              耐心: record.gatheringFortuneUp && !record.catchAndRelease ? '是' : '否',
              耐心II: record.catchAndRelease ? '是' : '否',
              鱼眼: record.fishEyes ? '是' : '否',
              捕鱼人之识: record.fishersIntuition ? '是' : '否',
              记录版本: DataUtil.toPatchText(record.patch ?? 5.35),
              杆型: this.$t('tug.' + record.tug),
              timestamp: record.startTime,
            }
            return row
          } catch (e) {
            console.error('[export] transform data error:', e)
            return null
          }
        })
        .filter(it => it != null)
    },
  },
}
</script>
