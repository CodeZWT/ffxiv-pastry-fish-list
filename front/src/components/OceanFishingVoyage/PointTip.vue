<template>
  <div>
    <v-card outlined class="mt-2">
      <v-card-title>
        <div class="d-flex justify-center">
          <div>{{ location.name }}</div>
          <v-icon>{{ location.icon }}</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <fish-tip :fish="spectralTriggerFish" />
      </v-card-text>
    </v-card>

    <v-card outlined color="info" class="mt-2">
      <v-card-title>
        <div class="d-flex justify-center">
          <div>{{ location.name }}幻海流</div>
          <v-icon>{{ location.icon }}</v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <div
          v-for="(fishId, index) in tip[location.spectralCurrentId + '-' + location.shift]
            .fishList"
          :key="index"
        >
          <fish-tip :fish="fishDict[fishId]" show-point-tip />
        </div>
      </v-card-text>
    </v-card>

    <v-card outlined class="mt-2">
      <v-card-subtitle>
        <div class="d-flex">
          <a :href="oceanFishTipReference.link" target="_blank">
            {{ oceanFishTipReference.title }}
          </a>
          <v-spacer />
          <div>
            {{ oceanFishTipReference.author }}
          </div>
        </div>
      </v-card-subtitle>
      <v-card-text>
        {{ tip[location.spectralCurrentId + '-' + location.shift].tipContent }}
      </v-card-text>
    </v-card>
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
    spectralTriggerFish: {
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
      oceanFishTipReference: {
        title: '[苍海龙骑]海钓手册',
        link: 'https://ngabbs.com/read.php?tid=20553241',
        author: '月咏泠音@摩杜纳',
      },
      tip: {
        // 加拉迪翁湾外海
        '238-0': {
          fishList: [29756, 29753, 29766],
          tipContent:
            '石沙蚕，双提5s以上的[!](钉牡蛎2*222/灵敏舞者2*444)/2s以内的[!!](人鱼发4*94)或者开耐心随便钓都差不多',
        },
        '238-1': { fishList: [29782, 29751], tipContent: '刺螠，双提[!!!](漏斗鲨4*213)' },
        // 梅尔托尔海峡南
        '240-0': {
          fishList: [29755, 29758],
          tipContent:
            '磷虾，建议耐心，或双提5s以上的[!!](秘银君2*196)或以小钓大略长中杆[!!](巨大枪鱼2*127)',
        },
        '240-1': {
          fishList: [29757, 29765],
          tipContent: '石沙蚕，双提5s+的[!](海荨麻4*156)或以小钓大[!!!](无赖龙2*345)',
        },
        '240-2': {
          fishList: [29763, 29758, 29789],
          tipContent:
            '小虾肉笼[!]→高级以太药虱 以小钓大[!!]双重提钩→巨大枪鱼*2 触发直感，[!!!]不知道什么提钩→珊瑚蝠鲼',
        },
        // 罗塔诺海海面
        '242-0': {
          fishList: [29770],
          tipContent: '刺螠，双提[!!!](处刑者4*216)',
        },
        '242-2': { fishList: [29762], tipContent: '磷虾，双提5s+[!](浮游碟鱼4*222)' },
        //梅尔托尔海峡北
        '244-2': { fishList: [29773], tipContent: '磷虾，双提5s+[!!](幻纱披风4*198)' },
      },
    }
  },
}
</script>

<style scoped></style>
