<template>
  <v-container
    fluid
    :class="
      `detail-wrapper ${isElectron ? 'detail-wrapper--electron' : 'detail-wrapper--web'}`
    "
  >
    <v-row no-gutters>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="records"
          multi-sort
          :sort-by="['startTime']"
          :sort-desc="[true]"
          :items-per-page="20"
          class="elevation-1"
          :loading="loading"
          :server-items-length="totalRecords"
          :options.sync="options"
        >
          <template v-slot:item.startTime="{ item }">
            <div class="d-flex align-center">
              <div>
                {{ item.startTime.toLocaleDateString() }}
                {{ item.startTime.toLocaleTimeString() }}
              </div>
            </div>
          </template>
          <template v-slot:item.id="{ item }">
            <div class="d-flex align-center">
              <item-icon :icon-class="item.fishIcon"></item-icon>
              <div>{{ item.fishName }}</div>
            </div>
          </template>
          <template v-slot:item.baitId="{ item }">
            <div class="d-flex align-center">
              <item-icon :icon-class="item.baitIcon"></item-icon>
              <div>{{ item.baitName }}</div>
            </div>
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
      options: {
        // sortBy: ['startTime'],
        // sortDesc: [true],
        // page: 0,
        // itemsPerPage: 10,
      },
      headers: [
        {
          text: '时间',
          align: 'start',
          sortable: true,
          value: 'startTime',
        },
        {
          text: '鱼',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        {
          text: '鱼饵',
          align: 'start',
          sortable: true,
          value: 'baitId',
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
    // this.getDataFromApi(this.options)
  },
  methods: {
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
