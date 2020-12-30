<template>
  <v-data-table
    :headers="oceanFishingHeaders"
    :items="transformFishList"
    class="elevation-4 mt-2 ml-2"
    hide-default-footer
    multi-sort
  >
    <template v-slot:item.name="{ item }">
      <div class="d-flex align-center">
        <toggle-button :value="item.completed" @input="setCompleted(item.id, $event)" />
        <item-icon :icon-class="item.icon" :title="item.name" />
        <div>{{ item.name }}</div>
      </div>
    </template>
    <template v-slot:item.baitId="{ item }">
      <div class="d-flex align-center justify-center">
        <item-icon :icon-class="item.bait.icon" :title="item.bait.name" />
        <!--        <div>{{ item.bait.name }}</div>-->
        <template v-if="item.baitExtra">
          <div>或</div>
          <item-icon :icon-class="item.baitExtra.icon" :title="item.baitExtra.name" />
          <!--          <div>{{ item.baitExtra.name }}</div>-->
        </template>
      </div>
    </template>
    <template v-slot:item.tug="{ item }">
      <div class="d-flex align-center justify-center">
        <v-badge
          v-show="item.tug != null"
          :color="TUG_ICON_COLOR[item.tugIcon]"
          :content="item.tugIcon"
          inline
        />
      </div>
    </template>
  </v-data-table>
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
import { mapGetters, mapMutations } from 'vuex'
import ToggleButton from '@/components/basic/ToggleButton'
import DataUtil from '@/utils/DataUtil'
export default {
  name: 'OceanFishingFishList',
  components: { ToggleButton, ItemIcon },
  props: {
    fishList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      oceanFishingHeaders: [
        {
          text: '名称',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: '鱼饵',
          align: 'center',
          sortable: true,
          value: 'baitId',
        },
        {
          text: '杆型',
          align: 'center',
          sortable: true,
          value: 'tug',
        },
      ],
      TUG_ICON_COLOR: DataUtil.TUG_ICON_COLOR,
    }
  },
  computed: {
    transformFishList() {
      return this.fishList.map(fish => {
        return {
          completed: this.getFishCompleted(fish.id),
          ...fish,
        }
      })
    },
    ...mapGetters(['getFishCompleted']),
  },
  methods: {
    setCompleted(fishId, completed) {
      this.setFishCompleted({ fishId, completed })
    },
    ...mapMutations(['setFishCompleted']),
  },
}
</script>

<style scoped></style>
