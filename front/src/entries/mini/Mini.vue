<template>
  <v-app>
    <v-main>
      <div class="fish-app-bar--collapsed rounded-pill d-flex elevation-5 px-1 ma-2">
        <div class="mr-1">
          <v-img
            :src="fisher"
            width="48"
            @click="exitMini"
            style="-webkit-app-region: none"
          />
        </div>
        <div class="d-flex flex-column justify-center">
          <div v-for="(notification, index) in listFishCntForMini" :key="index">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div v-on="on" v-bind="attrs" class="d-flex align-center">
                  <v-icon left small disabled>
                    {{ TABS[index].icon }}
                  </v-icon>
                  <div style="font-size: small; color: hsla(0, 0%, 100%, 0.5)">
                    {{ notification.cnt }}
                  </div>
                </div>
              </template>
              <span>{{ $t(TABS[index].title) }}</span>
            </v-tooltip>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { version } from '../../../package.json'
import DataUtil from '@/utils/DataUtil'
import ImgUtil from '@/utils/ImgUtil'

export default {
  name: 'Mini',
  data() {
    return {
      version: version,
      fisher: ImgUtil.getImgUrl('pastry-fish.webp'),
      listFishCnt: [
        {
          type: DataUtil.COUNT_DOWN_TYPE[DataUtil.FISHING],
          cnt: 0,
        },
        {
          type: DataUtil.COUNT_DOWN_TYPE[DataUtil.WAITING],
          cnt: 0,
        },
      ],
      TABS: DataUtil.TABS,
    }
  },
  computed: {
    listFishCntForMini() {
      return this.listFishCnt.slice(0, 2)
    },
  },
  created() {
    window.electron?.ipcRenderer?.on('listCntUpdated', (event, listCnt) => {
      this.listFishCnt = listCnt
    })
  },
  methods: {
    exitMini() {
      this.sendElectronEvent('miniMode', false)
    },
    sendElectronEvent(channel, data) {
      window.electron?.ipcRenderer?.send(channel, data)
    },
  },
}
</script>

<style>
.v-application {
  background-color: #ffffff00 !important;
}

.v-application .fish-app-bar--collapsed {
  background-color: #004d4066 !important;
  border: 2px solid;
  width: 120px;
  -webkit-app-region: drag;
}

/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}
</style>
