<template>
  <div style="width: 100%" class="py-4 px-2">
    <div
      style="position: absolute; top: 10%; bottom: 10%; left: 2px; width: 4px; z-index: 1;border-radius: 2px"
    />
    <v-row no-gutters>
      <div
        class="d-flex"
        style="height: 100%; width: 100%; align-items: center; flex-direction: row"
      >
        <div class="d-flex align-center flex-column">
          <toggle-button
            :value="fish.pinned"
            @input="setPinned($event)"
            checked-icon="mdi-pin"
            unchecked-icon="mdi-pin-outline"
          />
          <toggle-button :value="fish.completed" @input="setCompleted($event)" />
        </div>
        <item-icon :icon-class="fish.icon" />
        <link-list
          :id="fish.id"
          :angler-id="fish.anglerFishId"
          :name="fish.name"
          mode="item"
        >
          <v-hover v-slot="{ hover }">
            <div
              :class="
                `text-subtitle-1 ${hover ? 'info--text text-decoration-underline' : ''}`
              "
            >
              {{ fish.name }}
            </div>
          </v-hover>
        </link-list>
        <v-badge
          inline
          :color="fish.isFuturePatch ? 'grey' : 'primary'"
          :content="fish.patchText"
          :title="fish.isFuturePatch ? '未实装' : ''"
        ></v-badge>
        <click-helper @click.stop :copy-text="fish.name">
          <v-btn text icon :title="$t('list.item.copyHint')">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </click-helper>
        <click-helper @click.stop="goToFishAngelPage(fish.anglerFishId, fish.name)">
          <v-btn text icon :title="$t('list.item.linkHint')">
            <v-icon>mdi-link-variant</v-icon>
          </v-btn>
        </click-helper>
        <div
          v-if="fish.folklore"
          :data-ck-item-id="toItemIdIfExisted(fish.folklore.itemId, fish.folklore.name)"
          class="mr-2"
        >
          <v-icon :title="fish.folklore.name">mdi-book-open-variant</v-icon>
        </div>
        <div v-if="fish.collectable">
          <i class="xiv collectables" title="收藏品" />
        </div>
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
import { mapGetters, mapMutations, mapState } from 'vuex'
import ToggleButton from '@/components/basic/ToggleButton'
import ClickHelper from '@/components/basic/ClickHelper'
import DataUtil from '@/utils/DataUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import LinkList from '@/components/basic/LinkList'

export default {
  name: 'FishListExpandedHeader',
  components: { LinkList, ItemIcon, ClickHelper, ToggleButton },
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
  }),
  computed: {
    fish() {
      const folklore = this.value.folklore && this.folklore[this.value.folklore]
      return {
        id: this.value._id,
        completed: this.getFishCompleted(this.value._id),
        pinned: this.getFishPinned(this.value._id),
        toBeNotified: this.getFishToBeNotified(this.value._id),
        icon: this.getItemIconClass(this.value._id),
        name: this.getItemName(this.value._id),
        patch: this.value.patch,
        patchText:
          this.value.patch.toString().indexOf('.') !== -1
            ? this.value.patch.toString()
            : this.value.patch.toFixed(1),
        isFuturePatch: this.value.patch > DataUtil.PATCH_AVAILABLE_MAX,
        folklore: folklore && {
          id: folklore._id,
          itemId: folklore.itemId,
          name: this.getItemName(folklore.itemId),
          icon: this.getItemIconClass(folklore.itemId),
        },
        collectable: this.value.collectable,
        anglerFishId: this.value.anglerFishId,
        setNotificationAvailable: DataUtil.hasCountDown(this.fishTimePart?.countDown),
      }
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    ...mapState(['folklore']),
    ...mapGetters([
      'getItemIconClass',
      'getItemName',
      'getFishCompleted',
      'getFishPinned',
      'getFishToBeNotified',
    ]),
  },
  methods: {
    toItemTitle: DataUtil.toItemTitle,
    goToFishAngelPage(angelId, name) {
      DataUtil.goToFishAngelPage(angelId, name, this.isMobile, this.showSnackbar)
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
    toItemIdIfExisted: DataUtil.toItemIdIfExisted,
    ...mapMutations([
      'setFishCompleted',
      'setFishPinned',
      'showSnackbar',
      'setFishToBeNotified',
    ]),
  },
}
</script>

<style scoped></style>
