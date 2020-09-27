<template>
  <div style="width: 100%">
    <pin-button :value="fish.pinned" @input="setPinned($event)" />
    <v-row no-gutters>
      <div class="d-flex" style="height: 100%; width: 100%; align-items: center; flex-direction: row">
        <toggle-button :value="fish.completed" @input="setCompleted($event)" />
        <div class="mr-1">
          <div :class="fish.icon" />
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
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import fisher from '@/assets/fisher.png'
import copy from 'clipboard-copy'
import ToggleButton from '@/components/basic/ToggleButton'
import PinButton from '@/components/basic/PinButton'

export default {
  name: 'FishListExpandedHeader',
  components: { PinButton, ToggleButton },
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
        icon: this.getItemIconClass(this.value._id),
        name: this.getItemName(this.value._id),
        zone: this.getZoneName(this.value.location),
        fishingSpot: this.getFishingSpotsName(this.value.location),
        fishingSpotId: this.value.location,
        anglerFishId: this.value.anglerFishId,
        anglerLocationId: this.getFishingSpot(this.value.location).anglerLocationId,
      }
    },
    ...mapGetters([
      'getItemIconClass',
      'getItemName',
      'getZoneName',
      'getFishingSpotsName',
      'getFishingSpot',
      'getFishCompleted',
      'getFishPinned',
    ]),
  },
  methods: {
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
