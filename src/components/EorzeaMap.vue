<template>
  <div style="width: 100%; height: 100%">
    <section v-if="!debug" class="erozea-map-outer">
      <div class="eorzea-map-glass"></div>
      <div class="eorzea-map-inner eorzea-map"></div>
      <div class="eorzea-map-resize-handler"></div>
    </section>
    <div v-else style="display: flex; flex-direction: column">
      <code> Map: {{ id }} @ {{ x }}, {{ y }} </code>
      <code> Computed @ {{ mapX }}, {{ mapY }} </code>
      <a :href="mapTestUrl" title="Go To Map Test">Go To Map Test</a>
    </div>
  </div>
</template>

<script>
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
    hierarchy: {
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
      return +this.pixelToPos(this.hierarchy, this.x).toFixed(2)
    },
    mapY() {
      return +this.pixelToPos(this.hierarchy, this.y).toFixed(2)
    },
    mapTestUrl() {
      return `https://map.wakingsands.com/#f=mark&id=${this.id}&x=${this.mapX}&y=${this.mapY}`
    },
  },
  mounted() {
    if (!this.debug) {
      const el = this.$el.getElementsByClassName('eorzea-map')[0]
      const self = this
      window.YZWF.eorzeaMap.create(el).then(map => {
        window.map = map
        map
          .loadMapKey(self.id) // 23 为地图编号（游戏内 Map 表）
          .then(() => {
            self.setMapData(map)
          })
      })
    }
  },
  methods: {
    setMapData(map) {
      // 地图要加载好后才可以加标记
      //const [mapX, mapY] = map.toMapXY3D(1380/2048*42, 275/2048*42)
      // const x = this.pixelToPos(this.hierarchy, this.x)
      // const y = this.pixelToPos(this.hierarchy, this.y)
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

    pixelToPos(hierarchy, pixelIndex) {
      console.log('hierarchy', hierarchy)
      let factor = 41
      // if (hierarchy === 1) {
      //   factor = 20.5
      // }
      return (pixelIndex / 2048) * factor + 1
    },
  },
}
</script>

<style>
.erozea-map-outer {
  padding: 0;
  margin: 0;
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
