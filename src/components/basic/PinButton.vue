<template>
  <div style="position: absolute; top: 0; left: 0;" @click.stop="toggleValue">
    <v-hover v-slot:default="{ hover }" open-delay="200">
      <div v-if="value">
        <div class="triangle-pinned" />
        <v-icon class="icon-pinned" color="white">mdi-pin</v-icon>
      </div>
      <div v-else>
        <div :class="{ 'triangle-unpinned': !hover, 'triangle-unpinned-hover': hover }" />
        <v-icon class="icon-unpinned">mdi-pin-outline</v-icon>
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
  border-top: 40px solid white;
  border-right: 40px solid transparent;
}

.triangle-unpinned-hover {
  width: 0;
  height: 0;
  position: absolute;
  border-top: 40px solid rgb(220, 220, 220);
  border-right: 40px solid transparent;
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
  border-top: 40px solid #1976d2;
  border-right: 40px solid transparent;
}
</style>