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
        <gif-loader :src="fish.gif" :cover-src="fish.cover" />
        <div style="position: absolute; right: 0; bottom: 0" v-if="hover && !isMobile">
          <v-chip
            class="rounded-tl-xl rounded-bl-0 rounded-r-0"
            @click="showExpandedDialog = true"
            style="z-index: 5"
          >
            <v-icon>
              mdi-arrow-expand-all
            </v-icon>
          </v-chip>
        </div>
      </v-card>
    </v-hover>
    <v-dialog v-model="showExpandedDialog" max-width="800">
      <gif-loader :src="fish.gif" :cover-src="fish.cover" />
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
