<template>
  <v-row no-gutters class="pt-2">
    <v-col cols="12">
      <div
        class="d-flex"
        style="height: 100%; width: 100%; align-items: center; flex-direction: row"
      >
        <div class="d-flex align-center flex-column">
          <toggle-button
            :value="fish.pinned"
            @input="setPinned($event)"
            :checked-icon="mdiPin"
            :unchecked-icon="mdiPinOutline"
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
              :names="fish.names"
              mode="fish"
            >
              <v-hover v-slot="{ hover }">
                <div
                  :class="
                    `text-h5 ${locale}-font ${
                      hover ? 'info--text text-decoration-underline' : ''
                    }`
                  "
                  style="cursor: pointer"
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
                <v-icon>{{ mdiContentCopy }}</v-icon>
              </v-btn>
            </click-helper>
            <toggle-button
              v-if="fish.setNotificationAvailable"
              :value="fish.toBeNotified"
              :title="$t('list.item.notificationHint')"
              @input="setToBeNotified($event)"
              :checked-icon="mdiBell"
              :unchecked-icon="mdiBellOutline"
            />
            <v-spacer />
            <div v-if="fish.hasTasks" class="ml-2">
              <v-icon title="含有任务及其他信息（默认在此窗口最下方）">
                {{ mdiAlertCircleOutline }}
              </v-icon>
            </div>
            <div
              v-if="fish.folklore"
              :data-ck-item-id="
                toItemIdIfExisted(fish.folklore.itemId, fish.folklore.name)
              "
              class="ml-2"
            >
              <v-icon :title="fish.folklore.name">{{ mdiBookOpenVariant }}</v-icon>
            </div>
            <div v-if="fish.aquarium" class="ml-2" style="padding-top: 2px">
              <v-icon :title="`[${fish.aquarium.size}] ${fish.aquarium.water}`">
                {{ mdiFishbowl }}
              </v-icon>
            </div>
            <div v-if="fish.collectable" class="ml-2">
              <i class="xiv collectables" style="font-size: 22px" title="收藏品" />
            </div>
          </div>
        </div>
        <v-spacer />
        <v-btn v-if="showClose" @click="$emit('close')" plain icon>
          <v-icon dark>{{ mdiClose }}</v-icon>
        </v-btn>
      </div>
    </v-col>
    <v-col cols="12">
      <v-menu
        v-if="fishingSpotToShow && showSpotButton"
        :disabled="fishingSpotsInMenu.length === 0"
        open-on-hover
        open-delay="300"
        close-deplay="300"
        bottom
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            color="info"
            block
            tile
            @click="showSpot(fishingSpotToShow)"
            title="点击显示钓场"
          >
            <v-icon left>{{ mdiNotebook }}</v-icon>
            {{ fishingSpotToShow.fishingSpotName }}
            <v-icon right v-if="fishingSpotsInMenu.length > 0">{{ mdiMenuDown }}</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item
            v-for="(spot, index) in fishingSpotsInMenu"
            :key="index"
            @click="showSpot(spot)"
          >
            <v-list-item-content>
              {{ spot.fishingSpotName }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import {
  mdiAlertCircleOutline,
  mdiBell,
  mdiBellOutline,
  mdiBookOpenVariant,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiClose,
  mdiContentCopy,
  mdiFishbowl,
  mdiMenuDown,
  mdiNotebook,
  mdiPin,
  mdiPinOutline,
} from '@mdi/js'

import { SystemInfo } from 'Data/version'
import { mapGetters, mapMutations, mapState } from 'vuex'
import ClickHelper from '@/components/basic/ClickHelper'
import DataUtil from '@/utils/DataUtil'
import EnvMixin from '@/components/basic/EnvMixin'
import FIX from 'Data/fix'
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
    fishingSpots: {
      type: Array,
      default: () => [],
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
    showSpotButton: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mdiPinOutline,
    mdiPin,
    mdiFishbowl,
    mdiClose,
    mdiNotebook,
    mdiMenuDown,
    mdiBookOpenVariant,
    mdiAlertCircleOutline,
    mdiBell,
    mdiCheckboxBlankOutline,
    mdiCheckboxMarked,
    mdiContentCopy,
    mdiBellOutline,
    weatherChangeTrigger: 0,
    locale: SystemInfo.dataLocale,
  }),
  computed: {
    fishingSpotToShow() {
      return this.fishingSpots?.[0]
    },
    fishingSpotsInMenu() {
      return this.fishingSpots?.length > 1 ? this.fishingSpots.slice(1) : []
    },
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
        names: DataUtil.getItemNames(fish._id),
        patch: fish.patch,
        patchText: DataUtil.toPatchText(fish.patch),
        isFuturePatch: false, // fish.patch > DataUtil.PATCH_AVAILABLE_MAX,
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
    showSpot(spot) {
      this.$emit('show-spot', spot.fishingSpotId)
    },
    toItemTitle: DataUtil.toItemTitle,
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
    ...mapMutations(['setFishCompleted', 'setFishPinned', 'setFishToBeNotified']),
  },
}
</script>

<style scoped></style>
