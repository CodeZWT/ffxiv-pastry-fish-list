<template>
  <div style="position: absolute; top: 0; left: 0;" @click.stop="toggleValue">
    <v-hover v-slot:default="{ hover }" open-delay="200">
      <div v-if="value">
        <div :class="{ 'triangle-pinned': !hover, 'triangle-pinned-hover': hover }" />
        <v-icon class="icon-pinned" color="white" small>mdi-pin</v-icon>
      </div>
      <div v-else>
        <div :class="{ 'triangle-unpinned': !hover, 'triangle-unpinned-hover': hover }" />
        <v-icon class="icon-unpinned" small>mdi-pin-outline</v-icon>
      </div>
    </v-hover>
  </div>
</template>

<script>
export default {
  name: 'PinButton',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleValue() {
      this.$emit('input', !this.value)
    },
  },
}
</script>

<style scoped>
.icon-unpinned {
  transform: rotate(-45deg);
  margin-left: 2px;
  margin-top: 2px;
}

.triangle-unpinned {
  width: 0;
  height: 0;
  position: absolute;
}

.triangle-unpinned-hover {
  width: 0;
  height: 0;
  position: absolute;
  border-top: 35px solid #fafafa;
  border-right: 35px solid transparent;
  opacity: 0.5;
}

.icon-pinned {
  transform: rotate(-45deg);
  margin-left: 2px;
  margin-top: 2px;
}

.triangle-pinned {
  width: 0;
  height: 0;
  position: absolute;
  border-top: 35px solid #CE93D8;
  border-right: 35px solid transparent;
}

.triangle-pinned-hover {
  width: 0;
  height: 0;
  position: absolute;
  border-top: 35px solid #CE93D8;
  border-right: 35px solid transparent;
  opacity: 0.5;
}
</style>
