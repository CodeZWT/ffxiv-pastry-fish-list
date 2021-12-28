<template>
  <div style="width: 100%; height: 100%; position: relative" class="eorzea-simple-map">
    <v-overlay :value="!allImageLoaded" absolute opacity="1" color="background">
      <div class="d-flex flex-column align-center">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
        <div class="mt-2 primary--text">{{ $t('detail.map.loading') }}</div>
      </div>
    </v-overlay>
    <v-hover v-slot:default="{ hover }" open-delay="200">
      <div
        ref="container"
        v-resize="resize"
        style="width: 100%; height: 100%"
        class="map-container"
      >
        <v-scale-transition origin="center center">
          <div
            v-if="!isMobile && hover"
            class="d-flex justify-center align-center elevation-4 rounded-xl overflow-hidden"
            style="
              left: 50%;
              top: 4px;
              position: absolute;
              z-index: 10;
              margin-left: -120px;
            "
          >
            <v-btn
              @click="resize"
              tile
              height="48"
              width="48"
              style="min-width: 48px"
              title="重置地图状态"
            >
              <v-icon>{{ mdiArrowCollapse }}</v-icon>
            </v-btn>
            <v-btn-toggle
              v-model="mapOptions"
              multiple
              color="primary"
              class="rounded-l-0"
            >
              <v-btn
                @click="toggleLayer('rangeHelperLayer')"
                icon
                title="隐藏/显示 钓场范围提示（紫色标记）"
              >
                <v-icon>{{ mdiWaves }}</v-icon>
              </v-btn>
              <v-btn
                @click="toggleLayer('markerRangeLayer')"
                icon
                title="隐藏/显示 游戏地图图标（大水晶和范围圈）"
              >
                <v-icon>{{ mdiMapMarkerRadius }}</v-icon>
              </v-btn>
              <v-btn @click="toggleLayer('textLayer')" icon title="隐藏/显示 钓场名称">
                <v-icon>{{ mdiFormatText }}</v-icon>
              </v-btn>
              <v-btn
                @click="toggleMapLock"
                icon
                title="取消/启用 地图锁（取消后可鼠标移动以及滚轮缩放地图）"
              >
                <v-icon>{{ mdiLock }}</v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-scale-transition>
        <v-stage ref="stage" :config="stageConfig">
          <v-layer>
            <v-image :config="defaultMapConfig"></v-image>
            <v-image :config="mapConfig"></v-image>
          </v-layer>
          <v-layer ref="rangeHelperLayer">
            <v-image
              v-for="(fishingSpotRangeHelperLayerConfig,
              index) in fishingSpotRangeHelperLayerConfigs"
              :config="fishingSpotRangeHelperLayerConfig"
              :key="`helper-${index}`"
            ></v-image>
          </v-layer>
          <v-layer ref="markerRangeLayer">
            <v-image
              v-for="(config, index) in aetheryteMakerConfigs"
              :config="config"
              :key="`marker${index}`"
            ></v-image>
            <v-image
              v-for="(markerRangeConfig, index) in markerRangeConfigs"
              :config="markerRangeConfig"
              :key="`range-${index}`"
            ></v-image>
            <v-image
              v-for="(fishingSpotMarkerConfig, index) in fishingSpotMarkerConfigs"
              :config="fishingSpotMarkerConfig"
              :key="`marker-${index}`"
            ></v-image>
          </v-layer>
          <v-layer ref="textLayer">
            <v-text
              v-for="aetheryteMakerTextConfig in aetheryteMakerTextConfigs"
              :config="aetheryteMakerTextConfig"
              :key="`aetheryte-${aetheryteMakerTextConfig.text}`"
              @click="copyText(aetheryteMakerTextConfig.text)"
              @mouseenter="switchMouseToPointer"
              @mouseleave="switchMouseToDefault"
            ></v-text>
            <v-text
              v-for="fishingSpotTextConfig in fishingSpotTextConfigs"
              :config="fishingSpotTextConfig"
              :key="`spot-${fishingSpotTextConfig.text}`"
              @click="copyText(fishingSpotTextConfig.text)"
              @mouseenter="switchMouseToPointer"
              @mouseleave="switchMouseToDefault"
            ></v-text>
          </v-layer>
        </v-stage>
      </div>
    </v-hover>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import {
  mdiArrowCollapse,
  mdiFormatText,
  mdiLock,
  mdiMapMarkerRadius,
  mdiWaves,
} from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import EnvMixin from '@/components/basic/EnvMixin'
import ImgUtil from '@/utils/ImgUtil'
import _ from 'lodash'
import copy from 'copy-to-clipboard'

const TEXT_PADDING = 50
const TEXT_AETHERYTE_FONT = 90
const TEXT_SPOT_FONT = 70
const MAP_SIZE = 2048

export default {
  name: 'EorzeaSimpleMap',
  mixins: [EnvMixin],
  props: {
    // x: {
    //   type: Number,
    //   default: undefined,
    // },
    // y: {
    //   type: Number,
    //   default: undefined,
    // },
    // markerRadius: {
    //   type: Number,
    //   default: 300,
    // },
    // fishingSpotName: {
    //   type: String,
    //   default: undefined,
    // },
    fishingSpots: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: undefined,
    },
    sizeFactor: {
      type: Number,
      default: undefined,
    },
    mode: {
      type: String,
      default: 'local',
    },
    ratio: {
      type: Number,
      default: 1,
    },
    showFishingRangeHelper: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    mdiArrowCollapse,
    mdiWaves,
    mdiMapMarkerRadius,
    mdiFormatText,
    mdiLock,
    fishMarker: ImgUtil.getImgUrl('fishingSpot.webp'),
    markerRange: ImgUtil.getImgUrl('markerRange.webp'),
    defaultMap: ImgUtil.getMapUrl('default.00.webp', ImgUtil.CATEGORY.MAP),
    aetheryteMarker: ImgUtil.getImgUrl('PlaceName.webp'),
    stage: undefined,
    mapOptions: [0, 1, 2, 3],
    defaultMapImage: null,
    mapImage: null,
    fishingSpotImage: null,
    markerRangeImage: null,
    aetheryteImage: null,
    containerWidth: 500,
    containerHeight: 500,
    mapImageLoaded: false,
    fishingSpotRangeHelperLoaded: false,
    throttledResizeFn: undefined,
    fishingSpotRangeHelperImages: [],
    mapLocked: true,
  }),
  computed: {
    // markerRangeFactor() {
    //   return this.markerRadius / 300
    // },
    mapImageUrl() {
      // "MapFilename": "/m/s1f4/s1f4.00.jpg",
      // "MapFilenameId": "s1f4/00",
      const paths = this.id.split('/')
      if (this.mode === 'remote') {
        return `${DataUtil.XIV_API_HOST}/m/${paths[0]}/${paths[0]}.${paths[1]}.jpg`
      } else {
        return ImgUtil.getMapUrl(`${paths[0]}.${paths[1]}.webp`)
      }
    },
    stageConfig() {
      return {
        x: 0,
        width: this.containerWidth,
        height: this.containerHeight,
        scaleX: this.containerHeight / MAP_SIZE,
        scaleY: this.containerHeight / MAP_SIZE,
        draggable: !this.mapLocked,
        preventDefault: false,
      }
    },
    defaultMapConfig() {
      return {
        image: this.defaultMapImage,
        x: 0,
        y: 0,
        width: MAP_SIZE,
        height: MAP_SIZE,
        preventDefault: false,
      }
    },
    mapConfig() {
      return {
        image: this.mapImage,
        x: 0,
        y: 0,
        width: MAP_SIZE,
        height: MAP_SIZE,
        preventDefault: false,
      }
    },
    fishingSpotRangeHelperLayerConfigs() {
      return this.fishingSpotRangeHelperLoaded
        ? this.fishingSpots.map((_, index) => ({
            image: this.fishingSpotRangeHelperImages[index],
            x: 0,
            y: 0,
            width: MAP_SIZE,
            height: MAP_SIZE,
            preventDefault: false,
          }))
        : []
    },
    fishingSpotMarkerConfigs() {
      return this.fishingSpots.map(spot => ({
        image: this.fishingSpotImage,
        x: spot.x - 48,
        y: spot.y - 48,
        width: 96,
        height: 96,
        preventDefault: false,
      }))
    },
    markerRangeConfigs() {
      return this.fishingSpots.map(spot => {
        const markerRangeFactor = spot.radius / 300
        return {
          image: this.markerRangeImage,
          x: spot.x - (96 * markerRangeFactor) / 2,
          y: spot.y - (96 * markerRangeFactor) / 2,
          width: 96,
          height: 96,
          scaleX: markerRangeFactor,
          scaleY: markerRangeFactor,
          preventDefault: false,
          // filters: [Konva.Filters.RGB],
          // red: 3,
          // green: 168,
          // blue: 244,
        }
      })
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
            preventDefault: false,
          }
        }) ?? []
      )
    },
    aetheryteMakerTextConfigs() {
      return (
        this.aetheryte[this.id]?.map(it => {
          const text = DataUtil.getName(it)
          return this.computeSafeTextConfig(text, it.x, it.y, {
            fontSize: TEXT_AETHERYTE_FONT,
            preventDefault: false,
          })
        }) ?? []
      )
    },
    fishingSpotTextConfigs() {
      return this.fishingSpots.map(spot => {
        return this.computeSafeTextConfig(spot.name, spot.x, spot.y, {
          fontSize: TEXT_SPOT_FONT,
          color: 'white',
          preventDefault: false,
        })
      })
    },
    allImageLoaded() {
      return (
        this.mapImageLoaded &&
        this.fishingSpotRangeHelperLoaded &&
        this.fishingSpotImage != null &&
        this.markerRangeImage != null
      )
    },
    fishingSpotIds() {
      return this.fishingSpots.map(it => it._id)
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
    fishingSpotIds(fishingSpotIds, oldFishingSpotIds) {
      if (!_.isEqual(oldFishingSpotIds, fishingSpotIds)) {
        this.loadFishingSpotRangeHelper(fishingSpotIds)
      }
    },
  },
  created() {
    this.loadMapImage(this.mapImageUrl)
    this.loadFishingSpotRangeHelper(this.fishingSpotIds)
    this.loadImageToProp(this.defaultMap, 'defaultMapImage')
    this.loadImageToProp(this.fishMarker, 'fishingSpotImage')
    this.loadImageToProp(this.markerRange, 'markerRangeImage')
    this.loadImageToProp(this.aetheryteMarker, 'aetheryteImage')
    this.throttledResizeFn = _.throttle(() => this.resizeInternal(), 300)
  },
  mounted() {
    const stage = this.$refs.stage.getNode()
    stage.on('wheel', e => {
      if (this.mapLocked) return

      e.evt.preventDefault()
      const scaleBy = 1.5
      const oldScale = stage.scaleX()

      const pointer = stage.getPointerPosition()

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      }

      const scaleByWheel = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy

      const newScale = scaleByWheel * MAP_SIZE > 100 ? scaleByWheel : oldScale

      stage.scale({ x: newScale, y: newScale })

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      }
      stage.position(newPos)
      stage.batchDraw()
    })
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
    loadFishingSpotRangeHelper(spotIds) {
      this.fishingSpotRangeHelperLoaded = false
      Promise.all(
        spotIds.map((spotId, index) =>
          this.loadImageToProp(
            this.getFishingSpotRangeHelper(spotId),
            `fishingSpotRangeHelperImages[${index}]`
          )
        )
      ).then(() => (this.fishingSpotRangeHelperLoaded = true))
    },
    loadImageToProp(urlOrPromise, imagePropName) {
      return Promise.resolve(urlOrPromise).then(url => {
        if (url == null) {
          _.set(this, imagePropName, null)
          return
        }
        const image = new window.Image()
        image.src = url
        return new Promise(resolve => {
          image.onload = () => {
            _.set(this, imagePropName, image)
            resolve()
          }
          image.onerror = () => {
            const defaultImg = new window.Image()
            defaultImg.src = ImgUtil.getImgUrl(
              'default.webp',
              ImgUtil.CATEGORY.MAP_RANGE_INDICATOR
            )
            defaultImg.onload = () => {
              _.set(this, imagePropName, defaultImg)
              resolve()
            }
          }
        })
      })
    },
    getFishingSpotRangeHelper(spotId) {
      const imageName = this.showFishingRangeHelper ? spotId : 'default'
      if (this.showFishingRangeHelper && imageName === 'default') {
        console.warn(spotId + ' range helper is missing.')
      }
      return ImgUtil.getImgUrl(imageName + '.webp', ImgUtil.CATEGORY.MAP_RANGE_INDICATOR)
    },
    resize() {
      this.throttledResizeFn()
    },
    getStage() {
      if (this.stage) {
        return this.stage
      } else {
        return this.$refs.stage?.getNode()
      }
    },
    toggleLayer(layerName) {
      const layer = this.$refs[layerName].getNode()
      layer.visible(!layer.visible())
      layer.draw()
    },
    toggleMapLock() {
      const stage = this.getStage()
      stage.draggable(!stage.draggable())
      this.mapLocked = !this.mapLocked
      stage.batchDraw()
    },
    resizeInternal() {
      const rect = this.$refs.container.getBoundingClientRect()
      if (!rect || !rect?.width || !rect?.height) return
      this.containerWidth = rect?.width
      this.containerHeight = rect?.height
      const resizeRefer = Math.min(this.containerHeight, this.containerWidth)

      const stage = this.$refs.stage?.getNode()
      stage?.scale({ x: resizeRefer / MAP_SIZE, y: resizeRefer / MAP_SIZE })
      stage?.position({ x: this.containerWidth / 2 - resizeRefer / 2, y: 0 })
      // stage?.width()
      // stage?.clip({ x: 0, y: 0, width: rect?.width, height: rect?.height })
      // const markerRangeNode = this.$refs.markerRangeNode.getNode()
      // markerRangeNode.cache()
      // markerRangeNode.getLayer().batchDraw()
      stage.batchDraw()
    },
    copyText(text) {
      copy(text)
      this.showSnackbar({
        text: this.$t('importExport.dialog.message.copySuccess'),
        color: 'success',
      })
    },
    switchMouseToPointer() {
      this.$refs.stage.getNode().container().style.cursor = 'pointer'
    },
    switchMouseToDefault() {
      this.$refs.stage.getNode().container().style.cursor = 'default'
    },
    computeSafeTextConfig(text, x, y, option) {
      const textLength = DataUtil.hasChineseCharacter(text)
        ? text.length
        : text.length / 2
      const width = option.fontSize * textLength
      const height = option.fontSize
      return {
        text: text,
        width: width,
        offsetX: this.getOffset(width),
        height: height,
        offsetY: this.getOffset(height),
        x: this.getSafePos(x, width),
        y: this.getSafeY(y, height, height / 2 + 10),
        align: 'center',
        fontSize: option.fontSize,
        fill: option.color ?? 'black',
        stroke: option.color ?? 'black',
        strokeWidth: 1,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: { x: 8, y: 8 },
        shadowOpacity: 0.5,
      }
    },
    ...mapMutations(['showSnackbar']),
  },
}
</script>

<style scoped></style>
