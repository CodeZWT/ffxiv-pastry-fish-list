<template>
  <div style="width: 100%">
    <!--    <pin-button :value="fish.pinned" @input="setPinned($event)" />-->
    <div
      style="position: absolute; top: 10%; bottom: 10%; left: 2px; width: 4px; z-index: 1;border-radius: 2px"
      :class="color"
    />
    <div v-if="showDivider" style="position: absolute; top: 0; width: 100%; height: 2px; z-index: 1" class="tertiary" />
    <v-row no-gutters>
      <div class="d-flex" style="height: 100%; width: 100%; align-items: center; flex-direction: row">
        <div class="d-flex align-center flex-column flex-sm-row">
          <toggle-button
            :value="fish.pinned"
            @input="setPinned($event)"
            checked-icon="mdi-pin"
            unchecked-icon="mdi-pin-outline"
          />
          <toggle-button :value="fish.completed" @input="setCompleted($event)" />
        </div>
        <div>
          <div :class="fish.icon" />
        </div>
        <div class="text-subtitle-1 ml-1" :title="fish.id">
          {{ fish.name }}
          <v-btn text icon small @click.stop="copyToClipboard(fish.name)" title="拷贝名称">
            <v-icon small>mdi-content-copy</v-icon>
          </v-btn>
          <v-btn text icon small @click.stop="goToFishAngelPage(fish.anglerFishId)">
            <v-icon small>mdi-link-variant</v-icon>
          </v-btn>
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import fisher from '@/assets/fisher.png'
import ToggleButton from '@/components/basic/ToggleButton'

export default {
  name: 'FishListExpandedHeader',
  components: { ToggleButton },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    color: {
      type: String,
      default: '',
    },
    showDivider: {
      type: Boolean,
      default: false,
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
      const clipboard = document.getElementById('clipboard')
      clipboard.value = text
      clipboard.select()
      clipboard.setSelectionRange(0, 99999) // For mobile devices
      document.execCommand('copy')
      this.showSnackbar({ text: this.$t('importExport.dialog.message.copySuccess'), color: 'success' })
    },
    setCompleted(completed) {
      this.setFishCompleted({ fishId: this.fish.id, completed })
      this.addScrollRefreshCnt()
    },

    setPinned(pinned) {
      this.setFishPinned({ fishId: this.fish.id, pinned })
      this.addScrollRefreshCnt()
    },
    ...mapMutations(['setFishCompleted', 'setFishPinned', 'showSnackbar']),
  },
}
</script>

<style scoped></style>