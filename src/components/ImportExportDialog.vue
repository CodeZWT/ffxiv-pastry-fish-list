<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.mobile" max-width="1264px" style="z-index: 9999">
    <v-card>
      <v-card-title>
        <span class="headline">{{ $t('importExport.dialog.title') }}</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div class="subtitle-1">{{ $t('importExport.dialog.self.title') }}</div>
          </v-col>
          <v-col cols="12">
            <v-tabs v-model="selfTab">
              <v-tab>
                {{ $t('importExport.dialog.self.export') }}
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small dark v-bind="attrs" v-on="on">mdi-information</v-icon>
                  </template>
                  <span>{{ $t('importExport.dialog.self.exportHint') }}</span>
                </v-tooltip>
              </v-tab>
              <v-tab>
                {{ $t('importExport.dialog.self.import') }}
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small dark v-bind="attrs" v-on="on">mdi-information</v-icon>
                  </template>
                  <span>{{ $t('importExport.dialog.self.importHint') }}</span>
                </v-tooltip>
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="selfTab">
              <v-tab-item>
                <v-textarea v-model="selfTextToExport" ref="selfExportTextArea" />
                <v-btn @click="exportData" class="mr-4" color="primary">
                  <v-icon>mdi-content-copy</v-icon>
                  {{ $t('importExport.dialog.copy') }}
                </v-btn>
              </v-tab-item>
              <v-tab-item>
                <v-textarea v-model="selfDataToImport" />
                <v-btn @click="importData" class="mr-4" color="primary">
                  {{ $t('importExport.dialog.self.import') }}
                </v-btn>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col cols="12">
            <div class="subtitle-1">
              {{ $t('importExport.dialog.other.fishTracker.title') }}
              [<a @click="goTo('http://fish.senriakane.com/')">中文版</a>] [<a
                @click="goTo('https://ff14fish.carbuncleplushy.com/')"
                >原版</a
              >]
            </div>
          </v-col>
          <v-col cols="12">
            <v-tabs v-model="fishTrackerTab">
              <v-tab>
                {{ $t('importExport.dialog.other.fishTracker.exportToFishTracker') }}
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small dark v-bind="attrs" v-on="on">mdi-information</v-icon>
                  </template>
                  <span>{{ $t('importExport.dialog.other.fishTracker.exportToFishTrackerHint') }}</span>
                </v-tooltip>
              </v-tab>
              <v-tab>
                {{ $t('importExport.dialog.other.fishTracker.importFromFishTracker') }}
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small dark v-bind="attrs" v-on="on">mdi-information</v-icon>
                  </template>
                  <span>{{ $t('importExport.dialog.other.fishTracker.importFromFishTrackerHint') }}</span>
                </v-tooltip>
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="fishTrackerTab">
              <v-tab-item>
                <v-textarea v-model="fishTrackerTextToExport" ref="fishTrackerExportTextArea" />
                <v-btn @click="exportDataToFishTracker" class="mr-4" color="primary">
                  <v-icon>mdi-content-copy</v-icon>
                  {{ $t('importExport.dialog.copy') }}
                </v-btn>
              </v-tab-item>
              <v-tab-item>
                <v-textarea v-model="fishTrackerTextToImport" />
                <v-btn @click="importDataToFishTracker" class="mr-4" color="primary">
                  {{ $t('importExport.dialog.other.fishTracker.importFromFishTracker') }}
                </v-btn>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex flex-column flex-fill">
          <v-dialog v-model="showConfirmDialog" persistent max-width="290">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="tertiary" block v-bind="attrs" v-on="on">{{ $t('importExport.dialog.reset.btn') }} </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">
                {{ $t('importExport.dialog.reset.title') }}
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="default" text @click="showConfirmDialog = false">
                  {{ $t('importExport.dialog.reset.cancel') }}
                </v-btn>
                <v-btn color="tertiary" text @click="onReset">
                  {{ $t('importExport.dialog.reset.confirm') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn color="default" block text @click="dialog = false">{{ $t('importExport.dialog.close') }}</v-btn>
        </div>
      </v-card-actions>
    </v-card>
    <v-snackbar :timeout="2000" v-model="info.show" :color="info.color" centered absolute>
      <div class="text-center">{{ info.text }}</div>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import { merge } from 'lodash'
import flatten from 'flat'

export default {
  name: 'ImportExportDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    selfTab: null,
    fishTrackerTab: null,
    selfTextToExport: null,
    selfDataToImport: null,
    fishTrackerTextToExport: null,
    fishTrackerTextToImport: null,
    info: {
      show: false,
      text: '',
      color: '',
    },
    showConfirmDialog: false,
  }),
  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(showDialog) {
        return this.$emit('input', showDialog)
      },
    },
    ...mapState(['userData']),
  },
  watch: {
    dialog(show) {
      if (show) {
        this.selfTab = null
        this.fishTrackerTab = null
        this.selfTextToExport = JSON.stringify(this.userData)
        this.selfDataToImport = null
        this.fishTrackerTextToExport = this.toFishTrackerVersion(this.userData)
        this.fishTrackerTextToImport = null
      }
    },
  },
  methods: {
    toFishTrackerVersion(userData) {
      return JSON.stringify({
        filters: {
          completion: FISH_TRACKER_MAPPER.TO.COMPLETE_TYPE[userData.filters.completeType],
          patch: userData.filters.patches,
        },
        completed: userData.completed,
        pinned: userData.pinned,
        // fixed value since these options are not available in RC Fish
        upcomingWindowFormat: 'fromPrevClose',
        sortingType: 'windowPeriods',
        theme: 'dark',
      })
    },
    fromFishTrackerVersion(fishTrackerData, currentUserData) {
      return merge(currentUserData, {
        completed: fishTrackerData.completed ?? currentUserData.completed,
        pinned: fishTrackerData.pinned ?? currentUserData.pinned,
        filters: {
          patches: fishTrackerData.filters?.patch ?? currentUserData.filters.patches,
          completeType:
            FISH_TRACKER_MAPPER.FROM.COMPLETE_TYPE[fishTrackerData.filters?.completion] ??
            currentUserData.filters.completeType,
        },
      })
    },
    goTo(href) {
      window.open(href)
    },
    exportData() {
      const clipboard = this.$refs.selfExportTextArea.$refs.input
      clipboard.select()
      clipboard.setSelectionRange(0, 99999) // For mobile devices
      document.execCommand('copy')
      this.showInfo(this.$t('importExport.dialog.message.copySuccess'), 'success')
    },
    exportDataToFishTracker() {
      const clipboard = this.$refs.fishTrackerExportTextArea.$refs.input
      clipboard.select()
      clipboard.setSelectionRange(0, 99999) // For mobile devices
      document.execCommand('copy')
      this.showInfo(this.$t('importExport.dialog.message.copySuccess'), 'success')
    },
    importData() {
      try {
        const data = JSON.parse(this.selfDataToImport)
        if (this.validateImportData(data, DataUtil.USER_DEFAULT_DATA)) {
          this.setUserData(data)
          this.showInfo(this.$t('importExport.dialog.message.importSuccess'), 'success')
        } else {
          this.showInfo(this.$t('importExport.dialog.message.importError'), 'tertiary')
        }
      } catch (e) {
        console.error('import error', e)
        this.showInfo(this.$t('importExport.dialog.message.importError'), 'tertiary')
      }
    },
    importDataToFishTracker() {
      try {
        const fishTrackerData = JSON.parse(this.fishTrackerTextToImport)
        const data = this.fromFishTrackerVersion(fishTrackerData, this.userData)
        if (
          this.validateImportData(fishTrackerData, DataUtil.FISH_TRACKER_STRUCTURE) &&
          this.validateImportData(data, DataUtil.USER_DEFAULT_DATA)
        ) {
          this.setUserData(data)
          this.showInfo(this.$t('importExport.dialog.message.importSuccess'), 'success')
        } else {
          this.showInfo(this.$t('importExport.dialog.message.importError'), 'tertiary')
        }
      } catch (e) {
        console.error('import error', e)
        this.showInfo(this.$t('importExport.dialog.message.importError'), 'tertiary')
      }
    },
    validateImportData(data, sample) {
      console.log(Object.keys(flatten(data, { safe: true })))
      console.log(Object.keys(flatten(sample, { safe: true })))
      const importKeys = Object.keys(flatten(data, { safe: true })).sort()
      const sampleKeys = Object.keys(flatten(data, { safe: true })).sort()
      return importKeys.every(it => sampleKeys.includes(it))
    },
    showInfo(text, color) {
      this.info = {
        show: true,
        text,
        color,
      }
    },
    onReset() {
      this.setUserDataToDefault()
      this.showConfirmDialog = false
      this.showInfo(this.$t('importExport.dialog.message.resetSuccess'), 'success')
    },
    ...mapMutations(['setUserData', 'setShowImportExportDialog', 'setUserDataToDefault']),
  },
}

const FISH_TRACKER_MAPPER = {
  TO: {
    COMPLETE_TYPE: {
      ALL: 'all',
      COMPLETED: 'caught',
      UNCOMPLETED: 'uncaught',
    },
  },
  FROM: {
    COMPLETE_TYPE: {
      all: 'ALL',
      caught: 'COMPLETED',
      uncaught: 'UNCOMPLETED',
    },
  },
}
</script>

<style scoped></style>