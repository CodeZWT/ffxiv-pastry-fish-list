<template>
  <v-data-table :headers="oceanFishingHeaders" :items="fishList" class="elevation-1">
    <template v-slot:item.name="{ item }">
      <div class="d-flex align-center">
        <item-icon :icon-class="item.icon" :title="item.name" />
        <div>{{ item.name }}</div>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
export default {
  name: 'OceanFishingFishList',
  components: { ItemIcon },
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
      ],
    }
  },
}
</script>

<style scoped></style>
