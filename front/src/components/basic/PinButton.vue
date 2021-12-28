<template>
  <div style="position: absolute; top: 0; left: 0;" @click.stop="toggleValue">
    <v-hover v-slot:default="{ hover }" open-delay="200">
      <div v-if="value">
        <div :class="{ 'triangle-pinned': !hover, 'triangle-pinned-hover': hover }" />
        <v-icon class="icon-pinned" color="white" small>{{ mdiPin }}</v-icon>
      </div>
      <div v-else>
        <div :class="{ 'triangle-unpinned': !hover, 'triangle-unpinned-hover': hover }" />
        <v-icon class="icon-unpinned" small>{{ mdiPinOutline }}</v-icon>
      </div>
    </v-hover>
  </div>
</template>

<script>
import { mdiPin, mdiPinOutline } from '@mdi/js'

export default {
  name: 'PinButton',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiPin,
      mdiPinOutline,
    }
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
  border-top: 32px solid #fafafa;
  border-right: 32px solid transparent;
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
  border-top: 32px solid #ce93d8;
  border-right: 32px solid transparent;
}

.triangle-pinned-hover {
  width: 0;
  height: 0;
  position: absolute;
  border-top: 32px solid #ce93d8;
  border-right: 32px solid transparent;
  opacity: 0.5;
}
</style>
