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
          <v-card class="rounded-xl" elevation="8">
            <v-card-text>
              <div class="d-flex align-center">
                <item-icon :icon-class="fish.icon" />
                <div class="d-flex">
                  <div>
                    <div>{{ fish.name }}</div>
                    <v-badge :content="fish.patch" inline></v-badge>
                  </div>
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
            <v-img :src="fish.imageUrl">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
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

export default {
  name: 'AquariumPage',
  components: { ItemIcon },
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
        if (!fishData) {
          console.log('aquarium.id, spotFishId')
        }
        return {
          id: aquarium.id,
          name: DataUtil.getItemName(aquarium.id),
          icon: DataUtil.getItemIconClass(aquarium.id),
          patch: DataUtil.toPatchText(fishData?.patch),
          water: DataUtil.getName(AQUARIUM_WATER[aquarium.aquariumWater]),
          size: AQUARIUM_FISH_SIZE[aquarium.size].size,
          imageUrl: ImgUtil.getAquariumImgUrl(aquarium.id),
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
