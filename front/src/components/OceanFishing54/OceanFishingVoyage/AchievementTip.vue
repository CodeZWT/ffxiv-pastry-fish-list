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
        <div v-if="normalFish.length === 0">无</div>
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
        <div v-if="spectralCurrentFish.length === 0">无</div>
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
      <v-card-text v-html="tip[achievementId][location.id]"></v-card-text>
    </v-card>
  </div>
</template>

<script>
import FishTip from '@/components/OceanFishing54/OceanFishingVoyage/FishTip'
import FIX from 'Data/fix'

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
      oceanFishTipReference: FIX.OCEAN_FISHING_TIPS.tip3,
      tip: {
        // 八爪旅人
        2563: {
          // 加拉迪翁湾外海
          237:
            '[ 加拉迪翁湾 ]<br />\n' +
            '通常时(饵：鳞虾)<br />\n' +
            '·基本 … 18秒以后！！普通提钩<br />\n' +
            '20秒以后的！！双重提钩<br />\n' +
            '对！！！普通提钩狙击幻海<br />\n' +
            '·阴, 雾 … 18秒以后！！必定是章鱼 (双重提钩)<br />\n' +
            '·暴雨 … ！！！放杆不提<br />\n' +
            '幻海流(饵：鳞虾)<br />\n' +
            '·3秒内的！！双重提钩<br />\n',
          // 梅尔托尔海峡南
          239: '[ 梅尔托尔海峡南 ]保存gp自由活动',
          // 罗塔诺海海面
          241: '',
          // 梅尔托尔海峡北
          243:
            '[ 梅尔托尔海峡北 ]<br />\n' +
            '通常时(饵：石沙蚕)<br />\n' +
            '·只提！！！狙击幻海<br />\n' +
            '·满GP的情况使用拍水<br />\n' +
            '幻海流(饵：鳞虾)<br />\n' +
            '·5～8秒的！！双提→专一(强心剂)→双提<br />\n' +
            '·咬钩较快的！！放弃不提<br />\n',
          // Cieldalaes Margin
          246: '',
          // Cieldalaes Spectral Current
          247: '',
          // Open Bloodbrine Sea
          248: '',
          // Bloodbrine Spectral Current
          249: '',
          // Outer Rothlyt Sound
          250: '',
          // Rothlyt Spectral Current
          251: '',
          // // 加拉迪翁湾外海
          // 237: '通常海域用磷虾钓青色章鱼，双提18s多的中杆[!!]4条，阴云/薄雾可以排除碧玉头，18s即可双提，小雨/暴雨可以排除猎豹鳗干扰，但仍有碧玉头，需等24s再双提。幻海流还是磷虾钓人鱼发，双提2.8s以内的中杆[!!]4条，可能提到幽灵鲨干扰，有余力可以拍了。强调一下，人鱼发确实2-5s都有，但是只有2.8s以前的不会歪可以放心双提。如果你拍掉了幽灵鲨，可以放宽到接近4s。',
          // // 梅尔托尔海峡南
          // 239: '没有章鱼，随便钓。',
          // // 罗塔诺海海面
          // 241: '',
          // //梅尔托尔海峡北
          // 243: '只有幻海流里有，用磷虾钓幻纱披风，偏长的中杆[!!]，是个稀有高分鱼，双提也是4条。',
        },
        // 捕鲨人
        2564: {
          // 加拉迪翁湾外海
          237:
            '[ 加拉迪翁湾 ]<br />\n' +
            '通常时(饵：刺螠)<br />\n' +
            '·基本 …对所有！！！普通提钩<br />\n' +
            '·暴雨 …暗淡鲨不出现，全力触发幻海<br />\n' +
            '·幻海结束后对所有的！！！使用双提<br />\n' +
            '幻海流(饵：刺螠)<br />\n' +
            '·对所有的！！普通提钩<br />\n' +
            '·3-4s的！！使用双重提钩<br />\n' +
            '·对！！！双提<br />\n',
          // 梅尔托尔海峡南
          239: '[ 梅尔托尔海峡南 ]保存gp自由活动',
          // 罗塔诺海海面
          241:
            '[ 罗塔诺海 ]<br />\n' +
            '通常时(饵：刺螠)<br />\n' +
            '·基本 … 21秒内的！！！使用双重提钩<br />\n' +
            '21秒以后的！！！使用普通提钩，看情况选择是否专一<br />\n' +
            '·幻海结束后对所有的！！！使用双重提钩<br />\n' +
            '幻海流(饵：刺螠)<br />\n' +
            '·对所有的！！普通提钩<br />\n' +
            '·对！！！双提→专一(强心剂)→双提<br />\n',
          // 梅尔托尔海峡北
          243: '',
          // Cieldalaes Margin
          246: '',
          // Open Bloodbrine Sea
          248: '',
          // Outer Rothlyt Sound
          250: '',
          // // 加拉迪翁湾外海
          // 237: '通常海域用刺螠，鱼王杆[!!!]暗淡鲨，双提只有2条，可能提到幻海鱼。暴雨天气可以跳船，不出鲨鱼。幻海流中鲨鱼很多，都是刺螠，3-4s的中杆[!!]幽灵鲨双提4条，可能提到人鱼发干扰。长中杆[!!]流银刃和鱼王杆[!!!]漏斗鲨是稀有鱼，后者可以双提4条。',
          // // 梅尔托尔海峡南
          // 239: '没有鲨鱼，随便钓。',
          // // 罗塔诺海海面
          // 241: '通常海域用刺螠，鱼王杆[!!!]铬铁锤头鲨双提4条，可能提到幻海鱼。幻海鱼中两个鲨鱼都是稀有鱼，用刺螠双提处刑者鱼王杆[!!!]4条，长中杆[!!]清道夫也可以考虑但容易误伤。',
          // //梅尔托尔海峡北
          // 243: '',
        },
        // 水母狂魔
        2565: {
          // 加拉迪翁湾外海
          237: '[ 加拉迪翁湾 ]保存gp自由活动',
          // 梅尔托尔海峡南
          239:
            '[ 梅尔托尔海峡南 ]<br />\n' +
            '通常时(饵：石沙蚕)<br />\n' +
            '·基本 … 4秒以内的杆使用双重提钩<br />\n' +
            '4-5秒的！使用双重提钩<br />\n' +
            '·微、强风 … 5秒以内杆使用双重提钩<br />\n' +
            '幻海流(餌：石沙蚕)<br />\n' +
            '·6秒以后的！使用双重提钩<br />\n',
          // 罗塔诺海海面
          241:
            '[ 罗塔诺海 ]<br />\n' +
            '通常时(餌：刺螠)<br />\n' +
            '·只提！！！狙击幻海<br />\n' +
            '·满GP的情况使用拍水<br />\n' +
            '幻海流(餌：鳞虾)<br />\n' +
            '·6～10秒的！双提→专一(高级强心剂)→双提<br />\n',
          // 梅尔托尔海峡北
          243: '',
          // Cieldalaes Margin
          246: '',
          // Open Bloodbrine Sea
          248: '',
          // Outer Rothlyt Sound
          250: '',
          // // 加拉迪翁湾外海
          // 237: '没有水母，随便钓。',
          // // 梅尔托尔海峡南
          // 239: '用石沙蚕提很短的轻杆[!]拉诺西亚水母，干扰超级多(阴云/薄雾干扰会少一点点)，建议专一再双提。需要打高获得力不然可能只能双提3条。建议不要触发幻海流，里面只有石沙蚕长轻杆[!]海荨麻是水母，是个稀有鱼，双提可以4条。',
          // // 罗塔诺海海面
          // 241: '只有幻海流有水母浮游碟鱼，用磷虾，稀有鱼，长轻杆[!]双提4条。',
          // //梅尔托尔海峡北
          // 243: '',
        },
        // 龙马惊神
        2566: {
          // 加拉迪翁湾外海
          237: '[ 加拉迪翁湾 ]保存gp自由活动',
          // 梅尔托尔海峡南
          239:
            '[ 梅尔托尔海峡南 ]<br />\n' +
            '通常时(饵：石沙蚕)<br />\n' +
            '·基本 … 5-16秒的！使用双重提钩<br />\n' +
            '超过16秒直接收杆<br />\n' +
            '·阴、雾 … 蓬松海龙不出现，请切鳞虾全力触发幻海<br />\n' +
            '幻海流(饵：石沙蚕)<br />\n' +
            '·2-5秒的！高级以太药虱以小钓大<br />\n' +
            '·如果存在专一蓬松海龙的状态，请保持直到幻海结束<br />\n',
          // 罗塔诺海海面
          241:
            '[ 罗塔诺海 ]<br />\n' +
            '通常时(饵：石沙蚕)<br />\n' +
            '·只提！！！狙击幻海<br />\n' +
            '·满GP的情况使用拍水<br />\n' +
            '幻海流(饵：石沙蚕)<br />\n' +
            '·6～10秒的！双提→专一(强心剂)→双提<br />\n',
          // 梅尔托尔海峡北
          243: '',
          // Cieldalaes Margin
          246: '',
          // Open Bloodbrine Sea
          248: '',
          // Outer Rothlyt Sound
          250: '',
          // // 加拉迪翁湾外海
          // 237: '没有海马，随便钓。',
          // // 梅尔托尔海峡南
          // 239: '用石沙蚕，双提蓬松海龙特别长的轻杆[!]4条，可能歪到梅尔托尔蝴蝶鱼。如果天气是阴云你们可以直接跳船了，这天气不出，最好微风/强风不过提升不大。建议不要触发幻海流，里面只有以小钓大中杆[!!]以太海龙是海马，只能提两个还有可能歪海难船帆。',
          // // 罗塔诺海海面
          // 241: '',
          // //梅尔托尔海峡北
          // 243: '只有幻海流有海马珊瑚海龙，用石沙蚕，稀有鱼，长轻杆[!]双提4条。',
        },
        // What Did Balloons Do to You?
        2754: {
          // 加拉迪翁湾外海
          237: '',
          // 梅尔托尔海峡南
          239: '',
          // 罗塔诺海海面
          241:
            '[ 罗塔诺海 ]<br />\n' +
            '通常时(饵：石沙蚕)<br />\n' +
            '·基本 … 9-12秒的！普通提钩<br />\n' +
            '10-14秒！双重提钩<br />\n' +
            '14-16秒！普通提钩<br />\n' +
            '幻海流(饵：石沙蚕)<br />\n' +
            '·3-5秒的！双重提钩<br />\n',
          // 梅尔托尔海峡北
          243: '',
          // Cieldalaes Margin
          246:
            '[ 谢尔达莱群岛 ]<br />\n' +
            '通常时(饵：石沙蚕)<br />\n' +
            '·基本 … 9秒内的！双重提钩<br />\n' +
            '对11-17的！！！普通提钩狙击幻海<br />\n' +
            '·幻海出现前适当节省gp<br />\n' +
            '幻海流(饵：石沙蚕)<br />\n' +
            '·3秒内的！双重提钩<br />\n',
          // Open Bloodbrine Sea
          248: '',
          // Outer Rothlyt Sound
          250:
            '[ 罗斯利特湾 ]<br />\n' +
            '通常时(饵：石沙蚕)<br />\n' +
            '·基本 … 6秒内的！普通提钩<br />\n' +
            '11秒以后的！双重提钩，剩余2分钟以下可以使用专一<br />\n' +
            '幻海流(饵：鳞虾)<br />\n' +
            '·基本 … 3秒内的！双重提钩<br />\n' +
            '5-6s秒的！！普通提钩→专一(强心剂)→双提<br />\n',
        },
        // What Did Crabs Do to You?
        2755: {
          // 加拉迪翁湾外海
          237: '',
          // 梅尔托尔海峡南
          239: '',
          // 罗塔诺海海面
          241: '',
          // 梅尔托尔海峡北
          243:
            '[ 梅尔托尔海峡北 ]<br />\n' +
            '通常时(饵：鳞虾)<br />\n' +
            '·基本 … 8-20秒的！！普通提钩→专一(强心剂)→双提<br />\n' +
            '·可以选择在这一区域不触发幻海<br />\n' +
            '幻海流(饵：石沙蚕)<br />\n' +
            '·4-5秒的！普通提钩→专一(强心剂)→双提<br />\n',
          // Cieldalaes Margin
          246:
            '[ 谢尔达莱群岛 ]<br />\n' +
            '通常时(饵：鳞虾)<br />\n' +
            '·基本 … 5-11秒的！！普通提钩<br />\n' +
            '对11-17的！！！普通提钩狙击幻海<br />\n' +
            '·幻海出现前适当节省gp<br />\n' +
            '幻海流(饵：鳞虾)<br />\n' +
            '·3秒内的！！双重提钩<br />\n',
          // Open Bloodbrine Sea
          248:
            '[ 绯汐海 ]<br />\n' +
            '通常时(饵：石沙蚕)<br />\n' +
            '·基本 … 7秒内的！普通提钩<br />\n' +
            '13秒以后的！双重提钩，剩余2分钟以下可以使用专一<br />\n' +
            '幻海流(饵：石沙蚕)<br />\n' +
            '·基本 … 3秒内的！双重提钩<br />\n' +
            '4秒的以后的！双重提钩<br />\n',
          // Outer Rothlyt Sound
          250: '',
        },
        // What Did Mantas Do to You?
        2756: {
          // 加拉迪翁湾外海
          237: '',
          // 梅尔托尔海峡南
          239: '',
          // 罗塔诺海海面
          241: '',
          // 梅尔托尔海峡北
          243: '[ 梅尔托尔海峡北/罗塔诺海 ]保存gp自由活动',
          // Cieldalaes Margin
          246:
            '[ 谢尔达莱群岛 ]<br />\n' +
            '通常时(饵：刺螠)<br />\n' +
            '·11秒后以后的！！普通(双重)提钩<br />\n' +
            '·幻海出现前适当节省gp<br />\n' +
            '幻海流(饵：刺螠)<br />\n' +
            '·基本 … 3秒内的！！！双重提钩<br />\n' +
            '·日 … 3秒后存在干扰！！！注意不要提错<br />\n',
          // Open Bloodbrine Sea
          248:
            '[ 绯汐海/罗斯利特湾 ]<br />\n' +
            '通常时(饵：鳞虾/刺螠)<br />\n' +
            '·绯汐海-鳞虾，罗斯利特湾-刺螠<br />\n' +
            '·只提！！！狙击幻海<br />\n' +
            '·满GP的情况使用拍水<br />\n' +
            '幻海流(饵：鳞虾/刺螠)<br />\n' +
            '·绯汐海-鳞虾，罗斯利特湾-刺螠<br />\n' +
            '·基本 … 3-5秒的！！普通提钩<br />\n' +
            '5秒以后的！！双重提钩<br />\n',
          // Outer Rothlyt Sound
          250:
            '[ 绯汐海/罗斯利特湾 ]<br />\n' +
            '通常时(饵：鳞虾/刺螠)<br />\n' +
            '·绯汐海-鳞虾，罗斯利特湾-刺螠<br />\n' +
            '·只提！！！狙击幻海<br />\n' +
            '·满GP的情况使用拍水<br />\n' +
            '幻海流(饵：鳞虾/刺螠)<br />\n' +
            '·绯汐海-鳞虾，罗斯利特湾-刺螠<br />\n' +
            '·基本 … 3-5秒的！！普通提钩<br />\n' +
            '5秒以后的！！双重提钩<br />\n',
        },
      },
    }
  },
}
</script>

<style scoped></style>
