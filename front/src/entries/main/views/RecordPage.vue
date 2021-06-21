<template>
  <v-container
    fluid
    :class="
      `detail-wrapper ${isElectron ? 'detail-wrapper--electron' : 'detail-wrapper--web'}`
    "
  >
    <v-row>
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

export default {
  name: 'RecordPage',
  components: { ItemIcon },
  mixins: [EnvMixin],
  props: ['lazyTransformedFishDict'],
  data() {
    return {
      loading: true,
      totalRecords: 0,
      records: [],
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
  },
  mounted() {
    this.refresh = throttle(() => this.getDataFromApi(this.options), 5000, {
      leading: true,
    })
  },
  methods: {
    getDataFromApi(options) {
      console.log('called')
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
