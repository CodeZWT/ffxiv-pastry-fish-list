<template>
  <v-app>
    <v-main>
      <div class="d-flex align-center justify-center fill-height">
        <v-card
          outlined
          class="d-flex justify-center align-center flex-column pa-4 elevation-24"
        >
          <div class="d-flex flex-column align-center">
            <v-avatar>
              <v-img :src="fisher" />
            </v-avatar>
            <v-badge :content="version" class="px-1" inline />
            <div class="d-flex">
              <div class="mr-2">鱼糕烹饪中</div>
              <v-progress-circular indeterminate size="24" />
            </div>
          </div>
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import ImgUtil from '@/utils/ImgUtil'
import { version } from '../../../package.json'

export default {
  name: 'Loading',
  data() {
    return {
      version: version,
      fisher: ImgUtil.getImgUrl('pastry-fish.png'),
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
