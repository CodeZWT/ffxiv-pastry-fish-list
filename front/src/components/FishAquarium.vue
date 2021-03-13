<template>
  <div>
    <v-hover v-slot="{ hover }" open-delay="200" close-deplay="300">
      <v-card class="rounded-b-xl rounded-t-l" elevation="8" style="overflow: hidden">
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
        <v-carousel
          v-if="fish.sizeId === 1"
          hide-delimiter-background
          show-arrows-on-hover
          v-model="currentIndex"
          height="175"
        >
          <v-carousel-item v-for="(image, i) in fish.images" :key="i">
            <gif-loader :src="image.gif" :cover-src="image.cover" :height="175" />
          </v-carousel-item>
        </v-carousel>
        <gif-loader
          v-else
          :src="fish.images[0].gif"
          :cover-src="fish.images[0].cover"
          :height="175"
        />

        <div style="position: absolute; right: 0; bottom: 0" v-if="hover && !isMobile">
          <v-chip
            class="rounded-tl-xl rounded-bl-0 rounded-r-0"
            @click="showExpandedDialog = true"
            style="z-index: 5"
          >
            <v-icon> mdi-arrow-expand-all </v-icon>
          </v-chip>
        </div>
      </v-card>
    </v-hover>
    <v-dialog
      v-model="showExpandedDialog"
      max-width="800"
      :height="400"
      :width="fish.sizeId === 1 && currentIndex === 0 ? 400 : undefined"
    >
      <div class="rounded-xl overflow-hidden">
        <gif-loader
          :src="fish.images[fish.sizeId === 1 ? currentIndex : 0].gif"
          :cover-src="fish.images[fish.sizeId === 1 ? currentIndex : 0].cover"
        />
      </div>
    </v-dialog>
  </div>
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
  data() {
    return {
      currentIndex: 0,
      showExpandedDialog: false,
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
  },
}
</script>

<style scoped></style>
