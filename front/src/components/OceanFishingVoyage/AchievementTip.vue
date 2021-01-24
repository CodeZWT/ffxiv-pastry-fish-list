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
        <div v-if="normalFish.length === 0">
          无
        </div>
        <div v-else v-for="(fish, index) in normalFish" :key="index">
          <fish-tip :fish="fish" show-achievement-tip />
        </div>
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
        <div v-if="spectralCurrentFish.length === 0">
          无
        </div>
        <div v-else v-for="(fish, index) in spectralCurrentFish" :key="index">
          <fish-tip :fish="fish" show-achievement-tip />
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
      <!-- <v-card-subtitle>{{ achievementId }}-{{ location.id }}</v-card-subtitle> -->
      <v-card-text>{{ tip[achievementId][location.id] }}</v-card-text>
    </v-card>
  </div>
</template>

<script>
import FishTip from '@/components/OceanFishingVoyage/FishTip'
import FIX from '@/store/fix'

export default {
  name: 'AchievementTip',
  components: { FishTip },
  props: {
    achievementId: {
      type: Number,
      default: undefined,
    },
    location: {
      type: Object,
      default: undefined,
    },
    normalFish: {
      type: Array,
      default: () => [],
    },
    spectralCurrentFish: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      oceanFishTipReference: FIX.OCEAN_FISHING_TIPS.tip1,
      tip: {
        // 八爪旅人
        '2563': {
          // 加拉迪翁湾外海
          '237':
            '通常海域用磷虾钓青色章鱼，双提18s多的中杆[!!]4条，阴云/薄雾可以排除碧玉头，18s即可双提，小雨/暴雨可以排除猎豹鳗干扰，但仍有碧玉头，需等24s再双提。幻海流还是磷虾钓人鱼发，双提2.8s以内的中杆[!!]4条，可能提到幽灵鲨干扰，有余力可以拍了。强调一下，人鱼发确实2-5s都有，但是只有2.8s以前的不会歪可以放心双提。如果你拍掉了幽灵鲨，可以放宽到接近4s。',
          // 梅尔托尔海峡南
          '239': '没有章鱼，随便钓。',
          // 罗塔诺海海面
          '241': '',
          //梅尔托尔海峡北
          '243':
            '只有幻海流里有，用磷虾钓幻纱披风，偏长的中杆[!!]，是个稀有高分鱼，双提也是4条。',
        },
        // 捕鲨人
        '2564': {
          // 加拉迪翁湾外海
          '237':
            '通常海域用刺螠，鱼王杆[!!!]暗淡鲨，双提只有2条，可能提到幻海鱼。暴雨天气可以跳船，不出鲨鱼。幻海流中鲨鱼很多，都是刺螠，3-4s的中杆[!!]幽灵鲨双提4条，可能提到人鱼发干扰。长中杆[!!]流银刃和鱼王杆[!!!]漏斗鲨是稀有鱼，后者可以双提4条。',
          // 梅尔托尔海峡南
          '239': '没有鲨鱼，随便钓。',
          // 罗塔诺海海面
          '241':
            '通常海域用刺螠，鱼王杆[!!!]铬铁锤头鲨双提4条，可能提到幻海鱼。幻海鱼中两个鲨鱼都是稀有鱼，用刺螠双提处刑者鱼王杆[!!!]4条，长中杆[!!]清道夫也可以考虑但容易误伤。',
          //梅尔托尔海峡北
          '243': '',
        },
        // 水母狂魔
        '2565': {
          // 加拉迪翁湾外海
          '237': '没有水母，随便钓。',
          // 梅尔托尔海峡南
          '239':
            '用石沙蚕提很短的轻杆[!]拉诺西亚水母，干扰超级多(阴云/薄雾干扰会少一点点)，建议专一再双提。需要打高获得力不然可能只能双提3条。建议不要触发幻海流，里面只有石沙蚕长轻杆[!]海荨麻是水母，是个稀有鱼，双提可以4条。',
          // 罗塔诺海海面
          '241': '只有幻海流有水母浮游碟鱼，用磷虾，稀有鱼，长轻杆[!]双提4条。',
          //梅尔托尔海峡北
          '243': '',
        },
        // 龙马惊神
        '2566': {
          // 加拉迪翁湾外海
          '237': '没有海马，随便钓。',
          // 梅尔托尔海峡南
          '239':
            '用石沙蚕，双提蓬松海龙特别长的轻杆[!]4条，可能歪到梅尔托尔蝴蝶鱼。如果天气是阴云你们可以直接跳船了，这天气不出，最好微风/强风不过提升不大。建议不要触发幻海流，里面只有以小钓大中杆[!!]以太海龙是海马，只能提两个还有可能歪海难船帆。',
          // 罗塔诺海海面
          '241': '',
          //梅尔托尔海峡北
          '243': '只有幻海流有海马珊瑚海龙，用石沙蚕，稀有鱼，长轻杆[!]双提4条。',
        },
      },
    }
  },
}
</script>

<style scoped></style>
