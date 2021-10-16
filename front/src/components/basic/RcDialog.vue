<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    :max-width="maxWidth"
    :scrollable="scrollable"
  >
    <slot></slot>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
import { v4 as uuid } from 'uuid'
export default {
  name: 'RcDialog',
  props: {
    value: {
      type: Boolean,
    },
    scrollable: {
      type: Boolean,
    },
    maxWidth: {
      type: String,
    },
  },
  data() {
    return {
      dialogId: uuid(),
    }
  },
  watch: {
    value: {
      handler(newValue) {
        if (newValue) {
          this.registerDialog(this.dialogId)
        } else {
          this.unRegisterDialog(this.dialogId)
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('screenWindow', ['registerDialog', 'unRegisterDialog']),
  },
}
</script>

<style scoped></style>
