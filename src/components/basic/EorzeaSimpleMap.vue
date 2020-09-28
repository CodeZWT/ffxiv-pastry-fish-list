<template>
  <div ref="container" v-resize="resize" style="width: 100%; height: 100%">
    <!--    <v-btn @click="resize">resize</v-btn>-->
    <v-stage :config="stageConfig">
      <v-layer>
        <v-image :config="mapConfig"></v-image>
        <v-image :config="markerRangeConfig"></v-image>
        <v-image :config="fishingSpotMarkerConfig"></v-image>
      </v-layer>
    </v-stage>
    <!--    <v-img :src="mapImageUrl" width="100%" height="100%" style="position: absolute">-->
    <!--      <div-->
    <!--          :style="-->
    <!--        `background-image: url('${fishMarker}');-->
    <!--         background-position: 50% 50%;-->
    <!--         width: 32px; height: 32px-->
    <!--         `-->
    <!--      "-->
    <!--      >-->
    <!--      </div>-->
    <!--    </v-img>-->

    <!--    <v-img :src="fishMarker" width="32px" height="32px" position="right 35% bottom 45%" style="position: absolute"/>-->
    <!--    <div :style="`position: absolute; width: 100%; height: 100% background: url('${fishMarker}');background-position: right 35% bottom 45%;`"/>-->
    <!--    <v-img :src="mapImageUrl" width="100%" height="100%" />-->
  </div>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import fishMarker from '@/assets/fishingSpot.png'
import markerRange from '@/assets/markerRange.png'

export default {
  name: 'EorzeaSimpleMap',
  props: {
    id: {
      type: String,
      default: undefined,
    },
    x: {
      type: Number,
      default: undefined,
    },
    y: {
      type: Number,
      default: undefined,
    },
    sizeFactor: {
      type: Number,
      default: undefined,
    },
    markerRadius: {
      type: Number,
      default: 300,
    },
    mode: {
      type: String,
      default: 'local',
    },
    debug: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    fishMarkerpath: fishMarker,
    mapImage: null,
    fishingSpotImage: null,
    markerRangeImage: null,
    containerWidth: 500,
    containerHeight: 500,
    mapImageLoaded: false,
  }),
  computed: {
    markerRangeFactor() {
      return this.markerRadius / 300
    },
    defaultImageUrl() {
      return 'https://xivapi.com/m/default/default.00.jpg'
    },
    mapImageUrl() {
      // "MapFilename": "/m/s1f4/s1f4.00.jpg",
      // "MapFilenameId": "s1f4/00",
      const paths = this.id.split('/')
      if (this.mode === 'remote') {
        return `${DataUtil.XIV_API_HOST}/m/${paths[0]}/${paths[0]}.${paths[1]}.jpg`
      } else {
        return `/map/${paths[0]}/${paths[0]}.${paths[1]}.jpg`
      }
    },
    stageConfig() {
      return {
        width: this.containerWidth,
        height: this.containerHeight,
        scaleX: this.containerWidth / 2048,
        scaleY: this.containerHeight / 2048,
      }
    },
    mapConfig() {
      return {
        image: this.mapImage,
        x: 0,
        y: 0,
        width: 2048,
        height: 2048,
      }
    },
    fishingSpotMarkerConfig() {
      return {
        image: this.fishingSpotImage,
        x: this.x - 48,
        y: this.y - 48,
        width: 96,
        height: 96,
      }
    },
    markerRangeConfig() {
      return {
        image: this.markerRangeImage,
        x: this.x - (96 * this.markerRangeFactor) / 2,
        y: this.y - (96 * this.markerRangeFactor) / 2,
        width: 96,
        height: 96,
        scaleX: this.markerRangeFactor,
        scaleY: this.markerRangeFactor,
      }
    },
    allImageLoaded() {
      return this.mapImageLoaded && this.fishingSpotImage != null && this.markerRangeImage != null
    },
  },
  watch: {
    allImageLoaded(loaded) {
      if (loaded) {
        this.resize()
      }
    },
    mapImageUrl(url) {
      this.loadMapImage(url)
    },
  },
  created() {
    this.loadMapImage(this.mapImageUrl)

    const fishingSpotImage = new window.Image()
    fishingSpotImage.onload = () => {
      this.fishingSpotImage = fishingSpotImage
    }
    fishingSpotImage.src = fishMarker

    const markerRangeImage = new window.Image()
    markerRangeImage.onload = () => {
      this.markerRangeImage = markerRangeImage
    }
    markerRangeImage.src = markerRange
  },
  methods: {
    loadMapImage(url) {
      this.mapImageLoaded = false
      const mapImage = new window.Image()
      mapImage.onload = () => {
        this.mapImage = mapImage
        this.mapImageLoaded = true
      }
      mapImage.src = url
    },
    resize() {
      const rect = this.$refs.container.getBoundingClientRect()
      this.containerWidth = rect.width
      this.containerHeight = Math.min(rect.width, rect.height)
    },
  },
}
</script>

<style scoped></style>