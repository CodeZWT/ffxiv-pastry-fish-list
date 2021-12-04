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
              <v-icon>mdi-arrow-collapse</v-icon>
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
                <v-icon>mdi-waves</v-icon>
              </v-btn>
              <v-btn
                @click="toggleLayer('markerRangeLayer')"
                icon
                title="隐藏/显示 游戏内钓场提示（范围圈）"
              >
                <v-icon>mdi-map-marker-radius</v-icon>
              </v-btn>
              <v-btn @click="toggleLayer('textLayer')" icon title="隐藏/显示 钓场名称">
                <v-icon>mdi-format-text</v-icon>
              </v-btn>
              <v-btn
                @click="toggleMapLock"
                icon
                title="取消/启用 地图锁（取消后可鼠标移动以及滚轮缩放地图）"
              >
                <v-icon>mdi-lock</v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-scale-transition>
        <v-stage ref="stage" :config="stageConfig">
          <v-layer>
            <v-image :config="defaultMapConfig"></v-image>
            <v-image :config="mapConfig"></v-image>
            <v-image
              v-for="(config, index) in aetheryteMakerConfigs"
              :config="config"
              :key="`marker${index}`"
            ></v-image>
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
import DataUtil from '@/utils/DataUtil'
import EnvMixin from '@/components/basic/EnvMixin'
import ImgUtil from '@/utils/ImgUtil'
import _ from 'lodash'
import copy from 'copy-to-clipboard'
// import Konva from 'konva'

const TEXT_PADDING = 50
const TEXT_AETHERYTE_FONT = 90
const TEXT_SPOT_FONT = 70
const MAP_SIZE = 2048

const AVAILABLE_HELP = new Set([
  '琥珀丘',
  '沙河',
  '拿巴示断绝',
  '白银水路',
  '白银乡',
  '蓝雾涌泉',
  '青磷泉',
  '太阳海岸',
  '罗塔诺海（船尾）',
  '接雨草树林',
  '红螳螂瀑布',
  '南鲜血滨',
  '北鲜血滨',
  '隐秘瀑布',
  '东永恒川',
  '接雨草沼泽地',
  '罗塔诺海（船首）',
  '永夏岛北',
  '火墙',
  '枯骨南泉',
  '枯骨北泉',
  '宇格拉姆河',
  '魔窟离岛',
  '沃仙曦染',
  '蓝天窗',
  '云水塘',
  '云顶',
  '西方水泉',
  '招恶荒岛',
  '惋惜之晶遗迹',
  '索姆阿尔云帽',
  '人王遗迹',
  '绿茵岛',
  '高脚孤丘',
  '红茶川水系上游',
  '低语河谷',
  '翡翠湖滨',
  '红茶川水系下游',
  '海雾村',
  '鳎沙地窖',
  '卡利班深海峡西北',
  '尊紫洞',
  '陆人墓标',
  '卡利班古巢西',
  '卡利班古巢东',
  '诺弗兰特大陆坡',
  '塔赫托特尔湖',
  '秋瓜湖畔',
  '嘈杂川',
  '荣耀溪',
  '妖精领溪谷',
  '涟漪小川',
  '花蜜栈桥',
  '十二神大圣堂',
  '落翠底',
  '蔓根沼',
  '哈希瓦河上游',
  '哈希瓦河下游',
  '哈希瓦河东支流',
  '哈希瓦河中游',
  '哥布林血流',
  '兀尔德恩惠地',
  '镜池',
  '叶脉水系',
  '常影区',
  '萌芽池',
  '狱之盖近海',
  '自凝岛近海',
  '龟甲岛近海',
  '冲之岩近海',
  '绝鬼岛近海',
  '红玉炮台近海',
  '渔村沿岸',
  '防波堤',
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
  '珂露西亚岛西海岸',
  '沃茨河上游',
  '白油瀑布',
  '沃茨河下游',
  '刺舌滴',
  '观海湾',
  '珂露西亚岛东海岸',
  '库尔札斯不冻池',
  '灰尾瀑布',
  '清澈池',
  '交汇河',
  '灾祸池西',
  '灾祸池南',
  '龙涎',
  '灰烬池',
  '圣人泪',
  '库尔札斯河',
  '圣人旅道',
  '巨龙首营地水库',
  '剑峰山麓',
  '调查队冰洞',
  '伊修加德大云海',
  '披雪大冰壁',
  '落魔崖',
  '蛇水湖',
  '洛查特尔河',
  '血盅',
  '缪栎的乡愁南部',
  '结誓洞窟',
  '奥修昂火炬',
  '莫拉比湾西岸',
  '遗孀泪',
  '守炬埠头',
  '空心穴',
  '雪松原沿岸地',
  '莫拉比造船厂',
  '盲铁坑道',
  '砂盐滩',
  '愚者瀑布',
  '橡树原',
  '石绿湖浅滩',
  '石绿湖东北岸',
  '登天路溪谷',
  '石绿湖西北岸',
  '风化裂痕',
  '始源湖',
  '锈迹贮水池',
  '阴沉乡',
  '贤岛',
  '利姆萨·罗敏萨上层甲板',
  '利姆萨·罗敏萨下层甲板',
  '悲叹飞泉',
  '荒烟野地',
  '宽慰河',
  '不洁古像',
  '光轮祭坛',
  '彻悟岩窟西',
  '饵食台地',
  '彻悟岩窟',
  '沙利亚克河',
  '沙利亚克河上流',
  '沙利亚克河中流',
  '湍流三角地',
  '冠毛大树',
  '德尔塔管区',
  '阿尔法管区',
  '阿济兹拉旗舰岛',
  '生态园',
  '超星际通信塔',
  '废液池',
  '纠缠沼泽林',
  '银泪湖北岸',
  '纠缠沼泽林源流',
  '早霜顶',
  '歌咏裂谷北部',
  '歌咏裂谷',
  '不悔战泉',
  '火蜥蜴河',
  '遗忘绿洲',
  '撒沟厉沙丘',
  '撒沟厉沙海',
  '星导寺入口',
  '幻河上游',
  '神拳痕',
  '水晶都起居室',
  '三艺区',
  '四艺区',
  '太阳湖',
  '哈克卡勒河',
  '涅木卡勒河',
  '塔奥卡勒河',
  '亚特卡勒河下游',
  '亚特卡勒河上游',
  '朵塔儿水洲',
  '萨普沙产卵地',
  '幻影群岛南岸',
  '骷髅谷沿岸地',
  '雨燕塔殖民地',
  '酿酒师灯塔',
  '二分石沿岸地',
  '幻影群岛北岸',
  '船舶墓场',
  '隐秘港',
  '西风岬',
  '月牙湾',
  '足迹谷',
  '黄昏湾',
  '丰饶神井',
  '白银集市',
  '月滴洞',
  '帕拉塔安息地',
  '薰衣草苗圃',
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
  '宠坏的年幼溪流',
  '嫉妒的年少溪流',
  '身镜湖',
  '手镜湖',
  '傲慢的年长溪流',
  '圣法斯里克天庭',
  '科拉德排水沟',
  '废船街',
  '和风流地沿岸',
  '无赖川',
  '轻声谷',
  '盛夏滩沿岸',
  '西永恒川',
  '尼姆河',
  '邪嗣',
  '污流上游',
  '污流下游',
  '执掌峡谷',
  '静语庄园',
  '缪栎之泪',
  '云冠洞穴',
  '云冠西北池',
  '云冠西南池',
  '息风云海（往期渔场）',
  '摇风云海',
  '旋风云海',
  '无风云海',
  '狂风云海',
  '狂风云海（往期渔场）',
])

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
    fishMarker: ImgUtil.getImgUrl('fishingSpot.png'),
    markerRange: ImgUtil.getImgUrl('markerRange.png'),
    defaultMap: ImgUtil.getMapUrl('default.00.webp'),
    aetheryteMarker: ImgUtil.getImgUrl('PlaceName.png'),
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
    fishingSpotNames() {
      return this.fishingSpots.map(it => it.name)
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
    fishingSpotNames(fishingSpotNames, oldFishingSpotNames) {
      if (!_.isEqual(oldFishingSpotNames, fishingSpotNames)) {
        this.loadFishingSpotRangeHelper(fishingSpotNames)
      }
    },
  },
  created() {
    this.loadMapImage(this.mapImageUrl)
    this.loadFishingSpotRangeHelper(this.fishingSpots.map(it => it.name))
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
    loadFishingSpotRangeHelper(fishingSpotNames) {
      this.fishingSpotRangeHelperLoaded = false
      Promise.all(
        fishingSpotNames.map((fishingSpotName, index) =>
          this.loadImageToProp(
            this.getFishingSpotRangeHelper(fishingSpotName),
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
        })
      })
    },
    getFishingSpotRangeHelper(fishingSpotName) {
      const imageName =
        this.showFishingRangeHelper && AVAILABLE_HELP.has(fishingSpotName)
          ? fishingSpotName
          : 'default'
      if (this.showFishingRangeHelper && imageName === 'default') {
        console.warn(fishingSpotName + ' range helper is missing.')
      }
      return ImgUtil.getImgUrl(imageName + '.png')
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
