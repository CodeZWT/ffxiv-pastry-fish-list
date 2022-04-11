<template>
  <div v-if="tip">
    <div>
      <strong>迷路指南：</strong>{{ tip.tip }}
      <v-btn
        @click="showTipDialog = true"
        left
        small
        tile
        color="info"
        style="display: inline"
      >
        <v-icon small>{{ mdiImageArea }}</v-icon>
        显示钓场位置截图</v-btn
      >
    </div>
    <v-dialog v-model="showTipDialog" scrollable>
      <v-card>
        <v-card-title> 钓场位置截图 </v-card-title>
        <v-card-text>
          <v-img v-if="tip" contain height="100%" :src="tip.screenShootUrl" />
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="showTipDialog = false">
            {{ $t('common.ui.dialog.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiImageArea } from '@mdi/js'
import ImgUtil from '@/utils/ImgUtil'
import spotTip from 'Data/spotTip'

export default {
  name: 'MapSpotTip',
  props: {
    spot: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      mdiImageArea,
      showTipDialog: false,
    }
  },
  computed: {
    tip() {
      const tip = spotTip[this.spot]
      if (tip) {
        return {
          tip: tip.tip.replaceAll(/[\r\n\s]/g, ''),
          screenShootUrl: ImgUtil.getImgUrl(
            tip.screenShot ?? `spot-${this.spot}.webp`,
            ImgUtil.CATEGORY.MAP_SPOT_TIP
          ),
        }
      } else {
        return undefined
      }
    },
  },
}
</script>

<style scoped></style>
