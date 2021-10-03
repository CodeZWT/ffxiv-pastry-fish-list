<template>
  <div style="width: 100%" class="pr-2 pt-2">
    <div
      style="
        position: absolute;
        top: 10%;
        bottom: 10%;
        left: 2px;
        width: 4px;
        z-index: 1;
        border-radius: 2px;
      "
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
            :checked-title="$t('actions.pin.checked')"
            :unchecked-title="$t('actions.pin.unchecked')"
          />
          <toggle-button
            :value="fish.completed"
            @input="setCompleted($event)"
            :checked-title="$t('actions.completed.checked')"
            :unchecked-title="$t('actions.completed.unchecked')"
          />
        </div>
        <item-icon :icon-class="fish.icon" large />
        <div>
          <div class="d-flex align-center">
            <link-list
              :id="fish.id"
              :angler-id="fish.anglerFishId"
              :name="fish.name"
              mode="item"
            >
              <v-hover v-slot="{ hover }">
                <div
                  :class="
                    `text-subtitle-1 ${
                      hover ? 'info--text text-decoration-underline' : ''
                    }`
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
          </div>
          <div class="d-flex align-center">
            <click-helper @click.stop :copy-text="fish.name">
              <v-btn text icon :title="$t('list.item.copyHint')">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </click-helper>
            <toggle-button
              v-if="fish.setNotificationAvailable"
              :value="fish.toBeNotified"
              :title="$t('list.item.notificationHint')"
              @input="setToBeNotified($event)"
              checked-icon="mdi-bell"
              unchecked-icon="mdi-bell-outline"
            />
            <div v-if="fish.hasTasks" class="mr-2">
              <v-icon title="含有任务及其他信息（默认在此窗口最下方）">
                mdi-alert-circle-outline
              </v-icon>
            </div>
            <div
              v-if="fish.folklore"
              :data-ck-item-id="
                toItemIdIfExisted(fish.folklore.itemId, fish.folklore.name)
              "
              class="mr-2"
            >
              <v-icon :title="fish.folklore.name">mdi-book-open-variant</v-icon>
            </div>
            <div v-if="fish.aquarium" class="mr-2">
              <v-icon :title="`[${fish.aquarium.size}] ${fish.aquarium.water}`">
                mdi-fishbowl
              </v-icon>
            </div>
            <div v-if="fish.collectable">
              <i class="xiv collectables" title="收藏品" />
            </div>
          </div>
        </div>
        <v-spacer />
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
import ClickHelper from '@/components/basic/ClickHelper'
import DataUtil from '@/utils/DataUtil'
import EnvMixin from '@/components/basic/EnvMixin'
import FIX from '../../../data/fix'
import ItemIcon from '@/components/basic/ItemIcon'
import LinkList from '@/components/basic/LinkList'
import ToggleButton from '@/components/basic/ToggleButton'

export default {
  name: 'FishListExpandedHeader',
  mixins: [EnvMixin],
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
      const fish = this.value
      const folklore = fish.folklore && this.folklore[fish.folklore]
      const aquariumFish = FIX.AQUARIUMS[DataUtil.toItemId(fish._id)]
      return {
        id: fish._id,
        completed: this.getFishCompleted(fish._id),
        pinned: this.getFishPinned(fish._id),
        toBeNotified: this.getFishToBeNotified(fish._id),
        icon: this.getItemIconClass(fish._id),
        name: this.getItemName(fish._id),
        patch: fish.patch,
        patchText: DataUtil.toPatchText(fish.patch),
        isFuturePatch: fish.patch > DataUtil.PATCH_AVAILABLE_MAX,
        folklore: folklore && {
          id: folklore._id,
          itemId: folklore.itemId,
          name: this.getItemName(folklore.itemId),
          icon: this.getItemIconClass(folklore.itemId),
        },
        collectable: fish.collectable,
        anglerFishId: fish.anglerFishId,
        setNotificationAvailable: DataUtil.hasCountDown(this.fishTimePart?.countDown),
        aquarium: !!aquariumFish && {
          size: FIX.AQUARIUM_FISH_SIZE[aquariumFish.size].size,
          water: DataUtil.getName(FIX.AQUARIUM_WATER[aquariumFish.aquariumWater]),
        },
        hasTasks:
          Object.values(FIX.QUEST).filter(task => task.items.includes(fish._id)).length >
          0,
      }
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
