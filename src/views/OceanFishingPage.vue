<template>
  <v-container>
    <v-card>
      <v-card-title> 海钓航班时间表 {{ new Date(now) }} </v-card-title>
      <v-card-text>
        <div>
          {{ routes }}
        </div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  时间
                </th>
                <th class="text-left">
                  航班
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
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import OceanFishingUtil from '@/utils/OceanFishingUtil'
import DataUtil from '@/utils/DataUtil'
import { DateTime, FixedOffsetZone } from 'luxon'
import { mapGetters } from 'vuex'
import ItemIcon from '@/components/basic/ItemIcon'

export default {
  name: 'OceanFishingPage',
  components: { ItemIcon },
  props: ['now'],
  data() {
    return {}
  },
  computed: {
    routes() {
      return OceanFishingUtil.routesWithTipOf(this.now).map((routeWithTip, index) => {
        const showDay = index === 0 || getCNTime(routeWithTip.time).hour === 0
        const targets = routeWithTip.locationTips
          .map(locationTip => {
            // icon: this.getItemIconClass(fish._id),
            //   iconRemoteUrl: this.getItemIconUrl(fish._id),
            //   name: this.getItemName(fish._id),
            return {
              blueFish: this.assembleItem(locationTip.blueFish),
            }
          })
          .flatMap(it => {
            return [it.blueFish].filter(it => it)
          })
        return {
          showDay,
          simpleName: routeWithTip.routeSimpleName,
          day: DataUtil.formatDateTime(routeWithTip.time, 'MM-dd'),
          time: DataUtil.formatDateTime(routeWithTip.time, 'HH:mm'),
          shiftIcon: shift2Icon(routeWithTip.shift.type),
          name: routeWithTip.shift.name,
          targets: targets,
        }
      })
    },
    ...mapGetters(['getItemName', 'getItemIconClass']),
  },
  methods: {
    assembleItem(itemId) {
      return (
        itemId && {
          id: itemId,
          name: this.getItemName(itemId),
          icon: this.getItemIconClass(itemId),
        }
      )
    },
  },
}

function getCNTime(milliSeconds) {
  return DateTime.fromMillis(milliSeconds).setZone(FixedOffsetZone.instance(480))
}

function shift2Icon(shift) {
  const shiftIconDict = ['mdi-weather-sunny', 'mdi-weather-sunset', 'mdi-weather-night']
  return shiftIconDict[shift]
}
</script>

<style scoped></style>
