<template>
  <div ref="container" v-resize="resize" style="width: 100%; height: 100%">
    <v-stage :config="stageConfig">
      <v-layer>
        <v-image :config="defaultMapConfig"></v-image>
        <v-image :config="mapConfig"></v-image>
        <v-image ref="markerRangeNode" :config="markerRangeConfig"></v-image>
        <v-image :config="fishingSpotMarkerConfig"></v-image>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import fishMarker from '@/assets/fishingSpot.png'
import markerRange from '@/assets/markerRange.png'
import defaultMap from '@/assets/default.00.jpg'
import Konva from 'konva'

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
    defaultMapImage: null,
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
    mapImageUrl() {
      // "MapFilename": "/m/s1f4/s1f4.00.jpg",
      // "MapFilenameId": "s1f4/00",
      const paths = this.id.split('/')
      if (this.mode === 'remote') {
        return `${DataUtil.XIV_API_HOST}/m/${paths[0]}/${paths[0]}.${paths[1]}.jpg`
      } else {
        return `${process.env.ASSET_PATH}map/${paths[0]}/${paths[0]}.${paths[1]}.jpg`
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
    defaultMapConfig() {
      return {
        image: this.defaultMapImage,
        x: 0,
        y: 0,
        width: 2048,
        height: 2048,
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
        filters: [Konva.Filters.RGB],
        red: 3,
        green: 168,
        blue: 244,
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
    this.loadImageToProp(defaultMap, 'defaultMapImage')
    this.loadImageToProp(fishMarker, 'fishingSpotImage')
    this.loadImageToProp(markerRange, 'markerRangeImage')
  },
  mounted() {

  },
  methods: {
    loadMapImage(url) {
      this.mapImageLoaded = false
      this.loadImageToProp(url, 'mapImage').then(() => (this.mapImageLoaded = true))
    },
    loadImageToProp(url, imagePropName) {
      const image = new window.Image()
      image.src = url
      return new Promise(resolve => {
        image.onload = () => {
          this[imagePropName] = image
          resolve()
        }
      })
    },
    resize() {
      const rect = this.$refs.container.getBoundingClientRect()
      this.containerWidth = rect.width
      this.containerHeight = Math.min(rect.width, rect.height)

      const markerRangeNode = this.$refs.markerRangeNode.getNode()
      markerRangeNode.cache()
      markerRangeNode.getLayer().batchDraw()
    },
  },
}
</script>

<style scoped></style>