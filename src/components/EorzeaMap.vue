<template>
    <section class="erozea-map-outer">
      <div class="eorzea-map-glass"></div>
      <div class="eorzea-map-inner" id="eorzea-map"></div>
      <div class="eorzea-map-resize-handler"></div>
    </section>
    <!--    <code>{{ iframeUrl }}</code>-->
    <!--    <iframe :src="iframeUrl" width="200" height="200"></iframe>-->
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
  },
  data() {
    return {
      iconUrl: window.YZWF.eorzeaMap.loader.getIconUrl('ui/icon/060000/060561.tex'), // 小旗子标记；注意地图 CDN 上只有地图用到的图标
      // iframeUrl: `https://map.wakingsands.com/#f=mark&id=${this.id}&x=${this.x}&y=${this.y}`,
    }
  },
  mounted() {
    const el = this.$el.children[1]
    const self = this
    window.YZWF.eorzeaMap.create(el).then(map => {
      window.map = map
      map
        .loadMapKey(self.id) // 23 为地图编号（游戏内 Map 表）
        .then(() => {
          // 地图要加载好后才可以加标记
          //const [mapX, mapY] = map.toMapXY3D(1380/2048*42, 275/2048*42)
          const x = self.pixelToPos(self.hierarchy, self.x)
          const y = self.pixelToPos(self.hierarchy, self.y)
          // const iconUrl = window.YZWF.eorzeaMap.loader.getIconUrl('ui/icon/060000/060561.tex') // 小旗子标记；注意地图 CDN 上只有地图用到的图标
          // const iconUrl = 'https://http.cat/204' // 也可以直接是 URL；如果没有的图标也可以从 cafemaker 上拿

          const marker = window.YZWF.eorzeaMap.simpleMarker(
              x, // 游戏 2D 坐标 X
              y, // 游戏 2D 坐标 Y
              self.iconUrl, // 图标 url
              map.mapInfo // 直接照抄就行了，这是从 map 实例上拿的地图信息
          )

          map.addMaker(marker)

          setTimeout(() => {
            map.setView(map.mapToLatLng2D(x, y), 0) // 移动到视角中心；setView 参考 leaflet 用法即可
          }, 300)
        })
    })
  },
  methods: {
    setMapData(map) {
      // 地图要加载好后才可以加标记
      //const [mapX, mapY] = map.toMapXY3D(1380/2048*42, 275/2048*42)
      const x = this.pixelToPos(this.hierarchy, this.x)
      const y = this.pixelToPos(this.hierarchy, this.y)
      // const iconUrl = window.YZWF.eorzeaMap.loader.getIconUrl('ui/icon/060000/060561.tex') // 小旗子标记；注意地图 CDN 上只有地图用到的图标
      // const iconUrl = 'https://http.cat/204' // 也可以直接是 URL；如果没有的图标也可以从 cafemaker 上拿

      const marker = window.YZWF.eorzeaMap.simpleMarker(
        x, // 游戏 2D 坐标 X
        y, // 游戏 2D 坐标 Y
        this.iconUrl, // 图标 url
        map.mapInfo // 直接照抄就行了，这是从 map 实例上拿的地图信息
      )

      map.addMaker(marker)

      setTimeout(() => {
        map.setView(map.mapToLatLng2D(x, y), 0) // 移动到视角中心；setView 参考 leaflet 用法即可
      }, 300)
    },

    pixelToPos(hierarchy, pixelIndex) {
      let factor = 41
      if (hierarchy === 1) {
        factor = 20.5
      }
      return (pixelIndex / 2048) * factor + 1
    },
  },
}
</script>

<style scoped>
.erozea-map-outer {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.eorzea-map-inner {
  width: 100%;
  height: 100%;
}

.eorzea-map-place-name {
  color: #fff;
}

.eorzea-map-glass {
  /*top: inherit;*/
  /*left: inherit;*/
}
</style>
