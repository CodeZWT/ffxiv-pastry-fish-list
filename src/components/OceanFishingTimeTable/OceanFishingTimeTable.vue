<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            登船登记时间（本地）
          </th>
          <th class="text-left">
            航线
          </th>
          <th class="text-left">
            目标
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(route, index) in routes" :key="index">
          <td>
            <div class="d-flex">
              <div :style="route.showDay ? '' : 'visibility: hidden'">
                {{ route.day }}
              </div>
              <div class="ml-1">{{ route.time }}</div>
            </div>
          </td>
          <td>
            <div class="d-flex align-center">
              <div>
                {{ route.name }}
              </div>
              <v-icon>
                {{ route.shiftIcon }}
              </v-icon>
            </div>
          </td>
          <td>
            <div class="d-flex align-center">
              <div v-for="item in route.targets" :key="item.id" class="mx-1">
                <item-icon :title="item.name" :icon-class="item.icon" />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
export default {
  name: 'OceanFishingTimeTable',
  components: { ItemIcon },
  props: {
    routes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped></style>
