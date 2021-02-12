<template>
  <v-card class="fill-height">
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12" class="d-flex align-center">
          <v-subheader>自动标记已完成</v-subheader>
          <v-switch inset v-model="lazySetting.autoSetCompleted" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import isEqual from 'lodash/isEqual'

export default {
  name: 'ReaderSetting',
  data() {
    return {
      lazySetting: {},
    }
  },

  computed: {
    ...mapGetters(['readerSetting']),
  },
  watch: {
    lazySetting: {
      handler(lazySetting) {
        // this.updateReaderSetting(lazySetting)
        window.electron?.ipcRenderer?.send('updateUserData', {
          path: 'reader',
          data: lazySetting,
        })
      },
      deep: true,
    },
    readerSetting(readerSetting) {
      if (!isEqual(readerSetting, this.lazySetting)) {
        this.lazySetting = readerSetting
      }
    },
  },
  mounted() {
    this.lazySetting = this.readerSetting
  },
  methods: {
    ...mapMutations(['updateReaderSetting']),
  },
}
</script>

<style scoped></style>
