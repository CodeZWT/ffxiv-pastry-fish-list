<template>
  <v-tooltip
    :top="top"
    :right="rightAsDefault"
    :bottom="bottom"
    :left="left"
    :tag="tag"
    :color="color"
    :max-width="maxWidth"
    :disabled="disabled"
  >
    <template v-slot:activator="{ on, attrs }">
      <div
        v-on="on"
        v-bind="attrs"
        style="width: fit-content; height: fit-content"
        :class="className"
      >
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
    className: {
      default: undefined,
    },
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
    disabled: {
      type: Boolean,
      default: false,
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
