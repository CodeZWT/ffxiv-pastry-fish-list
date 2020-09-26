<template>
  <div style="width: 100%; height: 100%; border: 1px solid #757575; border-radius: 6px">
    <div v-if="!debug" class="target" style="width: 100%; height: 100%"></div>
    <div v-else style="display: flex; flex-direction: column">
      <code> Map: {{ id }} @ {{ x }}, {{ y }} </code>
      <code> Computed @ {{ mapX }}, {{ mapY }} </code>
      <a :href="mapTestUrl" title="Go To Map Test">Go To Map Test</a>
    </div>
    <div class="template" style="display: none">
      <section class="erozea-map-outer">
        <div class="eorzea-map-glass"></div>
        <div class="eorzea-map-inner eorzea-map"></div>
        <div class="eorzea-map-resize-handler"></div>
      </section>
    </div>
  </div>
</template>

<script>
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'eorzea-map',
  props: {
    id: {
      type: Number,
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
    debug: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      iconUrl: window.YZWF.eorzeaMap.loader.getIconUrl('ui/icon/060000/060561.tex'), // 小旗子标记；注意地图 CDN 上只有地图用到的图标
    }
  },
  computed: {
    mapX() {
      return +DataUtil.pixelToPos(this.sizeFactor, this.x).toFixed(2)
    },
    mapY() {
      return +DataUtil.pixelToPos(this.sizeFactor, this.y).toFixed(2)
    },
    mapTestUrl() {
      return `https://map.wakingsands.com/#f=mark&id=${this.id}&x=${this.mapX}&y=${this.mapY}`
    },
  },
  watch: {
    id() {
      // rerender map
      if (!this.debug) {
        this.rerenderMap()
      }
    },
  },
  mounted() {
    if (!this.debug) {
      this.rerenderMap()
    }
  },
  methods: {
    rerenderMap() {
      const template = this.$el.getElementsByClassName('template')[0].firstElementChild.cloneNode(true)
      const target = this.$el.getElementsByClassName('target')[0]
      target.innerHTML = ''
      target.appendChild(template)
      const el = target.firstElementChild
      const self = this
      window.YZWF.eorzeaMap.create(el).then(map => {
        window.map = map
        map.loadMapKey(self.id).then(() => {
          self.setMapData(map)
        })
      })
    },
    setMapData(map) {
      // 地图要加载好后才可以加标记
      //const [mapX, mapY] = map.toMapXY3D(1380/2048*42, 275/2048*42)
      // const x = this.pixelToPos(this.sizeFactor, this.x)
      // const y = this.pixelToPos(this.sizeFactor, this.y)
      // const iconUrl = window.YZWF.eorzeaMap.loader.getIconUrl('ui/icon/060000/060561.tex') // 小旗子标记；注意地图 CDN 上只有地图用到的图标
      // const iconUrl = 'https://http.cat/204' // 也可以直接是 URL；如果没有的图标也可以从 cafemaker 上拿

      const marker = window.YZWF.eorzeaMap.simpleMarker(
        this.mapX, // 游戏 2D 坐标 X
        this.mapY, // 游戏 2D 坐标 Y
        this.iconUrl, // 图标 url
        map.mapInfo // 直接照抄就行了，这是从 map 实例上拿的地图信息
      )

      map.addMaker(marker)

      setTimeout(() => {
        map.setView(map.mapToLatLng2D(this.mapX, this.mapY), 0) // 移动到视角中心；setView 参考 leaflet 用法即可
      }, 1000)
    },
  },
}
</script>

<style>
.erozea-map-outer {
  padding: 0;
  margin: 0;
  border-width: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.eorzea-map-inner {
  width: 100%;
  height: 100%;
}

.eorzea-map-place-name {
  color: #fff;
}

.eorzea-map-glass {
}

.eorzea-map-nav {
  display: none !important;
}
</style>