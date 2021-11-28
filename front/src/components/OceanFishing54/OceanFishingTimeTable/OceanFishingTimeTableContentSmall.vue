<template>
  <v-simple-table>
    <template v-slot:default>
      <colgroup>
        <col span="1" style="width: 40%" />
        <col span="1" style="width: 60%" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-right">登船登记时间<br />（本地）</th>
          <th class="text-left pl-5">目标</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(voyage, index) in voyages"
          :key="`${voyage.day}-${voyage.time}`"
          @click="
            onVoyageSelected({
              index,
            })
          "
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
                  :cover="item.cover"
                  :type="item.type"
                />
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
  name: 'OceanFishingTimeTableContentSmall',
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
