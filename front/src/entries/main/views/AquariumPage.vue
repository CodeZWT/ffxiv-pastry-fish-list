<template>
  <v-container
    fluid
    :class="
      `detail-wrapper ${isElectron ? 'detail-wrapper--electron' : 'detail-wrapper--web'}`
    "
  >
    <v-row>
      <v-col cols="4" v-for="fish in aquariumFishList" :key="fish.id">
        <v-lazy
          :options="{
            threshold: 0.5,
          }"
          min-height="240"
          transition="fade-transition"
        >
          <v-card class="rounded-xl" elevation="8" style="overflow: hidden">
            <v-card-text>
              <div class="d-flex align-center">
                <item-icon :icon-class="fish.icon" />
                <div>
                  <div class="d-flex">
                    <div>{{ fish.name }}</div>
                    <v-badge
                      v-if="fish.isNew"
                      color="primary"
                      inline
                      content="新"
                    ></v-badge>
                    <v-badge
                      v-if="fish.isFuture"
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
        </v-lazy>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import { AQUARIUMS, AQUARIUM_FISH_SIZE, AQUARIUM_WATER } from 'Data/fix'
import DataUtil from '@/utils/DataUtil'
import ImgUtil from '@/utils/ImgUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import { OCEAN_FISHING_FISH } from 'Data/fix'
import GifLoader from '@/components/basic/GifLoader'

export default {
  name: 'AquariumPage',
  components: { GifLoader, ItemIcon },
  data() {
    return {
      isElectron: DevelopmentModeUtil.isElectron(),
    }
  },
  computed: {
    aquariumFishList() {
      return Object.values(AQUARIUMS).map(aquarium => {
        const spotFishId =
          DataUtil.FISH_ID_TO_WIKI_IDS[aquarium.id]?.[0]?.split('-')?.[3] ?? aquarium.id
        const fishData = DataUtil.FISH_DATA[spotFishId] ?? OCEAN_FISHING_FISH[aquarium.id]
        return {
          id: aquarium.id,
          name: DataUtil.getItemName(aquarium.id),
          icon: DataUtil.getItemIconClass(aquarium.id),
          patch: DataUtil.toPatchText(fishData?.patch),
          water: DataUtil.getName(AQUARIUM_WATER[aquarium.aquariumWater]),
          size: AQUARIUM_FISH_SIZE[aquarium.size].size,
          gif: ImgUtil.getAquariumImgUrl(`${aquarium.id}.gif`),
          cover: ImgUtil.getAquariumImgUrl(`${aquarium.id}-cover.jpg`),
          isNew: aquarium.patch === DataUtil.PATCH_AVAILABLE_MAX,
          isFuture: aquarium.patch > DataUtil.PATCH_AVAILABLE_MAX,
        }
      })
    },
  },
}
</script>

<style lang="sass" scoped>
@import "~@/styles/RcVariables"

.detail-wrapper
  width: 100%
  height: 100%
  overflow-scrolling: auto
  overflow-y: scroll
  overflow-x: hidden

  &--web
    max-height: calc(100vh - #{ $top-bars-padding + $footer-padding})

  &--electron
    max-height: calc(100vh - #{ $top-bars-padding-electron + $footer-padding})
</style>
