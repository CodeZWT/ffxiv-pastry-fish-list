<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="voyageN"
          label="显示条数"
          type="number"
          @input="filterChanged({ voyageN: $event })"
        />
      </v-col>
      <v-col cols="6">
        <div>{{ targetOptions }}</div>
        <v-select
          v-model="target"
          label="按条件筛选"
          :items="targetOptions"
          item-value="id"
          item-text="name"
          @input="filterChanged({ target: $event })"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  登船登记时间（本地）
                </th>
                <th class="text-left">
                  航线简称
                </th>
                <th class="text-left pl-5">
                  目标
                </th>
                <th class="text-left">
                  航线
                </th>
                <th class="text-left">
                  航线线路
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(voyage, index) in voyages" :key="index">
                <td>
                  <div class="d-flex">
                    <div :style="voyage.showDay ? '' : 'visibility: hidden'">
                      {{ voyage.day }}
                    </div>
                    <div class="ml-1">{{ voyage.time }}</div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <div>
                      {{ voyage.simpleName }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <div
                      v-for="item in voyage.targets"
                      :key="item.id"
                      :style="item.type === 'item' ? 'padding-top: 4px' : ''"
                    >
                      <item-icon
                        :title="item.name"
                        :icon-url="item.iconUrl"
                        :icon-class="item.icon"
                        :cover="item.cover"
                        :type="item.type"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <div>{{ voyage.name }}航线</div>
                    <v-icon>
                      {{ voyage.shiftIcon }}
                    </v-icon>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <div
                      v-for="(name, index) in voyage.voyageLocations"
                      :key="index"
                      class="mx-1"
                    >
                      {{ name }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </div></template
>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
export default {
  name: 'OceanFishingTimeTableLarge',
  components: { ItemIcon },
  props: {
    target: {
      type: Number,
      default: undefined,
    },
    voyages: {
      type: Array,
      default: () => [],
    },
    targetOptions: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    voyageN: 13,
  }),
  methods: {
    filterChanged(update) {
      this.$emit('filterChanged', {
        target: this.target,
        voyageN: this.voyageN,
        ...update,
      })
    },
  },
}
</script>

<style scoped></style>
