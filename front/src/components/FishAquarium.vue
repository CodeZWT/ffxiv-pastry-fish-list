<template>
  <v-card class="rounded-xl" elevation="8" style="overflow: hidden">
    <v-card-text>
      <div class="d-flex align-center">
        <item-icon :icon-class="fish.icon" />
        <div>
          <div class="d-flex">
            <div>{{ fish.name }}</div>
            <v-badge
              v-if="fish.available === 1"
              color="primary"
              inline
              content="新"
            ></v-badge>
            <v-badge
              v-if="fish.available === 2"
              color="error"
              inline
              content="未实装"
            ></v-badge>
          </div>
          <v-badge :content="fish.patch" inline></v-badge>
        </div>
        <v-spacer />
        <div>
          <div class="d-flex flex-column align-end">
            <div>{{ fish.size }}</div>
            <div>{{ fish.water }}</div>
          </div>
        </div>
      </div>
    </v-card-text>
    <gif-loader :src="fish.gif" :cover-src="fish.cover" />
  </v-card>
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
import GifLoader from '@/components/basic/GifLoader'
export default {
  name: 'FishAquarium',
  components: { ItemIcon, GifLoader },
  props: {
    fish: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style scoped></style>
