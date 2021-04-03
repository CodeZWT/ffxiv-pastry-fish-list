<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on" class="d-flex align-center">
        <toggle-button
          :value="value"
          @input="$emit('input')"
          checked-icon="mdi-eye"
          unchecked-icon="mdi-eye-off"
          checked-title="点击关闭鱼眼模式"
          unchecked-title="点击开启鱼眼模式"
        />
        <div v-if="showTitle">
          {{ value ? '点击关闭鱼眼模式' : '点击开启鱼眼模式' }}
        </div>
      </div>
    </template>
    <div style="max-width: 300px">
      <div class="mb-1">
        <item-icon icon-class="bg-001112" small class="float-left" />
        <div>
          鱼眼技能在
          <strong>5.4</strong>
          版本的效果更新为，无视时间条件，持续时间60s，消耗GP550。
          对出海垂钓/钓场之皇/红莲篇之后(包括4.X)的鱼
          <span class="font-weight-bold">无效</span>。
        </div>
      </div>
      <div>鱼糕在开启鱼眼功能后，对可用范围内的鱼会无视时间要求进行计算。</div>
    </div>
  </v-tooltip>
</template>

<script>
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
}
</script>

<style scoped></style>
