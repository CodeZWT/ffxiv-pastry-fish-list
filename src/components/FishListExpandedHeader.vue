<template>
  <div class="d-flex justify-center align-content-center">
    <v-col cols="6">
      <div class="d-flex" style="height: 100%; width: 100%; align-items: center; flex-direction: row">
        <toggle-button :value="fish.completed" @input="setCompleted($event)" />
        <toggle-button
          :value="fish.pinned"
          checked-icon="mdi-pin"
          unchecked-icon="mdi-pin-outline"
          @input="setPinned($event)"
        />
        <div class="mr-1">
          <v-img :lazy-src="fisher" width="40" height="40" :src="fish.icon" />
        </div>
        <div class="text-subtitle-1" :title="fish.id">
          {{ fish.name }}

          <v-btn text icon x-small @click.stop="copyToClipboard(fish.name)" title="拷贝名称">
            <v-icon x-small>mdi-content-copy</v-icon>
          </v-btn>
          <v-btn text icon x-small @click.stop="goToFishAngelPage(fish.anglerFishId)">
            <v-icon x-small>mdi-link-variant</v-icon>
          </v-btn>
        </div>
      </div>
    </v-col>
    <v-col cols="6" style="display: flex; flex-direction: row; justify-content: space-around; align-items: center">
      <div class="text-subtitle-1">
        {{ fish.zone }}
      </div>
      <div v-if="fish.zone !== fish.fishingSpot" class="text-subtitle-1" :title="fish.fishingSpotId">
        {{ fish.fishingSpot }}
      </div>
      <div>
        <v-btn class="ma-2" text icon x-small @click.stop="goToFishingSpotAngelPage(fish.anglerLocationId)">
          <v-icon x-small>mdi-link-variant</v-icon>
        </v-btn>
      </div>
    </v-col>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import fisher from '@/assets/fisher.png'
import copy from 'clipboard-copy'
import ToggleButton from '@/components/basic/ToggleButton'

export default {
  name: 'FishListExpandedHeader',
  components: { ToggleButton },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    weatherChangeTrigger: 0,
    fisher: fisher,
  }),
  computed: {
    fish() {
      return {
        id: this.value._id,
        completed: this.getFishCompleted(this.value._id),
        pinned: this.getFishPinned(this.value._id),
        icon: this.getItemIconUrl(this.value._id),
        name: this.getItemName(this.value._id),
        zone: this.getZoneName(this.value.location),
        fishingSpot: this.getFishingSpotsName(this.value.location),
        fishingSpotId: this.value.location,
        anglerFishId: this.value.anglerFishId,
        anglerLocationId: this.getFishingSpot(this.value.location).anglerLocationId,
      }
    },
    ...mapGetters([
      'getItemIconUrl',
      'getItemName',
      'getZoneName',
      'getFishingSpotsName',
      'getFishingSpot',
      'getFishCompleted',
      'getFishPinned',
    ]),
  },
  methods: {
    goToFishingSpotAngelPage(anglerLocationId) {
      window.open(`https://cn.ff14angler.com/?spot=${anglerLocationId}`)
    },
    goToFishAngelPage(anglerFishId) {
      window.open(`https://cn.ff14angler.com/fish/${anglerFishId}`)
    },
    copyToClipboard(text) {
      copy(text)
    },
    setCompleted(completed) {
      this.setFishCompleted({ fishId: this.fish.id, completed })
    },

    setPinned(pinned) {
      this.setFishPinned({ fishId: this.fish.id, pinned })
    },
    ...mapMutations(['setFishCompleted', 'setFishPinned']),
  },
}
</script>

<style scoped></style>
