<template>
  <v-simple-table>
    <template v-slot:default>
      <colgroup>
        <col span="1" style="width: 15%" />
        <col span="1" style="width: 15%" />
        <col span="1" style="width: 20%" />
        <col span="1" style="width: 50%" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-right">登船登记时间（本地）</th>
          <th class="text-left pl-5">目标</th>
          <th class="text-left">航线</th>
          <th class="text-left">航线线路</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(voyage, index) in voyages"
          :key="`${voyage.day}-${voyage.time}`"
          @click="onVoyageSelected({ index })"
          style="cursor: pointer"
          :class="
            showCurrentRouteIndicator && currentVoyageIndex === index ? 'primary' : ''
          "
        >
          <td>
            <div class="d-flex align-center">
              <toggle-button
                :value="hasAlarm(voyage.id)"
                @input="setAlarm(voyage.id, $event)"
                checked-icon="mdi-bell"
                unchecked-icon="mdi-bell-outline"
                :checked-title="$t('actions.toBeNotifiedLocked.checked')"
                :unchecked-title="$t('actions.toBeNotifiedLocked.unchecked')"
              />
              <v-spacer />
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
                @click.stop="
                  onVoyageSelected({
                    index,
                    targetId: item.id,
                    targetType: item.type,
                  })
                "
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
</template>

<script>
import ItemIcon from '@/components/basic/ItemIcon'
import OceanFishingTimeTableContentMixin from '@/components/OceanFishing54/OceanFishingTimeTable/OceanFishingTimeTableContentMixin'
import ToggleButton from '@/components/basic/ToggleButton'

export default {
  name: 'OceanFishingTimeTableContentLarge',
  components: { ToggleButton, ItemIcon },
  mixins: [OceanFishingTimeTableContentMixin],
  props: {
    voyages: { type: Array, default: () => [] },
    showCurrentRouteIndicator: { type: Boolean, default: false },
    currentVoyageIndex: { type: Number, default: -1 },
  },
}
</script>

<style scoped></style>
