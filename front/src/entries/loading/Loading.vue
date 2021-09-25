<template>
  <v-app>
    <v-main>
      <div class="d-flex align-center justify-center fill-height">
        <v-card
          outlined
          class="d-flex justify-center align-center flex-column pa-4 elevation-12"
        >
          <div class="d-flex flex-column align-center">
            <v-img :src="loadingPic" :width="240" :aspect-ratio="1" />
            <v-badge :content="version" class="px-1 my-2" inline />
            <div class="d-flex">
              <div class="mr-2">鱼糕咬钩中</div>
              <v-progress-circular indeterminate size="24" />
            </div>
          </div>
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { version } from '../../../package.json'
import loadingPic from 'Assets/pastry-fish-loading.gif'

export default {
  name: 'Loading',
  data() {
    return {
      version: version,
      loadingPic: loadingPic,
    }
  },
}
</script>

<style>
.v-application {
  background-color: #ffffff00 !important;
}

/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}
</style>
