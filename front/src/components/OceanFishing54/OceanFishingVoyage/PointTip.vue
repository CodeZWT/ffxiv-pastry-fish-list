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
      <v-card-text>
        <fish-tip :fish="normalBigFish" />
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
          v-for="(fishId, index) in tip[location.spectralCurrentId][location.shift]
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
      <v-card-text v-html="tip[location.spectralCurrentId][location.shift].tipContent">
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import FishTip from '@/components/OceanFishingVoyage/FishTip'
import { OCEAN_FISHING_TIPS } from 'Data/fix'
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
    normalBigFish: {
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
      oceanFishTipReference: OCEAN_FISHING_TIPS.tip3,
      tip: {
        // 加拉迪翁湾
        238: {
          0: {
            fishList: [29753, 29756],
            tipContent: '石沙蚕，5s+！，钉牡蛎(双2)、灵敏舞者(双2)',
          },
          1: {
            fishList: [29751, 29782],
            tipContent: '刺螠，4-5s！！，流银刃(双2)；刺螠，！！！，漏斗鲨(双4)',
          },
          2: {
            fishList: [29788],
            tipContent:
              '(石沙蚕，3s-！，天堂之匙X2)+(鳞虾，3-5s！，海神印)→火萤，！！！，索蒂斯',
          },
        },
        // 梅尔托尔海峡南
        240: {
          0: { fishList: [29755], tipContent: '鳞虾，4s+！！，秘银君(双2)' },
          1: {
            fishList: [29757, 29765],
            tipContent:
              '石沙蚕，6s+！，海荨麻(双4)；刺螠，2-4s！高级以太药虱--！！！无赖龙(双2)',
          },
          2: {
            fishList: [29763, 29789],
            tipContent:
              '刺螠，2-4s！高级以太药虱--3-5s！！以太海龙(双2)；<br />\n' +
              '刺螠，2-4s！高级以太药虱--3s-！！巨大枪鱼→小虾肉笼，！！！，珊瑚蝠鲼',
          },
        },
        // 梅尔托尔海峡北
        244: {
          0: {
            fishList: [29791],
            tipContent: '刺螠，！！！，守领鳍龙X3→重板铁钩，！！！，依拉丝莫龙',
          },
          1: {
            fishList: [29764, 29783],
            tipContent: '石沙蚕，6s+！，珊瑚海龙(双4)；鳞虾，6s+！！，坠天鱼(双2)',
          },
          2: {
            fishList: [29777, 29773],
            tipContent:
              '石沙蚕，4-5s！，剪碎手巴塞洛缪(双4)；鳞虾，5s+！！，幻纱披风(双4)',
          },
        },
        // 罗塔诺海
        242: {
          0: {
            fishList: [29767, 29770],
            tipContent: '刺螠，4s+！！，清道夫(双2)；刺螠，！！！，处刑者(双4)',
          },
          1: {
            fishList: [29790],
            tipContent:
              '(石沙蚕，3s+！，沉寂者)+(刺螠，4s+！，深海鳗)→沟鼠尾巴，！！！，石骨鱼',
          },
          2: {
            fishList: [29762, 29774],
            tipContent: '鳞虾，6s+！，浮游碟鱼(双4)；石沙蚕，2-6s！，蜗牛鱼(双2)',
          },
        },
        // The Cieldalaes
        247: {
          0: {
            fishList: [32071, 32072],
            tipContent:
              "鳞虾，5s+！！，Devil's Sting(双2)；刺螠，3s+！！！，Callichthyid(双2)",
          },
          1: {
            fishList: [32069, 32073],
            tipContent:
              '鳞虾，5s+！！，Flaming Eel(双2)；刺螠，6s+！！，Meandering Mora(双2)',
          },
          2: {
            fishList: [32074],
            tipContent:
              "(刺螠，3s-！！！，Jetborne MantaX2)+(鳞虾，3-5s！！，Mistbeard's Cup)→乌贼丝，！！！，Hafgufa",
          },
        },
        // The Bloodbrine Sea
        249: {
          0: {
            fishList: [32085, 32090, 32093, 32094],
            tipContent:
              '石沙蚕，3s-！，Oracular Crab(双4)；石沙蚕，4s+！，Exterminator(双4)<br />\n' +
              '常驻高分鱼，刺螠，7s+！！！，Quartz Hammerhead(双2)<br />\n' +
              '鳞虾，3s-！！，Beatific VisionX3→潮虫，！！！，Seafaring Toad，精准提钩<br />',
          },
          1: {
            fishList: [32093],
            tipContent: '常驻高分鱼，刺螠，7s+！！！，Quartz Hammerhead(双2)',
          },
          2: {
            fishList: [32087, 32093],
            tipContent:
              '鳞虾，3-7s！！，Skaldminni(双4)<br />\n' +
              '常驻高分鱼，刺螠，7s+！！！，Quartz Hammerhead(双2)',
          },
        },
        // The Rothlyt Sound
        251: {
          0: {
            fishList: [32105, 32109, 32111],
            tipContent:
              '石沙蚕，3s-！，Garum Jug(双4)；鳞虾，3-5s！！，Pearl Bombfish(双4)；刺螠，3s+！！，Panoptes(双4)',
          },
          1: {
            fishList: [32114],
            tipContent:
              '石沙蚕，2-5s！Rothlyt Mussel--！，Trollfish→石沙蚕，2-4s！Rothlyt Mussel--！！！，Placodus',
          },
          2: {
            fishList: [32105, 32109],
            tipContent:
              '石沙蚕，3s-！，Garum Jug(双4)；鳞虾，3-5s！！，Pearl Bombfis(双4)',
          },
        },
        // // 加拉迪翁湾外海
        // '238-0': {
        //   fishList: [29756, 29753, 29766],
        //   tipContent:
        //     '石沙蚕，双提5s以上的[!](钉牡蛎2*222/灵敏舞者2*444)/2s以内的[!!](人鱼发4*94)或者开耐心随便钓都差不多',
        // },
        // '238-1': { fishList: [29782, 29751], tipContent: '刺螠，双提[!!!](漏斗鲨4*213)' },
        // // 梅尔托尔海峡南
        // '240-0': {
        //   fishList: [29755, 29758],
        //   tipContent:
        //     '磷虾，建议耐心，或双提5s以上的[!!](秘银君2*196)或以小钓大略长中杆[!!](巨大枪鱼2*127)',
        // },
        // '240-1': {
        //   fishList: [29757, 29765],
        //   tipContent: '石沙蚕，双提5s+的[!](海荨麻4*156)或以小钓大[!!!](无赖龙2*345)',
        // },
        // '240-2': {
        //   fishList: [29763, 29758, 29789],
        //   tipContent:
        //     '小虾肉笼[!]→高级以太药虱 以小钓大[!!]双重提钩→巨大枪鱼*2 触发直感，[!!!]不知道什么提钩→珊瑚蝠鲼',
        // },
        // // 罗塔诺海海面
        // '242-0': {
        //   fishList: [29770],
        //   tipContent: '刺螠，双提[!!!](处刑者4*216)',
        // },
        // '242-2': { fishList: [29762], tipContent: '磷虾，双提5s+[!](浮游碟鱼4*222)' },
        // //梅尔托尔海峡北
        // '244-2': { fishList: [29773], tipContent: '磷虾，双提5s+[!!](幻纱披风4*198)' },
      },
    }
  },
}
</script>

<style scoped></style>
