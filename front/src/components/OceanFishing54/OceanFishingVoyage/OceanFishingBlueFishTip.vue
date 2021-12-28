<template>
  <div v-show="tip.fishTipDict[fishId]">
    <v-divider />
    <v-card-text>
      <div v-html="tip.fishTipDict[fishId] && tip.fishTipDict[fishId].content" />
    </v-card-text>
    <v-card-subtitle>
      <div class="d-flex">
        <rc-dialog width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" text icon>
              <v-icon>{{ mdiInformation }}</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title> 其他说明 </v-card-title>
            <v-card-text>
              <div v-html="tip.extra"></div>
            </v-card-text>
          </v-card>
        </rc-dialog>
        <div class="d-flex flex-column align-end" style="width: 100%">
          <a :href="tip.link" target="_blank" style="color: white">
            {{ tip.title }}
          </a>
          <div>
            {{ tip.author }}
          </div>
        </div>
      </div>
    </v-card-subtitle>
  </div>
</template>

<script>
import { mdiInformation } from '@mdi/js'
import RcDialog from '@/components/basic/RcDialog'

export default {
  name: 'OceanFishingBlueFishTip',
  components: { RcDialog },
  props: {
    fishId: {
      //currentTipBlueFishList[index]._id
      type: Number,
      default: 0,
    },
    tip: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      mdiInformation,
    }
  },
}
</script>

<style scoped></style>
