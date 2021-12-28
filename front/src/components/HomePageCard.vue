<template>
  <v-card
    outlined
    style="position: relative; cursor: pointer"
    @click="$emit('click', $event)"
  >
    <v-card-title>
      <slot name="title">title</slot>
    </v-card-title>
    <v-card-subtitle>
      <slot name="description">description</slot>
    </v-card-subtitle>
    <v-icon style="position: absolute; right: 4px; bottom: 4px" large>
      {{ mdiArrowRightCircleOutline }}
    </v-icon>
  </v-card>
</template>

<script>
import { mdiArrowRightCircleOutline } from '@mdi/js'

export default {
  name: 'HomePageCard',
  data() {
    return {
      mdiArrowRightCircleOutline,
    }
  },
}
</script>

<style scoped></style>
