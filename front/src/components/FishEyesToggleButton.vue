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
        <template v-if="showTitle">
          <div v-if="value">
            {{ $t('toolbar.fishEyes.checkedTitle') }}
          </div>
          <div v-else>{{ $t('toolbar.fishEyes.uncheckedTitle') }}</div>
        </template>
      </div>
    </template>
    <div style="max-width: 300px">
      <div class="mb-1">
        <item-icon :icon-class="iconIdToClass(1112)" small class="float-left" />
        <div>
          <div>{{ $t('toolbar.fishEyes.description.skill') }}</div>
          <div v-if="isGlobal">{{ $t('toolbar.fishEyes.description.rangeCN') }}</div>
          <div v-else>{{ $t('toolbar.fishEyes.description.rangeGlobal') }}</div>
          <div>{{ $t('toolbar.fishEyes.description.calculation') }}</div>
        </div>
      </div>
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
