<template>
  <div style="width: 100%; height: 100%; position: relative">
    <v-overlay :value="!allImageLoaded" absolute opacity="1">
      <div class="d-flex flex-column align-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <div class="mt-2">{{ $t('detail.map.loading') }}</div>
      </div>
    </v-overlay>
    <div ref="container" v-resize="resize" style="width: 100%; height: 100%">
      <div class="d-flex justify-center align-center" style="width: 100%">
        <v-btn @click="resize" tile icon height="48" width="48">
          <v-icon>mdi-arrow-collapse</v-icon>
        </v-btn>
        <v-btn-toggle v-model="mapOptions" multiple color="primary">
          <v-btn @click="toggleLayer('rangeHelperLayer')" icon>
            <v-icon>mdi-waves</v-icon>
          </v-btn>
          <v-btn @click="toggleLayer('markerRangeLayer')" icon>
            <v-icon>mdi-map-marker-radius</v-icon>
          </v-btn>
          <v-btn @click="toggleLayer('textLayer')" icon>
            <v-icon>mdi-format-text</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
      <v-stage ref="stage" :config="stageConfig">
        <v-layer>
          <v-image :config="defaultMapConfig"></v-image>
          <v-image :config="mapConfig"></v-image>
          <v-image v-for="(config, index) in aetheryteMakerConfigs" :config="config" :key="index"></v-image>
        </v-layer>
        <v-layer ref="rangeHelperLayer">
          <v-image :config="fishingSpotRangeHelperLayerConfig"></v-image>
        </v-layer>
        <v-layer ref="markerRangeLayer">
          <v-image :config="markerRangeConfig"></v-image>
          <v-image v-if="fishingSpotMarkerConfig.image" :config="fishingSpotMarkerConfig"></v-image>
        </v-layer>
        <v-layer ref="textLayer">
          <v-text
            v-for="config in aetheryteMakerTextConfigs"
            :config="config"
            :key="config.text"
            @click="copyText(config.text)"
            @mouseenter="switchMouseToPointer"
            @mouseleave="switchMouseToDefault"
          ></v-text>
          <v-text
            v-for="config in fishingSpotTextConfigs"
            :config="config"
            :key="config.text"
            @click="copyText(config.text)"
            @mouseenter="switchMouseToPointer"
            @mouseleave="switchMouseToDefault"
          ></v-text>
        </v-layer>
      </v-stage>
    </div>
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
const TEXT_AETHERYTE_FONT = 90
const TEXT_SPOT_FONT = 70
const MAP_SIZE = 2048

const AVAILABLE_HELP = new Set([
  '三艺区',
  '亚特卡勒河上游',
  '亚特卡勒河下游',
  '交汇河',
  '刺舌滴',
  '哈克卡勒河',
  '四艺区',
  '塔奥卡勒河',
  '太阳湖',
  '库尔札斯不冻池',
  '朵塔儿水洲',
  '水晶都起居室',
  '沃茨河上游',
  '沃茨河下游',
  '涅木卡勒河',
  '清澈池',
  '灰尾瀑布',
  '灰烬池',
  '灾祸池南',
  '灾祸池西',
  '珂露西亚岛东海岸',
  '珂露西亚岛西海岸',
  '白油瀑布',
  '观海湾',
  '龙涎',
  '无二江东',
  '无二江西',
  '城下码头',
  '梅泉乡',
  '多玛城前',
  '苍鹭池',
  '七彩沟',
  '苍鹭河',
  '茨菰村水塘',
  '七彩溪谷',
  '冠毛大树',
  '德尔塔管区',
  '阿尔法管区',
  '阿济兹拉旗舰岛',
  '生态园',
  '超星际通信塔',
  '废液池',
  '高脚孤丘',
  '沙利亚克河',
  '沙利亚克河上流',
  '沙利亚克河中流',
  '湍流三角地',
  '西方水泉',
  '招恶荒岛',
  '惋惜之晶遗迹',
  '索姆阿尔云帽',
  '人王遗迹',
  '绿茵岛',
  '鳎沙地窖',
  '卡利班深海峡西北',
  '尊紫洞',
  '陆人墓标',
  '卡利班古巢西',
  '卡利班古巢东',
  '诺弗兰特大陆坡',
  '琥珀丘',
  '沙河',
  '拿巴示断绝',
  '提蒙河',
  '流星尾',
  '昏暗林',
  '威罗迪纳河',
  '幻河',
  '盐湖',
  '石楠瀑布',
  '判官神像',
  '猛牛浴池',
  '赎罪之腕',
  '夫妇池',
  '慢水涤',
  '宠坏的年幼溪流',
  '嫉妒的年少溪流',
  '身镜湖',
  '手镜湖',
  '傲慢的年长溪流',
  '圣法斯里克天庭',
  '科拉德排水沟',
  '废船街',
  '风化裂痕',
  '始源湖',
  '锈迹贮水池',
  '阴沉乡',
  '贤岛',
  '蛇水湖',
  '洛查特尔河',
  '血盅',
  '缪栎的乡愁南部',
  '结誓洞窟',
  '狱之盖近海',
  '自凝岛近海',
  '龟甲岛近海',
  '冲之岩近海',
  '绝鬼岛近海',
  '红玉炮台近海',
  '渔村沿岸',
  '白银水路',
  '白银乡',
  '防波堤',
  '提蒙河',
  '流星尾',
  '昏暗林',
  '威罗迪纳河',
  '幻河',
  '星导寺入口',
  '幻河上游',
  '神拳痕',
  '盐湖',
  '魔窟离岛',
  '沃仙曦染',
  '蓝天窗',
  '云水塘',
  '云顶',
  '圣人泪',
  '库尔札斯河',
  '圣人旅道',
  '巨龙首营地水库',
  '剑峰山麓',
  '调查队冰洞',
  '伊修加德大云海',
  '披雪大冰壁',
  '落魔崖',
  '悲叹飞泉',
  '荒烟野地',
  '宽慰河',
  '不洁古像',
  '光轮祭坛',
  '彻悟岩窟西',
  '饵食台地',
  '彻悟岩窟',
  '不悔战泉',
  '火蜥蜴河',
  '遗忘绿洲',
  '撒沟厉沙丘',
  '撒沟厉沙海',
  '邪嗣',
  '污流上游',
  '污流下游',
  '执掌峡谷',
  '纠缠沼泽林',
  '银泪湖北岸',
  '纠缠沼泽林源流',
  '早霜顶',
  '歌咏裂谷北部',
  '歌咏裂谷',
  '蓝雾涌泉',
  '青磷泉',
  '西风岬',
  '月牙湾',
  '足迹谷',
  '黄昏湾',
  '丰饶神井',
  '白银集市',
  '月滴洞',
  '帕拉塔安息地',
  '塔赫托特尔湖',
  '秋瓜湖畔',
  '嘈杂川',
  '荣耀溪',
  '红茶川水系上游',
  '低语河谷',
  '翡翠湖滨',
  '红茶川水系下游',
  '火墙',
  '枯骨南泉',
  '枯骨北泉',
  '宇格拉姆河',
])

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
    ratio: {
      type: Number,
      default: 1,
    },
  },
  data: () => ({
    mapOptions: [0, 1, 2],
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
        x: this.containerWidth / 2 - this.containerHeight / 2,
        width: this.containerWidth,
        height: this.containerHeight,
        scaleX: this.containerHeight / MAP_SIZE,
        scaleY: this.containerHeight / MAP_SIZE,
        draggable: true,
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
          return this.computeSafeTextConfig(text, it.x, it.y, { fontSize: TEXT_AETHERYTE_FONT })
        }) ?? []
      )
    },
    fishingSpotTextConfigs() {
      return (
        [this.fishingSpotName]?.map(text => {
          return this.computeSafeTextConfig(text, this.x, this.y, { fontSize: TEXT_SPOT_FONT, color: 'white' })
        }) ?? []
      )
    },
    allImageLoaded() {
      return (
        this.mapImageLoaded &&
        this.fishingSpotRangeHelperLoaded &&
        this.fishingSpotImage != null &&
        this.markerRangeImage != null
      )
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
      this.loadFishingSpotRangeHelper(fishingSpotName)
    },
  },
  created() {
    this.loadMapImage(this.mapImageUrl)
    this.loadFishingSpotRangeHelper(this.fishingSpotName)
    this.loadImageToProp(defaultMap, 'defaultMapImage')
    this.loadImageToProp(fishMarker, 'fishingSpotImage')
    this.loadImageToProp(markerRange, 'markerRangeImage')
    this.loadImageToProp(aetheryteMarker, 'aetheryteImage')
    this.throttledResizeFn = throttle(() => this.resizeInternal(), 300)
  },
  mounted() {
    const stage = this.$refs.stage.getNode()
    stage.on('wheel', e => {
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
    loadFishingSpotRangeHelper(fishingSpotName) {
      this.fishingSpotRangeHelperLoaded = false
      this.loadImageToProp(this.getFishingSpotRangeHelper(fishingSpotName), 'fishingSpotRangeHelperImage').then(
        () => (this.fishingSpotRangeHelperLoaded = true)
      )
    },
    loadImageToProp(urlOrPromise, imagePropName) {
      return Promise.resolve(urlOrPromise).then(url => {
        if (url == null) {
          this[imagePropName] = null
          return
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
      if (AVAILABLE_HELP.has(fishingSpotName)) {
        return import(`@/assets/fishing-spot-range-detail/${fishingSpotName}.png`)
          .then(it => it?.default)
          .catch(() => console.warn(fishingSpotName + ' range helper is missing.'))
          .finally(() => null)
      } else {
        return null
      }
    },
    resize() {
      this.throttledResizeFn()
    },
    toggleLayer(layerName) {
      const layer = this.$refs[layerName].getNode()
      layer.opacity(1 - layer.opacity())
      layer.draw()
    },
    resizeInternal() {
      const rect = this.$refs.container.getBoundingClientRect()
      this.containerWidth = rect?.width
      this.containerHeight = this.ratio * this.containerWidth

      const stage = this.$refs.stage?.getNode()
      stage?.scale({ x: this.containerHeight / MAP_SIZE, y: this.containerHeight / MAP_SIZE })
      stage?.position({ x: this.containerWidth / 2 - this.containerHeight / 2, y: 0 })
      // const markerRangeNode = this.$refs.markerRangeNode.getNode()
      // markerRangeNode.cache()
      // markerRangeNode.getLayer().batchDraw()
      stage.batchDraw()
    },
    copyText(text) {
      copy(text)
      this.showSnackbar({ text: this.$t('importExport.dialog.message.copySuccess'), color: 'success' })
    },
    switchMouseToPointer() {
      this.$refs.stage.getNode().container().style.cursor = 'pointer'
    },
    switchMouseToDefault() {
      this.$refs.stage.getNode().container().style.cursor = 'default'
    },
    computeSafeTextConfig(text, x, y, option) {
      const textLength = text.length
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