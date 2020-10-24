<template>
  <div style="width: 100%" class="py-4 px-2">
    <div
      style="position: absolute; top: 10%; bottom: 10%; left: 2px; width: 4px; z-index: 1;border-radius: 2px"
      :class="color"
    />
    <v-row no-gutters>
      <div class="d-flex" style="height: 100%; width: 100%; align-items: center; flex-direction: row">
        <div class="d-flex align-center flex-column">
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
        <div class="text-subtitle-1 ml-1" :title="fish.name + '#' + fish.id">
          {{ fish.name }}
        </div>
        <v-badge inline color="primary" :content="fish.patch"></v-badge>
        <click-helper @click.stop :copy-text="fish.name">
          <v-btn text icon :title="$t('list.item.copyHint')">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </click-helper>
        <click-helper @click.stop="goToFishAngelPage(fish.anglerFishId)">
          <v-btn text icon :title="$t('list.item.linkHint')">
            <v-icon>mdi-link-variant</v-icon>
          </v-btn>
        </click-helper>
        <v-spacer />
        <toggle-button
          v-if="fish.setNotificationAvailable"
          :value="fish.toBeNotified"
          :title="$t('list.item.notificationHint')"
          @input="setToBeNotified($event)"
          checked-icon="mdi-bell"
          unchecked-icon="mdi-bell-outline"
        />
        <click-helper v-if="showClose" @click="$emit('close')">
          <v-btn elevation="50" fab small>
            <v-icon dark>mdi-close</v-icon>
          </v-btn>
        </click-helper>
      </div>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import fisher from '@/assets/fisher.png'
import ToggleButton from '@/components/basic/ToggleButton'
import ClickHelper from '@/components/basic/ClickHelper'
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'FishListExpandedHeader',
  components: { ClickHelper, ToggleButton },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    fishTimePart: {
      type: Object,
      default: () => ({}),
    },
    color: {
      type: String,
      default: '',
    },
    showClose: {
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
        toBeNotified: this.getFishToBeNotified(this.value._id),
        icon: this.getItemIconClass(this.value._id),
        name: this.getItemName(this.value._id),
        patch: this.value.patch.toFixed(1),
        zone: this.getZoneName(this.value.location),
        fishingSpot: this.getFishingSpotsName(this.value.location),
        fishingSpotId: this.value.location,
        anglerFishId: this.value.anglerFishId,
        anglerLocationId: this.getFishingSpot(this.value.location)?.anglerLocationId,
        setNotificationAvailable: DataUtil.hasCountDown(this.fishTimePart?.countDown),
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
      'getFishToBeNotified',
    ]),
  },
  methods: {
    goToFishAngelPage(anglerFishId) {
      window.open(`https://cn.ff14angler.com/fish/${anglerFishId}`)
    },
    copyToClipboard() {
      // const clipboard = document.getElementById('clipboard')
      // clipboard.value = text
      // clipboard.select()
      // clipboard.setSelectionRange(0, 99999) // For mobile devices
      // document.execCommand('copy')
      // this.showSnackbar({ text: this.$t('importExport.dialog.message.copySuccess'), color: 'success' })
    },
    setCompleted(completed) {
      this.setFishCompleted({ fishId: this.fish.id, completed })
    },

    setPinned(pinned) {
      this.setFishPinned({ fishId: this.fish.id, pinned })
    },

    setToBeNotified(toBeNotified) {
      this.setFishToBeNotified({ fishId: this.fish.id, toBeNotified })
    },
    ...mapMutations(['setFishCompleted', 'setFishPinned', 'showSnackbar', 'setFishToBeNotified']),
  },
}
</script>

<style scoped></style>