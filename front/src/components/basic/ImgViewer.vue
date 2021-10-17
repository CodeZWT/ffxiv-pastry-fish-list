<template>
  <div>
    <v-hover v-slot="{ hover }" open-delay="200" close-deplay="300">
      <div style="position: relative">
        <v-overlay :value="hover" absolute>
          <div
            class="fill-height d-flex align-center"
            @click="showExpandedDialog = true"
            style="cursor: pointer"
          >
            <span>
              <v-icon x-large>mdi-arrow-expand-all</v-icon>
              点击查看大图
            </span>
          </div>
        </v-overlay>

        <v-img :src="lazySrc" :contain="contain" :height="height">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <span>
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
                <span class="ml-2">图片加载中...</span>
              </span>
            </v-row>
          </template>
        </v-img>
      </div>
    </v-hover>
    <rc-dialog v-model="showExpandedDialog" fullscreen scrollable>
      <v-card>
        <v-card-text>
          <v-img :lazy-src="lazySrc" :src="src" :contain="contain">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="start" justify="center">
                <div class="mt-16 d-flex align-center">
                  <v-progress-circular indeterminate color="black"></v-progress-circular>
                  <span class="ml-2 black--text">图片加载中...</span>
                </div>
              </v-row>
            </template>
          </v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="showExpandedDialog = false">
            {{ $t('general.dialog.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </rc-dialog>
  </div>
</template>

<script>
import RcDialog from '@/components/basic/RcDialog'
export default {
  name: 'ImgViewer',
  components: { RcDialog },
  props: {
    lazySrc: {
      type: String,
      default: undefined,
    },
    src: {
      type: String,
      default: undefined,
    },
    height: {
      type: Number,
      default: undefined,
    },
    contain: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showExpandedDialog: false,
    }
  },
}
</script>

<style scoped>
div >>> .v-overlay__content {
  width: 100% !important;
  height: 100% !important;
  display: flex;
  justify-content: center;
}
</style>
