<template>
  <div v-if="!showGif">
    <v-hover v-slot="{ hover }" open-delay="200" close-deplay="300">
      <div style="position: relative" @click="showGif = true">
        <v-overlay v-if="hover" absolute>
          <div class="fill-height d-flex align-center">
            <v-icon x-large>mdi-play-circle</v-icon>
          </div>
        </v-overlay>
        <v-img :src="coverSrc">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>
    </v-hover>
  </div>

  <div
    v-else
    class="system d-flex justify-center align-center"
    style="min-width: 100px; min-height: 100px"
  >
    <div style="position: absolute; text-align: center">加载中...</div>
    <v-img :src="src">
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </div>
</template>

<script>
export default {
  name: 'GifLoader',
  props: {
    coverSrc: {
      type: String,
      default: undefined,
    },
    src: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      showGif: false,
    }
  },
  computed: {},
  created() {},
}
</script>

<style scoped></style>
