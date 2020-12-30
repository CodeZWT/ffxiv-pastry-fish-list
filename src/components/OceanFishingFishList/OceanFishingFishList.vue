<template>
  <v-data-table
    :headers="oceanFishingHeaders"
    :items="transformFishList"
    class="elevation-4 mt-2 ml-2"
    hide-default-footer
  >
    <template v-slot:item.name="{ item }">
      <div class="d-flex align-center">
        <toggle-button :value="item.completed" @input="setCompleted(item.id, $event)" />
        <item-icon :icon-class="item.icon" :title="item.name" />
        <div>{{ item.name }}</div>
      </div>
    </template>
    <template v-slot:item.bait="{ item }">
      <div class="d-flex align-center">
        <item-icon :icon-class="item.bait.icon" :title="item.bait.name" />
        <!--        <div>{{ item.bait.name }}</div>-->
        <template v-if="item.baitExtra">
          <div>或</div>
          <item-icon :icon-class="item.baitExtra.icon" :title="item.baitExtra.name" />
          <!--          <div>{{ item.baitExtra.name }}</div>-->
        </template>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
import { mapGetters, mapMutations } from 'vuex'
import ToggleButton from '@/components/basic/ToggleButton'
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
          align: 'start',
          sortable: true,
          value: 'bait',
        },
      ],
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
