<template>
  <div>
    <v-form v-if="!hideFilters">
      <v-container>
        <v-row>
          <v-col cols="12" md="3" class="d-flex">
            <v-subheader>显示航班数</v-subheader>
            <v-text-field v-model="voyageN" type="number" solo />
          </v-col>
          <v-col cols="12" md="7" class="d-flex">
            <v-subheader>筛选条件</v-subheader>
            <v-autocomplete
              class="targetSelector"
              v-model="targets"
              :items="selectionOptions"
              color="blue-grey lighten-2"
              :placeholder="$t('oceanFishing.targetFilterPlaceholder')"
              item-text="name"
              item-value="id"
              :filter="filterOptions"
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
                  <v-icon class="mr-1">
                    {{ data.item.icon }}
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
            <colgroup>
              <col span="1" style="width: 15%;" />
              <col span="1" style="width: 20%;" />
              <col span="1" style="width: 25%;" />
              <col span="1" style="width: 40%;" />
            </colgroup>
            <thead>
              <tr>
                <th class="text-right">
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
                  <div class="d-flex justify-end">
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
                        :type="item.type"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <div>{{ voyage.name }}</div>
                    <v-icon>
                      {{ voyage.shiftIcon }}
                    </v-icon>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <div
                      v-for="(location, index) in voyage.voyageLocations"
                      :key="index"
                      class="d-flex align-center"
                    >
                      <v-icon v-if="index !== 0" color="grey">mdi-arrow-right</v-icon>
                      <div class="mx-1 d-flex align-center">
                        <span>{{ location.name }}</span>
                        <v-icon :title="location.hint">{{ location.icon }}</v-icon>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
import OceanFishingTimeTableMixin from '@/components/OceanFishingTimeTable/OceanFishingTimeTableMixin'
export default {
  name: 'OceanFishingTimeTableLarge',
  components: { ItemIcon },
  mixins: [OceanFishingTimeTableMixin],
}
</script>

<style scoped></style>
