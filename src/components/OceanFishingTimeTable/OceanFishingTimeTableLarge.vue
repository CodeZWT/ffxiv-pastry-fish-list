<template>
  <div>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="3" class="d-flex">
            <v-subheader>显示航班数</v-subheader>
            <v-text-field v-model="voyageN" type="number" solo />
          </v-col>
          <v-col cols="12" md="6" class="d-flex">
            <v-subheader>筛选条件</v-subheader>
            <v-autocomplete
              class="targetSelector"
              v-model="targets"
              :items="selectionOptions"
              color="blue-grey lighten-2"
              placeholder="选择或搜索筛选条件"
              item-text="name"
              item-value="id"
              multiple
              clearable
              chips
              deletable-chips
              return-object
              solo
              attach=".targetSelector"
              @input="targetsChanged"
            >
              <!--          <template v-slot:selection="data">-->
              <!--            <div>-->
              <!--              {{ data }}-->
              <!--            </div>-->
              <!--          </template>-->
              <template v-slot:item="data">
                <template v-if="data.item.header">
                  <v-list-item-content v-text="data.item.header"></v-list-item-content>
                </template>
                <template v-else-if="data.item.type !== 'locationShift'">
                  <v-list-item-content>
                    <div class="d-flex align-center">
                      <item-icon
                        :title="data.item.name"
                        :icon-url="data.item.iconUrl"
                        :icon-class="data.item.icon"
                        :type="data.item.type"
                      />
                      <div>
                        {{ data.item.name }}
                      </div>
                    </div>
                    <!--                <v-list-item-title v-html="data.item.name"></v-list-item-title>-->
                    <!--                <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>-->
                  </v-list-item-content>
                </template>
                <div v-else class="d-flex align-center">
                  <v-icon large>
                    mdi-map
                  </v-icon>
                  <div>
                    {{ data.item.name }}
                  </div>
                </div>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-row>
      <v-col cols="12">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  登船登记时间（本地）
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
import _ from 'lodash'

export default {
  name: 'OceanFishingTimeTableLarge',
  components: { ItemIcon },
  props: {
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
    voyageNLazy: 13,
    targets: [],
  }),
  computed: {
    selectionOptions() {
      return this.targetOptions.flatMap((group, index) => {
        if (index) {
          return [{ divider: true }, { header: group.type }, ...group.options]
        } else {
          return [{ header: group.type }, ...group.options]
        }
      })
    },
    voyageN: {
      get() {
        return this.voyageNLazy
      },
      set(voyageN) {
        this.voyageNLazy = voyageN
        this.$nextTick(() => {
          let int = Math.floor(+voyageN)
          if (int < 1) int = 1
          else if (int > 100) int = 100
          this.voyageNLazy = int
          this.filterChanged(int, this.targets)
        })
      },
    },
  },
  methods: {
    targetsChanged(targets) {
      this.filterChanged(this.voyageN, targets)
    },
    // voyageNChanged(voyageN) {
    //   let int = +(+voyageN).toFixed(0)
    //   if (int < 1) int = 1
    //   else if (int > 100) int = 100
    //   this.voyageN = int
    //   this.filterChanged(this.voyageN, this.targets)
    // },
    filterChanged(voyageN, targets) {
      console.log(targets)
      this.$emit('filterChanged', {
        voyageN: voyageN,
        voyageTypes: _.uniq(targets.flatMap(it => it.voyageTypes)),
      })
    },
  },
}
</script>

<style scoped></style>
