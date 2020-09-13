<template>
  <div class="d-flex justify-center align-content-center">
    <v-col cols="6">
      <div class="d-flex" style="height: 100%; width: 100%; align-items: center; flex-direction: row">
        <div class="mr-1">
          <v-img :lazy-src="fisher" width="40" height="40" :src="fish.icon" />
        </div>
        <div class="text-subtitle-1" :title="fish.id">{{ fish.name }}</div>
      </div>
    </v-col>
    <v-col cols="6" style="display: flex; flex-direction: row; justify-content: space-around; align-items: center">
      <div class="text-subtitle-1">
        {{ fish.zone }}
      </div>
      <div v-if="fish.zone !== fish.fishingSpot" class="text-subtitle-1" :title="fish.fishingSpotId">
        {{ fish.fishingSpot }}
      </div>
    </v-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import fisher from '@/assets/fisher.png'

export default {
  name: 'FishListExpandedHeader',
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    weatherChangeTrigger: 0,
    fisher: fisher,
  }),
  computed: {
    fish() {
      return {
        id: this.value.id,
        icon: this.getItemIconUrl(this.value._id),
        name: this.getItemName(this.value._id),
        zone: this.getZoneName(this.value.location),
        fishingSpot: this.getFishingSpotsName(this.value.location),
        fishingSpotId: this.value.location,
      }
    },
    ...mapGetters(['getItemIconUrl', 'getItemName', 'getZoneName', 'getFishingSpotsName']),
  },
}
</script>

<style scoped></style>
