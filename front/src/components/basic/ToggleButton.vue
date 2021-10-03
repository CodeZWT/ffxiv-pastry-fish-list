<template>
  <click-helper @click.stop="toggleValue">
    <v-btn icon text :small="small" :title="value ? checkedTitle : uncheckedTitle">
      <new-feature-mark :id="featureId">
        <v-icon :small="small">{{ value ? checkedIcon : uncheckedIcon }}</v-icon>
      </new-feature-mark>
    </v-btn>
  </click-helper>
</template>

<script>
import { mapMutations } from 'vuex'
import ClickHelper from '@/components/basic/ClickHelper'
import NewFeatureMark from '@/components/basic/NewFeatureMark'

export default {
  name: 'ToggleButton',
  components: { NewFeatureMark, ClickHelper },
  props: {
    featureId: {
      type: String,
      default: undefined,
    },
    value: {
      type: Boolean,
      default: false,
    },
    checkedIcon: {
      type: String,
      default: 'mdi-checkbox-marked',
    },
    uncheckedIcon: {
      type: String,
      default: 'mdi-checkbox-blank-outline',
    },
    small: {
      type: Boolean,
      default: false,
    },
    checkedTitle: {
      type: String,
      default: undefined,
    },
    uncheckedTitle: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    toggleValue() {
      if (this.featureId) {
        this.setFeatureViewed(this.featureId)
      }
      this.$emit('input', !this.value)
    },
    ...mapMutations(['setFeatureViewed']),
  },
}
</script>

<style scoped></style>
