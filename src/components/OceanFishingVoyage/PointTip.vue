<template>
  <div>
    <!--    {{ location }}-->
    <!--    {{ location.spectralCurrentId + '-' + location.shift }}-->
    <!--    {{ tip[location.spectralCurrentId + '-' + location.shift] }}-->
    <div
      v-for="(fishId, index) in tip[location.spectralCurrentId + '-' + location.shift]"
      :key="index"
    >
      <fish-tip :fish="fishDict[fishId]" show-point-tip />
    </div>
  </div>
</template>

<script>
import FishTip from '@/components/OceanFishingVoyage/FishTip'
export default {
  name: 'PointTip',
  components: { FishTip },
  props: {
    location: {
      type: Object,
      default: undefined,
    },
    fishDict: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      tip: {
        // 加拉迪翁湾外海
        '238-0': [29756, 29753, 29766],
        '238-1': [29782, 29751],
        // 梅尔托尔海峡南
        '240-0': [29758, 29755],
        '240-1': [29757, 29765],
        '240-2': [29763, 29758, 29789],
        // 罗塔诺海海面
        '242-0': [29770],
        '242-2': [29762],
        //梅尔托尔海峡北
        '244-1': [29764],
        '244-2': [29773],
      },
    }
  },
}
</script>

<style scoped></style>
