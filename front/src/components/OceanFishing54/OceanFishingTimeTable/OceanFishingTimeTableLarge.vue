<template>
  <div>
    <v-form v-if="!hideFilters">
      <v-container>
        <v-row>
          <v-col cols="12" md="3" class="d-flex">
            <v-subheader>显示航班数</v-subheader>
            <rc-text-field v-model="voyageN" type="number" solo />
          </v-col>
          <v-col cols="12" md="7" class="d-flex">
            <v-subheader>筛选条件</v-subheader>
            <rc-autocomplete
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
            </rc-autocomplete>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-row>
      <v-col cols="12">
        <ocean-fishing-time-table-content-large
          :voyages="voyages"
          @onVoyageSelected="onVoyageSelected"
          :show-current-route-indicator="showCurrentRouteIndicator"
          :current-voyage-index="currentVoyageIndex"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
import OceanFishingTimeTableContentLarge from '@/components/OceanFishing54/OceanFishingTimeTable/OceanFishingTimeTableContentLarge'
import OceanFishingTimeTableMixin from '@/components/OceanFishing54/OceanFishingTimeTable/OceanFishingTimeTableMixin'
import RcAutocomplete from '@/components/basic/RcAutocomplete'
import RcTextField from '@/components/basic/RcTextField'

export default {
  name: 'OceanFishingTimeTableLarge',
  components: {
    OceanFishingTimeTableContentLarge,
    RcTextField,
    RcAutocomplete,
    ItemIcon,
  },
  mixins: [OceanFishingTimeTableMixin],
}
</script>

<style scoped></style>
