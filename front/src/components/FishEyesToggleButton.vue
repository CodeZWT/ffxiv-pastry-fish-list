<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on" class="d-flex align-center">
        <toggle-button
          :value="value"
          @input="$emit('input')"
          :checked-icon="mdiEye"
          :unchecked-icon="mdiEyeOff"
          :checked-title="$t('toolbar.fishEyes.checkedTitle')"
          :unchecked-title="$t('toolbar.fishEyes.uncheckedTitle')"
        />
        <div v-if="showTitle">
          {{
            value
              ? $t('toolbar.fishEyes.checkedTitle')
              : $t('toolbar.fishEyes.uncheckedTitle')
          }}
        </div>
      </div>
    </template>
    <div style="max-width: 300px">
      <div class="mb-1">
        <item-icon :icon-class="iconIdToClass(1112)" small class="float-left" />
        <div>
          鱼眼技能在
          <strong>5.4</strong>
          版本的效果更新为，无视时间条件，持续时间60s，消耗GP550。
          <span>
            {{
              isGlobal
                ? '对出海垂钓/钓场之皇/暗影篇之后(包括5.X)的鱼'
                : '对出海垂钓/钓场之皇/红莲篇之后(包括4.X)的鱼'
            }}
          </span>
          <span class="font-weight-bold">无效</span>。
        </div>
      </div>
      <div>鱼糕在开启鱼眼功能后，对可用范围内的鱼会无视时间要求进行计算。</div>
    </div>
  </v-tooltip>
</template>

<script>
import { SystemInfo } from 'Data/version'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import ToggleButton from '@/components/basic/ToggleButton'

export default {
  name: 'FishEyesToggleButton',
  components: { ToggleButton, ItemIcon },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiEye,
      mdiEyeOff,
    }
  },
  computed: {
    isGlobal() {
      return SystemInfo.region === 'Global'
    },
  },
  methods: {
    iconIdToClass: DataUtil.iconIdToClass,
  },
}
</script>

<style scoped></style>
