<template>
  <v-tooltip
    :top="top"
    :right="rightAsDefault"
    :bottom="bottom"
    :left="left"
    :tag="tag"
    :color="color"
    :max-width="maxWidth"
  >
    <template v-slot:activator="{ on, attrs }">
      <div v-on="on" v-bind="attrs" style="width: fit-content; height: fit-content">
        <slot></slot>
      </div>
    </template>
    <slot name="msg">
      {{ message }}
    </slot>
  </v-tooltip>
</template>

<script>
export default {
  name: 'RcTooltip',
  props: {
    maxWidth: {
      type: [Number, String],
      default: 'auto',
    },
    message: {
      type: String,
      default: '',
    },
    top: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: 'div',
    },
    color: {
      type: String,
      default: 'default',
    },
  },
  computed: {
    rightAsDefault() {
      return this.right || (!this.top && !this.bottom && !this.left)
    },
  },
}
</script>

<style scoped></style>
