<template>
  <div ref="container" v-resize="resize" style="width: 100%; height: 100%">
    <v-stage :config="stageConfig">
      <v-layer>
        <v-image :config="defaultMapConfig"></v-image>
        <v-image :config="mapConfig"></v-image>
        <v-image :config="fishingSpotRangeHelperLayerConfig"></v-image>
        <v-image ref="markerRangeNode" :config="markerRangeConfig"></v-image>
        <v-image :config="fishingSpotMarkerConfig"></v-image>
        <v-image v-for="config in aetheryteMakerConfigs" :config="config" :key="config.text"></v-image>
        <v-text
          v-for="config in aetheryteMakerTextConfigs"
          :config="config"
          :key="config.text"
          @click="copyAetheryteName(config.text)"
        ></v-text>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import fishMarker from '@/assets/fishingSpot.png'
import markerRange from '@/assets/markerRange.png'
import aetheryteMarker from '@/assets/icon/PlaceName.png'
import defaultMap from '@/assets/default.00.jpg'
import { throttle } from 'lodash'
import { mapMutations, mapState } from 'vuex'
import copy from 'copy-to-clipboard'
// import Konva from 'konva'

const TEXT_PADDING = 50
const TEXT_FONT = 90
const MAP_SIZE = 2048

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
    fishingSpotName: {
      type: String,
      default: undefined,
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
    aetheryteImage: null,
    containerWidth: 500,
    containerHeight: 500,
    mapImageLoaded: false,
    throttledResizeFn: undefined,
    fishingSpotRangeHelperImage: null,
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
        scaleX: this.containerWidth / MAP_SIZE,
        scaleY: this.containerHeight / MAP_SIZE,
      }
    },
    defaultMapConfig() {
      return {
        image: this.defaultMapImage,
        x: 0,
        y: 0,
        width: MAP_SIZE,
        height: MAP_SIZE,
      }
    },
    mapConfig() {
      return {
        image: this.mapImage,
        x: 0,
        y: 0,
        width: MAP_SIZE,
        height: MAP_SIZE,
      }
    },
    fishingSpotRangeHelperLayerConfig() {
      return {
        image: this.fishingSpotRangeHelperImage,
        x: 0,
        y: 0,
        width: MAP_SIZE,
        height: MAP_SIZE,
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
        // filters: [Konva.Filters.RGB],
        // red: 3,
        // green: 168,
        // blue: 244,
      }
    },
    aetheryteMakerConfigs() {
      return (
        this.aetheryte[this.id]?.map(it => {
          return {
            image: this.aetheryteImage,
            x: it.x - 62,
            y: it.y - 62,
            width: 124,
            height: 124,
          }
        }) ?? []
      )
    },
    aetheryteMakerTextConfigs() {
      return (
        this.aetheryte[this.id]?.map(it => {
          const text = DataUtil.getName(it)
          const textLength = text.length
          const fontSize = TEXT_FONT
          console.log(textLength)
          const width = fontSize * textLength
          const height = fontSize
          return {
            text: text,
            width: width,
            offsetX: this.getOffset(width),
            height: height,
            offsetY: this.getOffset(height),
            x: this.getSafePos(it.x, width),
            y: this.getSafeY(it.y, height, height / 2 + 10),
            align: 'center',
            fontSize: fontSize,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 1,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: { x: 8, y: 8 },
            shadowOpacity: 0.5,
          }
        }) ?? []
      )
    },
    allImageLoaded() {
      return this.mapImageLoaded && this.fishingSpotImage != null && this.markerRangeImage != null
    },
    ...mapState(['aetheryte']),
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
    fishingSpotName(fishingSpotName) {
      this.loadImageToProp(this.getFishingSpotRangeHelper(fishingSpotName), 'fishingSpotRangeHelperImage')
    },
  },
  created() {
    this.loadMapImage(this.mapImageUrl)
    this.loadImageToProp(defaultMap, 'defaultMapImage')
    this.loadImageToProp(fishMarker, 'fishingSpotImage')
    this.loadImageToProp(markerRange, 'markerRangeImage')
    this.loadImageToProp(aetheryteMarker, 'aetheryteImage')
    this.throttledResizeFn = throttle(() => this.resizeInternal(), 300)
  },
  methods: {
    getOffset(textSize) {
      return textSize / 2
    },
    getSafePos(pos, size, offset = 0) {
      const mapRight = MAP_SIZE - TEXT_PADDING
      const mapLeft = TEXT_PADDING
      const textRight = pos + size / 2 + offset
      const textLeft = pos - size / 2 - offset
      if (textLeft < mapLeft) {
        return mapLeft + size / 2
      } else if (textRight > mapRight) {
        return mapRight - size / 2
      } else {
        return pos
      }
    },
    getSafeY(pos, size, offset = 0) {
      const mapBottom = MAP_SIZE - TEXT_PADDING
      const textBottom = pos + size / 2 + offset
      if (textBottom > mapBottom) {
        return pos - size / 2 - offset
      } else {
        return pos + size / 2 + offset
      }
    },
    loadMapImage(url) {
      this.mapImageLoaded = false
      this.loadImageToProp(url, 'mapImage').then(() => (this.mapImageLoaded = true))
    },
    loadImageToProp(urlOrPromise, imagePropName) {
      return Promise.resolve(urlOrPromise).then(url => {
        console.log('in loading', url)
        if (url == null) {
          this[imagePropName] = null
        }
        const image = new window.Image()
        image.src = url
        return new Promise(resolve => {
          image.onload = () => {
            this[imagePropName] = image
            resolve()
          }
        })
      })
    },
    getFishingSpotRangeHelper(fishingSpotName) {
      console.log(fishingSpotName)
      return import(`@/assets/fishing-spot-range-detail/${fishingSpotName}.png`)
        .then(it => it?.default)
        .catch(() => console.warn(fishingSpotName + ' range helper is missing.'))
        .finally(() => null)
    },
    resize() {
      this.throttledResizeFn()
    },
    resizeInternal() {
      const rect = this.$refs.container.getBoundingClientRect()
      this.containerHeight = this.containerWidth = rect?.width
      // const markerRangeNode = this.$refs.markerRangeNode.getNode()
      // markerRangeNode.cache()
      // markerRangeNode.getLayer().batchDraw()
    },
    copyAetheryteName(text) {
      copy(text)
      this.showSnackbar({ text: this.$t('importExport.dialog.message.copySuccess'), color: 'success' })
    },
    ...mapMutations(['showSnackbar']),
  },
}
</script>

<style scoped></style>